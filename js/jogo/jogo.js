class Quadrado {
    constructor(posX, posY, peca) {
        this.posX = posX;
        this.posY = posY;

        this.peca = peca;
    }

    get x() {
        return this.posX * szQdr
    }

    get y() {
        return this.posY * szQdr
    }

    desenharQuadrado() {
        //Desenhar Fundo
        if ((this.posX + this.posY) % 2 == 0) fill(cores.tabuleiroClaro);
        else fill(cores.tabuleiroEscuro);
        rect(this.x, this.y, szQdr, szQdr);

        if (this.peca != SEM_PECA) {
            if (this.peca.ativa) {
                fill(cores.marcacao);
                rect(this.x, this.y, szQdr, szQdr)
            }
        }
    }

    desenharPeca() {
        //Desenhar Peça
        if (this.peca != SEM_PECA) {
            this.peca.desenhar();
        }

        //Desenhar Brilho por Mouse
        if (this.colisao()) {
            fill(255, 255, 255, 80);
            rect(this.x, this.y, szQdr, szQdr);
        }
    }

    colisao() {
        if (
            mouseX > this.x &&
            mouseX < this.x + szQdr &&
            mouseY > this.y &&
            mouseY < this.y + szQdr
        )
            return true;
        else return false;
    }

    //Vai no mousePressed
    ativarDesativar() {
        if (this.peca.cor == jogo.estado) {
            if (this.peca != SEM_PECA)
                if (this.colisao()) this.peca.mudarAtivo();
                else this.peca.desativar();
        }
        jogo.tabuleiro.atualizarPecaAtiva();
    }

    //Vai no mousePressed
    async jogar() {
        let pecaAtiva = jogo.tabuleiro.pecaAtiva;
        if (this.colisao()) {
            if (pecaAtiva != SEM_PECA) {
                let lances = jogo.tabuleiro.lancesLegaisAtivo;
                if (lances.some((n) => n[0] == this.posX && n[1] == this.posY)) {
                    //Guardar posição pré movimento
                    let origem;
                    origem = [pecaAtiva.posX, pecaAtiva.posY];

                    //Verificar se houve captura
                    let captura;
                    if (this.peca != SEM_PECA) captura = true;
                    else captura = false;

                    //------
                    //Mover
                    //------
                    pecaAtiva.mover([this.posX, this.posY]);

                    //Guardar posição pós movimento
                    let destino;
                    destino = [this.posX, this.posY];

                    //Verificar se houve promoção, caso haja, atualizar a variável e criar um menu para o usuario selecionar qual peça o peão irá ser promovido e pausar o código até a seleção
                    let promocao;
                    promocao = false;
                    if (pecaAtiva.tipo == PEAO)
                        if (pecaAtiva.posY == 0 || pecaAtiva.posY == 7) {
                            await hud.criarPromocao(pecaAtiva);
                            pecaAtiva = jogo.tabuleiro.quadrados[this.posX][this.posY].peca;
                            promocao = true;
                        }

                    //------
                    //ROQUE
                    //------
                    let linha, linhaOposta;
                    let corContraria = corOposta(pecaAtiva.cor);
                    if (pecaAtiva.cor == BRANCO) {
                        linha = 7;
                        linhaOposta = 0;
                    } else {
                        linha = 0;
                        linhaOposta = 7;
                    }

                    let roque = SEM_ROQUE;
                    if (pecaAtiva.tipo == REI) {
                        if (origem[0] == 4 && origem[1] == linha) {
                            //Roque Menor
                            if (destino[0] == 6 && destino[1] == linha) {
                                jogo.tabuleiro.quadrados[7][linha].peca.mover([5, linha]);
                                roque = ROQUE_MENOR
                            }
                            //Roque Maior
                            if (destino[0] == 2 && destino[1] == linha) {
                                jogo.tabuleiro.quadrados[0][linha].peca.mover([3, linha]);
                                roque = ROQUE_MAIOR
                            }
                        }
                    }

                    //--------
                    //Passant
                    //--------
                    let direcao;
                    if (pecaAtiva.cor == BRANCO) direcao = 1;
                    else direcao = -1;
                    if (pecaAtiva.tipo == PEAO) {
                        if (destino[0] == origem[0] + 1 || destino[0] == origem[0] - 1) {
                            if (!captura) {
                                captura = true;
                                pecaAtiva.capturar(jogo.tabuleiro.quadrados[this.posX][this.posY + direcao].peca)
                            }
                        }
                    }

                    //--------------------------------------------
                    //Guardar informações relevantes no histórico
                    //--------------------------------------------
                    //Guardar lance
                    let lance = jogo.historico.lance(
                        pecaAtiva,
                        origem,
                        destino,
                        captura,
                        promocao,
                        roque
                    );

                    jogo.historico.guardarLance(lance);

                    //Guardar se houve movimentos que quebram condições do roque
                    //Torres
                    if (pecaAtiva.tipo == TORRE) {
                        if (origem[0] == 0 && origem[1] == linha)
                            jogo.historico.moveuTorreEsquerda[pecaAtiva.cor] = true;
                        if (origem[0] == 7 && origem[1] == linha)
                            jogo.historico.moveuTorreDireita[pecaAtiva.cor] = true;
                    } else {
                        if (destino[0] == 0 && destino[1] == linhaOposta)
                            jogo.historico.moveuTorreEsquerda[corContraria] = true;
                        if (destino[0] == 7 && destino[1] == linhaOposta)
                            jogo.historico.moveuTorreDireita[corContraria] = true;
                    }

                    //Rei
                    if (pecaAtiva.tipo == REI)
                        if (origem[0] == 4 && origem[1] == linha)
                            jogo.historico.moveuRei[pecaAtiva.cor] = true;

                    //Muda a vez
                    jogo.mudarVez();

                    //Mapear
                    jogo.historico.guardarMapa(jogo.historico.mapear())

                    //Seguir com o jogo
                    pecaAtiva.desativar();
                    jogo.testarEmpate();
                    jogo.testarVitoria();
                }
            }
        }
    }
}

