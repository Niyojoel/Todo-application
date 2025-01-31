import React, {useState, useEffect} from 'react';
import {FaEdit, FaTrash, FaClock, FaTimes, FaAngleDown} from 'react-icons/fa';
import { Temporal } from 'temporal-polyfill';


const todoEntry = ({todo, toggleCheck, deleteTodo, editTodo, changeRange, saveTodoAlarm, toggleAlarmBox, changeAlarmTime, alarmTime, handleExpiredAlarm, todoTagRef, alarmConsolesRef, alarmBoxOpen, setAlarmBoxOpen, removeAlarmBox}) => {
    const [alarmTimeAway, setAlarmTimeAway] = useState('');
    const [alarmNotif, setAlarmNotif] = useState(false);
    const [todoToolsDropdown, setTodoToolsDropdown] = useState(false);
    // const [toolLabel, setToolLabel] = useState('');

    const {name, id, complete, order, alarm, index} = todo;

    const activeAlarm = alarm && alarm.active === true;

    //Removing alarmTimeAway on hover on todo tagname 
    const remTimeAway = (e)=> {
        const alarmtime_away = e.target.parentElement.nextSibling;
        alarmtime_away.classList.add('hidetime_away');
        e.currentTarget.parentElement.classList.remove('shrink');
        // e.currentTarget.parentElement.classList.add('wraptext')
    }

    //adding alarmTimeAway back
    const addTimeAway = (e)=> {
        const alarmtime_away = e.target.parentElement.nextSibling;
        const timeout = setTimeout(()=> {
        alarmtime_away.classList.remove('hidetime_away');
        return clearTimeout(timeout);
        }, 2000)
        e.currentTarget.parentElement.classList.remove('wraptext');
        e.currentTarget.parentElement.classList.add('shrink');
    }
    
    //setting alarmTimeAway
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

                // if(timeAwayString === 'p1d') {
                    
                // }

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
        activeAlarm && setAlarmNotif(false);
    }, [saveTodoAlarm, activeAlarm])

    //Notification toggling
    const rmNotificatn = (e, id)=> {
        if(alarmNotif) {
            return handleExpiredAlarm(id);
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

    // const showLabel = (e) => {
    //     setTimeout(() => {
    //         setToolLabel(e.target.value);
    //     }, 500);
    // }

    const alarmNotRmv = activeAlarm || alarmNotif === true;
    // console.
  return (
        <section key={id} className='todo_wrapper'>
            <div className= 'todo_render'>
                <article onMouseOver={()=>removeAlarmBox('close')} className= {`todo_tagname ${activeAlarm && 'shrink'}`}>
                    <input className ='todo_check' type='checkbox' id = {id} checked= {complete} onChange ={()=> {toggleCheck(id, index)}}/>
                    <label className= {`todo_item ${complete && 'dim'} `} onMouseOver={remTimeAway} onMouseLeave={addTimeAway} ref={(el) => (todoTagRef.current[index] = el)}>{name}</label>
                </article> 
                <div className='alarmtime_away' onMouseOver={()=> removeAlarmBox('close')}> 
                    <span className='notif_content'>
                        <p className = {`notificatn_text ${alarmNotif && 'timeout'}`}> 
                        {activeAlarm && alarmTimeAway}
                        {alarmNotif && 'alarm timed out'}
                        </p>
                        <button type ='button' onClick={(e)=>rmNotificatn(e, id)} className='rmAlarmNotificatnBtn'>
                            {alarmNotRmv && <FaTimes/>}
                        </button> 
                    </span>
                </div>
                <div className="tools_extension">
                    <button className='dots_btn' onMouseOver={()=> setTodoToolsDropdown(true)} onMouseOut={()=> setTodoToolsDropdown(false)}>...</button>

                    <div className={`todo_btns ${todoToolsDropdown && 'dropdown'}`} onMouseOver={()=> {
                        setTodoToolsDropdown(true);
                        removeAlarmBox('close')
                    }} onMouseOut={()=> setTodoToolsDropdown(false)}>
                        {!complete && <button className={todoToolsDropdown ? 'tool_btn tool_btn-show' : "tool_btn"} onClick={()=>{editTodo(id)}}> 
                            <FaEdit className='edit'/> 
                            <span className='tool_label'>edit</span>
                        </button>}
                        {!complete && <button className={todoToolsDropdown ? 'tool_btn tool_btn-show' : "tool_btn"} id = {id} onClick={(e)=> {
                            toggleAlarmBox('open', e);
                            setAlarmBoxOpen(true);
                            setTodoToolsDropdown(false);
                        }}> 
                            <FaClock className= {`edit ${(activeAlarm) && 'active_alarm'} `}/> 
                            <span className='tool_label'>alarm</span>
                        </button>}
                        {!complete && <button className={todoToolsDropdown ? 'tool_btn imp_range tool_btn-show' : "tool_btn imp_range"}>
                            <input  type='range' value={order} className= 'order_range' onChange={(e)=>changeRange(e, id, index)}/>
                            <span className='tool_label'>order</span>
                        </button>}
                        <button className={todoToolsDropdown ? 'tool_btn tool_btn-show' : "tool_btn"} onClick={()=>{deleteTodo(id)}}>
                            <FaTrash className='trash'/>
                            <span className='tool_label'>delete</span>
                        </button> 
                    </div> 
                    <div className="alarm_box" id={id} ref={(el) => (alarmConsolesRef.current[index] = el)}>
                        <button className="close_btn" id = {id} onClick={(e)=> {
                            toggleAlarmBox('close', e);
                            setAlarmBoxOpen(false);
                        }}>
                            <FaTimes/>
                        </button>
                        <form className='alarm_form' onSubmit={(e)=> saveTodoAlarm(e, id)}>
                            {(activeAlarm) ? <label className='alarmactive_time'>{alarm && alarm.time}</label> :
                            <input type='time' id = {id} value ={(alarm && alarm.time)} onChange={changeAlarmTime}/>}
                            <button type ='submit' className={`alarm_set ${(activeAlarm) && 'cancel_style'}`} id= {id}>{activeAlarm ? 'cancel' : 'set'} </button>
                        </form>
                    </div>
                </div> 
            </div>
            <hr className='line' onMouseOver={()=>removeAlarmBox('close')}></hr>
        </section>
    );
}

export default todoEntry