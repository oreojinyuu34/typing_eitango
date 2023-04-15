// JSONファイルのURL
const URL = "animals.json";

// 単語リスト
let words = [];

// ゲームで使用する単語
let currentWord = "";
let currentWordIndex = 0;

// DOM要素
const wordContainer = document.getElementById("word-container");
const inputBox = document.getElementById("input-box");

// ゲームの初期化
function init() {
  // JSONファイルの読み込み
  fetch(URL)
    .then((response) => response.json())
    .then((data) => {
      // 単語リストの初期化
      words = data;

      // ゲームの開始
      startGame();
    });
}

// ゲームの開始
function startGame() {
  // ゲームで使用する単語の選択
  currentWordIndex = Math.floor(Math.random() * words.length);
  currentWord = words[currentWordIndex].word;

  // 単語の表示
  wordContainer.textContent = words[currentWordIndex].meaning;

  // 入力欄の初期化
  inputBox.value = "";
}

// 入力欄の変更を検知して、ゲームの進行状況を更新する
inputBox.addEventListener("input", () => {
  if (inputBox.value === currentWord) {
    // 正解の場合
    alert("正解！");

    // ゲームを再開する
    startGame();
  }
});

// ゲームの初期化
init();
