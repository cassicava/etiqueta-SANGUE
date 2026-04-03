['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

dropZone.addEventListener('dragover', () => {
    if (hasDocument) return;
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    if (hasDocument) return;
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    if (hasDocument) {
        alert("Por favor, exclua o arquivo atual antes de inserir um novo.");
        return;
    }
    
    dropZone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    
    if(files.length > 0 && files[0].type === "application/pdf") {
        hasDocument = true;
        iniciarProcessamentoAnimacao(files[0]);
    } else {
        alert("Por favor, solte apenas arquivos PDF.");
    }
});

const fileInput = document.getElementById('fileInput');

document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'dropEmojiIcon') {
        if (hasDocument || dropZone.classList.contains('dragover')) return;
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