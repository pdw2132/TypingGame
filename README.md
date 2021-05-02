# TypingGame
## 사용 환경설정
**사용한 언어 : javascript, html, css**   
**사용 Tool : Vs Code**   
**사용 Test 라이브러리 : Jest**
## 해결방안
routing.js - content-app부분이 변경되는 history (Browser History)를 사용한 SPA routing 구현
```swift
// template
const gameStartTemplate = require('./pages/gameStart.hbs')
const gameEndTemplate = require('./pages/gameEnd.hbs')

const GameStart = gameStartTemplate()
const GameEnd = gameEndTemplate()

const routes = {
  '/': GameStart,
  '/gameStart': GameStart,
  '/gameEnd': GameEnd
}

// entry point
function initialRoutes (mode, el) {
  renderHTML(el, routes['/'])

  if (mode === 'history') {
    window.onpopstate = () => renderHTML(el, routes[window.location.pathname])
  }
}

// set browser history
function historyRouterPush (pathName, el) {
  window.history.pushState({}, pathName, window.location.origin + pathName)
  renderHTML(el, routes[pathName])
}

// render
function renderHTML (el, route) {
  el.innerHTML = route
}
```
---
**해결 전략 1 - 먼저 데이터를 httpRequest를 통해 가져오기**
```swift
async function getData(url) {
    let myPromise = new Promise(function(myResolve, myReject) {
      let req = new XMLHttpRequest();
      req.open('GET', url);
      req.onload = function() {
        if (req.status == 200) {
          myResolve(JSON.parse(req.responseText));
        } else {
          myReject({});
        }
      };
      req.send();
    });
    return await myPromise;
 }
```
---
**해결 전략 2 - 버튼 클릭 이벤트 추가**
```swift
const contentDiv = document.querySelector('#content-app')

var wordTextDataArr = []; //게임에 사용될 단어 배열
var wordTextDataIndex = 0; //현재 진행중인 단어의 index
var errorScore = 0; //현재까지 틀린 단어의 갯수
var totalTime = 0; //정답을 맞춘 단어의 걸린시간들의 총합시간
var remainingTime = 0; //게임중에 단어별 남은 시간

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
```
처음 화면이 랜더링되면 content-app div에 pages/gameStart.hbs화면이 랜더링되어진다.
input box는 disable형태이고 button의 텍스는 시작이다.   
시작 버튼을 클릭하게 되면 contentdiv에 click이벤트를 감지해 해당 페이지에서 사용할 로직 함수 handleGameStart를 호출한다.
```swift
const handleGameStart = (wordTextDataIndex,wordTextDataArr) => {
    const button = document.querySelector("#startButton");
    const wordText = document.querySelector("#wordText");
    const inputBox = document.querySelector("#input");
    const time = document.querySelector("#time");
    const score = document.querySelector("#score");

    if(button.innerHTML==="시작"){
        wordText.innerHTML = wordTextDataArr[wordTextDataIndex].text;
        inputBox.disabled = false;
        button.innerHTML="초기화";
        score.innerHTML = `점수 : ${wordTextDataArr.length}점`;
        score.style.display = "";
        time.innerHTML = `남은 시간 : ${wordTextDataArr[wordTextDataIndex].second}초`;
        time.style.display = "";
    }
    else if(button.innerHTML==="초기화"){
        wordText.innerHTML="문제 단어";
        inputBox.disabled = true;
        button.innerHTML="시작";
        score.style.display = "none";
        time.style.display = "none";
    }

    return wordTextDataIndex;
};
```
시작 버튼을 클릭하게 되면 처음에 받아온 data(second, text)를 화면에 랜더링 해주고 문자마다 남은 시간을 알려주는 Timer()함수가 호출된다.     만일 초기화 버튼을 클릭하게 되면 사용하고 있는 
모든 변수들을 초기화 하고 처음 단어부터 다시 시작하도록 한다.

---
**해결 전략 3 - input 이벤트 추가**
```swift
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
```
keyup이벤트를 감지해 엔터키를 클릭하게 되면 현재 진행중인 문제 단어와 입력한 값이 같은지 확인한다.   
만약 값이 같다면 index를 하나 더해줘 다음 문제를 가르키도록 설정한다. 그리고 정답을 맞춘 시간은 totalTime 변수에 저장한다.
또한 정답이 맞거나 값이 틀리다면 입력한 값을 초기화 시켜준다. 마지막 문제를 맞췄다면 게임 종료 화면으로 라우팅하게 된다.   

---
**해결 전략 4 - 남은시간 계산**
```swift
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
```
시작버튼을 클릭하게 되면 Timer() 함수가 불려지게 되고 setInterval함수가 실행되며 1초마다 시간이 감소한다. (인자를 1000으로 설정)
현재 단어의 남은 시간에 해당되는 remainingTime이 없게되면 틀린 score의 값을 하나 추가해주고 다음 문제의 남은시간으로 변경해준다.   
만약 마지막 문제에서 시간이 다되거나 초기화 버튼을 클릭하게 되면 clearInterval함수를 실행해 해당 타이머 함수를 종료한다.   

---
**해결 전략 5 - 결과값 계산**
```swift
const handleGameEnd = (errorScore,totalTime,wordTextDataArr) => {
  const totalScore = document.querySelector("#totalScore");
  const AverageTime = document.querySelector("#AverageTime");

  const averageTime = errorScore===wordTextDataArr.length?0:totalTime/(wordTextDataArr.length-errorScore);

  totalScore.innerHTML = `당신의 점수는 ${wordTextDataArr.length-errorScore}점입니다.`;
  AverageTime.innerHTML = `단어당 평균 답변 시간은 ${averageTime}초입니다.`;
};
```
모든 문제가 종료되면 종료화면으로 라우팅이 되고 handleGameEnd() 함수가 실행된다.   
인자로 틀린 문제의 수, 맞은 문제의 총 걸린시간, 총 문제 데이터를 인자로 받아 값을 계산해 보여준다.   
만약 맞힌 문제가 아무것도 없다면 0점에 0초, 하나이상 맞췄을 시 평균 시간을 보여주도록 한다.
## Build, Testing
webpack.config.js 폴더에 output을 추가해 public폴더에 사용한 html, js, html을 export 해주었다.
```swift
output: {
    path: resolve(__dirname, './public'),
    filename: '[name].js'
  },
```
단위 테스트의 경우 jest 라이브러리를 사용해 html이 잘 랜더링 됬는지, async데이터가 잘 받아지는지 함수호출이 잘 되었는지 진행했다.
```swift
describe('index.html', () => {
  beforeEach(() => {
    dom = new JSDOM(html)
    header = dom.window.document.head
    body = dom.window.document.body
  })

  it('renders a heading element', () => {
    expect(header.querySelector('title')).not.toBeNull()
  })

  it('renders a content element', () => {
    expect(body.querySelector('#content-app')).not.toBeNull()
  })

})

test('Data Send', () => {
    return getData('https://my-json-server.typicode.com/kakaopay-fe/resources/words').then(data => {
        expect(data.length).toBe(12);
        expect(data[0].text).toBe("hello");
    });
})

test('handleGameStart Test', () => {
    expect(handleGameStart.name).toBe("handleGameStart");
})

test('handleGameEnd Test', () => {
    expect(handleGameEnd.name).toBe("handleGameEnd");
})
```
