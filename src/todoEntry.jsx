import React, {useState, useEffect} from 'react';
import {FaEdit, FaTrash, FaClock, FaTimes} from 'react-icons/fa';
import { Temporal } from 'temporal-polyfill';


const todoEntry = ({todo, toggleCheck, deleteTodo, editTodo, changeRange, saveTodoAlarm, toggleAlarmBox, changeAlarmTime, alarmTime, addressExpiredAlarm}) => {
    const [alarmTimeAway, setAlarmTimeAway] = useState('');
    const [alarmNotif, setAlarmNotif] = useState(false);

    const {name, id, complete, order, alarm} = todo;

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

                console.log(timeAwayString)

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
    }, [alarm, addressExpiredAlarm])

    useEffect(()=> {
        activeAlarm && setAlarmNotif(false);
    }, [saveTodoAlarm, activeAlarm])

    //Notification toggling
    const rmNotificatn = (e, id)=> {
        if(alarmNotif) {
            return addressExpiredAlarm(id);
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

  return (
        <section key={id} className='todo_wrapper'>
            <div className= 'todo_render' >
                <article onMouseOver={(e)=>  toggleAlarmBox (e, 'close')} className= {`todo_tagname ${activeAlarm && 'shrink'}`}>
                    <input className ='todo_check' type='checkbox' id = {id} checked= {complete} onChange ={(e)=> {toggleCheck(e, id)}}/>
                    <label className= {`todo_item ${complete && 'dim'} `} onMouseOver={remTimeAway} onMouseLeave={addTimeAway}>{name}</label>
                </article> 
                <div className='alarmtime_away'> 
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
                <div className='todo_btns'>
                    {!complete && <button className='tool_btn' onClick={()=>{editTodo(id)}}> <FaEdit className='edit'/></button>}
                    {!complete && <button className='tool_btn' id = {id} onClick={(e)=> toggleAlarmBox(e, 'open')}> <FaClock className= {`edit ${(activeAlarm) && 'active_alarm'} `}/></button>}
                    {!complete && <button className='tool_btn imp_range'>
                        <input  type='range' value={order} className= 'order_range' onChange={(e)=>changeRange(e, id)}/>
                    </button>}
                    <button className= 'tool_btn' onClick={()=>{deleteTodo(id)}}><FaTrash className='trash'/></button> 
                    <div className="alarm_box" id={id}>
                        <button className="close_btn" id = {id} onClick={(e)=> toggleAlarmBox(e, 'close')}><FaTimes/></button>
                        <form className='alarm_form' onSubmit={(e)=> saveTodoAlarm(e, id)}>
                            {(activeAlarm) ? <label className='alarmactive_time'>{alarm && alarm.time}</label> :
                            <input type='time' id = {id} value ={(alarm && alarm.time)} onChange={changeAlarmTime}/>}
                            <button type ='submit' className={`alarm_set ${(activeAlarm) && 'cancel_style'}`} id= {id}>{activeAlarm ? 'cancel' : 'set'} </button>
                        </form>
                    </div>
                </div>  
            </div>
            <hr className='line' onMouseOver={(e)=>  toggleAlarmBox (e, 'close')}></hr>
        </section>
    );
}

export default todoEntry