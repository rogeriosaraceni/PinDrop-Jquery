# pinDrop

Projeto para adicionar, mover e remover pinos coloridos sobre uma imagem/mapa com suporte a tooltips e botão para limpar todos os pinos.

## Funcionalidades

- Arrastar itens da tabela para o mapa para criar pinos coloridos.
- Mover os pinos dentro da área do mapa.
- Remover pinos com duplo clique.
- Mostrar tooltip com o nome do pino.
- Botão para limpar todos os pinos.
- Botão habilitado/desabilitado conforme existem pinos no mapa.

## Como usar

### Requisitos

- jQuery 3.x
- Bootstrap 5.x (CSS e JS)
- Imagem de fundo no container do mapa (`#imgContainer`)
- Botão para limpar pinos com id `btnLimparPinos`


### Exemplo básico de uso

```html
<div id="imgContainer" style="width: 100%; height: 300px; position: relative; background: url('mapa.jpg') no-repeat center / contain;"></div>

<button id="btnLimparPinos" class="btn btn-danger mb-3">Limpar Todos os Pinos</button>

<table>
    <tbody>
        <tr data-item="equipamentos" data-name="TOTENS" style="background-color: #000;" draggable="true">
            <td>TOTENS</td>
        </tr>
        <!-- mais itens -->
    </tbody>
</table>