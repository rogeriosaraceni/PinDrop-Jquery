function pinDrop(options) {
    const imgContainer = $(options.imgContainerSelector);
    const removeAllButton = $(options.removeAllButtonSelector);
    const confirmMessage = options.confirmMessage || 'Do you really want to delete all pins?';

    let itemNameID = null;
    let itemColor = null;
    let itemTitle = null;
    let pinDragging = null;
    let offsetX = 0;
    let offsetY = 0;

    let pinsData = [];
    let contadorPinos = 0;

    /** -------------------------------------------------
    * Functions
    ----------------------------------------------------*/
    function updateStateClearButton() {
        if (pinsData.length === 0) {
            removeAllButton.attr('disabled', true);
        } else {
            removeAllButton.attr('disabled', false);
        }
    }

    function savePin($pin, id) {
        const pos = {
            id: id,
            nameid: String($pin.data('nameid')).toLowerCase(),
            title: $pin.data('title'),
            x: parseFloat($pin.css('left')),
            y: parseFloat($pin.css('top'))
        };
        pinsData.push(pos);
        updateStateClearButton();
        updateCounters();
        console.log("Current pins:", pinsData);
    }

    function updatePinPosition($pin) {
        const id = $pin.data('id');
        const idx = pinsData.findIndex(p => p.id === id);
        if (idx !== -1) {
            pinsData[idx].x = parseFloat($pin.css('left'));
            pinsData[idx].y = parseFloat($pin.css('top'));
        }
        updateStateClearButton();
        console.log("Updated pins:", pinsData);
    }

    function removePin($pin) {
        const tooltipInstance = bootstrap.Tooltip.getInstance($pin[0]);
        if (tooltipInstance) {
            tooltipInstance.dispose();
        }

        const id = $pin.data('id');
        pinsData = pinsData.filter(p => p.id !== id);
        $pin.remove();
        updateStateClearButton();
        updateCounters();
        console.log("Pins after removal:", pinsData);
    }

    function createPin(x, y, cor, nameid, title) {
        const id = 'pin-' + (++contadorPinos);

        const pin = $(`<div class="pin" draggable="false" data-bs-toggle="tooltip" title="${title}"></div>`)
            .css({
                left: x + 'px',
                top: y + 'px',
                backgroundColor: cor
            })
            .attr('data-id', id)
            .attr('data-nameid', nameid)
            .attr('data-title', title);

        imgContainer.append(pin);

        if (window.bootstrap?.Tooltip) {
            new bootstrap.Tooltip(pin[0]);
        }

        savePin(pin, id, nameid, title);
    }

    function updateCounters() {
        //Resets all counters in the tablea
        $('[data-selected]').text(0);

        //Count how many pins there are of each nameID
        const count = {};
        $.each(pinsData, function(_, pin) {
            const nameID = pin.nameid;
            count[nameID] = (count[nameID] || 0) + 1;
        });

        //Update table
        $.each(count, function(nameid, total) {
            $(`[data-selected="${nameid}"]`).text(total);
        });
    }

    /** -------------------------------------------------
    * Events
    ----------------------------------------------------*/
    $('[data-item="equipamentos"]').on('dragstart', function (e) {
        itemColor = $(this).css("background-color");
        itemNameID = $(this).data("nameid");
        itemTitle = $(this).data("title");
    });

    imgContainer.on('dragover', function(e) {
        e.preventDefault();
    });

    imgContainer.on('drop', function(e) {
        e.preventDefault();
        if (!itemColor) return;

        const rect = this.getBoundingClientRect();
        const x = e.originalEvent.clientX - rect.left - 7;
        const y = e.originalEvent.clientY - rect.top - 7;

        createPin(x, y, itemColor, itemNameID, itemTitle);
    });

    $(document).on('mousedown', '.pin', function(e) {
        pinDragging = $(this);
        const rect = this.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
    });

    $(document).on('mousemove', function(e) {
        if (pinDragging) {
            const rectMapa = imgContainer[0].getBoundingClientRect();
            let x = e.clientX - rectMapa.left - offsetX;
            let y = e.clientY - rectMapa.top - offsetY;

            x = Math.max(0, Math.min(x, imgContainer.width() - 14));
            y = Math.max(0, Math.min(y, imgContainer.height() - 14));

            pinDragging.css({ left: x + 'px', top: y + 'px' });
            updatePinPosition(pinDragging);
        }
    });

    $(document).on('dragstart', '.pin', function(e) {
        e.preventDefault();
    });

    $(document).on('mouseup', function() {
        pinDragging = null;
    });

    $(document).on('dblclick', '.pin', function() {
        removePin($(this));
    });

    removeAllButton.on('click', function() {
        if (confirm(confirmMessage)) {
            $('.pin').each(function() {
                const tooltipInstance = bootstrap.Tooltip.getInstance(this);
                if (tooltipInstance) tooltipInstance.dispose();
            });
            $('.pin').remove();
            pinsData = [];
            updateStateClearButton();
            updateCounters();
            console.log("All pins have been removed.");
        }
    });

    /** -------------------------------------------------
    * Initial state of the button
    ----------------------------------------------------*/
    updateStateClearButton();
}