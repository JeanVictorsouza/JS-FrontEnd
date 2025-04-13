// Toggle bar function
document.getElementById("menu-toggle").addEventListener("click", function() {
    const sidebar = document.getElementById("sidebar");
    const content = document.body;
    
    sidebar.classList.toggle("active");
    content.classList.toggle("sidebar-active");
    
    // Ajuste adicional para garantir que o conteúdo não fique escondido
    if (sidebar.classList.contains("active")) {
        document.documentElement.style.overflowX = 'hidden';
    } else {
        document.documentElement.style.overflowX = '';
    }
});

// Variável global para o modal
let agendarModal;

// Carrega agendamentos do localStorage
function carregarAgendamentos() {
    const agendamentos = JSON.parse(localStorage.getItem('agendamentosVacinas')) || [];
    const tbody = document.getElementById('tabelaAgendamentos');
    tbody.innerHTML = '';
    
    // Aplica filtros
    const dataFiltro = document.getElementById('dataFiltro').value;
    const pacienteFiltro = document.getElementById('pacienteFiltro').value.toLowerCase();
    
    const agendamentosFiltrados = agendamentos.filter(ag => {
        const dataMatch = !dataFiltro || ag.data === dataFiltro;
        const pacienteMatch = !pacienteFiltro || ag.paciente.toLowerCase().includes(pacienteFiltro);
        return dataMatch && pacienteMatch;
    });
    
    // Atualiza contador
    document.getElementById('totalAgendamentos').textContent = agendamentosFiltrados.length;
    
    // Preenche tabela
    agendamentosFiltrados.forEach(ag => {
        const row = document.createElement('tr');
        
        // Aplica estilo se vacina foi aplicada
        if (ag.status === 'aplicada') {
            row.style.backgroundColor = '#e8f5e9';
            row.classList.add('vacina-aplicada');
        }
        
        // Cria células para cada coluna
        const celPaciente = document.createElement('td');
        celPaciente.textContent = ag.paciente;
        
        const celCpf = document.createElement('td');
        celCpf.textContent = ag.cpf;
        
        const celVacina = document.createElement('td');
        celVacina.textContent = ag.vacina;
        
        const celDose = document.createElement('td');
        celDose.textContent = ag.dose;
        
        const celData = document.createElement('td');
        celData.textContent = formatarData(ag.data);
        
        const celHora = document.createElement('td');
        celHora.textContent = ag.hora;
        
        const celResponsavel = document.createElement('td');
        celResponsavel.textContent = ag.responsavel;
        
        const celAcoes = document.createElement('td');
        
        // Cria botões de ação
        const btnAplicada = document.createElement('button');
        btnAplicada.className = 'btn btn-sm btn-success me-2';
        btnAplicada.textContent = 'Aplicada';
        btnAplicada.addEventListener('click', () => marcarComoAplicada(ag.id));
        
        const btnRemover = document.createElement('button');
        btnRemover.className = 'btn btn-sm btn-danger';
        btnRemover.textContent = 'Remover';
        btnRemover.addEventListener('click', () => removerAgendamento(ag.id));
        
        // Se já foi aplicada, desabilita o botão
        if (ag.status === 'aplicada') {
            btnAplicada.disabled = true;
            btnAplicada.textContent = '✔ Aplicada';
        }
        
        // Adiciona botões à célula de ações
        celAcoes.appendChild(btnAplicada);
        celAcoes.appendChild(btnRemover);
        
        // Adiciona células à linha
        row.appendChild(celPaciente);
        row.appendChild(celCpf);
        row.appendChild(celVacina);
        row.appendChild(celDose);
        row.appendChild(celData);
        row.appendChild(celHora);
        row.appendChild(celResponsavel);
        row.appendChild(celAcoes);
        
        // Adiciona linha à tabela
        tbody.appendChild(row);
    });
}

// Formata data para exibição
function formatarData(dataString) {
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
}

