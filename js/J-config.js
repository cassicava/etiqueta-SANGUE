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

const btnBordaOff = document.getElementById('btnBordaOff');
const btnBordaOn = document.getElementById('btnBordaOn');
const borderIndicator = document.getElementById('borderIndicator');
const avisoBorda = document.getElementById('avisoBorda');

const btnRestaurarConfig = document.getElementById('btnRestaurarConfig');
const modalConfirmacaoOverlay = document.getElementById('modalConfirmacaoOverlay');
const btnCancelarRestaurar = document.getElementById('btnCancelarRestaurar');
const btnConfirmarRestaurar = document.getElementById('btnConfirmarRestaurar');

const tabs = [
    { btn: document.getElementById('tabFolha'), panel: document.getElementById('panelFolha') },
    { btn: document.getElementById('tabEtiqueta'), panel: document.getElementById('panelEtiqueta') },
    { btn: document.getElementById('tabTexto'), panel: document.getElementById('panelTexto') }
];
const pillIndicator = document.getElementById('pillIndicator');

tabs.forEach((tab, index) => {
    if (tab.btn) {
        tab.btn.addEventListener('click', () => {
            tabs.forEach((t, i) => {
                if (t.btn) t.btn.classList.remove('active');
                if (t.panel) {
                    if (i < index) {
                        t.panel.className = 'config-panel panel-left';
                    } else if (i > index) {
                        t.panel.className = 'config-panel panel-right';
                    } else {
                        t.panel.className = 'config-panel active';
                    }
                }
            });
            tab.btn.classList.add('active');
            if (pillIndicator) {
                pillIndicator.style.transform = `translateX(${index * 100}%)`;
            }
        });
    }
});

function setBordaState(ativa) {
    configImpresso.imprimirBorda = ativa;
    if (ativa) {
        btnBordaOn.classList.add('active');
        btnBordaOff.classList.remove('active');
        borderIndicator.style.transform = 'translateX(100%)';
        avisoBorda.classList.remove('app-hidden');
        previewLabel.classList.add('borda-ativa-preview');
    } else {
        btnBordaOff.classList.add('active');
        btnBordaOn.classList.remove('active');
        borderIndicator.style.transform = 'translateX(0)';
        avisoBorda.classList.add('app-hidden');
        previewLabel.classList.remove('borda-ativa-preview');
    }
    garantirLimites();
    atualizarPreview();
}

if (btnBordaOff) btnBordaOff.addEventListener('click', () => setBordaState(false));
if (btnBordaOn) btnBordaOn.addEventListener('click', () => setBordaState(true));

