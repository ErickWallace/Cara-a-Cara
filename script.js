/* ===================================================
   SORTEADOR CARA A CARA — script.js
   =================================================== */

/* --------------------------------------------------
   PERSONAGENS
   Para trocar nomes ou imagens, edite este array.
   - "nome": texto exibido abaixo do card e na miniatura
   - "imagem": caminho relativo a partir do index.html
   Adicione ou remova objetos conforme necessário.
   -------------------------------------------------- */
const personagens = [
  { nome: "Erick", imagem: "img/1erick.png" },
  { nome: "Laura", imagem: "img/2laura.png" },
  { nome: "Gabriel", imagem: "img/3gabriel.png" },
  { nome: "Rebeka", imagem: "img/4rebeka.png" },
  { nome: "Carlos", imagem: "img/5carlos.png" },
  { nome: "Gabrielle", imagem: "img/6gabriele.png" },
  { nome: "Larissa", imagem: "img/7larissa.png" },
  { nome: "Estevão", imagem: "img/8estevão.png" },
  { nome: "Leandro", imagem: "img/9leandro.png" },
  { nome: "Andresa", imagem: "img/10andresa.png" },
  { nome: "João", imagem: "img/11joão.png" },
  { nome: "Verônica", imagem: "img/12veronica.png" },
  { nome: "Arthur", imagem: "img/13arthur.png" },
  { nome: "Elisa", imagem: "img/14elisa.png" },
  { nome: "Gustavo", imagem: "img/15gustavo.png" },
  { nome: "Raquel", imagem: "img/16raquel.png" },
  { nome: "Jessé", imagem: "img/17jessé.png" },
  { nome: "Liciana", imagem: "img/18liciane.png" },
  { nome: "Adrielle", imagem: "img/19adrielle.png" },
  { nome: "Gislei", imagem: "img/20gislei.png" },
  { nome: "Giovana", imagem: "img/21giovana.png" },
  { nome: "Barneh", imagem: "img/22baerneh.png" },
  { nome: "Leonardo", imagem: "img/23leo.png" },
  { nome: "Junia", imagem: "img/24junia.png" },
];

/* --------------------------------------------------
   CONFIGURAÇÕES DA ANIMAÇÃO SLOT MACHINE
   -------------------------------------------------- */
const CONFIG = {
  totalPassagens: 36,      // Quantas trocas de imagem ocorrem
  intervaloInicial: 60,    // ms entre trocas no início (rápido)
  intervaloFinal: 380,     // ms entre trocas no fim (lento)
  aceleracaoInicio: 0.25,  // Fração da animação em velocidade máxima
};

/* --------------------------------------------------
   REFERÊNCIAS AO DOM
   -------------------------------------------------- */
const imagemPrincipal  = document.getElementById("imagem-principal");
const cardPrincipal    = document.getElementById("card-principal");
const nomeResultado    = document.getElementById("nome-resultado");
const btnSortear       = document.getElementById("btn-sortear");
const btnNovo          = document.getElementById("btn-novo");
const gradePersonagens = document.getElementById("grade-personagens");
const confeteContainer = document.getElementById("confete-container");

/* --------------------------------------------------
   ESTADO DA APLICAÇÃO
   -------------------------------------------------- */
let sorteando       = false;   // Impede cliques duplos
let passoAtual      = 0;       // Contador de trocas da animação
let indiceVencedor  = -1;      // Índice do personagem sorteado
let timeoutAtual    = null;    // Referência ao setTimeout em andamento

/* --------------------------------------------------
   INICIALIZAÇÃO
   -------------------------------------------------- */
function init() {
  construirGrade();
  restaurarUltimoSorteio();
}

/* --------------------------------------------------
   GRADE DE MINIATURAS
   Cria dinamicamente os cards de cada personagem
   -------------------------------------------------- */
function construirGrade() {
  gradePersonagens.innerHTML = "";

  personagens.forEach((p, i) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("miniatura");
    wrapper.setAttribute("role", "listitem");
    wrapper.dataset.indice = i;

    const cardMini = document.createElement("div");
    cardMini.classList.add("miniatura-card");

    const img = document.createElement("img");
    img.src  = p.imagem;
    img.alt  = p.nome;
    img.loading = "lazy";

    const nome = document.createElement("span");
    nome.classList.add("miniatura-nome");
    nome.textContent = p.nome;

    cardMini.appendChild(img);
    wrapper.appendChild(cardMini);
    wrapper.appendChild(nome);
    gradePersonagens.appendChild(wrapper);
  });
}

