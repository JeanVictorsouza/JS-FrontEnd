// scriptVacinasHoje.js - Versão completa com todas as melhorias

// Variáveis globais para os modais
let agendarModal;
let confirmarAplicacaoModal;

// Função para carregar funcionários nos selects
function carregarFuncionariosParaAgendamento() {
    try {
        const funcionarios = JSON.parse(localStorage.getItem('funcionarios')) || [];
        const selectPaciente = document.getElementById('agPaciente');
        const selectResponsavel = document.getElementById('agResponsavel');
        const selectAplicador = document.getElementById('responsavelAplicacao');
        
        // Limpa selects
        selectPaciente.innerHTML = '<option value="">Selecione um paciente</option>';
        selectResponsavel.innerHTML = '<option value="">Selecione um responsável</option>';
        selectAplicador.innerHTML = '<option value="">Selecione um aplicador</option>';
        
        // Adiciona cada funcionário como opção
        funcionarios.forEach(func => {
            const optionPaciente = document.createElement('option');
            optionPaciente.value = func.id;
            optionPaciente.textContent = func.nome;
            optionPaciente.setAttribute('data-cpf', func.cpf || '');
            
            const optionResponsavel = document.createElement('option');
            optionResponsavel.value = func.id;
            optionResponsavel.textContent = func.nome;
            
            const optionAplicador = document.createElement('option');
            optionAplicador.value = func.id;
            optionAplicador.textContent = func.nome;
            
            selectPaciente.appendChild(optionPaciente);
            selectResponsavel.appendChild(optionResponsavel);
            selectAplicador.appendChild(optionAplicador);
        });
        
        // Atualiza CPF quando selecionar um paciente
        selectPaciente.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            document.getElementById('agCpf').value = selectedOption.getAttribute('data-cpf') || '';
        });

    } catch (error) {
        console.error('Erro ao carregar funcionários:', error);
        showToast('Erro ao carregar lista de funcionários', 'danger');
    }
}

// Função para carregar vacinas no select
function carregarVacinas() {
    try {
        const vacinas = JSON.parse(localStorage.getItem('vacinas')) || [];
        const select = document.getElementById('agVacina');
        
        select.innerHTML = '<option value="">Selecione uma vacina</option>';
        
        vacinas.forEach(vacina => {
            if (vacina.quantidade > 0) {
                const option = document.createElement('option');
                option.value = vacina.codigo;
                option.textContent = `${vacina.nome} (${vacina.codigo}) - ${vacina.quantidade} doses`;
                option.setAttribute('data-nome', vacina.nome);
                select.appendChild(option);
            }
        });

    } catch (error) {
        console.error('Erro ao carregar vacinas:', error);
        showToast('Erro ao carregar lista de vacinas', 'danger');
    }
}

