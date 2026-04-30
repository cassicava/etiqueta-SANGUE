function atualizarVisibilidadePainelLateral() {
    tubosConfig.forEach(t => {
        const item = document.getElementById(`painel-tubo-${t.id}`);
        if (item) {
            if (tubosAtivos.includes(t.id)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        }
    });
    atualizarContador();
}

function renderizarModalTubos() {
    const container = document.getElementById('listaTubosConfig');
    if (!container) return;
    
    container.innerHTML = '';
    
    tubosConfig.forEach(t => {
        const ativo = tubosAtivos.includes(t.id);
        
        const html = `
            <div class="tubo-card-large" id="card-config-${t.id}">
                <div class="tubo-card-header">
                    <div class="tubo-card-title">
                        <span>${t.icone}</span>
                        <span>${t.nome}</span>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="toggle-${t.id}" ${ativo ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div class="tubo-card-body">
                    <div class="tubo-desc">${t.desc}</div>
                    <div class="tubo-exames">
                        <strong>Exames Comuns:</strong>
                        ${t.exames}
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += html;
    });

    tubosConfig.forEach(t => {
        const toggle = document.getElementById(`toggle-${t.id}`);
        
        toggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                if (!tubosAtivos.includes(t.id)) tubosAtivos.push(t.id);
            } else {
                tubosAtivos = tubosAtivos.filter(id => id !== t.id);
            }
            localStorage.setItem('sangue_tubos_ativos', JSON.stringify(tubosAtivos));
            
            if (state.pacientes.length > 0) {
                renderizarLista();
            }
            atualizarVisibilidadePainelLateral();
        });
    });
}

function fecharModalTubos() {
    configTubosOverlay.classList.add('hiding');
    setTimeout(() => {
        configTubosOverlay.classList.add('app-hidden');
        configTubosOverlay.classList.remove('hiding');
    }, 500); 
}

if (btnConfigTubos && configTubosOverlay && btnFecharConfigTubos) {
    btnConfigTubos.addEventListener('click', () => {
        renderizarModalTubos();
        configTubosOverlay.classList.remove('app-hidden');
    });

    btnFecharConfigTubos.addEventListener('click', fecharModalTubos);

    configTubosOverlay.addEventListener('click', (e) => {
        if (e.target === configTubosOverlay) fecharModalTubos();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    atualizarVisibilidadePainelLateral();
});