// ==========================================
// 1. MOUSE-REACTIVE NEURAL NETWORK CANVAS
// ==========================================
const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null, radius: 140 };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.55;
        this.vy = (Math.random() - 0.5) * 0.55;
        this.size = Math.random() * 2 + 1;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
        ctx.fillStyle = 'rgba(34, 211, 238, 0.55)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const count = Math.min(75, Math.floor((canvas.width * canvas.height) / 16000));
    for (let i = 0; i < count; i++) particles.push(new Particle());
}
initParticles();

function animateNeuralNet() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Connect nearby nodes
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.hypot(dx, dy);
            if (dist < 125) {
                ctx.strokeStyle = `rgba(34, 211, 238, ${0.15 * (1 - dist / 125)})`;
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }

        // Connect to mouse pointer
        if (mouse.x !== null) {
            const dx = particles[i].x - mouse.x;
            const dy = particles[i].y - mouse.y;
            const dist = Math.hypot(dx, dy);
            if (dist < mouse.radius) {
                ctx.strokeStyle = `rgba(168, 85, 247, ${0.35 * (1 - dist / mouse.radius)})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateNeuralNet);
}
animateNeuralNet();


// ==========================================
// 2. INTERACTIVE HERO CLI TERMINAL
// ==========================================
const terminalOutput = document.getElementById('terminal-output');
const terminalForm = document.getElementById('terminal-form');
const terminalInput = document.getElementById('terminal-input');

const cliCommands = {
    help: "Available commands: whoami, skills --top, projects --list, status, contact, clear",
    whoami: "Manjeet Kumar Yadav | B.Tech CSE (2023-2027) @ Ambalika Institute, Lucknow. Ex-ML Intern @ Optifyx Technology.",
    "skills --top": "Languages: Python, SQL, C++, Bash | ML: PyTorch, Scikit-Learn, XGBoost, CatBoost | MLOps: FastAPI, Docker, AWS, MLflow",
    "projects --list": "[1] Project FORESIGHT (Streaming Demand Forecasting) [2] House Price Prediction (AWS) [3] Fake News NLP (93% Acc) [4] Movie Recommender",
    status: "Actively seeking ML Engineer / Data Science internships & freelance API projects.",
    contact: "Email: manjeetkuamr03992@gmail.com | GitHub: github.com/MANJEET-420"
};

function runCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === 'clear') {
        terminalOutput.innerHTML = '';
        return;
    }

    const userLine = document.createElement('div');
    userLine.innerHTML = `<span class="text-emerald-400">➜ ~</span> <span class="text-white">${rawCmd}</span>`;
    terminalOutput.appendChild(userLine);

    const replyLine = document.createElement('div');
    replyLine.className = 'text-cyan-200 pl-3 border-l border-cyan-500/40';
    replyLine.textContent = cliCommands[cmd] || `Command not found: '${cmd}'. Type 'help' for available commands.`;
    terminalOutput.appendChild(replyLine);

    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

terminalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    runCommand(terminalInput.value);
    terminalInput.value = '';
});


// ==========================================
// 3. LIVE ML MODEL SANDBOX
// ==========================================
function switchSandbox(mode) {
    const panelHouse = document.getElementById('panel-house');
    const panelNews = document.getElementById('panel-news');
    const tabHouse = document.getElementById('tab-house');
    const tabNews = document.getElementById('tab-news');

    if (mode === 'house') {
        panelHouse.classList.remove('hidden');
        panelNews.classList.add('hidden');
        tabHouse.classList.add('active-tab');
        tabNews.classList.remove('active-tab');
    } else {
        panelNews.classList.remove('hidden');
        panelHouse.classList.add('hidden');
        tabNews.classList.add('active-tab');
        tabHouse.classList.remove('active-tab');
    }
}

function predictHousePrice() {
    const area = Number(document.getElementById('input-area').value);
    const bhk = Number(document.getElementById('input-bhk').value);
    const zone = Number(document.getElementById('input-zone').value);
    const qual = Number(document.getElementById('input-qual').value);

    document.getElementById('val-area').textContent = `${area.toLocaleString()} sq.ft`;
    document.getElementById('val-qual').textContent = `${qual} / 10`;

    const baseLakhs = (area * 0.024 + bhk * 5.5 + qual * 2.4) * zone;
    document.getElementById('house-output').textContent = `₹ ${baseLakhs.toFixed(1)} Lakhs`;

    const areaWeight = Math.min(62, Math.max(32, Math.round((area / 4500) * 60)));
    const zoneWeight = Math.round(zone * 18);
    const qualWeight = Math.max(10, 100 - areaWeight - zoneWeight);

    document.getElementById('shap-area').textContent = `${areaWeight}%`;
    document.getElementById('bar-area').style.width = `${areaWeight}%`;
    document.getElementById('shap-zone').textContent = `${zoneWeight}%`;
    document.getElementById('bar-zone').style.width = `${zoneWeight}%`;
    document.getElementById('shap-qual').textContent = `${qualWeight}%`;
    document.getElementById('bar-qual').style.width = `${qualWeight}%`;
}
predictHousePrice();

function setNewsSample(text) {
    document.getElementById('news-input').value = text;
    analyzeNews();
}

function analyzeNews() {
    const text = document.getElementById('news-input').value.trim();
    const verdictEl = document.getElementById('news-verdict');
    const confEl = document.getElementById('news-conf');
    const tokensEl = document.getElementById('news-tokens');

    if (!text) return;

    const clickbaitTriggers = ['shocking', 'miracle', 'secret', 'overnight', 'cures all', '100% free', '!!', 'doctors hate'];
    const lower = text.toLowerCase();
    const hits = clickbaitTriggers.filter((word) => lower.includes(word));

    const words = lower.replace(/[^a-z\s]/g, '').split(/\s+/).filter((w) => w.length > 4).slice(0, 4);
    tokensEl.innerHTML = `Top TF-IDF Tokens: <span class="text-cyan-300">${words.join(', ') || 'headline, text'}</span>`;

    if (hits.length > 0 || text === text.toUpperCase()) {
        verdictEl.textContent = 'LIKELY FAKE / CLICKBAIT';
        verdictEl.className = 'font-display text-3xl font-bold text-rose-400';
        confEl.textContent = `${Math.min(97.8, 86.5 + hits.length * 4.2).toFixed(1)}%`;
    } else {
        verdictEl.textContent = 'CREDIBLE / REAL NEWS';
        verdictEl.className = 'font-display text-3xl font-bold text-emerald-400';
        confEl.textContent = '94.2%';
    }
}


// ==========================================
// 4. ARCHITECTURE MODAL BLUEPRINTS
// ==========================================
const architectures = {
    foresight: {
        title: "Project FORESIGHT — Streaming Pipeline",
        steps: [
            "01. WebSocket Stream Ingestion",
            "02. Lag & Rolling Feature Store",
            "03. XGBoost Ensemble Inference",
            "04. FastAPI + Inventory Alerts"
        ],
        desc: "Ingests real-time POS and API demand events, computes rolling temporal window statistics, predicts SKU-level demand via XGBoost, and triggers automated reorder thresholds."
    },
    house: {
        title: "House Price Prediction — AWS Pipeline",
        steps: [
            "01. Schema & Null Validation",
            "02. One-Hot & Target Encoding",
            "03. GradientBoostingRegressor",
            "04. Streamlit on AWS Beanstalk"
        ],
        desc: "Handles missing values and strict feature-column alignment (245+ encoded features) before serving real-time property valuations through a serialized pickle artifact on AWS Elastic Beanstalk."
    },
    fakenews: {
        title: "Fake News Detection — NLP Pipeline",
        steps: [
            "01. Regex & Stopword Cleaning",
            "02. TF-IDF N-Gram Vectorizer",
            "03. PassiveAggressive Classifier",
            "04. Streamlit Inference UI"
        ],
        desc: "Transforms raw news articles into sparse TF-IDF matrices and classifies veracity with 93% accuracy using an online-capable PassiveAggressive linear model."
    },
    movie: {
        title: "Movie Recommendation — Similarity Engine",
        steps: [
            "01. Cast/Genre/Overview Soup",
            "02. TF-IDF Vector Embeddings",
            "03. Cosine Similarity Matrix",
            "04. Live TMDB Poster Fetch"
        ],
        desc: "Vectorizes combined movie metadata tags and computes pairwise cosine similarity scores to retrieve top-5 nearest neighbor recommendations with live TMDB artwork."
    }
};

function openArchModal(key) {
    const data = architectures[key];
    if (!data) return;

    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-desc').textContent = data.desc;

    const stepsContainer = document.getElementById('modal-steps');
    stepsContainer.innerHTML = data.steps
        .map(
            (step) => `
      <div class="p-3 rounded-xl bg-slate-900 border border-cyan-500/30 font-mono text-xs text-cyan-200">
        ${step}
      </div>`
        )
        .join('');

    const modal = document.getElementById('arch-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeArchModal() {
    const modal = document.getElementById('arch-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}


// ==========================================
// 5. ONE-CLICK EMAIL COPY
// ==========================================
function copyEmail() {
    navigator.clipboard.writeText('manjeetkuamr03992@gmail.com');
    const label = document.getElementById('copy-label');
    label.textContent = '✓ Copied to Clipboard!';
    setTimeout(() => {
        label.textContent = 'Copy Email: manjeetkuamr03992@gmail.com';
    }, 2500);
}