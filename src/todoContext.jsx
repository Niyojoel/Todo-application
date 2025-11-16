import { arrayMove } from '@dnd-kit/sortable';
import {useRef, useState, useEffect, createContext, useContext} from 'react';
import Values from 'values.js';

const TodoContext = createContext(null);
export const TodoProvider = ({children}) => {
    const isMounted = useRef(false);

    const alarmSounds = [
        {
            id: 1,
            file: "./father's_advice.mp3",
            active: true,
        },
        {
            id: 2,
            file: "./piano.mp3",
            active: false,
        },
        {
            id: 3,
            file: "./real_love.mp3",
            active: false,
        },

    ]

    const sortTypesArray = [
        {
            type : 'Time added',
            active: true,
        },
        {
            type :'Todo order',
            active: false,
        }, 
        {
            type: 'Alarm time',
            active: false,
        }, 
        {
            type: 'Alp order',
            active: false,
        },
        {
            type: 'Drag sort',
            active: false,
        }
    ];

    // Theme colors
    const colorVar = 5;
    const [baseThemeColor, setBaseThemeColor] = useState('#e127de');
    const [colors, setColors] = useState(new Values(baseThemeColor).all(colorVar));
    const [styleColors, setStyleColors] = useState({})
    const [effectChange, setEffectChange] = useState(false)

    //Todos vars
    const [todoList, setTodoList] = useState([])
    const [alert, setAlert] = useState({display: false, msg: '', comment: ''});
    const [editing, setEditing] = useState({status: false, editID: null});
    
    //UI elements
    const [todoRender, setTodoRender] = useState([]);
    const TodaysDate = new Date().toLocaleDateString([], {day:'numeric',  month: window.innerWidth < 650 ? 'short' : 'long', weekday:'short'})
    const [date, setDate] = useState(TodaysDate)
    const [time, setTime] = useState('');
    const [openSettings, setOpenSettings] = useState(false);
    const [searchFound, setSearchFound] = useState(null);
    const settingsBtn = useRef(null);
    const inputRef = useRef(null);
    const sortUlRef = useRef(null);
    const todoTagRef = useRef([]);
    const alarmConsolesRef = useRef([]);
    const todosConsoleRef = useRef(null);
    const [footerBtns, setFooterBtns] = useState(true);
    
    //sortings
    const [sortBox, setSortBox] = useState(false);
    const [activeSortType, setActiveSortType] = useState('')
    const [sortTypes, setSortTypes] = useState(sortTypesArray)
    const [dragSort, setDragSort] = useState([])
    const [savedDragSort, setSavedDragSort] = useState([])
    

    //Alarm reminder
    const [alarmTime, setAlarmTime] = useState('');
    const [alarmBoxOpen, setAlarmBoxOpen] = useState(false)
    // const [playTune, setPlayTune] = useState(false);
    const [activeTune, setActiveTune] = useState('');
    const [alarmTunes, setAlarmTunes] = useState(alarmSounds);
    const [newTune, setNewTune] = useState([])
    const alarmAudioRef = useRef([]);


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

        return {changeThemeColor, handleColorChange}
    }
  
    function inputThemeStyles () {
         //Theme styles for input elements
        const elClass = (e, checkClass) => e.target.className.includes(checkClass);
        const elStyle = e => e.target.style

        const inputHover = (e, type) => {

            const elStyle_ = elStyle(e);

            if(elClass(e, 'sort_type')) {
                type === 'mouse-in' ?
                    e.target.innerText !== activeSortType ? 
                        elStyle_.color = '#444' : elStyle_.color = styleColors.sorttypehov :
                    elStyle_.color = styleColors.opacitycolor;
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
            if(e.target.innerText !== activeSortType) {
                elStyle_.color = 'grey';
            }
        }

        const addBtnHover = (e, type)=> {
            const elStyle_ = elStyle(e);
            type === "mouse-in" ? elStyle_.background = styleColors.opacitycolor : elStyle_.background = styleColors.faintcolor;
        }

         return {inputFocus, inputHover, sortBoxMouseOut, addBtnHover}
    }

    function cssComplimentaryStyles (todoToRender) {
    
        //styling for last todo 
        let  consolesRef;
        if(todosConsoleRef.current !== null) {
            consolesRef = todosConsoleRef?.current;
        }

        let consolesTodos;
        if(consolesRef?.children && consolesRef.children.length) {
            consolesTodos = consolesRef?.children;
            const todosEl= Array.from(consolesTodos)
            
            //updating all but the last todo items with hr
            const todoHrLines = todosEl.map((el)=> {
                return el.children[0].children[1];
            })

            if(todoHrLines && todoHrLines.length) {
                todoHrLines.forEach((line, index) => {
                    if(index === todoToRender.length - 1) {
                        line.style.visible = 'hidden';
                        line.style.opacity = '0';
                    }
                    else {
                        line.style.visibiliy = 'visible';
                        line.style.opacity = '1';
                    };
                });
            } 

            //styling for last todo btns
            const todoBtns = todosEl.map((el)=> {
                return el.children[0].children[0].children[1].children[1];
            })

            let lastTodoBtns;

            if(todoBtns?.length) {
                lastTodoBtns = todoBtns[todoBtns.length - 1];
            } 

            if(lastTodoBtns && window.innerWidth < 650) {
                // lastTodoBtns.style.top = '50%'
                lastTodoBtns.style.borderBottom = '3px solid white';
            };
        }
        return;
    };

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
                let todoItem = {name: tagName, id: new Date().getTime().toString(), complete: false, order: 0, alarm: {time: '12:00', active: 'false', expired: false}};
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
            let consolesRef;
            if(todosConsoleRef.current !== null) {
                consolesRef = todosConsoleRef?.current;
            }
            
            let consolesTodos;
            if(consolesRef?.children && consolesRef.children.length) {
                consolesTodos = consolesRef?.children;
                const todosEl= Array.from(consolesTodos);

                const todoLabel = todosEl.map((el)=> {
                return el.children[0].children[0].children[0].children[0].children[1];
                })

                todos.map((todo)=> {
                    return todoLabel.find((lab)=> {
                        if (lab.innerText === todo.name && !todo.complete){
                            const fontweight = ((todo.order)/10 * 50) + 400;   
                            return lab.style.fontWeight = `${fontweight}`; 
                        }
                    })
                })
            }

            // return;
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
                if(foundTodos.length) {
                    setTodoRender(foundTodos);
                    setFooterBtns(false);
                    setSearchFound(true)
                }else{
                    setTodoRender([]);
                    setSearchFound(false)
                }
            }else { 
                setTodoRender(todoList);
                setFooterBtns(true);
            }
        }

        const handleDragEnd = (event) => {
            const {active, over} = event;

            console.log(active, over)

            const getTodoPosition = (id) => {
                return todoList.findIndex(todo => todo.id === id)
            }

            if(active.id === over.id) return;

            setTodoList(todos => {
                const initialPosition = getTodoPosition(active.id);
                const currentPosition = getTodoPosition(over.id)

                const dragSortTodoList = arrayMove(todos, initialPosition, currentPosition);
                setDragSort(dragSortTodoList);
                return dragSortTodoList
            })
            
            setSortTypes(sorts => {
                return sorts.map(sort => {
                    if(sort.type === 'Drag sort') return {...sort, active: true};
                    return {...sort, active: false};
                })
            })
        }

        return {
            alertControl, 
            addTodo, 
            toggleCheck, 
            editTodo, 
            deleteTodo, 
            changeRange, 
            emptyAll, 
            activeTodos, 
            deleteComp, 
            initSearch, 
            handleDragEnd,
            todoOrderStyles
        }
    }

    function sortTodoControls () {

        const sortBoxState = (status) => {
            status === 'hide' ? setSortBox(false) : setSortBox(true);
        } 
        
        const chooseSortType = (e, id)=> {

            setSortTypes(sortTypes => {
                return sortTypes.map(sort => {
                    if(sort.type === id) {
                        return {...sort, active: true}
                    }
                    return {...sort, active: false};
                })
            })

            const sortType = e.target.innerText;

            const sortList = sortUlRef.current.children;

            Array.from(sortList).forEach((child)=> {
                child.style.borderLeft = 'none';
                Array.from (child.children).forEach((each)=> {
                    each.classList.remove ('curr_sortType');
                })
            })
            if (sortType === id) {
                e.target.style.color = styleColors.sorttypehov;
                e.target.parentElement.style.borderLeft = `2px solid ${styleColors.midcolor}`;
            }
        
            setSortBox(false);
            setTimeout(()=> {setTodoRender(sortTypeEffect(sortType))}, 1000);
        }

        const sortTypeEffect = (type, todos = [...todoRender])=> {
             let reorderedTodos = type != 'Drag sort' ? 
             [...todos.sort((a, b)=> {
                if (type === 'Todo order') return b.order - a.order;

                if (type === 'Alp order') return a.name.localeCompare(b.name);
                if (type === 'Time added') return b.id - a.id;
                if (type === 'Alarm time') return a.alarm.time.localeCompare(b.alarm.time);
            }).sort((a,b) => a.complete - b.complete).sort((a, b) => type === 'Alarm time' && b.alarm.active.toString().localeCompare(a.alarm.active.toString()))] 
            : todos;

            return reorderedTodos
        }

        return {sortBoxState, sortTypeEffect, chooseSortType}
    }

    function todoAlarmControls () {

        const removeAlarmBox = (id = undefined) => {
            if(alarmBoxOpen) {
                const alarmConsoles = alarmConsolesRef.current || [];

                if(id) {
                    return alarmConsoles.find(consol => consol.getAttribute('id') === id).classList.remove('show_alarmbox');
                }else {
                    alarmConsoles.map(consol => consol.classList.remove('show_alarmbox'));
                }

                setAlarmBoxOpen(false);
            }
            return;
        }

        const openAlarmBox = (id) => {
            const alarmConsoles = alarmConsolesRef.current || [];

            alarmConsoles.map((consol)=> {
                if(consol?.getAttribute('id') === id) {
                    consol.classList.add('show_alarmbox'); 
                }else {
                    consol.classList.remove('show_alarmbox');
                }
                return consol;
            });

            setAlarmBoxOpen(true);
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

        const saveTodoAlarm = (e, id, index)=> {
            e.preventDefault();
            
            const todoAlarmList = [...todoList];
            
            const todoActiveAlarmList = todoAlarmList.map((todo)=> {
                if (todo.id === id) {
                    todo.alarm = {...todo.alarm, active: todo.alarm.active === true ? false : true};
                    alarmAudioRef.current[index].pause();
                    return todo;
                }
                return todo;
            })
            setTodoList(todoActiveAlarmList);
        }

        const checkAlarm = (alarmtime)=> {
            const todoAlarmList = [...todoList];
            let timeNow = 'false';

            const todoAlarmExecutedList = todoAlarmList.map((todo, index)=> {
                if (todo.alarm.active === true &&  todo.alarm.time === alarmtime) {
                    todo.alarm = {...todo.alarm, active: !todo.alarm.active, expired: true};
                    timeNow = 'true'
                    alarmAudioRef.current[index].currentTime = 0;
                    alarmAudioRef.current[index].play();
                    return todo;
                }
                return todo;
            });
            
            if(timeNow === 'true') setTodoList(todoAlarmExecutedList);
        }
        
        const handleExpiredAlarm = (id, index)=> {
            const todoList_ = [...todoList];
            const addressedList = todoList_.map((todo)=> {
                if (todo.id === id) {
                    todo.alarm = {time: '12:00', active: 'false'};
                    alarmAudioRef.current[index].pause();
                    return todo;
                }
                return todo;
            })
            setTodoList(addressedList);
        }

        return {
            openAlarmBox, 
            removeAlarmBox, 
            changeAlarmTime, 
            saveTodoAlarm, 
            checkAlarm, 
            handleExpiredAlarm
        };
    }

    function alarmTunesControl () {
        // *** handle tune not functional
        const handleNewTune = (files) => {
            console.log(files);
            Array.from(files).map((file)=> {
                const fileReader = new FileReader();
                // fileReader.readAsDataURL
                const fileRead = fileReader.onload((result) => {
                    console.log(result);
                    file.readAsDataURL(file);
                }) 
                return console.log(fileRead);
            })
            // console.log(files_);
            // setNewTune(files_)
        }

        // *** Upload tune not functional
        const uploadTune = () => {
            const existingTune = alarmTunes.find(tune => tune.name === newTune[0].name)
            if (existingTune === undefined) {
                setAlarmTunes(prev => ([...prev, ...newTune]));
                setNewTune([]);
            }
            return;
        }

        // *** Remove tune not functional
        const removeTune = (name) => {
            console.log(name);
            const tunes = [...alarmTunes]
            console.log(tunes);
            const updatedTunes = tunes.filter(tune => tune !== name)
            setAlarmTunes(updatedTunes);
        }

        const changeActiveTune = (id) => {
            if(activeTune.id !== id )
            {
                setAlarmTunes(tunes => {
                    return tunes.map(tune => {
                        if(tune.id === id) {
                            return {...tune, active: true};
                        } 
                        return {...tune, active: false};
                    })
                })
            }
            return;
        }

        return {handleNewTune, uploadTune, removeTune, changeActiveTune}
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
            midcolor : `rgb(${rgbColor(23)})`,
            midcolorgradient : `rgb(${rgbColor(20)})`,
            inputbordercolor : `rgba(${rgbColor(28)}, 0.4)`,
            opacitycolor: `rgba(${rgbColor(27)},0.3)`,
            lightcolor : `rgb(${rgbColor(9)})`, // (8,10,11)
            faintcolor: `rgba(${rgbColor(28)}, 0.1)`, // (6)
            sortsetthov: `rgb(${rgbColor(15)})`, // (12, 8)
            sorttypehov: `rgb(${rgbColor(28)})`, // (29)
            cogcolor: `rgb(${rgbColor(30)})`, // (29)
        }
        setStyleColors(choiceColors)
    }, [colors])

    // Setting Icon toggle
    useEffect(()=> {
        if(settingsBtn.current !== null) {
            if(openSettings) {
                settingsBtn.current.classList.add('settings_active');
                settingsBtn.current.style.color = styleColors.cogcolor;
            }else {
                settingsBtn.current.classList.remove('settings_active');
                settingsBtn.current.style.color = 'white';
            } 
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
        const storedTodo = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
        if (storedTodo)  {
            setBaseThemeColor(storedTodo.baseThemeColor)
            setColors(new Values(storedTodo.baseThemeColor).all(colorVar))
            setTodoList(storedTodo.todoList);
            setSortTypes(storedTodo.sortTypes)
            setDragSort(storedTodo.userDragSortTodoList?.length ? storedTodo.userDragSortTodoList : storedTodo.todoList);
            setAlarmTunes(storedTodo.tunes);
            setActiveSortType(storedTodo.sortTypes?.find(sort => sort.active)?.type);
        };
    }, [])
    
    useEffect(()=> {
        // console.log(dragSort);
        // console.log(activeSortType);
        // console.log(sortTypes);
        setSavedDragSort(dragSort)
    }, [dragSort]);

    //SortType changes effect and active sort type change
    useEffect (()=> {
        setActiveSortType(sortTypes?.find(sort => sort.active)?.type);
        sortTypeEffect(sortTypes?.find(sort => sort.active)?.type, todoList);
    }, [sortTypes, todoList]);

    //Setting Alarm active tune
    useEffect (()=> {
        setActiveTune(alarmTunes?.find(tune => tune.active));
    }, [alarmTunes])
    
    //Saving to local storage
    useEffect (()=> {
        const todosInfo = {
            todoList: todoList, 
            sortTypes: sortTypes,
            userDragSortTodoList: dragSort, 
            baseThemeColor: baseThemeColor, 
            tunes: alarmTunes,
        }
        isMounted.current ? localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todosInfo)): isMounted.current = true;
    }, [todoList, sortTypes, dragSort, baseThemeColor, alarmTunes])

    //Synching TodoRender with TodoList on change
    useEffect (()=> {
        setTodoRender(todoList);
    }, [todoList])
    
    //Styles and order effect on TodoRender change
    useEffect (()=> {
        const effectTimeout = setTimeout(() => {
            todoOrderStyles(todoRender);
            cssComplimentaryStyles(todoRender);
        }, 1000);

        return ()=> clearInterval(effectTimeout);
    }, [todoRender])

    useEffect(()=> {
        const alertTimer = setTimeout(()=> {
            alertControl();
            alert.comment !=='fail';
        }, 2000)
        return ()=> clearInterval(alertTimer);
    },[todoList, addTodo])

    return <TodoContext.Provider value={{colors, date, time, alarmTime, setColors, baseThemeColor, setBaseThemeColor, styleColors, colorVar, todoList, sortTypes, activeSortType, sortBox, setSortBox, effectChange, setEffectChange,openSettings, setOpenSettings, settingsBtn, todoRender, inputRef, todosConsoleRef, alert, editing, footerBtns, searchFound,todoToolsControls, sortTodoControls, todoAlarmControls, themeHandler, inputThemeStyles, todoTagRef, sortUlRef, alarmConsolesRef, alarmTunes, setAlarmTunes, newTune, alarmTunesControl, alarmAudioRef, setActiveTune, activeTune}}>
        {children}
    </TodoContext.Provider>
}

export const useTodoContext = () => {
    const value = useContext(TodoContext);
    if(value == null) throw Error ("Cannot use outside of TodoProvider");

    return value;
}