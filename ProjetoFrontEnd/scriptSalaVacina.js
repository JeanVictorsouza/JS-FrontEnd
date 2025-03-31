// Toggle do menu
document.getElementById("menu-toggle").addEventListener("click", function() {
    document.getElementById("sidebar").classList.toggle("active");
    document.body.classList.toggle("sidebar-active");
});

// Navegação para o cartão de vacinas
document.getElementById("btnVerCartao").addEventListener("click", function() {
    window.location.href = "cartaoVacina.html";
});

// Função principal para cadastro de vacinas
document.getElementById("vacinaForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    let codigo = document.getElementById("codigo").value.trim();
    let nome = document.getElementById("nome").value.trim();
    let data = document.getElementById("data").value;
    let quantidade = parseInt(document.getElementById("quantidade").value, 10);
    
    // Validações básicas
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
    
    // Cria o objeto da vacina
    let novaVacina = {
        codigo,
        nome,
        data,
        quantidade,
        dataRegistro: new Date().toISOString()
    };
    
    // Adiciona ao localStorage
    let vacinas = JSON.parse(localStorage.getItem('vacinas')) || [];
    vacinas.push(novaVacina);
    localStorage.setItem('vacinas', JSON.stringify(vacinas));
    
    // Atualiza a tabela
    atualizarTabelaVacinas();
    document.getElementById("vacinaForm").reset();
});

// Atualiza a tabela com os dados do localStorage
function atualizarTabelaVacinas() {
    let tabela = document.getElementById("tabelaVacinas");
    tabela.innerHTML = '';
    
    let vacinas = JSON.parse(localStorage.getItem('vacinas')) || [];
    
    vacinas.forEach(vacina => {
        let newRow = tabela.insertRow();
        newRow.innerHTML = `
            <td>${vacina.codigo}</td>
            <td>${vacina.nome}</td>
            <td>${formatarData(vacina.data)}</td>
            <td class="quantidade">${vacina.quantidade}</td>
            <td>
                <button class="btn btn-success btn-sm" onclick="adicionarQuantidade(this)">+</button>
                <button class="btn btn-danger btn-sm" onclick="removerVacina(this, '${vacina.codigo}')">Excluir</button>
            </td>
        `;
    });
    
    atualizarTotal();
}

// Função para formatar data
function formatarData(dataString) {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
}

// Função para remover vacina
function removerVacina(botao, codigoVacina) {
    if (confirm("Tem certeza que deseja remover esta vacina?")) {
        let vacinas = JSON.parse(localStorage.getItem('vacinas')) || [];
        vacinas = vacinas.filter(v => v.codigo !== codigoVacina);
        localStorage.setItem('vacinas', JSON.stringify(vacinas));
        
        botao.closest('tr').remove();
        atualizarTotal();
    }
}

// Função para adicionar quantidade
function adicionarQuantidade(botao) {
    let linha = botao.parentElement.parentElement;
    let quantidadeCell = linha.querySelector(".quantidade");
    let quantidade = parseInt(quantidadeCell.textContent, 10);
    
    quantidadeCell.textContent = quantidade + 1;
    atualizarTotal();
}

// Função para atualizar o total
function atualizarTotal() {
    let total = 0;
    document.querySelectorAll(".quantidade").forEach(cell => {
        total += parseInt(cell.textContent, 10);
    });
    document.getElementById("totalVacinas").textContent = total;
}

// Função para filtrar vacinas
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

// Carrega os dados ao iniciar
document.addEventListener('DOMContentLoaded', atualizarTabelaVacinas);

