const scoresList = document.getElementById('scores-list');
const clearBtn = document.getElementById('clear-btn');
const wpmChart = document.getElementById('wpm-chart');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageInfo = document.getElementById('page-info');
const filterDuration = document.getElementById('filter-duration');
const filterWords = document.getElementById('filter-words');
let chart = null;
let currentPage = 1;
const scoresPerPage = 10;

function getFilteredScores() {
  const allScores = JSON.parse(localStorage.getItem('scores') || '[]');
  const durationFilter = filterDuration.value;
  const wordsFilter = filterWords.value;
  
  return allScores.filter(score => {
    const matchDuration = durationFilter === 'all' || score.duration == durationFilter;
    const matchWords = wordsFilter === 'all' || score.wordCount == wordsFilter;
    return matchDuration && matchWords;
  });
}

function loadScores() {
  const scores = getFilteredScores();
  
  if (scores.length === 0) {
    scoresList.innerHTML = '<p class="text-center" style="color: var(--p-text-color);">No scores match the selected filters.</p>';
    clearBtn.style.display = 'none';
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    pageInfo.textContent = '';
    if (chart) chart.destroy();
    return;
  }
  
  clearBtn.style.display = 'block';
  
  createChart(scores);
  
  const totalPages = Math.ceil(scores.length / scoresPerPage);
  const startIdx = (currentPage - 1) * scoresPerPage;
  const endIdx = startIdx + scoresPerPage;
  const paginatedScores = scores.slice(startIdx, endIdx);
  
  scoresList.innerHTML = paginatedScores.map((score, index) => {
    const actualIndex = startIdx + index;
    return `
      <div class="mb-3 p-4 border-2 rounded-lg transition-colors" style="background-color: var(--main-bg-color); border-color: var(--correct-color);">
        <div class="flex justify-between items-center">
          <span class="font-bold" style="color: var(--caret-color);">Test #${scores.length - actualIndex}</span>
          <span class="text-sm" style="color: var(--p-text-color);">${score.date}</span>
        </div>
        <div class="mt-2 flex gap-6">
          <span style="color: var(--correct-color);">WPM: <strong>${score.wpm}</strong></span>
          <span style="color: var(--correct-color);">CPM: <strong>${score.cpm}</strong></span>
          <span style="color: var(--incorrect-color);">Mistakes: <strong>${score.mistakes}</strong></span>
        </div>
        ${score.duration && score.wordCount ? `
        <div class="mt-1 text-sm" style="color: var(--p-text-color);">
          ${score.duration}s | ${score.wordCount} words
        </div>
        ` : ''}
      </div>
    `;
  }).reverse().join('');
  
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  prevBtn.style.display = currentPage > 1 ? 'block' : 'none';
  nextBtn.style.display = currentPage < totalPages ? 'block' : 'none';
}

function createChart(scores) {
  if (chart) chart.destroy();
  
  const ctx = wpmChart.getContext('2d');
  const labels = scores.map((_, i) => `Test ${i + 1}`);
  const wpmData = scores.map(s => s.wpm);
  
  const correctColor = getComputedStyle(document.documentElement).getPropertyValue('--correct-color').trim();
  const caretColor = getComputedStyle(document.documentElement).getPropertyValue('--caret-color').trim();
  const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--main-bg-color').trim();
  
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'WPM',
        data: wpmData,
        borderColor: caretColor,
        backgroundColor: caretColor + '20',
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: {
            color: correctColor,
            font: { family: 'monospace' }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: correctColor },
          grid: { color: correctColor + '20' }
        },
        x: {
          ticks: { color: correctColor },
          grid: { color: correctColor + '20' }
        }
      }
    }
  });
}

