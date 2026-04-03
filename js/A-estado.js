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

let state = {
    dataArquivo: "--/--/----",
    pacientes: []
};

let processInterval;
let hasDocument = false;
let ordemAtual = 'padrao';

let clicksNeeded = Math.floor(Math.random() * 11) + 10;
let currentClicks = 0;