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
        dropTitle.innerHTML = `
            <div class="file-info-title">
                <span class="badge-data">${state.dataArquivo}</span>
            </div>
        `;
        dropSubtitle.style.display = 'none';
    });

    document.getElementById('resumoPacientes').innerText = `Pacientes: ${state.pacientes.length}`;

    setTimeout(() => {
        dropZone.classList.add('active');
        leftPanel.classList.add('active');
        
        setTimeout(() => {
            painelAcoes.classList.remove('app-hidden');
            contentArea.classList.add('active');
            renderizarLista();
            
            requestAnimationFrame(() => {
                painelAcoes.style.opacity = '1';
                painelAcoes.style.transform = 'translateY(0)';
            });
        }, 800); 
    }, 400); 
}

function gerarHTMLCardPaciente(item) {
    return `
        <div class="card-name" title="${item.nome}">
            ${item.nome} <span class="patient-dob">${item.dataNascimento}</span>
        </div>
        <div class="seletores-container">
            <div class="seletor amarelo">
                <span class="seletor-emoji">🟡</span>
                <button onclick="alterarQuantidade(${item.id}, 'amarelo', -1)">-</button>
                <span class="valor" id="valor-amarelo-${item.id}">${item.amarelo}</span>
                <button onclick="alterarQuantidade(${item.id}, 'amarelo', 1)">+</button>
            </div>
            <div class="seletor roxo">
                <span class="seletor-emoji">🟣</span>
                <button onclick="alterarQuantidade(${item.id}, 'roxo', -1)">-</button>
                <span class="valor" id="valor-roxo-${item.id}">${item.roxo}</span>
                <button onclick="alterarQuantidade(${item.id}, 'roxo', 1)">+</button>
            </div>
            <div class="seletor cinza">
                <span class="seletor-emoji">⚪</span>
                <button onclick="alterarQuantidade(${item.id}, 'cinza', -1)">-</button>
                <span class="valor" id="valor-cinza-${item.id}">${item.cinza}</span>
                <button onclick="alterarQuantidade(${item.id}, 'cinza', 1)">+</button>
            </div>
            <div class="seletor azul">
                <span class="seletor-emoji">🔵</span>
                <button onclick="alterarQuantidade(${item.id}, 'azul', -1)">-</button>
                <span class="valor" id="valor-azul-${item.id}">${item.azul}</span>
                <button onclick="alterarQuantidade(${item.id}, 'azul', 1)">+</button>
            </div>
            <div class="seletor frasco">
                <span class="seletor-emoji">🧪</span>
                <button onclick="alterarQuantidade(${item.id}, 'frasco', -1)">-</button>
                <span class="valor" id="valor-frasco-${item.id}">${item.frasco}</span>
                <button onclick="alterarQuantidade(${item.id}, 'frasco', 1)">+</button>
            </div>
        </div>
    `;
}

function adicionarCardNovoPaciente(delayIndex) {
    const addCard = document.createElement('div');
    addCard.className = 'card card-add';
    addCard.id = 'addPatientCard';
    addCard.style.animationDelay = `${delayIndex * 0.03}s`;
    addCard.innerHTML = `<span>➕ Novo Paciente</span>`;
    addCard.onclick = () => mostrarFormularioNovoPaciente();
    contentArea.appendChild(addCard);
}

