// js/quiz.js
import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  collection, addDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  currentUser = user;
});

const demoQuiz = [
  {
    q: "Brachial শব্দের অর্থ কী?",
    options: ["পায়ু সংক্রান্ত", "বাহু সংক্রান্ত", "হৃদয় সংক্রান্ত", "মস্তিষ্ক সংক্রান্ত"],
    answer: 1
  },
  {
    q: "Carditis মানে কী?",
    options: ["হৃদপিণ্ডের প্রদাহ", "ফুসফুসের প্রদাহ", "যকৃতের প্রদাহ", "কিডনির প্রদাহ"],
    answer: 0
  },
  {
    q: "Nephro রুট শব্দের অর্থ কী?",
    options: ["Heart", "Liver", "Kidney", "Brain"],
    answer: 2
  },
  {
    q: "-itis suffix মানে কী?",
    options: ["বিদ্যা", "বৃদ্ধি", "প্রদাহ", "কাটা"],
    answer: 2
  },
  {
    q: "Hepatomegaly মানে কী?",
    options: ["প্লীহা বড় হওয়া", "যকৃত বড় হওয়া", "হৃদপিণ্ড বড় হওয়া", "কিডনি বড় হওয়া"],
    answer: 1
  }
];

let currentIndex = 0;
let score = 0;
let answered = false;

function renderQuestion() {
  const container = document.getElementById("quiz-container");
  if (currentIndex >= demoQuiz.length) {
    finishQuiz();
    return;
  }

  const q = demoQuiz[currentIndex];
  answered = false;

  container.innerHTML = `
    <p class="progress">প্রশ্ন ${currentIndex + 1} / ${demoQuiz.length}</p>
    <h3>${q.q}</h3>
    <div class="options">
      ${q.options.map((opt, i) => `
        <button class="option" data-index="${i}">${opt}</button>
      `).join("")}
    </div>
  `;

  document.querySelectorAll(".option").forEach(btn => {
    btn.onclick = () => selectAnswer(parseInt(btn.dataset.index));
  });
}

function selectAnswer(index) {
  if (answered) return;
  answered = true;

  const q = demoQuiz[currentIndex];
  const buttons = document.querySelectorAll(".option");

  buttons.forEach((btn, i) => {
    if (i === q.answer) btn.classList.add("correct");
    else if (i === index) btn.classList.add("wrong");
    btn.disabled = true;
  });

  if (index === q.answer) score++;

  setTimeout(() => {
    currentIndex++;
    renderQuestion();
  }, 1200);
}

async function finishQuiz() {
  const container = document.getElementById("quiz-container");
  container.innerHTML = `
    <h2>🎉 Quiz শেষ!</h2>
    <p class="final-score">স্কোর: ${score} / ${demoQuiz.length}</p>
  `;

  const result = document.getElementById("result");

  if (currentUser) {
    try {
      await addDoc(collection(db, "quizResults"), {
        uid: currentUser.uid,
        name: currentUser.displayName,
        email: currentUser.email,
        subject: "Anatomy",
        score: score,
        total: demoQuiz.length,
        timestamp: serverTimestamp()
      });
      result.innerHTML = `<p class="ok">✅ আপনার স্কোর সেভ হয়েছে!</p>`;
    } catch (err) {
      console.error(err);
      result.innerHTML = `<p class="warn">⚠️ সেভ করতে সমস্যা হয়েছে।</p>`;
    }
  } else {
    result.innerHTML = `<p class="warn">💡 Login করলে স্কোর সেভ হবে। <a href="index.html">Login করুন</a></p>`;
  }

  result.innerHTML += `<button onclick="location.reload()">🔄 আবার চেষ্টা করুন</button>`;
}

renderQuestion();
