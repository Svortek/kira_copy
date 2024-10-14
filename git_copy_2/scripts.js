document.addEventListener("DOMContentLoaded", () => {
    const authModal = document.getElementById("auth-modal");
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    const loginLink = document.getElementById("login-link");
    const registerLink = document.getElementById("register-link");
    const getStartedBtn = document.getElementById("get-started-btn");

    const closeAuthBtn = document.getElementById("close-auth");
    const switchToRegisterLink = document.getElementById("switch-to-register");
    const switchToLoginLink = document.getElementById("switch-to-login");

    const showModal = (form) => {
        loginForm.classList.remove("active");
        registerForm.classList.remove("active");
        form.classList.add("active");
        authModal.style.display = "block";
        const modalContent = authModal.querySelector('.modal-content');
        modalContent.classList.remove('close');
        modalContent.classList.add('active');
    };

    loginLink.addEventListener("click", () => showModal(loginForm));
    registerLink.addEventListener("click", () => showModal(registerForm));
    getStartedBtn.addEventListener("click", () => showModal(registerForm));

    closeAuthBtn.addEventListener("click", () => {
        const modalContent = authModal.querySelector('.modal-content');
        modalContent.classList.remove('active');
        modalContent.classList.add('close');
        setTimeout(() => {
            authModal.style.display = "none";
        }, 500);
    });

    window.addEventListener("click", (event) => {
        if (event.target === authModal) {
            const modalContent = authModal.querySelector('.modal-content');
            modalContent.classList.remove('active');
            modalContent.classList.add('close');
            setTimeout(() => {
                authModal.style.display = "none";
            }, 500);
        }
    });

    switchToRegisterLink.addEventListener("click", (event) => {
        event.preventDefault();
        loginForm.classList.remove("active");
        setTimeout(() => {
            registerForm.classList.add("active");
        }, 300);
    });

    switchToLoginLink.addEventListener("click", (event) => {
        event.preventDefault();
        registerForm.classList.remove("active");
        setTimeout(() => {
            loginForm.classList.add("active");
        }, 300);
    });

    loginForm.querySelector('form').addEventListener('submit', (event) => {
        event.preventDefault();
        const username = loginForm.querySelector('#login-username').value;
        localStorage.setItem('username', username);
        window.location.href = 'dashboard.html';
    });

    registerForm.querySelector('form').addEventListener('submit', (event) => {
        event.preventDefault();
        const username = registerForm.querySelector('#register-username').value;
        localStorage.setItem('username', username);
        window.location.href = 'dashboard.html';
    });
});
