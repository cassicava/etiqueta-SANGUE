function initConfig() {
    const savedTheme = localStorage.getItem('themeSangue');
    if (savedTheme === 'light') {
        document.documentElement.removeAttribute('data-theme');
        btnTheme.innerText = '☀️';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        btnTheme.innerText = '🌙';
    }
}

initConfig();

btnTheme.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('themeSangue', 'light');
        btnTheme.innerText = '☀️';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('themeSangue', 'dark');
        btnTheme.innerText = '🌙';
    }
});