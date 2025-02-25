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
    const TodaysDate = new Date().toLocaleDateString([], {dateStyle:'full'})
    const [date, setDate] = useState(TodaysDate.replace(TodaysDate.slice(-4)).endsWith(',') ? TodaysDate.replace(TodaysDate.slice(-6)) : TodaysDate.replace(TodaysDate.slice(-5), ''))
    const [time, setTime] = useState('');
    const [openSettings, setOpenSettings] = useState(false);
    const settingsBtn = useRef(null);
    const inputRef = useRef(null);
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

        const inputHoverStyle = (e)=> {
            if(e.target.className.includes('sort_type')) {
                e.target.style.color = styleColors.sorttypehov;
            }else if (e.target.className.includes('dltcomp_btn') || e.target.className.includes('empty_btn')) {
                e.target.style.background = styleColors.opacitycolor
            }else {
                e.target.style.border = `1px solid ${styleColors.inputbordercolor}` 
            }
        }

        const inputFocusStyle = (e)=> {
            if(e.target.className.includes('sort_type')) {
                e.target.style.color = styleColors.sorttypehov;
            }else if(e.target.className.includes('add_input')){
                e.target.style.border = `1px solid white`
                e.target.style.background = styleColors.faintcolor;
            }else if(e.target.className.includes('search_input')){
                e.target.style.background = styleColors.faintcolor;
                e.target.style.border = `1px solid white`;
            }
        }

        const mouseOut = (e)=> {
            if(e.target.className.includes('sort_type')) {
                e.target.style.color = styleColors.sortsetthov;
            }else if (e.target.className.includes('dltcomp_btn') || e.target.className.includes('empty_btn')) {
                e.target.style.background = styleColors.faintcolor
            }else {
            e.target.style.border = `transparent`;
            e.target.style.background = `white`;
            }
        }

        const sortBoxMouseOut = (e)=> {
            e.target.style.color = 'grey';
        }

        const addBtnHover = (e)=> {
            e.target.style.background = styleColors.opacitycolor;
        }

        const rmAddBtnHover = (e)=> {
            e.target.style.background = styleColors.faintcolor;
        }

        return {changeThemeColor, handleColorChange,inputHoverStyle, inputFocusStyle, mouseOut, sortBoxMouseOut, addBtnHover, rmAddBtnHover}
    }

    function todoToolsControls () {
        const alertControl = (display=false, msg='', comment='')=> {
                setAlert({display, msg, comment})
        }
    
        const addTodo =(event)=> {
            event.preventDefault(); 
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
    
        const toggleCheck = (e, id)=> {
            const todos = [...todoList];
            let toggledTodo = todos.find(todo=> todo.id === id);
            toggledTodo= {...toggledTodo, complete:!toggledTodo.complete};
    
            const filtTodos = todos.filter(todo => {return todo.id !==id})
            e.target.nextSibling.style.fontWeight = '400';
            if (toggledTodo.complete) {
                setTodoList(()=> {return [...filtTodos, toggledTodo]})
                // sortTypeEffect(activeSortType, todoList)
            } else {
                setTodoList(()=> {return sortTypeEffect(activeSortType, [toggledTodo, ...filtTodos])})
                // sortTypeEffect(activeSortType, todoRender)
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
    
        const changeRange=(e, id)=> {
            const todo_render = e.target.parentElement.parentElement.parentElement.children[0].children[1];
            let range; 
            // debugger
            const orderedList= todoList.map((todo)=> {
                if (todo.id === id) {
                    todo.order = parseInt(e.target.value)
                    if(todo.order > 0) {
                        range = Math.ceil(todo.order/10)
                        todo_render.style.fontWeight = (range * 50) + 400; 
                    }else {
                        todo_render.style.fontWeight = '400'
                    }
                    return todo;
                }
                return todo;
            })
            setTodoList(orderedList); 
        }

        const todoOrderStyles = (todos)=> {
            const todosEl= Array.from(todoRenderRef.current.children)
            
            const todoLabel = todosEl.map((el)=> {
            return el.children[0].children[0].children[0].children[1];
            })

            todos.map((todo)=> {
                todoLabel.find((lab)=> {
                    if (lab.innerText === todo.name && !todo.complete){
                        const fontweight = ((todo.order)/10 * 50) + 400;   
                        lab.style.fontWeight = `${fontweight}`; 
                    }
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
            const lis = e.target.parentElement.parentElement.children;
            Array.from(lis).forEach((child)=> {
                child.style.borderLeft = 'none';
                Array.from (child.children).forEach((each)=> {
                    each.classList.remove ('curr_sortType');
                })
            })
            if (sortType === id) {
                e.target.classList.add('curr_sortType');
                e.target.parentElement.style.borderLeft = '2px solid rgba(141, 24, 139, 0.7)';
            }
        
            setSortBox(false);
            setTimeout(()=> {setTodoRender(sortTypeEffect(sortType))}, 1000);
            return sortType;
        }

        const sortTypeEffect = (type, todos = [...todoRender])=> {
            let reorderedTodos;
            if(type === 'Todo imp.') {
                reorderedTodos= [...todos.sort((a, b)=> b.order - a.order).sort((a,b)=> a.complete - b.complete)]
            }else if(type === 'Alp order') {
                reorderedTodos= [...todos.sort((a,b)=> a.name.localeCompare(b.name)).sort((a,b)=> a.complete - b.complete)]
            }else if (type === 'Time added') {
                reorderedTodos= [...todos.sort((a,b)=> b.id - a.id).sort((a,b)=> a.complete - b.complete)]
            }else if (type === 'Alarm time') {
                reorderedTodos= [...todos.sort((a,b)=> a.alarm.active - b.alarm.active).sort((a,b)=> a.alarm.time.localeCompare(b.alarm.time)).sort((a,b)=> a.complete - b.complete)]
            }
            return reorderedTodos
        }

        return {persistSortBox, hideSortBox, sortTypeEffect, chooseSortType}
    }

    function todoAlarmControls () {
        const toggleAlarmBox = (e, type)=> {
            const todoRenderUI = todoRenderRef.current.childNodes;
            const alarmConsoles = Array.from(todoRenderUI).map((comp)=> {
                let result;
                Array.from(comp.childNodes).map((child)=> {
                    result = child.childNodes[0].childNodes[2].childNodes[4];
                })
                return result;
            });

            const consolles = alarmConsoles.filter((consol)=> {
                if(consol !== 'undefined') {
                    return consol;
                }
            });

            return consolles.map((consol)=> {
                if(consol.id === e.currentTarget.id && type ==='open') {
                    consol.classList.add('show_alarmbox'); 
                }else if (consol.id !== e.currentTarget.id && consol.classList.value.includes('show_alarmbox')){
                    consol.classList.remove('show_alarmbox');
                }else if (consol.id === e.currentTarget.id && type === 'close') {
                    consol.classList.remove('show_alarmbox');
                }else if (consol.id !== e.currentTarget.id && type === 'close'){
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
        
        const addressExpiredAlarm = (id)=> {
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

        return {toggleAlarmBox, changeAlarmTime, saveTodoAlarm, checkAlarm, addressExpiredAlarm};
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
            contbcg : `rgb(${rgbColor(3)})`, //(3)
            opacitycontbcg: `rgba(${rgbColor(3)},0.6)`,
            midcolorgradient : `rgb(${rgbColor(19)})`,
            midcolor : `rgb(${rgbColor(23)})`,
            inputbordercolor : `rgba(${rgbColor(28)}, 0.4)`,
            opacitycolor: `rgba(${rgbColor(27)},0.3)`,
            lightcolor : `rgb(${rgbColor(9)})`, // (8,10,11)
            faintcolor: `rgba(${rgbColor(28)}, 0.1)`, // (6)
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

    return {colors, date, time, alarmTime, setColors, baseThemeColor, setBaseThemeColor, styleColors, colorVar, todoList, sortTypes, activeSortType, sortBox, setSortBox, effectChange, setEffectChange,openSettings, setOpenSettings, settingsBtn, todoRender, inputRef, todoRenderRef, alert, editing, footerBtns, searchFound, todoToolsControls, sortTodoControls, todoAlarmControls, themeHandler}
}

export default useTodo;