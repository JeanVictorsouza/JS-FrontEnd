document.getElementById("menu-toggle").addEventListener("click", function() {
    document.getElementById("sidebar").classList.toggle("active");
    document.body.classList.toggle("sidebar-active"); // Ajusta o conteúdo
});

// Simulação de mudança de conteúdo ao clicar no menu
function loadPage(page) {
    document.getElementById("content").innerHTML = `<h2>${page}</h2><p>Você selecionou ${page}.</p>`;
}

// Simulação de autenticação
function toggleAuth() {
    let authModal = new bootstrap.Modal(document.getElementById('authModal'));
    authModal.show();
}

document.addEventListener("DOMContentLoaded", () => {
    carregarVacinas();
    checkAuthStatus();
});

// Carregar vacinas do localStorage ou usar padrão inicial
function carregarVacinas() {
    let vacinasSalvas = localStorage.getItem("vacinas");
    if (vacinasSalvas) {
        vacinas = JSON.parse(vacinasSalvas);
    } else {
        vacinas = [
            { nome: "COVID-19 (Pfizer)", lote: "ABC123", validade: "2024-12-15", quantidade: 250 },
            { nome: "Hepatite B", lote: "DEF456", validade: "2024-11-10", quantidade: 180 },
            { nome: "Influenza", lote: "GHI789", validade: "2025-01-20", quantidade: 300 },
            { nome: "Hepatite c", lote: "DEF456", validade: "2024-11-10", quantidade: 180 },
            { nome: "Hepatite d", lote: "DEF456", validade: "2024-11-10", quantidade: 180 },
        ];
        salvarVacinas();
    }
}

// Salvar vacinas no localStorage
function salvarVacinas() {
    localStorage.setItem("vacinas", JSON.stringify(vacinas));
}

// Adicionar nova vacina
function adicionarVacina() {
    let nome = prompt("Nome da vacina:");
    let lote = prompt("Lote:");
    let validade = prompt("Data de validade (YYYY-MM-DD):");
    let quantidade = prompt("Quantidade:");

    if (nome && lote && validade && !isNaN(quantidade) && quantidade >= 0) {
        vacinas.push({ nome, lote, validade, quantidade: parseInt(quantidade) });
        salvarVacinas();
        loadPage("sala_vacinas");
    } else {
        alert("Dados inválidos. Vacina não foi adicionada.");
    }
}

// Atualizar quantidade
function atualizarQuantidade(index, operacao) {
    if (operacao === "incrementar") {
        vacinas[index].quantidade++;
    } else if (operacao === "decrementar" && vacinas[index].quantidade > 0) {
        vacinas[index].quantidade--;
    }
    salvarVacinas();
    loadPage("sala_vacinas");
}

// Excluir vacina
function excluirVacina(index) {
    if (confirm("Tem certeza que deseja excluir esta vacina? Essa ação não pode ser desfeita.")) {
        vacinas.splice(index, 1);
        salvarVacinas();
        loadPage("sala_vacinas");
    }
}

// Abrir modal de edição
function editarVacina(index) {
    let vacina = vacinas[index];

    let modal = `
        <div class="modal fade" id="editModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Editar Vacina</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <label>Nome da Vacina:</label>
                        <input type="text" id="editNome" class="form-control mb-2" value="${vacina.nome}">
                        <label>Lote:</label>
                        <input type="text" id="editLote" class="form-control mb-2" value="${vacina.lote}">
                        <label>Data de Validade:</label>
                        <input type="date" id="editValidade" class="form-control mb-2" value="${vacina.validade}">
                        <label>Quantidade:</label>
                        <input type="number" id="editQuantidade" class="form-control mb-2" value="${vacina.quantidade}">
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" onclick="salvarEdicao(${index})">Salvar</button>
                        <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    </div>
                </div>
            </div>
        </div>`;

    document.body.insertAdjacentHTML("beforeend", modal);
    let editModal = new bootstrap.Modal(document.getElementById("editModal"));
    editModal.show();

    document.getElementById("editModal").addEventListener("hidden.bs.modal", () => {
        document.getElementById("editModal").remove();
    });
}

// Salvar edição da vacina
function salvarEdicao(index) {
    vacinas[index] = {
        nome: document.getElementById("editNome").value,
        lote: document.getElementById("editLote").value,
        validade: document.getElementById("editValidade").value,
        quantidade: parseInt(document.getElementById("editQuantidade").value)
    };
    
    salvarVacinas();
    loadPage("sala_vacinas");
    bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
}

// Pesquisar vacinas dinamicamente
function pesquisarVacina() {
    let input = document.getElementById("search-input").value.toLowerCase();
    let linhas = document.querySelectorAll("#tabela-vacinas tbody tr");

    linhas.forEach(linha => {
        let nomeVacina = linha.querySelector("td:first-child").textContent.toLowerCase();
        linha.style.display = nomeVacina.includes(input) ? "" : "none";
    });
}

// Carregar a página da Sala de Vacinas
function loadPage(page) {
    let contentDiv = document.getElementById("content");

    if (page === "sala_vacinas") {
        let tabela = `
            <div>
                <h2>Sala de Vacinas</h2>
                <button class="btn btn-primary mb-3" onclick="adicionarVacina()">➕ Adicionar Vacina</button>
                <input type="text" id="search-input" class="form-control mb-3" placeholder="Pesquisar vacina..." onkeyup="pesquisarVacina()">
                <table id="tabela-vacinas" class="table table-striped mt-3">
                    <thead class="table-dark">
                        <tr>
                            <th>Nome da Vacina</th>
                            <th>Lote</th>
                            <th>Data de Vencimento</th>
                            <th>Quantidade</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>`;

        vacinas.forEach((vacina, index) => {
            tabela += `
                <tr>
                    <td>${vacina.nome}</td>
                    <td>${vacina.lote}</td>
                    <td>${vacina.validade}</td>
                    <td id="quantidade-${index}">${vacina.quantidade} doses</td>
                    <td>
                        <button class="btn btn-success btn-sm" onclick="atualizarQuantidade(${index}, 'incrementar')">+</button>
                        <button class="btn btn-danger btn-sm" onclick="atualizarQuantidade(${index}, 'decrementar')">-</button>
                        <button class="btn btn-warning btn-sm" onclick="editarVacina(${index})">✏️ Editar</button>
                        <button class="btn btn-dark btn-sm" onclick="excluirVacina(${index})">🗑️ Excluir</button>
                    </td>
                </tr>`;
        });

        tabela += `
                    </tbody>
                </table>
            </div>`;

        contentDiv.innerHTML = tabela;
    } else {
        contentDiv.innerHTML = `<h2>${page}</h2><p>Conteúdo da página ${page}.</p>`;
    }
}