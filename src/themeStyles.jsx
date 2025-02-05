import useTodoContext from "./useTodoContext";

const themeStyles = ()=> {
  const {styleColors} = useTodoContext();

  console.log(styleColors)

  const styles = {
    container: {
      background: styleColors.contbcg,
      borderRight: `1px inset ${styleColors.lightcolor}`,
      borderLeft: `1px inset ${styleColors.inputbordercolor}`
    },
    settings_box: {
      borderBottom: `1px solid ${styleColors.inputbordercolor}`
    },
    heading: {
      background: `linear-gradient(to left, ${styleColors.midcolor}, ${styleColors.midcolorgradient}`
    },
    opacityColor: {
      color: styleColors.opacitycolor
    },
    sortBox: {
      borderTop: `1px solid ${styleColors.opacitycolor}`, 
      borderBottom: `1px solid ${styleColors.opacitycolor}`
    },
    sortBoxList: {
      borderBottom: `1px solid ${styleColors.opacitycolor}`
    },
    todoList: {
      borderRight: `2px inset ${styleColors.lightcolor}`, 
      borderLeft: `2px inset ${styleColors.opacitycolor}`
    },
    footerBtns: {background: styleColors.faintcolor}
  }

  return {styles};
};

export default themeStyles;
