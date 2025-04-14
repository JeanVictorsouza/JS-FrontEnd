class SalaVacinaController {
    constructor() {
        this.vacinas = [];
        this.editId = null;
        this.initElements();
        this.initEventListeners();
        this.loadVacinas();
        this.verificarVencimentos();
    }

    initElements() {
        this.elements = {
            form: document.getElementById('vacinaForm'),
            codigoInput: document.getElementById('codigo'),
            nomeInput: document.getElementById('nome'),
            dataInput: document.getElementById('data'),
            quantidadeInput: document.getElementById('quantidade'),
            searchInput: document.getElementById('search'),
            tableBody: document.getElementById('tabelaVacinas'),
            listBody: document.getElementById('listaVacinas'),
            totalSpan: document.getElementById('totalVacinas'),
            modal: new bootstrap.Modal('#confirmModal'),
            modalMessage: document.getElementById('modal-message'),
            modalConfirmBtn: document.getElementById('modal-confirm-btn'),
            toastContainer: document.getElementById('toast-container')
        };
    }

    initEventListeners() {
        this.elements.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.elements.searchInput?.addEventListener('input', () => this.filterVacinas());
        this.elements.modalConfirmBtn.addEventListener('click', () => this.confirmDelete());
        this.elements.dataInput.min = new Date().toISOString().split('T')[0];
    }

    loadVacinas() {
        try {
            const dados = localStorage.getItem('vacinas');
            this.vacinas = dados ? JSON.parse(dados) : [];
            this.renderTable();
            this.renderList();
        } catch (error) {
            console.error('Erro ao carregar vacinas:', error);
            this.showToast('Erro ao carregar dados das vacinas', 'danger');
        }
    }

    saveVacinas() {
        localStorage.setItem('vacinas', JSON.stringify(this.vacinas));
    }

    verificarVencimentos() {
        const hoje = new Date();
        const alertas = this.vacinas.filter(vacina => {
            const dataValidade = new Date(vacina.data);
            const diffTime = dataValidade - hoje;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            return diffDays <= 30;
        });

        if (alertas.length > 0) {
            const nomes = alertas.map(v => `${v.nome} (${this.formatDate(v.data)})`).join(', ');
            this.showToast(`Atenção: Vacinas próximas do vencimento: ${nomes}`, 'warning');
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        this.elements.form.classList.add('was-validated');
        
        if (!this.elements.form.checkValidity()) {
            return;
        }

        const vacina = {
            id: this.editId || Date.now().toString(),
            codigo: this.elements.codigoInput.value.trim().toUpperCase(),
            nome: this.elements.nomeInput.value.trim(),
            data: this.elements.dataInput.value,
            quantidade: parseInt(this.elements.quantidadeInput.value),
            dataRegistro: new Date().toISOString()
        };

        if (!/^[A-Z0-9]{3,10}$/.test(vacina.codigo)) {
            this.showToast('Código deve conter 3-10 caracteres (A-Z, 0-9)', 'warning');
            return;
        }

        if (new Date(vacina.data) < new Date()) {
            this.showToast('Data de validade não pode ser no passado', 'warning');
            return;
        }

        if (this.editId) {
            this.updateVacina(vacina);
        } else {
            if (this.vacinas.some(v => v.codigo === vacina.codigo && v.id !== this.editId)) {
                this.showToast('Código de vacina já existe', 'warning');
                return;
            }
            this.addVacina(vacina);
        }

        this.resetForm();
        this.renderTable();
        this.renderList();
    }

    addVacina(vacina) {
        this.vacinas.push(vacina);
        this.saveVacinas();
        this.showToast('Vacina adicionada com sucesso', 'success');
    }

    updateVacina(vacina) {
        const index = this.vacinas.findIndex(v => v.id === this.editId);
        if (index !== -1) {
            this.vacinas[index] = vacina;
            this.saveVacinas();
            this.showToast('Vacina atualizada com sucesso', 'success');
        }
        this.editId = null;
    }

    resetForm() {
        this.elements.form.reset();
        this.elements.form.classList.remove('was-validated');
        this.editId = null;
        this.elements.form.querySelector('button[type="submit"]').innerHTML = '<i class="bi bi-save me-1"></i>Salvar';
    }

    renderTable() {
        this.elements.tableBody.innerHTML = '';
        
        if (this.vacinas.length === 0) {
            this.elements.tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-4 text-muted">
                        Nenhuma vacina cadastrada
                    </td>
                </tr>
            `;
            this.elements.totalSpan.textContent = '0';
            return;
        }
        
        const hoje = new Date();
        
        this.vacinas.forEach(vacina => {
            const row = this.elements.tableBody.insertRow();
            
            const dataValidade = new Date(vacina.data);
            const diffTime = dataValidade - hoje;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            let rowClass = '';
            if (diffDays < 0) {
                rowClass = 'vacina-vencida';
            } else if (diffDays <= 30) {
                rowClass = 'vacina-proximo-vencimento';
            }
            
            row.className = rowClass;
            
            row.innerHTML = `
                <td>${vacina.codigo}</td>
                <td>${vacina.nome}</td>
                <td>${this.formatDate(vacina.data)}</td>
                <td class="text-center">${vacina.quantidade}</td>
                <td class="text-end">
                    <button class="btn btn-warning btn-sm me-1 edit-btn" data-id="${vacina.id}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-success btn-sm me-1 add-btn" data-id="${vacina.id}">
                        <i class="bi bi-plus"></i>
                    </button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${vacina.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
        });
        
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.prepareEdit(e));
        });
        
        document.querySelectorAll('.add-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.addQuantity(e));
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.prepareDelete(e));
        });
        
        this.updateTotal();
    }

    renderList() {
        this.elements.listBody.innerHTML = '';
        
        this.vacinas.forEach(vacina => {
            const row = this.elements.listBody.insertRow();
            row.innerHTML = `
                <td>${vacina.codigo}</td>
                <td>${vacina.nome}</td>
                <td>${this.formatDate(vacina.data)}</td>
                <td class="text-center">${vacina.quantidade}</td>
            `;
        });
    }

    prepareEdit(event) {
        const id = event.currentTarget.getAttribute('data-id');
        const vacina = this.vacinas.find(v => v.id === id);
        
        if (vacina) {
            this.elements.codigoInput.value = vacina.codigo;
            this.elements.nomeInput.value = vacina.nome;
            this.elements.dataInput.value = vacina.data;
            this.elements.quantidadeInput.value = vacina.quantidade;
            
            this.editId = id;
            this.elements.form.querySelector('button[type="submit"]').innerHTML = '<i class="bi bi-arrow-repeat me-1"></i>Atualizar';
            this.elements.form.scrollIntoView({ behavior: 'smooth' });
        }
    }

    addQuantity(event) {
        const id = event.currentTarget.getAttribute('data-id');
        const vacina = this.vacinas.find(v => v.id === id);
        
        if (vacina) {
            vacina.quantidade += 1;
            this.saveVacinas();
            this.renderTable();
            this.renderList();
            this.showToast('Quantidade atualizada com sucesso', 'success');
        }
    }

    prepareDelete(event) {
        const id = event.currentTarget.getAttribute('data-id');
        const vacina = this.vacinas.find(v => v.id === id);
        
        if (vacina) {
            this.elements.modalMessage.textContent = `Tem certeza que deseja remover ${vacina.nome} (${vacina.codigo})?`;
            this.elements.modalConfirmBtn.setAttribute('data-id', id);
            this.elements.modal.show();
        }
    }

    confirmDelete() {
        const id = this.elements.modalConfirmBtn.getAttribute('data-id');
        this.deleteVacina(id);
        this.elements.modal.hide();
    }

    deleteVacina(id) {
        this.vacinas = this.vacinas.filter(v => v.id !== id);
        this.saveVacinas();
        this.renderTable();
        this.renderList();
        this.showToast('Vacina removida com sucesso', 'success');
    }

    filterVacinas() {
        const term = this.elements.searchInput.value.toLowerCase();
        const rows = this.elements.tableBody.querySelectorAll('tr');
        
        rows.forEach(row => {
            if (row.cells) {
                const codigo = row.cells[0].textContent.toLowerCase();
                const nome = row.cells[1].textContent.toLowerCase();
                row.style.display = (codigo.includes(term) || nome.includes(term)) ? "" : "none";
            }
        });
    }

    updateTotal() {
        const total = this.vacinas.reduce((sum, vacina) => sum + vacina.quantidade, 0);
        this.elements.totalSpan.textContent = total;
    }

    exportarParaExcel() {
        if (this.vacinas.length === 0) {
            this.showToast('Nenhum dado para exportar', 'warning');
            return;
        }

        const dados = this.vacinas.map(v => ({
            Código: v.codigo,
            Nome: v.nome,
            Validade: this.formatDate(v.data),
            Quantidade: v.quantidade,
            'Data Registro': this.formatDate(v.dataRegistro)
        }));

        const csvContent = "data:text/csv;charset=utf-8," 
            + [Object.keys(dados[0]).join(";")].concat(
                dados.map(item => Object.values(item).join(";"))
            ).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `vacinas_estoque_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showToast('Exportação concluída com sucesso', 'success');
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
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

document.addEventListener('DOMContentLoaded', () => {
    window.controller = new SalaVacinaController();
});