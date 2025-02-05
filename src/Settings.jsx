import React, { useEffect } from 'react'
import {useTodoContext} from './todoContext'
import { FaBookmark, FaTimes } from 'react-icons/fa';

const Settings = () => {
    const {themeHandler,  effectChange, baseThemeColor, alarmTunes, setAlarmTunes, openSettings, setOpenSettings, styleColors, newTune, setNewTune, alarmTunesControl} = useTodoContext();

    const {handleColorChange, changeThemeColor} = themeHandler();
    const {handleNewTune, UploadTune, removeTune} = alarmTunesControl();

    useEffect(()=> {
        console.log(alarmTunes);
    },[alarmTunes])

  return (
     <section className={openSettings ? 'settings_bcg settings_open' : 'settings_bcg'}>
        <div className={openSettings ? 'settings_box set_box-show' : 'settings_box'} style = {{borderBottom: `1px solid ${styleColors.inputbordercolor}`}}>
            <div className='theme'>
                <label className='colorchange_label' htmlFor='color'> Theme Color</label>
                <div className='color_change'>
                    <button className = 'color_box'>
                        <input type="color" id='color' value={baseThemeColor} onChange={handleColorChange}/>
                    </button>
                    {effectChange && <button type='button' onClick = {changeThemeColor} className='btn-settings'>Change</button>}
                </div>
            </div>
            <div className='alarmtunes'>
                <div className="tunes">
                    <p className='tunes_head'>Alarm Tunes</p>
                    <ul className="tuneList">
                        {alarmTunes.length > 0 && alarmTunes.map(tune => (
                            <div key={tune.name} className="tune">
                                <p>{tune.name}</p>
                                <div className="tune_btns">
                                    <button> <FaBookmark size={15}/> </button>
                                    <button onClick={() => removeTune(tune.name)}> <FaTimes size={15} /> </button>
                                </div>
                            </div>
                        ))}
                    </ul>
                </div>
                <div className="upload_tunes">
                    <label className='alarm_tunes-label' htmlFor='tune'> Add tunes</label>
                    <button className='tune_input'>
                        <input type='file' id='tune' onChange = {(e)=> handleNewTune(e.target.files)}/>
                        <span>Import files</span>
                    </button>
                    <p className= {newTune.length ? 'tune_prev tune_prev-show' : "tune_prev"}>
                        {newTune.map(tune => (<span key={tune.name}>{tune.name}</span>))}
                    </p>
                    <div className="upload_btns">
                        <button type='button' onClick ={UploadTune}className={newTune.length ? 'btn-settings btn-show' : 'btn-settings btn-hide'}>Add</button>
                        <button type='button' onClick ={()=> setNewTune([])} className={newTune.length ? 'btn-settings btn-show' : 'btn-settings btn-hide'}>Cancel</button>
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