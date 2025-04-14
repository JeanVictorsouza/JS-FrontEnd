class DashboardController {
    constructor() {
        this.charts = {
            vacinas: null,
            status: null
        };
        this.initElements();
        this.initDashboard();
    }

    initElements() {
        this.elements = {
            dashboard: document.getElementById('dashboard')
        };
    }

    initDashboard() {
        this.createDashboardLayout();
        this.carregarDashboard();
        this.interval = setInterval(() => this.carregarDashboard(), 30000);
        
        window.addEventListener('beforeunload', () => {
            clearInterval(this.interval);
        });
    }

    createDashboardLayout() {
        this.elements.dashboard.innerHTML = `
            <div class="col-md-6 col-lg-3 mb-4">
                <div class="card h-100">
                    <div class="card-body text-center">
                        <h5 class="card-title">Vacinas Aplicadas</h5>
                        <p class="display-6" id="vacinasAplicadas">0</p>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-lg-3 mb-4">
                <div class="card h-100">
                    <div class="card-body text-center">
                        <h5 class="card-title">Funcionários Cadastrados</h5>
                        <p class="display-6" id="funcionariosCadastrados">0</p>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-lg-3 mb-4">
                <div class="card h-100">
                    <div class="card-body text-center">
                        <h5 class="card-title">Funcionários Vacinados</h5>
                        <p class="display-6" id="funcionariosVacinados">0</p>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-lg-3 mb-4">
                <div class="card h-100">
                    <div class="card-body text-center">
                        <h5 class="card-title">Vacinas Agendadas</h5>
                        <p class="display-6" id="vacinasAgendadas">0</p>
                    </div>
                </div>
            </div>
            <div class="col-md-6 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">Vacinas por Tipo</h5>
                        <div class="chart-container">
                            <canvas id="graficoVacinas"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">Status de Vacinação</h5>
                        <div class="chart-container">
                            <canvas id="graficoStatus"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    carregarDashboard() {
        try {
            // 1. Vacinas Aplicadas
            const aplicacoes = JSON.parse(localStorage.getItem('aplicacoesVacinas')) || [];
            document.getElementById('vacinasAplicadas').textContent = aplicacoes.length;

            // 2. Funcionários Cadastrados
            const funcionarios = JSON.parse(localStorage.getItem('funcionarios')) || [];
            document.getElementById('funcionariosCadastrados').textContent = funcionarios.length;

            // 3. Funcionários Vacinados
            const funcionariosVacinados = this.calcularFuncionariosVacinados(funcionarios, aplicacoes);
            document.getElementById('funcionariosVacinados').textContent = funcionariosVacinados;

            // 4. Vacinas Agendadas
            const agendamentosPendentes = this.calcularAgendamentosPendentes();
            document.getElementById('vacinasAgendadas').textContent = agendamentosPendentes;

            // Atualiza gráficos
            this.atualizarGraficos(funcionarios.length, funcionariosVacinados);
            
        } catch (error) {
            console.error('Erro ao carregar dashboard:', error);
        }
    }

    calcularFuncionariosVacinados(funcionarios, aplicacoes) {
        return funcionarios.filter(func => {
            return aplicacoes.some(ap => ap.funcionarioId === func.id);
        }).length;
    }

    calcularAgendamentosPendentes() {
        const agendamentos = JSON.parse(localStorage.getItem('agendamentosVacinas')) || [];
        return agendamentos.filter(ag => ag.status === 'pendente').length;
    }

    atualizarGraficos(totalFuncionarios, vacinados) {
        const aplicacoes = JSON.parse(localStorage.getItem('aplicacoesVacinas')) || [];
        const vacinas = JSON.parse(localStorage.getItem('vacinas')) || [];
        const naoVacinados = totalFuncionarios - vacinados;

        // Gráfico 1: Vacinas por tipo
        const tiposVacina = {};
        aplicacoes.forEach(ap => {
            const vacina = vacinas.find(v => v.codigo === ap.vacinaId);
            if (vacina) tiposVacina[vacina.nome] = (tiposVacina[vacina.nome] || 0) + 1;
        });

        // Destrói gráficos existentes
        if (this.charts.vacinas) this.charts.vacinas.destroy();
        if (this.charts.status) this.charts.status.destroy();

        // Cria novos gráficos
        const ctx1 = document.getElementById('graficoVacinas');
        const ctx2 = document.getElementById('graficoStatus');

        if (Object.keys(tiposVacina).length > 0) {
            this.charts.vacinas = new Chart(ctx1, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(tiposVacina),
                    datasets: [{
                        data: Object.values(tiposVacina),
                        backgroundColor: ['#36a2eb', '#ff6384', '#4bc0c0', '#ffcd56', '#9966ff'],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        } else {
            ctx1.closest('.card-body').innerHTML = `
                <h5 class="card-title">Vacinas por Tipo</h5>
                <p class="text-muted">Nenhum dado disponível</p>
            `;
        }

        if (totalFuncionarios > 0) {
            this.charts.status = new Chart(ctx2, {
                type: 'pie',
                data: {
                    labels: ['Vacinados', 'Não Vacinados'],
                    datasets: [{
                        data: [vacinados, naoVacinados],
                        backgroundColor: ['#4bc0c0', '#ff6384'],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        } else {
            ctx2.closest('.card-body').innerHTML = `
                <h5 class="card-title">Status de Vacinação</h5>
                <p class="text-muted">Nenhum funcionário cadastrado</p>
            `;
        }
    }
}

// Inicializa o dashboard quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new DashboardController();
});