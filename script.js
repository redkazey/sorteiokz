console.log("Script Carregado!");

// --- INICIALIZAÇÃO DOS EFEITOS ---
const confetti = new JSConfetti();

function tocarSomEfeito() {
    const som = document.getElementById('somFesta');
    if(som) {
        som.currentTime = 0;
        som.play().catch(e => console.log("Som autoplay bloqueado:", e));
    }
}

function soltarConfetes() {
    confetti.addConfetti({
        confettiNumber: 90,
        confettiColors: [
            '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff'
        ],
        confettiRadius: 6,
        confettiSpeed: 2,
    });
}

// --- TROCA DE ABAS ---
document.addEventListener('DOMContentLoaded', function() {
    const botoes = document.querySelectorAll('.tab-btn');
    const abas = document.querySelectorAll('.tab-content');

    botoes.forEach(btn => {
        btn.addEventListener('click', () => {
            const alvo = btn.dataset.tab;
            botoes.forEach(b => b.classList.remove('active'));
            abas.forEach(a => a.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(alvo).classList.add('active');
        });
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
        if(contador > 12) {
            clearInterval(intervalo);
            tocarSomEfeito();
            soltarConfetes();
        }
    }, 80);
}

// --- 2. SORTEIO DE NOMES (SISTEMA DE TAGS) ---
let listaNomes = [];

function adicionarNome() {
    const input = document.getElementById('novoNome');
    const nome = input.value.trim();
    
    if(nome && !listaNomes.includes(nome)) {
        listaNomes.push(nome);
        atualizarVisualizacaoNomes();
        input.value = '';
    }
    input.focus();
}

function removerNome(nome) {
    listaNomes = listaNomes.filter(n => n !== nome);
    atualizarVisualizacaoNomes();
}

function limparNomes() {
    listaNomes = [];
    atualizarVisualizacaoNomes();
}

function atualizarVisualizacaoNomes() {
    const container = document.getElementById('listaNomesContainer');
    container.innerHTML = '';
    
    listaNomes.forEach(nome => {
        const tag = document.createElement('div');
        tag.className = 'tag-item';
        tag.innerHTML = `${nome} <button onclick="removerNome('${nome}')">&times;</button>`;
        container.appendChild(tag);
    });
}

function sortearNome() {
    const resultadoEl = document.getElementById('resultadoNome');

    if (listaNomes.length === 0) {
        alert('Adicione pelo menos um nome!');
        return;
    }

    let contador = 0;
    const intervalo = setInterval(() => {
        const aleatorio = listaNomes[Math.floor(Math.random() * listaNomes.length)];
        resultadoEl.textContent = aleatorio;
        contador++;
        if(contador > 15) {
            clearInterval(intervalo);
            tocarSomEfeito();
            soltarConfetes();
        }
    }, 100);
}

// --- 3. ROLETA EDITÁVEL ---
const canvas = document.getElementById('roletaCanvas');
let opcoesRoleta = ['Prêmio 1', 'Prêmio 2', 'Prêmio 3', 'Prêmio 4', 'Prêmio 5', 'Prêmio 6'];
const cores = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FF9FF3', '#54A0FF'];

if (canvas) {
    const ctx = canvas.getContext('2d');
    const tamanho = 300;
    canvas.width = tamanho;
    canvas.height = tamanho;

    function desenharRoleta() {
        ctx.clearRect(0, 0, tamanho, tamanho);
        const anguloPorCorte = (2 * Math.PI) / opcoesRoleta.length;
        
        opcoesRoleta.forEach((opcao, i) => {
            const inicio = i * anguloPorCorte;
            const fim = (i + 1) * anguloPorCorte;

            ctx.beginPath();
            ctx.moveTo(tamanho/2, tamanho/2);
            ctx.arc(tamanho/2, tamanho/2, tamanho/2, inicio, fim);
            ctx.closePath();
            ctx.fillStyle = cores[i % cores.length];
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            ctx.save();
            ctx.translate(tamanho/2, tamanho/2);
            ctx.rotate(inicio + anguloPorCorte / 2);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 12px Inter';
            ctx.fillText(opcao.substring(0, 12), 40, 5);
            ctx.restore();
        });
    }

    window.adicionarOpcao = function() {
        const input = document.getElementById('novaOpcao');
        const texto = input.value.trim();
        
        if(texto && !opcoesRoleta.includes(texto)) {
            opcoesRoleta.push(texto);
            atualizarListaVisual();
            desenharRoleta();
            input.value = '';
        }
        input.focus();
    }

    window.removerOpcao = function(item) {
        opcoesRoleta = opcoesRoleta.filter(o => o !== item);
        atualizarListaVisual();
        desenharRoleta();
    }

    function atualizarListaVisual() {
        const container = document.getElementById('listaOpcoesContainer');
        if(!container) return;
        
        container.innerHTML = '';
        opcoesRoleta.forEach(opcao => {
            const tag = document.createElement('div');
            tag.className = 'tag-item';
            tag.innerHTML = `${opcao} <button onclick="removerOpcao('${opcao}')">&times;</button>`;
            container.appendChild(tag);
        });
    }

    window.girarRoleta = function() {
        if(opcoesRoleta.length < 2) {
            alert('Adicione pelo menos 2 opções!');
            return;
        }

        const anguloAleatorio = Math.random() * 360 + 360 * 5;
        canvas.style.transition = 'transform 4s cubic-bezier(0.2, 0.8, 0.2, 1)';
        canvas.style.transform = `rotate(${anguloAleatorio}deg)`;
        
        setTimeout(() => {
            const resultado = opcoesRoleta[Math.floor(Math.random() * opcoesRoleta.length)];
            document.getElementById('resultadoRoleta').textContent = resultado;
            tocarSomEfeito();
            soltarConfetes();
        }, 4000);
    }

    // Inicializar
    atualizarListaVisual();
    desenharRoleta();
}

// --- 4. CARA OU COROA PROFISSIONAL ---
window.jogarMoeda = function() {
    const moedaEl = document.getElementById('moeda');
    const resultadoEl = document.getElementById('resultadoMoeda');
    const textoCaraInput = document.getElementById('textoCara');
    const textoCoroaInput = document.getElementById('textoCoroa');
    
    if(!moedaEl) return;

    document.getElementById('textoCaraDisplay').innerText = textoCaraInput.value || 'CARA';
    document.getElementById('textoCoroaDisplay').innerText = textoCoroaInput.value || 'COROA';

    moedaEl.classList.remove('parando', 'cara-final', 'coroa-final');
    void moedaEl.offsetWidth;
    
    moedaEl.classList.add('girando');

    setTimeout(() => {
        moedaEl.classList.remove('girando');
        
        const sorteio = Math.random() < 0.5 ? 'CARA' : 'COROA';
        const textoFinal = sorteio === 'CARA' ? textoCaraInput.value : textoCoroaInput.value;
        resultadoEl.textContent = textoFinal || sorteio;

        if(sorteio === 'CARA') {
            moedaEl.classList.add('parando', 'cara-final');
        } else {
            moedaEl.classList.add('parando', 'coroa-final');
        }

        setTimeout(() => {
            tocarSomEfeito();
            soltarConfetes();
        }, 800);

    }, 1000);
}
