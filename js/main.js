const telas = {
    inicial: document.getElementById('tela-inicial'),
    jogadores: document.getElementById('tela-jogadores'),
    jogo: document.getElementById('tela-jogo')
};

const controles = {
    // Botões
    botaoJogar: document.getElementById('botao-jogar'),
    botaoConfiguracoes: document.getElementById('botao-configuracoes'),
    botaoIniciarPartida: document.getElementById('botao-iniciar-partida'),

    //Botões Painel Lateral
    botaoConfigLateral: document.getElementById('config-lateral'),
    botaoReiniciar: document.getElementById('reiniciar'),
    botaoNovoPartida: document.getElementById('nova-partida-lateral'),

    // Controles da Tela de Jogadores
    inputNome1: document.getElementById('input-nome1'),
    selectCor1: document.getElementById('select-cor1'),
    inputNome2: document.getElementById('input-nome2'),
    selectCor2: document.getElementById('select-cor2'),

    // Lista de Jogadas
    listaJogadas: document.getElementById('lista-jogadas'),

    //Lista Capturadas
    capturadasBrancas: document.getElementById('capturadas-brancas'),
    capturadasPretas: document.getElementById('capturadas-pretas')
};

const modal = {
    fundo: document.getElementById('modal-fundo'),
    janelaConfig: document.getElementById('janela-config'),
    janelaFim: document.getElementById('janela-fim'),

    //Botões
    botaoFechar: document.getElementsByClassName('fechar'),
    botaoRevanche: document.getElementById('revanche'),
    botaoNovoPartida: document.getElementById('nova-partida-modal'),


    // Controles dentro do Modal Config
    checkCoordenadas: document.getElementById('check-coord'),
    checkDestacar: document.getElementById('check-destacar'),
    checkLances: document.getElementById('check-lances'),
    selectTema: document.getElementById('select-tema'),

    // Constroles dentro do Modal Fim
    estadoJogo: document.getElementById('estado'),
    causaJogo: document.getElementById('causa'),
};

let telaAtual = telas.inicial;

// Função para trocar de tela principal
function mudarTela(novaTela) {
    if (telaAtual) {
        telaAtual.style.display = 'none';
    }
    novaTela.style.display = 'flex';
    telaAtual = novaTela;
}

let modalAberto = null;

// Funções para controlar o modal
function abrirModal(janela) {
    modal.fundo.style.display = 'flex';
    janela.style.display = 'flex'
    modalAberto = janela;
}

function fecharModal() {
    modal.fundo.style.display = 'none';
    modalAberto.style.display = 'none'
}

// Lógica para os seletores de cor ficarem sincronizados
function sincronizarCores(seletorAlterado) {
    const outroSeletor = (seletorAlterado === controles.selectCor1) ? controles.selectCor2 : controles.selectCor1;

    if (seletorAlterado.value === 'branco') {
        outroSeletor.value = 'preto';
    } else if (seletorAlterado.value === 'preto') {
        outroSeletor.value = 'branco';
    } else if (seletorAlterado.value === 'aleatorio') {
        outroSeletor.value = 'aleatorio';
    }
}

// Ponto de partida pro jogo
function iniciarPartida() {
    mudarTela(telas.jogo);
    definirJogadores()
}

function definirJogadores() {
    const nome1 = controles.inputNome1.value;
    let cor1 = controles.selectCor1.value;
    const nome2 = controles.inputNome2.value;
    let cor2 = controles.selectCor2.value;

    jogadores = []
    if (cor1 == 'aleatorio') {
        cor1 = Math.floor(Math.random() * 2)
    } else {
        cor1 = (cor1 === 'branco') ? BRANCO : PRETO;
    }

    if (cor1 == BRANCO) {
        cor2 = PRETO
        jogadores.push(new Jogador(nome1, cor1))
        jogadores.push(new Jogador(nome2, cor2))
    } else {
        cor2 = BRANCO
        jogadores.push(new Jogador(nome2, cor2))
        jogadores.push(new Jogador(nome1, cor1))
    }

    let jogador1 = document.getElementById("jogador-brancas")
    jogador1.textContent = jogadores[BRANCO].nome
    let jogador2 = document.getElementById("jogador-pretas")
    jogador2.textContent = jogadores[PRETO].nome
}