/* --------------------------------------------------
   SORTEIO PRINCIPAL
   Inicia a animação slot machine ao clicar em "Sortear"
   -------------------------------------------------- */
function iniciarSorteio() {
  if (sorteando) return;

  sorteando      = true;
  passoAtual     = 0;
  indiceVencedor = Math.floor(Math.random() * personagens.length);

  /* Reseta visual */
  limparDestaque();
  nomeResultado.textContent = "";
  nomeResultado.classList.remove("visivel");
  cardPrincipal.classList.remove("vencedor");
  cardPrincipal.classList.add("sorteando");
  btnSortear.disabled    = true;
  btnNovo.style.display  = "none";

  animarSlot();
}

/* --------------------------------------------------
   ANIMAÇÃO SLOT MACHINE
   Easing exponencial: interval aumenta com o tempo,
   criando o efeito de desaceleração gradual.
   -------------------------------------------------- */
function animarSlot() {
  const progresso = passoAtual / CONFIG.totalPassagens;

  /* Calcula o intervalo atual por easing */
  let intervalo;
  if (progresso < CONFIG.aceleracaoInicio) {
    /* Fase rápida */
    intervalo = CONFIG.intervaloInicial;
  } else {
    /* Fase de desaceleração: interpolação exponencial */
    const t = (progresso - CONFIG.aceleracaoInicio) / (1 - CONFIG.aceleracaoInicio);
    const ease = t * t * t;  /* cubic ease-in */
    intervalo = CONFIG.intervaloInicial + (CONFIG.intervaloFinal - CONFIG.intervaloInicial) * ease;
  }

  /* Na última passagem, usa o vencedor; nas demais, índice aleatório */
  const ehUltimo = passoAtual >= CONFIG.totalPassagens - 1;
  const indice   = ehUltimo ? indiceVencedor : indiceAleatorio();

  trocarImagem(indice);

  passoAtual++;

  if (!ehUltimo) {
    timeoutAtual = setTimeout(animarSlot, intervalo);
  } else {
    /* Sorteio concluído */
    setTimeout(finalizarSorteio, 100);
  }
}

/* --------------------------------------------------
   FINALIZAÇÃO DO SORTEIO
   -------------------------------------------------- */
function finalizarSorteio() {
  const vencedor = personagens[indiceVencedor];

  /* Visual do card vencedor */
  cardPrincipal.classList.remove("sorteando");
  cardPrincipal.classList.add("vencedor");

  /* Nome do personagem */
  nomeResultado.textContent = vencedor.nome;
  nomeResultado.classList.add("visivel");

  /* Destaca miniatura */
  destacarMiniatura(indiceVencedor);

  /* Confete */
  dispararConfete();

  /* Botões */
  btnNovo.style.display   = "flex";
  btnSortear.disabled     = false;
  sorteando               = false;

  /* Salva no localStorage */
  salvarNoStorage(indiceVencedor);

  /* Rola suavemente para o card */
  cardPrincipal.scrollIntoView({ behavior: "smooth", block: "center" });
}

/* --------------------------------------------------
   TROCA DE IMAGEM NO CARD PRINCIPAL
   -------------------------------------------------- */
function trocarImagem(indice) {
  const p = personagens[indice];
  imagemPrincipal.src = p.imagem;
  imagemPrincipal.alt = p.nome;
}

/* --------------------------------------------------
   ÍNDICE ALEATÓRIO (diferente do vencedor para variação)
   -------------------------------------------------- */
function indiceAleatorio() {
  return Math.floor(Math.random() * personagens.length);
}

/* --------------------------------------------------
   DESTAQUE NA MINIATURA
   -------------------------------------------------- */
