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
  
module.exports = {
    handleGameStart,
};
  