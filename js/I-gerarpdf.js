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

    window.open(URL.createObjectURL(doc.output("blob")));
};