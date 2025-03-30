// Toggle do menu
document.getElementById("menu-toggle").addEventListener("click", function() {
    document.getElementById("sidebar").classList.toggle("active");
    document.body.classList.toggle("sidebar-active");
});

// Carrega dados do funcionário logado
function carregarDadosFuncionario() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (user) {
        document.getElementById('nomeFuncionario').textContent = user.name || 'Não informado';
        document.getElementById('cpfFuncionario').textContent = user.cpf || 'Não informado';
        document.getElementById('registroFuncionario').textContent = user.registro || 'Não informado';
        
        // Carrega os dados de vacinação específicos do funcionário
        carregarDadosVacinas(user.id || user.cpf);
    }
}

// Carrega dados de vacinação do funcionário
function carregarDadosVacinas(funcionarioId) {
    // Busca no localStorage ou em uma API os dados do funcionário
    const todasVacinas = JSON.parse(localStorage.getItem('historicoVacinas')) || [];
    const todosAgendamentos = JSON.parse(localStorage.getItem('agendamentosVacinas')) || [];
    
    // Filtra apenas as vacinas deste funcionário
    const vacinasFuncionario = todasVacinas.filter(v => v.funcionarioId === funcionarioId);
    const agendamentosFuncionario = todosAgendamentos.filter(a => a.funcionarioId === funcionarioId);
    
    // Preenche o histórico
    const historicoTbody = document.getElementById('historicoVacinas');
    historicoTbody.innerHTML = '';
    
    vacinasFuncionario.forEach(vacina => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${vacina.nome}</td>
            <td>${vacina.dose}</td>
            <td>${formatarData(vacina.data)}</td>
            <td>${vacina.responsavel}</td>
        `;
        historicoTbody.appendChild(row);
    });
    
    // Preenche os agendamentos futuros
    const proximasTbody = document.getElementById('proximasVacinas');
    proximasTbody.innerHTML = '';
    
    const hoje = new Date().toISOString().split('T')[0];
    const agendamentosFuturos = agendamentosFuncionario.filter(a => a.data >= hoje);
    
    if (agendamentosFuturos.length === 0) {
        proximasTbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center">Nenhuma vacina agendada</td>
            </tr>
        `;
    } else {
        agendamentosFuturos.forEach(ag => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${ag.vacina}</td>
                <td>${ag.dose}</td>
                <td>${formatarData(ag.data)}</td>
                <td>${ag.responsavel}</td>
            `;
            proximasTbody.appendChild(row);
        });
    }
}

// Formata data para exibição
function formatarData(dataString) {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
}

// Logout
function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
}

// Inicialização
document.addEventListener('DOMContentLoaded', carregarDadosFuncionario);