// Toggle do menu
document.getElementById("menu-toggle").addEventListener("click", function() {
    document.getElementById("sidebar").classList.toggle("active");
    document.body.classList.toggle("sidebar-active");
});

// Carrega os dados das vacinas
function carregarDadosVacinas() {
    const historicoTbody = document.getElementById("historicoVacinas");
    historicoTbody.innerHTML = '';
    
    const vacinas = JSON.parse(localStorage.getItem('vacinas')) || [];
    
    if (vacinas.length === 0) {
        historicoTbody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center">Nenhuma vacina cadastrada</td>
            </tr>
        `;
    } else {
        vacinas.forEach(vacina => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${vacina.nome}</td>
                <td>${formatarData(vacina.data)}</td>
                <td>${vacina.quantidade}</td>
            `;
            historicoTbody.appendChild(row);
        });
    }
}

// Função para formatar data
function formatarData(dataString) {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
}

// Carrega os dados ao iniciar
document.addEventListener('DOMContentLoaded', carregarDadosVacinas);