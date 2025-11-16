import React, {useState, useEffect} from 'react';
import {FaEdit, FaTrash, FaClock, FaTimes,} from 'react-icons/fa';
import { Temporal } from 'temporal-polyfill';
import { useTodoContext } from './todoContext';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';


const todoEntry = ({todo}) => {

    const {
        todoToolsControls, 
        alarmTime, 
        todoAlarmControls, 
        todoTagRef, 
        alarmConsolesRef, 
        alarmAudioRef,
        activeTune
    } = useTodoContext();

    const {
        changeAlarmTime, 
        saveTodoAlarm, 
        openAlarmBox, 
        removeAlarmBox,
        handleExpiredAlarm
    } = todoAlarmControls()

    const {
        toggleCheck, 
        editTodo, 
        deleteTodo, 
        changeRange
    } = todoToolsControls()


    const {name, id, complete, order, alarm, index} = todo;

    // const [toolLabel, setToolLabel] = useState('');
    const [alarmTimeAway, setAlarmTimeAway] = useState('');
    const [alarmNotif, setAlarmNotif] = useState(false);
    const [todoToolsDropdown, setTodoToolsDropdown] = useState(false);
    
    //Drag and Drop functionality
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id})

    const drag_n_drop_styles = {
        transition,
        transform:CSS.Translate.toString(transform)
    }

    let activeAlarm = alarm && alarm.active === true;

    //AlarmTimeAwayUI toggle on hover on todo tagname 
    const timeAwayUI = (e, type)=> {
        const parentElClasses = e.target.parentElement.parentElement.classList;
        const parentNextSibElClasses = e.target.parentElement.parentElement.nextSibling.classList;

        if(type === "add") {
            const timeout = setTimeout(()=> {
                parentNextSibElClasses.remove('hidetime_away');
                return clearTimeout(timeout);
            }, 2000);

            parentElClasses.remove('wraptext');
            parentElClasses.add('shrink');
            return;
        }else {
           parentNextSibElClasses.add('hidetime_away');
           parentElClasses.remove('shrink');
        }
    }
    
    //Setting alarmTimeAway
    useEffect(()=> {
        const timeAwayInt = setInterval (()=> {
            if(activeAlarm === true) {
                const currTime = Temporal.PlainTime.from({hour: alarmTime.slice(0,2), minute: alarmTime.slice(3,5)});

                const alarmTimeTemp = Temporal.PlainTime.from({hour: alarm.time.slice(0, 2), minute: alarm.time.slice(-2)}); 

                let timeAway 
                if(alarm.time > alarmTime) {
                    timeAway = currTime.until(alarmTimeTemp);
                }else {
                    timeAway = currTime.until(alarmTimeTemp).add({days: 1});
                }

                const timeAwayString = timeAway.round('second').toString().replace('PT', '').replace('H', 'H ').toLowerCase();

                setAlarmTimeAway(()=> {
                    return alarm.time !== alarmTime ? `in ${timeAwayString}` : "";
                });   
            }
            return clearInterval(timeAwayInt);
        }, 1000)
    }, [saveTodoAlarm, activeAlarm])

    useEffect(()=> {
        alarm.expired ? setAlarmNotif(true) : setAlarmNotif(false);
    }, [alarm, handleExpiredAlarm])
        
    useEffect(()=> {
        if(activeAlarm) {
            setAlarmNotif(false);
        }
    }, [saveTodoAlarm, activeAlarm])

    //Notification toggling
    const rmNotificatn = (e, id, index)=> {
        if(alarmNotif) {
            return handleExpiredAlarm(id, index);
        }
        const alarmAway = e.currentTarget.parentElement;
        alarmAway.style.opacity = '0';      
        alarmAway.style.pointerEvents = 'none';
        const alarmStyle = alarmAway.parentElement.style;
        if(!activeAlarm) {
            alarmStyle.style.opacity = '0';
        }else {
            alarmStyle.color = 'green';
            alarmStyle.fontSize = '1.2rem';
            alarmStyle.paddingBottom = '0.7rem';
        }
    }

    const alarmNotRmv = activeAlarm || alarmNotif === true;

    {/*const showLabel = (e) => {
         setTimeout(() => {
             setToolLabel(e.target.value);
         }, 500);
    }*/}

    const todoBtnsHover = () => {
        removeAlarmBox();
        setTodoToolsDropdown(true);
    }
    const openAlarmConsole = (id) => {
        openAlarmBox(id);
        setTodoToolsDropdown(false);
    }

  return (
        <section key={id} className='todo_wrapper' ref={setNodeRef} style={drag_n_drop_styles}>
            <div className= 'todo_render' >
                <div className="todo_draggable">
                    {/* todo tag */}
                    <article onMouseOver={()=>removeAlarmBox()} className= {`todo_tagname ${activeAlarm && 'shrink'}`}>
                        <input 
                            className ='todo_check' 
                            type='checkbox' 
                            id = {id} 
                            checked= {complete} 
                            onChange ={()=> {toggleCheck(id, index)}}
                        />
                        <div className="todo_item" {...listeners} {...attributes}>
                        <label 
                            className= {`todo_label ${complete && 'dim'} `} 
                            onMouseOver={(e)=> timeAwayUI(e, 'remove')} 
                            onMouseLeave={(e)=> timeAwayUI(e, 'add')} 
                            ref={(el) => (todoTagRef.current[index] = el)}
                        >
                            {name}
                        </label>
                        </div>
                    </article>

                    {/* Alarm time away */}
                    <div 
                        className='alarmtime_away' 
                        onMouseOver={()=>removeAlarmBox()}
                    >
                        <span className='notif_content'>
                            <p className = {`notificatn_text ${alarmNotif && 'timeout'}`}> 
                                {activeAlarm && alarmTimeAway}
                                {alarmNotif && "Time Up !!!"}
                            </p>
                            <button 
                                type ='button' 
                                onClick={(e)=> rmNotificatn(e, id, index)} 
                                className='rmAlarmNotificatnBtn'
                            >
                                {alarmNotRmv && <FaTimes/>}
                            </button> 
                        </span>
                    </div>
                </div>

                {/* todo tools */}
                <div className="todo_tools">
                    {/* extend button */}
                    <button 
                        className='tools_extend-btn' 
                        onMouseOver={()=> setTodoToolsDropdown(true)} 
                        onMouseOut={()=> setTodoToolsDropdown(false)}
                    >
                        ...
                    </button>

                    {/* todo tools btn */}
                    <div 
                        className={`tools_btns ${todoToolsDropdown && 'dropdown'}`} 
                        onMouseOver={todoBtnsHover} 
                        onMouseOut={()=> setTodoToolsDropdown(false)}
                    >
                        {/* edit */}
                        {!complete && <button 
                            className={todoToolsDropdown ? 'tool_btn tool_btn-show' : "tool_btn"} 
                            onClick={()=>{editTodo(id)}}
                        >
                            <span className='tool_icon'>
                                <FaEdit className='edit'/>
                            </span>
                            <span className='tool_label'>edit</span>
                        </button>}

                        {/* alarm */}
                        {!complete && <button 
                            className={todoToolsDropdown ? 'tool_btn tool_btn-show' : "tool_btn"} 
                            id = {id} 
                            onClick={()=>openAlarmConsole(id)}
                        >
                            <span className='tool_icon'>
                                <FaClock className= {`clock ${(activeAlarm) && 'active_alarm'} `}/>
                            </span>
                            <span className='tool_label'>alarm</span>
                        </button>}

                        {/* todo order */}
                        {!complete && <button className={todoToolsDropdown ? 'tool_btn imp_range tool_btn-show' : "tool_btn imp_range"}>
                            <span className='tool_icon'>
                                <input type='range' value={order} onChange={(e)=>changeRange(e, id, index)}/>
                            </span>
                            <span className='tool_label'>order</span>
                        </button>}

                        {/* delete */}
                        <button 
                            className={todoToolsDropdown ? 'tool_btn tool_btn-show' : "tool_btn"} 
                            onClick={()=>{deleteTodo(id)}}
                        >
                            <span className='tool_icon'>
                                <FaTrash className='trash'/>
                            </span>
                            <span className='tool_label'>delete</span>
                        </button>
                    </div>

                    {/* set alarm console */}
                    <div 
                        className="alarm_box" 
                        id={id}
                        ref={(el) => (alarmConsolesRef.current[index] = el)}
                    >
                        <button 
                            className="close_btn" 
                            id = {id} 
                            onClick={()=> removeAlarmBox(id)}
                        >
                            <FaTimes/>
                        </button>
                        <form 
                            className='alarm_form' 
                            onSubmit={(e)=> saveTodoAlarm(e, id, index)}
                        >
                            {(activeAlarm) ? <label className='alarmactive_time'>
                                {alarm && alarm.time}
                            </label> :
                            <input 
                                type='time' 
                                id = {id} 
                                value ={(alarm && alarm.time)} 
                                onChange={changeAlarmTime}
                            />}
                            <button 
                                type ='submit'
                                className={`alarm_set ${(activeAlarm) && 'cancel_style'}`} 
                                id= {id}
                            >
                                {activeAlarm ? 'cancel' : 'set'} 
                            </button>
                        </form>
                        <audio ref={el => (alarmAudioRef.current[index] = el)} preload='none' loop={false} hidden>
                            <source src={activeTune?.file}/>
                        </audio>
                    </div>
                </div>  

            </div>
            <hr className='line'  onMouseOver={()=>removeAlarmBox()}></hr>
        </section>
    );
}

export default todoEntry