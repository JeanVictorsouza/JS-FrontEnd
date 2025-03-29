// Toggle bar function
document.getElementById("menu-toggle").addEventListener("click", function() {
    document.getElementById("sidebar").classList.toggle("active");
    document.body.classList.toggle("sidebar-active");
});

function loadPage(page) {
    let contentDiv = document.getElementById("content");
    if (page === "funcionarios") {
        renderFuncionarioPage();
    } else if (page === "sala_vacinas") {
        renderVacinasPage();
    } else {
        contentDiv.innerHTML = `<h2>${page}</h2><p>Conteúdo da página ${page}.</p>`;
    }
}