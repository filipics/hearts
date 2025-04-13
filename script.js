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
        return { suit, rank, value: RANK_VALUES[rank], id: `<span class="math-inline">\{rank\}</span>{suit.charAt(0).toUpperCase()}` };
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
                    const dummyCard = { suit: 'club', rank: '?', value: 0, id: `back-<span class="math-inline">\{index\}\-</span>{i}` };
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
        roundIndicatorElement.textContent = `Ronda: <span class="math-inline">\{currentRoundData\.roundNumber\}/</span>{TOTAL_ROUNDS}`;
        cardsPerHandElement.textContent = `Cartas: ${currentRoundData.cardsPerHand}`;
        dealerIndicatorElement.textContent = `Reparte: ${players[currentRoundData.dealerIndex].name}`;

        let trumpHtml = "Triunfo: ";
        if (currentRoundData.trumpSuit === 'none') {
             trumpHtml += `<span class="suit-symbol none">${NO_TRUMP_SYMBOL}</span>`;
        } else if (currentRoundData.trumpSuit) {
            const symbol = SUIT_SYMBOLS[currentRoundData.trumpSuit];
            trumpHtml += `<span class="suit-symbol <span class="math-inline">\{currentRoundData\.trumpSuit\}"\></span>{symbol}</span>`;
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
