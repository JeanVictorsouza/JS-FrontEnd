document.getElementById("funcionarioForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    let cpf = document.getElementById("cpf").value.trim();
    let nome = document.getElementById("nome").value.trim();
    let nascimento = document.getElementById("nascimento").value;
    let registro = document.getElementById("registro").value.trim();
    
    if (cpf && nome && nascimento && registro) {
        let tabela = document.getElementById("tabelaFuncionarios");
        let newRow = tabela.insertRow();

        newRow.innerHTML = `
            <td>${cpf}</td>
            <td>${nome}</td>
            <td>${nascimento}</td>
            <td>${registro}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="removerFuncionario(this)">Excluir</button>
            </td>
        `;
        
        atualizarTotal();
        document.getElementById("funcionarioForm").reset();
    }
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

function atualizarTotal() {
    let total = document.getElementById("tabelaFuncionarios").rows.length;
    document.getElementById("totalFuncionarios").textContent = total;
}