const inputsCfg = {
    pageWidth: document.getElementById('cfgPageWidth'),
    pageHeight: document.getElementById('cfgPageHeight'),
    cols: document.getElementById('cfgCols'),
    rows: document.getElementById('cfgRows'),
    gapX: document.getElementById('cfgGapX'),
    gapY: document.getElementById('cfgGapY'),
    marginTop: document.getElementById('cfgMarginTop'),
    marginBottom: document.getElementById('cfgMarginBottom'),
    marginLeft: document.getElementById('cfgMarginLeft'),
    marginRight: document.getElementById('cfgMarginRight'),
    labelWidth: document.getElementById('cfgLabelWidth'),
    labelHeight: document.getElementById('cfgLabelHeight'),
    labelMarginTop: document.getElementById('cfgLabelMarginTop'),
    labelMarginBottom: document.getElementById('cfgLabelMarginBottom'),
    labelMarginLeft: document.getElementById('cfgLabelMarginLeft'),
    labelMarginRight: document.getElementById('cfgLabelMarginRight'),
    fontName: document.getElementById('cfgFontName'),
    fontDob: document.getElementById('cfgFontDob'),
    fontType: document.getElementById('cfgFontType')
};

const camposConversao = [
    'pageWidth', 'pageHeight', 'gapX', 'gapY',
    'marginTop', 'marginBottom', 'marginLeft', 'marginRight',
    'labelWidth', 'labelHeight', 
    'labelMarginTop', 'labelMarginBottom', 'labelMarginLeft', 'labelMarginRight'
];

const previewPage = document.getElementById('previewPage');
const previewLabel = document.getElementById('previewLabel');
const previewPageWrapper = document.getElementById('previewPageWrapper');
const pName = document.getElementById('prevName');
const pDob = document.getElementById('prevDob');
const pType = document.getElementById('prevType');

function carregarConfiguracoes() {
    const saved = localStorage.getItem('sangue_config_impressao');
    if (saved) {
        try {
            configImpresso = { ...configImpresso, ...JSON.parse(saved) };
        } catch(e) {}
    }

    for (let key in inputsCfg) {
        if (inputsCfg[key]) {
            if (camposConversao.includes(key)) {
                inputsCfg[key].value = (configImpresso[key] / 10).toFixed(1);
            } else {
                inputsCfg[key].value = configImpresso[key];
            }
        }
    }
    atualizarPreview();
}

