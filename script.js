document.addEventListener('DOMContentLoaded', () => {
    // --- Constantes y Variables Globales ---
    const SUITS = ["heart", "diamond", "club", "spade"];
    const RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
    const RANK_VALUES = { "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "T": 10, "J": 11, "Q": 12, "K": 13, "A": 14 };
    const SUIT_SYMBOLS = { heart: "♥", diamond: "♦", club: "♣", spade: "♠" };
    const NO_TRUMP_SYMBOL = 'NT';

    const NUM_PLAYERS = 4;
    const HUMAN_PLAYER_INDEX = 0;
    const MAX_CARDS_PER_HAND = Math.floor(52 / NUM_PLAYERS); // 13 para 4 jugadores
    const SCORE_TO_WIN = -1; // El juego termina después de todas las rondas definidas

    // Secuencia de cartas por ronda: 1-10-1 para 4 jugadores (19 rondas)
    const CARDS_PER_ROUND_SEQUENCE = [];
    for(let i = 1; i <= 10; i++) CARDS_PER_ROUND_SEQUENCE.push(i);
    for(let i = 9; i >= 1; i--) CARDS_PER_ROUND_SEQUENCE.push(i);
    const TOTAL_ROUNDS = CARDS_PER_ROUND_SEQUENCE.length;

    let deck = [];
    let players = []; // { id, name, hand, totalScore, isBot }
    let currentRoundData = {
        roundNumber: 0,
        cardsPerHand: 0,
        trumpSuit: null, // 'heart', 'diamond', 'club', 'spade', or 'none'
        dealerIndex: -1,
        bids: [], // [bidP0, bidP1, bidP2, bidP3]
        trickTakens: [], // [takenP0, takenP1, takenP2, takenP3]
        currentTrick: [], // { card, playerIndex }
        trickLeaderIndex: -1,
        currentPlayerIndex: -1,
        bidderIndex: -1,
        phase: 'setup', // setup, bidding, playing, scoring, gameOver
        bidsTotal: 0,
        isPudricion enforced: false // Si la regla de podrida está activa para el último cantor
    };

    // --- Referencias a Elementos del DOM ---
    const playerHandElements = Array.from({ length: NUM_PLAYERS }, (_, i) => document.getElementById(`hand-${i}`));
    const playerScoreElements = Array.from({ length: NUM_PLAYERS }, (_, i) => document.getElementById(`score-${i}`));
    const playerBidTakenElements = Array.from({ length: NUM_PLAYERS }, (_, i) => document.getElementById(`bid-taken-${i}`));
    const playerAreaElements = document.querySelectorAll('.player-area');
    const trickAreaElement = document.getElementById('trick-area');
    const gameInfoElement = document.getElementById('game-info');
    const biddingControlsElement = document.getElementById('bidding-controls');
    const bidOptionsElement = document.getElementById('bid-options');
    const maxBidElement = document.getElementById('max-bid');
    const bidRuleInfoElement = document.getElementById('bid-rule-info');
    const startGameButton = document.getElementById('start-game-button');
    const nextRoundButton = document.getElementById('next-round-button');
    const roundIndicatorElement = document.getElementById('round-indicator');
    const cardsPerHandElement = document.getElementById('cards-per-hand');
    const trumpSuitElement = document.getElementById('trump-suit');
    const dealerIndicatorElement = document.getElementById('dealer-indicator');


    // --- Funciones de Utilidad (Copiar de Hearts o adaptar) ---
    function createCard(suit, rank) { /* ... (igual que en Hearts) ... */
        return { suit, rank, value: RANK_VALUES[rank], id: `${rank}${suit.charAt(0).toUpperCase()}` };
     }
    function createDeck() { /* ... (igual que en Hearts) ... */
         deck = [];
        for (const suit of SUITS) {
            for (const rank of RANKS) {
                deck.push(createCard(suit, rank));
            }
        }
     }
    function shuffleDeck() { /* ... (igual que en Hearts) ... */
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
     }
    function sortHand(hand) { /* ... (igual que en Hearts) ... */
         hand.sort((a, b) => {
            const suitOrder = SUITS.indexOf(a.suit) - SUITS.indexOf(b.suit);
            if (suitOrder !== 0) return suitOrder;
            return b.value - a.value; // Ordenar por valor descendente dentro del palo
        });
     }
    function renderCard(card, isOpponentBack = false) { /* ... (adaptado para no necesitar isHuman) ... */
        const cardElement = document.createElement('div');
        cardElement.classList.add('card', card.suit);
        cardElement.dataset.id = card.id;
        cardElement.dataset.suit = SUIT_SYMBOLS[card.suit];

        if (isOpponentBack) {
             cardElement.innerHTML = '<span></span>'; // Asegurar que tiene span para CSS
             cardElement.classList.add('back'); // Añadir clase específica si se necesita diferenciar más
        } else {
             const rankSpan = document.createElement('span');
             rankSpan.textContent = card.rank === 'T' ? '10' : card.rank;
             cardElement.appendChild(rankSpan);
        }
        return cardElement;
    }

    // --- Funciones de Renderizado (UI) ---
    function renderHands() {
        players.forEach((player, index) => {
            const handElement = playerHandElements[index];
            handElement.innerHTML = '';
            sortHand(player.hand); // Ordenar siempre
            if (index === HUMAN_PLAYER_INDEX) {
                player.hand.forEach(card => {
                    const cardElement = renderCard(card, false);
                    cardElement.addEventListener('click', () => handleHumanPlay(card));
                    handElement.appendChild(cardElement);
                });
            } else {
                for (let i = 0; i < player.hand.length; i++) {
                    // Pasar una carta ficticia para el reverso
                    const dummyCard = { suit: 'club', rank: '?', value: 0, id: `back-${index}-${i}` };
                    const cardElement = renderCard(dummyCard, true);
                    handElement.appendChild(cardElement);
                }
            }
        });
         updatePlayableCardsUI(); // Marcar cartas jugables/no jugables
    }

    function renderScoresAndBids() {
         players.forEach((player, index) => {
            playerScoreElements[index].textContent = `Total: ${player.totalScore}`;
            const bidText = currentRoundData.bids[index] !== undefined ? currentRoundData.bids[index] : "-";
            const takenText = currentRoundData.trickTakens[index] !== undefined ? currentRoundData.trickTakens[index] : "-";
            playerBidTakenElements[index].textContent = `Canto: ${bidText} / Tomadas: ${takenText}`;
         });
    }

     function renderTrickArea() {
        trickAreaElement.innerHTML = '';
        currentRoundData.currentTrick.forEach(playedCard => {
            const cardElement = renderCard(playedCard.card, false);
            cardElement.dataset.player = playedCard.playerIndex;
            // Aplicar estilo basado en dataset.player como en Hearts
            // Posicionamiento absoluto dentro del área .trick
            const angle = (playedCard.playerIndex - currentRoundData.trickLeaderIndex + NUM_PLAYERS) % NUM_PLAYERS; // 0=leader, 1=next, etc.
            let offsetX = 0, offsetY = 0;
            const distance = 35; // Distancia del centro
            switch(playedCard.playerIndex) { // Posicionamiento simple fijo
                 case 0: offsetY = distance; break;  // Abajo
                 case 1: offsetX = -distance; break; // Izquierda
                 case 2: offsetY = -distance; break; // Arriba
                 case 3: offsetX = distance; break;  // Derecha
            }
             cardElement.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(0.9)`;
             cardElement.style.position = 'absolute'; // Asegurar posicionamiento absoluto


            trickAreaElement.appendChild(cardElement);
        });
    }

    function renderRoundInfo() {
        roundIndicatorElement.textContent = `Ronda: ${currentRoundData.roundNumber}/${TOTAL_ROUNDS}`;
        cardsPerHandElement.textContent = `Cartas: ${currentRoundData.cardsPerHand}`;
        dealerIndicatorElement.textContent = `Reparte: ${players[currentRoundData.dealerIndex].name}`;

        let trumpHtml = "Triunfo: ";
        if (currentRoundData.trumpSuit === 'none') {
             trumpHtml += `<span class="suit-symbol none">${NO_TRUMP_SYMBOL}</span>`;
        } else if (currentRoundData.trumpSuit) {
            const symbol = SUIT_SYMBOLS[currentRoundData.trumpSuit];
            trumpHtml += `<span class="suit-symbol ${currentRoundData.trumpSuit}">${symbol}</span>`;
        } else {
             trumpHtml += "-";
        }
        trumpSuitElement.innerHTML = trumpHtml;
    }

    function highlightActivePlayer() {
        playerAreaElements.forEach((area, index) => {
            area.classList.remove('active', 'dealer'); // Limpiar clases
            if (index === currentRoundData.currentPlayerIndex && currentRoundData.phase === 'playing') {
                area.classList.add('active');
            }
             if (index === currentRoundData.bidderIndex && currentRoundData.phase === 'bidding') {
                 area.classList.add('active'); // También resaltar durante el canto
             }
            if (index === currentRoundData.dealerIndex) {
                area.classList.add('dealer');
            }
        });
    }

    function updatePlayableCardsUI() {
        if (currentRoundData.phase !== 'playing' || currentRoundData.currentPlayerIndex !== HUMAN_PLAYER_INDEX) {
             // Deshabilitar todas las cartas si no es el turno del humano o no estamos jugando
             playerHandElements[HUMAN_PLAYER_INDEX].querySelectorAll('.card').forEach(el => el.classList.add('disabled'));
             return;
         }

        const humanPlayer = players[HUMAN_PLAYER_INDEX];
        const handElement = playerHandElements[HUMAN_PLAYER_INDEX];
        const cardElements = handElement.querySelectorAll('.card');

        cardElements.forEach(cardElement => {
            const cardId = cardElement.dataset.id;
            const card = humanPlayer.hand.find(c => c.id === cardId);
            if (card) {
                if (isValidPlay(card, humanPlayer.hand, currentRoundData.currentTrick, currentRoundData.trumpSuit)) {
                    cardElement.classList.remove('disabled');
                } else {
                    cardElement.classList.add('disabled');
                }
            } else {
                 cardElement.classList.add('disabled'); // Carta no encontrada (error?)
            }
        });
    }

    // --- Lógica Principal del Juego ---

    function initializeGame() {
        console.log("Initializing game...");
        players = [];
        for (let i = 0; i < NUM_PLAYERS; i++) {
            players.push({
                id: i,
                name: i === HUMAN_PLAYER_INDEX ? "Tú" : `Bot ${i}`,
                hand: [],
                totalScore: 0,
                isBot: i !== HUMAN_PLAYER_INDEX
            });
        }
        currentRoundData.roundNumber = 0; // Se incrementará a 1 en startNextRound
        currentRoundData.dealerIndex = Math.floor(Math.random() * NUM_PLAYERS); // Repartidor inicial aleatorio

        startGameButton.style.display = 'none';
        nextRoundButton.style.display = 'none';
        gameInfoElement.textContent = "Preparando la primera ronda...";

        setTimeout(startNextRound, 500);
    }

    function startNextRound() {
        currentRoundData.roundNumber++;
        if (currentRoundData.roundNumber > TOTAL_ROUNDS) {
            endGame();
            return;
        }

        currentRoundData.phase = 'setup';
        currentRoundData.cardsPerHand = CARDS_PER_ROUND_SEQUENCE[currentRoundData.roundNumber - 1];
        currentRoundData.dealerIndex = (currentRoundData.dealerIndex + 1) % NUM_PLAYERS;
        currentRoundData.bids = Array(NUM_PLAYERS).fill(undefined);
        currentRoundData.trickTakens = Array(NUM_PLAYERS).fill(0);
        currentRoundData.currentTrick = [];
        currentRoundData.bidsTotal = 0;
        currentRoundData.isPudricionEnforced = false;

        players.forEach(p => p.hand = []); // Limpiar manos

        createDeck();
        shuffleDeck();

        // Repartir cartas
        for (let i = 0; i < currentRoundData.cardsPerHand; i++) {
            for (let j = 0; j < NUM_PLAYERS; j++) {
                const playerIndex = (currentRoundData.dealerIndex + 1 + j) % NUM_PLAYERS; // Empieza a repartir a la izquierda del repartidor
                 if (deck.length > 0) {
                    players[playerIndex].hand.push(deck.pop());
                 }
            }
        }

        // Determinar triunfo (voltear la siguiente carta, si quedan)
        if (deck.length > 0) {
            const trumpCard = deck.pop();
            currentRoundData.trumpSuit = trumpCard.suit;
             // Opcional: Dejar la carta de triunfo visible en algún lugar? Por ahora solo guardamos el palo.
        } else {
            // Si no quedan cartas (manos máximas), se juega sin triunfo
            currentRoundData.trumpSuit = 'none';
        }

        console.log(`--- Ronda ${currentRoundData.roundNumber} ---`);
        console.log(`Cartas: ${currentRoundData.cardsPerHand}, Triunfo: ${currentRoundData.trumpSuit}, Reparte: ${players[currentRoundData.dealerIndex].name}`);

        renderHands();
        renderScoresAndBids();
        renderRoundInfo();
        trickAreaElement.innerHTML = ''; // Limpiar área de truco
        nextRoundButton.style.display = 'none';

        // Iniciar fase de Canto (Bidding)
        currentRoundData.phase = 'bidding';
        currentRoundData.bidderIndex = (currentRoundData.dealerIndex + 1) % NUM_PLAYERS; // Empieza a cantar a la izquierda del repartidor
        gameInfoElement.textContent = `Fase de Canto. Empieza ${players[currentRoundData.bidderIndex].name}.`;
        highlightActivePlayer();
        proceedBidding();
    }

    // --- Lógica de Canto (Bidding) ---

    function proceedBidding() {
        if (currentRoundData.bidderIndex === undefined) {
            console.error("Error: bidderIndex no definido en proceedBidding");
            return;
        }

        const currentPlayer = players[currentRoundData.bidderIndex];
        highlightActivePlayer();

         // Verificar si es el último jugador en cantar
        const biddersRemaining = currentRoundData.bids.filter(b => b === undefined).length;
        currentRoundData.isPudricionEnforced = (biddersRemaining === 1);


        if (currentPlayer.isBot) {
            gameInfoElement.textContent = `Esperando canto de ${currentPlayer.name}...`;
            setTimeout(() => {
                 handleBotBid(currentPlayer.id);
                 advanceBidder();
            }, 1000 + Math.random() * 800);
        } else {
            // Es el turno del jugador humano
            promptHumanBid();
        }
    }

     function promptHumanBid() {
         gameInfoElement.textContent = "Tu turno para cantar.";
         biddingControlsElement.style.display = 'block';
         bidOptionsElement.innerHTML = ''; // Limpiar opciones anteriores
         maxBidElement.textContent = currentRoundData.cardsPerHand;

         const forbiddenBid = calculateForbiddenBid();
          bidRuleInfoElement.textContent = ''; // Limpiar info de regla

         for (let i = 0; i <= currentRoundData.cardsPerHand; i++) {
             const bidButton = document.createElement('button');
             bidButton.textContent = i;
             bidButton.dataset.bid = i;

             // Deshabilitar el botón si es la puja prohibida para el último jugador
             if (currentRoundData.isPudricionEnforced && i === forbiddenBid) {
                 bidButton.disabled = true;
                 bidButton.classList.add('disabled');
                 bidButton.title = `No puedes cantar ${i} (Regla de Podrida)`;
                 bidRuleInfoElement.textContent = `La suma de cantos no puede ser ${currentRoundData.cardsPerHand}. Puja prohibida: ${forbiddenBid}.`;
             }

             bidButton.addEventListener('click', () => handleHumanBid(i));
             bidOptionsElement.appendChild(bidButton);
         }
     }

     function calculateForbiddenBid() {
          if (!currentRoundData.isPudricionEnforced) return -1; // No aplica si no es el último

         const currentBidsSum = currentRoundData.bids.reduce((sum, bid) => sum + (bid !== undefined ? bid : 0), 0);
         const forbidden = currentRoundData.cardsPerHand - currentBidsSum;
         return forbidden;
     }

    function handleHumanBid(bid) {
        if (currentRoundData.phase !== 'bidding' || currentRoundData.bidderIndex !== HUMAN_PLAYER_INDEX) return;

        const forbiddenBid = calculateForbiddenBid();
        if (currentRoundData.isPudricionEnforced && bid === forbiddenBid) {
            console.warn("Intento de canto prohibido.");
            // Podríamos mostrar un mensaje más claro aquí
            return; // No permitir el canto
        }

        console.log(`Jugador Humano canta: ${bid}`);
        currentRoundData.bids[HUMAN_PLAYER_INDEX] = bid;
        currentRoundData.bidsTotal += bid;
        biddingControlsElement.style.display = 'none'; // Ocultar controles
        renderScoresAndBids(); // Actualizar UI con el canto
        advanceBidder();
    }

    function handleBotBid(botIndex) {
         const player = players[botIndex];
         const hand = player.hand;
         const numCards = currentRoundData.cardsPerHand;
         const trump = currentRoundData.trumpSuit;

         // IA de Canto Simple: Contar cartas altas y triunfos
         let estimatedTricks = 0;
         hand.forEach(card => {
             if (card.suit === trump) {
                 if (card.value >= RANK_VALUES['K']) estimatedTricks += 1; // A, K de triunfo valen 1
                 else if (card.value >= RANK_VALUES['T']) estimatedTricks += 0.5; // Q, J, T de triunfo valen 0.5
             } else {
                 if (card.value === RANK_VALUES['A']) estimatedTricks += 0.75; // As no triunfo ~0.75
                 else if (card.value === RANK_VALUES['K']) estimatedTricks += 0.4; // Rey no triunfo ~0.4
             }
         });

         let bid = Math.round(estimatedTricks);
         bid = Math.max(0, Math.min(numCards, bid)); // Asegurar que el canto esté entre 0 y numCards

         // Aplicar regla de la "Podrida" si es el último
         const forbiddenBid = calculateForbiddenBid();
         if (currentRoundData.isPudricionEnforced && bid === forbiddenBid) {
            // Si el canto estimado es el prohibido, elegir el más cercano válido
            if (bid > 0 && bid - 1 !== forbiddenBid) {
                bid--;
            } else if (bid < numCards && bid + 1 !== forbiddenBid) {
                bid++;
            } else {
                // Caso raro: si 0 y 1 son prohibidos (mano de 1 carta), o max y max-1... forzar uno válido
                 bid = (bid === 0) ? 1 : 0; // Simple toggle, puede no ser óptimo
                 if(bid === forbiddenBid) { // Si sigue prohibido, buscar otro
                     for(let i=0; i<=numCards; i++) {
                         if (i !== forbiddenBid) { bid = i; break;}
                     }
                 }
            }
             console.log(`Bot ${player.name} ajustó canto por regla de podrida a: ${bid}`);
         }

         console.log(`Bot ${player.name} canta: ${bid}`);
         currentRoundData.bids[botIndex] = bid;
         currentRoundData.bidsTotal += bid;
         renderScoresAndBids(); // Actualizar UI
    }

    function advanceBidder() {
        const nextBidderIndex = (currentRoundData.bidderIndex + 1) % NUM_PLAYERS;

        // Si hemos vuelto al primer cantor, la fase de canto terminó
        if (nextBidderIndex === (currentRoundData.dealerIndex + 1) % NUM_PLAYERS) {
            finishBiddingPhase();
        } else {
            currentRoundData.bidderIndex = nextBidderIndex;
            proceedBidding();
        }
    }

    function finishBiddingPhase() {
        console.log("Fase de Canto terminada. Cantos:", currentRoundData.bids);
        // Doble chequeo de la regla de podrida (debería ser innecesario si la lógica es correcta)
        const finalSum = currentRoundData.bids.reduce((a, b) => a + b, 0);
        if (finalSum === currentRoundData.cardsPerHand) {
             console.error("¡ERROR! La suma de cantos es igual al número de cartas. Arreglando...");
             // Aquí se podría forzar un cambio en el último canto o reiniciar canto, pero idealmente no debería pasar.
             // Por simplicidad, lo dejaremos pasar por ahora si ocurre un bug.
        }

        currentRoundData.phase = 'playing';
        // El jugador a la izquierda del repartidor lidera el primer truco
        currentRoundData.currentPlayerIndex = (currentRoundData.dealerIndex + 1) % NUM_PLAYERS;
        currentRoundData.trickLeaderIndex = currentRoundData.currentPlayerIndex; // Quién empieza el primer truco
        gameInfoElement.textContent = `¡A jugar! Empieza ${players[currentRoundData.currentPlayerIndex].name}.`;
        highlightActivePlayer();
        updatePlayableCardsUI();

        // Si el primer jugador es un bot, iniciar su turno
        if (players[currentRoundData.currentPlayerIndex].isBot) {
            setTimeout(handleBotTurn, 1000);
        }
    }


    // --- Lógica de Juego (Playing) ---

     function isValidPlay(cardToPlay, playerHand, currentTrick, trumpSuit) {
        const leadingCard = currentTrick.length > 0 ? currentTrick[0].card : null;
        const leadingSuit = leadingCard ? leadingCard.suit : null;

        // 1. ¿Tiene el palo líder?
        const playerHasLeadingSuit = playerHand.some(card => card.suit === leadingSuit);

        if (leadingSuit) {
             // Si tiene el palo líder, DEBE jugarlo
            if (playerHasLeadingSuit && cardToPlay.suit !== leadingSuit) {
                //console.log("Validación Fallida: Debe seguir el palo líder", leadingSuit);
                return false;
            }
             // Si NO tiene el palo líder, puede jugar cualquier cosa (triunfo o descarte)
             if (!playerHasLeadingSuit) {
                 return true;
             }
        }

        // 2. Si está liderando el truco (leadingSuit es null) o si siguió el palo correctamente
        return true;

        // Nota: No hay restricciones como "no romper corazones" o "no puntos en primera" aquí.
    }

     function handleHumanPlay(card) {
        if (currentRoundData.phase !== 'playing' || currentRoundData.currentPlayerIndex !== HUMAN_PLAYER_INDEX) {
             console.log("No es tu turno o no es fase de juego.");
             return;
         }

        const player = players[HUMAN_PLAYER_INDEX];

        if (isValidPlay(card, player.hand, currentRoundData.currentTrick, currentRoundData.trumpSuit)) {
            playCard(card, HUMAN_PLAYER_INDEX);
        } else {
            gameInfoElement.textContent = "Jugada inválida. Debes seguir el palo si puedes.";
            // Podríamos resetear el mensaje después de un tiempo
        }
    }

    function handleBotTurn() {
        if (currentRoundData.phase !== 'playing' || !players[currentRoundData.currentPlayerIndex].isBot) {
             return; // No es turno de un bot o no estamos en fase de juego
         }

        const playerIndex = currentRoundData.currentPlayerIndex;
        const player = players[playerIndex];
        const hand = player.hand;
        const currentBid = currentRoundData.bids[playerIndex];
        const tricksTaken = currentRoundData.trickTakens[playerIndex];
        const trump = currentRoundData.trumpSuit;
        const trick = currentRoundData.currentTrick;

        const playableCards = hand.filter(card => isValidPlay(card, hand, trick, trump));

        if (playableCards.length === 0) {
             console.error(`¡Error! Bot ${player.name} no tiene cartas jugables.`);
             if (hand.length > 0) playCard(hand[0], playerIndex); // Fallback muy básico
             return;
         }

        // IA de Juego Simple:
        let cardToPlay = null;
        const leadingSuit = trick.length > 0 ? trick[0].card.suit : null;
        const cardsInLeadingSuit = playableCards.filter(c => c.suit === leadingSuit);
        const canFollowSuit = cardsInLeadingSuit.length > 0;

        // Determinar si necesita ganar o perder bazas
        const needsToWin = tricksTaken < currentBid;

        if (leadingSuit) { // No está liderando
            if (canFollowSuit) {
                 cardsInLeadingSuit.sort((a, b) => a.value - b.value); // Ordenar de menor a mayor
                 if (needsToWin) {
                    // Intentar ganar si es posible, jugar la más alta del palo
                    cardToPlay = cardsInLeadingSuit[cardsInLeadingSuit.length - 1];
                    // TODO: Podría ser más inteligente y ver si la más alta realmente gana el truco actual
                 } else {
                    // Intentar perder, jugar la más baja del palo
                    cardToPlay = cardsInLeadingSuit[0];
                 }
            } else { // No puede seguir el palo
                const trumpCards = playableCards.filter(c => c.suit === trump);
                trumpCards.sort((a, b) => a.value - b.value); // Ordenar triunfos
                const nonTrumpCards = playableCards.filter(c => c.suit !== trump);
                nonTrumpCards.sort((a, b) => b.value - a.value); // Ordenar descartes (más alto primero)

                 if (needsToWin && trump !== 'none') {
                     // Intentar ganar con triunfo si puede
                     if (trumpCards.length > 0) {
                         // Jugar el triunfo más bajo que gane, o el más alto si no está seguro? Simple: jugar el más alto.
                          cardToPlay = trumpCards[trumpCards.length - 1];
                          // TODO: Mejorar: ver si ya hay un triunfo más alto en la mesa
                     } else {
                          // No tiene triunfo, descartar la carta más alta (menos valiosa)
                          cardToPlay = nonTrumpCards[0] || playableCards[0]; // Descartar más alto, o lo que quede
                     }
                 } else {
                     // Intentar perder (no seguir palo)
                     // Descartar la carta más alta que NO sea triunfo primero
                     if (nonTrumpCards.length > 0) {
                         cardToPlay = nonTrumpCards[0];
                     } else if (trumpCards.length > 0){
                         // Si solo tiene triunfos, jugar el más bajo
                         cardToPlay = trumpCards[0];
                     } else {
                         cardToPlay = playableCards[0]; // Fallback
                     }
                 }
            }
        } else { // Está liderando el truco
             playableCards.sort((a, b) => a.value - b.value); // Ordenar de menor a mayor
             if (needsToWin) {
                 // Intentar sacar una baza liderando con carta alta o triunfo
                 const highCards = playableCards.filter(c => c.value >= RANK_VALUES['K'] || (c.suit === trump && c.value >= RANK_VALUES['J']));
                 if (highCards.length > 0) {
                     cardToPlay = highCards[highCards.length - 1]; // Liderar con la más alta 'segura'
                 } else if (trump !== 'none' && playableCards.some(c => c.suit === trump)) {
                     // Liderar con triunfo bajo si no tiene cartas altas
                     cardToPlay = playableCards.find(c => c.suit === trump) || playableCards[playableCards.length-1];
                 }
                  else {
                     cardToPlay = playableCards[playableCards.length - 1]; // Liderar con la más alta que tenga
                 }
             } else {
                 // Intentar perder la baza liderando bajo
                  // Liderar con la carta más baja que no sea triunfo (si es posible)
                 const lowNonTrumps = playableCards.filter(c => c.suit !== trump);
                 if (lowNonTrumps.length > 0) {
                     cardToPlay = lowNonTrumps[0];
                 } else {
                     cardToPlay = playableCards[0]; // Liderar con el triunfo más bajo si solo quedan triunfos
                 }
             }
        }

        // Fallback por si algo falló en la lógica
        if (!cardToPlay) {
            console.warn(`Bot ${player.name} no pudo decidir, jugando la primera válida.`);
             cardToPlay = playableCards[0];
        }


        if (cardToPlay) {
            setTimeout(() => {
                playCard(cardToPlay, playerIndex);
            }, 800 + Math.random() * 500);
        } else {
            console.error("El Bot no pudo seleccionar una carta para jugar.");
        }
    }

     function playCard(card, playerIndex) {
        const player = players[playerIndex];

        // Quitar carta de la mano lógica
        const cardHandIndex = player.hand.findIndex(c => c.id === card.id);
        if (cardHandIndex === -1) {
            console.error("Error: Carta no encontrada en la mano!", card, player.hand);
            return;
        }
        player.hand.splice(cardHandIndex, 1);

        // Añadir al truco lógico
        currentRoundData.currentTrick.push({ card, playerIndex });

        // Actualizar UI
        renderHands(); // Podría optimizarse para solo actualizar la mano del jugador
        renderTrickArea();

        // ¿Terminó el truco?
        if (currentRoundData.currentTrick.length === NUM_PLAYERS) {
            gameInfoElement.textContent = "Evaluando truco...";
            setTimeout(finishTrick, 1200); // Pausa para ver el truco
        } else {
            // Pasar al siguiente jugador
            currentRoundData.currentPlayerIndex = (currentRoundData.currentPlayerIndex + 1) % NUM_PLAYERS;
            gameInfoElement.textContent = `Turno de ${players[currentRoundData.currentPlayerIndex].name}.`;
            highlightActivePlayer();
            updatePlayableCardsUI();
             // Si es bot, llamar a su turno
             if (players[currentRoundData.currentPlayerIndex].isBot) {
                 setTimeout(handleBotTurn, 1000);
             }
        }
    }

    function finishTrick() {
        if (currentRoundData.currentTrick.length !== NUM_PLAYERS) return;

        const trick = currentRoundData.currentTrick;
        const trump = currentRoundData.trumpSuit;
        const leadingSuit = trick[0].card.suit;

        let winningCard = trick[0].card;
        let winnerIndex = trick[0].playerIndex;
        let highestTrumpValue = -1;
        let highestLeadingSuitValue = -1;

        // Determinar carta ganadora
         trick.forEach(played => {
             const card = played.card;
             const pIndex = played.playerIndex;

              if (card.suit === trump && trump !== 'none') { // Es un triunfo
                  if (card.value > highestTrumpValue) {
                      highestTrumpValue = card.value;
                      winningCard = card;
                      winnerIndex = pIndex;
                  }
              } else if (card.suit === leadingSuit && highestTrumpValue === -1) { // Es del palo líder y no hay triunfos aún
                  if (card.value > highestLeadingSuitValue) {
                       highestLeadingSuitValue = card.value;
                       winningCard = card;
                       winnerIndex = pIndex;
                  }
              }
         });


        // Asignar baza al ganador
        currentRoundData.trickTakens[winnerIndex]++;
        console.log(`${players[winnerIndex].name} gana el truco con ${winningCard.rank}${SUIT_SYMBOLS[winningCard.suit]}. Bazas tomadas: ${currentRoundData.trickTakens[winnerIndex]}`);

        // Limpiar para siguiente truco
        currentRoundData.currentTrick = [];
        currentRoundData.trickLeaderIndex = winnerIndex; // El ganador lidera
        currentRoundData.currentPlayerIndex = winnerIndex;

        // Actualizar UI (puntajes/bazas tomadas)
        renderScoresAndBids();
        renderTrickArea(); // Limpiar área

        // ¿Terminó la ronda (se jugaron todas las cartas)?
        const tricksPlayed = currentRoundData.trickTakens.reduce((a, b) => a + b, 0);
        // console.log("Tricks played:", tricksPlayed, "Expected:", currentRoundData.cardsPerHand);
        if (tricksPlayed === currentRoundData.cardsPerHand) {
            currentRoundData.phase = 'scoring';
            gameInfoElement.textContent = "Ronda terminada. Calculando puntajes...";
            setTimeout(finishRound, 1500);
        } else {
            // Iniciar siguiente truco
            gameInfoElement.textContent = `Turno de ${players[currentRoundData.currentPlayerIndex].name} para liderar.`;
            highlightActivePlayer();
            updatePlayableCardsUI();
             if (players[currentRoundData.currentPlayerIndex].isBot) {
                 setTimeout(handleBotTurn, 1000);
             }
        }
    }

     // --- Puntuación y Fin de Juego ---

    function finishRound() {
        console.log("--- Calculando Puntajes Ronda", currentRoundData.roundNumber, "---");
        let roundSummary = [];

        players.forEach((player, index) => {
            const bid = currentRoundData.bids[index];
            const taken = currentRoundData.trickTakens[index];
            let roundScore = 0;

            if (bid === taken) {
                roundScore = 10 + bid; // 10 puntos base + 1 por cada baza acertada
                console.log(`${player.name}: Acertó! (Cantó ${bid}, Tomó ${taken}) +${roundScore} puntos.`);
            } else {
                roundScore = 0; // Sin puntos si falla (se pudrió)
                console.log(`${player.name}: Falló! (Cantó ${bid}, Tomó ${taken}) +${roundScore} puntos.`);
                 // Alternativa: restar puntos? Ej: roundScore = -10;
            }
            player.totalScore += roundScore;
            roundSummary.push(`${player.name}: ${roundScore} pts (Total: ${player.totalScore})`);
        });

        renderScoresAndBids(); // Actualizar puntajes totales

        // Mostrar resumen o preparar siguiente ronda
        gameInfoElement.innerHTML = `Fin Ronda ${currentRoundData.roundNumber}.<br>Resultados: ${roundSummary.join(', ')}`;

        // Comprobar fin de juego
        if (currentRoundData.roundNumber >= TOTAL_ROUNDS) {
            setTimeout(endGame, 2000);
        } else {
            nextRoundButton.style.display = 'block'; // Mostrar botón para continuar
        }
    }

    function endGame() {
        currentRoundData.phase = 'gameOver';
        console.log("--- Fin del Juego ---");
        console.log("Puntajes Finales:", players.map(p => ({ name: p.name, score: p.totalScore })));

        // Encontrar al ganador (el que tiene MÁS puntos)
        let maxScore = -Infinity;
        let winners = [];
        players.forEach(player => {
            if (player.totalScore > maxScore) {
                maxScore = player.totalScore;
                winners = [player.name];
            } else if (player.totalScore === maxScore) {
                winners.push(player.name);
            }
        });

        let gameOverMessage = `¡Fin del Juego!<br>Puntajes Finales:<br>`;
        players.forEach(p => gameOverMessage += `${p.name}: ${p.totalScore} pts<br>`);
        gameOverMessage += `<br>Ganador(es): ${winners.join(' y ')} con ${maxScore} puntos!`;

        gameInfoElement.innerHTML = gameOverMessage;
        nextRoundButton.style.display = 'none';
        // Opcional: Mostrar botón "Jugar de Nuevo" que llame a initializeGame()
         startGameButton.textContent = "Jugar de Nuevo";
         startGameButton.style.display = 'block';

    }

    // --- Inicialización ---
    startGameButton.addEventListener('click', initializeGame);
    nextRoundButton.addEventListener('click', startNextRound);

}); // Fin DOMContentLoaded