function setTheme() {
  const themeDef = document.querySelector(":root").style;
  const themeName = localStorage.getItem("theme") || "default";
  
  const themes = {
    coffee: { bg: '#CEB18D', boba: 'rgb(25 16 14)', text: 'rgb(255 255 255)', correct: 'rgb(25 16 14)', incorrect: 'rgb(230, 84, 99)', caret: 'rgb(25 16 14)' },
    code: { bg: 'rgb(0,0,0)', boba: 'rgb(53, 160, 0)', text: 'rgb(22, 65, 0)', correct: 'rgb(53, 160, 0)', incorrect: 'rgb(202, 71, 84)', caret: 'rgb(53, 160, 0)' },
    beach: { bg: 'rgb(255, 184, 124)', boba: 'rgb(51, 102, 153)', text: 'rgb(153, 85, 51)', correct: 'rgb(255, 255, 255)', incorrect: 'rgb(255, 102, 102)', caret: 'rgb(255, 193, 7)' },
    lavender: { bg: 'rgb(200, 190, 230)', boba: 'rgb(50, 50, 100)', text: 'rgb(100, 84, 143)', correct: 'rgb(255, 255, 255)', incorrect: 'rgb(255, 140, 180)', caret: 'rgb(138, 43, 226)' },
    mintyfresh: { bg: 'rgb(173, 255, 199)', boba: 'rgb(0, 102, 68)', text: 'rgb(0, 68, 45)', correct: 'rgb(255, 255, 255)', incorrect: 'rgb(255, 69, 0)', caret: 'rgb(0, 204, 102)' },
    cherry: { bg: 'rgb(255, 223, 230)', boba: 'rgb(128, 0, 64)', text: 'rgb(51, 51, 51)', correct: 'rgb(210, 0, 126)', incorrect: 'rgb(90, 0, 0)', caret: 'rgb(255, 105, 180)' },
    mintchoc: { bg: 'rgb(17, 17, 17)', boba: 'rgb(255, 255, 255)', text: 'rgb(255, 255, 255)', correct: 'rgb(0, 255, 98)', incorrect: 'rgb(255, 69, 0)', caret: 'rgb(0, 191, 255)' },
    cottonCandy: { bg: 'rgb(255, 188, 217)', boba: 'rgb(128, 0, 255)', text: 'rgb(51, 51, 51)', correct: 'rgb(0, 204, 255)', incorrect: 'rgb(255, 69, 0)', caret: 'rgb(255, 105, 180)' },
    sunset: { bg: 'rgb(255, 94, 77)', boba: 'rgb(255, 223, 0)', text: 'rgb(255, 179, 71)', correct: 'rgb(255, 255, 255)', incorrect: 'rgb(139, 0, 0)', caret: 'rgb(255, 223, 0)' },
    ocean: { bg: 'rgb(0, 105, 148)', boba: 'rgb(0, 180, 216)', text: 'rgb(144, 224, 239)', correct: 'rgb(255, 255, 255)', incorrect: 'rgb(255, 87, 51)', caret: 'rgb(0, 180, 216)' },
    forest: { bg: 'rgb(34, 139, 34)', boba: 'rgb(144, 238, 144)', text: 'rgb(152, 251, 152)', correct: 'rgb(255, 255, 255)', incorrect: 'rgb(255, 69, 0)', caret: 'rgb(173, 255, 47)' },
    dracula: { bg: 'rgb(40, 42, 54)', boba: 'rgb(189, 147, 249)', text: 'rgb(98, 114, 164)', correct: 'rgb(80, 250, 123)', incorrect: 'rgb(255, 85, 85)', caret: 'rgb(255, 121, 198)' },
    monokai: { bg: 'rgb(39, 40, 34)', boba: 'rgb(249, 38, 114)', text: 'rgb(117, 113, 94)', correct: 'rgb(166, 226, 46)', incorrect: 'rgb(249, 38, 114)', caret: 'rgb(102, 217, 239)' },
    hellokitty: { bg: 'rgb(255, 182, 193)', boba: 'rgb(255, 20, 147)', text: 'rgb(255, 105, 180)', correct: 'rgb(255, 255, 255)', incorrect: 'rgb(220, 20, 60)', caret: 'rgb(255, 20, 147)' },
    default: { bg: 'rgb(30 41 59)', boba: 'rgb(255 255 255)', text: 'rgb(71 85 105)', correct: 'rgb(255 255 255)', incorrect: 'rgb(202, 71, 84)', caret: 'rgb(0 122 204)' }
  };
  
  const theme = themes[themeName] || themes.default;
  themeDef.setProperty('--main-bg-color', theme.bg);
  themeDef.setProperty('--boba-color', theme.boba);
  themeDef.setProperty('--p-text-color', theme.text);
  themeDef.setProperty('--correct-color', theme.correct);
  themeDef.setProperty('--incorrect-color', theme.incorrect);
  themeDef.setProperty('--caret-color', theme.caret);
}

clearBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all scores?')) {
    localStorage.removeItem('scores');
    currentPage = 1;
    loadScores();
  }
});

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    loadScores();
  }
});

nextBtn.addEventListener('click', () => {
  const scores = getFilteredScores();
  const totalPages = Math.ceil(scores.length / scoresPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    loadScores();
  }
});

filterDuration.addEventListener('change', () => {
  currentPage = 1;
  loadScores();
});

filterWords.addEventListener('change', () => {
  currentPage = 1;
  loadScores();
});

setTheme();
loadScores();
