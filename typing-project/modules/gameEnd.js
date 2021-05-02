const handleGameEnd = (errorScore,totalTime,wordTextDataArr) => {
  const totalScore = document.querySelector("#totalScore");
  const AverageTime = document.querySelector("#AverageTime");

  const averageTime = errorScore===wordTextDataArr.length?0:totalTime/(wordTextDataArr.length-errorScore);

  totalScore.innerHTML = `당신의 점수는 ${wordTextDataArr.length-errorScore}점입니다.`;
  AverageTime.innerHTML = `단어당 평균 답변 시간은 ${averageTime}초입니다.`;
};

module.exports = {
  handleGameEnd,
};