class Tabuleiro {
    constructor() {
        this.gerarQuadrados();
        this.gerarPecas();
        this.pecaAtiva = SEM_PECA;
        this.lancesLegaisAtivo = [];
    }

    desenhar() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.quadrados[i][j].desenharQuadrado();
            }
            if (mostrarCoordenadas) {
                this.desenharNumeros(i);
                this.desenharLetras(i);
            }
        }

        this.desenharDestaque()

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.quadrados[i][j].desenharPeca();
            }
        }


        this.desenharInfos();
    }

    desenharNumeros(i) {
        textSize(szTab / 40);
        textAlign(LEFT, TOP);
        if (i % 2 == 1) fill(cores.tabuleiroClaro);
        else fill(cores.tabuleiroEscuro);
        text(8 - i, 2, 2 + i * szQdr);
    }

    desenharLetras(i) {
        textSize(szTab / 40);
        textAlign(RIGHT, BOTTOM);
        if (i % 2 == 0) fill(cores.tabuleiroClaro);
        else fill(cores.tabuleiroEscuro);
        text(abc.charAt(i), szQdr + szQdr * i - 2, szTab - 2);
    }

    desenharInfos() {
        if (this.pecaAtiva != SEM_PECA) {
            //Possibilidades de jogada
            if (mostrarLances) {
                let lances = this.lancesLegaisAtivo;
                for (let i = 0; i < lances.length; i++) {
                    let x = lances[i][0] * szQdr;
                    let y = lances[i][1] * szQdr;
                    if (this.quadrados[lances[i][0]][lances[i][1]].peca == SEM_PECA) {
                        fill(200, 200, 200, 60);
                        rect(x, y, szQdr, szQdr);
                        fill(255, 255, 255, 120);
                        circle(x + szQdr / 2, y + szQdr / 2, szQdr / 3);
                    } else {
                        noFill()
                        stroke(255, 255, 255, 120);
                        strokeWeight(szTab/60)
                        circle(x + szQdr / 2, y + szQdr / 2, szQdr * 0.85);
                        noStroke()
                    }
                }
            }
        }
    }

    desenharDestaque() {
        if (mostrarDestacar) {
            let ultimoLance = jogo.historico.ultimoLance;
            if (ultimoLance != undefined) {
                fill(cores.marcacao);
                rect(ultimoLance.origem[0] * szQdr, ultimoLance.origem[1] * szQdr, szQdr, szQdr)
                rect(ultimoLance.destino[0] * szQdr, ultimoLance.destino[1] * szQdr, szQdr, szQdr)
            }
        }
    }

    gerarQuadrados() {
        //Criando quadrados vazios
        this.quadrados = [];
        for (let i = 0; i < 8; i++) {
            this.quadrados[i] = [];
            for (let j = 0; j < 8; j++) {
                this.quadrados[i][j] = new Quadrado(i, j, -1);
            }
        }
    }

    gerarPecas() {
        for (let i = 0; i < 2; i++) {
            //Peões
            for (let j = 0; j < 8; j++) {
                this.quadrados[j][1 + i * 5].peca = new Peao(1 - i, j, 1 + i * 5);
            }

            //Torres
            this.quadrados[0][i * 7].peca = new Torre(1 - i, 0, i * 7);
            this.quadrados[7][i * 7].peca = new Torre(1 - i, 7, i * 7);

            //Cavalos
            this.quadrados[1][i * 7].peca = new Cavalo(1 - i, 1, i * 7);
            this.quadrados[6][i * 7].peca = new Cavalo(1 - i, 6, i * 7);

            //Bispos
            this.quadrados[2][i * 7].peca = new Bispo(1 - i, 2, i * 7);
            this.quadrados[5][i * 7].peca = new Bispo(1 - i, 5, i * 7);

            //Rainha
            this.quadrados[3][i * 7].peca = new Rainha(1 - i, 3, i * 7);

            //Rei
            this.quadrados[4][i * 7].peca = new Rei(1 - i, 4, i * 7);
        }
    }

    pecas(cor) {
        let pecas = [];
        //Coletar as peças
        for (let i = 0; i < 8; i++)
            for (let j = 0; j < 8; j++) {
                if (this.quadrados[i][j].peca != SEM_PECA)
                    if (this.quadrados[i][j].peca.cor == cor)
                        pecas.push(this.quadrados[i][j].peca);
            }
        return pecas;
    }

    ameacas(cor) {
        let pecas = this.pecas(cor);

        let ameacas = [];
        let lances;
        //Pegar os ameaçados
        for (let i = 0; i < pecas.length; i++) {
            lances = pecas[i].possiveisLances();
            for (let j = 0; j < lances.length; j++) {
                if (!ameacas.some((n) => n[0] == lances[j][0] && n[1] == lances[j][1]))
                    ameacas.push(lances[j]);
            }
        }

        return ameacas;
    }

    //Ameaças sem puxar os movimentos do rei, útil em roque
    ameacasSemRei(cor) {
        let pecas = this.pecas(cor);

        let ameacas = [];
        let lances = [];
        //Pegar os ameaçados
        for (let i = 0; i < pecas.length; i++) {
            if (pecas[i].tipo != REI) lances = pecas[i].possiveisLances();
            for (let j = 0; j < lances.length; j++) {
                if (!ameacas.some((n) => n[0] == lances[j][0] && n[1] == lances[j][1]))
                    ameacas.push(lances[j]);
            }
        }

        return ameacas;
    }

    lances(cor) {
        let pecas = this.pecas(cor);

        let lancesFinal = [];
        let lancesPeca;
        for (let i = 0; i < pecas.length; i++) {
            lancesPeca = pecas[i].lancesLegais();
            for (let j = 0; j < lancesPeca.length; j++) {
                if (
                    !lancesFinal.some(
                        (n) => n[0] == lancesPeca[j][0] && n[1] == lancesPeca[j][1]
                    )
                )
                    lancesFinal.push(lancesPeca[j]);
            }
        }

        return lancesFinal;
    }

    xeque(cor) {
        //Achar rei
        let rei;
        for (let i = 0; i < 8; i++)
            for (let j = 0; j < 8; j++) {
                if (this.quadrados[i][j].peca != SEM_PECA)
                    if (
                        this.quadrados[i][j].peca.tipo == REI &&
                        this.quadrados[i][j].peca.cor == cor
                    )
                        rei = this.quadrados[i][j].peca;
            }

        if (cor == 0)
            return this.ameacas(1).some((n) => n[0] == rei.posX && n[1] == rei.posY);
        else
            return this.ameacas(0).some((n) => n[0] == rei.posX && n[1] == rei.posY);
    }

    xequeMate(cor) {
        if (this.xeque(cor) && this.lances(cor).length <= 0) return true;
        else return false;
    }

    afogamento(cor) {
        if (!this.xeque(cor) && this.lances(cor).length <= 0) return true;
        else return false;
    }

    faltaMaterial() {
        const pecasBrancas = this.pecas(BRANCO)
        const pecasPretas = this.pecas(PRETO)

        if (pecasBrancas.length <= 2 && pecasPretas.length <= 2) {
            //Definindo peças sobrandos
            let pecaSobrando = [SEM_PECA, SEM_PECA]

            for (let i = 0; i < pecasBrancas.length; i++) {
                if (pecasBrancas[i].tipo == CAVALO) pecaSobrando[BRANCO] = pecasBrancas[i]
                else if (pecasBrancas[i].tipo == BISPO) pecaSobrando[BRANCO] = pecasBrancas[i]
            }
            for (let i = 0; i < pecasPretas.length; i++) {
                if (pecasPretas[i].tipo == CAVALO) pecaSobrando[PRETO] = pecasPretas[i]
                else if (pecasPretas[i].tipo == BISPO) pecaSobrando[PRETO] = pecasPretas[i]
            }

            if (pecaSobrando[BRANCO] == SEM_PECA) {
                if (pecaSobrando[PRETO] == SEM_PECA) return true;
                else {
                    if (pecaSobrando[PRETO].tipo == BISPO || pecaSobrando[PRETO].tipo == CAVALO) return true;
                    else return false
                }
            } else {
                if (pecaSobrando[PRETO] == SEM_PECA) {
                    if (pecaSobrando[BRANCO].tipo == BISPO || pecaSobrando[BRANCO].tipo == CAVALO) return true;
                    else return false
                } if (pecaSobrando[BRANCO].tipo == BISPO && pecaSobrando[PRETO].tipo == BISPO) {
                    if ((pecaSobrando[BRANCO].posX + pecaSobrando[BRANCO].posY) % 2 == (pecaSobrando[PRETO].posX + pecaSobrando[PRETO].posY) % 2) return true;
                    else return false
                } else return false
            }
        } else return false;
    }

    suicidioRei(peca, posicaoSimulada) {
        const posicaoOriginal = [peca.posX, peca.posY];
        let pecaDestruida = this.quadrados[posicaoSimulada[0]][posicaoSimulada[1]]
            .peca;
        let suicidio;

        this.quadrados[peca.posX][peca.posY].peca.moverSimulado(posicaoSimulada);

        if (this.xeque(peca.cor)) suicidio = true;
        else suicidio = false;

        this.quadrados[peca.posX][peca.posY].peca.moverSimulado(posicaoOriginal);

        if (pecaDestruida != SEM_PECA)
            this.quadrados[posicaoSimulada[0]][
                posicaoSimulada[1]
            ].peca = pecaDestruida;

        return suicidio;
    }

    atualizarPecaAtiva() {
        let pecaAtiva;
        pecaAtiva = SEM_PECA;
        for (let i = 0; i < 8; i++)
            for (let j = 0; j < 8; j++) {
                if (this.quadrados[i][j].peca != SEM_PECA)
                    if (this.quadrados[i][j].peca.ativa) {
                        pecaAtiva = this.quadrados[i][j].peca;
                    }
            }
        this.pecaAtiva = pecaAtiva;
        if (pecaAtiva != SEM_PECA)
            this.lancesLegaisAtivo = pecaAtiva.lancesLegais();
    }
}

