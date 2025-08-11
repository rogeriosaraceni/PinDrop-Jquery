function pinDrop(options) {
    const imgContainer = $(options.mapaSelector);
    const btnLimpar = $(options.botaoLimparSelector);

    let corSelecionada = null;
    let nomeSelecionado = null;
    let pinoArrastando = null;
    let offsetX = 0;
    let offsetY = 0;

    let pinosData = [];
    let contadorPinos = 0;

    function atualizarEstadoBotaoLimpar() {
        if (pinosData.length === 0) {
            btnLimpar.attr('disabled', true);
        } else {
            btnLimpar.attr('disabled', false);
        }
    }

    function salvarPino($pino, id) {
        const pos = {
            id: id,
            x: parseFloat($pino.css('left')),
            y: parseFloat($pino.css('top')),
            cor: $pino.data('color'),
            nome: $pino.data('name')
        };

        pinosData.push(pos);
        atualizarEstadoBotaoLimpar();
        console.log("Pinos atuais:", pinosData);
    }

    function atualizarPosicaoPino($pino) {
        const id = $pino.data('id');
        const idx = pinosData.findIndex(p => p.id === id);
        if (idx !== -1) {
            pinosData[idx].x = parseFloat($pino.css('left'));
            pinosData[idx].y = parseFloat($pino.css('top'));
        }
        atualizarEstadoBotaoLimpar();
        console.log("Pinos atualizados:", pinosData);
    }

    function removerPino($pino) {
        const tooltipInstance = bootstrap.Tooltip.getInstance($pino[0]);
        if (tooltipInstance) {
            tooltipInstance.dispose();
        }

        const id = $pino.data('id');
        pinosData = pinosData.filter(p => p.id !== id);
        $pino.remove();
        atualizarEstadoBotaoLimpar();
        console.log("Pinos após remoção:", pinosData);
    }

    function criarPino(x, y, cor, nome) {
        const id = 'pino-' + (++contadorPinos);

        const pino = $(`<div class="pino" draggable="false" data-bs-toggle="tooltip" title="${nome}"></div>`)
            .css({
                backgroundColor: cor,
                left: x + 'px',
                top: y + 'px'
            })
            .attr('data-color', cor)
            .attr('data-id', id)
            .attr('data-name', nome);

        imgContainer.append(pino);

        new bootstrap.Tooltip(pino[0]);

        salvarPino(pino, id, nome);
    }

    // Eventos
    $('[data-item="equipamentos"]').on('dragstart', function(e) {
        corSelecionada = $(this).css("background-color");
        nomeSelecionado = $(this).data("name");
    });

    imgContainer.on('dragover', function(e) {
        e.preventDefault();
    });

    imgContainer.on('drop', function(e) {
        e.preventDefault();
        if (!corSelecionada) return;

        const rect = this.getBoundingClientRect();
        const x = e.originalEvent.clientX - rect.left - 7;
        const y = e.originalEvent.clientY - rect.top - 7;

        criarPino(x, y, corSelecionada, nomeSelecionado);
    });

    $(document).on('mousedown', '.pino', function(e) {
        pinoArrastando = $(this);
        const rect = this.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
    });

    $(document).on('mousemove', function(e) {
        if (pinoArrastando) {
            const rectMapa = imgContainer[0].getBoundingClientRect();
            let x = e.clientX - rectMapa.left - offsetX;
            let y = e.clientY - rectMapa.top - offsetY;

            x = Math.max(0, Math.min(x, imgContainer.width() - 14));
            y = Math.max(0, Math.min(y, imgContainer.height() - 14));

            pinoArrastando.css({ left: x + 'px', top: y + 'px' });
            atualizarPosicaoPino(pinoArrastando);
        }
    });

    $(document).on('dragstart', '.pino', function(e) {
        e.preventDefault();
    });

    $(document).on('mouseup', function() {
        pinoArrastando = null;
    });

    $(document).on('dblclick', '.pino', function() {
        removerPino($(this));
    });

    btnLimpar.on('click', function() {
        if (confirm('Tem certeza que quer apagar todos os pinos do mapa?')) {
            $('.pino').each(function() {
                const tooltipInstance = bootstrap.Tooltip.getInstance(this);
                if (tooltipInstance) tooltipInstance.dispose();
            });
            $('.pino').remove();
            pinosData = [];
            atualizarEstadoBotaoLimpar();
            console.log("Todos os pinos foram removidos.");
        }
    });

    // Estado inicial do botão
    atualizarEstadoBotaoLimpar();
}
