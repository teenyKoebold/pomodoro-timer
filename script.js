const startEl = document.getElementById("start");
const stopEl = document.getElementById("stop");
const resetEl = document.getElementById("reset");
const timerEl = document.getElementById("timer");

let interval;
let timeLeft = 10;
let cycles = 0;
let isWorking = true;

function updateTimer() {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  let formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  timerEl.innerHTML = formattedTime;
}

function startTimer() {
  interval = setInterval(() => {
    timeLeft--;
    updateTimer();
    if(timeLeft === 0){
        clearInterval(interval);
        alert("Time's up!");

        if(isWorking){
            if(cycles >= 4){
                timeLeft = 7;
                isWorking = false;
                updateTimer();
            }else{
                timeLeft = 5;
                isWorking = false;
                updateTimer();
            }
        }else{
            cycles++;
            timeLeft = 10;
            isWorking = true;
            updateTimer();
        }
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);
}

function resetTimer() {
  clearInterval(interval);
  if(isWorking){
    timeLeft = 10;
    updateTimer();
  }else{
    timeLeft = 5;
    updateTimer();
  }
}

startEl.addEventListener("click", startTimer);
stopEl.addEventListener("click", stopTimer);
resetEl.addEventListener("click", resetTimer);