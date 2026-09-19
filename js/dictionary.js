// js/dictionary.js
let allTerms = [];

async function loadTerms() {
  const list = document.getElementById("term-list");
  try {
    const res = await fetch("data/anatomy-terms.json");
    allTerms = await res.json();
    renderTerms(allTerms);
  } catch (err) {
    console.error(err);
    list.innerHTML = `<p>⚠️ ডেটা লোড করা যায়নি।</p>`;
  }
}

function renderTerms(terms) {
  const list = document.getElementById("term-list");
  if (!terms.length) {
    list.innerHTML = `<p>কোনো টার্ম পাওয়া যায়নি।</p>`;
    return;
  }

  list.innerHTML = terms.map(t => `
    <div class="term-card">
      <div class="term-head">
        <h3>${t.term}</h3>
        <span class="badge">${t.type}</span>
      </div>
      <p class="bangla">${t.bangla}</p>
      <p class="pron">🔊 ${t.pronunciation}</p>
      <p class="root">🧩 Root: <em>${t.root}</em></p>
      <p class="example">📝 ${t.example}</p>
    </div>
  `).join("");
}

function filterTerms() {
  const query = document.getElementById("search").value.trim().toLowerCase();
  const type = document.getElementById("filter-type").value;

  let filtered = allTerms;
  if (query) {
    filtered = filtered.filter(t =>
      t.term.toLowerCase().includes(query) ||
      t.bangla.includes(query)
    );
  }
  if (type) {
    filtered = filtered.filter(t => t.type === type);
  }
  renderTerms(filtered);
}

document.getElementById("search").addEventListener("input", filterTerms);
document.getElementById("filter-type").addEventListener("change", filterTerms);

loadTerms();
