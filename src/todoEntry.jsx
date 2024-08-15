import React, {useState, useEffect} from 'react';
import {FaEdit, FaTrash, FaClock, FaTimes} from 'react-icons/fa';


const todoEntry = ({todo, toggleCheck, deleteTodo, editTodo, changeRange, saveTodoAlarm, toggleAlarmBox, changeAlarmTime, alarmTime}) => {
    const [alarmTimeAway, setAlarmTimeAway] = useState('');

    const {name, id, complete, order, alarm} = todo;

    const activeAlarm = alarm && alarm.active === true;


    const remTimeAway = (e)=> {
        const alarmtime_away = e.target.parentElement.nextSibling;
        alarmtime_away.classList.add('hidetime_away');
        e.currentTarget.parentElement.classList.remove('shrink');
        // e.currentTarget.parentElement.classList.add('wraptext')
    }

    const addTimeAway = (e)=> {
        const alarmtime_away = e.target.parentElement.nextSibling;
        const timeout = setTimeout(()=> {
        alarmtime_away.classList.remove('hidetime_away');
        return clearTimeout(timeout);
        }, 2000)
        e.currentTarget.parentElement.classList.remove('wraptext');
        e.currentTarget.parentElement.classList.add('shrink');
    }

    useEffect(()=> {
        let alarmTimeReader;
        if(alarm.active === true) {
            let remTime;
            //checking for mins on both times less than 10
            const minsFormatter = (mins)=> {
                if (mins ==='01' || mins ==='02'|| mins ==='03'|| mins ==='04'|| mins ==='05'|| mins ==='06'|| mins ==='07'|| mins ==='08'|| mins ==='09') {
                    return mins = 10;
                }
                return mins;
            }
            
            //if the minutes on alarm time is less than that on clock time
            const timeAwayFormatter = (mins1, hrs1, mins2)=> {
                if(mins1 < mins2) {
                    hrs1--;
                    mins1+= 60;
                }
                return remTime = parseFloat(`${hrs1}.${mins1}`);
            }
            
            const alrmTime = parseFloat(`${alarmTime.slice(0,2)}.${minsFormatter(alarmTime.slice(-2))}`);
            
            let formattedTime = timeAwayFormatter(parseInt(minsFormatter(alarm.time.slice(-2))), parseInt(alarm.time.slice(0,2)), parseInt(minsFormatter(alarmTime.slice(-2))));
            let timeapart;
            if (formattedTime > alrmTime) {
                timeapart = (formattedTime - alrmTime).toFixed(2);
            }
            else if (formattedTime < alrmTime) {
                //for time apart from alarm time set for the following day
                timeapart = ((formattedTime += 24) - alrmTime).toFixed(2);
            }
            setAlarmTimeAway(`${timeapart !== undefined ? timeapart : '...'}`);
        }
    }, [alarm.time, alarmTime, saveTodoAlarm])

  return (
        <section key={id} className='todo_wrapper'>
            <div className= 'todo_render' >
                <article onMouseOver={(e)=>  toggleAlarmBox (e, 'close')} className= {`todo_tagname ${activeAlarm && 'shrink'}`}>
                    <input className ='todo_check' type='checkbox' id = {id} checked= {complete} onChange ={(e)=> {toggleCheck(e, id)}}/>
                    <label className= {`todo_item ${complete && 'dim'} `} onMouseOver={remTimeAway} onMouseLeave={addTimeAway}>{name}</label>
                </article> 
                <div className='alarmtime_away'> {activeAlarm && `in ${alarmTimeAway.replace('.', 'h ' ).concat('m')}`}</div>
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