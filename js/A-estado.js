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
    { id: 'frasco', nome: 'Frasco', sigla: 'Frasco', icone: '🧪', corRGB: [5, 150, 105], desc: 'Recipiente estéril / não estéril', exames: 'Urina, Fezes, Escarro', grupo: 'principal' },
    { id: 'vermelho', nome: 'Vermelho', sigla: 'Verm', icone: '<span class="icone-bolinha" style="background-color: var(--tubo-vermelho);"></span>', corRGB: [225, 29, 72], desc: 'Ativador de coágulo', exames: 'Bioquímica, Sorologia', grupo: 'principal' },
    { id: 'amarelo', nome: 'Amarelo', sigla: 'Amar', icone: '<span class="icone-bolinha" style="background-color: var(--tubo-amarelo);"></span>', corRGB: [234, 179, 8], desc: 'Gel separador e ativador', exames: 'Bioquímica, Hormônios', grupo: 'principal' },
    { id: 'roxo', nome: 'Roxo', sigla: 'Roxo', icone: '<span class="icone-bolinha" style="background-color: var(--tubo-roxo);"></span>', corRGB: [124, 58, 237], desc: 'Anticoagulante EDTA', exames: 'Hematologia (Hemograma)', grupo: 'principal' },
    { id: 'cinza', nome: 'Cinza', sigla: 'Cinza', icone: '<span class="icone-bolinha" style="background-color: var(--tubo-cinza);"></span>', corRGB: [75, 85, 99], desc: 'Fluoreto de Sódio + EDTA', exames: 'Glicemia, Lactato', grupo: 'principal' },
    { id: 'azul', nome: 'Azul', sigla: 'Azul', icone: '<span class="icone-bolinha" style="background-color: var(--tubo-azul);"></span>', corRGB: [37, 99, 235], desc: 'Anticoagulante Citrato de Sódio', exames: 'Coagulação (TAP, TTPA)', grupo: 'principal' },
    { id: 'verde', nome: 'Verde', sigla: 'Verde', icone: '<span class="icone-bolinha" style="background-color: var(--tubo-verde);"></span>', corRGB: [34, 197, 94], desc: 'Anticoagulante Heparina', exames: 'Gasometria, Troponina', grupo: 'especifico' },
    { id: 'branco', nome: 'Branco', sigla: 'Bran', icone: '<span class="icone-bolinha" style="background-color: var(--tubo-branco);"></span>', corRGB: [226, 232, 240], desc: 'EDTA com Gel Separador', exames: 'Biologia Molecular, PCR', grupo: 'especifico' },
    { id: 'rosa', nome: 'Rosa', sigla: 'Rosa', icone: '<span class="icone-bolinha" style="background-color: var(--tubo-rosa);"></span>', corRGB: [236, 72, 153], desc: 'EDTA (Banco de Sangue)', exames: 'Tipagem Sanguínea', grupo: 'especifico' },
    { id: 'preto', nome: 'Preto', sigla: 'Preto', icone: '<span class="icone-bolinha" style="background-color: var(--tubo-preto);"></span>', corRGB: [0, 0, 0], desc: 'Citrato de Sódio tamponado', exames: 'VHS', grupo: 'especifico' },
    { id: 'azulescuro', nome: 'Azul Esc.', sigla: 'AzEsc', icone: '<span class="icone-bolinha" style="background-color: var(--tubo-azulescuro);"></span>', corRGB: [30, 58, 138], desc: 'Sem aditivo / EDTA', exames: 'Toxicologia, Metais', grupo: 'especifico' },
    { id: 'laranja', nome: 'Laranja', sigla: 'Laran', icone: '<span class="icone-bolinha" style="background-color: var(--tubo-laranja);"></span>', corRGB: [249, 115, 22], desc: 'Trombina (Acelerador)', exames: 'Urgência (STAT)', grupo: 'especifico' }
];

let tubosAtivos = JSON.parse(localStorage.getItem('sangue_tubos_ativos')) || tubosConfig.filter(t => t.grupo === 'principal').map(t => t.id);

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