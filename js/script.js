/*
 * ============================================================
 * script.js — Sistema de Inventário Arcano de Valdrik
 * Escola SENAI — Desenvolvimento Web Front-End
 * Componente: Manipulação de Objetos, Arrays, Eventos e
 *             Circuitos Lógicos
 * ============================================================
 */

/* ── Requisito 1.1 / 1.2 / 1.3: Classe Item ─────────────────── */
class Item {
    constructor(id, nome, preco, categoria, quantidade, imagem) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
        this.categoria = categoria;
        this.quantidade = quantidade;
        this.imagem = imagem;
    }

    // Retorna o preço multiplicado pela quantidade atual
    calcularSubtotal() {
        return this.preco * this.quantidade;
    }
}

/* ── Requisito 1.4: Inventário Original (imutável como referência) ─ */
const inventarioOriginal = [
    new Item(1, "Espada de Aço Valiriano", 500, "Arma", 1, "espada sem fundo.png"),
    new Item(2, "Escudo de Carvalho", 180, "Armadura", 4, "escudo sem fundo.png"),
    new Item(3, "Poção de Cura Maior", 50, "Poções", 10, "cura sem fundo.png"),
    new Item(4, "Elixir de Mana Azul", 75, "Poções", 2, "elixir azul sem fundo.png"),
];

// Cópia de trabalho — recebe os novos itens e descontos
let mochilaExibicao = [...inventarioOriginal];

// Contador de IDs para novos itens
let proximoId = inventarioOriginal.length + 1;

// Largura atual da janela (capturada pelo sensor — Requisito 2.3)
let larguraAtual = window.innerWidth;

/* ── Seletores DOM ───────────────────────────────────────────── */
const painel = document.getElementById("painel");
const container = document.getElementById("exibirInventario");
const form = document.getElementById("formItem");
const btnDesconto = document.getElementById("btnDesconto");
const btnFiltroPocoes = document.getElementById("btnFiltroPocoes");
const btnMostrarTodos = document.getElementById("btnMostrarTodos");
const btnContarOuro = document.getElementById("btnContarOuro");
const resultadoOuro = document.getElementById("resultadoOuro");

/* ── Requisito 2.3: Sensor de Janela (onresize) ──────────────── */
function atualizarPainel() {
    larguraAtual = window.innerWidth;
    painel.textContent = `Largura: ${window.innerWidth}px | Altura: ${window.innerHeight}px`;
}

// Atualiza imediatamente e a cada redimensionamento
atualizarPainel();
window.onresize = atualizarPainel;

/* ── Requisito 3.1: Renderização com .forEach() ──────────────── */
function desenharMochilaNaTela(lista) {
    container.innerHTML = "";

    if (lista.length === 0) {
        container.innerHTML = `<p class="mensagem-vazia">⚠ Nenhum item encontrado na mochila...</p>`;
        return;
    }

    // Percorre o array obrigatoriamente com .forEach()
    lista.forEach((item) => {

        // Requisito 4.1: Alerta em Tempo Real — if condicional
        const ehCritico = item.quantidade < 3;

        // Requisito 4.2: Tag de Perigo com Operador Ternário (? :)
        const tagPerigo = ehCritico
            ? `<span class="tag-perigo">⚠ ACABANDO!</span>`
            : "";

        // Resolve o caminho da imagem (arquivo enviado vs padrão)
        const srcImagem = item.imagem instanceof File
            ? URL.createObjectURL(item.imagem)
            : `img/${item.imagem}`;

        // Monta o card do item
        const card = document.createElement("div");
        card.classList.add("card-item");

        // Injeta dinamicamente a classe .critico se necessário
        if (ehCritico) {
            card.classList.add("critico");
        }

        card.innerHTML = `
            <div class="card-item__imagem-wrapper">
                <img class="card-item__imagem"
                     src="${srcImagem}"
                     alt="${item.nome}"
                     onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 80 80%22><text y=%2250%22 font-size=%2250%22>⚔</text></svg>'">
                ${tagPerigo}
            </div>
            <div class="card-item__corpo">
                <p class="card-item__nome">${item.nome}</p>
                <p class="card-item__meta">Categoria: <strong>${item.categoria}</strong></p>
                <p class="card-item__preco">${item.preco.toFixed(2)} ouros</p>
            </div>
            <div class="card-item__rodape">
                <span class="card-item__subtotal">Subtotal: ${item.calcularSubtotal().toFixed(2)} 🪙</span>
                <span class="card-item__qtd">Qtd: ${item.quantidade}</span>
            </div>
        `;

        container.appendChild(card);
    });
}

