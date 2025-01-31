import {useRef, useState, useEffect} from 'react';
import Values from 'values.js';

const useTodo = () => {
    const isMounted = useRef(false);

    // Theme colors
    const colorVar = 5;
    const [baseThemeColor, setBaseThemeColor] = useState('#e127de');
    const [colors, setColors] = useState(new Values(baseThemeColor).all(colorVar));
    const [styleColors, setStyleColors] = useState({})
    const [effectChange, setEffectChange] = useState(false)

    //Todos vars
    const [todoList, setTodoList] = useState([])
    const [alert, setAlert] = useState({display:false, msg:'', comment:''});
    const [editing, setEditing] = useState({status: false, editID: null});
    
    //UI elements
    const [todoRender, setTodoRender] = useState([]);
    const TodaysDate = new Date().toLocaleDateString([], {
        day: "2-digit", 
        weekday:'short',
        month: window.innerWidth > 650 ? 'long' : 'short', 
    })
    const [date, setDate] = useState(TodaysDate)
    const [time, setTime] = useState('');
    const [openSettings, setOpenSettings] = useState(false);
    const settingsBtn = useRef(null);
    const inputRef = useRef(null);
    const sortUlRef = useRef(null);
    const todoTagRef = useRef([]);
    const alarmConsolesRef = useRef([]);
    const todoRenderRef = useRef(null);
    const [searchFound, setSearchFound] = useState('');
    const [footerBtns, setFooterBtns] = useState(true);
    
    //sortings
    const [sortBox, setSortBox] = useState(false);
    const [activeSortType, setActiveSortType] = useState('')
    const sortTypes = ['Time added', 'Todo imp.', 'Alarm time', 'Alp order'];

    //Alarm reminder
    const [alarmTime, setAlarmTime] = useState('');
    const [playTune, setPlayTune] = useState(false);
    

    function themeHandler () {
        const changeThemeColor = ()=> {
        setColors(new Values(baseThemeColor).all(colorVar))
        setEffectChange(false)
        setOpenSettings(false)
        }

        const handleColorChange = (e) => {
            setBaseThemeColor(e.target.value);
            setEffectChange(true);
        }
        
        const elClass = (e, checkClass) => e.target.className.includes(checkClass);
        const elStyle = e => e.target.style

        const inputHover = (e, type) => {

            const elStyle_ = elStyle(e);

            if(elClass(e, 'sort_type')) {
                elStyle_.color = styleColors.sorttypehov;
            }else if (elClass(e, 'dltcomp_btn') || elClass(e, 'empty_btn')) {
                type === 'mouse-in' ? 
                    elStyle_.background = styleColors.opacitycolor : 
                    elStyle_.background = styleColors.faintcolor;
            }
            else {
                type === 'mouse-in' ? 
                    elStyle_.border = `1px solid ${styleColors.inputbordercolor}`: 
                    e.target.style = {border:`transparent`, background: `white`};
            }
        }

        const inputFocus = (e)=> {
            const elStyle_ = elStyle(e);
            if(elClass(e, 'sort_type')) {
                elStyle_.color = styleColors.sorttypehov;
            }else if(elClass(e, 'add_input') || elClass(e, 'search_input')){
                elStyle_.border = `1px solid white`
                elStyle_.background = styleColors.faintcolor;
            }
        }

        const sortBoxMouseOut = (e)=> {
            const elStyle_ = elStyle(e)
            elStyle_.color = 'grey';
        }

        const addBtnHover = (e, type)=> {
            const elStyle_ = elStyle(e);
            type === "mouse-in" ? elStyle_.background = styleColors.opacitycolor : elStyle_.background = styleColors.faintcolor;
        }

        return {changeThemeColor, handleColorChange, inputHover, inputFocus, sortBoxMouseOut, addBtnHover}
    }

    function todoToolsControls () {
        const alertControl = (display=false, msg='', comment='')=> {
                setAlert({display, msg, comment})
        }
    
        const addTodo =(e)=> {
            e.preventDefault(); 
            console.log("added");
            const tagName = inputRef.current.value;
            if(!tagName) {
                alertControl(true, 'pls enter some value', 'fail')
            }else if (tagName && editing.status) {
                let editedList = todoList.map((todo)=> {
                    if(todo.id === editing.editID) {
                        return {...todo, name: tagName};
                    }
                    return todo;
                })
                setTodoList(editedList);
                setEditing({status: false, editID: null});
                alertControl(true, 'todo edited', 'success');
            }else {
                alertControl(true, 'todo added', 'success');
                let todoItem = {name: tagName, id: new Date().getTime().toString(), complete: false, order: 0, alarm: {time: '12:00', active: 'false'}};
                todoList.length > 2 ? setTodoList (sortTypeEffect(activeSortType, [todoItem, ...todoList])) : setTodoList ([todoItem, ...todoList])
            };
            
            inputRef.current.value = '';
            inputRef.current.focus();
        }
    
        const toggleCheck = (id, i)=> {
            const todos = [...todoList];
            let toggledTodo = todos.find(todo=> todo.id === id);
            toggledTodo= {...toggledTodo, complete:!toggledTodo.complete};
    
            const filtTodos = todos.filter(todo => {return todo.id !==id})
            todoTagRef.current[i].style.fontWeight = '400';
            if (toggledTodo.complete) {
                setTodoList(()=> {return [...filtTodos, toggledTodo]})
            } else {
                setTodoList(()=> {return sortTypeEffect(activeSortType, [toggledTodo, ...filtTodos])})
            } 
        }

        const editTodo = (id)=> {
            setEditing({status: true, editID: id});
            const editedTodo = todoList.find((todo)=>todo.id === id);
            inputRef.current.value = editedTodo.name;
        }
        
        const deleteTodo = (id)=> {
            const savedTodos = todoList.filter(todo=> todo.id !== id)
            setTodoList(savedTodos);
            alertControl(true, 'A todo item removed', 'success')
        }
    
        const changeRange=(e, id, i)=> {
            const tagNameStyle = todoTagRef.current[i].style;
            let range; 
            // debugger
            const orderedList= todoList.map((todo)=> {
                if (todo.id === id) {
                    todo.order = parseInt(e.target.value)
                    if(todo.order > 0) {
                        range = Math.ceil(todo.order/10)
                       tagNameStyle.fontWeight = (range * 50) + 400; 
                    }else {
                        tagNameStyle.fontWeight = '400'
                    }
                    return todo;
                }
                return todo;
            })
            setTodoList(orderedList); 
        }

        const todoOrderStyles = (todos)=> {
            const todoLabel = todoTagRef.current || []

            todos.map((todo)=> {
                todoLabel?.find((lab)=> {
                    if (lab.innerText && lab.innerText === todo.name && !todo.complete){
                        const fontweight = ((todo.order)/10 * 50) + 400;   
                        lab.style.fontWeight = `${fontweight}`; 
                    }
                    return;
                })
            })
        }
    
        const emptyAll = ()=> {
            alertControl(true, 'Todo list emptied', 'success')
            setTodoList([]);
        }

        const activeTodos = todoList.filter(todo => todo.complete === false)
        
        const deleteComp =()=> { 
            alertControl(true, 'Completed todos removed', 'success')
            setTodoList(activeTodos);
        }
    
        const initSearch =(e)=> {
            e.target.nextSibling.classList.add('active_search')
            const dupList = [...todoList];
            if(e.target.value) {
                const foundTodos = dupList.filter((list)=>
                list.name.toLowerCase().includes(e.target.value.toLowerCase()));
                if(foundTodos) {
                    setTodoRender(foundTodos);
                    setFooterBtns(false);
                    setSearchFound('found');
                }
                if (foundTodos.length === 0){
                    setTodoRender([]);
                    return setSearchFound('none');
                }
            }else { 
                setTodoRender(todoList);
                setFooterBtns(true);
    
            }
        }
    return {alertControl, addTodo, toggleCheck, editTodo, deleteTodo, changeRange, emptyAll, activeTodos, deleteComp, initSearch, todoOrderStyles}
    }

    function sortTodoControls () {
        const persistSortBox = ()=> {
            setSortBox(true);
        }
    
        const hideSortBox = ()=> {
            setSortBox(false)
        }
        
        const chooseSortType = (e, id)=> {
            const sortType = e.target.innerText;
            setActiveSortType(sortType);
            const sortList = sortUlRef.current.children;
            console.log(sortList);
            Array.from(sortList).forEach((child)=> {
                child.style.borderLeft = 'none';
                Array.from(child.children).forEach((each)=> {
                    each.classList.remove('curr_sortType');
                })
            })
            if (sortType === id) {
                e.target.style.color = `${styleColors.midcolor} !important`;
                e.target.parentElement.style.borderLeft = `3px solid ${styleColors.midcolor}`;
            }
        
            setSortBox(false);
            setTimeout(()=> {setTodoRender(sortTypeEffect(sortType))}, 1000);
            return sortType;
        }

        const sortTypeEffect = (type, todos = [...todoRender])=> {

            let reorderedTodos = [...todos.sort((a, b)=>{
                if(type === 'Todo imp.') return b.order - a.order;
                if(type === 'Alp order') return a.name.localeCompare(b.name);
                if (type === 'Time added') return b.id - a.id;
                if (type === 'Alarm time') return a.alarm.time.localeCompare(b.alarm.time);
            }).sort((a,b)=> a.complete - b.complete)];
    
            return reorderedTodos
        }

        return {persistSortBox, hideSortBox, sortTypeEffect, chooseSortType}
    }

    function todoAlarmControls () {
        const toggleAlarmBox = (type, e = undefined)=> {
            console.log(type);
            const alarmConsoles = alarmConsolesRef.current || [];

            if(e === undefined) {
                return type === 'close' && 
                alarmConsoles.map(consol => consol.classList.remove('show_alarmbox'));
            }

            return alarmConsoles.map((consol)=> {
                if(consol.id === e.currentTarget?.id && type ==='open') {
                    consol.classList.add('show_alarmbox'); 
                }else {
                    consol.classList.remove('show_alarmbox');
                }
                return consol;
            });
        }

        const changeAlarmTime = (e)=> {
           const todoAlarmTimeEdit = todoList.map((todo)=> {
            if(e.target.id === todo.id){
                todo.alarm = {...todo.alarm, time:e.target.value};
                return todo;
            }
            return todo;
           })
           setTodoList(todoAlarmTimeEdit);
        }

        const saveTodoAlarm = (e, id)=> {
            e.preventDefault();
            const todoAlarmList = [...todoList];
    
            const todoActiveAlarmList = todoAlarmList.map((todo)=> {
                if (todo.id === id) {
                    todo.alarm = {...todo.alarm, active: !todo.alarm.active};
                    return todo;
                }
                return todo;
            })
            setTodoList(todoActiveAlarmList);
        }

        //helper function
        const timeForTodo = (moment, latestTodo)=> {
            setTodoList(latestTodo);
            let alarmTune = new Audio('./piano.mp3');
            alarmTune.loop = false;
            
        
            if(moment === 'true') {
                alarmTune.play();
                console.log(alarmTune)
                return;
            }else
            console.log("stop playing");
            alarmTune.pause();
            alarmTune.currentTime = 0;
        }

        const checkAlarm = (alarmtime)=> {
            const todoAlarmList = [...todoList];
            let timeNow = 'false';
            const todoAlarmExecutedList = todoAlarmList.map((todo)=> {
                if (todo.alarm.active === true &&  todo.alarm.time === alarmtime) {
                    todo.alarm = {...todo.alarm, active: !todo.alarm.active, expired: true};
                    timeNow = 'true'
                    return todo;
                }
                return todo;
            });
            
            timeNow === 'true' && timeForTodo(timeNow, todoAlarmExecutedList);
        }
        
        const handleExpiredAlarm = (id)=> {
            const todoList_ = [...todoList];
            const addressedList = todoList_.map((todo)=> {
                if (todo.id === id) {
                    todo.alarm = {time: '12:00', active: 'false'};
                    return todo;
                }
                return todo;
            })
            timeForTodo ("false", addressedList);
            // setTodoList(addressedList);
        }

        return {toggleAlarmBox, changeAlarmTime, saveTodoAlarm, checkAlarm, handleExpiredAlarm};
    }

    const {addTodo, alertControl, todoOrderStyles} = todoToolsControls()

    const {sortTypeEffect} = sortTodoControls()

    const {checkAlarm} = todoAlarmControls()


    //---------------BELONG IN THE TODOAPP ----------------------------

    //Theme change
    useEffect(()=> {
        const rgbColor = (num)=> {
            return colors[num].rgb.join(',');
        }
        const choiceColors = {
            contbcg : `rgb(${rgbColor(4)})`, //(3)
            opacitycontbcg: `rgba(${rgbColor(3)},0.6)`,
            midpurple : `rgb(${rgbColor(23)})`,
            inputborderpurple : `rgba(${rgbColor(28)}, 0.4)`,
            opacitypurple: `rgba(${rgbColor(27)},0.3)`,
            lightpurple : `rgb(${rgbColor(9)})`, // (8,10,11)
            faintpurple: `rgba(${rgbColor(28)}, 0.1)`, // (6)
            sortsetthov: `rgb(${rgbColor(15)})`, // (12, 8)
            sorttypehov: `rgb(${rgbColor(28)})`, // (29)
        }
        setStyleColors(choiceColors)
    }, [colors])

    // Setting Icon toggle
    useEffect(()=> {
        if(openSettings) {
            settingsBtn.current.classList.add('settings_active');
            settingsBtn.current.style.color = styleColors.sortsetthov;
        }else {
            settingsBtn.current.classList.remove('settings_active');
            settingsBtn.current.style.color = 'white';
        } 
    }, [openSettings, styleColors])

    const LOCAL_STORAGE_KEY ='Todos';

    //------------------------------------------------------------------


    // Date tracking
    useEffect(()=> {
        setDate(date)
    }, [date]);

    //Time and alarm tracking
    useEffect(()=> {
        const currTime =(hc) => {
            return new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hourCycle: hc});
        } 
        const timeUpdate = setInterval(()=> {
            setAlarmTime(currTime('h24'));
            checkAlarm(alarmTime);
            setTime(currTime('h12'));
        }, 1000)
        return ()=> clearInterval(timeUpdate);
    },[time])
    
    // Getting local storage on initial load
    useEffect (()=> {
        const recalledTodo = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
        if (recalledTodo)  {
            setTodoList(recalledTodo.todoList);
            setActiveSortType(recalledTodo.activeSortType ? recalledTodo.activeSortType : 'Time added');  
            sortTypeEffect(recalledTodo.activeSortType, recalledTodo.todoList);         
            setBaseThemeColor(recalledTodo.baseThemeColor)
            setColors(new Values(recalledTodo.baseThemeColor).all(colorVar))
        };
    }, [])
    
    //Saving to local storage
    useEffect (()=> {
        const todosInfo = {todoList: todoList, activeSortType: activeSortType, baseThemeColor: baseThemeColor}
        isMounted.current ? localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todosInfo)): isMounted.current = true;
        setTodoRender(todosInfo.todoList);        
    }, [todoList, activeSortType, baseThemeColor])
    
    //Style and order effect
    useEffect (()=> {
        todoOrderStyles(todoRender);
        sortTypeEffect(activeSortType, todoRender);
    }, [todoRender])

    //Alert 
    useEffect(()=> {
        const alertTimer = setTimeout(()=> {
            alertControl();
            alert.comment !=='fail';
        }, 2000)
        return ()=> clearInterval(alertTimer);
    },[todoList, addTodo])

    return {colors, date, time, alarmTime, setColors, baseThemeColor, setBaseThemeColor, styleColors, colorVar, todoList, sortTypes, activeSortType, sortBox, setSortBox, sortUlRef, effectChange, setEffectChange, openSettings, setOpenSettings, settingsBtn, todoRender, inputRef, todoRenderRef, alert, editing, footerBtns, searchFound, todoToolsControls, sortTodoControls, todoAlarmControls, themeHandler, todoTagRef, alarmConsolesRef}
}

export default useTodo;