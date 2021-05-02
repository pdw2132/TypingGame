// css
require('./css/style.css');

// router
const {
  initialRoutes,
  historyRouterPush,
} = require('./router')

const { handleGameStart } = require("./modules/gameStart");
const { handleGameEnd } = require("./modules/gameEnd");
const { getData } = require("./modules/getData");

var wordTextDataArr = []; //게임에 사용될 단어 배열
var wordTextDataIndex = 0; //현재 진행중인 단어의 index
var errorScore = 0; //현재까지 틀린 단어의 갯수
var totalTime = 0; //정답을 맞춘 단어의 걸린시간들의 총합시간
var remainingTime = 0; //게임중에 단어별 남은 시간

//데이터 받아오기
getData('https://my-json-server.typicode.com/kakaopay-fe/resources/words').then(data => {
  wordTextDataArr=data;
});

// app division
const contentDiv = document.querySelector('#content-app')

// Browser History
initialRoutes('history', contentDiv);

const initSettint = () =>{
  wordTextDataIndex = 0;
  errorScore=0;
  totalTime=0;
  remainingTime=0;
}

/* 버튼 클릭 이벤트 */
contentDiv.addEventListener("click", (e) => {
  const button = document.querySelector("#startButton");
  const target = e.target;

  if(target.id==="startButton"){
    handleGameStart(wordTextDataIndex,wordTextDataArr);
    remainingTime = wordTextDataArr[0].second;
    remainingTime--;
    if(button.innerHTML==="초기화"){ //시작 버튼 클릭시
      Timer();
    }else { //초기화 버튼 클릭시
      initSettint();
    }
  }else if(target.id==="restartButton"){//다시 시작 버튼 클릭시
    historyRouterPush("/gameStart", contentDiv);
    initSettint();
  }
});

/* enter key 클릭 이벤트 */
contentDiv.addEventListener("keyup", (e) => {
  const target = e.target;
  if (e.keyCode === 13){
    const inputBox = document.querySelector("#input");
    const wordText = document.querySelector("#wordText");

    if(target.value === wordTextDataArr[wordTextDataIndex].text){
      wordTextDataIndex++;
      if(wordTextDataIndex===wordTextDataArr.length){
        historyRouterPush("/gameEnd", contentDiv);
        handleGameEnd(errorScore,totalTime,wordTextDataArr);
      }
      else{
        totalTime+=wordTextDataArr[wordTextDataIndex].second-remainingTime;
        wordText.innerHTML = wordTextDataArr[wordTextDataIndex].text;
        remainingTime = wordTextDataArr[wordTextDataIndex].second;
      }
    }
    inputBox.value = "";
  }
});

/* 남은시간 계산 */
var Timer = () =>{
  const time = document.querySelector("#time");
  const wordText = document.querySelector("#wordText");
  const score = document.querySelector("#score");
  const button = document.querySelector("#startButton");

  var countdown = setInterval(function() {
    let timeCount = 0;
    if(remainingTime<0 && wordTextDataIndex<wordTextDataArr.length-1){
      timeCount = wordTextDataArr[wordTextDataIndex+1].second;
    }else if(wordTextDataIndex === wordTextDataArr.length)clearInterval(countdown);
    else timeCount = remainingTime;

    time.innerHTML = `남은 시간 : ${timeCount}초`;
    if(button.innerHTML==="시작"){
      clearInterval(countdown);
    }

    if (remainingTime >= 0) {
      remainingTime--;
    }else{
      errorScore++;
      if(wordTextDataIndex>=wordTextDataArr.length-1){
        clearInterval(countdown);
        historyRouterPush("/gameEnd", contentDiv);
        handleGameEnd(errorScore,totalTime,wordTextDataArr);
      }
      else{
        wordTextDataIndex++;
        remainingTime = wordTextDataArr[wordTextDataIndex].second;
        wordText.innerHTML = wordTextDataArr[wordTextDataIndex].text;
        score.innerHTML = `점수 : ${wordTextDataArr.length-errorScore}점`;
        remainingTime--;
      }
    } 
  }, 1000);
  return () => clearInterval(countdown);
}