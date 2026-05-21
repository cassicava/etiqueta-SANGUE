(function() {
    const loginWrapper = document.getElementById('loginWrapper');
    const appContainer = document.getElementById('appContainer');
    const btnEntrar = document.getElementById('btnEntrar');
    const loginCard = document.querySelector('.login-card');
    const inputUsuario = document.getElementById('inputUsuario');
    const inputSenha = document.getElementById('inputSenha');
    const btnTermos = document.getElementById('btnTermos');
    const termosOverlay = document.getElementById('termosOverlay');
    const btnFecharTermos = document.getElementById('btnFecharTermos');
    const headerActions = document.getElementById('headerActions'); 
    const btnSair = document.getElementById('btnSair');
    const btnEsqueci = document.getElementById('btnEsqueci');
    const balaoEsqueci = document.getElementById('balaoEsqueci');
    const btnDicas = document.getElementById('btnDicas');
    const dicasOverlay = document.getElementById('dicasOverlay');
    const btnFecharDicas = document.getElementById('btnFecharDicas');
    const btnPerfil = document.getElementById('btnPerfil');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const perfilNome = document.getElementById('perfilNome');
    const perfilEmoji = document.getElementById('perfilEmoji');
    const welcomeMsg = document.getElementById('welcomeMsg');
    const appHeader = document.getElementById('appHeader');

    const TEMPO_SESSAO_MINUTOS = 10;
    const now = Date.now();
    const sessaoExpiraEm = localStorage.getItem('lf_sessao_expira_sangue');

    if (sessaoExpiraEm && now < parseInt(sessaoExpiraEm)) {
        localStorage.setItem('lf_sessao_expira_sangue', now + (TEMPO_SESSAO_MINUTOS * 60 * 1000));
        const generoSalvo = localStorage.getItem('lf_genero_usuario') || 'M';
        const nomeSalvo = localStorage.getItem('lf_nome_usuario') || 'Usuário';
        
        welcomeMsg.innerText = generoSalvo === 'F' ? 'Bem-vinda! ✨' : 'Bem-vindo! ✨';
        if (perfilNome) perfilNome.innerText = nomeSalvo.charAt(0).toUpperCase() + nomeSalvo.slice(1);
        if (perfilEmoji) perfilEmoji.innerText = generoSalvo === 'F' ? '👩' : '👨';

        appHeader.style.transition = 'none';
        headerActions.style.transition = 'none'; 
        appHeader.classList.add('move-top', 'header-ready', 'logged-in');
        headerActions.classList.add('visible'); 
        loginWrapper.style.display = 'none';
        appContainer.classList.remove('app-hidden');

        if (typeof iniciarOnboardingSeNecessario === 'function') {
            iniciarOnboardingSeNecessario();
        }

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                appHeader.style.transition = '';
                headerActions.style.transition = '';
            });
        });
    } else {
        setTimeout(() => {
            appHeader.classList.add('move-top');
            setTimeout(() => {
                appHeader.classList.add('header-ready'); 
                headerActions.classList.add('visible'); 
                loginWrapper.classList.add('visible');
            }, 1200); 
            
        }, 500); 
    }

    const inputsLogin = loginWrapper.querySelectorAll('input');
    inputsLogin.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); 
                btnEntrar.click();
            }
        });
    });

    btnEntrar.addEventListener('click', (e) => {
        e.preventDefault();
        const userDigitado = inputUsuario.value.trim().toLowerCase();
        const senhaDigitada = inputSenha.value.trim();

        const usuarioValido = typeof usuariosHabilitados !== 'undefined' ? usuariosHabilitados.find(
            u => u.usuario === userDigitado && u.senha === senhaDigitada
        ) : null;

        const senhaTem6Digitos = senhaDigitada.length === 6;

        if (usuarioValido && senhaTem6Digitos) {
            localStorage.setItem('lf_sessao_expira_sangue', Date.now() + (TEMPO_SESSAO_MINUTOS * 60 * 1000));
            localStorage.setItem('lf_genero_usuario', usuarioValido.genero);
            localStorage.setItem('lf_nome_usuario', usuarioValido.usuario);

            welcomeMsg.innerText = usuarioValido.genero === 'F' ? 'Bem-vinda! ✨' : 'Bem-vindo! ✨';
            if (perfilNome) perfilNome.innerText = usuarioValido.usuario.charAt(0).toUpperCase() + usuarioValido.usuario.slice(1);
            if (perfilEmoji) perfilEmoji.innerText = usuarioValido.genero === 'F' ? '👩' : '👨';

            loginWrapper.style.opacity = '0';
            loginWrapper.style.pointerEvents = 'none';
            
            setTimeout(() => {
                loginWrapper.style.display = 'none';
                appHeader.classList.add('logged-in'); 
                
                setTimeout(() => {
                    welcomeMsg.classList.add('show');
                    setTimeout(() => {
                        welcomeMsg.classList.remove('show');
                    }, 2500); 
                }, 800);

                appContainer.classList.remove('app-hidden');

                if (typeof iniciarOnboardingSeNecessario === 'function') {
                    iniciarOnboardingSeNecessario();
                }

            }, 600);
        } else {
            loginCard.classList.remove('login-error');
            void loginCard.offsetWidth; 
            loginCard.classList.add('login-error');
        }
    });

    if (btnEsqueci && balaoEsqueci) {
        btnEsqueci.addEventListener('click', (e) => {
            e.preventDefault();
            balaoEsqueci.classList.toggle('mostrar');
            if (balaoEsqueci.classList.contains('mostrar')) {
                setTimeout(() => {
                    balaoEsqueci.classList.remove('mostrar');
                }, 6000);
            }
        });
    }

    if (btnSair) {
        btnSair.addEventListener('click', () => {
            localStorage.removeItem('lf_sessao_expira_sangue');
            localStorage.removeItem('lf_genero_usuario');
            localStorage.removeItem('lf_nome_usuario');
            
            appContainer.classList.add('app-hidden');
            if (typeof resetarInterface === 'function') resetarInterface();

            appHeader.classList.remove('logged-in'); 

            setTimeout(() => {
                loginWrapper.style.display = 'flex';
                void loginWrapper.offsetWidth; 
                loginWrapper.style.opacity = '1';
                loginWrapper.style.pointerEvents = 'auto';
                inputSenha.value = ''; 
            }, 600); 
        });
    }

    if (btnTermos) {
        btnTermos.addEventListener('click', () => {
            termosOverlay.classList.add('open');
        });
    }

    if (btnFecharTermos) {
        btnFecharTermos.addEventListener('click', () => {
            termosOverlay.classList.remove('open');
        });
    }

    if (termosOverlay) {
        termosOverlay.addEventListener('click', (e) => {
            if (e.target === termosOverlay) termosOverlay.classList.remove('open');
        });
    }

    if (btnDicas && dicasOverlay && btnFecharDicas) {
        btnDicas.addEventListener('click', () => {
            dicasOverlay.classList.add('open');
        });

        btnFecharDicas.addEventListener('click', () => {
            dicasOverlay.classList.remove('open');
        });

        dicasOverlay.addEventListener('click', (e) => {
            if (e.target === dicasOverlay) dicasOverlay.classList.remove('open');
        });
    }

    if (btnPerfil && dropdownMenu) {
        btnPerfil.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!dropdownMenu.contains(e.target) && !btnPerfil.contains(e.target)) {
                dropdownMenu.classList.remove('open');
            }
        });

        const dropdownItems = dropdownMenu.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', () => {
                dropdownMenu.classList.remove('open');
            });
        });
    }
})();