// Função principal para carregar agendamentos
function carregarAgendamentos(filtroData = '', filtroPaciente = '') {
    try {
        const agendamentos = JSON.parse(localStorage.getItem('agendamentosVacinas')) || [];
        const funcionarios = JSON.parse(localStorage.getItem('funcionarios')) || [];
        const vacinas = JSON.parse(localStorage.getItem('vacinas')) || [];
        const tbody = document.getElementById('tabelaAgendamentos');
        tbody.innerHTML = '';
        
        // Filtra os agendamentos
        const agendamentosFiltrados = agendamentos.filter(ag => {
            const funcionario = funcionarios.find(f => f.id === ag.pacienteId);
            const nomeFuncionario = funcionario ? funcionario.nome.toLowerCase() : '';
            
            const dataMatch = !filtroData || ag.data === filtroData;
            const pacienteMatch = !filtroPaciente || nomeFuncionario.includes(filtroPaciente.toLowerCase());
            
            return dataMatch && pacienteMatch;
        });

        // Ordena por data e hora (mais recente primeiro)
        agendamentosFiltrados.sort((a, b) => {
            const dateA = new Date(`${a.data}T${a.hora}`);
            const dateB = new Date(`${b.data}T${b.hora}`);
            return dateA - dateB;
        });
        
        // Atualiza contador
        document.getElementById('totalAgendamentos').textContent = agendamentosFiltrados.length;
        
        if (agendamentosFiltrados.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center py-4 text-muted">
                        Nenhum agendamento encontrado
                    </td>
                </tr>
            `;
            return;
        }
        
        // Preenche a tabela com os agendamentos
        agendamentosFiltrados.forEach(ag => {
            const funcionario = funcionarios.find(f => f.id === ag.pacienteId);
            const vacina = vacinas.find(v => v.codigo === ag.vacinaId);
            
            const row = document.createElement('tr');
            
            // Adiciona classe se vacina foi aplicada
            if (ag.status === 'aplicada') {
                row.classList.add('vacina-aplicada');
            }
            
            // Cria as células da tabela
            row.innerHTML = `
                <td>${funcionario ? funcionario.nome : ag.paciente}</td>
                <td>${formatarCPF(funcionario ? funcionario.cpf : ag.cpf)}</td>
                <td>${vacina ? vacina.nome : ag.vacina}</td>
                <td>${ag.dose}</td>
                <td>${formatarData(ag.data)}</td>
                <td>${ag.hora}</td>
                <td>${ag.responsavel}</td>
                <td class="text-nowrap">
                    <button class="btn btn-sm btn-success me-2 ${ag.status === 'aplicada' ? 'disabled' : ''}" 
                        onclick="marcarComoAplicada('${ag.id}')">
                        <i class="bi bi-check-lg me-1"></i>${ag.status === 'aplicada' ? 'Aplicada' : 'Aplicar'}
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="removerAgendamento('${ag.id}')">
                        <i class="bi bi-trash me-1"></i>Remover
                    </button>
                </td>
            `;
            
            tbody.appendChild(row);
        });

    } catch (error) {
        console.error('Erro ao carregar agendamentos:', error);
        showToast('Erro ao carregar agendamentos', 'danger');
    }
}

// Formata CPF para exibição
function formatarCPF(cpf) {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Formata data para exibição (DD/MM/AAAA)
function formatarData(dataString) {
    if (!dataString) return '';
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
}

// Salva novo agendamento
function salvarAgendamento() {
    try {
        // Validação dos campos
        const pacienteSelect = document.getElementById('agPaciente');
        const pacienteId = pacienteSelect.value;
        const pacienteText = pacienteSelect.options[pacienteSelect.selectedIndex].text;
        const cpf = document.getElementById('agCpf').value;
        
        const vacinaSelect = document.getElementById('agVacina');
        const vacinaId = vacinaSelect.value;
        const vacinaText = vacinaSelect.options[vacinaSelect.selectedIndex].getAttribute('data-nome');
        
        const dose = document.getElementById('agDose').value;
        const data = document.getElementById('agData').value;
        const hora = document.getElementById('agHora').value;
        
        const responsavelSelect = document.getElementById('agResponsavel');
        const responsavelId = responsavelSelect.value;
        const responsavelText = responsavelSelect.options[responsavelSelect.selectedIndex].text;
        
        if (!pacienteId || !vacinaId || !dose || !data || !hora || !responsavelId) {
            showToast('Por favor, preencha todos os campos', 'warning');
            return;
        }
        
        // Verifica conflito de horário
        const agendamentos = JSON.parse(localStorage.getItem('agendamentosVacinas')) || [];
        const conflito = agendamentos.some(ag => 
            ag.data === data && 
            ag.hora === hora && 
            ag.status !== 'cancelado'
        );
        
        if (conflito) {
            showToast('Já existe um agendamento para este horário', 'warning');
            return;
        }
        
        // Cria novo agendamento
        const novoAgendamento = {
            id: Date.now().toString(),
            paciente: pacienteText,
            pacienteId,
            cpf,
            vacina: vacinaText,
            vacinaId,
            dose,
            data,
            hora,
            responsavel: responsavelText,
            responsavelId,
            status: 'pendente',
            dataRegistro: new Date().toISOString()
        };
        
        // Salva no localStorage
        agendamentos.push(novoAgendamento);
        localStorage.setItem('agendamentosVacinas', JSON.stringify(agendamentos));
        
        // Fecha o modal e limpa o formulário
        agendarModal.hide();
        document.getElementById('formAgendamento').reset();
        
        // Recarrega a tabela e mostra mensagem
        carregarAgendamentos();
        showToast('Agendamento salvo com sucesso!', 'success');

    } catch (error) {
        console.error('Erro ao salvar agendamento:', error);
        showToast('Erro ao salvar agendamento', 'danger');
    }
}

// Marca vacina como aplicada (com confirmação detalhada)
function marcarComoAplicada(id) {
    try {
        const agendamentos = JSON.parse(localStorage.getItem('agendamentosVacinas')) || [];
        const agendamento = agendamentos.find(ag => ag.id === id);
        
        if (!agendamento) {
            showToast('Agendamento não encontrado', 'danger');
            return;
        }

        // Preenche os detalhes no modal
        document.getElementById('detalhesPaciente').textContent = agendamento.paciente;
        document.getElementById('detalhesVacina').textContent = agendamento.vacina;
        document.getElementById('detalhesDose').textContent = agendamento.dose;
        document.getElementById('numeroLote').value = '';
        
        // Carrega funcionários para o select de aplicador
        carregarFuncionariosParaAgendamento();
        
        // Configura o botão de confirmação
        document.getElementById('confirmarAplicacaoBtn').onclick = function() {
            const lote = document.getElementById('numeroLote').value;
            const aplicadorSelect = document.getElementById('responsavelAplicacao');
            const aplicadorId = aplicadorSelect.value;
            const aplicadorNome = aplicadorSelect.options[aplicadorSelect.selectedIndex].text;
            
            if (!lote || !aplicadorId) {
                showToast('Por favor, preencha todos os campos', 'warning');
                return;
            }

            // Atualiza o agendamento
            const updated = agendamentos.map(ag => {
                if (ag.id === id) {
                    return { 
                        ...ag, 
                        status: 'aplicada',
                        lote,
                        aplicadorId,
                        aplicadorNome,
                        dataAplicacao: new Date().toISOString().split('T')[0]
                    };
                }
                return ag;
            });
            
            localStorage.setItem('agendamentosVacinas', JSON.stringify(updated));
            
            // Registra na aplicações
            const aplicacoes = JSON.parse(localStorage.getItem('aplicacoesVacinas')) || [];
            aplicacoes.push({
                id: Date.now().toString(),
                funcionarioId: agendamento.pacienteId,
                funcionarioNome: agendamento.paciente,
                vacina: agendamento.vacina,
                vacinaId: agendamento.vacinaId,
                dose: agendamento.dose,
                data: new Date().toISOString().split('T')[0],
                lote,
                aplicadorId,
                aplicadorNome
            });
            localStorage.setItem('aplicacoesVacinas', JSON.stringify(aplicacoes));
            
            // Atualiza estoque de vacinas
            atualizarEstoqueVacina(agendamento.vacinaId);
            
            // Fecha o modal e atualiza a tabela
            confirmarAplicacaoModal.hide();
            carregarAgendamentos();
            showToast('Vacina aplicada com sucesso!', 'success');
        };
        
        // Mostra o modal
        confirmarAplicacaoModal.show();

    } catch (error) {
        console.error('Erro ao marcar como aplicada:', error);
        showToast('Erro ao marcar vacina como aplicada', 'danger');
    }
}

// Atualiza estoque de vacinas após aplicação
function atualizarEstoqueVacina(vacinaId) {
    try {
        const vacinas = JSON.parse(localStorage.getItem('vacinas')) || [];
        const vacinaIndex = vacinas.findIndex(v => v.codigo === vacinaId);
        
        if (vacinaIndex !== -1 && vacinas[vacinaIndex].quantidade > 0) {
            vacinas[vacinaIndex].quantidade -= 1;
            localStorage.setItem('vacinas', JSON.stringify(vacinas));
            
            // Atualiza lista de vacinas no modal de agendamento
            carregarVacinas();
        }
    } catch (error) {
        console.error('Erro ao atualizar estoque:', error);
    }
}

// Remove agendamento
function removerAgendamento(id) {
    if (!confirm('Deseja realmente remover este agendamento?')) return;
    
    try {
        let agendamentos = JSON.parse(localStorage.getItem('agendamentosVacinas')) || [];
        agendamentos = agendamentos.filter(ag => ag.id !== id);
        localStorage.setItem('agendamentosVacinas', JSON.stringify(agendamentos));
        
        carregarAgendamentos();
        showToast('Agendamento removido com sucesso', 'info');

    } catch (error) {
        console.error('Erro ao remover agendamento:', error);
        showToast('Erro ao remover agendamento', 'danger');
    }
}

// Aplica filtros
function filtrarAgendamentos() {
    const dataFiltro = document.getElementById('dataFiltro').value;
    const pacienteFiltro = document.getElementById('pacienteFiltro').value;
    carregarAgendamentos(dataFiltro, pacienteFiltro);
}

// Limpa filtros
function limparFiltros() {
    document.getElementById('dataFiltro').value = '';
    document.getElementById('pacienteFiltro').value = '';
    carregarAgendamentos();
}

// Mostra notificação toast
function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast show align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    const container = document.getElementById('toast-container');
    container.appendChild(toast);
    
    // Remove o toast após 3 segundos
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa os modais
    agendarModal = new bootstrap.Modal(document.getElementById('agendarModal'));
    confirmarAplicacaoModal = new bootstrap.Modal(document.getElementById('confirmarAplicacaoModal'));
    
    // Carrega dados iniciais
    carregarFuncionariosParaAgendamento();
    carregarVacinas();
    
    // Configura data mínima como hoje
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('agData').min = hoje;
    document.getElementById('dataFiltro').value = hoje;
    
    // Carrega todos os agendamentos inicialmente
    carregarAgendamentos();
    
    // Configura o botão de novo agendamento
    document.querySelector('.btn-primary[data-bs-target="#agendarModal"]')
        .addEventListener('click', function() {
            document.getElementById('formAgendamento').reset();
            carregarFuncionariosParaAgendamento();
            carregarVacinas();
            agendarModal.show();
        });
        
    // Configura eventos de filtro em tempo real
    document.getElementById('dataFiltro').addEventListener('change', filtrarAgendamentos);
    document.getElementById('pacienteFiltro').addEventListener('input', filtrarAgendamentos);
});