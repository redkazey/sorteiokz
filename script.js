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
        emojis: ['🎉', '🎊', '✨', '💥', '⭐', '🎈'],
        emojiSize: 40,
        confettiNumber: 50,
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
        if(contador > 15) {
            clearInterval(intervalo);
            tocarSomEfeito();
            soltarConfetes();
        }
    }, 100);
}

// --- 3. ROLETA EDITÁVEL ---
const canvas = document.getElementById('roleta');
let opcoesRoleta = ['Prêmio 1', 'Prêmio 2', 'Prêmio 3', 'Prêmio 4', 'Prêmio 5', 'Prêmio 6'];
const cores = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FF9FF3', '#54a0ff'];

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
            ctx.fillStyle = cores[i % cores.length];
            ctx.fill();
            
            ctx.save();
            ctx.translate(tamanho/2, tamanho/2);
            ctx.rotate(inicio + anguloPorCorte / 2);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 12px Inter';
            ctx.fillText(opcao.substring(0, 12), 40, 5);
            ctx.restore();
        });
    }

    window.atualizarRoleta = function() {
        const texto = document.getElementById('opcoesRoleta').value;
        opcoesRoleta = texto.split('\n').filter(item => item.trim() !== '');
        
        if(opcoesRoleta.length < 2) {
            alert('Coloque pelo menos 2 opções!');
            return;
        }
        
        desenharRoleta();
        alert('Roleta atualizada! ✅');
    }

    window.girarRoleta = function() {
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

    desenharRoleta();
}

// --- 4. CARA OU COROA COM PERSONALIZAÇÃO ---
window.jogarMoeda = function() {
    const moedaEl = document.getElementById('moeda');
    const resultadoEl = document.getElementById('resultadoMoeda');
    const textoCaraInput = document.getElementById('textoCara');
    const textoCoroaInput = document.getElementById('textoCoroa');
    
    if(!moedaEl) return;

    // Atualiza os textos da moeda antes de jogar
    document.getElementById('ladoCara').innerText = textoCaraInput.value || 'CARA';
    document.getElementById('ladoCoroa').innerText = textoCoroaInput.value || 'COROA';

    // Resetar classes
    moedaEl.classList.remove('parando', 'cara-final', 'coroa-final');
    void moedaEl.offsetWidth;
    
    // Começar a girar muito rápido
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

        // Soltar efeito no final
        setTimeout(() => {
            tocarSomEfeito();
            soltarConfetes();
        }, 800);

    }, 1000); // Gira por 1 segundo
}
