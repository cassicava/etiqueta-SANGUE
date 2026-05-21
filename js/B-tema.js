function initConfig() {
    const savedTheme = localStorage.getItem('themeSangue');
    
    if (savedTheme === 'light') {
        document.documentElement.removeAttribute('data-theme');
        if (typeof btnTheme !== 'undefined' && btnTheme) {
            btnTheme.innerText = '☀️ Alternar Tema';
        }
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (typeof btnTheme !== 'undefined' && btnTheme) {
            btnTheme.innerText = '🌙 Alternar Tema';
        }
    }
}

initConfig();

if (typeof btnTheme !== 'undefined' && btnTheme) {
    btnTheme.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('themeSangue', 'light');
            btnTheme.innerText = '☀️ Alternar Tema';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('themeSangue', 'dark');
            btnTheme.innerText = '🌙 Alternar Tema';
        }
    });
}