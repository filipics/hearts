class TrucoScore {
    constructor() {
        this.scores = { team1: 0, team2: 0 };
        this.currentTeam = 1; // 1 = Nosotros, 2 = Ellos
        
        this.sticks1 = document.getElementById('sticks1');
        this.sticks2 = document.getElementById('sticks2');
        this.addBtn = document.getElementById('addBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        this.addBtn.addEventListener('click', () => this.addPoint());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        // Alternar equipo con clic en los contenedores
        this.sticks1.addEventListener('click', () => this.switchTeam(1));
        this.sticks2.addEventListener('click', () => this.switchTeam(2));
    }
    
    addPoint() {
        const teamKey = this.currentTeam === 1 ? 'team1' : 'team2';
        this.scores[teamKey]++;
        
        this.updateSticks();
        this.updateScores();
        
        // Cambiar equipo automáticamente
        this.currentTeam = this.currentTeam === 1 ? 2 : 1;
        this.updateActiveTeam();
    }
    
    switchTeam(team) {
        this.currentTeam = team;
        this.updateActiveTeam();
    }
    
    updateSticks() {
        // Limpiar palitos existentes
        this.sticks1.innerHTML = '';
        this.sticks2.innerHTML = '';
        
        // Agregar palitos para equipo 1
        for (let i = 0; i < this.scores.team1; i++) {
            const stick = document.createElement('div');
            stick.className = 'stick';
            this.sticks1.appendChild(stick);
        }
        
        // Agregar palitos para equipo 2
        for (let i = 0; i < this.scores.team2; i++) {
            const stick = document.createElement('div');
            stick.className = 'stick';
            this.sticks2.appendChild(stick);
        }
    }
    
    updateScores() {
        const scoreElements = document.querySelectorAll('.score');
        scoreElements[0].textContent = this.scores.team1;
        scoreElements[1].textContent = this.scores.team2;
    }
    
    updateActiveTeam() {
        // Remover clase active de todos los contenedores
        this.sticks1.style.opacity = '0.5';
        this.sticks2.style.opacity = '0.5';
        
        // Agregar clase active al equipo actual
        if (this.currentTeam === 1) {
            this.sticks1.style.opacity = '1';
        } else {
            this.sticks2.style.opacity = '1';
        }
    }
    
    reset() {
        this.scores = { team1: 0, team2: 0 };
        this.currentTeam = 1;
        this.updateSticks();
        this.updateScores();
        this.updateActiveTeam();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new TrucoScore();
});