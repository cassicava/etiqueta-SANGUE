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
    padTop: document.getElementById('cfgPadTop'),
    padBottom: document.getElementById('cfgPadBottom'),
    padLeft: document.getElementById('cfgPadLeft'),
    padRight: document.getElementById('cfgPadRight'),
    fontName: document.getElementById('cfgFontName'),
    fontDob: document.getElementById('cfgFontDob'),
    fontType: document.getElementById('cfgFontType'),
    posNameX: document.getElementById('cfgPosNameX'),
    posNameY: document.getElementById('cfgPosNameY'),
    posDobX: document.getElementById('cfgPosDobX'),
    posDobY: document.getElementById('cfgPosDobY'),
    posTypeX: document.getElementById('cfgPosTypeX'),
    posTypeY: document.getElementById('cfgPosTypeY')
};

const camposConversao = [
    'pageWidth', 'pageHeight', 'gapX', 'gapY',
    'marginTop', 'marginBottom', 'marginLeft', 'marginRight',
    'labelWidth', 'labelHeight', 
    'padTop', 'padBottom', 'padLeft', 'padRight',
    'posNameX', 'posNameY', 'posDobX', 'posDobY', 'posTypeX', 'posTypeY'
];

const previewPage = document.getElementById('previewPage');
const previewLabel = document.getElementById('previewLabel');
const previewPageWrapper = document.getElementById('previewPageWrapper');
const prevPaddingBox = document.getElementById('prevPaddingBox');
const pName = document.getElementById('prevName');
const pDob = document.getElementById('prevDob');
const pType = document.getElementById('prevType');

let moveInterval = null;

function carregarConfiguracoes() {
    const saved = localStorage.getItem('sangue_config_impressao');
    if (saved) {
        try {
            configImpresso = { ...configImpresso, ...JSON.parse(saved) };
        } catch(e) {}
    }

    if (configImpresso.padTop < 1) {
        configImpresso.padTop *= 10;
        configImpresso.padBottom *= 10;
        configImpresso.padLeft *= 10;
        configImpresso.padRight *= 10;
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
    garantirLimites();
    atualizarPreview();
}

function garantirLimites() {
    let maxW = (parseFloat(inputsCfg.labelWidth.value) || 0) * 10;
    let maxH = (parseFloat(inputsCfg.labelHeight.value) || 0) * 10;
    let pT = (parseFloat(inputsCfg.padTop.value) || 0) * 10;
    let pB = (parseFloat(inputsCfg.padBottom.value) || 0) * 10;
    let pL = (parseFloat(inputsCfg.padLeft.value) || 0) * 10;
    let pR = (parseFloat(inputsCfg.padRight.value) || 0) * 10;

    const pt2mm = 0.3527;
    let fName = (parseFloat(inputsCfg.fontName.value) || 10) * pt2mm;
    let fDob = (parseFloat(inputsCfg.fontDob.value) || 10) * pt2mm;
    let fType = (parseFloat(inputsCfg.fontType.value) || 10) * pt2mm;

    let nameX = (parseFloat(inputsCfg.posNameX.value) || 0) * 10;
    let nameY = (parseFloat(inputsCfg.posNameY.value) || 0) * 10;
    if (nameX > maxW - pR - 10) nameX = maxW - pR - 10;
    if (nameX < pL) nameX = pL;
    if (nameY > maxH - pB - (fName * 2.0)) nameY = maxH - pB - (fName * 2.0);
    if (nameY < pT) nameY = pT;
    inputsCfg.posNameX.value = (nameX / 10).toFixed(1);
    inputsCfg.posNameY.value = (nameY / 10).toFixed(1);
    configImpresso.posNameX = nameX;
    configImpresso.posNameY = nameY;

    let dobX = (parseFloat(inputsCfg.posDobX.value) || 0) * 10;
    let dobY = (parseFloat(inputsCfg.posDobY.value) || 0) * 10;
    if (dobX > maxW - pR - (fDob * 5.5)) dobX = maxW - pR - (fDob * 5.5);
    if (dobX < pL) dobX = pL;
    if (dobY > maxH - pB - fDob) dobY = maxH - pB - fDob;
    if (dobY < pT) dobY = pT;
    inputsCfg.posDobX.value = (dobX / 10).toFixed(1);
    inputsCfg.posDobY.value = (dobY / 10).toFixed(1);
    configImpresso.posDobX = dobX;
    configImpresso.posDobY = dobY;

    let typeX = (parseFloat(inputsCfg.posTypeX.value) || 0) * 10;
    let typeY = (parseFloat(inputsCfg.posTypeY.value) || 0) * 10;
    if (typeX > maxW - pR - (fType * 5.5)) typeX = maxW - pR - (fType * 5.5);
    if (typeX < pL) typeX = pL;
    if (typeY > maxH - pB - fType) typeY = maxH - pB - fType;
    if (typeY < pT) typeY = pT;
    inputsCfg.posTypeX.value = (typeX / 10).toFixed(1);
    inputsCfg.posTypeY.value = (typeY / 10).toFixed(1);
    configImpresso.posTypeX = typeX;
    configImpresso.posTypeY = typeY;
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

    const previewBox = document.querySelector('.preview-label-box');
    const maxW = previewBox.clientWidth - 20;
    const maxH = previewBox.clientHeight - 20;
    
    let scaleLabel = Math.min(maxW / cfgUser.labelWidth, maxH / cfgUser.labelHeight);
    
    if (isNaN(scaleLabel) || scaleLabel <= 0 || !isFinite(scaleLabel)) scaleLabel = 3;

    previewLabel.style.width = `${cfgUser.labelWidth * scaleLabel}px`;
    previewLabel.style.height = `${cfgUser.labelHeight * scaleLabel}px`;
    
    if (prevPaddingBox) {
        prevPaddingBox.style.top = `${cfgUser.padTop * scaleLabel}px`;
        prevPaddingBox.style.left = `${cfgUser.padLeft * scaleLabel}px`;
        prevPaddingBox.style.width = `${(cfgUser.labelWidth - cfgUser.padLeft - cfgUser.padRight) * scaleLabel}px`;
        prevPaddingBox.style.height = `${(cfgUser.labelHeight - cfgUser.padTop - cfgUser.padBottom) * scaleLabel}px`;
    }

    const fontScale = scaleLabel * 0.35; 
    
    pName.style.fontSize = `${cfgUser.fontName * fontScale}px`;
    pName.style.top = `${cfgUser.posNameY * scaleLabel}px`;
    pName.style.left = `${cfgUser.posNameX * scaleLabel}px`;
    pName.style.width = `${(cfgUser.labelWidth - cfgUser.padRight - cfgUser.posNameX) * scaleLabel}px`;
    pName.style.padding = '0';

    pDob.style.fontSize = `${cfgUser.fontDob * fontScale}px`;
    pDob.style.top = `${cfgUser.posDobY * scaleLabel}px`;
    pDob.style.left = `${cfgUser.posDobX * scaleLabel}px`;
    pDob.style.padding = '0';

    pType.style.fontSize = `${cfgUser.fontType * fontScale}px`;
    pType.style.left = `${cfgUser.posTypeX * scaleLabel}px`;
    pType.style.top = `${cfgUser.posTypeY * scaleLabel}px`;
    pType.style.padding = '0';

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
            
            const trigerKeys = ['labelWidth', 'labelHeight', 'padTop', 'padBottom', 'padLeft', 'padRight', 'fontName', 'fontDob', 'fontType'];
            if (trigerKeys.includes(key)) {
                garantirLimites();
            }
            
            atualizarPreview();
        });
    }
}

