window.gerarEtiquetasPDF = function() {
    let totalEtiquetas = 0;
    state.pacientes.forEach(p => totalEtiquetas += (p.amarelo + p.roxo + p.cinza + p.azul + p.frasco));

    if (totalEtiquetas === 0) {
        alert("Não existem etiquetas selecionadas. Adicione tubos aos pacientes antes de imprimir.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: [195, 305] });

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

    const marginX = 12; 
    const marginY = 1; 
    const labelW = 89; 
    const labelH = 23; 
    const gapX = 2; 
    const gapY = 2.25; 
    const padding = 4.5; 

    const labelsPorColuna = 12;
    const labelsPorPagina = 24;

    etiquetas.forEach((etiq, index) => {
        const itemPage = index % labelsPorPagina;
        
        if (index > 0 && itemPage === 0) {
            doc.addPage();
        }

        const col = Math.floor(itemPage / labelsPorColuna);
        const row = itemPage % labelsPorColuna;

        const x = marginX + col * (labelW + gapX);
        const y = marginY + row * (labelH + gapY);

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);

        let linhasNome = doc.splitTextToSize(etiq.paciente, labelW - padding * 2 - 8);
        if (linhasNome.length > 2) linhasNome = linhasNome.slice(0, 2);

        linhasNome.forEach((linha, i) => {
            doc.text(linha, x + padding, y + padding + 3 + (i * 4));
        });

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(80, 80, 80);
        doc.text(etiq.nascimento, x + padding, y + labelH - padding);

        doc.setFontSize(6);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(etiq.tuboCor[0], etiq.tuboCor[1], etiq.tuboCor[2]);
        doc.text(etiq.tuboNome, x + labelW - padding - 1.5, y + labelH - padding, { angle: 90 });
    });

    window.open(URL.createObjectURL(doc.output("blob")));
};