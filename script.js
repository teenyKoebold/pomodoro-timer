const startEl = document.getElementById("start");
const stopEl = document.getElementById("stop");
const resetEl = document.getElementById("reset");
const timerEl = document.getElementById("timer");
const titleEl = document.getElementById("title");
const cyclesEl = document.getElementById("cycles");
const minInpt = document.getElementById("minutes");
const secInpt = document.getElementById("seconds");

let interval;
let cycles = 0;
let isWorking = true;

let workTime = 1500;
let restTime = 300;
let longRest = 900;
let timeLeft = workTime;

const alarmSound = new Audio("assets/alarm.mp3");
alarmSound.load();

function parseTime(str) {
  const parts = str.split(":");
  if (parts.length !== 2){
    return null;
  }
  
  const m = parseInt(parts[0], 10);
  const s = parseInt(parts[1], 10);
  if (isNaN(m) || isNaN(s) || m < 0 || s < 0 || s > 59){
    return null;
  }

  return m * 60 + s;
}

timerEl.addEventListener("blur", () => {
  const newTime = parseTime(timerEl.textContent.trim());
  if (newTime !== null && newTime > 0) {
    if (isWorking) {
      workTime = newTime;
      timeLeft = workTime;
    } else if (cycles >= 4) {
      longRest = newTime;
      timeLeft = longRest;
    } else {
      restTime = newTime;
      timeLeft = restTime;
    }
    updateTimer();
  } else {
    updateTimer(); 
  }
});

timerEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    timerEl.blur();
  }
});

function updateTimer() {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  let formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  timerEl.innerHTML = formattedTime;
}

function updateTitle() {
  if (isWorking) {
    titleEl.textContent = "WORK";
    document.body.style.backgroundImage = "url('assets/workBackground.png')";
  } else {
    if (cycles >= 4) {
      titleEl.textContent = "LONG REST";
      document.body.style.backgroundImage = "url('assets/restBackground.png')";
    } else {
      titleEl.textContent = "REST";
      document.body.style.backgroundImage = "url('assets/restBackground.png')";
    }
  }
}

function updateCycles(){
  cyclesEl.textContent = cycles;
}

function setTime(){
  if(isWorking){
    timeLeft = workTime;
  }else if(cycles >= 4){
    timeLeft = longRest;
  }else{
    timeLeft = restTime;
  }
}

function startTimer() {
  updateTimer();
  clearInterval(interval);
  let endTime = Date.now() + timeLeft * 1000;

  interval = setInterval(() => {
    let now = Date.now();
    timeLeft = Math.round((endTime - now) / 1000);
    updateTimer();

    if (timeLeft <= 0) {
      clearInterval(interval);
      alarmSound.currentTime = 0;
      alarmSound.play().catch(err => console.log("Playing audio failed: ", err));

      if (isWorking) {
        isWorking = false;
      } else {
        cycles++;
        isWorking = true;
      }

      setTime();

      updateTitle();
      updateCycles();
      updateTimer();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);
}

function resetTimer() {
  clearInterval(interval);
  if (isWorking) {
    timeLeft = workTime;
  } else if (cycles >= 4) {
    timeLeft = longRest;
  } else {
    timeLeft = restTime;
  }
  updateTimer();
}

startEl.addEventListener("click", () => {
  alarmSound.play().then(() => {
    alarmSound.pause();
    alarmSound.currentTime = 0;
  }).catch(() => {});
  startTimer();
});
stopEl.addEventListener("click", stopTimer);
resetEl.addEventListener("click", resetTimer);