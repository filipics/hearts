class DiceRoller {
    constructor() {
        this.dice = document.getElementById('dice');
        this.rollBtn = document.getElementById('rollBtn');
        this.result = document.getElementById('result');
        this.historyList = document.getElementById('historyList');
        this.isRolling = false;
        this.history = [];
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        this.rollBtn.addEventListener('click', () => this.rollDice());
        
        // También permitir tirar con la barra espaciadora
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isRolling) {
                e.preventDefault();
                this.rollDice();
            }
        });
    }
    
    rollDice() {
        if (this.isRolling) return;
        
        this.isRolling = true;
        this.rollBtn.disabled = true;
        this.result.textContent = '';
        
        // Generar número aleatorio del 1 al 6
        const randomNumber = Math.floor(Math.random() * 6) + 1;
        
        // Aplicar animación de rotación
        this.dice.classList.add('rolling');
        
        // Simular tiempo de animación
        setTimeout(() => {
            this.showResult(randomNumber);
            this.dice.classList.remove('rolling');
            this.isRolling = false;
            this.rollBtn.disabled = false;
        }, 1000);
    }
    
    showResult(number) {
        // Configurar la rotación del dado para mostrar el número correcto
        const rotations = {
            1: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)',
            2: 'rotateX(0deg) rotateY(-90deg) rotateZ(0deg)',
            3: 'rotateX(-90deg) rotateY(0deg) rotateZ(0deg)',
            4: 'rotateX(90deg) rotateY(0deg) rotateZ(0deg)',
            5: 'rotateX(0deg) rotateY(90deg) rotateZ(0deg)',
            6: 'rotateX(180deg) rotateY(0deg) rotateZ(0deg)'
        };
        
        this.dice.style.transform = rotations[number];
        
        // Mostrar resultado
        this.result.textContent = `¡Sacaste un ${number}!`;
        
        // Agregar al historial
        this.addToHistory(number);
        
        // Efecto visual adicional
        this.result.style.animation = 'none';
        setTimeout(() => {
            this.result.style.animation = 'pulse 0.5s ease-in-out';
        }, 10);
    }
    
    addToHistory(number) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const historyItem = {
            number: number,
            time: timeString,
            timestamp: now.getTime()
        };
        
        this.history.unshift(historyItem);
        
        // Mantener solo los últimos 10 resultados
        if (this.history.length > 10) {
            this.history = this.history.slice(0, 10);
        }
        
        this.updateHistoryDisplay();
    }
    
    updateHistoryDisplay() {
        this.historyList.innerHTML = '';
        
        this.history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <span class="history-number">🎲 ${item.number}</span>
                <span class="history-time">${item.time}</span>
            `;
            this.historyList.appendChild(historyItem);
        });
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new DiceRoller();
});

// Agregar animación CSS para el resultado
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);