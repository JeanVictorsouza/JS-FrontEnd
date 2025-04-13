// Toggle bar function
document.getElementById("menu-toggle").addEventListener("click", function() {
    document.getElementById("sidebar").classList.toggle("active");
    document.body.classList.toggle("sidebar-active");
});

// Função para salvar no localStorage
function salvarFuncionarios(funcionarios) {
    localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
}

// Função para carregar do localStorage
function carregarFuncionarios() {
    const dados = localStorage.getItem('funcionarios');
    return dados ? JSON.parse(dados) : [];
}

// Função para renderizar a tabela
function renderizarTabela() {
    const tabela = document.getElementById("tabelaFuncionarios");
    tabela.innerHTML = '';
    
    const funcionarios = carregarFuncionarios();
    
    funcionarios.forEach(funcionario => {
        const newRow = tabela.insertRow();
        
        // Cria células
        const cellCpf = newRow.insertCell(0);
        const cellNome = newRow.insertCell(1);
        const cellNascimento = newRow.insertCell(2);
        const cellRegistro = newRow.insertCell(3);
        const cellAcoes = newRow.insertCell(4);
        
        // Preenche células com dados
        cellCpf.textContent = funcionario.cpf;
        cellNome.textContent = funcionario.nome;
        cellNascimento.textContent = funcionario.nascimento;
        cellRegistro.textContent = funcionario.registro;
        
        // Cria botões de ação
        const btnEditar = document.createElement('button');
        btnEditar.className = 'btn btn-warning btn-sm me-1';
        btnEditar.textContent = 'Editar';
        btnEditar.addEventListener('click', function() {
            editarFuncionario(this, funcionario.id);
        });
        
        const btnExcluir = document.createElement('button');
        btnExcluir.className = 'btn btn-danger btn-sm';
        btnExcluir.textContent = 'Excluir';
        btnExcluir.addEventListener('click', function() {
            removerFuncionario(this, funcionario.id);
        });
        
        // Adiciona botões à célula de ações
        cellAcoes.appendChild(btnEditar);
        cellAcoes.appendChild(btnExcluir);
    });
    
    atualizarTotal();
}

document.getElementById("funcionarioForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    let cpf = document.getElementById("cpf").value.trim();
    let nome = document.getElementById("nome").value.trim();
    let nascimento = document.getElementById("nascimento").value;
    let registro = document.getElementById("registro").value.trim();
    
    const funcionarios = carregarFuncionarios();
    const idEditando = document.getElementById("funcionarioForm").dataset.editId;
    
    if (idEditando) {
        // Atualiza funcionário existente
        const index = funcionarios.findIndex(f => f.id === idEditando);
        if (index !== -1) {
            funcionarios[index] = {
                id: idEditando,
                cpf,
                nome,
                nascimento,
                registro
            };
            salvarFuncionarios(funcionarios);
            document.getElementById("funcionarioForm").removeAttribute('data-edit-id');
            document.querySelector("button[type='submit']").textContent = "Adicionar";
        }
    } else if (cpf && nome && nascimento && registro) {
        // Adiciona novo funcionário
        const novoFuncionario = {
            id: Date.now().toString(),
            cpf,
            nome,
            nascimento,
            registro
        };
        funcionarios.push(novoFuncionario);
        salvarFuncionarios(funcionarios);
    }
    
    renderizarTabela();
    document.getElementById("funcionarioForm").reset();
});

function filtrarFuncionarios() {
    let filtro = document.getElementById("search").value.toLowerCase();
    let linhas = document.getElementById("tabelaFuncionarios").rows;
    const funcionarios = carregarFuncionarios();
    
    for (let i = 0; i < linhas.length; i++) {
        let cpf = linhas[i].cells[0].textContent.toLowerCase();
        let nome = linhas[i].cells[1].textContent.toLowerCase();
        
        linhas[i].style.display = (cpf.includes(filtro) || nome.includes(filtro)) ? "" : "none";
    }
}

function removerFuncionario(botao, id) {
    if (confirm("Tem certeza que deseja remover este funcionário?")) {
        const funcionarios = carregarFuncionarios();
        const novosFuncionarios = funcionarios.filter(f => f.id !== id);
        salvarFuncionarios(novosFuncionarios);
        renderizarTabela();
    }
}

function editarFuncionario(botao, id) {
    const funcionarios = carregarFuncionarios();
    const funcionario = funcionarios.find(f => f.id === id);
    
    if (funcionario) {
        // Preenche o formulário com os dados do funcionário
        document.getElementById("cpf").value = funcionario.cpf;
        document.getElementById("nome").value = funcionario.nome;
        document.getElementById("nascimento").value = funcionario.nascimento;
        document.getElementById("registro").value = funcionario.registro;
        
        // Marca o formulário como em modo de edição
        document.getElementById("funcionarioForm").dataset.editId = id;
        document.querySelector("button[type='submit']").textContent = "Salvar Edição";
        
        // Rolagem suave até o formulário
        document.getElementById("funcionarioForm").scrollIntoView({ behavior: 'smooth' });
    }
}

function atualizarTotal() {
    const funcionarios = carregarFuncionarios();
    document.getElementById("totalFuncionarios").textContent = funcionarios.length;
}

// Inicializa a tabela ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("nascimento").max = new Date().toISOString().split("T")[0];
    renderizarTabela();
});