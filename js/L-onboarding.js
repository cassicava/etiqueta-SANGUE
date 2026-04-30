const onboardingData = [
    { icone: '✨', titulo: 'Bem-vindo ao Sistema!', texto: 'Vamos fazer um tour rápido pelas ferramentas principais do cabeçalho.' },
    { icone: '☀️', titulo: 'Modo Claro / Escuro', texto: 'Alterne as cores da tela para o que for mais confortável para os seus olhos durante o plantão.' },
    { icone: '🧪', titulo: 'Filtro de Tubos', texto: 'Ative apenas os tubos que sua unidade usa. O sistema oculta o resto para limpar a sua tela.' },
    { icone: '⚙️', titulo: 'Configuração de Folha', texto: 'Configure as margens e os tamanhos exatos da sua folha física para um encaixe de impressão perfeito.' },
    { icone: '💡', titulo: 'Dúvidas Rápidas', texto: 'Esqueceu como ajustar a impressora? As Dicas e os Termos de Uso (⚖️) estão sempre aqui para ajudar.' },
    { icone: '⏻', titulo: 'Segurança', texto: 'O sistema desloga sozinho após inatividade, mas você sempre pode encerrar a sessão manualmente aqui.' },
    { icone: '🚀', titulo: 'Tudo Pronto!', texto: 'Nenhuma informação médica é salva em banco de dados. Tudo funciona direto no seu PC.' }
];

let onboardingCurrentStep = 0;
let onboardingTimer;
const ONBOARDING_DURATION = 5000;

function iniciarOnboardingSeNecessario() {
    if (!localStorage.getItem('sangue_tutorial_visto')) {
        document.getElementById('onboardingOverlay').classList.add('active');
        renderOnboarding();
    }
}

function atualizarConteudoVisuais() {
    const data = onboardingData[onboardingCurrentStep];
    
    document.getElementById('onboardingIcon').innerText = data.icone;
    document.getElementById('onboardingTitle').innerText = data.titulo;
    document.getElementById('onboardingText').innerText = data.texto;

    const progressContainer = document.getElementById('onboardingProgressContainer');
    progressContainer.innerHTML = '';
    
    for (let i = 0; i < onboardingData.length; i++) {
        const bar = document.createElement('div');
        bar.className = 'onboarding-progress-bar';
        if (i < onboardingCurrentStep) bar.classList.add('completed');
        else if (i === onboardingCurrentStep) {
            bar.classList.add('active');
        }
        
        const fill = document.createElement('div');
        fill.className = 'onboarding-progress-fill';
        bar.appendChild(fill);
        progressContainer.appendChild(bar);
    }

    const btnStart = document.getElementById('btnOnboardingStart');
    
    clearTimeout(onboardingTimer);

    if (onboardingCurrentStep < onboardingData.length - 1) {
        btnStart.classList.remove('visible');
        
        requestAnimationFrame(() => {
            const activeBar = document.querySelector('.onboarding-progress-bar.active .onboarding-progress-fill');
            if(activeBar) {
                activeBar.style.width = '0%';
                requestAnimationFrame(() => {
                    activeBar.style.width = '100%';
                });
            }
        });

        onboardingTimer = setTimeout(() => {
            transicaoProximaDica();
        }, ONBOARDING_DURATION);
    } else {
        btnStart.classList.add('visible');
    }
}

function transicaoProximaDica() {
    const icon = document.getElementById('onboardingIcon');
    const title = document.getElementById('onboardingTitle');
    const text = document.getElementById('onboardingText');
    
    icon.classList.add('onboarding-fade-out');
    title.classList.add('onboarding-fade-out');
    text.classList.add('onboarding-fade-out');
    
    setTimeout(() => {
        onboardingCurrentStep++;
        atualizarConteudoVisuais();
        
        icon.classList.remove('onboarding-fade-out');
        title.classList.remove('onboarding-fade-out');
        text.classList.remove('onboarding-fade-out');
    }, 300);
}

function renderOnboarding() {
    atualizarConteudoVisuais();
}

document.getElementById('btnOnboardingStart').addEventListener('click', () => {
    localStorage.setItem('sangue_tutorial_visto', 'true');
    document.getElementById('onboardingOverlay').classList.remove('active');
});