class CartaoVacinaController {
    constructor() {
        this.funcionarioSelecionado = null;
        this.initElements();
        this.initEventListeners();
        this.carregarFuncionarios();
    }

    initElements() {
        this.elements = {
            funcionarioSelect: document.getElementById('funcionarioSelect'),
            funcionarioNome: document.getElementById('funcionario-nome'),
            funcionarioInfo: document.getElementById('funcionario-info'),
            funcionarioRegistro: document.getElementById('funcionario-registro'),
            funcionarioCpf: document.getElementById('funcionario-cpf'),
            historicoVacinas: document.getElementById('historico-vacinas'),
            semRegistros: document.getElementById('sem-registros'),
            btnImprimir: document.getElementById('btn-imprimir'),
            toastContainer: document.getElementById('toast-container')
        };
    }

    initEventListeners() {
        this.elements.funcionarioSelect.addEventListener('change', (e) => {
            this.selecionarFuncionario(e.target.value);
        });

        this.elements.btnImprimir.addEventListener('click', () => {
            this.imprimirCartao();
        });
    }

    carregarFuncionarios() {
        try {
            const funcionarios = JSON.parse(localStorage.getItem('funcionarios')) || [];
            const aplicacoes = JSON.parse(localStorage.getItem('aplicacoesVacinas')) || [];
            
            // Filtra apenas funcionários que têm vacinas aplicadas
            const funcionariosComVacinas = funcionarios.filter(func => 
                aplicacoes.some(ap => ap.funcionarioId === func.id)
            );

            this.popularSelectFuncionarios(funcionariosComVacinas);
            
            if (funcionariosComVacinas.length > 0) {
                this.selecionarFuncionario(funcionariosComVacinas[0].id);
                this.elements.funcionarioSelect.value = funcionariosComVacinas[0].id;
            }
        } catch (error) {
            console.error('Erro ao carregar funcionários:', error);
            this.showToast('Erro ao carregar dados dos funcionários', 'danger');
        }
    }

    popularSelectFuncionarios(funcionarios) {
        this.elements.funcionarioSelect.innerHTML = '<option value="" selected disabled>Selecione um funcionário</option>';
        
        funcionarios.forEach(func => {
            const option = document.createElement('option');
            option.value = func.id;
            option.textContent = func.nome;
            this.elements.funcionarioSelect.appendChild(option);
        });
    }

    selecionarFuncionario(funcionarioId) {
        const funcionarios = JSON.parse(localStorage.getItem('funcionarios')) || [];
        const aplicacoes = JSON.parse(localStorage.getItem('aplicacoesVacinas')) || [];
        const vacinas = JSON.parse(localStorage.getItem('vacinas')) || [];
        
        this.funcionarioSelecionado = funcionarios.find(f => f.id === funcionarioId);
        
        if (!this.funcionarioSelecionado) {
            this.limparDadosFuncionario();
            return;
        }

        this.exibirDadosFuncionario();
        
        const aplicacoesFuncionario = aplicacoes
            .filter(ap => ap.funcionarioId === funcionarioId)
            .map(ap => {
                const vacina = vacinas.find(v => v.codigo === ap.vacinaId) || {};
                return {
                    ...ap,
                    nomeVacina: vacina.nome || 'Vacina não encontrada'
                };
            })
            .sort((a, b) => new Date(b.dataAplicacao) - new Date(a.dataAplicacao));

        this.exibirHistoricoVacinas(aplicacoesFuncionario);
    }

    exibirDadosFuncionario() {
        if (!this.funcionarioSelecionado) return;

        this.elements.funcionarioNome.textContent = this.funcionarioSelecionado.nome;
        this.elements.funcionarioInfo.textContent = `Nascimento: ${this.formatarData(this.funcionarioSelecionado.nascimento)}`;
        this.elements.funcionarioRegistro.textContent = this.funcionarioSelecionado.registro;
        this.elements.funcionarioCpf.textContent = this.formatarCPF(this.funcionarioSelecionado.cpf);
    }

    limparDadosFuncionario() {
        this.elements.funcionarioNome.textContent = '-';
        this.elements.funcionarioInfo.textContent = '-';
        this.elements.funcionarioRegistro.textContent = '-';
        this.elements.funcionarioCpf.textContent = '-';
        this.elements.historicoVacinas.innerHTML = '';
        this.elements.semRegistros.style.display = 'block';
    }

    exibirHistoricoVacinas(aplicacoes) {
        this.elements.historicoVacinas.innerHTML = '';
        
        if (aplicacoes.length === 0) {
            this.elements.semRegistros.style.display = 'block';
            return;
        }

        this.elements.semRegistros.style.display = 'none';

        aplicacoes.forEach(ap => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${this.formatarData(ap.dataAplicacao)}</td>
                <td>${ap.nomeVacina}</td>
                <td>${ap.vacinaId}</td>
                <td>${ap.lote || 'N/I'}</td>
                <td>${ap.aplicadoPor || 'Sistema'}</td>
            `;
            this.elements.historicoVacinas.appendChild(row);
        });
    }

    imprimirCartao() {
        if (!this.funcionarioSelecionado) {
            this.showToast('Selecione um funcionário primeiro', 'warning');
            return;
        }

        const conteudoOriginal = document.getElementById('content').innerHTML;
        const conteudoImpressao = document.getElementById('cartao-container').innerHTML;
        
        // Cria uma janela temporária para impressão
        const janelaImpressao = window.open('', '_blank');
        janelaImpressao.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Cartão de Vacina - ${this.funcionarioSelecionado.nome}</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    @media print {
                        body { padding: 20px; }
                        .no-print { display: none !important; }
                        table { width: 100%; }
                        h4 { font-size: 1.5rem; }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h3 class="mb-0">Cartão de Vacinação</h3>
                        <small>${new Date().toLocaleDateString('pt-BR')}</small>
                    </div>
                    ${conteudoImpressao}
                </div>
                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                            window.close();
                        }, 200);
                    };
                </script>
            </body>
            </html>
        `);
        janelaImpressao.document.close();
    }

    formatarData(dataString) {
        if (!dataString) return '-';
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
    }

    formatarCPF(cpf) {
        if (!cpf) return '-';
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast show align-items-center text-white bg-${type} border-0`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;
        
        this.elements.toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Inicializa o controller quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new CartaoVacinaController();
});