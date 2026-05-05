// --- TROCA DE ABAS ---
const botoes = document.querySelectorAll('.tab-btn');
const abas = document.querySelectorAll('.tab-content');

botoes.forEach(btn => {
    btn.addEventListener('click', () => {
        const alvo = btn.dataset.tab;
        
        // Remove active de todos
        botoes.forEach(b => b.classList.remove('active'));
        abas.forEach(a => a.classList.remove('active'));
        
        // Adiciona active no clicado
        btn.classList.add('active');
        document.getElementById(alvo).classList.add('active');
    });
});

// --- 1. SORTEIO DE NÚMEROS ---
function sortearNumero() {
    const min = parseInt(document.getElementById('numMin').value);
    const max = parseInt(document.getElementById('numMax').value);
    const resultadoEl = document.getElementById('resultadoNum');

    if (isNaN(min) || isNaN(max) || min >= max) {
        alert('Digite valores válidos!');
        return;
    }

    let contador = 0;
    const intervalo = setInterval(() => {
        const aleatorio = Math.floor(Math.random() * (max - min + 1)) + min;
        resultadoEl.textContent = aleatorio;
        contador++;
        if(contador > 10) clearInterval(intervalo);
    }, 80);
}

// --- 2. SORTEIO DE NOMES ---
function sortearNome() {
    const texto = document.getElementById('listaNomes').value;
    const nomes = texto.split('\n').filter(nome => nome.trim() !== '');
    const resultadoEl = document.getElementById('resultadoNome');

    if (nomes.length === 0) {
        alert('Adicione pelo menos um nome!');
        return;
    }

    let contador = 0;
    const intervalo = setInterval(() => {
        const aleatorio = nomes[Math.floor(Math.random() * nomes.length)];
        resultadoEl.textContent = aleatorio;
        contador++;
        if(contador > 15) clearInterval(intervalo);
    }, 100);
}

// --- 3. ROLETA ---
const canvas = document.getElementById('roleta');
const ctx = canvas.getContext('2d');
const tamanho = 300;
canvas.width = tamanho;
canvas.height = tamanho;

const opcoes = ['Prêmio 1', 'Prêmio 2', 'Prêmio 3', 'Prêmio 4', 'Prêmio 5', 'Prêmio 6'];
const cores = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

function desenharRoleta() {
    const anguloPorCorte = (2 * Math.PI) / opcoes.length;
    
    opcoes.forEach((opcao, i) => {
        const inicio = i * anguloPorCorte;
        const fim = (i + 1) * anguloPorCorte;

        ctx.beginPath();
        ctx.moveTo(tamanho/2, tamanho/2);
        ctx.arc(tamanho/2, tamanho/2, tamanho/2, inicio, fim);
        ctx.fillStyle = cores[i];
        ctx.fill();
        
        // Texto
        ctx.save();
        ctx.translate(tamanho/2, tamanho/2);
        ctx.rotate(inicio + anguloPorCorte / 2);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Inter';
        ctx.fillText(opcao, 50, 5);
        ctx.restore();
    });
}
desenharRoleta();

function girarRoleta() {
    const anguloAleatorio = Math.random() * 360 + 360 * 5; // Gira 5x + parada
    canvas.style.transform = `rotate(${anguloAleatorio}deg)`;
    
    setTimeout(() => {
        const resultado = opcoes[Math.floor(Math.random() * opcoes.length)];
        document.getElementById('resultadoRoleta').textContent = resultado;
    }, 4000);
}

// --- 4. CARA OU COROA ---
function jogarMoeda() {
    const moedaEl = document.getElementById('moeda');
    const resultadoEl = document.getElementById('resultadoMoeda');
    
    moedaEl.classList.remove('virar');
    void moedaEl.offsetWidth; // Reset animação
    moedaEl.classList.add('virar');
    
    setTimeout(() => {
        const sorteio = Math.random() < 0.5 ? 'CARA' : 'COROA';
        resultadoEl.textContent = sorteio;
    }, 1000);
}
