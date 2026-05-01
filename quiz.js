const questions = [
  {
    question: "Who is the creator of JavaScript?",
    options: ["Brendan Eich", "Mark Zuckerberg", "Bill Gates", "Elon Musk"],
    answer: 0,
  },
  {
    question: "What is the full form of HTML?",
    options: [
      "Hyper Text Markup Language",
      "High Text Machine Language",
      "Hyper Transfer Markup",
      "None",
    ],
    answer: 0,
  },
  {
    question: "Why do we use CSS?",
    options: ["Logic", "Database", "Styling", "Server"],
    answer: 2,
  },
];

let index = 0;
let timer;
let timeLeft = 10;
let userAnswers = [];

let timerEl;
let questionEl;
let optionsDiv;
let nextBtn;
let progressFillEl;

function showScreen(screenId) {
  // Hide all screens
  document.getElementById("welcome-screen").style.display = "none";
  document.getElementById("quiz-screen").style.display = "none";
  document.getElementById("result-screen").style.display = "none";
  document.getElementById("answers-screen").style.display = "none";

  // Show selected screen
  document.getElementById(screenId).style.display = "block";
}

function showWelcome() {
  showScreen("welcome-screen");
  document.getElementById("start-btn").onclick = showQuiz;
}

function showQuiz() {
  showScreen("quiz-screen");

  timerEl = document.getElementById("quiz-timer");
  questionEl = document.getElementById("quiz-question");
  optionsDiv = document.getElementById("quiz-options");
  nextBtn = document.getElementById("next-btn");
  progressFillEl = document.getElementById("progress-fill");

  nextBtn.onclick = goNextAuto;
  loadQuestion();
}

function loadQuestion() {
  clearInterval(timer);
  timeLeft = 10;

  const progressEl = document.getElementById("quiz-progress");
  const timeoutMsg = document.getElementById("timeout-msg");

  if (progressEl) {
    progressEl.textContent = `Question ${index + 1} / ${questions.length}`;
  }
  if (progressFillEl) {
    progressFillEl.style.width = `${((index + 1) / questions.length) * 100}%`;
  }

  if (timeoutMsg) {
    timeoutMsg.hidden = true;
  }

  timerEl.textContent = "Time Left: 10s";
  timerEl.style.color = "#ea580c";
  nextBtn.disabled = true;
  optionsDiv.innerHTML = "";

  questionEl.textContent = questions[index].question;

  questions[index].options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.dataset.index = String(i);
    btn.textContent = opt;
    btn.style.animationDelay = `${i * 0.08}s`;
    btn.onclick = () => selectOption(btn, i);
    optionsDiv.appendChild(btn);
  });

  startTimer();
}

function selectOption(clickedBtn, selectedIndex) {
  if (clickedBtn.disabled) return;

  clearInterval(timer);
  userAnswers[index] = selectedIndex;
  const correctIndex = questions[index].answer;

  [...optionsDiv.children].forEach((btn) => {
    btn.disabled = true;
    if (Number(btn.dataset.index) === correctIndex) {
      btn.classList.add("is-correct");
    } else if (btn !== clickedBtn) {
      btn.style.opacity = "0.7";
    }
  });

  clickedBtn.classList.add("selected");
  if (selectedIndex !== correctIndex) {
    clickedBtn.classList.add("is-wrong");
  }
  nextBtn.disabled = false;
}

function goNextAuto() {
  index += 1;
  if (index < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft -= 1;
    timerEl.textContent = `Time Left: ${timeLeft}s`;

    if (timeLeft <= 3) {
      timerEl.style.color = "#dc2626";
    }

    if (timeLeft === 0) {
      clearInterval(timer);
      userAnswers[index] = null;

      [...optionsDiv.children].forEach((btn) => {
        btn.disabled = true;
        btn.style.opacity = "0.6";
      });

      const timeoutMsg = document.getElementById("timeout-msg");
      if (timeoutMsg) {
        timeoutMsg.hidden = false;
      }

      setTimeout(goNextAuto, 700);
    }
  }, 1000);
}

function showResult() {
  clearInterval(timer);

  const score = userAnswers.filter((a, i) => a === questions[i].answer).length;
  const percentage = Math.round((score / questions.length) * 100);

  let message = "";
  if (percentage === 100) {
    message = "Perfect! You are a Quiz Champion!";
  } else if (percentage >= 70) {
    message = "Great job! Keep learning and growing!";
  } else if (percentage >= 40) {
    message = "Good try! Practice more, success is near!";
  } else {
    message = "Do not quit. Every try makes you better!";
  }

  showScreen("result-screen");

  document.getElementById("score-pill").textContent = `${percentage}%`;
  document.getElementById("score-text").innerHTML = `<strong>Score:</strong> ${score} / ${questions.length}`;
  document.getElementById("accuracy-text").innerHTML = `<strong>Accuracy:</strong> ${percentage}%`;
  document.getElementById("result-message").textContent = message;

  document.getElementById("answers-btn").onclick = showAllAnswers;
  document.getElementById("restart-btn").onclick = () => {
    index = 0;
    userAnswers = [];
    showWelcome();
  };
}

function showAllAnswers() {
  showScreen("answers-screen");

  const listHtml = questions
    .map((q, i) => {
      const user = userAnswers[i];
      const correct = q.answer;
      const stateClass = user === correct ? "correct" : "wrong";

      return `
        <article class="answer-item ${stateClass}" style="animation-delay:${i * 0.06}s">
          <div><strong>Q${i + 1}. ${q.question}</strong></div>
          <div>Your: <strong>${q.options[user] || "Not Selected"}</strong></div>
          <div>Correct: <strong>${q.options[correct]}</strong></div>
        </article>
      `;
    })
    .join("");

  document.getElementById("answers-list").innerHTML = listHtml;

  document.getElementById("back-result").onclick = showResult;
  document.getElementById("restart-from-answers").onclick = () => {
    index = 0;
    userAnswers = [];
    showWelcome();
  };
}

showWelcome();
