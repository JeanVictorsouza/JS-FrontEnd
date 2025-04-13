// Toggle bar function
document.getElementById("menu-toggle").addEventListener("click", function() {
    document.getElementById("sidebar").classList.toggle("active");
    document.body.classList.toggle("sidebar-active");
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
        // Cria a linha
        const row = document.createElement('tr');
        
        // Cria as células
        const codigoCell = document.createElement('td');
        codigoCell.textContent = vacina.codigo;
        
        const nomeCell = document.createElement('td');
        nomeCell.textContent = vacina.nome;
        
        const dataCell = document.createElement('td');
        dataCell.textContent = formatarData(vacina.data);
        
        const quantidadeCell = document.createElement('td');
        quantidadeCell.textContent = vacina.quantidade;
        quantidadeCell.classList.add('quantidade');
        
        const acoesCell = document.createElement('td');
        
        // Cria botão de adicionar
        const btnAdicionar = document.createElement('button');
        btnAdicionar.classList.add('btn', 'btn-success', 'btn-sm', 'me-1');
        btnAdicionar.textContent = '+';
        btnAdicionar.addEventListener('click', function() {
            adicionarQuantidade(this);
        });
        
        // Cria botão de remover
        const btnRemover = document.createElement('button');
        btnRemover.classList.add('btn', 'btn-danger', 'btn-sm');
        btnRemover.textContent = 'Excluir';
        btnRemover.addEventListener('click', function() {
            removerVacina(this, vacina.codigo);
        });
        
        // Adiciona botões à célula de ações
        acoesCell.appendChild(btnAdicionar);
        acoesCell.appendChild(btnRemover);
        
        // Adiciona células à linha
        row.appendChild(codigoCell);
        row.appendChild(nomeCell);
        row.appendChild(dataCell);
        row.appendChild(quantidadeCell);
        row.appendChild(acoesCell);
        
        // Adiciona linha à tabela
        tabela.appendChild(row);
    });
    
    atualizarTotal();
}

// Adicione esta função para editar vacinas
function editarVacina(botao, codigoVacina) {
    let vacinas = JSON.parse(localStorage.getItem('vacinas')) || [];
    let vacina = vacinas.find(v => v.codigo === codigoVacina);
    
    if (!vacina) return;
    
    // Preenche o formulário com os dados da vacina
    document.getElementById('codigo').value = vacina.codigo;
    document.getElementById('nome').value = vacina.nome;
    document.getElementById('data').value = vacina.data;
    document.getElementById('quantidade').value = vacina.quantidade;
    
    // Remove a vacina da lista (será readicionada ao salvar)
    vacinas = vacinas.filter(v => v.codigo !== codigoVacina);
    localStorage.setItem('vacinas', JSON.stringify(vacinas));
    
    // Atualiza a tabela
    atualizarTabelaVacinas();
    
    // Rola até o formulário
    document.getElementById('vacinaForm').scrollIntoView({ behavior: 'smooth' });
}

// Modifique a função atualizarTabelaVacinas para incluir o botão de edição
function atualizarTabelaVacinas() {
    let tabela = document.getElementById("tabelaVacinas");
    tabela.innerHTML = '';
    
    let vacinas = JSON.parse(localStorage.getItem('vacinas')) || [];
    
    vacinas.forEach(vacina => {
        // Cria a linha
        const row = document.createElement('tr');
        
        // Cria as células
        const codigoCell = document.createElement('td');
        codigoCell.textContent = vacina.codigo;
        
        const nomeCell = document.createElement('td');
        nomeCell.textContent = vacina.nome;
        
        const dataCell = document.createElement('td');
        dataCell.textContent = formatarData(vacina.data);
        
        const quantidadeCell = document.createElement('td');
        quantidadeCell.textContent = vacina.quantidade;
        quantidadeCell.classList.add('quantidade');
        
        const acoesCell = document.createElement('td');
        acoesCell.classList.add('d-flex', 'gap-1'); // Adiciona espaçamento entre botões
        
        // Cria botão de editar
        const btnEditar = document.createElement('button');
        btnEditar.classList.add('btn', 'btn-warning', 'btn-sm', 'text-white');
        btnEditar.innerHTML = '<i class="bi bi-pencil"></i>'; // Ícone de edição
        btnEditar.title = 'Editar';
        btnEditar.addEventListener('click', function() {
            editarVacina(this, vacina.codigo);
        });
        
        // Cria botão de adicionar
        const btnAdicionar = document.createElement('button');
        btnAdicionar.classList.add('btn', 'btn-success', 'btn-sm');
        btnAdicionar.innerHTML = '<i class="bi bi-plus"></i>'; // Ícone de adicionar
        btnAdicionar.title = 'Adicionar quantidade';
        btnAdicionar.addEventListener('click', function() {
            adicionarQuantidade(this);
        });
        
        // Cria botão de remover
        const btnRemover = document.createElement('button');
        btnRemover.classList.add('btn', 'btn-danger', 'btn-sm');
        btnRemover.innerHTML = '<i class="bi bi-trash"></i>'; // Ícone de remover
        btnRemover.title = 'Excluir';
        btnRemover.addEventListener('click', function() {
            removerVacina(this, vacina.codigo);
        });
        
        // Adiciona botões à célula de ações
        acoesCell.appendChild(btnEditar);
        acoesCell.appendChild(btnAdicionar);
        acoesCell.appendChild(btnRemover);
        
        // Adiciona células à linha
        row.appendChild(codigoCell);
        row.appendChild(nomeCell);
        row.appendChild(dataCell);
        row.appendChild(quantidadeCell);
        row.appendChild(acoesCell);
        
        // Adiciona linha à tabela
        tabela.appendChild(row);
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
        
        // Remove a linha da tabela
        botao.closest('tr').remove();
        atualizarTotal();
    }
}

// Função para adicionar quantidade
function adicionarQuantidade(botao) {
    let linha = botao.closest('tr');
    let quantidadeCell = linha.querySelector(".quantidade");
    let quantidade = parseInt(quantidadeCell.textContent, 10);
    
    // Atualiza no localStorage
    let codigo = linha.cells[0].textContent;
    let vacinas = JSON.parse(localStorage.getItem('vacinas')) || [];
    let vacina = vacinas.find(v => v.codigo === codigo);
    
    if (vacina) {
        vacina.quantidade = quantidade + 1;
        localStorage.setItem('vacinas', JSON.stringify(vacinas));
    }
    
    // Atualiza a tabela
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
    let linhas = document.getElementById("tabelaVacinas").rows;
    
    for (let i = 0; i < linhas.length; i++) {
        let codigo = linhas[i].cells[0].textContent.toLowerCase();
        let nome = linhas[i].cells[1].textContent.toLowerCase();
        
        linhas[i].style.display = (codigo.includes(filtro) || nome.includes(filtro)) ? "" : "none";
    }
}

// Carrega os dados ao iniciar
document.addEventListener('DOMContentLoaded', function() {
    // Configura a data mínima como hoje
    document.getElementById("data").min = new Date().toISOString().split("T")[0];
    atualizarTabelaVacinas();
});