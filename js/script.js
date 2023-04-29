let correctChars = 0;
let totalCorrectChars = 0; // この行を追加
let mistakes = 0;

let progress = 0;
let maxProgress = 100;

function updateProgressBar() {
  const progressBar = document.getElementById("progress-bar");
  progressBar.style.width = progress + "%";
}

async function loadWords() {
  try {
    const response = await fetch("./js/words.json");
    const data = await response.json();
    return data.sentences;
  } catch (error) {
    console.error("Failed to load words:", error);
    return [];
  }
}

function displayWord(word) {
  const englishWord = document.getElementById("english-word");
  const japaneseWord = document.getElementById("japanese-word");
  englishWord.textContent = word.word;
  japaneseWord.textContent = word.meaning;
}
function toFullWidth(str) {
  return str.replace(
    /[-\_\+\!\@\#\$\%\^\&\*\(\)\=\[\]\{\}\\\|\;\:\'\"\,\.\?\/\<\>\~]/g,
    function (s) {
      return String.fromCharCode(s.charCodeAt(0) + 0xfee0);
    }
  );
}

function checkTyping(e) {
  let typedWord = e.target.value;
  typedWord = toFullWidth(typedWord);
  const englishWordElement = document.getElementById("english-word");
  const typedLetters = typedWord.split("");
  const targetLetters = currentWord.word.split("");
  let isError = false;
  let tempCorrectChars = 0;

  const coloredLetters = targetLetters.map((letter, index) => {
    if (index < typedLetters.length) {
      if (letter === typedLetters[index]) {
        tempCorrectChars++;
        return `<span style="color: green">${letter}</span>`;
      } else {
        isError = true;
        return `<span style="color: red">${letter}</span>`;
      }
    } else {
      return letter;
    }
  });

  englishWordElement.innerHTML = coloredLetters.join("");

  if (e.key === " ") {
    if (typedWord.trim() === currentWord.word) {
      totalCorrectChars += correctChars;
      e.target.value = "";
      currentWord = getRandomWord(words);
      displayWord(currentWord);
    } else {
      mistakes++;
    }
    correctChars = 0;
  } else {
    progress += tempCorrectChars - correctChars;
    correctChars = tempCorrectChars;
  }

  progress = Math.min(progress, maxProgress);
  updateProgressBar(); // 進行バーの更新
}

function getRandomWord(words) {
  return words[Math.floor(Math.random() * words.length)];
}

let currentWord;
let timer;
let words = [];

function startTimer() {
  let timeLeft = 60;

  const timerElement = document.getElementById("timer");
  timerElement.textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      document.getElementById("typed-word").disabled = true;
      document.getElementById("start-btn").disabled = false;
      document.getElementById("start-btn").textContent = "もう一度";
      document.getElementById("results").style.display = "block";
      document.getElementById(
        "correct-chars"
      ).textContent = `正しい入力文字数: ${totalCorrectChars}`;

      document.getElementById(
        "mistakes"
      ).textContent = `タイプミスの回数: ${mistakes}`;
      const charsPerSecond = (totalCorrectChars / 60).toFixed(2); // この行を修正
      document.getElementById(
        "chars-per-second"
      ).textContent = `一秒あたりの入力文字数: ${charsPerSecond}`;
    }
  }, 1000);
}

document.getElementById("start-btn").addEventListener("click", () => {
  // リセット処理
  correctChars = 0;
  totalCorrectChars = 0;

  mistakes = 0;
  document.getElementById("typed-word").value = "";
  document.getElementById("english-word").innerHTML = "";
  document.getElementById("japanese-word").innerHTML = "";
  document.getElementById("results").style.display = "none";

  // ゲーム開始
  document.getElementById("start-btn").disabled = true;
  document.getElementById("typed-word").disabled = false;
  document.getElementById("typed-word").focus();
  startTimer();

  // 初回の単語を表示
  currentWord = getRandomWord(words);
  displayWord(currentWord);
});

loadWords().then((loadedWords) => {
  words = loadedWords;
  currentWord = getRandomWord(words);
  displayWord(currentWord);
  document.getElementById("typed-word").addEventListener("keyup", checkTyping);
});
