pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

const appHeader = document.getElementById('appHeader');
const welcomeMsg = document.getElementById('welcomeMsg');
const appContainer = document.getElementById('appContainer');
const leftPanel = document.getElementById('leftPanel');
const dropZone = document.getElementById('dropZone');
const painelAcoes = document.getElementById('painelAcoes');
const contentArea = document.getElementById('contentArea');
const dropTitle = document.getElementById('dropTitle');
const dropSubtitle = document.getElementById('dropSubtitle');
const btnExcluir = document.getElementById('btnExcluir');
const btnImprimir = document.getElementById('btnImprimir');
const contadorTotal = document.getElementById('contadorTotal');
const mouseShadow = document.getElementById('mouseShadow');
const appTitle = document.getElementById('appTitle');
const btnTheme = document.getElementById('btnTheme');
const btnOrdenar = document.getElementById('btnOrdenar');
const btnConfigPrint = document.getElementById('btnConfigPrint');
const configPrintOverlay = document.getElementById('configPrintOverlay');

let state = {
    dataArquivo: "--/--/----",
    pacientes: []
};

let configImpresso = {
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
    padTop: 0.3,
    padBottom: 0.3,
    padLeft: 0.3,
    padRight: 0.3,
    fontName: 10,
    fontDob: 9,
    fontType: 9,
    posNameX: 3.0,
    posNameY: 3.0,
    posDobX: 3.0,
    posDobY: 19.0,
    posTypeX: 45.0,
    posTypeY: 19.0
};

let processInterval;
let hasDocument = false;
let ordemAtual = 'alfabetica';

let clicksNeeded = Math.floor(Math.random() * 11) + 10;
let currentClicks = 0;