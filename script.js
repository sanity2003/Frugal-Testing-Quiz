const questionsDB = {
    technical: {
        easy: [
            { q: "HTML stands for?", o: ["Hyper Text Markup Language", "High Text Maker", "Hyper Tool Multi", "None"], a: 0 },
            { q: "Which tag is used for JS?", o: ["<css>", "<script>", "<js>", "<javascript>"], a: 1 },
            { q: "What is 2 + '2' in JS?", o: ["4", "22", "NaN", "Error"], a: 1 }
        ]
    }
};


let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;
let timeSpentData = [];
let correctCount = 0;
let wrongCount = 0;
let scoreChartInstance = null;
let timeChartInstance = null;

function startQuiz() {
    document.getElementById('landing-page').classList.add('hidden');
    document.getElementById('result-page').classList.add('hidden');
    document.getElementById('quiz-page').classList.remove('hidden');
    document.querySelector('.container').classList.remove('wide-mode');

    const cat = document.getElementById('category').value;
    const diff = document.getElementById('difficulty').value;
    
    if (questionsDB[cat] && questionsDB[cat][diff]) {
        currentQuestions = questionsDB[cat][diff];
    } else {
        currentQuestions = questionsDB['technical']['easy']; 
    }

    currentIndex = 0;
    score = 0;
    correctCount = 0;
    wrongCount = 0;
    timeSpentData = [];
    
    loadQuestion();
}

function loadQuestion() {
    clearInterval(timer);
    timeLeft = 15;
    document.getElementById('timer-display').innerText = `Time: ${timeLeft}`;
    
    if (currentIndex >= currentQuestions.length) {
        showResults();
        return;
    }

    const qData = currentQuestions[currentIndex];
    document.getElementById('question-text').innerText = qData.q;
    document.getElementById('progress-display').innerText = `Question ${currentIndex + 1} / ${currentQuestions.length}`;
    
    const optsContainer = document.getElementById('options-container');
    optsContainer.innerHTML = '';

    qData.o.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.className = 'option-btn';
        btn.type = "button"; // Reload Preventer
        
        btn.onclick = function(e) {
            e.preventDefault();
            submitAnswer(index);
        };
        
        optsContainer.appendChild(btn);
    });

    startTimer();
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer-display').innerText = `Time: ${timeLeft}`;
        if (timeLeft <= 0) {
            submitAnswer(-1);
        }
    }, 1000);
}

function submitAnswer(selectedIndex) {
    clearInterval(timer);
    timeSpentData.push(15 - timeLeft);

    if (selectedIndex === currentQuestions[currentIndex].a) {
        score += 5;
        correctCount++;
    } else {
        wrongCount++;
    }

    currentIndex++;
    
    
    setTimeout(() => {
        loadQuestion();
    }, 500); 
}

function showResults() {
    document.getElementById('quiz-page').classList.add('hidden');
    document.getElementById('result-page').classList.remove('hidden');
    document.querySelector('.container').classList.add('wide-mode');

    animateScore(score);
    renderCharts();
}

function animateScore(finalScore) {
    let current = 0;
    const element = document.getElementById('animated-score');
    if (finalScore === 0) { element.innerText = 0; return; }
    const increment = Math.ceil(finalScore / 50);
    const t = setInterval(() => {
        current += increment;
        if (current >= finalScore) { current = finalScore; clearInterval(t); }
        element.innerText = current;
    }, 20);
}

function renderCharts() {
    if (scoreChartInstance) scoreChartInstance.destroy();
    if (timeChartInstance) timeChartInstance.destroy();

    const ctx1 = document.getElementById('scoreChart').getContext('2d');
    scoreChartInstance = new Chart(ctx1, {
        type: 'doughnut',
        data: { labels: ['Correct', 'Incorrect'], datasets: [{ data: [correctCount, wrongCount], backgroundColor: ['#38ef7d', '#ff6b6b'], borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false }
    });

    const ctx2 = document.getElementById('timeChart').getContext('2d');
    timeChartInstance = new Chart(ctx2, {
        type: 'bar',
        data: { labels: currentQuestions.map((_, i) => `Q${i + 1}`), datasets: [{ label: 'Time', data: timeSpentData, backgroundColor: '#667eea' }] },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 15 } } }
    });
}


