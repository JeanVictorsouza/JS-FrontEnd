document.getElementById("vacinaForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    let codigo = document.getElementById("codigo").value.trim();
    let nome = document.getElementById("nome").value.trim();
    let data = document.getElementById("data").value;
    let quantidade = parseInt(document.getElementById("quantidade").value, 10);
    
    if (!/^[a-zA-Z0-9]+$/.test(codigo)) {
        alert("O código da vacina deve conter apenas letras e números.");
        return;
    }
    if (nome.length < 3) {
        alert("O nome da vacina deve ter pelo menos 3 caracteres.");
        return;
    }
    if (new Date(data) < new Date()) {
        alert("A data de validade não pode estar no passado.");
        return;
    }
    if (quantidade <= 0 || isNaN(quantidade)) {
        alert("A quantidade deve ser um número maior que zero.");
        return;
    }
    
    let tabela = document.getElementById("tabelaEstoque");
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
});

document.getElementById("agendamentoForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    let paciente = document.getElementById("paciente").value.trim();
    let funcionario = document.getElementById("funcionario").value.trim();
    let vacina = document.getElementById("vacinaAplicada").value.trim();
    let dose = parseInt(document.getElementById("dose").value, 10);
    let dataAgendada = document.getElementById("dataAgendada").value;
    
    if (paciente.length < 3 || funcionario.length < 3) {
        alert("Paciente e funcionário devem ter pelo menos 3 caracteres.");
        return;
    }
    if (vacina.length < 3) {
        alert("O nome da vacina é inválido.");
        return;
    }
    if (dose <= 0 || isNaN(dose)) {
        alert("A dose deve ser um número maior que zero.");
        return;
    }
    if (new Date(dataAgendada) < new Date()) {
        alert("A data agendada não pode estar no passado.");
        return;
    }
    
    let tabela = document.getElementById("tabelaAgendamentos");
    let newRow = tabela.insertRow();
    newRow.innerHTML = `
        <td>${funcionario}</td> 
        <td>${paciente}</td>
        <td>${vacina}</td>
        <td>${dose}</td>
        <td>${dataAgendada}</td>
    `;
    document.getElementById("agendamentoForm").reset();
});

function filtrarVacinas() {
    let filtro = document.getElementById("search").value.toLowerCase();
    let linhas = document.getElementById("tabelaEstoque").getElementsByTagName("tr");

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
