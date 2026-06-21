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
    
    let htmlPrincipal = '<div class="tubos-section-title">Rotina Principal</div><div class="tubos-grid-large">';
    let htmlOutros = '<div class="tubos-section-title" style="margin-top: 15px;">Outros</div><div class="tubos-grid-large">';

    tubosConfig.forEach(t => {
        const ativo = tubosAtivos.includes(t.id);
        
        const htmlCard = `
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
                    <div class="tubo-info-base">
                        <span class="tubo-desc">${t.desc}</span>
                        <div class="tubo-tooltip-container">
                            <button class="btn-info-tubo" onclick="fecharTodosBaloes(); const b = this.nextElementSibling; b.classList.toggle('mostrar'); if(b.classList.contains('mostrar')){ this.closest('.tubo-card-large').style.zIndex = '100'; } event.stopPropagation();">i</button>
                            <div class="balao-esqueci balao-tubo" onclick="event.stopPropagation();">
                                <strong>Exames:</strong><br>${t.exames}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        if (t.grupo === 'principal') {
            htmlPrincipal += htmlCard;
        } else {
            htmlOutros += htmlCard;
        }
    });

    htmlPrincipal += '</div>';
    htmlOutros += '</div>';

    container.innerHTML = htmlPrincipal + htmlOutros;

    tubosConfig.forEach(t => {
        const toggle = document.getElementById(`toggle-${t.id}`);
        if (toggle) {
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
        }
    });
}

window.fecharTodosBaloes = function() {
    document.querySelectorAll('.balao-tubo.mostrar').forEach(b => {
        b.classList.remove('mostrar');
        const card = b.closest('.tubo-card-large');
        if(card) card.style.zIndex = '1';
    });
};

document.addEventListener('click', () => {
    if(typeof fecharTodosBaloes === 'function') fecharTodosBaloes();
});

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

    btnFecharConfigTubos.addEventListener('click', () => {
        const textoOriginal = btnFecharConfigTubos.innerText;
        btnFecharConfigTubos.innerText = 'Salvo! ✔️';
        btnFecharConfigTubos.classList.add('salvo-sucesso');

        setTimeout(() => {
            btnFecharConfigTubos.innerText = textoOriginal;
            btnFecharConfigTubos.classList.remove('salvo-sucesso');
            fecharModalTubos();
        }, 800);
    });

    configTubosOverlay.addEventListener('click', (e) => {
        if (e.target === configTubosOverlay) fecharModalTubos();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    atualizarVisibilidadePainelLateral();
});