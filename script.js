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

/*
  Para adicionar, remover ou editar personagens, altere apenas o array acima.
  Cada item precisa ter este formato:
  { nome: "Nome do personagem", imagem: "img/nome-da-imagem.png" }
*/

const storageKey = "cara-a-cara-ultimo-personagem";
const imageElement = document.querySelector("#characterImage");
const nameElement = document.querySelector("#characterName");
const winnerCard = document.querySelector("#winnerCard");
const drawButton = document.querySelector("#drawButton");
const newDrawButton = document.querySelector("#newDrawButton");
const charactersGrid = document.querySelector("#charactersGrid");
const totalCharacters = document.querySelector("#totalCharacters");
const confettiLayer = document.querySelector("#confettiLayer");

let isDrawing = false;
let selectedIndex = null;

function renderGrid() {
  charactersGrid.innerHTML = "";
  totalCharacters.textContent = `${personagens.length} cartas`;

  personagens.forEach((personagem, index) => {
    const card = document.createElement("article");
    card.className = "thumb-card";
    card.dataset.index = index;

    const img = document.createElement("img");
    img.src = personagem.imagem;
    img.alt = personagem.nome;
    img.loading = "lazy";

    const label = document.createElement("span");
    label.textContent = personagem.nome;

    card.append(img, label);
    charactersGrid.appendChild(card);
  });
}

function showCharacter(index) {
  const personagem = personagens[index];

  if (!personagem) {
    return;
  }

  imageElement.src = personagem.imagem;
  imageElement.alt = `Personagem sorteado: ${personagem.nome}`;
  nameElement.textContent = personagem.nome;
  selectedIndex = index;
  highlightThumbnail(index);
}

function highlightThumbnail(index) {
  document.querySelectorAll(".thumb-card").forEach((card) => {
    card.classList.toggle("is-selected", Number(card.dataset.index) === index);
  });
}

function getRandomIndex() {
  return Math.floor(Math.random() * personagens.length);
}

function getNextSlotIndex(currentIndex) {
  let nextIndex = getRandomIndex();

  if (personagens.length > 1) {
    while (nextIndex === currentIndex) {
      nextIndex = getRandomIndex();
    }
  }

  return nextIndex;
}

function startDraw() {
  if (isDrawing || personagens.length === 0) {
    return;
  }

  isDrawing = true;
  drawButton.disabled = true;
  newDrawButton.disabled = true;
  newDrawButton.classList.add("is-hidden");
  winnerCard.classList.remove("is-winner");
  winnerCard.classList.add("is-spinning");

  const finalIndex = getRandomIndex();
  const totalSteps = 34 + Math.floor(Math.random() * 10);
  let step = 0;
  let currentIndex = selectedIndex ?? getRandomIndex();

  function spin() {
    if (step >= totalSteps) {
      finishDraw(finalIndex);
      return;
    }

    if (step === totalSteps - 1) {
      currentIndex = finalIndex;
    } else {
      currentIndex = getNextSlotIndex(currentIndex);
    }

    showCharacter(currentIndex);
    step += 1;

    const progress = step / totalSteps;
    const delay = 42 + Math.pow(progress, 2.45) * 250;
    window.setTimeout(spin, delay);
  }

  spin();
}

function finishDraw(index) {
  showCharacter(index);
  localStorage.setItem(storageKey, JSON.stringify(personagens[index]));

  isDrawing = false;
  drawButton.disabled = false;
  newDrawButton.disabled = false;
  newDrawButton.classList.remove("is-hidden");
  winnerCard.classList.remove("is-spinning");

  window.requestAnimationFrame(() => {
    winnerCard.classList.add("is-winner");
    launchConfetti();
  });
}

function launchConfetti() {
  const colors = ["#2563eb", "#ff5f9e", "#ffd447", "#26c485", "#ff8a3d"];
  const amount = 54;

  confettiLayer.innerHTML = "";

  for (let i = 0; i < amount; i += 1) {
    const piece = document.createElement("span");
    const left = Math.random() * 100;
    const delay = Math.random() * 0.22;
    const duration = 1.15 + Math.random() * 0.75;
    const drift = `${Math.random() * 160 - 80}px`;

    piece.className = "confetti-piece";
    piece.style.left = `${left}%`;
    piece.style.background = colors[i % colors.length];
    piece.style.animationDelay = `${delay}s`;
    piece.style.animationDuration = `${duration}s`;
    piece.style.setProperty("--drift", drift);

    confettiLayer.appendChild(piece);
  }

  window.setTimeout(() => {
    confettiLayer.innerHTML = "";
  }, 2400);
}

function loadLastCharacter() {
  let savedCharacter = null;

  try {
    savedCharacter = JSON.parse(localStorage.getItem(storageKey) || "null");
  } catch (error) {
    localStorage.removeItem(storageKey);
  }

  const savedIndex = personagens.findIndex((personagem) => {
    return personagem.imagem === savedCharacter?.imagem;
  });

  if (savedIndex >= 0) {
    showCharacter(savedIndex);
    newDrawButton.classList.remove("is-hidden");
    return;
  }

  showCharacter(0);
  nameElement.textContent = "Pronto para sortear?";
  highlightThumbnail(-1);
}

drawButton.addEventListener("click", startDraw);
newDrawButton.addEventListener("click", startDraw);

renderGrid();
loadLastCharacter();
