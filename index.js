// 生成的text dom
let textNode;
// 计时器实例
let timer;
// 记数
let count = 0;
// 误差
let offset = 0;
// 开始时间
let startTime = 0;
// 节日数组
const dayArr = [
  {
    label: "劳动节",
    value: "04/28",
  },
  {
    label: "端午节",
    value: "06/21",
  },
  {
    label: "国庆节",
    value: "09/28",
  },
]
/**
 * 准备工作
 */
const init = () => {
  // 拿到顶部左区域的盒子
  const leftBar = document.querySelector(".system-bar-left")
  textNode = document.createElement("span")
  textNode.id = "mobai-time"
  leftBar.appendChild(textNode)
}

/**
 * 销毁组件
 */
const destroy = () => {
  // 拿到顶部左区域的盒子
  const leftBar = document.querySelector(".system-bar-left")
  leftBar.removeChild(textNode)
}

/**
 * 获取倒计时对象
 * @param {*} timeDiff 差异时间
 * @returns 
 */
const getDateObj = (timeDiff) => {
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  return {
    day: days,
    hour: hours,
    minute: minutes,
    second: seconds
  }
}

/**
 * 开始倒计时
 */
const start = () => {
  startTime = new Date().getTime()
  timer = setTimeout(doFunc, 1000)
}


const doFunc = () => {
  count++;
  // 当前时间date
  const nowDate = new Date()
  // 年
  const year = nowDate.getFullYear()
  // 月
  const month = nowDate.getMonth() + 1
  // 日
  const day = nowDate.getDate()
  // 下班时间
  const leaveTime = new Date(`${year}/${month}/${day} 18:30:00`).getTime()
  let leaveObj;
  if(leaveTime > nowDate.getTime()) {
    leaveObj = getDateObj(leaveTime - nowDate.getTime())
  }
  // 节日时间
  let dayTime;
  let dayText;
  for(let i = 0; i < dayArr.length; i++) {
    let time = new Date(`${year}/${dayArr[i].value} 18:30:00`).getTime()
    if(time > nowDate.getTime()) {
      dayTime = time;
      dayText = dayArr[i].label;
      break;
    }
  }
  let dayObj = getDateObj(dayTime - nowDate.getTime())
  if(leaveObj && dayObj) {
    textNode.innerText = `下班倒计时：${String(leaveObj.hour).padStart(2, "0")}时${String(leaveObj.minute).padStart(2, "0")}分${String(leaveObj.second).padStart(2, "0")}秒 距离${dayText}还有：${String(dayObj.day).padStart(2, "0")}天${String(dayObj.hour).padStart(2, "0")}时${String(dayObj.minute).padStart(2, "0")}分${String(dayObj.second).padStart(2, "0")}秒`
  } else {
    if(!leaveObj) {
      textNode.innerText = `下班倒计时：00时00分00秒 距离${dayText}还有：${String(dayObj.day).padStart(2, "0")}天${String(dayObj.hour).padStart(2, "0")}时${String(dayObj.minute).padStart(2, "0")}分${String(dayObj.second).padStart(2, "0")}秒`
    }
  }
  // 误差计算
  offset = new Date().getTime() - (startTime + count * 1000);
  // 再次调用
  timer = setTimeout(doFunc, 1000 - offset)
}

const stop = () => {
  if(timer) {
    clearTimeout(timer)
    timer = null
  }
}

/**
 * 页面初始化
 */
window.onload = () => {
  init()
  stop()
  start()
}

/**
 * 页面卸载
 */
window.onbeforeunload = () => {
  stop()
  destroy()
}