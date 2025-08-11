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

    const img = $('#imgContainer');

    // Permitir soltar no mapa
    img.on('dragover', function(e) {
        e.preventDefault();
    });

    // Ao soltar da tabela no mapa
    img.on('drop', function(e) {
        e.preventDefault();
        if (!corSelecionada) return;

        const rect = this.getBoundingClientRect();
        const x = e.originalEvent.clientX - rect.left - 7;
        const y = e.originalEvent.clientY - rect.top - 7;

        criarPino(x, y, corSelecionada, nomeSelecionado);
    });

    function criarPino(x, y, cor, nome) {
        const id = 'pino-' + (++contadorPinos);

        const pino = $(`
            <div class="pino" draggable="false" data-bs-toggle="tooltip" data-bs-title="${nome}"></div>
            `)
            .css({
                backgroundColor: cor,
                color: cor,
                left: x + 'px',
                top: y + 'px'
            })
            .attr('data-color', cor)
            .attr('data-id', id)
            .attr('data-name', nome);

        img.append(pino);

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
        console.log("Pinos atuais:", pinosData);
    }

    function atualizarPosicaoPino($pino) {
        const id = $pino.data('id');
        const idx = pinosData.findIndex(p => p.id === id);
        if (idx !== -1) {
            pinosData[idx].x = parseFloat($pino.css('left'));
            pinosData[idx].y = parseFloat($pino.css('top'));
        }
        console.log("Pinos atualizados:", pinosData);
    }

    function removerPino($pino) {
        const id = $pino.data('id');
        pinosData = pinosData.filter(p => p.id !== id);
        $pino.remove();
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
            const rectMapa = img[0].getBoundingClientRect();
            let x = e.clientX - rectMapa.left - offsetX;
            let y = e.clientY - rectMapa.top - offsetY;

            // Limitar dentro do mapa
            x = Math.max(0, Math.min(x, img.width() - 14));
            y = Math.max(0, Math.min(y, img.height() - 14));

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
});
