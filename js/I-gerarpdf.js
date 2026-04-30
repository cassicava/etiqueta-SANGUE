window.gerarEtiquetasPDF = function() {
    let totalEtiquetas = 0;
    state.pacientes.forEach(p => {
        tubosAtivos.forEach(tId => {
            totalEtiquetas += p[tId];
        });
    });

    if (totalEtiquetas === 0) {
        mostrarAlerta("Não existem etiquetas selecionadas. Adicione tubos aos pacientes antes de imprimir.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const cfg = configImpresso;
    
    const doc = new jsPDF({ 
        orientation: 'p', 
        unit: 'mm', 
        format: [cfg.pageWidth, cfg.pageHeight] 
    });

    let etiquetas = [];
    
    state.pacientes.forEach(p => {
        tubosConfig.forEach(t => {
            if (tubosAtivos.includes(t.id)) {
                for (let i = 0; i < p[t.id]; i++) {
                    etiquetas.push({
                        paciente: p.nome,
                        nascimento: p.dataNascimento.replace('| ', '').trim(),
                        tuboNome: t.nome.toUpperCase(),
                        tuboCor: t.corRGB
                    });
                }
            }
        });
    });

    const labelsPorPagina = cfg.cols * cfg.rows;
    const pt2mm = 0.3527;

    etiquetas.forEach((etiq, index) => {
        const itemPage = index % labelsPorPagina;
        
        if (index > 0 && itemPage === 0) {
            doc.addPage();
        }

        const col = Math.floor(itemPage / cfg.rows);
        const row = itemPage % cfg.rows;

        const x = cfg.marginLeft + col * (cfg.labelWidth + cfg.gapX);
        const y = cfg.marginTop + row * (cfg.labelHeight + cfg.gapY);

        if (cfg.imprimirBorda) {
            doc.setDrawColor(0, 0, 0);
            const espessuraLinha = 0.3;
            doc.setLineWidth(espessuraLinha);
            doc.rect(x + (espessuraLinha / 2), y + (espessuraLinha / 2), cfg.labelWidth - espessuraLinha, cfg.labelHeight - espessuraLinha);
        }

        const fnNameMm = cfg.fontName * pt2mm;
        const fnDobMm = cfg.fontDob * pt2mm;
        const fnTypeMm = cfg.fontType * pt2mm;

        doc.setFontSize(cfg.fontName);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);

        let linhasNome = doc.splitTextToSize(etiq.paciente, cfg.labelWidth - cfg.padRight - cfg.posNameX);
        if (linhasNome.length > 2) linhasNome = linhasNome.slice(0, 2);

        linhasNome.forEach((linha, i) => {
            doc.text(linha, x + cfg.posNameX, y + cfg.posNameY + (i * fnNameMm), { baseline: 'top' });
        });

        doc.setFontSize(cfg.fontDob);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(80, 80, 80);
        doc.text(etiq.nascimento, x + cfg.posDobX, y + cfg.posDobY, { baseline: 'top' });

        doc.setFontSize(cfg.fontType);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(etiq.tuboCor[0], etiq.tuboCor[1], etiq.tuboCor[2]);
        doc.text(etiq.tuboNome, x + cfg.posTypeX, y + cfg.posTypeY, { baseline: 'top' });
    });

    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    const nomePdf = `coleta dia ${dia}-${mes}-${ano} etiquetas.pdf`;
    
    doc.save(nomePdf);
};

window.gerarListaPDF = function() {
    if (!state.pacientes || state.pacientes.length === 0) {
        mostrarAlerta("Não existem pacientes para gerar a lista.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

    let dataColeta = state.dataArquivo;
    if (!dataColeta || dataColeta === "--/--/----") {
        const hoje = new Date();
        dataColeta = `${String(hoje.getDate()).padStart(2, '0')}/${String(hoje.getMonth() + 1).padStart(2, '0')}/${hoje.getFullYear()}`;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`Coleta ${dataColeta}`, 14, 20);

    const pacientesOrdenados = [...state.pacientes].sort((a, b) => a.nome.localeCompare(b.nome));

    let colunasDinamicas = ['Paciente', 'Nasc.'];
    tubosConfig.forEach(t => {
        if (tubosAtivos.includes(t.id)) colunasDinamicas.push(t.sigla);
    });
    colunasDinamicas.push('Total');

    const bodyData = pacientesOrdenados.map(p => {
        let totalTubos = 0;
        let linha = [p.nome, p.dataNascimento.replace('| ', '').trim()];
        
        tubosConfig.forEach(t => {
            if (tubosAtivos.includes(t.id)) {
                linha.push(p[t.id] > 0 ? p[t.id] : '-');
                totalTubos += p[t.id];
            }
        });
        
        linha.push(totalTubos > 0 ? totalTubos : '-');
        return linha;
    });

    let columnStylesConfig = {
        0: { cellWidth: 60 },
        1: { halign: 'center', cellWidth: 22 }
    };

    for (let i = 2; i < colunasDinamicas.length - 1; i++) {
        columnStylesConfig[i] = { halign: 'center' };
    }
    columnStylesConfig[colunasDinamicas.length - 1] = { halign: 'center', fontStyle: 'bold' };

    doc.autoTable({
        startY: 28,
        head: [colunasDinamicas],
        body: bodyData,
        theme: 'grid',
        headStyles: { fillColor: [37, 99, 235], halign: 'center', fontSize: 10 },
        columnStyles: columnStylesConfig,
        styles: { fontSize: 9, cellPadding: 2, textColor: [50, 50, 50] },
        alternateRowStyles: { fillColor: [248, 250, 252] }
    });

    const nomePdf = `lista_coleta_${dataColeta.replace(/\//g, '-')}.pdf`;
    doc.save(nomePdf);
};