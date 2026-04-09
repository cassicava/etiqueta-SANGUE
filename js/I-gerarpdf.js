window.gerarEtiquetasPDF = function() {
    let totalEtiquetas = 0;
    state.pacientes.forEach(p => totalEtiquetas += (p.amarelo + p.roxo + p.cinza + p.azul + p.frasco));

    if (totalEtiquetas === 0) {
        alert("Não existem etiquetas selecionadas. Adicione tubos aos pacientes antes de imprimir.");
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
        const tubos = [
            { nome: 'AMARELO', qtd: p.amarelo, cor: [225, 29, 72] },
            { nome: 'ROXO', qtd: p.roxo, cor: [124, 58, 237] },
            { nome: 'CINZA', qtd: p.cinza, cor: [75, 85, 99] },
            { nome: 'AZUL', qtd: p.azul, cor: [37, 99, 235] },
            { nome: 'FRASCO', qtd: p.frasco, cor: [5, 150, 105] }
        ];

        tubos.forEach(t => {
            for (let i = 0; i < t.qtd; i++) {
                etiquetas.push({
                    paciente: p.nome,
                    nascimento: p.dataNascimento.replace('| ', '').trim(),
                    tuboNome: t.nome,
                    tuboCor: t.cor
                });
            }
        });
    });

    const labelsPorPagina = cfg.cols * cfg.rows;

    etiquetas.forEach((etiq, index) => {
        const itemPage = index % labelsPorPagina;
        
        if (index > 0 && itemPage === 0) {
            doc.addPage();
        }

        const col = Math.floor(itemPage / cfg.rows);
        const row = itemPage % cfg.rows;

        const x = cfg.marginLeft + col * (cfg.labelWidth + cfg.gapX);
        const y = cfg.marginTop + row * (cfg.labelHeight + cfg.gapY);

        doc.setFontSize(cfg.fontName);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);

        let linhasNome = doc.splitTextToSize(etiq.paciente, cfg.labelWidth - cfg.labelMarginLeft - cfg.labelMarginRight - 8);
        if (linhasNome.length > 2) linhasNome = linhasNome.slice(0, 2);

        linhasNome.forEach((linha, i) => {
            const ajusteLinhaY = cfg.fontName * 0.35;
            doc.text(linha, x + cfg.labelMarginLeft, y + cfg.labelMarginTop + ajusteLinhaY + (i * ajusteLinhaY * 1.2));
        });

        doc.setFontSize(cfg.fontDob);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(80, 80, 80);
        doc.text(etiq.nascimento, x + cfg.labelMarginLeft, y + cfg.labelHeight - cfg.labelMarginBottom);

        doc.setFontSize(cfg.fontType);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(etiq.tuboCor[0], etiq.tuboCor[1], etiq.tuboCor[2]);
        doc.text(etiq.tuboNome, x + cfg.labelWidth - cfg.labelMarginRight - 1.5, y + cfg.labelHeight - cfg.labelMarginBottom, { angle: 90 });
    });

    window.open(URL.createObjectURL(doc.output("blob")));
};