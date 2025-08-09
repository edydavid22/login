// ======== Elemente HTML ========
const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');

const loginForm = document.querySelector('.from-box.login form');
const registerForm = document.querySelector('.from-box.register form');

const nav = document.querySelector('.navigation');
const logo = document.querySelector('.logo');

// ======== Clasa pentru autentificare ========
class Auth {
    constructor() {
        this.storageKey = 'loggedUser';
        this.usersKey = 'usersList';
    }

    getUsers() {
        return JSON.parse(localStorage.getItem(this.usersKey)) || [];
    }

    saveUsers(users) {
        localStorage.setItem(this.usersKey, JSON.stringify(users));
    }

    register(username, email, password) {
        let users = this.getUsers();

        if (users.some(u => u.email === email)) {
            return { success: false, message: "Email-ul există deja!" };
        }

        users.push({ username, email, password });
        this.saveUsers(users);
        return { success: true, message: "Cont creat cu succes!" };
    }

    login(email, password) {
        let users = this.getUsers();
        let user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem(this.storageKey, JSON.stringify(user));
            return { success: true, message: "Te-ai logat cu succes!" };
        } else {
            return { success: false, message: "Date de logare greșite!" };
        }
    }

    logout() {
        localStorage.removeItem(this.storageKey);
        location.reload();
    }

    getLoggedUser() {
        return JSON.parse(localStorage.getItem(this.storageKey));
    }

    isLoggedIn() {
        return !!this.getLoggedUser();
    }
}

// ======== Inițializare ========
const auth = new Auth();

// ======== Schimbare între login/register ========
registerLink.addEventListener('click', () => {
    wrapper.classList.add('active');
});

loginLink.addEventListener('click', () => {
    wrapper.classList.remove('active');
});

btnPopup.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
});

iconClose.addEventListener('click', () => {
    wrapper.classList.remove('active-popup');
});

// ======== LOGIN ========
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('input[type="email"]').value.trim();
        const password = loginForm.querySelector('input[type="password"]').value.trim();

        let result = auth.login(email, password);
        alert(result.message);

        if (result.success) {
            location.reload();
        }
    });
}

// ======== REGISTER ========
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = registerForm.querySelector('input[type="text"]').value.trim();
        const email = registerForm.querySelector('input[type="email"]').value.trim();
        const password = registerForm.querySelector('input[type="password"]').value.trim();

        let result = auth.register(username, email, password);
        alert(result.message);
        if (result.success) {
            wrapper.classList.remove('active'); // Trecem înapoi la login
        }
    });
}

// ======== Afișare nume + Logout ========
if (auth.isLoggedIn()) {
    const user = auth.getLoggedUser();

    // Înlocuim butonul Login cu numele și logout
    btnPopup.style.display = 'none';

    const userInfo = document.createElement('span');
    userInfo.textContent = `Salut, ${user.username}`;
    userInfo.style.marginRight = "15px";
    userInfo.style.color = "white";
    userInfo.classList.add('username')

    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = "Logout";
    logoutBtn.classList.add('btnLogout');
    logoutBtn.addEventListener('click', () => auth.logout());

    nav.appendChild(userInfo);
    nav.appendChild(logoutBtn);
}
