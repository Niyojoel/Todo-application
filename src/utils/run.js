import { Temporal } from "temporal-polyfill";
import useTodo from "../useTodo";

const {
  styleColors,
  baseThemeColor,
  todoList,
  sortTypes,
  activeSortType,
  sortBox,
  todoRender,
  inputRef,
  todoRenderRef,
  alert,
  date,
  time,
  alarmTime,
  editing,
  footerBtns,
  searchFound,
  sortUlRef,
  effectChange,
  settingsBtn,
  openSettings,
  setOpenSettings,
  setSortBox,
  todoToolsControls,
  todoAlarmControls,
  sortTodoControls,
  themeHandler,
} = useTodo();



const currTime = alarmTime; //Temporal.Now.plainTimeISO();

const alarmTime = Temporal.PlainTime.from({
  hour: alarm.time.slice(0, 2),
  minute: alarm.time.slice(-2),
}).toString(); //to set alarmTime

const timeAway = currTime.until(alarmTime).round("minute").toString();

console.log(timeAway);
