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
const btnConfigTubos = document.getElementById('btnConfigTubos');
const configTubosOverlay = document.getElementById('configTubosOverlay');
const btnFecharConfigTubos = document.getElementById('btnFecharConfigTubos');
const contadoresIndividuais = document.getElementById('contadoresIndividuais');
const btnConfigPrint = document.getElementById('btnConfigPrint');
const configPrintOverlay = document.getElementById('configPrintOverlay');
const btnDicas = document.getElementById('btnDicas');
const dicasOverlay = document.getElementById('dicasOverlay');
const btnFecharDicas = document.getElementById('btnFecharDicas');

let state = {
    dataArquivo: "--/--/----",
    pacientes: []
};

let tubosConfig = [
    { 
        id: 'vermelho', nome: 'Vermelho', sigla: 'Verm', icone: '🔴', corRGB: [225, 29, 72], 
        desc: 'Ativador de coágulo', 
        exames: 'Bioquímica, Sorologia, Imunologia, Hormônios' 
    },
    { 
        id: 'amarelo', nome: 'Amarelo', sigla: 'Amar', icone: '🟡', corRGB: [234, 179, 8], 
        desc: 'Gel separador e ativador', 
        exames: 'Bioquímica, Marcadores Tumorais, Hormônios' 
    },
    { 
        id: 'roxo', nome: 'Roxo', sigla: 'Roxo', icone: '🟣', corRGB: [124, 58, 237], 
        desc: 'Anticoagulante EDTA', 
        exames: 'Hematologia (Hemograma), HbA1c, Tipagem Sanguínea' 
    },
    { 
        id: 'cinza', nome: 'Cinza', sigla: 'Cinza', icone: '⚪', corRGB: [75, 85, 99], 
        desc: 'Fluoreto de Sódio + EDTA', 
        exames: 'Glicemia, Lactato, Teste de Tolerância à Glicose' 
    },
    { 
        id: 'azul', nome: 'Azul', sigla: 'Azul', icone: '🔵', corRGB: [37, 99, 235], 
        desc: 'Anticoagulante Citrato de Sódio', 
        exames: 'Coagulação (TAP, TTPA, Fibrinogênio, D-Dímero)' 
    },
    { 
        id: 'verde', nome: 'Verde', sigla: 'Verde', icone: '🟢', corRGB: [34, 197, 94], 
        desc: 'Anticoagulante Heparina', 
        exames: 'Bioquímica de Urgência, Gasometria, Troponina' 
    },
    { 
        id: 'frasco', nome: 'Frasco', sigla: 'Frasco', icone: '🧪', corRGB: [5, 150, 105], 
        desc: 'Recipiente estéril / não estéril', 
        exames: 'Urina, Fezes, Escarro, Espermograma' 
    }
];

let tubosAtivos = JSON.parse(localStorage.getItem('sangue_tubos_ativos')) || tubosConfig.map(t => t.id);

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