document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const sidebar = document.getElementById("sidebar");
    const registerForm = document.getElementById("register-form");
    const loginForm = document.getElementById("login-form");
    const message = document.getElementById("message");
    const showRegisterBtn = document.getElementById("show-register");
    const showLoginBtn = document.getElementById("show-login");

    // Toggle do menu lateral
    menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("active");
        document.body.classList.toggle("sidebar-active");
    });

    // Alternar entre Cadastro e Login
    showRegisterBtn.addEventListener("click", () => {
        registerForm.classList.remove("hidden");
        loginForm.classList.add("hidden");
    });

    showLoginBtn.addEventListener("click", () => {
        loginForm.classList.remove("hidden");
        registerForm.classList.add("hidden");
    });

    // Função para cadastrar usuário
    registerForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        if (!name || !email || !password || !confirmPassword) {
            message.textContent = "Preencha todos os campos!";
            message.style.color = "red";
            return;
        }

        if (password !== confirmPassword) {
            message.textContent = "As senhas não coincidem!";
            message.style.color = "red";
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];
        if (users.some(user => user.email === email)) {
            message.textContent = "E-mail já cadastrado!";
            message.style.color = "red";
            return;
        }

        users.push({ name, email, password });
        localStorage.setItem("users", JSON.stringify(users));

        message.textContent = "Usuário cadastrado com sucesso!";
        message.style.color = "green";
        registerForm.reset();
    });

    // Função para login do usuário
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value;

        let users = JSON.parse(localStorage.getItem("users")) || [];

        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
            message.textContent = `Bem-vindo, ${user.name}!`;
            message.style.color = "green";
            localStorage.setItem("loggedInUser", JSON.stringify(user));
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        } else {
            message.textContent = "E-mail ou senha incorretos!";
            message.style.color = "red";
        }
    });
});