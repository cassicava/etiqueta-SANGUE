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
    aplicarFadeTextos(() => {
        dropTitle.innerHTML = `<span class="spinning-gear">🔍</span>`;
        dropSubtitle.style.display = 'block';
        dropSubtitle.innerText = 'Analisando documento...';
        dropZone.classList.add('processing');
        if (document.getElementById('dropProgress')) {
            document.getElementById('dropProgress').style.display = 'none';
            document.getElementById('dropProgressFill').style.width = '0%';
        }
    });

    let isDocumentoValido = true;
    let qtdPacientes = 0;
    let qtdAlertas = 0;

    try {
        await processarPDFReal(file);
        qtdPacientes = state.pacientes.length;
        qtdAlertas = state.pacientes.filter(p => p.alertaData).length;
    } catch (e) {
        isDocumentoValido = false;
    }

    if (!isDocumentoValido) {
        setTimeout(() => {
            exibirErroDocumento();
        }, 1000);
        return;
    }

    setTimeout(() => {
        aplicarFadeTextos(() => {
            dropTitle.innerHTML = `<span style="font-size: 3rem;">👥</span>`;
            dropSubtitle.innerText = `Identificamos ${qtdPacientes} pacientes!`;
        });
    }, 1200);

    setTimeout(() => {
        aplicarFadeTextos(() => {
            dropTitle.innerHTML = `<span style="font-size: 3rem;">📅</span>`;
            dropSubtitle.innerText = 'Calculando e cruzando datas de nascimento...';
            const progress = document.getElementById('dropProgress');
            if (progress) {
                progress.style.display = 'block';
                setTimeout(() => {
                    document.getElementById('dropProgressFill').style.width = '100%';
                }, 100);
            }
        });
    }, 3000);

    setTimeout(() => {
        aplicarFadeTextos(() => {
            const progress = document.getElementById('dropProgress');
            if (progress) progress.style.display = 'none';

            dropZone.classList.remove('processing');

            if (qtdAlertas > 0) {
                dropZone.classList.add('warning-state');
                dropTitle.innerHTML = `<span style="font-size: 3.5rem;">⚠️</span>`;
                dropSubtitle.innerHTML = `<strong style="color: var(--tubo-amarelo); font-size: 1.1rem;">Atenção: ${qtdAlertas} data(s) precisa(m) de revisão!</strong><br><span style="font-size: 0.9rem; margin-top: 5px; display: block;">Sempre confira as datas com o pedido original.</span>`;
            } else {
                dropZone.classList.add('success-state');
                dropTitle.innerHTML = `<span style="font-size: 3.5rem;">✅</span>`;
                dropSubtitle.innerHTML = `<strong style="color: var(--tubo-verde); font-size: 1.1rem;">Tudo pronto!</strong><br><span style="font-size: 0.9rem; margin-top: 5px; display: block;">Recomendamos conferir as datas com o pedido médico.</span>`;
            }
        });
    }, 5500);

    setTimeout(() => {
        dropZone.classList.remove('warning-state', 'success-state');
        mostrarInfoArquivo();
    }, 8500);
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

function calcularDiferencaExata(nascimento, referencia) {
    let anos = referencia.getFullYear() - nascimento.getFullYear();
    let meses = referencia.getMonth() - nascimento.getMonth();
    let dias = referencia.getDate() - nascimento.getDate();

    if (dias < 0) {
        meses--;
        let ultimoDiaMesAnterior = new Date(referencia.getFullYear(), referencia.getMonth(), 0).getDate();
        dias += ultimoDiaMesAnterior;
    }
    if (meses < 0) {
        anos--;
        meses += 12;
    }
    return { anos, meses, dias };
}

function algoritmoProvaReal(dataRef, alvoAnos, alvoMeses, alvoDias) {
    let dtNasc = new Date(dataRef.getTime());
    dtNasc.setFullYear(dtNasc.getFullYear() - alvoAnos);
    dtNasc.setMonth(dtNasc.getMonth() - alvoMeses);
    
    let diaBase = dataRef.getDate();
    if (dtNasc.getDate() < diaBase && alvoDias === 0) {
        dtNasc.setDate(0);
    }
    dtNasc.setDate(dtNasc.getDate() - alvoDias);

    let incerteza = false;
    let tentativa = 0;
    const LIMITE_TENTATIVAS = 5;

    while (tentativa < LIMITE_TENTATIVAS) {
        let diff = calcularDiferencaExata(dtNasc, dataRef);
        
        if (diff.anos === alvoAnos && diff.meses === alvoMeses && diff.dias === alvoDias) {
            break;
        }

        if (diff.anos > alvoAnos || (diff.anos === alvoAnos && diff.meses > alvoMeses) || (diff.anos === alvoAnos && diff.meses === alvoMeses && diff.dias > alvoDias)) {
            dtNasc.setDate(dtNasc.getDate() + 1);
        } else {
            dtNasc.setDate(dtNasc.getDate() - 1);
        }

        tentativa++;
        if (tentativa === LIMITE_TENTATIVAS) incerteza = true;
    }

    return {
        data: `${dtNasc.getDate().toString().padStart(2, '0')}/${(dtNasc.getMonth() + 1).toString().padStart(2, '0')}/${dtNasc.getFullYear()}`,
        alerta: incerteza
    };
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

                let resultadoFinal = algoritmoProvaReal(dataReferencia, anos, meses, dias);

                let novoPaciente = {
                    id: pacId++,
                    nome: formatarNomeDinamico(nomePossivel),
                    dataNascimento: resultadoFinal.data,
                    alertaData: resultadoFinal.alerta
                };

                tubosConfig.forEach(t => { novoPaciente[t.id] = 0; });
                state.pacientes.push(novoPaciente);
            }
        }
    }

    if (state.pacientes.length === 0) throw new Error("Vazio");
}