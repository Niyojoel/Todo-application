import React, { useEffect, useState } from 'react';
import './todo.css'
import Todo from './todoEntry';
import {FaSearch, FaCog, FaAngleDown, FaAngleUp} from 'react-icons/fa';
import {useTodoContext} from './todoContext';
import Settings from './Settings';

function Todoapp() {
    const {styleColors, todoList, sortTypes, activeSortType, sortBox, todoRender, inputRef, todosConsoleRef, alert, date, time, editing, footerBtns, searchFound, sortUlRef, settingsBtn, openSettings, setOpenSettings, setSortBox, todoToolsControls, todoAlarmControls, sortTodoControls, inputThemeStyles} = useTodoContext();

    const {addTodo, emptyAll, activeTodos, deleteComp, initSearch} = todoToolsControls()

    const {inputHover, inputFocus, sortBoxMouseOut, addBtnHover} = inputThemeStyles()
    
    const {sortBoxState, chooseSortType} = sortTodoControls();
    
    const {removeAlarmBox} = todoAlarmControls()

    const searchEntrance = todoList.length > 4;

    const mobileScreen = window.innerWidth < 650;

    const [extendSearch, setExtendSearch] = useState(mobileScreen ? false : true)

    const handleExtendSearch = () => {
        setExtendSearch(prev => !prev)
    }

    return (
        <main
            className ='container'
            style={{ background: styleColors.contbcg, borderRight: `1px inset ${styleColors.lightcolor}`, borderLeft: `1px inset ${styleColors.inputbordercolor}`}}
        >
            <Settings/>
            <section className="heading" onMouseOver={()=> removeAlarmBox()} style = {{background: `linear-gradient(to left, ${styleColors.midcolor}, ${styleColors.midcolorgradient}`}}>
                <div className='header_content'>
                    <h3>Todo Application</h3>
                    <button type = 'button' className='settings_btn' ref = {settingsBtn} onClick = {()=> setOpenSettings(!openSettings)}><FaCog/></button>
                </div>
            </section>
            <section className='time_date'>
                <div className='todays_date'> {date} </div>
                <div className='time'>{time.slice(0, 2)} {time.slice(2)}</div>
            </section>

            <div className='content_box' onMouseOver={()=> setOpenSettings(false)}>
                <h2 className='note' 
                    onMouseOver={()=> {
                    sortBoxState("hide");
                    removeAlarmBox()
                }}> 
                    {todoList.length > 0 ? `* You have ${activeTodos.length} /${todoList.length} todos to complete.` : 'Your todo list is empty'}
                </h2>

                <p className = {`alert ${alert.display && 'show'} alert_${alert.comment}`}> {alert.msg || 'comment'} </p>

                <div className= {`input_forms ${searchEntrance && 'realign'}`} onMouseOver={()=> {
                    sortBoxState('hide');
                    removeAlarmBox()
                }}>
                    <form className='todo_adding'>
                        <input
                            type= 'text'
                            autoFocus='on'
                            placeholder ='Enter a todo'
                            ref ={inputRef}
                            onMouseOver= {(e) => inputHover(e, "mouse-in")}
                            onMouseLeave = {(e) => inputHover(e, "mouse-out")}
                            onMouseDown= {inputFocus}
                            className={`add_input ${alert.comment === 'fail' && 'error'}`}
                        />
                        <button
                            type='submit'
                            className= "add_btn"
                            style = {{background: styleColors.faintcolor}}
                            onClick ={addTodo}
                            onMouseOver = {(e) => addBtnHover(e, 'mouse-in')}
                            onMouseOut={(e) => addBtnHover(e, 'mouse-out')}
                        >
                            {editing.status ? 'Edit' : 'Add'}
                        </button>
                    </form>

                    <button
                        className= {`input_box ${searchEntrance && 'input_active'} ${extendSearch && 'input_box-extend'}`}
                        onMouseOver={() => removeAlarmBox()}
                    >
                        <input
                            type='text'
                            placeholder={`Search`}
                            onChange={initSearch}
                            onMouseOver= {(e) => inputHover(e, "mouse-in")}
                            onMouseDown = {inputFocus}
                            onMouseOut= {(e) => inputHover(e, "mouse-out")}
                            className= {`search_input`}
                        />
                        <span
                            className='search_icon'
                            style ={{color: styleColors.opacitycolor}} onClick={handleExtendSearch}
                        >
                            <FaSearch/>
                        </span>
                    </button>
                </div>

                {todoList.length > 3 && <div className={ footerBtns ? "sortings" : "sortings sortings--noshow"} onMouseOver={() => removeAlarmBox()}> 
                    <span onMouseOver={()=>sortBoxState('hide')}> sort by : </span>
                    <button
                        onClick ={()=>setSortBox(!sortBox)}
                        type = 'button'
                        className='sort_type'
                    >
                        {activeSortType}
                        {sortBox ? <FaAngleUp/> : <FaAngleDown/>}
                    </button>
                    
                    <ul className= {`sort_box ${sortBox && 'sorting_active'}`}
                    style={{borderTop: `1px solid ${styleColors.opacitycolor}`, border: `1px solid ${styleColors.opacitycolor}`}} onMouseOver={()=>sortBoxState('persist')} ref={sortUlRef}>
                    {sortTypes.map((sort, index)=> {
                        return <li
                            key = {index}
                            className={sortBox ? 'sort_list show-sort_list' : 'sort_list'}
                            style = {{borderLeft: sort === activeSortType ?
                            `3px solid ${styleColors.midcolor}` : 'transparent'}}
                            >
                            <button
                                type = 'button'
                                onClick={(e)=> chooseSortType(e, sort)}
                                className={`sort_type ${sort === activeSortType && 'curr_sortType'}`}
                                style={{color: sort === activeSortType ? styleColors.sorttypehov : 'grey'}}
                                onMouseOver= {(e) => inputHover(e, "mouse-in")}
                                onMouseOut= {sortBoxMouseOut}
                                onMouseDown= {inputFocus}
                            >
                                {sort}
                        </button>
                        </li>
                    })}
                    </ul>
                </div>}
                <section className={`${todoRender.length > 0 ? 'todo_list todo_pad': 'todo_list'}`} style = {{borderRight: `2px inset ${styleColors.lightcolor}`, borderLeft: `2px inset ${styleColors.opacitycolor}`}} onMouseOver={()=>sortBoxState('hide')} >
                    <div className='todos_console' ref={todosConsoleRef}>                    
                        {todoRender && todoRender.map((todo, index) => {
                        return <div key={todo.id}>
                            <Todo
                                key = {todo.id}
                                todo ={{...todo, index}}
                            />
                        </div>
                    })}
                    </div>
                    <div className="search_not-found">
                        {searchFound === 'none' && <p> Keyword does not match...</p>}   
                    </div>
                </section>
                <footer>
                    {footerBtns &&
                    <div className= {`wrapper ${todoList.length - activeTodos.length > 0 && 'wrapper_align'}`}>
                        <button
                            className={`dltcomp_btn ${todoList.length - activeTodos.length > 0 && 'visible'}`}
                            style={{background: styleColors.faintcolor}}
                            onClick ={deleteComp}
                            onMouseOver= {(e) => inputHover(e, "mouse-in")}
                            onMouseOut= {(e) => inputHover(e, "mouse-out")}
                            onMouseDown= {inputFocus}
                        >
                            Delete Completed
                        </button>
                       <button
                            className={`empty_btn ${todoList.length > 0 && 'visible'}`}
                            style={{background: styleColors.faintcolor}}
                            onClick ={emptyAll}
                            onMouseOver= {(e) => inputHover(e, "mouse-in")}
                            onMouseOut= {(e) => inputHover(e, "mouse-out")}
                            onMouseDown= {inputFocus}
                        >
                            Empty list
                        </button>
                    </div>
                    }
                </footer>
            </div>
        </main>
    )
}
export default Todoapp;
