document.addEventListener('DOMContentLoaded', () => {
    const manualCard = document.getElementById('manualCard');
    const manualCardContent = document.getElementById('manualCardContent');
    const manualForm = document.getElementById('manualForm');
    const inputManualData = document.getElementById('inputManualData');
    const btnConfirmarManual = document.getElementById('btnConfirmarManual');

    if (manualCardContent && manualForm && inputManualData) {
        manualCardContent.addEventListener('click', () => {
            manualCardContent.classList.add('app-hidden');
            manualForm.classList.remove('app-hidden');
            
            const hoje = new Date();
            const ano = hoje.getFullYear();
            const mes = String(hoje.getMonth() + 1).padStart(2, '0');
            const dia = String(hoje.getDate()).padStart(2, '0');
            inputManualData.value = `${ano}-${mes}-${dia}`;
        });

        btnConfirmarManual.addEventListener('click', (e) => {
            e.stopPropagation();
            const dataEscolhida = inputManualData.value;
            if (!dataEscolhida) return;

            const partesData = dataEscolhida.split('-');
            const dataFormatada = `${partesData[2]}/${partesData[1]}/${partesData[0]}`;

            if (typeof state !== 'undefined') {
                state.dataArquivo = dataFormatada;
                state.pacientes = [];
            }

            document.getElementById('headerDataArquivo').innerText = dataFormatada;

            const dropZone = document.getElementById('dropZone');
            const leftPanel = document.getElementById('leftPanel');
            const painelAcoes = document.getElementById('painelAcoes');
            const contentArea = document.getElementById('contentArea');
            const appContainer = document.getElementById('appContainer');

            dropZone.classList.add('app-hidden');
            manualCard.classList.add('app-hidden');

            appContainer.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            appContainer.style.opacity = '0';
            appContainer.style.transform = 'scale(0.98)';

            setTimeout(() => {
                leftPanel.classList.add('active');
                appContainer.classList.add('active-layout');
                
                painelAcoes.classList.remove('app-hidden');
                painelAcoes.style.opacity = '1';
                painelAcoes.style.transform = 'translateY(0)';
                
                contentArea.classList.add('active');
                document.getElementById('headerCenterArea').classList.add('active');

                if (typeof window.hasDocument !== 'undefined') {
                    window.hasDocument = true;
                }

                if (typeof window.renderizarLista === 'function') {
                    window.renderizarLista();
                } else if (typeof atualizarContador === 'function') {
                    atualizarContador();
                }

                requestAnimationFrame(() => {
                    appContainer.style.opacity = '1';
                    appContainer.style.transform = 'scale(1)';
                    setTimeout(() => {
                        appContainer.style.transition = ''; 
                    }, 600);
                });
            }, 300);
        });
    }

    const contentArea = document.getElementById('contentArea');
    if (contentArea) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.classList && node.classList.contains('card')) {
                            adicionarBotaoExcluir(node);
                        } else if (node.querySelectorAll) {
                            const cards = node.querySelectorAll('.card');
                            cards.forEach(adicionarBotaoExcluir);
                        }
                    });
                }
            });
        });

        observer.observe(contentArea, { childList: true, subtree: true });

        function adicionarBotaoExcluir(cardNode) {
            if (cardNode.querySelector('.btn-deletar-paciente')) return;

            const nomeEditarContainer = cardNode.querySelector('.nome-e-editar');
            if (nomeEditarContainer) {
                const btnExcluir = document.createElement('button');
                btnExcluir.className = 'btn-deletar-paciente';
                btnExcluir.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>';
                btnExcluir.title = 'Excluir Paciente';
                
                btnExcluir.addEventListener('click', () => {
                    cardNode.classList.add('removing');
                    
                    setTimeout(() => {
                        let pacienteId = cardNode.getAttribute('data-id');
                        if (pacienteId) {
                            pacienteId = parseInt(pacienteId);
                        } else {
                            const btnAcao = cardNode.querySelector('[onclick*="alterar"]');
                            if (btnAcao) {
                                const match = btnAcao.getAttribute('onclick').match(/alterar\w*\((\d+)/);
                                if (match) pacienteId = parseInt(match[1]);
                            }
                        }

                        if (pacienteId !== null && typeof state !== 'undefined') {
                            state.pacientes = state.pacientes.filter(p => p.id !== pacienteId);
                        }

                        if (typeof window.renderizarLista === 'function') {
                            window.renderizarLista();
                        } else {
                            cardNode.remove();
                            if (typeof atualizarContador === 'function') atualizarContador();
                        }
                    }, 400); 
                });

                nomeEditarContainer.appendChild(btnExcluir);
            }
        }
    }
    
    const btnConfirmarExclusao = document.getElementById('btnConfirmarExclusao');
    if (btnConfirmarExclusao) {
        btnConfirmarExclusao.addEventListener('click', () => {
            setTimeout(() => {
                const manualCard = document.getElementById('manualCard');
                const manualCardContent = document.getElementById('manualCardContent');
                const manualForm = document.getElementById('manualForm');
                
                if (manualCard) {
                    manualCard.classList.remove('app-hidden');
                    manualCard.style.opacity = '1';
                    manualCard.style.transform = 'translateY(0)';
                    manualCard.style.pointerEvents = 'auto';
                    if (manualCardContent) manualCardContent.classList.remove('app-hidden');
                    if (manualForm) manualForm.classList.add('app-hidden');
                }
            }, 500);
        });
    }
});