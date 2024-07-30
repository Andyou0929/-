function parseLrc(){
    let lines = lrc.split('\n');
    let result = [];
    lines.forEach(str => {
        let parts = str.split(']');
        let timeStr = parts[0].substring(1);
        let obj = {
            time:parseTime(timeStr),
            words:parts[1]
        };
        result.push(obj);
    });
    return result;
}
/**
 * 将一个时间字符串转为数字
 * @param {*} timeStr 时间字符串
 * @returns 
 */
function parseTime(timeStr){
    let parts = timeStr.split(':');
    return +parts[0] * 60 + +parts[1];

}
var lrcData = parseLrc();

let doms = {
    audio:document.querySelector('audio'),
    ul:document.querySelector(".container ul"),
    container:document.querySelector(".container")

}

function findIndex(){
    let curTime = doms.audio?.currentTime || 0;
    for (let i = 0; i < lrcData.length; i++) {
        const obj = lrcData[i];
        if (obj.time > curTime) {
            return i-1
        }
    }
    return lrcData.length - 1
}

function createLrcElements(){
    // 文档片段
    let frag = document.createDocumentFragment();
    for (let i = 0; i < lrcData.length; i++) {
        const obj = lrcData[i];
        let li = document.createElement("li");
        li.onclick = handlerClickLrc;
        li.dataset.time = obj.time
        li.textContent = obj.words;
        frag.appendChild(li);
    }
    doms.ul?.appendChild(frag)
}
function handlerClickLrc(){
    doms.audio.currentTime = this.dataset.time
}
createLrcElements(); 

// 容器高度
let containerHeight = doms.container?.clientHeight || 0;
// li高度
let liHeight = doms.ul?.children[0].clientHeight || 0;
// 最大偏移量
let maxOffset = (doms.ul?.clientHeight || 0) - containerHeight
function setOffset(){
    let index = findIndex();
    let offset = liHeight * index + liHeight / 2 - containerHeight / 2
    if(offset < 0){
        offset = 0
    }
    if(offset > maxOffset){
        offset = maxOffset;
    }
    console.log(offset);
    doms.ul.style.transform = `translateY(-${offset}px)`
    let li = doms.ul?.querySelector(".active");
    if (li) {
        li.classList.remove('active');
    }
    li = doms.ul?.children[index];
    if (li) {
        li.classList.add("active");
    }
    
}
doms.audio?.addEventListener("timeupdate",setOffset)
