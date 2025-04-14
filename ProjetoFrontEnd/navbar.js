// Controle do menu lateral
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById("menu-toggle");
    const sidebar = document.getElementById("sidebar");
    const content = document.querySelector(".content");

    if (menuToggle && sidebar) {
        // Evento de clique no botão do menu
        menuToggle.addEventListener("click", function(e) {
            e.stopPropagation();
            toggleMenu();
        });

        // Fecha o menu ao clicar fora
        document.addEventListener("click", function(e) {
            if (sidebar.classList.contains("active") && !sidebar.contains(e.target) && e.target !== menuToggle) {
                closeMenu();
            }
        });

        // Fecha o menu ao pressionar ESC
        document.addEventListener("keydown", function(e) {
            if (e.key === "Escape" && sidebar.classList.contains("active")) {
                closeMenu();
            }
        });

        function toggleMenu() {
            sidebar.classList.toggle("active");
            document.body.classList.toggle("sidebar-active");
            menuToggle.setAttribute("aria-expanded", sidebar.classList.contains("active"));
            
            // Ajusta o padding do conteúdo
            if (sidebar.classList.contains("active")) {
                content.style.paddingLeft = "270px";
            } else {
                content.style.paddingLeft = "20px";
            }
        }

        function closeMenu() {
            sidebar.classList.remove("active");
            document.body.classList.remove("sidebar-active");
            menuToggle.setAttribute("aria-expanded", "false");
            content.style.paddingLeft = "20px";
        }
    }
});

// Função de logout
function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = "../index/index.html";
}