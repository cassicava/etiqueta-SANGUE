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
        alert("Por favor, exclua o arquivo atual antes de inserir um novo.");
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
        alert("Por favor, solte apenas arquivos PDF.");
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
        alert("Por favor, selecione apenas arquivos PDF.");
    }
    
    e.target.value = '';
});

btnExcluir.addEventListener('click', () => {
    resetarInterface();
});

btnImprimir.addEventListener('click', () => {
    if (typeof window.gerarEtiquetasPDF === 'function') {
        window.gerarEtiquetasPDF();
    }
});

if (document.getElementById('btnOrdenar')) {
    document.getElementById('btnOrdenar').addEventListener('click', window.alternarOrdem);
}

const tubosHover = document.querySelectorAll('.cont-item[data-tubo]');

tubosHover.forEach(item => {
    item.addEventListener('mouseenter', () => {
        const tipo = item.getAttribute('data-tubo');
        contentArea.classList.add(`hover-${tipo}`);
    });
    
    item.addEventListener('mouseleave', () => {
        const tipo = item.getAttribute('data-tubo');
        contentArea.classList.remove(`hover-${tipo}`);
    });
});