// Salva novo agendamento
function salvarAgendamento() {
    const novoAgendamento = {
        id: Date.now().toString(),
        paciente: document.getElementById('agPaciente').value,
        cpf: document.getElementById('agCpf').value,
        vacina: document.getElementById('agVacina').value,
        dose: document.getElementById('agDose').value,
        data: document.getElementById('agData').value,
        hora: document.getElementById('agHora').value,
        responsavel: document.getElementById('agResponsavel').value,
        status: 'pendente'
    };
    
    const agendamentos = JSON.parse(localStorage.getItem('agendamentosVacinas')) || [];
    agendamentos.push(novoAgendamento);
    localStorage.setItem('agendamentosVacinas', JSON.stringify(agendamentos));
    
    // Fecha o modal e limpa o formulário
    agendarModal.hide();
    document.getElementById('formAgendamento').reset();
    
    // Recarrega a tabela
    carregarAgendamentos();
    
    // Exibe mensagem de sucesso
    const alertPlaceholder = document.createElement('div');
    alertPlaceholder.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            Agendamento salvo com sucesso!
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    document.querySelector('.container.mt-4').prepend(alertPlaceholder);
    
    // Remove o alerta após 3 segundos
    setTimeout(() => {
        const alert = document.querySelector('.alert');
        if (alert) {
            alert.remove();
        }
    }, 3000);
}

// Marca vacina como aplicada
function marcarComoAplicada(id) {
    if (confirm('Deseja marcar esta vacina como aplicada?')) {
        let agendamentos = JSON.parse(localStorage.getItem('agendamentosVacinas')) || [];
        agendamentos = agendamentos.map(ag => {
            if (ag.id === id) {
                return { ...ag, status: 'aplicada' };
            }
            return ag;
        });
        localStorage.setItem('agendamentosVacinas', JSON.stringify(agendamentos));
        carregarAgendamentos();
    }
}

// Remove agendamento
function removerAgendamento(id) {
    if (confirm('Deseja realmente remover este agendamento?')) {
        let agendamentos = JSON.parse(localStorage.getItem('agendamentosVacinas')) || [];
        agendamentos = agendamentos.filter(ag => ag.id !== id);
        localStorage.setItem('agendamentosVacinas', JSON.stringify(agendamentos));
        carregarAgendamentos();
    }
}

// Aplica filtros
function filtrarAgendamentos() {
    carregarAgendamentos();
}

// Limpa filtros
function limparFiltros() {
    document.getElementById('dataFiltro').value = '';
    document.getElementById('pacienteFiltro').value = '';
    carregarAgendamentos();
}

// Logout
function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = '../index/index.html';
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa o modal do Bootstrap
    agendarModal = new bootstrap.Modal(document.getElementById('agendarModal'));
    
    // Configura o botão de novo agendamento
    const btnNovoAgendamento = document.querySelector('.btn-primary[data-bs-target="#agendarModal"]');
    if (btnNovoAgendamento) {
        btnNovoAgendamento.addEventListener('click', function() {
            agendarModal.show();
        });
    }
    
    // Define a data atual como padrão no filtro
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('dataFiltro').value = hoje;
    
    // Define a data mínima para o formulário como hoje
    document.getElementById('agData').min = hoje;
    
    // Carrega os agendamentos
    carregarAgendamentos();
});

const aplicacoesVacinas = [{
    id: "1",
    usuarioId: "ID_DO_USUARIO_LOGADO", // Relaciona com o usuário
    vacinaId: "ID_DA_VACINA",          // Relaciona com a vacina cadastrada
    dataAplicacao: "2023-11-20",       // Data da aplicação
    dose: "1ª dose",                   // Número/descrição da dose
    responsavel: "Enf. Maria Silva"    // Quem aplicou
}];

function registrarAplicacao() {
    const novaAplicacao = {
        id: Date.now().toString(),
        usuarioId: localStorage.getItem('usuarioLogadoId'),
        vacinaId: 'ID_DA_VACINA_SELECIONADA',
        dataAplicacao: new Date().toISOString().split('T')[0],
        dose: '1ª dose',
        responsavel: 'Nome do profissional logado'
    };
    
    const aplicacoes = JSON.parse(localStorage.getItem('aplicacoesVacinas')) || [];
    aplicacoes.push(novaAplicacao);
    localStorage.setItem('aplicacoesVacinas', JSON.stringify(aplicacoes));
}