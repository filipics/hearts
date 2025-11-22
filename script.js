document.addEventListener('DOMContentLoaded', () => {
    
    // Toggle para el menú móvil
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Cerrar el menú al hacer clic en un enlace (para UX en móvil)
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Efecto simple en botones de precio
    const buttons = document.querySelectorAll('.btn-price');
    buttons.forEach(btn => {
        btn.addEventListener('mouseover', () => {
            btn.style.transform = "scale(1.02)";
        });
        btn.style.transition = "transform 0.2s";
        
        btn.addEventListener('mouseout', () => {
            btn.style.transform = "scale(1)";
        });
    });
});
