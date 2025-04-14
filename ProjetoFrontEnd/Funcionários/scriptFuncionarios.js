// Configuração da API
const API_URL = 'http://localhost:3000';

// Toggle bar function
document.getElementById("menu-toggle").addEventListener("click", function() {
    document.getElementById("sidebar").classList.toggle("active");
    document.body.classList.toggle("sidebar-active");
});

// Funções de API
async function fetchFuncionarios() {
    try {
        const response = await fetch(`${API_URL}/funcionarios`);
        if (!response.ok) throw new Error('Erro ao carregar funcionários');
        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        mostrarErro('Falha ao carregar funcionários');
        return [];
    }
}

async function salvarFuncionario(funcionario) {
    try {
        const method = funcionario.id ? 'PUT' : 'POST';
        const url = funcionario.id 
            ? `${API_URL}/funcionarios/${funcionario.id}`
            : `${API_URL}/funcionarios`;

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(funcionario)
        });

        if (!response.ok) throw new Error('Erro ao salvar funcionário');
        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        mostrarErro('Falha ao salvar funcionário');
        throw error;
    }
}

async function excluirFuncionario(id) {
    try {
        const response = await fetch(`${API_URL}/funcionarios/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Erro ao excluir funcionário');
        return true;
    } catch (error) {
        console.error('Erro:', error);
        mostrarErro('Falha ao excluir funcionário');
        throw error;
    }
}

// Função para renderizar a tabela
async function renderizarTabela() {
    try {
        const tabela = document.getElementById("tabelaFuncionarios");
        tabela.innerHTML = '';
        
        const funcionarios = await fetchFuncionarios();
        
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
            cellNascimento.textContent = formatarData(funcionario.nascimento);
            cellRegistro.textContent = funcionario.registro;
            
            // Cria botões de ação
            const btnEditar = document.createElement('button');
            btnEditar.className = 'btn btn-warning btn-sm me-1';
            btnEditar.textContent = 'Editar';
            btnEditar.addEventListener('click', () => editarFuncionario(funcionario.id));
            
            const btnExcluir = document.createElement('button');
            btnExcluir.className = 'btn btn-danger btn-sm';
            btnExcluir.textContent = 'Excluir';
            btnExcluir.addEventListener('click', () => confirmarExclusao(funcionario.id));
            
            // Adiciona botões à célula de ações
            cellAcoes.appendChild(btnEditar);
            cellAcoes.appendChild(btnExcluir);
        });
        
        atualizarTotal(funcionarios.length);
    } catch (error) {
        console.error('Erro ao renderizar tabela:', error);
    }
}

// Função para formatar data
function formatarData(dataString) {
    if (!dataString) return '';
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
}

// Função para mostrar erros
function mostrarErro(mensagem) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show';
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${mensagem}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    const container = document.querySelector('.container');
    container.prepend(alertDiv);
    
    setTimeout(() => alertDiv.remove(), 5000);
}

// Evento de submit do formulário
document.getElementById("funcionarioForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const cpf = document.getElementById("cpf").value.trim();
    const nome = document.getElementById("nome").value.trim();
    const nascimento = document.getElementById("nascimento").value;
    const registro = document.getElementById("registro").value.trim();
    
    if (!cpf || !nome || !nascimento || !registro) {
        mostrarErro('Preencha todos os campos obrigatórios');
        return;
    }

    const funcionario = {
        cpf,
        nome,
        nascimento,
        registro
    };

    const idEditando = this.dataset.editId;
    if (idEditando) {
        funcionario.id = idEditando;
    }

    try {
        await salvarFuncionario(funcionario);
        this.reset();
        this.removeAttribute('data-edit-id');
        document.querySelector("button[type='submit']").textContent = "Adicionar";
        await renderizarTabela();
    } catch (error) {
        console.error('Erro no submit:', error);
    }
});

// Função para editar funcionário
async function editarFuncionario(id) {
    try {
        const response = await fetch(`${API_URL}/funcionarios/${id}`);
        if (!response.ok) throw new Error('Erro ao carregar funcionário');
        const funcionario = await response.json();
        
        document.getElementById("cpf").value = funcionario.cpf;
        document.getElementById("nome").value = funcionario.nome;
        document.getElementById("nascimento").value = funcionario.nascimento;
        document.getElementById("registro").value = funcionario.registro;
        
        document.getElementById("funcionarioForm").dataset.editId = funcionario.id;
        document.querySelector("button[type='submit']").textContent = "Salvar Edição";
        document.getElementById("funcionarioForm").scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Erro ao editar:', error);
        mostrarErro('Falha ao carregar dados do funcionário');
    }
}

// Função para confirmar exclusão
async function confirmarExclusao(id) {
    if (!confirm("Tem certeza que deseja remover este funcionário?")) return;
    
    try {
        await excluirFuncionario(id);
        await renderizarTabela();
    } catch (error) {
        console.error('Erro ao excluir:', error);
    }
}

// Função de filtro
function filtrarFuncionarios() {
    const filtro = document.getElementById("search").value.toLowerCase();
    const linhas = document.getElementById("tabelaFuncionarios").rows;
    
    for (let i = 0; i < linhas.length; i++) {
        const cpf = linhas[i].cells[0].textContent.toLowerCase();
        const nome = linhas[i].cells[1].textContent.toLowerCase();
        linhas[i].style.display = (cpf.includes(filtro) || nome.includes(filtro)) ? "" : "none";
    }
}

// Atualizar contador
function atualizarTotal(total) {
    document.getElementById("totalFuncionarios").textContent = total || 0;
}

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById("nascimento").max = new Date().toISOString().split("T")[0];
    document.getElementById("search").addEventListener('input', filtrarFuncionarios);
    await renderizarTabela();
});