// Dynamic content loader for modular EuroTrip site



async function loadSection(sectionId) {

    const container = document.querySelector('.main-container');

    if (!container) {

        console.error('Main container not found');

        return;

    }

    

    // Determine file path

    let filepath;

    if (sectionId === 'home') {

        filepath = 'sections/inicio.html';

    } else if (sectionId.startsWith('day')) {

        filepath = `days/${sectionId}.html`;

    } else if (['gastos', 'docs', 'gems', 'checklist', 'packing'].includes(sectionId)) {

        filepath = `sections/${sectionId}.html`;

    } else {

        console.error('Unknown section:', sectionId);

        return;

    }

    

    try {

        const response = await fetch(filepath);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const html = await response.text();

        container.innerHTML = html;

        

        // Ensure the loaded section is visible

        const section = container.querySelector('.section');

        if (section) {

            section.classList.add('active');

        }

        

        // Scroll to top

        window.scrollTo({ top: 0, behavior: 'smooth' });

        

        // Re-run any scripts in the loaded content

        const scripts = container.querySelectorAll('script');

        scripts.forEach(oldScript => {

            const newScript = document.createElement('script');

            Array.from(oldScript.attributes).forEach(attr => {

                newScript.setAttribute(attr.name, attr.value);

            });

            newScript.textContent = oldScript.textContent;

            oldScript.parentNode.replaceChild(newScript, oldScript);

        });

        

    } catch (error) {

        console.error('Error loading section:', error);

        container.innerHTML = `

            <div class="tip-box" style="background:#FEE2E2; border-color:#DC2626;">

                <h4 style="color:#DC2626;"><i class="fas fa-exclamation-triangle"></i> Error loading content</h4>

                <p style="color:#991B1B;">Could not load ${filepath}. Make sure you're running this from a web server.</p>

            </div>

        `;

    }

}



// Modified navTo function

function navTo(sectionId, city, element) {

    // Remove active class from all menu items

    document.querySelectorAll('.desktop-menu-item, .menu-item, .day-btn').forEach(item => {

        item.classList.remove('active');

    });

    

    // Add active class to clicked item

    if (element) {

        element.classList.add('active');

    }

    

    // Change background based on city

    if (city === 'paris') {

        document.body.style.backgroundImage = 'var(--bg-paris)';

    } else if (city === 'london') {

        document.body.style.backgroundImage = 'var(--bg-london)';

    } else if (city === 'brussels') {

        document.body.style.backgroundImage = 'var(--bg-brussels)';

    }

    

    // Load content

    loadSection(sectionId);

    

    return false;

}



// Mobile navigation helper

function navToDay(dayNum) {

    navTo(`day${dayNum}`, getDayCity(dayNum));

}



function getDayCity(dayNum) {

    const cityMap = {

        1: 'paris',

        2: 'paris',

        3: 'brussels',

        4: 'london',

        5: 'london',

        6: 'london'

    };

    return cityMap[dayNum] || 'paris';

}



// Toggle mobile menu

function toggleMenu() {

    const sidebar = document.getElementById('sidebar');

    const overlay = document.getElementById('overlay');

    if (sidebar && overlay) {

        sidebar.classList.toggle('active');

        overlay.classList.toggle('active');

    }

}



// Toggle rain mode

function toggleRainMode() {

    document.body.classList.toggle('raining');

    const switches = document.querySelectorAll('.rain-switch');

    switches.forEach(sw => sw.classList.toggle('active'));

}



// Load home on page load

window.addEventListener('DOMContentLoaded', () => {

    loadSection('home');

});



