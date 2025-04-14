<<<<<<< HEAD
class FuncionarioController {
    constructor() {
        this.funcionarios = [];
        this.editId = null;
        this.initElements();
        this.initEventListeners();
        this.loadFuncionarios();
    }

    initElements() {
        this.elements = {
            form: document.getElementById('funcionarioForm'),
            cpfInput: document.getElementById('cpf'),
            nomeInput: document.getElementById('nome'),
            nascimentoInput: document.getElementById('nascimento'),
            registroInput: document.getElementById('registro'),
            searchInput: document.getElementById('search'),
            tableBody: document.getElementById('tabelaFuncionarios'),
            totalSpan: document.getElementById('totalFuncionarios'),
            modal: new bootstrap.Modal('#confirmModal'),
            modalMessage: document.getElementById('modal-message'),
            modalConfirmBtn: document.getElementById('modal-confirm-btn')
        };
    }

    initEventListeners() {
        this.elements.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.elements.searchInput.addEventListener('input', () => this.filterFuncionarios());
        this.elements.modalConfirmBtn.addEventListener('click', () => this.confirmDelete());
        
        // Máscara de CPF
        this.elements.cpfInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 3) value = value.replace(/^(\d{3})/, '$1.');
            if (value.length > 7) value = value.replace(/^(\d{3})\.(\d{3})/, '$1.$2.');
            if (value.length > 11) value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})/, '$1.$2.$3-');
            e.target.value = value.substring(0, 14);
        });
        
        // Data máxima = hoje
        this.elements.nascimentoInput.max = new Date().toISOString().split('T')[0];
    }

    loadFuncionarios() {
        try {
            const dados = localStorage.getItem('funcionarios');
            this.funcionarios = dados ? JSON.parse(dados) : [];
            this.renderTable();
        } catch (error) {
            console.error('Erro ao carregar funcionários:', error);
            this.showAlert('Erro ao carregar dados', 'danger');
        }
    }

    saveFuncionarios() {
        localStorage.setItem('funcionarios', JSON.stringify(this.funcionarios));
    }

    handleSubmit(event) {
        event.preventDefault();
        
        if (!this.validateForm()) return;
        
        const funcionario = {
            id: this.editId || Date.now().toString(),
            cpf: this.elements.cpfInput.value,
            nome: this.elements.nomeInput.value.trim(),
            nascimento: this.elements.nascimentoInput.value,
            registro: this.elements.registroInput.value.trim()
        };

        if (this.editId) {
            this.updateFuncionario(funcionario);
        } else {
            this.addFuncionario(funcionario);
        }

        this.resetForm();
        this.renderTable();
    }

    validateForm() {
        let isValid = true;
        
        // Validação simples - pode ser expandida
        if (!this.elements.cpfInput.value || this.elements.cpfInput.value.length < 11) {
            isValid = false;
        }
        
        if (!this.elements.nomeInput.value.trim()) {
            isValid = false;
        }
        
        return isValid;
    }

    addFuncionario(funcionario) {
        this.funcionarios.push(funcionario);
        this.saveFuncionarios();
        this.showAlert('Funcionário adicionado com sucesso', 'success');
    }

    updateFuncionario(funcionario) {
        const index = this.funcionarios.findIndex(f => f.id === this.editId);
        if (index !== -1) {
            this.funcionarios[index] = funcionario;
            this.saveFuncionarios();
            this.showAlert('Funcionário atualizado com sucesso', 'success');
        }
        this.editId = null;
        this.elements.form.querySelector('button[type="submit"]').textContent = "Adicionar";
    }

    resetForm() {
        this.elements.form.reset();
        this.editId = null;
    }

    renderTable() {
        this.elements.tableBody.innerHTML = '';
        
        if (this.funcionarios.length === 0) {
            this.elements.tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-4 text-muted">
                        Nenhum funcionário cadastrado
                    </td>
                </tr>
            `;
            this.elements.totalSpan.textContent = '0';
            return;
        }
        
        this.funcionarios.forEach(funcionario => {
            const row = this.elements.tableBody.insertRow();
            row.innerHTML = `
                <td>${this.formatCPF(funcionario.cpf)}</td>
                <td>${funcionario.nome}</td>
                <td>${this.formatDate(funcionario.nascimento)}</td>
                <td>${funcionario.registro}</td>
                <td class="text-center">
                    <button class="btn btn-warning btn-sm me-1 edit-btn" data-id="${funcionario.id}">
                        Editar
                    </button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${funcionario.id}">
                        Excluir
                    </button>
                </td>
            `;
        });
        
        // Adiciona eventos aos botões
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.prepareEdit(e));
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.prepareDelete(e));
        });
        
        this.elements.totalSpan.textContent = this.funcionarios.length;
    }

    prepareEdit(event) {
        const id = event.currentTarget.getAttribute('data-id');
        const funcionario = this.funcionarios.find(f => f.id === id);
        
        if (funcionario) {
            this.elements.cpfInput.value = funcionario.cpf;
            this.elements.nomeInput.value = funcionario.nome;
            this.elements.nascimentoInput.value = funcionario.nascimento;
            this.elements.registroInput.value = funcionario.registro;
            
            this.editId = id;
            this.elements.form.querySelector('button[type="submit"]').textContent = "Salvar Edição";
            this.elements.form.scrollIntoView({ behavior: 'smooth' });
        }
    }

    prepareDelete(event) {
        const id = event.currentTarget.getAttribute('data-id');
        const funcionario = this.funcionarios.find(f => f.id === id);
        
        if (funcionario) {
            this.elements.modalMessage.textContent = `Tem certeza que deseja remover ${funcionario.nome}?`;
            this.elements.modalConfirmBtn.setAttribute('data-id', id);
            this.elements.modal.show();
        }
    }

    confirmDelete() {
        const id = this.elements.modalConfirmBtn.getAttribute('data-id');
        this.deleteFuncionario(id);
        this.elements.modal.hide();
    }

    deleteFuncionario(id) {
        this.funcionarios = this.funcionarios.filter(f => f.id !== id);
        this.saveFuncionarios();
        this.renderTable();
        this.showAlert('Funcionário removido com sucesso', 'success');
    }

    filterFuncionarios() {
        const term = this.elements.searchInput.value.toLowerCase();
        const rows = this.elements.tableBody.querySelectorAll('tr');
        
        rows.forEach(row => {
            if (row.cells) {
                const cpf = row.cells[0].textContent.toLowerCase();
                const nome = row.cells[1].textContent.toLowerCase();
                row.style.display = (cpf.includes(term) || nome.includes(term)) ? "" : "none";
            }
        });
    }

    formatCPF(cpf) {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    showAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} position-fixed top-0 end-0 m-3`;
        alert.style.zIndex = '1100';
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        document.body.appendChild(alert);
        
        // Remove o alerta após 3 segundos
        setTimeout(() => {
            alert.classList.add('fade');
            setTimeout(() => alert.remove(), 150);
        }, 3000);
    }
}

// Inicializa o controller quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new FuncionarioController();
=======
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
>>>>>>> 57a4dfd88c54da46b01f7d8698b0c7d50dd7ba3a
});