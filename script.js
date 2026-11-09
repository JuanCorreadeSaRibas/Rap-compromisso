"use strict";

// Avaliação: cada condição corresponde a um dos 12 campos.
const formulario = document.getElementById("glj_formulario");

function validarAvaliacao(evento) {
    evento.preventDefault();

    const nome = document.getElementById("glj_nome").value.trim();
    const email = document.getElementById("glj_email");
    const telefone = document.getElementById("glj_telefone").value.trim();
    const idade = Number(document.getElementById("glj_idade").value);
    const expressao = document.getElementById("glj_expressao").value;
    const data = document.getElementById("glj_data").value;
    const formato = document.getElementById("glj_formato").value;
    const contato = document.querySelector('input[name="glj_contato"]:checked');
    const nota = Number(document.getElementById("glj_nota").value);
    const impacto = document.getElementById("glj_impacto").value;
    const termos = document.getElementById("glj_termos").checked;
    const critica = document.getElementById("glj_critica").value.trim();

    // Confere telefone nacional com DDD e oito ou nove dígitos no número.
    const formatoTelefone = /^(?:\([1-9]\d\)|[1-9]\d) ?(?:9\d{4}|[2-5]\d{3})-?\d{4}$/;
    const hoje = new Date();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    const dataAtual = hoje.getFullYear() + "-" + mes + "-" + dia;

    if (nome.split(/\s+/).length < 2) {
        alert("Informe seu nome completo.");
    } else if (!email.value.trim() || !email.validity.valid) {
        alert("Informe um e-mail válido.");
    } else if (!formatoTelefone.test(telefone)) {
        alert("Informe um telefone com DDD, por exemplo (41) 99999-0000.");
    } else if (!Number.isInteger(idade) || idade < 1 || idade > 120) {
        alert("Informe uma idade inteira entre 1 e 120.");
    } else if (!expressao) {
        alert("Selecione a expressão pesquisada.");
    } else if (!data || data > dataAtual) {
        alert("Informe a data da experiência, até hoje.");
    } else if (!formato) {
        alert("Selecione o tipo de referência.");
    } else if (!contato || !contato.value) {
        alert("Informe onde teve contato com a referência.");
    } else if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
        alert("Informe uma nota inteira de 1 a 5.");
    } else if (!impacto) {
        alert("Selecione o impacto identificado.");
    } else if (!termos) {
        alert("Aceite os termos de uso.");
    } else if (critica.length < 10 || critica.length > 500) {
        alert("Escreva um comentário de 10 a 500 caracteres.");
    } else {
        alert("Registro validado com sucesso. Obrigado pela participação!");
        formulario.reset();
    }
}

formulario.addEventListener("submit", validarAvaliacao);

// Opção A: abas e cadastro de sugestões.
const abas = document.querySelectorAll(".glj_aba");

function ativarAba(abaAtiva) {
    abas.forEach((aba) => {
        const ativa = aba === abaAtiva;
        const painel = document.getElementById(aba.getAttribute("aria-controls"));
        aba.setAttribute("aria-selected", String(ativa));
        aba.tabIndex = ativa ? 0 : -1;
        painel.hidden = !ativa;
    });
}

abas.forEach((aba, indice) => {
    // Função anônima tradicional usada como callback.
    aba.addEventListener("click", function () {
        ativarAba(aba);
    });
    aba.addEventListener("keydown", (evento) => {
        let proximo = indice;
        if (evento.key === "ArrowRight") {
            proximo = (indice + 1) % abas.length;
        } else if (evento.key === "ArrowLeft") {
            proximo = (indice + abas.length - 1) % abas.length;
        } else if (evento.key === "Home") {
            proximo = 0;
        } else if (evento.key === "End") {
            proximo = abas.length - 1;
        } else {
            return;
        }
        evento.preventDefault();
        ativarAba(abas[proximo]);
        abas[proximo].focus();
    });
});

const sugestao = document.getElementById("glj_sugestao");

function cadastrarSugestao() {
    const texto = sugestao.value.trim();
    if (!texto) {
        alert("Digite um título para cadastrar a sugestão.");
        sugestao.focus();
        return;
    }

    const item = document.createElement("li");
    item.textContent = texto;
    document.getElementById("glj_sugestoes").appendChild(item);
    sugestao.value = "";
    sugestao.focus();
}

