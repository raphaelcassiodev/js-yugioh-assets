//objeto que irá guardar o estado de memório da uma determinada propriedade
const state = {
  score: {
    playScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById("score_points"),
  },
  cardSprites: {
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
  },
  fieldCards: {
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },
  playerSide: {
    player1: "player-cards",
    player1BOX: document.querySelector("#player-cards"),
    computer: "computer-cards",
    computerBOX: document.querySelector("#computer-cards"),
  },
  action: {
    button: document.getElementById("next-duel"),
  },
};

//enumeração das cartas (enum) -> listar alguma coisa para dar sentido e facilitar a sua busca.
// PEGA ALGO QUE NÃO TEM SENTIDO, a fim de proporcionar  um SENTIDO

const pathImages = "./src/assets/icons/";
const cardData = [
  {
    id: 0,
    name: "Blue Eyes White Dragon",
    type: "Paper",
    img: `${pathImages}dragon.png`,
    WinOf: [1], // Quais IDs a carta GANHA
    LoseOf: [2], // Quais IDs a carta PERDE
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    img: `${pathImages}magician.png`,
    WinOf: [2], // Quais IDs a carta GANHA
    LoseOf: [0], // Quais IDs a carta PERDE
  },
  {
    id: 2,
    name: "Exodia",
    type: "Scissors",
    img: `${pathImages}exodia.png`,
    WinOf: [0], // Quais IDs a carta GANHA
    LoseOf: [1], // Quais IDs a carta PERDE
  },
];

async function createCardIamge(idCard, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
  cardImage.setAttribute("data-id", idCard);
  cardImage.classList.add("card");

  //VALIDANDADO: se o campo for igual a carta do jogador...
  if (fieldSide === state.playerSide.player1) {
    cardImage.addEventListener("mouseover", () => {
      drawSelectCard(idCard);
    });

    cardImage.addEventListener("click", () => {
      setCardsField(cardImage.getAttribute("data-id"));
    });
  }

  return cardImage;
}

//Colocar as cartas a mostra:
async function setCardsField(cardId) {
  //remover todas as imagens para selecionar
  await removeAllCardsImages();

  //sorteia uma carta aleatória para o computador
  let computerCardId = await getRandomCardId();

  await showHiddenCardFieldsImages(true);

  await hiddenCardDetails();

  await drawCardsInField(cardId, computerCardId);

  //valida o resultado, comparando um ID com o outro
  let duelResults = await checkDuelResults(cardId, computerCardId);

  await updateScore();
  await drawButton(duelResults);
}

//coloca as imagens
async function drawCardsInField(cardId, computerCardId) {
  state.fieldCards.player.src = cardData[cardId].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function showHiddenCardFieldsImages(value) {
  //display block para ambos
  if (value) {
    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";
  } else {
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
  }
}

// Remove a imagem, nome e descrição
async function hiddenCardDetails() {
  state.cardSprites.avatar.src = "";
  state.cardSprites.name.innerText = "";
  state.cardSprites.type.innerText = "";
}

async function drawButton(text) {
  state.action.button.innerText = text.toUpperCase();
  state.action.button.style.display = "block";
}

async function updateScore() {
  state.score.scoreBox.innerText = `Win: ${state.score.playScore} | Lose: ${state.score.computerScore}`;
}

async function checkDuelResults(playerCardId, computerCardId) {
  let duelResults = "Draw";
  let playerCard = cardData[playerCardId];

  //Se a carta do jogador conter o ID que lea vence, então o jogador ganhou a rodada e incremente o score
  if (playerCard.WinOf.includes(computerCardId)) {
    duelResults = "win";

    state.score.playScore++;
  } else if (playerCard.LoseOf.includes(computerCardId)) {
    duelResults = "lose";

    state.score.computerScore++;
  }
  await playAudio(duelResults);
  return duelResults;
}

// Romeve a opção de selecionar as imagens, quando uma é escolhida
async function removeAllCardsImages() {
  let { computerBOX, player1BOX } = state.playerSide;
  let imgElements = computerBOX.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());

  imgElements = player1BOX.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());
}

async function drawSelectCard(index) {
  state.cardSprites.avatar.src = cardData[index].img;
  state.cardSprites.name.innerHTML = cardData[index].name;
  state.cardSprites.type.innerText = "Attribute : " + cardData[index].type;
}

//Fornecer um ID aleatório
async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length);
  return cardData[randomIndex].id;
}

//função que vai sortear as cartas aleatóriamente
//cardNumbers -> quantidade
//fieldSide -> player ou computer
async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const randomIdCard = await getRandomCardId();
    const cardImage = await createCardIamge(randomIdCard, fieldSide);

    document.getElementById(fieldSide).appendChild(cardImage);
  }
}

async function resetDuel() {
  state.cardSprites.avatar.src = "";
  state.action.button.style.display = "none";

  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";
  init();
}

async function playAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);

  try {
    audio.play();
  } catch {
    console.log("Sem audio");
  }

  audio.play();
}

//funcao principal, que serve para inicializar tudo
function init() {
  // limpa as bordas das imagens
  showHiddenCardFieldsImages(false);

  // quando o jogo iniciar cada um começa com 5 cartas (player e computer)
  drawCards(5, state.playerSide.player1);
  drawCards(5, state.playerSide.computer);


  const bgm = document.querySelector('#bgm')
  bgm.play();
}

init();

//fieldCards == as duas cartas que aparecem no meio
