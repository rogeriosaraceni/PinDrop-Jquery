# pinDrop Jquery

**pinDrop** é um plugin em jQuery que permite arrastar e soltar pinos sobre uma imagem (mapa), podendo movê-los, removê-los, contar quantos existem por categoria e limpar todos de uma vez.  
Ideal para mapas interativos, plantas baixas ou qualquer aplicação visual que exija posicionamento dinâmico de marcadores.

---

## 📦 Dependências
- [jQuery](https://jquery.com/) (>= 3.0)
- [Bootstrap Tooltip](https://getbootstrap.com/docs/5.3/components/tooltips/) (opcional, apenas se quiser usar tooltips)

---

## 🚀 Inicialização

```javascript
pinDrop({
    mapaSelector: '#mapa',                 // Elemento que receberá os pinos
    botaoLimparSelector: '#btnLimparPinos' // Botão para limpar todos os pinos
});

<!-- Elementos arrastáveis -->
<div data-item="pino" data-nome="Loja A">🛒</div>
<div data-item="pino" data-nome="Loja B">🏬</div>

<!-- Mapa onde os pinos serão soltos -->
<div id="mapa" style="width: 600px; height: 400px; position: relative; background: #eee;"></div>

<!-- Botão para limpar todos os pinos -->
<button id="btnLimparPinos" disabled>Limpar Pinos</button>

<!-- Tabela de contagem (opcional) -->
<table>
    <tr>
        <td>Loja A:</td>
        <td data-selected="loja a">0</td>
    </tr>
    <tr>
        <td>Loja B:</td>
        <td data-selected="loja b">0</td>
    </tr>
</table>
```

## ⚙️ Funcionalidades
- Arrastar pinos da lista para o mapa
- Mover pinos dentro do mapa (mantendo dentro dos limites da imagem)
- Remover pino clicando com o botão direito (ou pressionando Alt + clique)
- Contador automático de pinos por categoria (data-selected="categoria")
- Botão limpar para remover todos os pinos de uma vez

## 🛠 Opções do pinDrop
| Opção                 | Tipo   | Padrão            | Descrição                                   |
| --------------------- | ------ | ----------------- | ------------------------------------------- |
| `mapaSelector`        | string | `#mapa`           | Seletor do elemento que receberá os pinos   |
| `botaoLimparSelector` | string | `#btnLimparPinos` | Seletor do botão para limpar todos os pinos |

## 📊 Função de contador
O plugin já inclui a função atualizarContadores() que busca todos os elementos com data-selected="categoria" e atualiza o valor com base nos pinos no mapa.
```html
<td data-selected="loja a">0</td>
```

## 📝 Observações
- O tooltip é removido automaticamente quando o pino é deletado.
- O botão "Limpar Pinos" é ativado/desativado conforme existam pinos no mapa.
- Caso o Bootstrap Tooltip não esteja presente, basta remover as partes relacionadas a ele no código.