// Authentication JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    
    const loginFormElement = document.getElementById('loginFormElement');
    const registerFormElement = document.getElementById('registerFormElement');
    const forgotPasswordFormElement = document.getElementById('forgotPasswordFormElement');
    
    // Navigation links
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const backToLoginLink = document.getElementById('backToLogin');
    
    // Password toggle buttons
    const togglePassword = document.getElementById('togglePassword');
    const toggleRegisterPassword = document.getElementById('toggleRegisterPassword');
    
    // Comptes administrateur GroomGo
    const ADMIN_ACCOUNTS = {
        // Comptes avec emails complets
        'admin@groomgo.tn': {
            password: 'admin123',
            name: 'Administrateur GroomGo',
            role: 'admin'
        },
        'client@groomgo.tn': {
            password: 'client123',
            name: 'Client GroomGo',
            role: 'client'
        },
        // Comptes avec noms simples (pour compatibilité)
        'admin': {
            password: 'admin123',
            email: 'admin@groomgo.tn',
            name: 'Administrateur GroomGo',
            role: 'admin'
        },
        'client': {
            password: 'client123',
            email: 'client@groomgo.tn',
            name: 'Client GroomGo',
            role: 'client'
        }
    };
    
    // Initialize
    init();
    
    function init() {
        setupFormSwitching();
        setupPasswordToggles();
        setupFormHandlers();
        setupPasswordStrength();
        setupDemoAccountHelper();
        checkAuthState();
        showDemoInfo();
    }
    
    function setupDemoAccountHelper() {
        // Ajouter un clic sur l'aide pour remplir automatiquement
        const demoAccounts = document.querySelector('.demo-accounts');
        if (demoAccounts) {
            demoAccounts.addEventListener('click', function() {
                const emailInput = document.querySelector('#loginFormElement input[name="email"]');
                const passwordInput = document.querySelector('#loginFormElement input[name="password"]');
                
                if (emailInput && passwordInput) {
                    emailInput.value = 'admin@groomgo.tn';
                    passwordInput.value = 'admin123';
                    
                    // Animation de surbrillance
                    emailInput.classList.add('highlight');
                    passwordInput.classList.add('highlight');
                    setTimeout(() => {
                        emailInput.classList.remove('highlight');
                        passwordInput.classList.remove('highlight');
                    }, 2000);
                    
                    showNotification('Champs remplis automatiquement !', 'info');
                }
            });
        }
    }
    
    function showNotification(message, type = 'info') {
        // Créer une notification simple
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 250px;';
        notification.innerHTML = `
            <i class="fas fa-info-circle me-2"></i>${message}
            <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
    
    function showDemoInfo() {
        console.log('🔑 Compte administrateur GroomGo:');
        console.log('📧 admin@groomgo.tn | 🔒 admin123');
        console.log('');
        console.log('🔑 Nom court:');
        console.log('📧 admin | 🔒 admin123');
    }
    
    // Fonction de test pour connexion automatique
    window.autoLogin = function() {
        console.log('🧪 Test de connexion automatique...');
        
        const emailInput = document.querySelector('#loginFormElement input[name="email"]');
        const passwordInput = document.querySelector('#loginFormElement input[name="password"]');
        const submitBtn = document.querySelector('#loginFormElement button[type="submit"]');
        
        if (emailInput && passwordInput && submitBtn) {
            emailInput.value = 'admin@groomgo.tn';
            passwordInput.value = 'admin123';
            
            setTimeout(() => {
                submitBtn.click();
            }, 500);
        }
    };
    
    // Fonction d'authentification
    async function authenticateUser(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Vérifier d'abord par nom d'utilisateur simple
                const account = ADMIN_ACCOUNTS[email.toLowerCase()];
                
                if (account && account.password === password) {
                    resolve({
                        email: account.email || email,
                        name: account.name,
                        role: account.role
                    });
                    return;
                }
                
                reject(new Error('Identifiants incorrects. Utilisez: admin@groomgo.tn/admin123 ou admin/admin123'));
            }, 1000);
        });
    }
    
    // Form switching
    function setupFormSwitching() {
        showRegisterLink?.addEventListener('click', (e) => {
            e.preventDefault();
            switchForm('register');
        });
        
        showLoginLink?.addEventListener('click', (e) => {
            e.preventDefault();
            switchForm('login');
        });
        
        forgotPasswordLink?.addEventListener('click', (e) => {
            e.preventDefault();
            switchForm('forgot');
        });
        
        backToLoginLink?.addEventListener('click', (e) => {
            e.preventDefault();
            switchForm('login');
        });
    }
    
    function switchForm(formType) {
        // Hide all forms
        loginForm?.classList.add('d-none');
        registerForm?.classList.add('d-none');
        forgotPasswordForm?.classList.add('d-none');
        
        // Show selected form
        switch(formType) {
            case 'register':
                registerForm?.classList.remove('d-none');
                break;
            case 'forgot':
                forgotPasswordForm?.classList.remove('d-none');
                break;
            default:
                loginForm?.classList.remove('d-none');
        }
        
        // Clear forms
        clearFormErrors();
    }
    
    // Password toggles
    function setupPasswordToggles() {
        togglePassword?.addEventListener('click', function() {
            const passwordInput = document.querySelector('#loginFormElement input[name="password"]');
            togglePasswordVisibility(passwordInput, this);
        });
        
        toggleRegisterPassword?.addEventListener('click', function() {
            const passwordInput = document.querySelector('#registerFormElement input[name="password"]');
            togglePasswordVisibility(passwordInput, this);
        });
    }
    
    function togglePasswordVisibility(input, button) {
        const icon = button.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }
    
    // Form handlers
    function setupFormHandlers() {
        loginFormElement?.addEventListener('submit', handleLogin);
        registerFormElement?.addEventListener('submit', handleRegister);
        forgotPasswordFormElement?.addEventListener('submit', handleForgotPassword);
    }
    
    async function handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const rememberMe = document.getElementById('rememberMe').checked;
        
        if (!validateLoginForm(email, password)) {
            return;
        }
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        setButtonLoading(submitBtn, true);
        
        try {
            // Vérifier les comptes de démonstration simples
            const user = await authenticateUser(email, password);
            
            // Sauvegarder la session
            localStorage.setItem('groomgo_user', JSON.stringify({
                email: user.email,
                name: user.name,
                role: user.role,
                loginTime: new Date().toISOString()
            }));
            
            if (rememberMe) {
                localStorage.setItem('groomgo_remember', 'true');
            }
            
            showSuccessMessage(`Bienvenue ${user.name}! Redirection en cours...`);
            
            // Sauvegarder le token admin si c'est un admin
            if (user.role === 'admin') {
                localStorage.setItem('adminToken', 'admin-' + Date.now());
            }
            
            setTimeout(() => {
                // Rediriger vers le dashboard admin si c'est un admin
                if (user.role === 'admin') {
                    window.location.href = 'admin-dashboard.html';
                } else {
                    window.location.href = 'index.html';
                }
            }, 1500);
            
        } catch (error) {
            showErrorMessage(error.message);
        } finally {
            setButtonLoading(submitBtn, false);
        }
    }
    
    async function handleRegister(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const userData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
        };
        
        if (!validateRegisterForm(userData)) {
            return;
        }
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        setButtonLoading(submitBtn, true);
        
        try {
            // Simulate API call
            await simulateRegister(userData);
            
            showSuccessMessage('Compte créé avec succès! Vérifiez votre email pour l\'activation.');
            
            setTimeout(() => {
                switchForm('login');
            }, 2000);
            
        } catch (error) {
            showErrorMessage(error.message);
        } finally {
            setButtonLoading(submitBtn, false);
        }
    }
    
    async function handleForgotPassword(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const email = formData.get('email');
        
        if (!validateEmail(email)) {
            showFieldError(e.target.querySelector('input[name="email"]'), 'Veuillez entrer un email valide');
            return;
        }
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        setButtonLoading(submitBtn, true);
        
        try {
            // Simulate API call
            await simulateForgotPassword(email);
            
            showSuccessMessage('Un lien de réinitialisation a été envoyé à votre email.');
            
        } catch (error) {
            showErrorMessage(error.message);
        } finally {
            setButtonLoading(submitBtn, false);
        }
    }
    
    // Validation functions
    function validateLoginForm(email, password) {
        let isValid = true;
        
        const emailInput = document.querySelector('#loginFormElement input[name="email"]');
        const passwordInput = document.querySelector('#loginFormElement input[name="password"]');
        
        if (!email || !validateEmail(email)) {
            showFieldError(emailInput, 'Veuillez entrer un email valide');
            isValid = false;
        } else {
            showFieldSuccess(emailInput);
        }
        
        if (!password || password.length < 6) {
            showFieldError(passwordInput, 'Le mot de passe doit contenir au moins 6 caractères');
            isValid = false;
        } else {
            showFieldSuccess(passwordInput);
        }
        
        return isValid;
    }
    
    function validateRegisterForm(userData) {
        let isValid = true;
        
        const fields = {
            firstName: document.querySelector('#registerFormElement input[name="firstName"]'),
            lastName: document.querySelector('#registerFormElement input[name="lastName"]'),
            email: document.querySelector('#registerFormElement input[name="email"]'),
            phone: document.querySelector('#registerFormElement input[name="phone"]'),
            password: document.querySelector('#registerFormElement input[name="password"]'),
            confirmPassword: document.querySelector('#registerFormElement input[name="confirmPassword"]')
        };
        
        // First name validation
        if (!userData.firstName || userData.firstName.length < 2) {
            showFieldError(fields.firstName, 'Le prénom doit contenir au moins 2 caractères');
            isValid = false;
        } else {
            showFieldSuccess(fields.firstName);
        }
        
        // Last name validation
        if (!userData.lastName || userData.lastName.length < 2) {
            showFieldError(fields.lastName, 'Le nom doit contenir au moins 2 caractères');
            isValid = false;
        } else {
            showFieldSuccess(fields.lastName);
        }
        
        // Email validation
        if (!userData.email || !validateEmail(userData.email)) {
            showFieldError(fields.email, 'Veuillez entrer un email valide');
            isValid = false;
        } else {
            showFieldSuccess(fields.email);
        }
        
        // Phone validation
        if (!userData.phone || !validatePhone(userData.phone)) {
            showFieldError(fields.phone, 'Veuillez entrer un numéro de téléphone valide');
            isValid = false;
        } else {
            showFieldSuccess(fields.phone);
        }
        
        // Password validation
        const passwordStrength = checkPasswordStrength(userData.password);
        if (!userData.password || passwordStrength.score < 2) {
            showFieldError(fields.password, 'Le mot de passe doit être plus fort');
            isValid = false;
        } else {
            showFieldSuccess(fields.password);
        }
        
        // Confirm password validation
        if (userData.password !== userData.confirmPassword) {
            showFieldError(fields.confirmPassword, 'Les mots de passe ne correspondent pas');
            isValid = false;
        } else {
            showFieldSuccess(fields.confirmPassword);
        }
        
        // Terms acceptance
        const termsCheckbox = document.getElementById('acceptTerms');
        if (!termsCheckbox.checked) {
            showErrorMessage('Vous devez accepter les conditions d\'utilisation');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Password strength checker
    function setupPasswordStrength() {
        const passwordInput = document.querySelector('#registerFormElement input[name="password"]');
        const strengthIndicator = document.querySelector('.password-strength');
        
        passwordInput?.addEventListener('input', function() {
            const strength = checkPasswordStrength(this.value);
            updatePasswordStrengthUI(strengthIndicator, strength);
        });
    }
    
    function checkPasswordStrength(password) {
        let score = 0;
        let feedback = [];
        
        if (password.length >= 8) score++;
        else feedback.push('Au moins 8 caractères');
        
        if (/[a-z]/.test(password)) score++;
        else feedback.push('Une lettre minuscule');
        
        if (/[A-Z]/.test(password)) score++;
        else feedback.push('Une lettre majuscule');
        
        if (/[0-9]/.test(password)) score++;
        else feedback.push('Un chiffre');
        
        if (/[^A-Za-z0-9]/.test(password)) score++;
        else feedback.push('Un caractère spécial');
        
        const levels = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'];
        
        return {
            score,
            level: levels[score] || 'Très faible',
            feedback
        };
    }
    
    function updatePasswordStrengthUI(container, strength) {
        const progressBar = container.querySelector('.progress-bar');
        const text = container.querySelector('small');
        
        // Remove existing classes
        container.className = 'password-strength mt-2';
        
        // Add strength class
        const strengthClasses = ['password-weak', 'password-weak', 'password-medium', 'password-strong', 'password-very-strong'];
        if (strengthClasses[strength.score]) {
            container.classList.add(strengthClasses[strength.score]);
        }
        
        // Update text
        text.textContent = `Force: ${strength.level}`;
        
        // Update progress bar
        const percentage = (strength.score / 5) * 100;
        progressBar.style.width = `${percentage}%`;
    }
    
    // UI Helper functions
    function showFieldError(field, message) {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
        
        // Remove existing feedback
        const existingFeedback = field.parentNode.parentNode.querySelector('.invalid-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
        
        // Add error message
        const feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        feedback.textContent = message;
        field.parentNode.parentNode.appendChild(feedback);
    }
    
    function showFieldSuccess(field) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        
        // Remove error message
        const existingFeedback = field.parentNode.parentNode.querySelector('.invalid-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
    }
    
    function clearFormErrors() {
        document.querySelectorAll('.is-invalid, .is-valid').forEach(field => {
            field.classList.remove('is-invalid', 'is-valid');
        });
        
        document.querySelectorAll('.invalid-feedback, .valid-feedback').forEach(feedback => {
            feedback.remove();
        });
        
        document.querySelectorAll('.error-message, .success-message').forEach(message => {
            message.remove();
        });
    }
    
    function showErrorMessage(message) {
        clearMessages();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            ${message}
        `;
        
        const activeForm = document.querySelector('.auth-form:not(.d-none)');
        activeForm.insertBefore(errorDiv, activeForm.firstChild);
    }
    
    function showSuccessMessage(message) {
        clearMessages();
        
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            ${message}
        `;
        
        const activeForm = document.querySelector('.auth-form:not(.d-none)');
        activeForm.insertBefore(successDiv, activeForm.firstChild);
    }
    
    function clearMessages() {
        document.querySelectorAll('.error-message, .success-message').forEach(message => {
            message.remove();
        });
    }
    
    function setButtonLoading(button, loading) {
        if (loading) {
            button.classList.add('btn-loading');
            button.disabled = true;
        } else {
            button.classList.remove('btn-loading');
            button.disabled = false;
        }
    }
    
    // Simulation functions (replace with real API calls)
    async function simulateLogin(email, password, rememberMe) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Check demo credentials
                if (email === 'demo@groomgo.tn' && password === 'demo123') {
                    const userData = {
                        id: 1,
                        email: email,
                        firstName: 'Demo',
                        lastName: 'User',
                        phone: '+216 XX XXX XXX'
                    };
                    
                    // Save to localStorage
                    saveToLocalStorage('user', userData);
                    if (rememberMe) {
                        saveToLocalStorage('rememberMe', true);
                    }
                    
                    resolve(userData);
                } else {
                    reject(new Error('Email ou mot de passe incorrect'));
                }
            }, 1500);
        });
    }
    
    async function simulateRegister(userData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Check if email already exists (simulation)
                if (userData.email === 'existing@example.com') {
                    reject(new Error('Cet email est déjà utilisé'));
                } else {
                    resolve({ message: 'Compte créé avec succès' });
                }
            }, 2000);
        });
    }
    
    async function simulateForgotPassword(email) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ message: 'Email envoyé' });
            }, 1500);
        });
    }
    
    // Check authentication state
    function checkAuthState() {
        const user = getFromLocalStorage('user');
        if (user && window.location.pathname.includes('login.html')) {
            // User is already logged in, redirect to dashboard
            window.location.href = 'dashboard.html';
        }
    }
});
