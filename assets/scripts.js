const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

$(function () {
    let corSelecionada = null;
    let nomeSelecionado = null;
    let pinoArrastando = null;
    let offsetX = 0;
    let offsetY = 0;

    // Array para armazenar dados dos pinos
    let pinosData = [];
    let contadorPinos = 0; // IDs únicos

    // Quando começa a arrastar da tabela
    $('[data-item="equipamentos"]').on('dragstart', function(e) {
        corSelecionada = $(this).css("background-color");
        nomeSelecionado = $(this).data("name");
    });

    const imgContainer = $('#imgContainer');

    // Permitir soltar no mapa
    imgContainer.on('dragover', function(e) {
        e.preventDefault();
    });

    // Ao soltar da tabela no mapa
    imgContainer.on('drop', function(e) {
        e.preventDefault();
        if (!corSelecionada) return;

        const rect = this.getBoundingClientRect();
        const x = e.originalEvent.clientX - rect.left - 7;
        const y = e.originalEvent.clientY - rect.top - 7;

        criarPino(x, y, corSelecionada, nomeSelecionado);
    });

    function criarPino(x, y, cor, nome) {
        const id = 'pino-' + (++contadorPinos);

        const pino = $(`<div class="pino" draggable="false" data-bs-toggle="tooltip" data-bs-title="${nome}"></div>`)
            .css({
                backgroundColor: cor,
                color: cor,
                left: x + 'px',
                top: y + 'px'
            })
            .attr('data-color', cor)
            .attr('data-id', id)
            .attr('data-name', nome);

        imgContainer.append(pino);

        // Inicializa o tooltip para o novo pino
        new bootstrap.Tooltip(pino[0]);

        salvarPino(pino, id, nome);
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
        // Pega a instância do tooltip associada ao elemento
        const tooltipInstance = bootstrap.Tooltip.getInstance($pino[0]);
        if (tooltipInstance) {
            tooltipInstance.dispose();  // destrói o tooltip
        }
        
        const id = $pino.data('id');
        pinosData = pinosData.filter(p => p.id !== id);
        $pino.remove();
        atualizarEstadoBotaoLimpar();
        console.log("Pinos após remoção:", pinosData);
    }

    // Mousedown para iniciar arraste (delegação)
    $(document).on('mousedown', '.pino', function(e) {
        pinoArrastando = $(this);
        const rect = this.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
    });

    // Mousemove para arrastar
    $(document).on('mousemove', function(e) {
        if (pinoArrastando) {
            const rectMapa = imgContainer[0].getBoundingClientRect();
            let x = e.clientX - rectMapa.left - offsetX;
            let y = e.clientY - rectMapa.top - offsetY;

            // Limitar dentro do mapa
            x = Math.max(0, Math.min(x, imgContainer.width() - 14));
            y = Math.max(0, Math.min(y, imgContainer.height() - 14));

            pinoArrastando.css({ left: x + 'px', top: y + 'px' });
            atualizarPosicaoPino(pinoArrastando);
        }
    });

    // impede duplicar por drag HTML5
    $(document).on('dragstart', '.pino', function(e) {
        e.preventDefault(); 
    });

    // Mouseup para soltar o pino
    $(document).on('mouseup', function() {
        pinoArrastando = null;        
    });

    // Duplo clique para remover (delegação)
    $(document).on('dblclick', '.pino', function() {
        removerPino($(this));
    });

    function atualizarEstadoBotaoLimpar() {
        if (pinosData.length === 0) {
            $('#btnLimparPinos').attr('disabled', true);
        } else {
            $('#btnLimparPinos').attr('disabled', false);
        }
    }

    // Botão para limpar todos os pinos
    $('#btnLimparPinos').on('click', function () {
        if (confirm('Tem certeza que quer apagar todos os pinos do mapa?')) {
            $('.pino').remove();
            pinosData = [];
            console.log("Todos os pinos foram removidos.");
        }
    });

    atualizarEstadoBotaoLimpar();
});