function destacarMiniatura(indice) {
  limparDestaque();
  const miniatura = gradePersonagens.querySelector(`[data-indice="${indice}"]`);
  if (miniatura) {
    miniatura.classList.add("destaque");
    /* Rola para a miniatura após um pequeno delay */
    setTimeout(() => {
      miniatura.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 800);
  }
}

function limparDestaque() {
  const atual = gradePersonagens.querySelector(".miniatura.destaque");
  if (atual) atual.classList.remove("destaque");
}

/* --------------------------------------------------
   CONFETE
   Cria peças coloridas que caem da parte superior
   -------------------------------------------------- */
function dispararConfete() {
  const cores  = ["#FF6B2B", "#1A73E8", "#FFD600", "#22C55E", "#FF4D8D", "#A855F7"];
  const formas = ["square", "circle", "rect"];
  const total  = 80;

  for (let i = 0; i < total; i++) {
    const piece = document.createElement("div");
    piece.classList.add("confete-piece");

    /* Posição horizontal aleatória */
    const left     = Math.random() * 100;
    const cor      = cores[Math.floor(Math.random() * cores.length)];
    const duracao  = 2.5 + Math.random() * 2;
    const delay    = Math.random() * 0.8;
    const tamanho  = 6 + Math.random() * 10;
    const forma    = formas[Math.floor(Math.random() * formas.length)];

    piece.style.cssText = `
      left: ${left}%;
      background: ${cor};
      width: ${tamanho}px;
      height: ${forma === "rect" ? tamanho * 2 : tamanho}px;
      border-radius: ${forma === "circle" ? "50%" : forma === "rect" ? "2px" : "2px"};
      animation-duration: ${duracao}s;
      animation-delay: ${delay}s;
    `;

    confeteContainer.appendChild(piece);

    /* Remove após a animação terminar */
    setTimeout(() => {
      piece.remove();
    }, (duracao + delay + 0.5) * 1000);
  }
}

/* --------------------------------------------------
   LOCALSTORAGE — Salvar e restaurar último sorteio
   -------------------------------------------------- */
const STORAGE_KEY = "cara-a-cara-ultimo-sorteio";

function salvarNoStorage(indice) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ indice }));
  } catch (e) {
    /* localStorage pode estar bloqueado em alguns contextos */
    console.warn("Não foi possível salvar no localStorage:", e);
  }
}

function restaurarUltimoSorteio() {
  try {
    const dado = localStorage.getItem(STORAGE_KEY);
    if (!dado) return;

    const { indice } = JSON.parse(dado);
    if (typeof indice !== "number" || indice < 0 || indice >= personagens.length) return;

    /* Exibe o último personagem sem animação */
    trocarImagem(indice);
    nomeResultado.textContent = personagens[indice].nome;
    nomeResultado.classList.add("visivel");
    destacarMiniatura(indice);
    btnNovo.style.display = "flex";
  } catch (e) {
    console.warn("Não foi possível restaurar do localStorage:", e);
  }
}

/* --------------------------------------------------
   NOVO SORTEIO
   Reseta tudo para o estado inicial sem recarregar
   -------------------------------------------------- */
function novoSorteio() {
  /* Cancela qualquer animação pendente */
  if (timeoutAtual) {
    clearTimeout(timeoutAtual);
    timeoutAtual = null;
  }

  sorteando   = false;
  passoAtual  = 0;

  /* Reseta visuais */
  cardPrincipal.classList.remove("vencedor", "sorteando");
  limparDestaque();
  nomeResultado.textContent = "";
  nomeResultado.classList.remove("visivel");
  btnNovo.style.display  = "none";
  btnSortear.disabled    = false;

  /* Volta à primeira imagem como estado neutro */
  trocarImagem(0);

  /* Sobe para o topo suavemente */
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* --------------------------------------------------
   EFEITO RIPPLE NOS BOTÕES
   -------------------------------------------------- */
function criarRipple(event) {
  const btn    = event.currentTarget;
  const rect   = btn.getBoundingClientRect();
  const size   = Math.max(rect.width, rect.height);
  const x      = (event.clientX || event.touches?.[0]?.clientX || rect.left + rect.width / 2) - rect.left - size / 2;
  const y      = (event.clientY || event.touches?.[0]?.clientY || rect.top + rect.height / 2) - rect.top - size / 2;

  const ripple = document.createElement("span");
  ripple.classList.add("btn-ripple");
  ripple.style.cssText = `width:${size}px; height:${size}px; left:${x}px; top:${y}px;`;

  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 500);
}

/* --------------------------------------------------
   EVENT LISTENERS
   -------------------------------------------------- */
btnSortear.addEventListener("click", (e) => {
  criarRipple(e);
  iniciarSorteio();
});

btnNovo.addEventListener("click", (e) => {
  criarRipple(e);
  novoSorteio();
});

/* Suporte a toque nos botões (ripple) */
btnSortear.addEventListener("touchstart", criarRipple, { passive: true });
btnNovo.addEventListener("touchstart", criarRipple, { passive: true });

/* --------------------------------------------------
   INICIA A APLICAÇÃO
   -------------------------------------------------- */
init();
