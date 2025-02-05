import React from 'react'

const useTheme = () => {
    // Theme colors
    const colorVar = 5;
    const [baseThemeColor, setBaseThemeColor] = useState('#e127de');
    const [colors, setColors] = useState(new Values(baseThemeColor).all(colorVar));
    const [styleColors, setStyleColors] = useState({})
    const [effectChange, setEffectChange] = useState(false)

    const [openSettings, setOpenSettings] = useState(false);
    const settingsBtn = useRef(null);
    const inputRef = useRef(null);
    const sortUlRef = useRef(null);
    const todoTagRef = useRef([]);


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

    const elClass = (e, checkClass) => e.target.className.includes(checkClass);
    const elStyle = e => e.target.style

    const inputHover = (e, type) => {

        const elStyle_ = elStyle(e);

        if(elClass(e, 'sort_type')) {
            type === 'mouse-in' ?
                elStyle_.color = styleColors.sorttypehov:
                elStyle_.color = styleColors.opacitycolor;
            elStyle_.color = styleColors.sorttypehov;
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
        elStyle_.color = 'grey';
    }

    const addBtnHover = (e, type)=> {
        const elStyle_ = elStyle(e);
        type === "mouse-in" ? elStyle_.background = styleColors.opacitycolor : elStyle_.background = styleColors.faintcolor;
        }

    return {changeThemeColor, handleColorChange, inputFocus, inputHover, sortBoxMouseOut, addBtnHover}
}

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

  return {themeHandler}
}

export default useTheme