class Jogo {
    constructor() {
        this.tabuleiro = new Tabuleiro();
        this.historico = new Historico();
        this.estado = 0;
        this.causa = "";
    }

    interacaoMouse() {
        if (this.estado == BRANCO || this.estado == PRETO) {
            for (let i = 0; i < 8; i++)
                for (let j = 0; j < 8; j++) {
                    this.tabuleiro.quadrados[i][j].jogar();
                }

            for (let i = 0; i < 8; i++)
                for (let j = 0; j < 8; j++) {
                    this.tabuleiro.quadrados[i][j].ativarDesativar();
                }
        }
    }

    mudarVez() {
        if (this.estado == BRANCO) this.estado = PRETO;
        else if (this.estado == PRETO) this.estado = BRANCO;
    }

    testarVitoria() {
        if (this.tabuleiro.xequeMate(BRANCO)) {
            this.estado = VITORIA_PRETO;
            this.causa = "preto por Xeque-Mate"
        }

        if (this.tabuleiro.xequeMate(PRETO)) {
            this.estado = VITORIA_BRANCO;
            this.causa = "branco por Xeque-Mate"
        }

        if (this.estado == VITORIA_BRANCO || this.estado == VITORIA_PRETO) {
            modal.estadoJogo.textContent = "Vitória";
            modal.causaJogo.textContent = this.causa
            abrirModal(modal.janelaFim)
        }
    }

