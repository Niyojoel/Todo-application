import React from 'react';
import './todo.css'
import {FaEdit, FaTrash, FaSearch, FaClock,FaCog, FaAngleDown, FaAngleUp, FaTimes} from 'react-icons/fa';
import useTodo from './useTodo';


function Todoapp() {

    const {styleColors, baseThemeColor, todoList, sortTypes, activeSortType, sortBox, todoRender, inputRef, todoRenderRef, alert, date, time, editing, footerBtns, searchFound, sortUlRef, effectChange, settingsBtn, openSettings,alarmActiveBtnText, setOpenSettings, setSortBox, todoToolsControls, todoAlarmControls, sortTodoControls, themeHandler} = useTodo();

    const {addTodo, toggleCheck, editTodo, deleteTodo, changeRange, emptyAll, activeTodos, deleteComp, initSearch} = todoToolsControls()

    const {changeThemeColor, handleColorChange, inputHoverStyle, inputFocusStyle, mouseOut, sortBoxMouseOut, addBtnHover, rmAddBtnHover} = themeHandler()
    
    const {persistSortBox, hideSortBox, chooseSortType} = sortTodoControls();
    
    const {changeAlarmTime, saveTodoAlarm, toggleAlarmBox} = todoAlarmControls()

    const searchEntrance = todoList.length > 4;

    return (
        <main className ='container' style={{background: styleColors.contbcg, borderRight: `1px inset ${styleColors.lightpurple}`, borderLeft: `1px inset ${styleColors.inputborderpurple}`}}>
                {openSettings && <section className='settings_bcg'>
                    <div className='settings_box' style = {{borderBottom: `1px solid ${styleColors.inputborderpurple}`}}>
                        <div className='theme'>
                            <label className='colorchange_label' htmlFor='color'> Change Theme Color</label>
                            <div className='color_change'>
                                <button className = 'color_box'>
                                    <input type="color" id='color' value ={baseThemeColor} onChange = {handleColorChange}/>
                                </button>
                                {effectChange && <button type='button' onClick ={changeThemeColor}className='changecolor_btn'>Change</button>}
                            </div>
                        </div>
                    </div>
                </section>}
            <section className="heading" onMouseOver={(e)=> toggleAlarmBox (e, 'close')} style = {{background: `linear-gradient(to left, ${styleColors.lightpurple}, ${styleColors.midpurple}`}}>
                <div className='header_content'>
                    <h3>Todo Application</h3>
                    <button type = 'button' className='settings_btn' ref = {settingsBtn} onClick = {()=> setOpenSettings(!openSettings)}><FaCog/></button>
                </div>
            </section> 

            {/* <section className='colorShades'>
                {colors.map(col => {
                    return <div className = 'color_arr' style = {{background: `rgb(${col.rgb.join(',')})`}} key = {col.index} ></div>
                })}
            </section> */}
            
            <section className='time_date'>
                <div className='todays_date'> {date.replace(date.slice(-4), '')} </div>
                <div className='time'>{time.slice(0, 2)} {time.slice(2)}</div>
            </section>

            <div className='content_box' onMouseOver={()=> setOpenSettings(false)}>
                <h2 className='note' onMouseOver={(e)=> {
                    hideSortBox;
                    toggleAlarmBox (e, 'close')}
                }> {todoList.length > 0 ? `* You have ${activeTodos.length} todos to complete on your list of ${todoList.length}`: 'Your todo list is empty'}</h2>
                <p className = {`alert ${alert.display && 'show'} alert_${alert.comment}`}> {alert.msg || 'comment'} </p>
                <div className= {`input_forms ${searchEntrance && 'realign'}`} onMouseOver={(e)=> {
                    hideSortBox;
                    toggleAlarmBox (e, 'close')}
                }>
                    <form className='todo_adding'>
                        <input type= 'text' autoFocus='on' placeholder ='Enter a todo item' ref ={inputRef} onMouseOver= {inputHoverStyle} onMouseDown= {inputFocusStyle} onMouseLeave = {mouseOut} className={`add_input ${alert.comment === 'fail' && 'error'}`}/>
                        <button type='submit' className= "add_btn" style = {{background: styleColors.faintpurple}} onMouseOver = {addBtnHover} onMouseOut= {rmAddBtnHover} onClick ={addTodo}>{editing.status ? 'Edit' : 'Add todo'}</button>
                    </form>
                    
                    
                    <button className= {`input_box ${searchEntrance && 'input_active'}`}onMouseOver={(e)=> toggleAlarmBox (e, 'close')}>
                        <input type='text' placeholder= {`Search todo`} onChange={initSearch} onClick={initSearch} onMouseOver= {inputHoverStyle} onMouseDown = {inputFocusStyle} onMouseOut= {mouseOut} className= {`search_input`}/>
                        <span className='search_icon' style = {{color: styleColors.opacitypurple}}><FaSearch/></span>
                    </button>
                </div>

                {todoList.length > 2 && <div className='sortings' onMouseOver={(e)=> toggleAlarmBox (e, 'close')}> 
                    <span onMouseOver={hideSortBox}> sort by : </span>
                    <button onClick ={()=>setSortBox(!sortBox)} type = 'button' className='sort_type' style={{color: styleColors.opacitypurple}} onMouseOver= {inputHoverStyle} onMouseOut= {mouseOut} onMouseDown= {inputFocusStyle}>{activeSortType}{sortBox ? <FaAngleDown/> : <FaAngleUp/>}</button>
                    
                    <ul className= {`sort_box ${sortBox && 'sorting_active'}`}
                    style={{borderTop: `1px solid ${styleColors.opacitypurple}`,borderBottom: `1px solid ${styleColors.opacitypurple}`}} onMouseOver={persistSortBox} ref={sortUlRef}>
                    {sortTypes.map((sort, index)=> {
                        return <li key = {index} style = {{borderBottom: `1px solid ${styleColors.opacitypurple}`,borderLeft: sort === 'Time added' ? '2px solid rgba(141, 24, 139, 0.7)' : 'transparent'}}>
                            <button type = 'button' onClick={(e)=> chooseSortType(e, sort)} className={`sort_type ${sort === 'Time added' && 'curr_sortType'}`} style={{color: sort === 'Time added' ? styleColors.sorttypehov : 'grey'}} onMouseOver= {inputHoverStyle} onMouseOut= {sortBoxMouseOut} onMouseDown= {inputFocusStyle}>{sort}</button>
                        </li>
                    })}
                    </ul>
                </div>}
                <section className={`${todoRender.length > 0 ? 'todo_list todo_pad': 'todo_list'}`} style = {{borderRight: `2px inset ${styleColors.lightpurple}`, borderLeft: `2px inset ${styleColors.opacitypurple}`}} onMouseOver={hideSortBox} ref={todoRenderRef}>
                    {todoRender && todoRender.map((todo) => {
                        return <div key={todo.id}>
                            <Todo key = {todo.id} todo ={todo} toggleCheck ={toggleCheck} deleteTodo ={deleteTodo} editTodo ={editTodo} changeRange={changeRange} toggleAlarmBox = {toggleAlarmBox}saveTodoAlarm = {saveTodoAlarm}changeAlarmTime ={changeAlarmTime}
                            alarmActiveBtnText={alarmActiveBtnText}/>
                        </div>
                    })}
                </section>
                {searchFound === 'none' && <p> Keyword does not match...</p>}
                <footer>
                    {footerBtns &&
                    <div className= {`wrapper ${todoList.length - activeTodos.length > 0 && 'wrapper_align'}`}>
                        <button className={`dltcomp_btn ${todoList.length - activeTodos.length > 0 && 'visible'}`} onClick ={deleteComp} style={{background: styleColors.faintpurple}} onMouseOver= {inputHoverStyle} onMouseOut= {mouseOut} onMouseDown= {inputFocusStyle}> Delete Completed </button>
                        <button className={`empty_btn ${todoList.length > 0 && 'visible'}`} onClick ={emptyAll}style={{background: styleColors.faintpurple}} onMouseOver= {inputHoverStyle} onMouseOut= {mouseOut} onMouseDown= {inputFocusStyle}> Empty list </button>
                    </div>
                    }
                </footer>
            </div>
        </main>
    )
}

