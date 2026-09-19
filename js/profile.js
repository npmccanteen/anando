// js/profile.js
import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  collection, query, where, getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  const userInfo = document.getElementById("user-info");
  const perf = document.getElementById("performance");

  if (!user) {
    userInfo.innerHTML = `
      <p class="warn">⚠️ Login করুন। <a href="index.html">Login</a></p>
    `;
    perf.innerHTML = "";
    return;
  }

  userInfo.innerHTML = `
    <img src="${user.photoURL}" class="avatar-lg" />
    <h3>${user.displayName}</h3>
    <p>${user.email}</p>
  `;

  try {
    const q = query(
      collection(db, "quizResults"),
      where("uid", "==", user.uid)
    );
    const snap = await getDocs(q);

    if (snap.empty) {
      perf.innerHTML = `<p>এখনো কোনো quiz দেননি। <a href="quiz.html">শুরু করুন</a></p>`;
      return;
    }

    let rows = "";
    let totalScore = 0, totalMax = 0;

    snap.forEach(doc => {
      const d = doc.data();
      totalScore += d.score;
      totalMax += d.total;
      rows += `
        <tr>
          <td>${d.subject}</td>
          <td>${d.score}/${d.total}</td>
        </tr>
      `;
    });

    const percent = ((totalScore / totalMax) * 100).toFixed(1);

    perf.innerHTML = `
      <p class="big-score"><strong>মোট স্কোর:</strong> ${totalScore}/${totalMax} (${percent}%)</p>
      <table>
        <thead><tr><th>Subject</th><th>Score</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  } catch (err) {
    console.error(err);
    perf.innerHTML = `<p class="warn">⚠️ ডেটা আনতে সমস্যা হয়েছে।</p>`;
  }
});