    testarEmpate() {
        if (this.tabuleiro.afogamento(BRANCO) || this.tabuleiro.afogamento(PRETO)) {
            this.estado = EMPATE;
            this.causa = "por afogamento"
        } else if (this.tabuleiro.faltaMaterial()) {
            this.estado = EMPATE;
            this.causa = "por falta de material"
        } else if (this.historico.triplaRepeticao()) {
            this.estado = EMPATE;
            this.causa = "por tripla repetição"
        } else if (this.historico.contador100Lances >= 100) {
            this.estado = EMPATE;
            this.causa = "por regra dos 50 lances"
        }

        if (this.estado == EMPATE) {
            modal.estadoJogo.textContent = "Empate";
            modal.causaJogo.textContent = this.causa
            abrirModal(modal.janelaFim)
        }

    }

}

class Historico {
    constructor() {
        this.jogadas = [[]];
        this.jogadasNotacao = []
        this.mapeamento = []
        this.moveuTorreDireita = [false, false];
        this.moveuTorreEsquerda = [false, false];
        this.moveuRei = [false, false];
        this.contador100Lances = 0;
    }

    lance(peca, origem, destino, captura, promocao, roque) {
        //Definir cor contrária
        let corContraria = corOposta(peca.cor);

        //Coordenada em String no formato do xadrez
        let destinoString = posicaoEmString(destino[0], destino[1]);

        //Houve xeque / xeque-mate?
        let xeque = jogo.tabuleiro.xeque(corContraria);
        let xequeMate = jogo.tabuleiro.xequeMate(corContraria);

        //Peça em string
        let tipo = peca.tipo;
        let pecaString = tipoEmString(tipo, false)

        //Notação
        let notacao = "";
        let colunaString = abc.charAt(origem[0]);
        let linhaString = "" + (8 - origem[1])

        //Tipo peça
        if (!promocao) notacao += pecaString;

        //Desambiguação

        if (peca.tipo != PEAO && peca.tipo != REI) {
            let pecasDaCor = jogo.tabuleiro.pecas(peca.cor)
            //Pegar peças iguais
            let pecasIguais = []
            for (let i = 0; i < pecasDaCor.length; i++) {
                if (pecasDaCor[i].tipo == peca.tipo)
                    if (peca.posX != pecasDaCor[i].posX || peca.posY != pecasDaCor[i].posY) pecasIguais.push(pecasDaCor[i]);
            }

            //Pegar peças de ambiguidade
            let pecasAmbiguas = []

            peca.moverSimulado([origem[0], origem[1]])

            for (let i = 0; i < pecasIguais.length; i++) {
                if (pecasIguais[i].lancesLegais().some((n) => n[0] == destino[0] && n[1] == destino[1])) {
                    pecasAmbiguas.push(pecasIguais[i])
                }
            }

            peca.moverSimulado([destino[0], destino[1]])

            let mesmaColuna = false;
            let mesmaLinha = false;
            for (let i = 0; i < pecasAmbiguas.length; i++) {
                if (pecasAmbiguas[i].posX == origem[0]) mesmaColuna = true;
                if (pecasAmbiguas[i].posY == origem[1]) mesmaLinha = true;
            }

            if (pecasAmbiguas.length > 0) {
                if (mesmaLinha && mesmaColuna) {
                    notacao += colunaString + linhaString
                } else if (mesmaColuna) {
                    notacao += linhaString
                } else notacao += colunaString;
            }
        }

        //Captura
        if (captura) {

            if (peca.tipo == PEAO || promocao) notacao += colunaString;

            notacao += "x";
        }

        //Destino
        notacao += destinoString;

        //Promoção
        if (promocao) notacao += "=" + pecaString;

        //Roque
        if (roque == ROQUE_MENOR) notacao = "O-O"
        else if (roque == ROQUE_MAIOR) notacao = "O-O-O"

        //Xeque / Xeque-Mate
        if (xequeMate) notacao += "#";
        else if (xeque) notacao += "+";

        //Retorna o lance em objeto
        return {
            tipo: tipo,
            cor: peca.cor,
            origem: origem,
            destino: destino,
            xeque: xeque,
            xequeMate: xequeMate,
            captura: captura,
            promocao: promocao,
            roque: roque,
            notacao: notacao,
        };
    }

