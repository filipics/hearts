document.addEventListener('DOMContentLoaded', () => {
    // --- Constantes y Variables Globales ---
    const SUITS = ["heart", "diamond", "club", "spade"];
    const RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
    const RANK_VALUES = { "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "T": 10, "J": 11, "Q": 12, "K": 13, "A": 14 };
    const SUIT_SYMBOLS = { heart: "♥", diamond: "♦", club: "♣", spade: "♠" };
    const QUEEN_OF_SPADES = { rank: "Q", suit: "spade" };
    const TWO_OF_CLUBS = { rank: "2", suit: "club" };

    const NUM_PLAYERS = 4;
    const HUMAN_PLAYER_INDEX = 0;

    let deck = [];
    let players = []; // Array de objetos { id, name, hand, score, takenCards, isBot }
    let currentTrick = []; // Cartas jugadas en el truco actual { card, playerIndex }
    let trickLeaderIndex = -1;
    let currentPlayerIndex = -1;
    let heartsBroken = false;
    let currentRoundTrickCount = 0; // Contador de trucos en la ronda actual
    let gameScores = [0, 0, 0, 0]; // Puntajes acumulados

    // --- Referencias a Elementos del DOM ---
    const playerHandElements = [
        document.getElementById('hand-0'),
        document.getElementById('hand-1'),
        document.getElementById('hand-2'),
        document.getElementById('hand-3')
    ];
    const playerScoreElements = [
        document.getElementById('score-0'),
        document.getElementById('score-1'),
        document.getElementById('score-2'),
        document.getElementById('score-3')
    ];
    const playerTakenCardsElements = [
         document.getElementById('taken-0'),
         document.getElementById('taken-1'),
         document.getElementById('taken-2'),
         document.getElementById('taken-3')
    ];
    const playerAreaElements = document.querySelectorAll('.player-area');
    const trickAreaElement = document.getElementById('trick-area');
    const gameInfoElement = document.getElementById('game-info');
    const startRoundButton = document.getElementById('start-round-button');

    // --- Funciones del Juego ---

    function createCard(suit, rank) {
        return {
            suit: suit,
            rank: rank,
            value: RANK_VALUES[rank],
            id: `${rank}${suit.charAt(0).toUpperCase()}` // e.g., "QH", "2C"
        };
    }

    function createDeck() {
        deck = [];
        for (const suit of SUITS) {
            for (const rank of RANKS) {
                deck.push(createCard(suit, rank));
            }
        }
    }

    function shuffleDeck() {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]]; // Swap
        }
    }

    function dealCards() {
        let playerIndex = 0;
        players.forEach(p => p.hand = []); // Limpiar manos
        while (deck.length > 0) {
            players[playerIndex % NUM_PLAYERS].hand.push(deck.pop());
            playerIndex++;
        }
        // Ordenar la mano del jugador humano para mejor visualización
        sortHand(players[HUMAN_PLAYER_INDEX].hand);
        // (Opcional) Ordenar manos de bots si fuera necesario para su lógica
    }

    function sortHand(hand) {
        hand.sort((a, b) => {
            const suitOrder = SUITS.indexOf(a.suit) - SUITS.indexOf(b.suit);
            if (suitOrder !== 0) return suitOrder;
            return a.value - b.value; // Ordenar por valor dentro del mismo palo
        });
    }

    function renderCard(card, isHuman = true, isOpponentBack = false) {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card', card.suit);
        cardElement.dataset.id = card.id; // Identificador único
        cardElement.dataset.suit = SUIT_SYMBOLS[card.suit]; // Para los ::before/::after en CSS

        if (isOpponentBack) {
            // No necesita contenido visible, el CSS se encarga del reverso
        } else {
             const rankSpan = document.createElement('span');
             rankSpan.textContent = card.rank === 'T' ? '10' : card.rank; // Mostrar '10' en vez de 'T'
             cardElement.appendChild(rankSpan);
             // Los símbolos de palo se manejan con ::before y ::after en CSS
        }

        return cardElement;
    }

    function renderHands() {
        players.forEach((player, index) => {
            const handElement = playerHandElements[index];
            handElement.innerHTML = ''; // Limpiar mano anterior
            if (index === HUMAN_PLAYER_INDEX) {
                player.hand.forEach(card => {
                    const cardElement = renderCard(card, true, false);
                    cardElement.addEventListener('click', () => handleHumanPlay(card));
                    handElement.appendChild(cardElement);
                });
            } else {
                // Mostrar N cartas de reverso para los bots
                for (let i = 0; i < player.hand.length; i++) {
                     // Pasamos un objeto card simulado solo para la clase de palo si es necesario, o genérico
                    const dummyCard = { suit: 'club', rank: '?', value: 0, id: `back-${index}-${i}` };
                    const cardElement = renderCard(dummyCard, false, true);
                    handElement.appendChild(cardElement);
                }
            }
        });
        updatePlayableCardsUI(); // Marcar cartas jugables/no jugables
    }

     function renderScores() {
         players.forEach((player, index) => {
             playerScoreElements[index].textContent = `Puntos: ${gameScores[index]}`;
             // Mostrar puntos tomados en la ronda actual
             const roundPoints = calculateRoundPoints(player.takenCards);
             playerTakenCardsElements[index].textContent = `Tomadas (Ronda): ${roundPoints}`;
         });
     }

    function renderTrickArea() {
        trickAreaElement.innerHTML = ''; // Limpiar área del truco
        currentTrick.forEach(playedCard => {
            const cardElement = renderCard(playedCard.card, false, false); // Mostrar carta real jugada
            cardElement.dataset.player = playedCard.playerIndex; // Para posicionar con CSS
            trickAreaElement.appendChild(cardElement);
        });
    }

    function findTwoOfClubsOwner() {
        return players.findIndex(player =>
            player.hand.some(card => card.rank === TWO_OF_CLUBS.rank && card.suit === TWO_OF_CLUBS.suit)
        );
    }

    function initializeRound() {
        createDeck();
        shuffleDeck();
        players.forEach(p => {
            p.hand = [];
            p.takenCards = []; // Reiniciar cartas tomadas para la ronda
        });
        dealCards();
        heartsBroken = false;
        currentRoundTrickCount = 0;
        currentTrick = [];
        trickLeaderIndex = findTwoOfClubsOwner(); // Quien tenga el 2 de tréboles empieza
        currentPlayerIndex = trickLeaderIndex;

        gameInfoElement.textContent = `Ronda ${Math.floor(gameScores.reduce((a, b) => a + b, 0) / 26) + 1}. Empieza ${players[currentPlayerIndex].name}.`;
        renderHands();
        renderScores(); // Actualiza puntos acumulados y resetea 'Tomadas (Ronda)'
        renderTrickArea();
        highlightActivePlayer();
        startRoundButton.style.display = 'none'; // Ocultar botón al iniciar

        // Si el primer jugador es un bot, iniciar su turno
        if (players[currentPlayerIndex].isBot) {
            setTimeout(handleBotTurn, 1000); // Dar tiempo para ver la mano inicial
        }
    }

    function initializeGame() {
        players = [];
        gameScores = [0, 0, 0, 0];
        for (let i = 0; i < NUM_PLAYERS; i++) {
            players.push({
                id: i,
                name: i === HUMAN_PLAYER_INDEX ? "Tú" : `Bot ${i}`,
                hand: [],
                takenCards: [],
                isBot: i !== HUMAN_PLAYER_INDEX
            });
        }
         startRoundButton.addEventListener('click', initializeRound);
         startRoundButton.style.display = 'block'; // Mostrar botón para iniciar la primera ronda
         gameInfoElement.textContent = "¡Bienvenido a Corazones! Presiona 'Iniciar Nueva Ronda'";
         // Limpiar áreas visuales iniciales
         playerHandElements.forEach(el => el.innerHTML = '');
         trickAreaElement.innerHTML = '';
         renderScores(); // Mostrar puntajes iniciales (0)
    }

    // --- Lógica de Juego ---

    function isValidPlay(cardToPlay, playerHand, currentTrick, isFirstTrick) {
        const leadingSuit = currentTrick.length > 0 ? currentTrick[0].card.suit : null;
        const playerHasLeadingSuit = playerHand.some(card => card.suit === leadingSuit);

        // 1. Regla del 2 de Tréboles: Debe jugarse en el primer truco si se tiene
        if (isFirstTrick && currentTrick.length === 0) {
             const hasTwoOfClubs = playerHand.some(c => c.rank === TWO_OF_CLUBS.rank && c.suit === TWO_OF_CLUBS.suit);
             if (hasTwoOfClubs && (cardToPlay.rank !== TWO_OF_CLUBS.rank || cardToPlay.suit !== TWO_OF_CLUBS.suit)) {
                 console.log("Validación: Debes jugar el 2 de Tréboles.");
                 return false; // Debe jugar el 2 de tréboles
             }
              if (!hasTwoOfClubs && cardToPlay.rank === TWO_OF_CLUBS.rank && cardToPlay.suit === TWO_OF_CLUBS.suit) {
                 return true; // Si no lo tiene otro, es válido que lo juegue si lo tiene
             }
        }

         // 2. Seguir el palo
        if (leadingSuit && playerHasLeadingSuit && cardToPlay.suit !== leadingSuit) {
            console.log(`Validación: Debes seguir el palo (${leadingSuit}).`);
            return false; // Tiene cartas del palo líder pero intenta jugar otra cosa
        }

        // 3. Romper Corazones
        if (leadingSuit === null) { // Está liderando el truco
             if (cardToPlay.suit === 'heart' && !heartsBroken) {
                 // Solo puede liderar con corazón si solo tiene corazones
                 const hasOnlyHearts = playerHand.every(card => card.suit === 'heart');
                 if (!hasOnlyHearts) {
                    console.log("Validación: No puedes liderar con Corazones hasta que se rompan.");
                    return false;
                 }
             }
        }

        // 4. No puntos en el primer truco (si es posible)
        if (isFirstTrick && (cardToPlay.suit === 'heart' || (cardToPlay.rank === QUEEN_OF_SPADES.rank && cardToPlay.suit === QUEEN_OF_SPADES.suit))) {
            // Se puede jugar una carta de puntos en el primer truco SÓLO si no se tiene otra opción
            const hasOnlyPoints = playerHand.every(card => card.suit === 'heart' || (card.rank === QUEEN_OF_SPADES.rank && card.suit === QUEEN_OF_SPADES.suit));
            if (!hasOnlyPoints) {
                console.log("Validación: No puedes jugar cartas de puntos en el primer truco si tienes otras opciones.");
                return false;
            }
        }

        // Si pasa todas las validaciones
        return true;
    }

    function updatePlayableCardsUI() {
        const humanPlayer = players[HUMAN_PLAYER_INDEX];
        const isFirstTrick = currentRoundTrickCount === 0;
        const handElement = playerHandElements[HUMAN_PLAYER_INDEX];
        const cardElements = handElement.querySelectorAll('.card');

        cardElements.forEach(cardElement => {
            const cardId = cardElement.dataset.id;
            const card = humanPlayer.hand.find(c => c.id === cardId);
            if (card) {
                 // Solo validar si es el turno del jugador humano
                 if (currentPlayerIndex === HUMAN_PLAYER_INDEX) {
                    if (isValidPlay(card, humanPlayer.hand, currentTrick, isFirstTrick)) {
                        cardElement.classList.remove('disabled');
                    } else {
                        cardElement.classList.add('disabled');
                    }
                 } else {
                     // Si no es turno del humano, deshabilitar todas visualmente
                     cardElement.classList.add('disabled');
                 }
            }
        });
    }

    function handleHumanPlay(card) {
        if (currentPlayerIndex !== HUMAN_PLAYER_INDEX) {
            console.log("No es tu turno.");
            return;
        }

        const player = players[HUMAN_PLAYER_INDEX];
        const isFirstTrick = currentRoundTrickCount === 0;

        if (isValidPlay(card, player.hand, currentTrick, isFirstTrick)) {
            playCard(card, HUMAN_PLAYER_INDEX);
        } else {
            // Opcional: Mostrar un mensaje de error más visual
            gameInfoElement.textContent = "Jugada inválida. Revisa las reglas.";
            setTimeout(() => {
                // Restaurar mensaje anterior si es necesario o dejar el de turno
                gameInfoElement.textContent = `Es tu turno. Palo líder: ${currentTrick.length > 0 ? SUIT_SYMBOLS[currentTrick[0].card.suit] : 'Ninguno'}`;
            }, 2000);
        }
    }

    function handleBotTurn() {
        if (currentPlayerIndex === HUMAN_PLAYER_INDEX || currentTrick.length === NUM_PLAYERS) {
            return; // No es turno de un bot o el truco ya terminó
        }

        const player = players[currentPlayerIndex];
        const hand = player.hand;
        const isFirstTrick = currentRoundTrickCount === 0;
        let cardToPlay = null;

        // Lógica de IA (Muy Simple)
        const leadingSuit = currentTrick.length > 0 ? currentTrick[0].card.suit : null;
        const playableCards = hand.filter(card => isValidPlay(card, hand, currentTrick, isFirstTrick));

        if (playableCards.length === 0) {
             console.error(`¡Error! El bot ${player.name} no tiene cartas jugables. Mano:`, hand, "Truco:", currentTrick, "Corazones Rotos:", heartsBroken, "Primer Truco:", isFirstTrick);
             // Fallback: Jugar la primera carta de la mano (esto no debería pasar con lógica isValidPlay correcta)
             if (hand.length > 0) cardToPlay = hand[0];
             else return; // No hay cartas en la mano? Error grave.
        } else {
             // Estrategia simple:
             if (leadingSuit) { // Seguir palo
                 const cardsInSuit = playableCards.filter(c => c.suit === leadingSuit);
                 if (cardsInSuit.length > 0) {
                     // Jugar la carta más baja del palo para evitar ganar (simple)
                     cardsInSuit.sort((a, b) => a.value - b.value);
                     cardToPlay = cardsInSuit[0];
                 } else { // No puede seguir palo, descartar
                     // Priorizar descartar Q♠️, luego Corazón alto, luego carta más alta
                     playableCards.sort((a, b) => {
                         const scoreA = getCardScore(a);
                         const scoreB = getCardScore(b);
                         if (scoreA !== scoreB) return scoreB - scoreA; // Más puntos primero
                         return b.value - a.value; // Si no hay puntos, la más alta
                     });
                     cardToPlay = playableCards[0];
                 }
             } else { // Liderar el truco
                 // Liderar con la carta más baja que no sea Corazón (si es posible)
                 const nonHearts = playableCards.filter(c => c.suit !== 'heart');
                 if (nonHearts.length > 0) {
                     nonHearts.sort((a, b) => a.value - b.value);
                     cardToPlay = nonHearts[0];
                 } else { // Solo tiene corazones (o solo le quedan corazones jugables)
                     playableCards.sort((a, b) => a.value - b.value);
                     cardToPlay = playableCards[0]; // Liderar con el corazón más bajo
                 }
             }
        }


        if (cardToPlay) {
             // Simular un pequeño retraso para el bot
             setTimeout(() => {
                 playCard(cardToPlay, currentPlayerIndex);
             }, 800 + Math.random() * 500); // Retraso entre 0.8s y 1.3s
        } else {
             console.error("El Bot no pudo seleccionar una carta para jugar.");
             // Aquí podría haber un problema de lógica si llega a este punto.
        }
    }


    function playCard(card, playerIndex) {
        const player = players[playerIndex];

        // Quitar carta de la mano del jugador
        const cardIndex = player.hand.findIndex(c => c.id === card.id);
        if (cardIndex === -1) {
            console.error("Error: La carta no está en la mano del jugador.", card, player.hand);
            return;
        }
        player.hand.splice(cardIndex, 1);

        // Añadir carta al truco actual
        currentTrick.push({ card, playerIndex });

        // Actualizar estado si se juega un corazón o la Q de Picas
        if (card.suit === 'heart') {
            heartsBroken = true;
            console.log("--- ¡Corazones Rotos! ---");
        }
        // (La Q♠️ no rompe corazones, solo da puntos)

        // Actualizar UI
        renderHands(); // Actualizar mano del jugador (quitar carta) y posiblemente reversos de bots
        renderTrickArea(); // Mostrar la carta jugada en el centro

        // Pasar al siguiente jugador o finalizar truco
        if (currentTrick.length < NUM_PLAYERS) {
            currentPlayerIndex = (currentPlayerIndex + 1) % NUM_PLAYERS;
            highlightActivePlayer();
             gameInfoElement.textContent = `Turno de ${players[currentPlayerIndex].name}. ${leadingSuitMessage()}`;
             updatePlayableCardsUI(); // Actualizar jugabilidad para el humano si es su turno
            // Si el siguiente es un bot, llamar a su turno
            if (players[currentPlayerIndex].isBot) {
                handleBotTurn();
            }
        } else {
            // Truco completado
            gameInfoElement.textContent = "Calculando ganador del truco...";
            setTimeout(finishTrick, 1500); // Pausa para ver las cartas jugadas
        }
    }

    function leadingSuitMessage() {
         if (currentTrick.length > 0) {
              const leadCard = currentTrick[0].card;
              return ` Palo líder: ${SUIT_SYMBOLS[leadCard.suit]}`;
         }
         return "";
    }


    function finishTrick() {
        if (currentTrick.length !== NUM_PLAYERS) return; // Asegurarse de que el truco esté completo

        const leadingSuit = currentTrick[0].card.suit;
        let winningCard = currentTrick[0].card;
        let winnerIndex = currentTrick[0].playerIndex;

        // Determinar quién ganó el truco (carta más alta del palo líder)
        for (let i = 1; i < currentTrick.length; i++) {
            const played = currentTrick[i];
            if (played.card.suit === leadingSuit && played.card.value > winningCard.value) {
                winningCard = played.card;
                winnerIndex = played.playerIndex;
            }
        }

        // Asignar cartas del truco al ganador
        const trickCards = currentTrick.map(item => item.card);
        players[winnerIndex].takenCards.push(...trickCards);
        console.log(`${players[winnerIndex].name} ganó el truco con ${winningCard.rank}${SUIT_SYMBOLS[winningCard.suit]} y toma ${trickCards.length} cartas.`);
        //console.log("Cartas tomadas:", trickCards.map(c => `${c.rank}${SUIT_SYMBOLS[c.suit]}`));

        // Limpiar para el siguiente truco
        currentTrick = [];
        trickLeaderIndex = winnerIndex; // El ganador del truco lidera el siguiente
        currentPlayerIndex = winnerIndex;
        currentRoundTrickCount++;

        // Actualizar UI de cartas tomadas (puntos de la ronda)
        renderScores();
        renderTrickArea(); // Limpiar área de juego

        // Verificar si la ronda terminó (13 trucos)
        if (currentRoundTrickCount === 13) {
            gameInfoElement.textContent = "Ronda terminada. Calculando puntajes...";
            setTimeout(finishRound, 1500);
        } else {
            gameInfoElement.textContent = `Turno de ${players[currentPlayerIndex].name} para liderar el siguiente truco.`;
            highlightActivePlayer();
            updatePlayableCardsUI();
            // Si el líder del nuevo truco es un bot, iniciar su turno
            if (players[currentPlayerIndex].isBot) {
                setTimeout(handleBotTurn, 1000);
            }
        }
    }

     function getCardScore(card) {
        if (card.suit === 'heart') {
            return 1;
        }
        if (card.suit === QUEEN_OF_SPADES.suit && card.rank === QUEEN_OF_SPADES.rank) {
            return 13;
        }
        return 0;
    }

    function calculateRoundPoints(takenCards) {
         return takenCards.reduce((total, card) => total + getCardScore(card), 0);
    }


    function finishRound() {
        console.log("--- Fin de la Ronda ---");
        let roundScores = [0, 0, 0, 0];

        // Calcular puntos para cada jugador basado en las cartas tomadas
        players.forEach((player, index) => {
            const points = calculateRoundPoints(player.takenCards);
            roundScores[index] = points;
            console.log(`${player.name} tomó ${player.takenCards.length} cartas. Puntos esta ronda: ${points}`);
        });

        // TODO: Implementar "Shoot the Moon"
        // Aquí iría la lógica para detectar si alguien tomó los 26 puntos
        // y ajustar los roundScores apropiadamente (0 para él, 26 para los demás)

        // Actualizar puntajes globales
        roundScores.forEach((score, index) => {
            gameScores[index] += score;
        });

        renderScores(); // Mostrar puntajes actualizados globales

        // Comprobar si alguien ha superado el límite (ej. 100 puntos)
        const gameOver = gameScores.some(score => score >= 100);

        if (gameOver) {
            const winner = players[gameScores.indexOf(Math.min(...gameScores))]; // El que tiene MENOS puntos gana
            gameInfoElement.textContent = `¡Fin del Juego! Ganador: ${winner.name} con ${Math.min(...gameScores)} puntos.`;
            startRoundButton.style.display = 'none'; // No más rondas
            console.log("--- Fin del Juego ---");
            console.log("Puntajes finales:", gameScores);
             // Podrías ofrecer un botón "Jugar de Nuevo" que llame a initializeGame()
        } else {
            gameInfoElement.textContent = "Ronda finalizada. ¡Prepara la siguiente!";
            startRoundButton.style.display = 'block'; // Mostrar botón para la siguiente ronda
        }
    }

    function highlightActivePlayer() {
        playerAreaElements.forEach((area, index) => {
            if (index === currentPlayerIndex) {
                area.classList.add('active');
            } else {
                area.classList.remove('active');
            }
        });
    }

    // --- Iniciar el Juego ---
    initializeGame();

}); // Fin del DOMContentLoaded
