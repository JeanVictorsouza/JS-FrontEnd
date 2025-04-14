// scriptDashboard.js
document.addEventListener('DOMContentLoaded', function() {
    // Configura menu e sidebar
    loadNavbar();
    setupMenuToggle();
    
    // Verifica login
    if (!localStorage.getItem('usuarioLogado')) {
        window.location.href = '../Login/login.html';
        return;
    }

    // Carrega dados
    carregarDashboard();
    setInterval(carregarDashboard, 30000);
});

// Função principal do dashboard
function carregarDashboard() {
    try {
        const aplicacoes = JSON.parse(localStorage.getItem('aplicacoesVacinas')) || [];
        const funcionarios = JSON.parse(localStorage.getItem('funcionarios')) || [];
        
        // Atualiza cards
        document.getElementById('vacinasAplicadas').textContent = aplicacoes.length;
        document.getElementById('funcionariosCadastrados').textContent = funcionarios.length;
        document.getElementById('funcionariosVacinados').textContent = calcularFuncionariosVacinados(funcionarios, aplicacoes);
        document.getElementById('vacinasAgendadas').textContent = calcularAgendamentosPendentes();
        
        // Atualiza gráficos
        atualizarGraficos(funcionarios.length, calcularFuncionariosVacinados(funcionarios, aplicacoes));
        
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
    }
}