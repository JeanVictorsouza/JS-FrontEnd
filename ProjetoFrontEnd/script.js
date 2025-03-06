document.getElementById("menu-toggle").addEventListener("click", function() {
    document.getElementById("sidebar").classList.toggle("active");
    document.body.classList.toggle("sidebar-active");
});

function loadPage(page) {
    let contentDiv = document.getElementById("content");
    if (page === "funcionarios") {
        renderFuncionarioPage();
    } else if (page === "sala_vacinas") {
        renderVacinasPage();
    } else {
        contentDiv.innerHTML = `<h2>${page}</h2><p>Conteúdo da página ${page}.</p>`;
    }
}

let funcionarios = JSON.parse(localStorage.getItem("funcionarios")) || [];
let vacinas = JSON.parse(localStorage.getItem("vacinas")) || [];

function salvarFuncionarios() {
    localStorage.setItem("funcionarios", JSON.stringify(funcionarios));
}

function salvarVacinas() {
    localStorage.setItem("vacinas", JSON.stringify(vacinas));
}

function renderFuncionarioPage() {
    let contentDiv = document.getElementById("content");
    let formHtml = `
        <h2>Cadastro de Funcionários</h2>
        <button class="btn btn-primary" onclick="adicionarFuncionario()">➕ Cadastrar Funcionário</button>
        <input type="text" id="search-funcionario" class="form-control mt-3 mb-3" placeholder="Pesquisar funcionário..." onkeyup="pesquisarFuncionario()">
        <table class="table table-striped">
            <thead class="table-dark">
                <tr>
                    <th>Nome</th>
                    <th>CPF</th>
                    <th>Sexo</th>
                    <th>Data de Nascimento</th>
                    <th>Cidade</th>
                    <th>Email</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody id="tabela-funcionarios">`;
    funcionarios.forEach((funcionario, index) => {
        formHtml += `
            <tr>
                <td>${funcionario.nome}</td>
                <td>${funcionario.cpf}</td>
                <td>${funcionario.sexo}</td>
                <td>${funcionario.dataNascimento}</td>
                <td>${funcionario.cidade}</td>
                <td>${funcionario.email}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarFuncionario(${index})">✏️ Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="excluirFuncionario(${index})">🗑️ Excluir</button>
                </td>
            </tr>`;
    });
    formHtml += `</tbody></table>`;
    contentDiv.innerHTML = formHtml;
}

function renderVacinasPage() {
    let contentDiv = document.getElementById("content");
    let formHtml = `
        <h2>Cadastro de Vacinas</h2>
        <button class="btn btn-primary" onclick="adicionarVacina()">➕ Cadastrar Vacina</button>
        <table class="table table-striped">
            <thead class="table-dark">
                <tr>
                    <th>Nome</th>
                    <th>Fabricante</th>
                    <th>Data de Validade</th>
                    <th>Quantidade</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody id="tabela-vacinas">`;
    vacinas.forEach((vacina, index) => {
        formHtml += `
            <tr>
                <td>${vacina.nome}</td>
                <td>${vacina.fabricante}</td>
                <td>${vacina.validade}</td>
                <td>${vacina.quantidade}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarVacina(${index})">✏️ Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="excluirVacina(${index})">🗑️ Excluir</button>
                </td>
            </tr>`;
    });
    formHtml += `</tbody></table>`;
    contentDiv.innerHTML = formHtml;
}

function adicionarFuncionario() {
    let nome = prompt("Nome do Funcionário:");
    let cpf = prompt("CPF:");
    let sexo = prompt("Sexo (Masculino/Feminino):");
    let dataNascimento = prompt("Data de Nascimento (DD-MM-AAAA):");
    let cidade = prompt("Cidade:");
    let email = prompt("Email:");
    
    if (nome && cpf && sexo && dataNascimento && cidade && email) {
        funcionarios.push({ nome, cpf, sexo, dataNascimento, cidade, email });
        salvarFuncionarios();
        renderFuncionarioPage();
    } else {
        alert("Preencha todos os campos corretamente.");
    }
}

function adicionarVacina() {
    let nome = prompt("Nome da Vacina:");
    let fabricante = prompt("Fabricante:");
    let validade = prompt("Data de Validade (DD-MM-AAAA):");
    let quantidade = prompt("Quantidade:");
    
    if (nome && fabricante && validade && quantidade) {
        vacinas.push({ nome, fabricante, validade, quantidade });
        salvarVacinas();
        renderVacinasPage();
    } else {
        alert("Preencha todos os campos corretamente.");
    }
}

function excluirVacina(index) {
    if (confirm("Tem certeza que deseja excluir esta vacina?")) {
        vacinas.splice(index, 1);
        salvarVacinas();
        renderVacinasPage();
    }
}

function editarVacina(index) {
    let vacina = vacinas[index];
    let nome = prompt("Nome:", vacina.nome);
    let fabricante = prompt("Fabricante:", vacina.fabricante);
    let validade = prompt("Data de Validade (DD-MM-AAAA):", vacina.validade);
    let quantidade = prompt("Quantidade:", vacina.quantidade);
    
    if (nome && fabricante && validade && quantidade) {
        vacinas[index] = { nome, fabricante, validade, quantidade };
        salvarVacinas();
        renderVacinasPage();
    }
}

function editarFuncionario(index) {
    let funcionario = funcionarios[index];
    let nome = prompt("Nome:", funcionario.nome);
    let cpf = prompt("CPF:", funcionario.cpf);
    let sexo = prompt("Sexo (M/F):", funcionario.sexo).toUpperCase();
    let dataNascimento = prompt("Data de Nascimento (DDMMYYYY):", funcionario.dataNascimento);
    let cidade = prompt("Cidade:", funcionario.cidade);
    let email = prompt("Email:", funcionario.email);
    
    dataNascimento = formatarDataBR(dataNascimento);
    
    if (nome && cpf && (sexo === "M" || sexo === "F") && dataNascimento && cidade && email) {
        funcionarios[index] = { nome, cpf, sexo, dataNascimento, cidade, email };
        salvarFuncionarios();
        renderFuncionarioPage();
    }
}