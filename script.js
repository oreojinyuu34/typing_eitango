let correctChars = 0;
let mistakes = 0;

async function loadWords() {
  try {
    const response = await fetch("words.json");
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

function checkTyping(e) {
  const typedWord = e.target.value;
  const englishWordElement = document.getElementById("english-word");
  const typedLetters = typedWord.split("");
  const targetLetters = currentWord.word.split("");
  const coloredLetters = targetLetters.map((letter, index) => {
    if (index < typedLetters.length) {
      if (letter === typedLetters[index]) {
        correctChars++;
        return `<span style="color: green">${letter}</span>`;
      } else {
        mistakes++;
        return `<span style="color: red">${letter}</span>`;
      }
    } else {
      return letter;
    }
  });
  englishWordElement.innerHTML = coloredLetters.join("");

  if (typedWord === currentWord.word) {
    e.target.value = "";
    currentWord = getRandomWord(words);
    displayWord(currentWord);
  }
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
      document.getElementById("results").style.display = "block";
      document.getElementById(
        "correct-chars"
      ).textContent = `正しい入力文字数: ${correctChars}`;
      document.getElementById(
        "mistakes"
      ).textContent = `タイプミスの回数: ${mistakes}`;
      const charsPerSecond = (correctChars / 60).toFixed(2);
      document.getElementById(
        "chars-per-second"
      ).textContent = `一秒あたりの入力文字数: ${charsPerSecond}`;
    }
  }, 1000);
}

document.getElementById("start-btn").addEventListener("click", () => {
  document.getElementById("start-btn").disabled = true;
  document.getElementById("typed-word").disabled = false;
  document.getElementById("typed-word").focus();
  startTimer();
});

loadWords().then((loadedWords) => {
  words = loadedWords;
  currentWord = getRandomWord(words);
  displayWord(currentWord);
  document.getElementById("typed-word").addEventListener("input", checkTyping);
});