function atualizarPreview() {
    const cfgUser = {};
    for (let key in inputsCfg) {
        if (camposConversao.includes(key)) {
            cfgUser[key] = (parseFloat(inputsCfg[key].value) || 0) * 10;
        } else {
            cfgUser[key] = parseFloat(inputsCfg[key].value) || 0;
        }
    }

    const reqWidth = cfgUser.marginLeft + cfgUser.marginRight + (cfgUser.cols * cfgUser.labelWidth) + (Math.max(0, cfgUser.cols - 1) * cfgUser.gapX);
    const reqHeight = cfgUser.marginTop + cfgUser.marginBottom + (cfgUser.rows * cfgUser.labelHeight) + (Math.max(0, cfgUser.rows - 1) * cfgUser.gapY);

    const widthOverflow = reqWidth > cfgUser.pageWidth;
    const heightOverflow = reqHeight > cfgUser.pageHeight;

    const widthInputs = [inputsCfg.pageWidth, inputsCfg.cols, inputsCfg.labelWidth, inputsCfg.gapX, inputsCfg.marginLeft, inputsCfg.marginRight];
    const heightInputs = [inputsCfg.pageHeight, inputsCfg.rows, inputsCfg.labelHeight, inputsCfg.gapY, inputsCfg.marginTop, inputsCfg.marginBottom];

    widthInputs.forEach(input => {
        if (input) {
            if (widthOverflow) input.classList.add('input-error-pulse');
            else input.classList.remove('input-error-pulse');
        }
    });

    heightInputs.forEach(input => {
        if (input) {
            if (heightOverflow) input.classList.add('input-error-pulse');
            else input.classList.remove('input-error-pulse');
        }
    });

    const scaleLabel = 3.5; 
    previewLabel.style.width = `${cfgUser.labelWidth * scaleLabel}px`;
    previewLabel.style.height = `${cfgUser.labelHeight * scaleLabel}px`;
    
    const fontScale = 1.35; 
    
    pName.style.fontSize = `${cfgUser.fontName * fontScale}px`;
    pName.style.top = `${cfgUser.labelMarginTop * scaleLabel}px`;
    pName.style.left = `${cfgUser.labelMarginLeft * scaleLabel}px`;
    pName.style.width = `${(cfgUser.labelWidth - cfgUser.labelMarginLeft - cfgUser.labelMarginRight) * scaleLabel - 30}px`;

    pDob.style.fontSize = `${cfgUser.fontDob * fontScale}px`;
    pDob.style.bottom = `${cfgUser.labelMarginBottom * scaleLabel}px`;
    pDob.style.left = `${cfgUser.labelMarginLeft * scaleLabel}px`;

    pType.style.fontSize = `${cfgUser.fontType * fontScale}px`;
    pType.style.bottom = `${cfgUser.labelMarginBottom * scaleLabel}px`;
    pType.style.right = `${cfgUser.labelMarginRight * scaleLabel}px`;

    const wrapperHeight = previewPageWrapper.offsetHeight - 20; 
    let pageScale = wrapperHeight / cfgUser.pageHeight;
    if (isNaN(pageScale) || pageScale <= 0 || !isFinite(pageScale)) pageScale = 1;
    
    previewPage.style.width = `${cfgUser.pageWidth * pageScale}px`;
    previewPage.style.height = `${cfgUser.pageHeight * pageScale}px`;
    previewPage.innerHTML = ''; 

    const mTop = cfgUser.marginTop * pageScale;
    const mLeft = cfgUser.marginLeft * pageScale;
    const lW = cfgUser.labelWidth * pageScale;
    const lH = cfgUser.labelHeight * pageScale;
    const gX = cfgUser.gapX * pageScale;
    const gY = cfgUser.gapY * pageScale;

    for (let r = 0; r < cfgUser.rows; r++) {
        for (let c = 0; c < cfgUser.cols; c++) {
            const box = document.createElement('div');
            box.className = 'prev-grid-item';
            box.style.width = `${lW}px`;
            box.style.height = `${lH}px`;
            box.style.top = `${mTop + r * (lH + gY)}px`;
            box.style.left = `${mLeft + c * (lW + gX)}px`;
            previewPage.appendChild(box);
        }
    }
}

for (let key in inputsCfg) {
    if (inputsCfg[key]) {
        inputsCfg[key].addEventListener('input', (e) => {
            if (parseFloat(e.target.value) < 0) e.target.value = 0;
            atualizarPreview();
        });
    }
}

if (btnConfigPrint) {
    btnConfigPrint.addEventListener('click', () => {
        carregarConfiguracoes(); 
        configPrintOverlay.classList.remove('app-hidden');
        setTimeout(atualizarPreview, 50); 
    });
}

function fecharModalConfig() {
    configPrintOverlay.classList.add('hiding');
    setTimeout(() => {
        configPrintOverlay.classList.add('app-hidden');
        configPrintOverlay.classList.remove('hiding');
    }, 600);
}

document.getElementById('btnFecharConfig').addEventListener('click', fecharModalConfig);

document.getElementById('btnSalvarConfig').addEventListener('click', () => {
    for (let key in inputsCfg) {
        if (camposConversao.includes(key)) {
            configImpresso[key] = (parseFloat(inputsCfg[key].value) || 0) * 10;
        } else {
            configImpresso[key] = parseFloat(inputsCfg[key].value) || 0;
        }
    }
    localStorage.setItem('sangue_config_impressao', JSON.stringify(configImpresso));
    fecharModalConfig();
});

window.addEventListener('resize', () => {
    if (!configPrintOverlay.classList.contains('app-hidden')) {
        atualizarPreview();
    }
});

carregarConfiguracoes();