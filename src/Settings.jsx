import React, { useEffect } from 'react'
import {useTodoContext} from './todoContext'
import { FaBookmark, FaDotCircle, FaTimes } from 'react-icons/fa';

const Settings = () => {
    const {themeHandler,  effectChange, baseThemeColor, alarmTunes, openSettings, setOpenSettings, styleColors, newTune, setNewTune, alarmTunesControl, activeTune, setActiveTune} = useTodoContext();

    const {handleColorChange, changeThemeColor} = themeHandler();
    const {handleNewTune, uploadTune, removeTune} = alarmTunesControl();

    useEffect(()=> {
        // console.log(alarmTunes);
    },[])
    
  return (
     <section className={openSettings ? 'settings_bcg settings_open' : 'settings_bcg'}>
        <div className={openSettings ? 'settings_box set_box-show' : 'settings_box'} style = {{borderBottom: `1px solid ${styleColors.inputbordercolor}`}}>
            <div className='settings_div'>
                <p className='settings_head'> Theme Color </p>
                <div className='settings_content theme'>
                    <label className='label' htmlFor='color'> Choose Color </label>
                    <button className = 'color_box'>
                        <input type="color" id='color' value={baseThemeColor} onChange={handleColorChange}/>
                    </button>
                    {effectChange && <button type='button' onClick ={changeThemeColor} className='btn-settings'>Change</button>}
                </div>
            </div>
            <div className='settings_div'>
                <p className='settings_head'>Alarm Tunes</p>
                <div className="settings_content">
                    {<ul className="tuneList">
                        {alarmTunes.length > 0 && alarmTunes.map(tune => {
                            let name;
                            typeof(tune) === "object" ? name = tune.name : typeof(tune) === "string" ? name = tune.includes('./') ? tune.split('/')[1] : tune : name = "";
                            return (
                                <div key={name} className="tune" onClick={() => setActiveTune(activeTune !== tune && typeof(tune) === "string" && tune)}>
                                    <span className="tune_tag">
                                        <FaDotCircle size={12}/>
                                        <p>{name}</p>
                                    </span>
                                    <span className="tune_btns" >
                                        <button onClick={() => setActiveTune(activeTune !== tune && typeof(tune) === "string" && tune)}> {activeTune === tune ? <FaBookmark size={15}/> : <FaBookmark size={15} fill='#bbb'/>} </button>
                                        <button onClick={() => removeTune(name)}> <FaTimes size={15} fill='#bbb'/> </button>
                                    </span>
                                </div> 
                            )
                        })}
                    </ul>}
                    <div className="upload_tunes">
                        <label className='label' htmlFor='tune'> Add tunes</label>
                        <button className='tune_input'>
                            <input type='file' id='tune' onChange = {(e)=> handleNewTune(e.target.files)}/>
                            <span>Import files</span>
                        </button>
                        <p className= {newTune.length ? 'tune_prev tune_prev-show' : "tune_prev"}>
                            {newTune.map((tune) => (
                                <span key={tune.name}>{tune.name}</span>
                            ))}
                        </p>
                        <div className="upload_btns">
                            <button type='button' onClick ={uploadTune} className={newTune.length ? 'btn-settings btn-show' : 'btn-settings btn-hide'}>Add</button>
                            <button type='button' onClick ={()=> setNewTune([])} className={newTune.length ? 'btn-settings btn-show' : 'btn-settings btn-hide'}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="settings_overlay" onClick={() =>setOpenSettings(false)}>
        </div>
    </section>
  )
}

export default Settings