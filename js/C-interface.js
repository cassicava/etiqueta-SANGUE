function atualizarContador() {
    let tAmarelo = 0, tRoxo = 0, tCinza = 0, tAzul = 0, tFrasco = 0;
    
    state.pacientes.forEach(p => {
        tAmarelo += p.amarelo;
        tRoxo += p.roxo;
        tCinza += p.cinza;
        tAzul += p.azul;
        tFrasco += p.frasco;
    });
    
    document.getElementById('total-amarelo').innerText = tAmarelo;
    document.getElementById('total-roxo').innerText = tRoxo;
    document.getElementById('total-cinza').innerText = tCinza;
    document.getElementById('total-azul').innerText = tAzul;
    document.getElementById('total-frasco').innerText = tFrasco;
    
    const total = tAmarelo + tRoxo + tCinza + tAzul + tFrasco;
    contadorTotal.innerText = `Total: ${total}`;
}

window.alterarQuantidade = function(id, tipo, delta) {
    const paciente = state.pacientes.find(p => p.id === id);
    if (!paciente) return;
    
    const novoValor = paciente[tipo] + delta;
    if (novoValor >= 0 && novoValor <= 99) {
        paciente[tipo] = novoValor;
        document.getElementById(`valor-${tipo}-${id}`).innerText = novoValor;
        atualizarContador();
    }
}

window.alterarTodos = function(tipo, delta) {
    let alterouAlgo = false;
    state.pacientes.forEach(p => {
        const novoValor = p[tipo] + delta;
        if (novoValor >= 0 && novoValor <= 99) {
            p[tipo] = novoValor;
            const el = document.getElementById(`valor-${tipo}-${p.id}`);
            if (el) el.innerText = novoValor;
            alterouAlgo = true;
        }
    });
    if (alterouAlgo) atualizarContador();
}

function mostrarInfoArquivo() {
    aplicarFadeTextos(() => {
        dropZone.classList.remove('processing');
        dropZone.classList.add('success');
        dropTitle.innerHTML = `<span style="font-size: 4rem;">✅</span>`;
        dropSubtitle.style.display = 'none';
    });

    document.getElementById('resumoPacientes').innerText = `Pacientes: ${state.pacientes.length}`;

    setTimeout(() => {
        appContainer.style.transition = 'opacity 0.4s ease';
        appContainer.style.opacity = '0';
        
        setTimeout(() => {
            dropZone.classList.add('app-hidden');
            dropZone.classList.remove('success'); 
            
            appContainer.classList.add('active-layout');
            leftPanel.classList.add('active');
            
            document.getElementById('headerDataArquivo').innerText = state.dataArquivo;
            document.getElementById('headerCenterArea').classList.add('active');
            
            painelAcoes.classList.remove('app-hidden');
            
            document.getElementById('rightPanel').classList.add('active');
            
            if (ordemAtual === 'alfabetica') {
                state.pacientes.sort((a, b) => a.nome.localeCompare(b.nome));
            }
            
            renderizarLista(true);
            
            painelAcoes.style.opacity = '1';
            painelAcoes.style.transform = 'translateY(0)';
            
            requestAnimationFrame(() => {
                appContainer.style.opacity = '1';
                setTimeout(() => {
                    appContainer.style.transition = ''; 
                }, 400);
            });
        }, 400); 
    }, 1000); 
}

function gerarHTMLCardPaciente(item) {
    return `
        <div class="card-name" title="${item.nome}">
            ${item.nome} <span class="patient-dob">${item.dataNascimento}</span>
        </div>
        <div class="seletores-container">
            <div class="seletor amarelo">
                <button onclick="alterarQuantidade(${item.id}, 'amarelo', -1)">-</button>
                <span class="valor" id="valor-amarelo-${item.id}">${item.amarelo}</span>
                <button onclick="alterarQuantidade(${item.id}, 'amarelo', 1)">+</button>
            </div>
            <div class="seletor roxo">
                <button onclick="alterarQuantidade(${item.id}, 'roxo', -1)">-</button>
                <span class="valor" id="valor-roxo-${item.id}">${item.roxo}</span>
                <button onclick="alterarQuantidade(${item.id}, 'roxo', 1)">+</button>
            </div>
            <div class="seletor cinza">
                <button onclick="alterarQuantidade(${item.id}, 'cinza', -1)">-</button>
                <span class="valor" id="valor-cinza-${item.id}">${item.cinza}</span>
                <button onclick="alterarQuantidade(${item.id}, 'cinza', 1)">+</button>
            </div>
            <div class="seletor azul">
                <button onclick="alterarQuantidade(${item.id}, 'azul', -1)">-</button>
                <span class="valor" id="valor-azul-${item.id}">${item.azul}</span>
                <button onclick="alterarQuantidade(${item.id}, 'azul', 1)">+</button>
            </div>
            <div class="seletor frasco">
                <button onclick="alterarQuantidade(${item.id}, 'frasco', -1)">-</button>
                <span class="valor" id="valor-frasco-${item.id}">${item.frasco}</span>
                <button onclick="alterarQuantidade(${item.id}, 'frasco', 1)">+</button>
            </div>
        </div>
    `;
}

