document.getElementById("vacinaForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    let codigo = document.getElementById("codigo").value.trim();
    let nome = document.getElementById("nome").value.trim();
    let data = document.getElementById("data").value;
    let quantidade = parseInt(document.getElementById("quantidade").value, 10);
    
    if (codigo && nome && data && quantidade > 0) {
        let tabela = document.getElementById("tabelaVacinas");
        let newRow = tabela.insertRow();

        newRow.innerHTML = `
            <td>${codigo}</td>
            <td>${nome}</td>
            <td>${data}</td>
            <td class="quantidade">${quantidade}</td>
            <td>
                <button class="btn btn-success btn-sm" onclick="adicionarQuantidade(this)">+</button>
                <button class="btn btn-danger btn-sm" onclick="removerVacina(this)">Excluir</button>
            </td>
        `;
        
        atualizarTotal();
        document.getElementById("vacinaForm").reset();
    }
});

function filtrarVacinas() {
    let filtro = document.getElementById("search").value.toLowerCase();
    let linhas = document.getElementById("tabelaVacinas").getElementsByTagName("tr");

    for (let linha of linhas) {
        let colunas = linha.getElementsByTagName("td");
        if (colunas.length > 0) {
            let codigo = colunas[0].textContent.toLowerCase();
            let nome = colunas[1].textContent.toLowerCase();
            
            linha.style.display = (codigo.includes(filtro) || nome.includes(filtro)) ? "" : "none";
        }
    }
}

function adicionarQuantidade(botao) {
    let linha = botao.parentElement.parentElement;
    let quantidadeCell = linha.querySelector(".quantidade");
    let quantidade = parseInt(quantidadeCell.textContent, 10);
    
    quantidadeCell.textContent = quantidade + 1;
    atualizarTotal();
}

function removerVacina(botao) {
    let linha = botao.parentElement.parentElement;
    linha.remove();
    atualizarTotal();
}

function atualizarTotal() {
    let total = 0;
    document.querySelectorAll(".quantidade").forEach(cell => {
        total += parseInt(cell.textContent, 10);
    });
    document.getElementById("totalVacinas").textContent = total;
}