function carregarConfiguracoes() {
    const saved = localStorage.getItem('sangue_config_impressao');
    if (saved) {
        try {
            configImpresso = { ...configImpresso, ...JSON.parse(saved) };
        } catch(e) {}
    }

    if (configImpresso.imprimirBorda === undefined) {
        configImpresso.imprimirBorda = false;
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
    setBordaState(configImpresso.imprimirBorda);
}

function garantirLimites() {
    let maxW = (parseFloat(inputsCfg.labelWidth.value) || 0) * 10;
    let maxH = (parseFloat(inputsCfg.labelHeight.value) || 0) * 10;
    let pT = (parseFloat(inputsCfg.padTop.value) || 0) * 10;
    let pB = (parseFloat(inputsCfg.padBottom.value) || 0) * 10;
    let pL = (parseFloat(inputsCfg.padLeft.value) || 0) * 10;
    let pR = (parseFloat(inputsCfg.padRight.value) || 0) * 10;

    if (configImpresso.imprimirBorda) {
        if (pT < 1) pT = 1;
        if (pB < 1) pB = 1;
        if (pL < 1) pL = 1;
        if (pR < 1) pR = 1;
        
        inputsCfg.padTop.value = (pT / 10).toFixed(1);
        inputsCfg.padBottom.value = (pB / 10).toFixed(1);
        inputsCfg.padLeft.value = (pL / 10).toFixed(1);
        inputsCfg.padRight.value = (pR / 10).toFixed(1);
    }

    const pt2mm = 0.3527;
    let fName = (parseFloat(inputsCfg.fontName.value) || 10) * pt2mm;
    let fDob = (parseFloat(inputsCfg.fontDob.value) || 9) * pt2mm;
    let fType = (parseFloat(inputsCfg.fontType.value) || 9) * pt2mm;

    let nameX = (parseFloat(inputsCfg.posNameX.value) || 0) * 10;
    let nameY = (parseFloat(inputsCfg.posNameY.value) || 0) * 10;
    if (nameX < pL) nameX = pL;
    let limitNameX = Math.max(pL, maxW - pR - 10);
    if (nameX > limitNameX) nameX = limitNameX;
    if (nameY < pT) nameY = pT;
    let limitNameY = Math.max(pT, maxH - pB - (fName * 2.0));
    if (nameY > limitNameY) nameY = limitNameY;
    inputsCfg.posNameX.value = (nameX / 10).toFixed(1);
    inputsCfg.posNameY.value = (nameY / 10).toFixed(1);
    configImpresso.posNameX = nameX;
    configImpresso.posNameY = nameY;

    let dobX = (parseFloat(inputsCfg.posDobX.value) || 0) * 10;
    let dobY = (parseFloat(inputsCfg.posDobY.value) || 0) * 10;
    if (dobX < pL) dobX = pL;
    let limitDobX = Math.max(pL, maxW - pR - (fDob * 5.5));
    if (dobX > limitDobX) dobX = limitDobX;
    if (dobY < pT) dobY = pT;
    let limitDobY = Math.max(pT, maxH - pB - fDob);
    if (dobY > limitDobY) dobY = limitDobY;
    inputsCfg.posDobX.value = (dobX / 10).toFixed(1);
    inputsCfg.posDobY.value = (dobY / 10).toFixed(1);
    configImpresso.posDobX = dobX;
    configImpresso.posDobY = dobY;

    let typeX = (parseFloat(inputsCfg.posTypeX.value) || 0) * 10;
    let typeY = (parseFloat(inputsCfg.posTypeY.value) || 0) * 10;
    if (typeX < pL) typeX = pL;
    let limitTypeX = Math.max(pL, maxW - pR - (fType * 5.5));
    if (typeX > limitTypeX) typeX = limitTypeX;
    if (typeY < pT) typeY = pT;
    let limitTypeY = Math.max(pT, maxH - pB - fType);
    if (typeY > limitTypeY) typeY = limitTypeY;
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
        if (input && typeof input.closest === 'function') {
            const control = input.closest('.number-control');
            if (widthOverflow) (control || input).classList.add('input-error-pulse');
            else (control || input).classList.remove('input-error-pulse');
        }
    });

    heightInputs.forEach(input => {
        if (input && typeof input.closest === 'function') {
            const control = input.closest('.number-control');
            if (heightOverflow) (control || input).classList.add('input-error-pulse');
            else (control || input).classList.remove('input-error-pulse');
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

    pDob.style.fontSize = `${cfgUser.fontDob * fontScale}px`;
    pDob.style.top = `${cfgUser.posDobY * scaleLabel}px`;
    pDob.style.left = `${cfgUser.posDobX * scaleLabel}px`;
    pDob.style.maxWidth = `${Math.max(0, (cfgUser.labelWidth - cfgUser.padRight - cfgUser.posDobX) * scaleLabel)}px`;
    pDob.style.overflow = 'hidden';

    pType.style.fontSize = `${cfgUser.fontType * fontScale}px`;
    pType.style.top = `${cfgUser.posTypeY * scaleLabel}px`;
    pType.style.left = `${cfgUser.posTypeX * scaleLabel}px`;
    pType.style.maxWidth = `${Math.max(0, (cfgUser.labelWidth - cfgUser.padRight - cfgUser.posTypeX) * scaleLabel)}px`;
    pType.style.overflow = 'hidden';

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

function makeHoldable(btn, action) {
    let timeout;
    let interval;

    const clearTimers = () => {
        clearTimeout(timeout);
        clearInterval(interval);
    };

    const start = (e) => {
        if (e.cancelable && e.type === 'touchstart') e.preventDefault();
        clearTimers();
        action();
        timeout = setTimeout(() => {
            interval = setInterval(action, 150);
        }, 400);
    };

    btn.addEventListener('mousedown', start);
    btn.addEventListener('touchstart', start, { passive: false });
    window.addEventListener('mouseup', clearTimers); 
    btn.addEventListener('mouseleave', clearTimers);
    btn.addEventListener('touchend', clearTimers);
    btn.addEventListener('touchcancel', clearTimers);
}

document.querySelectorAll('.number-control').forEach(control => {
    const input = control.querySelector('input');
    const btnDec = control.querySelector('.dec');
    const btnInc = control.querySelector('.inc');

    const updateValue = (delta) => {
        let val = parseFloat(input.value) || 0;
        let step = parseFloat(input.getAttribute('step')) || 1;
        let min = parseFloat(input.getAttribute('min'));
        
        let newVal = val + (delta * step);
        if (!isNaN(min) && newVal < min) newVal = min;
        
        input.value = newVal.toFixed(step < 1 ? 1 : 0);
        input.dispatchEvent(new Event('input'));
    };

    makeHoldable(btnDec, () => updateValue(-1));
    makeHoldable(btnInc, () => updateValue(1));
});

function processarMovimento(target, axis, dir) {
    const key = `pos${target}${axis}`;
    let currentVal = (parseFloat(inputsCfg[key].value) || 0) * 10;
    currentVal += (dir * 1);
    
    inputsCfg[key].value = (currentVal / 10).toFixed(1);
    garantirLimites();
    atualizarPreview();
}

document.querySelectorAll('.dpad-btn').forEach(btn => {
    const target = btn.getAttribute('data-target');
    const axis = btn.getAttribute('data-axis');
    const dir = parseInt(btn.getAttribute('data-dir'));
    
    makeHoldable(btn, () => processarMovimento(target, axis, dir));
});

for (let key in inputsCfg) {
    if (inputsCfg[key]) {
        inputsCfg[key].addEventListener('input', (e) => {
            if (parseFloat(e.target.value) < 0) e.target.value = 0;
            garantirLimites();
            atualizarPreview();
        });
        
        inputsCfg[key].addEventListener('blur', (e) => {
            if (e.target.value === '' || isNaN(parseFloat(e.target.value))) {
                e.target.value = 0;
                garantirLimites();
                atualizarPreview();
            }
        });
    }
}

if (btnConfigPrint) {
    btnConfigPrint.addEventListener('click', () => {
        carregarConfiguracoes(); 
        configPrintOverlay.classList.remove('app-hidden');
        
        if(tabs[0].btn) {
            tabs[0].btn.click(); 
        }

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

const btnSalvarConfig = document.getElementById('btnSalvarConfig');

btnSalvarConfig.addEventListener('click', () => {
    for (let key in inputsCfg) {
        if (camposConversao.includes(key)) {
            configImpresso[key] = (parseFloat(inputsCfg[key].value) || 0) * 10;
        } else {
            configImpresso[key] = parseFloat(inputsCfg[key].value) || 0;
        }
    }
    localStorage.setItem('sangue_config_impressao', JSON.stringify(configImpresso));
    
    const textoOriginal = btnSalvarConfig.innerText;
    btnSalvarConfig.innerText = 'Salvo! ✔️';
    btnSalvarConfig.classList.add('salvo-sucesso');

    setTimeout(() => {
        btnSalvarConfig.innerText = textoOriginal;
        btnSalvarConfig.classList.remove('salvo-sucesso');
        fecharModalConfig();
    }, 800);
});

if (btnRestaurarConfig) {
    btnRestaurarConfig.addEventListener('click', () => {
        modalConfirmacaoOverlay.classList.remove('app-hidden');
        setTimeout(() => modalConfirmacaoOverlay.classList.add('open'), 10);
    });
}

if (btnCancelarRestaurar) {
    btnCancelarRestaurar.addEventListener('click', () => {
        modalConfirmacaoOverlay.classList.remove('open');
        setTimeout(() => modalConfirmacaoOverlay.classList.add('app-hidden'), 400);
    });
}

if (btnConfirmarRestaurar) {
    btnConfirmarRestaurar.addEventListener('click', () => {
        localStorage.removeItem('sangue_config_impressao');
        
        configImpresso = {
            pageWidth: 195,
            pageHeight: 305,
            cols: 2,
            rows: 12,
            gapX: 2,
            gapY: 2.25,
            marginTop: 1,
            marginBottom: 1,
            marginLeft: 12,
            marginRight: 3,
            labelWidth: 89,
            labelHeight: 23,
            padTop: 3, 
            padBottom: 3,
            padLeft: 3,
            padRight: 3,
            fontName: 10,
            fontDob: 9,
            fontType: 9,
            posNameX: 3.0,
            posNameY: 3.0,
            posDobX: 3.0,
            posDobY: 19.0,
            posTypeX: 45.0,
            posTypeY: 19.0,
            imprimirBorda: false
        };

        for (let key in inputsCfg) {
            if (inputsCfg[key]) {
                if (camposConversao.includes(key)) {
                    inputsCfg[key].value = (configImpresso[key] / 10).toFixed(1);
                } else {
                    inputsCfg[key].value = configImpresso[key];
                }
            }
        }
        
        setBordaState(false);
        garantirLimites();
        atualizarPreview();

        modalConfirmacaoOverlay.classList.remove('open');
        setTimeout(() => modalConfirmacaoOverlay.classList.add('app-hidden'), 400);
    });
}

window.addEventListener('resize', () => {
    if (!configPrintOverlay.classList.contains('app-hidden')) atualizarPreview();
});

carregarConfiguracoes();