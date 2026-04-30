function formatarNomeDinamico(nomeBruto) {
    const excecoes = ['da', 'de', 'do', 'das', 'dos', 'e'];
    return nomeBruto.toLowerCase().split(' ').map((palavra, index) => {
        if (index > 0 && excecoes.includes(palavra)) return palavra;
        return palavra.charAt(0).toUpperCase() + palavra.slice(1);
    }).join(' ');
}

function aplicarFadeTextos(callback) {
    dropTitle.style.opacity = '0';
    dropTitle.style.transform = 'scale(0.9)';
    dropSubtitle.style.opacity = '0';
    dropSubtitle.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        callback();
        dropTitle.style.opacity = '1';
        dropTitle.style.transform = 'scale(1)';
        dropSubtitle.style.opacity = '1';
        dropSubtitle.style.transform = 'scale(1)';
    }, 400);
}

async function iniciarProcessamentoAnimacao(file) {
    const startTime = Date.now();
    
    aplicarFadeTextos(() => {
        dropTitle.innerHTML = `<span class="spinning-gear">⚙️</span>`;
        dropSubtitle.style.display = 'block';
        dropSubtitle.innerText = 'Lendo documento...';
        dropZone.classList.add('processing'); 
    });

    let isDocumentoValido = true;

    try {
        await processarPDFReal(file);
    } catch (e) {
        isDocumentoValido = false;
    }

    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, 3000 - elapsedTime);

    setTimeout(() => {
        if (isDocumentoValido) {
            mostrarInfoArquivo();
        } else {
            exibirErroDocumento();
        }
    }, remainingTime);
}

function exibirErroDocumento() {
    aplicarFadeTextos(() => {
        dropZone.classList.remove('processing');
        dropZone.classList.add('error-state');
        dropTitle.innerHTML = `<span style="font-size: 3.5rem; display: block; margin-bottom: 10px;">❌</span>Erro na Leitura`;
        dropSubtitle.style.display = 'block';
        dropSubtitle.innerText = 'Não foi possível extrair os nomes.';
        dropSubtitle.style.color = 'var(--error-text)';
        dropSubtitle.style.fontWeight = 'bold';
    });

    setTimeout(() => {
        dropZone.classList.remove('error-state');
        dropSubtitle.style.color = 'var(--text-muted)';
        dropSubtitle.style.fontWeight = 'normal';
        resetarInterface();
    }, 4000);
}

async function processarPDFReal(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let linhas = [];

    for (let num = 1; num <= pdf.numPages; num++) {
        const page = await pdf.getPage(num);
        const content = await page.getTextContent();
        let lastY = -1;
        let currentLine = "";

        content.items.forEach(item => {
            if (lastY !== item.transform[5]) {
                if (currentLine) linhas.push(currentLine.trim());
                currentLine = item.str;
                lastY = item.transform[5];
            } else {
                currentLine += " " + item.str;
            }
        });
        if (currentLine) linhas.push(currentLine.trim());
    }

    state.pacientes = [];
    state.dataArquivo = "--/--/----";
    
    let dataReferencia = new Date(); 

    let linhaImpressao = linhas.find(l => l.includes('Impresso em'));
    if (linhaImpressao) {
        let dataMatch = linhaImpressao.match(/Impresso em (\d{2})\/(\d{2})\/(\d{4})/);
        if (dataMatch) {
            state.dataArquivo = `${dataMatch[1]}/${dataMatch[2]}/${dataMatch[3]}`;
            dataReferencia = new Date(parseInt(dataMatch[3], 10), parseInt(dataMatch[2], 10) - 1, parseInt(dataMatch[1], 10));
        }
    } else {
        let fallbackData = linhas.find(l => l.includes('Data:'));
        if (fallbackData) {
            let dMatch = fallbackData.match(/Data:\s*(\d{2})\/(\d{2})\/(\d{4})/);
            if (dMatch) {
                state.dataArquivo = `${dMatch[1]}/${dMatch[2]}/${dMatch[3]}`;
                dataReferencia = new Date(parseInt(dMatch[3], 10), parseInt(dMatch[2], 10) - 1, parseInt(dMatch[1], 10));
            }
        }
    }

    let pacId = 1;

    for (let i = 0; i < linhas.length; i++) {
        let linha = linhas[i];

        if (linha.match(/(\d+)\s*(ano|m[eê]s|dia)/i)) {
            let nomePossivel = linhas[i - 1];
            
            if (nomePossivel && !nomePossivel.toLowerCase().includes('reserva') && !nomePossivel.toLowerCase().includes('p.a')) {
                
                let anos = 0, meses = 0, dias = 0;
                
                let mAnos = linha.match(/(\d+)\s*ano/i);
                if (mAnos) anos = parseInt(mAnos[1], 10);
                
                let mMeses = linha.match(/(\d+)\s*m[eê]s/i);
                if (mMeses) meses = parseInt(mMeses[1], 10);
                
                let mDias = linha.match(/(\d+)\s*dia/i);
                if (mDias) dias = parseInt(mDias[1], 10);

                let dtNasc = new Date(dataReferencia.getTime());
                dtNasc.setFullYear(dtNasc.getFullYear() - anos);
                dtNasc.setMonth(dtNasc.getMonth() - meses);
                dtNasc.setDate(dtNasc.getDate() - dias);

                let diaStr = dtNasc.getDate().toString().padStart(2, '0');
                let mesStr = (dtNasc.getMonth() + 1).toString().padStart(2, '0');
                let anoStr = dtNasc.getFullYear();

                let nomeFormatado = formatarNomeDinamico(nomePossivel);
                let dataNascimentoStr = `${diaStr}/${mesStr}/${anoStr}`;

                let novoPaciente = {
                    id: pacId++,
                    nome: nomeFormatado,
                    dataNascimento: dataNascimentoStr
                };

                tubosConfig.forEach(t => {
                    novoPaciente[t.id] = 0;
                });

                state.pacientes.push(novoPaciente);
            }
        }
    }

    if (state.pacientes.length === 0) {
        throw new Error("Nenhum paciente encontrado");
    }
}