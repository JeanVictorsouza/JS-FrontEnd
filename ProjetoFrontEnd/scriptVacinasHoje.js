// Toggle do menu
document.getElementById("menu-toggle").addEventListener("click", function() {
    document.getElementById("sidebar").classList.toggle("active");
    document.body.classList.toggle("sidebar-active");
});

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
        row.innerHTML = `
            <td>${ag.paciente}</td>
            <td>${ag.cpf}</td>
            <td>${ag.vacina}</td>
            <td>${ag.dose}</td>
            <td>${formatarData(ag.data)}</td>
            <td>${ag.hora}</td>
            <td>${ag.responsavel}</td>
            <td>
                <button class="btn btn-sm btn-success" onclick="marcarComoAplicada('${ag.id}')">Aplicada</button>
                <button class="btn btn-sm btn-danger" onclick="removerAgendamento('${ag.id}')">Remover</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Formata data para exibição
function formatarData(dataString) {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
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
    const modal = bootstrap.Modal.getInstance(document.getElementById('agendarModal'));
    modal.hide();
    document.getElementById('formAgendamento').reset();
    
    // Recarrega a tabela
    carregarAgendamentos();
    
    alert('Agendamento salvo com sucesso!');
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
    window.location.href = 'index.html';
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Define a data atual como padrão no filtro
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('dataFiltro').value = hoje;
    
    // Carrega os agendamentos
    carregarAgendamentos();
});