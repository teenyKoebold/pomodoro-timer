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

let workTime = 10;
let restTime = 5;
let longRest = 7;
let timeLeft = workTime;

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
    titleEl.textContent = "Work";
    document.body.style.backgroundImage = "url('assets/workBackground.png')";
  } else {
    if (cycles >= 4) {
      titleEl.textContent = "Long Rest";
      document.body.style.backgroundImage = "url('assets/restBackground.png')";
    } else {
      titleEl.textContent = "Rest";
      document.body.style.backgroundImage = "url('assets/restBackground.png')";
    }
  }
}

function updateCycles(){
  cyclesEl.textContent = cycles;
}

function addTimes() {
  const mStr = (minInpt.value || "").trim();
  const sStr = (secInpt.value || "").trim();

  if (mStr !== "" || sStr !== "") {
    const m = parseInt(mStr, 10) || 0;
    const s = parseInt(sStr, 10) || 0;
    const newDur = m * 60 + s;

    if (newDur > 0) {
      if (isWorking) {
        workTime = newDur;
        timeLeft = workTime;
      } else if (cycles >= 4) {
        longRest = newDur;
        timeLeft = longRest;
      } else {
        restTime = newDur;
        timeLeft = restTime;
      }
    }

    minInpt.value = "";
    secInpt.value = "";
  } else {
    if (isWorking) {
      timeLeft = workTime;
    } else if (cycles >= 4) {
      timeLeft = longRest;
    } else {
      timeLeft = restTime;
    }
  }
}

function startTimer() {
  addTimes();
  updateTimer();

  clearInterval(interval);
  interval = setInterval(() => {
    timeLeft--;
    updateTimer();

    if (timeLeft === 0) {
      clearInterval(interval);
      alert("Time's up!");

      if (isWorking) {
        isWorking = false;
      } else {
        cycles++;
        isWorking = true;
      }

      addTimes();
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

startEl.addEventListener("click", startTimer);
stopEl.addEventListener("click", stopTimer);
resetEl.addEventListener("click", resetTimer);