function renderizarLista(animar = true) {
    contentArea.innerHTML = '';
    
    document.getElementById('legendaContainer').innerHTML = `
        <div class="legenda-fixa">
            <div class="novo-paciente-container">
                <button id="btnAbrirFormNovo" class="btn-novo-paciente" onclick="mostrarFormularioNovoPaciente()">➕ Novo Paciente</button>
                <div id="formNovoPaciente" class="form-novo-paciente-inline">
                    <input type="text" id="novoNome" class="input-novo" placeholder="Nome do paciente" maxlength="40" autocomplete="off" style="flex-grow: 1;">
                    <input type="text" id="novaData" class="input-novo" placeholder="DD/MM/AAAA" maxlength="10" oninput="mascaraData(this)" autocomplete="off" style="width: 150px; text-align: center;">
                    <div class="form-actions">
                        <button class="btn-action btn-cancelar" onclick="cancelarNovoPaciente()" title="Cancelar">✖</button>
                        <button class="btn-action btn-salvar" onclick="salvarNovoPaciente()" title="Salvar">✔</button>
                    </div>
                </div>
            </div>
            <div class="seletores-container">
                <div class="leg-item">🟡 Ama/Ver</div>
                <div class="leg-item">🟣 Roxo</div>
                <div class="leg-item">⚪ Cinza</div>
                <div class="leg-item">🔵 Azul</div>
                <div class="leg-item">🧪 Frasco</div>
            </div>
        </div>
        <div class="legenda-linha"></div>
    `;

    let lastLetter = '';
    let visualIndex = 0;

    state.pacientes.forEach(item => {
        if (ordemAtual === 'alfabetica') {
            const currentLetter = item.nome.trim().charAt(0).toUpperCase();
            if (currentLetter !== lastLetter) {
                const divider = document.createElement('div');
                divider.className = 'alphabet-divider';
                divider.style.animationDelay = animar ? `${visualIndex * 0.02}s` : '0s';
                divider.innerHTML = `<span>${currentLetter}</span>`;
                contentArea.appendChild(divider);
                lastLetter = currentLetter;
                visualIndex++;
            }
        }

        const card = document.createElement('div');
        card.className = 'card';
        card.style.animationDelay = animar ? `${visualIndex * 0.02}s` : '0s';
        card.id = `paciente-${item.id}`;
        card.innerHTML = gerarHTMLCardPaciente(item);
        contentArea.appendChild(card);
        
        visualIndex++;
    });

    atualizarContador();
}

window.mascaraData = function(input) {
    let v = input.value.replace(/\D/g,'');
    if (v.length > 8) v = v.slice(0, 8);
    if (v.length >= 5) {
        v = v.replace(/(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3');
    } else if (v.length >= 3) {
        v = v.replace(/(\d{2})(\d{1,2})/, '$1/$2');
    }
    input.value = v;
}

function isDataValida(dataStr) {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dataStr)) return false;
    const partes = dataStr.split('/');
    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10);
    const ano = parseInt(partes[2], 10);
    
    const anoAtual = new Date().getFullYear();
    if (ano < 1900 || ano > anoAtual) return false;
    if (mes < 1 || mes > 12) return false;
    
    const diasNoMes = new Date(ano, mes, 0).getDate();
    if (dia < 1 || dia > diasNoMes) return false;
    
    return true;
}

window.mostrarFormularioNovoPaciente = function() {
    const btn = document.getElementById('btnAbrirFormNovo');
    const form = document.getElementById('formNovoPaciente');
    
    if(btn) btn.classList.add('hide');
    if(form) form.classList.add('open');

    setTimeout(() => {
        const nomeInput = document.getElementById('novoNome');
        if(nomeInput) nomeInput.focus();
    }, 150);

    const nomeInput = document.getElementById('novoNome');
    const dataInput = document.getElementById('novaData');

    if(nomeInput) {
        nomeInput.addEventListener('keydown', (e) => {
            if(e.key === 'Enter') dataInput.focus();
            if(e.key === 'Escape') cancelarNovoPaciente();
        });
    }
    
    if(dataInput) {
        dataInput.addEventListener('keydown', (e) => {
            if(e.key === 'Enter') salvarNovoPaciente();
            if(e.key === 'Escape') cancelarNovoPaciente();
        });
    }
}

window.cancelarNovoPaciente = function() {
    const form = document.getElementById('formNovoPaciente');
    const btn = document.getElementById('btnAbrirFormNovo');
    const nome = document.getElementById('novoNome');
    const data = document.getElementById('novaData');

    if(form) form.classList.remove('open');
    if(btn) btn.classList.remove('hide');
    if(nome) nome.value = '';
    if(data) data.value = '';
}