    guardarLance(lance) {
        this.notacaoLateral(lance)
        
        if (lance.cor == BRANCO) {
            if (this.jogadas[this.jogadas.length - 1].length == 0) this.jogadas[0].push(lance);
            else this.jogadas.push([lance]);
        }
        else this.jogadas[this.jogadas.length - 1].push(lance);

        if (lance.tipo == PEAO) this.contador100Lances = 0;
        else if (lance.captura) this.contador100Lances = 0;
        else this.contador100Lances++;
    }

    notacaoLateral(lance) {
        if (lance.cor == BRANCO) {
            let jogada = document.createElement("div");
            jogada.className = "jogada";
            jogada.id = "" + (this.jogadasNotacao.length + 1);
            controles.listaJogadas.appendChild(jogada)
            let enumeracao = document.createElement("h4")
            enumeracao.className = "enumeracao";
            enumeracao.textContent = "" + (this.jogadasNotacao.length + 1) + "."
            jogada.appendChild(enumeracao)
            let lanceHtml = document.createElement("h4")
            lanceHtml.textContent = lance.notacao;
            jogada.appendChild(lanceHtml)
            this.jogadasNotacao.push(jogada)
        } else {
            let jogada = this.jogadasNotacao[this.jogadasNotacao.length-1]
            let lanceHtml = document.createElement("h4")
            lanceHtml.textContent = lance.notacao;
            jogada.appendChild(lanceHtml)
        }
    }

