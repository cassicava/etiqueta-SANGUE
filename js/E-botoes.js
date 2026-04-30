['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    window.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

dropZone.addEventListener('dragenter', (e) => {
    if (hasDocument) return;
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragover', (e) => {
    if (hasDocument) return;
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', (e) => {
    if (hasDocument) return;
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    if (hasDocument) {
        mostrarAlerta("Por favor, exclua o arquivo atual antes de inserir um novo.");
        return;
    }
    
    dropZone.classList.remove('dragover');
    
    let files = null;
    if (e.dataTransfer && e.dataTransfer.files) {
        files = e.dataTransfer.files;
    }
    
    if(files && files.length > 0 && files[0].type === "application/pdf") {
        hasDocument = true;
        iniciarProcessamentoAnimacao(files[0]);
    } else {
        mostrarAlerta("Por favor, solte apenas arquivos PDF.");
    }
});

const fileInput = document.getElementById('fileInput');

dropZone.addEventListener('click', (e) => {
    if (hasDocument || dropZone.classList.contains('dragover')) return;
    if (e.target !== fileInput) {
        fileInput.click();
    }
});

fileInput.addEventListener('change', (e) => {
    if (hasDocument) return;
    const files = e.target.files;
    
    if(files.length > 0 && files[0].type === "application/pdf") {
        hasDocument = true;
        iniciarProcessamentoAnimacao(files[0]);
    } else if (files.length > 0) {
        mostrarAlerta("Por favor, selecione apenas arquivos PDF.");
    }
    
    e.target.value = '';
});

const modalExclusaoOverlay = document.getElementById('modalConfirmarExclusaoOverlay');
const btnCancelarExclusao = document.getElementById('btnCancelarExclusao');
const btnConfirmarExclusao = document.getElementById('btnConfirmarExclusao');

btnExcluir.addEventListener('click', () => {
    modalExclusaoOverlay.classList.remove('app-hidden');
    setTimeout(() => modalExclusaoOverlay.classList.add('open'), 10);
});

if (btnCancelarExclusao) {
    btnCancelarExclusao.addEventListener('click', () => {
        modalExclusaoOverlay.classList.remove('open');
        setTimeout(() => modalExclusaoOverlay.classList.add('app-hidden'), 400);
    });
}

if (btnConfirmarExclusao) {
    btnConfirmarExclusao.addEventListener('click', () => {
        modalExclusaoOverlay.classList.remove('open');
        setTimeout(() => modalExclusaoOverlay.classList.add('app-hidden'), 400);
        resetarInterface();
    });
}

btnImprimir.addEventListener('click', () => {
    if (typeof window.gerarEtiquetasPDF === 'function') {
        window.gerarEtiquetasPDF();
    }
});

const btnImprimirLista = document.getElementById('btnImprimirLista');
if (btnImprimirLista) {
    btnImprimirLista.addEventListener('click', () => {
        if (typeof window.gerarListaPDF === 'function') {
            window.gerarListaPDF();
        }
    });
}

const tubosHover = document.querySelectorAll('.cont-item[data-tubo]');

tubosHover.forEach(item => {
    item.addEventListener('mouseenter', () => {
        const corHov = item.getAttribute('data-tubo');
        contentArea.classList.add(`hover-${corHov}`);
    });
    
    item.addEventListener('mouseleave', () => {
        const corHov = item.getAttribute('data-tubo');
        contentArea.classList.remove(`hover-${corHov}`);
    });
});