function renderizarLista() {
    contentArea.innerHTML = '';
    let lastLetter = '';
    let visualIndex = 0;

    state.pacientes.forEach(item => {
        if (ordemAtual === 'alfabetica') {
            const currentLetter = item.nome.trim().charAt(0).toUpperCase();
            if (currentLetter !== lastLetter) {
                const divider = document.createElement('div');
                divider.className = 'alphabet-divider';
                divider.style.animationDelay = `${visualIndex * 0.03}s`;
                divider.innerHTML = `<span>${currentLetter}</span>`;
                contentArea.appendChild(divider);
                lastLetter = currentLetter;
                visualIndex++;
            }
        }

        const card = document.createElement('div');
        card.className = 'card';
        card.style.animationDelay = `${visualIndex * 0.03}s`;
        card.id = `paciente-${item.id}`;
        card.innerHTML = gerarHTMLCardPaciente(item);
        contentArea.appendChild(card);
        
        visualIndex++;
    });

    adicionarCardNovoPaciente(visualIndex);
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
    const addCard = document.getElementById('addPatientCard');
    addCard.className = 'card card-form-mode';
    addCard.onclick = null;

    addCard.innerHTML = `
        <div class="form-inputs">
            <input type="text" id="novoNome" placeholder="Nome completo do paciente" maxlength="40" autocomplete="off" style="flex-grow: 1;">
            <input type="text" id="novaData" placeholder="DD/MM/AAAA" maxlength="10" oninput="mascaraData(this)" autocomplete="off" style="width: 190px; text-align: center;">
        </div>
        <div class="form-actions">
            <button class="btn-action btn-cancelar" onclick="cancelarNovoPaciente()" title="Cancelar">✖</button>
            <button class="btn-action btn-salvar" onclick="salvarNovoPaciente()" title="Salvar">✔</button>
        </div>
    `;

    setTimeout(() => document.getElementById('novoNome').focus(), 100);

    document.getElementById('novoNome').addEventListener('keydown', (e) => {
        if(e.key === 'Enter') document.getElementById('novaData').focus();
        if(e.key === 'Escape') cancelarNovoPaciente();
    });
    
    document.getElementById('novaData').addEventListener('keydown', (e) => {
        if(e.key === 'Enter') salvarNovoPaciente();
        if(e.key === 'Escape') cancelarNovoPaciente();
    });
}

window.cancelarNovoPaciente = function() {
    const addCard = document.getElementById('addPatientCard');
    addCard.className = 'card card-add';
    addCard.innerHTML = `<span>➕ Novo Paciente</span>`;
    setTimeout(() => {
        addCard.onclick = () => mostrarFormularioNovoPaciente();
    }, 50);
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
        renderizarLista();
    } else {
        const addCard = document.getElementById('addPatientCard');
        if (addCard) addCard.remove();

        const cardContainer = document.createElement('div');
        cardContainer.className = 'card';
        cardContainer.style.animationDelay = '0s';
        cardContainer.id = `paciente-${novoPaciente.id}`;
        cardContainer.innerHTML = gerarHTMLCardPaciente(novoPaciente);
        contentArea.appendChild(cardContainer);

        adicionarCardNovoPaciente(0);
        atualizarContador();
    }

    setTimeout(() => {
        contentArea.scrollTop = contentArea.scrollHeight;
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
        
        renderizarLista();
    }, 300);
}

function resetarInterface() {
    Array.from(contentArea.children).forEach(card => {
        card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        card.style.transform = 'translateX(50px)';
        card.style.opacity = '0';
    });

    painelAcoes.style.opacity = '0';
    painelAcoes.style.transform = 'translateY(20px)';
    
    contentArea.classList.remove('active');

    hasDocument = false;

    setTimeout(() => {
        painelAcoes.classList.add('app-hidden');
        leftPanel.classList.remove('active');
        dropZone.classList.remove('active', 'processing', 'error-state');
        
        contentArea.innerHTML = '';
        
        setTimeout(() => {
            aplicarFadeTextos(() => {
                dropTitle.innerHTML = `
                    <span class="drop-emoji-large" id="dropEmojiIcon" title="Clique para selecionar o arquivo">📄</span>
                    Solte o PDF
                `;
                dropSubtitle.style.display = 'block';
                dropSubtitle.innerText = 'Arraste o agendamento para cá ou clique no documento';
            });

            state.pacientes = [];
            state.dataArquivo = "--/--/----";
            ordemAtual = 'padrao';
            if(document.getElementById('btnOrdenar')) {
                document.getElementById('btnOrdenar').innerHTML = '🔄 Ordem: Padrão';
            }
            
            atualizarContador();
            
        }, 800);

    }, 450); 
}