// Botões dos menus
controles.botaoJogar.addEventListener('click', () => mudarTela(telas.jogadores));
controles.botaoConfiguracoes.addEventListener('click', () => abrirModal(modal.janelaConfig));
controles.botaoIniciarPartida.addEventListener('click', iniciarPartida);

//Botões do painel lateral
controles.botaoConfigLateral.addEventListener('click', () => abrirModal(modal.janelaConfig));
controles.botaoReiniciar.addEventListener('click', () => resetarJogo());
controles.botaoNovoPartida.addEventListener('click', () => {
    resetarJogo()
    mudarTela(telas.inicial)
});

// Seletores de cor
controles.selectCor1.addEventListener('change', () => sincronizarCores(controles.selectCor1));
controles.selectCor2.addEventListener('change', () => sincronizarCores(controles.selectCor2));

// Controles do modal
modal.botaoFechar[0].addEventListener('click', fecharModal);
modal.botaoFechar[1].addEventListener('click', fecharModal);
modal.botaoRevanche.addEventListener('click', () => {
    resetarJogo()
    fecharModal()
});
modal.botaoNovoPartida.addEventListener('click', () => {
    resetarJogo()
    mudarTela(telas.inicial)
    fecharModal()
});
modal.fundo.addEventListener('click', (evento) => {
    if (evento.target === modal.fundo) {
        fecharModal();
    }
});

// Listeners do modal
modal.checkCoordenadas.addEventListener('change', () => {
    mostrarCoordenadas = modal.checkCoordenadas.checked;
});
modal.checkDestacar.addEventListener('change', () => {
    mostrarDestacar = modal.checkDestacar.checked;
});
modal.checkLances.addEventListener('change', () => {
    mostrarLances = modal.checkLances.checked;
});

modal.selectTema.addEventListener('change', () => {
    definirCores(modal.selectTema.value)
});

function definirCores(cor) {
    if (cor == 'madeira') {
        cores.tabuleiroClaro = "#E9D08E";
        cores.tabuleiroEscuro = "#B06D38";
        document.documentElement.style.setProperty('--cor-menu-principal', '#52321A')
        document.documentElement.style.setProperty('--cor-menu-secundario', '#8b5832')
        document.documentElement.style.setProperty('--cor-menu-terceario', '#6C401E')
        document.documentElement.style.setProperty('--cor-menu-quarteario', '#5e3a1eaa')
        document.documentElement.style.setProperty('--cor-texto', '#DB7A30')
    } else if (cor == 'verdeBranco') {
        cores.tabuleiroEscuro = "#739552";
        cores.tabuleiroClaro = "#EBECD0";
        document.documentElement.style.setProperty('--cor-menu-principal', '#1E1E1B')
        document.documentElement.style.setProperty('--cor-menu-secundario', '#302E2B')
        document.documentElement.style.setProperty('--cor-menu-terceario', '#262522')
        document.documentElement.style.setProperty('--cor-menu-quarteario', '#31302daa')
        document.documentElement.style.setProperty('--cor-texto', '#739552')
    } else if (cor == 'pretoBranco') {
        cores.tabuleiroEscuro = "#1c1a1aff";
        cores.tabuleiroClaro = "#EBECD0";
        document.documentElement.style.setProperty('--cor-menu-principal', '#1E1E1B')
        document.documentElement.style.setProperty('--cor-menu-secundario', '#302E2B')
        document.documentElement.style.setProperty('--cor-menu-terceario', '#262522')
        document.documentElement.style.setProperty('--cor-menu-quarteario', '#31302daa')
        document.documentElement.style.setProperty('--cor-texto', '#DEDEDD')
    } 
}