const Todo = ({todo, toggleCheck, deleteTodo, editTodo, changeRange, saveTodoAlarm, toggleAlarmBox, changeAlarmTime, alarmActiveBtnText}) => {
    const {name, id, complete, order, alarm} = todo;

    const remTimeAway = (e)=> {
        const alarmtime_away = e.target.parentElement.nextSibling;
        alarmtime_away.classList.add('hidetime_away');
        e.target.parentElement.classList.remove('shrink')
        e.target.parentElement.classList.add('wraptext')
    }

    const addTimeAway = (e)=> {
        const alarmtime_away = e.target.parentElement.nextSibling;
        setTimeout(()=> {
            alarmtime_away.classList.remove('hidetime_away');
        }, 3000)
        e.target.parentElement.classList.add('shrink')
        e.target.parentElement.classList.remove('wraptext')
    }

    return (
        <section key={id} className='todo_wrapper'>
            <div className= 'todo_render' >
                <article onMouseOver={(e)=>  toggleAlarmBox (e, 'close')} className= {`todo_tagname ${(alarm && alarm.active === true) && 'shrink'}`}>
                    <input className ='todo_check' type='checkbox' id = {id} checked= {complete} onChange ={(e)=> {toggleCheck(e, id)}}/>
                    <label className= {`todo_item ${complete && 'dim'}`} onMouseEnter={remTimeAway} onMouseLeave={addTimeAway}>{name}</label>
                </article> 
                <div className='alarmtime_away'> {(alarm && alarm.active === true) && 'in 4 hours time'}</div>
                <div className='todo_btns'>
                    {!complete && <button className='tool_btn' onClick={()=>{editTodo(id)}}> <FaEdit className='edit'/></button>}
                    {!complete && <button className='tool_btn' id = {id} onClick={(e)=> toggleAlarmBox(e, 'open')}> <FaClock className= {`edit ${(alarm && alarm.active === true) && 'active_alarm'} `}/></button>}
                    {!complete && <button className='tool_btn imp_range'>
                        <input  type='range' defaultValue={order} className= 'order_range' onChange={(e)=>changeRange(e, id)}/>
                    </button>}
                    <button className= 'tool_btn' onClick={()=>{deleteTodo(id)}}><FaTrash className='trash'/></button> 
                    <div className="alarm_box" id={id}>
                        <button className="close_btn" id = {id} onClick={(e)=> toggleAlarmBox(e, 'close')}><FaTimes/></button>
                        <form className='alarm_form' onSubmit={(e)=> saveTodoAlarm(e, id)}>
                            {(alarm && alarm.active === true) ? <label className='alarmactive_time'>{alarm && alarm.time}</label> :
                            <input type='time' id = {id} value ={(alarm && alarm.time)} onChange={changeAlarmTime}/>}
                            <button type ='submit' className={`alarm_set ${(alarm && alarm.active === true) && 'cancel_style'}`} id= {id}>{alarm && alarm.active === true ? 'cancel' : 'set'} </button>
                        </form>
                    </div>
                </div>  
            </div>
            <hr className='line' onMouseOver={(e)=>  toggleAlarmBox (e, 'close')}></hr>
        </section>
            
    );
}
export default Todoapp;