function processarMovimento(target, axis, dir) {
    const key = `pos${target}${axis}`;
    let currentVal = (parseFloat(inputsCfg[key].value) || 0) * 10;
    currentVal += (dir * 1);
    
    const pt2mm = 0.3527;
    const fontSize = parseFloat(inputsCfg[`font${target}`].value) || 10;
    const fontMm = fontSize * pt2mm;

    const maxW = (parseFloat(inputsCfg.labelWidth.value) || 0) * 10;
    const maxH = (parseFloat(inputsCfg.labelHeight.value) || 0) * 10;
    
    const pT = (parseFloat(inputsCfg.padTop.value) || 0) * 10;
    const pB = (parseFloat(inputsCfg.padBottom.value) || 0) * 10;
    const pL = (parseFloat(inputsCfg.padLeft.value) || 0) * 10;
    const pR = (parseFloat(inputsCfg.padRight.value) || 0) * 10;

    if (target === 'Name') {
        if (axis === 'X') {
            if (currentVal < pL) currentVal = pL;
            if (currentVal > maxW - pR - 10) currentVal = maxW - pR - 10;
        } else {
            if (currentVal < pT) currentVal = pT;
            if (currentVal > maxH - pB - (fontMm * 2.0)) currentVal = maxH - pB - (fontMm * 2.0);
        }
    } else if (target === 'Dob') {
        if (axis === 'X') {
            if (currentVal < pL) currentVal = pL;
            if (currentVal > maxW - pR - (fontMm * 5.5)) currentVal = maxW - pR - (fontMm * 5.5);
        } else {
            if (currentVal < pT) currentVal = pT;
            if (currentVal > maxH - pB - fontMm) currentVal = maxH - pB - fontMm;
        }
    } else if (target === 'Type') {
        if (axis === 'X') {
            const textLengthMm = fontMm * 6.5;
            if (currentVal < pL) currentVal = pL;
            if (currentVal > maxW - pR - textLengthMm) currentVal = maxW - pR - textLengthMm;
        } else {
            if (currentVal < pT) currentVal = pT;
            if (currentVal > maxH - pB - fontMm) currentVal = maxH - pB - fontMm;
        }
    }

    configImpresso[key] = currentVal;
    inputsCfg[key].value = (currentVal / 10).toFixed(1);
    atualizarPreview();
}

function iniciarMovimento(e) {
    e.preventDefault();
    if (moveInterval) clearInterval(moveInterval);
    
    const target = e.target.getAttribute('data-target');
    const axis = e.target.getAttribute('data-axis');
    const dir = parseInt(e.target.getAttribute('data-dir'));
    
    processarMovimento(target, axis, dir);
    
    moveInterval = setInterval(() => {
        processarMovimento(target, axis, dir);
    }, 50);
}

function pararMovimento() {
    if (moveInterval) {
        clearInterval(moveInterval);
        moveInterval = null;
    }
}

document.querySelectorAll('.dpad-btn').forEach(btn => {
    btn.addEventListener('mousedown', iniciarMovimento);
    btn.addEventListener('touchstart', iniciarMovimento, { passive: false });
    
    btn.addEventListener('mouseup', pararMovimento);
    btn.addEventListener('mouseleave', pararMovimento);
    btn.addEventListener('touchend', pararMovimento);
    btn.addEventListener('touchcancel', pararMovimento);
});

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