document.getElementById("glj_addSugestao").addEventListener("click", cadastrarSugestao);
sugestao.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
        cadastrarSugestao();
    }
});

// Opção B: busca sem distinguir acentos e respostas expansíveis.
const buscaFaq = document.getElementById("glj_faqSearch");
const categorias = document.querySelectorAll(".glj_categoria");

function normalizarBusca(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function filtrarFaq() {
    const termo = normalizarBusca(buscaFaq.value.trim());
    let total = 0;
    categorias.forEach((categoria) => {
        let encontrados = 0;
        categoria.querySelectorAll(".glj_pergunta").forEach((pergunta) => {
            const corresponde = normalizarBusca(pergunta.textContent).includes(termo);
            pergunta.hidden = !corresponde;
            if (corresponde) {
                encontrados++;
            }
        });
        categoria.hidden = encontrados === 0;
        total += encontrados;
    });
    document.getElementById("glj_semResultado").hidden = total > 0;
}

buscaFaq.addEventListener("input", filtrarFaq);
document.querySelectorAll(".glj_pergunta summary").forEach((resumo) => {
    resumo.addEventListener("click", () => {
        const atual = resumo.parentElement;
        if (!atual.open) {
            document.querySelectorAll(".glj_pergunta[open]").forEach((pergunta) => {
                pergunta.open = false;
            });
        }
    });
});

// Opção E: lista em memória. O filtro muda a exibição dos itens.
const itens = [];
const lista = document.getElementById("glj_lista");
const campoItem = document.getElementById("glj_item");
const filtro = document.getElementById("glj_filtro");

function criarBotao(texto, acao) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = texto;
    botao.addEventListener("click", acao);
    return botao;
}

function editarItem(item) {
    const novoTexto = prompt("Editar título (até 100 caracteres)", item.texto);
    if (novoTexto === null) {
        return;
    }

    const texto = novoTexto.trim();
    if (!texto || texto.length > 100) {
        alert("Informe um título de 1 a 100 caracteres.");
        return;
    }
    item.texto = texto;
    renderizarLista();
}

function renderizarLista() {
    lista.textContent = "";
    let concluidos = 0;
    let exibidos = 0;

    itens.forEach((item, indice) => {
        if (item.concluido) {
            concluidos++;
        }
        if ((filtro.value === "pendentes" && item.concluido) ||
            (filtro.value === "concluidos" && !item.concluido)) {
            return;
        }

        exibidos++;
        const linha = document.createElement("li");
        linha.className = "glj_itemLista";
        const titulo = document.createElement("span");
        titulo.textContent = item.texto;
        titulo.classList.toggle("glj_concluido", item.concluido);

        const acoes = document.createElement("div");
        acoes.className = "glj_acoes";
        acoes.append(
            criarBotao(item.concluido ? "Marcar pendente" : "Marcar concluído", () => {
                item.concluido = !item.concluido;
                renderizarLista();
            }),
            criarBotao("Editar", () => editarItem(item)),
            criarBotao("Excluir", () => {
                itens.splice(indice, 1);
                renderizarLista();
            })
        );
        linha.append(titulo, acoes);
        lista.appendChild(linha);
    });

    document.getElementById("glj_contador").textContent =
        itens.length + " no total · " + (itens.length - concluidos) +
        " pendentes · " + concluidos + " concluídos · " + exibidos + " exibidos";
    document.getElementById("glj_limpar").disabled = itens.length === 0;
}

document.getElementById("glj_formLista").addEventListener("submit", (evento) => {
    evento.preventDefault();
    const texto = campoItem.value.trim();
    if (!texto) {
        alert("Digite o nome do item.");
        return;
    }
    itens.push({ texto: texto, concluido: false });
    campoItem.value = "";
    filtro.value = "todos";
    renderizarLista();
    campoItem.focus();
});

filtro.addEventListener("change", renderizarLista);
document.getElementById("glj_limpar").addEventListener("click", () => {
    if (confirm("Apagar todos os itens da lista?")) {
        itens.length = 0;
        renderizarLista();
        campoItem.focus();
    }
});
renderizarLista();