    get ultimaJogada() {
        return this.jogadas[this.jogadas.length - 1]
    }

    get ultimoLance() {
        return this.ultimaJogada[this.ultimaJogada.length - 1]
    }

    mapear() {
        let mapa = "";
        let peca;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                peca = jogo.tabuleiro.quadrados[j][i].peca;
                if (peca == SEM_PECA) mapa += SEM_PECA;
                else mapa += "" + tipoEmString(peca.tipo, true) + peca.cor;
            }
        }

        //Vez de quem
        mapa += " ";
        mapa += jogo.estado;

        //Direitos do Roque
        mapa += " ";
        if (this.moveuRei[BRANCO] == false) {
            if (this.moveuTorreEsquerda[BRANCO] == false) mapa += "1"
            else mapa += "0"
            if (this.moveuTorreDireita[BRANCO] == false) mapa += "1"
            else mapa += "0"
        } else mapa += "00"

        if (this.moveuRei[PRETO] == false) {
            if (this.moveuTorreEsquerda[PRETO] == false) mapa += "1"
            else mapa += "0"
            if (this.moveuTorreDireita[PRETO] == false) mapa += "1"
            else mapa += "0"
        } else mapa += "00"

        //Passant
        mapa += " ";
        let ultimoLance = this.ultimoLance
        if (ultimoLance != undefined) {
            if (ultimoLance.tipo == PEAO) {
                //Definir direção
                let direcao;
                if (ultimoLance.origem[1] == 1) direcao = -1;
                else direcao = 1;

                if ((ultimoLance.origem[1] == 1 && ultimoLance.destino[1] == 3) || (ultimoLance.origem[1] == 6 && ultimoLance.destino[1] == 4)) {
                    let corContraria = corOposta(ultimoLance.cor)
                    if (
                        (dentroTabuleiro(ultimoLance.destino[0] + 1, ultimoLance.destino[1]) &&
                            jogo.tabuleiro.quadrados[ultimoLance.destino[0] + 1][ultimoLance.destino[1]].peca != SEM_PECA &&
                            jogo.tabuleiro.quadrados[ultimoLance.destino[0] + 1][ultimoLance.destino[1]].peca.cor == corContraria &&
                            jogo.tabuleiro.quadrados[ultimoLance.destino[0] + 1][ultimoLance.destino[1]].peca.tipo == PEAO) ||
                        (dentroTabuleiro(ultimoLance.destino[0] - 1, ultimoLance.destino[1]) &&
                            jogo.tabuleiro.quadrados[ultimoLance.destino[0] - 1][ultimoLance.destino[1]].peca != SEM_PECA &&
                            jogo.tabuleiro.quadrados[ultimoLance.destino[0] - 1][ultimoLance.destino[1]].peca.cor == corContraria &&
                            jogo.tabuleiro.quadrados[ultimoLance.destino[0] - 1][ultimoLance.destino[1]].peca.tipo == PEAO)
                    ) mapa += posicaoEmString(ultimoLance.destino[0], ultimoLance.destino[1] + direcao)
                }
            }
        }

        return mapa;
    }

    triplaRepeticao() {
        let contagem;
        for (let i = 0; i < this.mapeamento.length - 2; i++) {
            contagem = 0;
            for (let j = 0; j < this.mapeamento.length; j++) {
                if (this.mapeamento[i] == this.mapeamento[j]) contagem++;
            }
            if (contagem >= 3) return true;
        }
        return false;
    }

    guardarMapa(mapa) {
        this.mapeamento.push(mapa);
    }
}