window.salvarNovoPaciente = function() {
    const nomeInput = document.getElementById('novoNome');
    const dataInput = document.getElementById('novaData');

    const nomeVal = nomeInput.value.trim();
    const dataVal = dataInput.value.trim();

    if (!nomeVal) {
        nomeInput.style.borderColor = 'var(--error-text)';
        nomeInput.classList.add('login-error');
        setTimeout(() => { nomeInput.classList.remove('login-error'); nomeInput.style.borderColor = ''; }, 500);
        nomeInput.focus();
        return;
    }

    if (dataVal && !isDataValida(dataVal)) {
        dataInput.style.borderColor = 'var(--error-text)';
        dataInput.classList.add('login-error');
        setTimeout(() => { dataInput.classList.remove('login-error'); dataInput.style.borderColor = ''; }, 500);
        dataInput.focus();
        alert("Por favor, insira uma data de nascimento válida.");
        return;
    }

    const nomeFormatado = typeof formatarNomeDinamico === 'function' ? formatarNomeDinamico(nomeVal) : nomeVal;
    const dataFormatada = dataVal ? `| ${dataVal}` : "";

    let maxId = 0;
    state.pacientes.forEach(p => { if (p.id > maxId) maxId = p.id; });
    const novoId = maxId + 1;

    const novoPaciente = {
        id: novoId,
        nome: nomeFormatado,
        dataNascimento: dataFormatada,
        amarelo: 0,
        roxo: 0,
        cinza: 0,
        azul: 0,
        frasco: 0
    };

    state.pacientes.push(novoPaciente);
    document.getElementById('resumoPacientes').innerText = `Pacientes: ${state.pacientes.length}`;

    if (ordemAtual === 'alfabetica') {
        state.pacientes.sort((a, b) => a.nome.localeCompare(b.nome));
        renderizarLista(false); 
    } else {
        cancelarNovoPaciente();

        const cardContainer = document.createElement('div');
        cardContainer.className = 'card';
        cardContainer.style.animationDelay = '0s'; 
        cardContainer.id = `paciente-${novoPaciente.id}`;
        cardContainer.innerHTML = gerarHTMLCardPaciente(novoPaciente);
        contentArea.appendChild(cardContainer);

        atualizarContador();
    }

    setTimeout(() => {
        if (ordemAtual !== 'alfabetica') {
            contentArea.scrollTop = contentArea.scrollHeight;
        }
    }, 50);
}

window.alternarOrdem = function() {
    const cards = Array.from(contentArea.children);
    
    cards.forEach(card => {
        card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        card.style.transform = 'scale(0.95)';
        card.style.opacity = '0';
    });

    setTimeout(() => {
        if (ordemAtual === 'padrao') {
            state.pacientes.sort((a, b) => a.nome.localeCompare(b.nome));
            ordemAtual = 'alfabetica';
            document.getElementById('btnOrdenar').innerHTML = '🔤 Ordem: Alfabética';
        } else {
            state.pacientes.sort((a, b) => a.id - b.id);
            ordemAtual = 'padrao';
            document.getElementById('btnOrdenar').innerHTML = '🔄 Ordem: Padrão';
        }
        
        renderizarLista(true);
    }, 300);
}

function resetarInterface() {
    appContainer.style.transition = 'opacity 0.4s ease';
    appContainer.style.opacity = '0';
    document.getElementById('headerCenterArea').classList.remove('active');

    hasDocument = false;

    setTimeout(() => {
        painelAcoes.style.opacity = '0';
        painelAcoes.style.transform = 'translateY(20px)';
        painelAcoes.classList.add('app-hidden');
        
        appContainer.classList.remove('active-layout');
        leftPanel.classList.remove('active');
        dropZone.classList.remove('active', 'processing', 'error-state', 'success', 'app-hidden');
        
        document.getElementById('rightPanel').classList.remove('active');
        contentArea.innerHTML = '';
        
        state.pacientes = [];
        state.dataArquivo = "--/--/----";
        ordemAtual = 'alfabetica';
        if(document.getElementById('btnOrdenar')) {
            document.getElementById('btnOrdenar').innerHTML = '🔤 Ordem: Alfabética';
        }
        
        atualizarContador();

        dropTitle.innerHTML = `
            <span class="drop-emoji-large" id="dropEmojiIcon" title="Clique para selecionar o arquivo">📄</span>
            Solte o PDF
        `;
        dropSubtitle.style.display = 'block';
        dropSubtitle.innerText = 'Arraste o agendamento para cá ou clique no documento';

        requestAnimationFrame(() => {
            appContainer.style.opacity = '1';
            setTimeout(() => {
                appContainer.style.transition = ''; 
            }, 400);
        });

    }, 400); 
}