// Renderização inicial
desenharMochilaNaTela(mochilaExibicao);

/* ── Requisito 2.1 / 2.2: Formulário — Comprar e Guardar ─────── */
form.addEventListener("submit", (evento) => {
    // Bloqueia o comportamento padrão de recarregar a página
    evento.preventDefault();

    const nomeInput = document.getElementById("nome").value.trim();
    // Sanitização e Tipagem com Number() — Requisito 2.2
    const precoInput = Number(document.getElementById("preco").value);
    const categoriaInput = document.getElementById("categoria").value.trim();
    const qtdInput = Number(document.getElementById("quantidade").value);
    const imagemInput = document.getElementById("imagem").files[0] || null;

    // Cria novo item a partir da classe Item
    const novoItem = new Item(
        proximoId++,
        nomeInput,
        precoInput,
        categoriaInput,
        qtdInput,
        imagemInput
    );

    mochilaExibicao.push(novoItem);

    desenharMochilaNaTela(mochilaExibicao);
    form.reset();

    // Reseta o resultado do ouro para forçar nova contagem
    resultadoOuro.textContent = "— moedas —";
    resultadoOuro.classList.remove("erro");
});

let descontoAplicado = false;

/* ── Requisito 3.2: Pechincha Arcana (.map()) ────────────────── */
    btnDesconto.addEventListener("click", () => {
    if (descontoAplicado === false) {
        const inventarioComDesconto = mochilaExibicao.map((item) => {
            return new Item(
                item.id,
                item.nome,
                item.preco * 0.9,
                item.categoria,
                item.quantidade,
                item.imagem
            );
        });
        descontoAplicado = true;
        mochilaExibicao = inventarioComDesconto;
        desenharMochilaNaTela(mochilaExibicao);

        resultadoOuro.textContent = "— moedas —";
        resultadoOuro.classList.remove("erro");

        // Liga a classe com o visual verde e gordo
        btnDesconto.classList.add("ativo");
    } 
    else {
        const inventarioComDesconto = mochilaExibicao.map((item) => {
            return new Item(
                item.id,
                item.nome,
                item.preco / 0.9,
                item.categoria,
                item.quantidade,
                item.imagem
            );
        });
        mochilaExibicao = inventarioComDesconto;
        desenharMochilaNaTela(mochilaExibicao);

        resultadoOuro.textContent = "— moedas —";
        resultadoOuro.classList.remove("erro");

        descontoAplicado = false;

        // Desliga a classe, voltando automaticamente para o roxo medieval original
        btnDesconto.classList.remove("ativo");
    }
});

/* ── Requisito 3.3: Visão Alquímica (.filter()) ──────────────── */
btnFiltroPocoes.addEventListener("click", () => {
    // .filter() retorna apenas itens cuja categoria === "Poções"
    const apenasPocoes = mochilaExibicao.filter(
        (item) => item.categoria === "Poções"
    );

    desenharMochilaNaTela(apenasPocoes);

    // Alterna visibilidade dos botões de filtro
    btnFiltroPocoes.style.display = "none";
    btnMostrarTodos.style.display = "inline-flex";
});

btnMostrarTodos.addEventListener("click", () => {
    desenharMochilaNaTela(mochilaExibicao);
    btnFiltroPocoes.style.display = "inline-flex";
    btnMostrarTodos.style.display = "none";
});

/* ── Requisito 4.3 / 4.4: Contar Ouro (for clássico + &&) ────── */
btnContarOuro.addEventListener("click", () => {

    // Trava de Proteção Lógica — Requisito 4.4
    // A contagem SÓ ocorre se: há itens E largura > 480px
    if (mochilaExibicao.length > 0 && larguraAtual > 480) {

        let totalOuro = 0;

        // Loop clássico obrigatório — Requisito 4.3
        for (let i = 0; i < mochilaExibicao.length; i++) {
            totalOuro += mochilaExibicao[i].calcularSubtotal();
        }

        resultadoOuro.textContent = `${totalOuro.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} ouros`;
        resultadoOuro.classList.remove("erro");

    } else if (larguraAtual <= 480) {
        // Janela muito pequena — exibe mensagem de erro
        resultadoOuro.textContent = "Erro: Tela muito pequena para abrir o baú!";
        resultadoOuro.classList.add("erro");

    } else {
        // Mochila vazia
        resultadoOuro.textContent = "A mochila está vazia!";
        resultadoOuro.classList.add("erro");
    }
});
