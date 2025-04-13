document.getElementById("menu-toggle").addEventListener("click", function() {
    const sidebar = document.getElementById("sidebar");
    console.log('Botão clicado'); // Verifique se aparece no console
    
    if (!sidebar) {
        console.error('Elemento #sidebar não encontrado');
        return;
    }
    
    sidebar.classList.toggle("active");
    document.body.classList.toggle("sidebar-active");
    
    if (sidebar.classList.contains("active")) {
        document.documentElement.style.overflowX = 'hidden';
    } else {
        document.documentElement.style.overflowX = '';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const aplicacoes = JSON.parse(localStorage.getItem('aplicacoesVacinas')) || [];
    const vacinas = JSON.parse(localStorage.getItem('vacinas')) || [];
    
    // Filtra aplicações do usuário logado
    const historicoUsuario = aplicacoes.filter(ap => ap.usuarioId === usuarioLogado.id);
    
    // Preenche a tabela
    const tabela = document.getElementById('tabelaCartaoVacinas').getElementsByTagName('tbody')[0];
    
    historicoUsuario.forEach(aplicacao => {
        const vacina = vacinas.find(v => v.id === aplicacao.vacinaId);
        const row = tabela.insertRow();
        
        row.insertCell(0).textContent = vacina?.nome || 'Vacina não encontrada';
        row.insertCell(1).textContent = new Date(aplicacao.dataAplicacao).toLocaleDateString('pt-BR');
        row.insertCell(2).textContent = aplicacao.dose;
        row.insertCell(3).textContent = aplicacao.responsavel;
        
        // Botão para gerar comprovante (opcional)
        const btn = document.createElement('button');
        btn.className = 'btn btn-sm btn-outline-primary';
        btn.innerHTML = '<i class="bi bi-download"></i>';
        btn.onclick = () => gerarComprovante(aplicacao.id);
        row.insertCell(4).appendChild(btn);
    });
});

function gerarComprovante(idAplicacao) {
    // Implemente a geração de PDF ou imagem do comprovante
    console.log(`Gerando comprovante para aplicação ${idAplicacao}`);
}