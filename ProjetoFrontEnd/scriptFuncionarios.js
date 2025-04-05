// Toggle bar function
document.getElementById("menu-toggle").addEventListener("click", function() {
    document.getElementById("sidebar").classList.toggle("active");
    document.body.classList.toggle("sidebar-active");
});

document.getElementById("funcionarioForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    let cpf = document.getElementById("cpf").value.trim();
    let nome = document.getElementById("nome").value.trim();
    let nascimento = document.getElementById("nascimento").value;
    let registro = document.getElementById("registro").value.trim();
    
    // Verifica se estamos editando uma linha existente
    const linhaEditando = document.querySelector(".editando");
    
    if (linhaEditando) {
        // Atualiza a linha existente
        linhaEditando.cells[0].textContent = cpf;
        linhaEditando.cells[1].textContent = nome;
        linhaEditando.cells[2].textContent = nascimento;
        linhaEditando.cells[3].textContent = registro;
        
        // Remove a classe de edição e restaura o botão
        linhaEditando.classList.remove("editando");
        document.querySelector("button[type='submit']").textContent = "Adicionar";
    } else if (cpf && nome && nascimento && registro) {
        // Adiciona nova linha
        let tabela = document.getElementById("tabelaFuncionarios");
        let newRow = tabela.insertRow();

        newRow.innerHTML = `
            <td>${cpf}</td>
            <td>${nome}</td>
            <td>${nascimento}</td>
            <td>${registro}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarFuncionario(this)">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="removerFuncionario(this)">Excluir</button>
            </td>
        `;
    }
    
    atualizarTotal();
    document.getElementById("funcionarioForm").reset();
});

function filtrarFuncionarios() {
    let filtro = document.getElementById("search").value.toLowerCase();
    let linhas = document.getElementById("tabelaFuncionarios").getElementsByTagName("tr");

    for (let linha of linhas) {
        let colunas = linha.getElementsByTagName("td");
        if (colunas.length > 0) {
            let cpf = colunas[0].textContent.toLowerCase();
            let nome = colunas[1].textContent.toLowerCase();
            
            linha.style.display = (cpf.includes(filtro) || nome.includes(filtro)) ? "" : "none";
        }
    }
}

function removerFuncionario(botao) {
    if (confirm("Tem certeza que deseja remover este funcionário?")) {
        let linha = botao.parentElement.parentElement;
        linha.remove();
        atualizarTotal();
    }
}

function editarFuncionario(botao) {
    const linha = botao.parentElement.parentElement;
    const celulas = linha.cells;
    
    // Preenche o formulário com os dados da linha
    document.getElementById("cpf").value = celulas[0].textContent;
    document.getElementById("nome").value = celulas[1].textContent;
    document.getElementById("nascimento").value = celulas[2].textContent;
    document.getElementById("registro").value = celulas[3].textContent;
    
    // Marca a linha como sendo editada
    linha.classList.add("editando");
    
    // Altera o texto do botão para indicar que está editando
    document.querySelector("button[type='submit']").textContent = "Salvar Edição";
    
    // Rolagem suave até o formulário
    document.getElementById("funcionarioForm").scrollIntoView({ behavior: 'smooth' });
}

function atualizarTotal() {
    let total = document.getElementById("tabelaFuncionarios").rows.length;
    document.getElementById("totalFuncionarios").textContent = total;
}