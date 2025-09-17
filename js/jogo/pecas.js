class Peca {
  constructor(cor, posX, posY) {
    this.cor = cor;
    this.posX = posX;
    this.posY = posY;
    this.ativa = false;
  }

  get imagem() {
    return imagens[this.tipo][this.cor];
  }

  get x() {
    return szQdr * this.posX;
  }

  get y() {
    return szQdr * this.posY;
  }

  desenhar() {
    image(
      this.imagem,
      this.x + szQdr / 2,
      this.y + szQdr * 0.58,
      szQdr * 0.8,
      szQdr * 0.8
    );
  }

  mudarAtivo() {
    this.ativa = !this.ativa;
  }

  desativar() {
    this.ativa = false;
  }

  capturada() {
    jogo.tabuleiro.quadrados[this.posX][this.posY].peca = SEM_PECA;
  }

  capturar(peca) {
    peca.capturada();
    
    //Adicionar à capturadas em jogadores
    if (peca.cor == BRANCO) {
      jogadores[PRETO].adicionarCapturadas(peca)
    }
    else {
      jogadores[BRANCO].adicionarCapturadas(peca)
    }
    
  }

  mover(posicao) {
    let novoX = posicao[0];
    let novoY = posicao[1];

    if (jogo.tabuleiro.quadrados[novoX][novoY].peca != SEM_PECA)
      this.capturar(jogo.tabuleiro.quadrados[novoX][novoY].peca);

    jogo.tabuleiro.quadrados[novoX][novoY].peca = this;
    jogo.tabuleiro.quadrados[this.posX][this.posY].peca = SEM_PECA;

    this.posX = novoX;
    this.posY = novoY;
  }

  moverSimulado(posicao) {
    let novoX = posicao[0];
    let novoY = posicao[1];

    if (jogo.tabuleiro.quadrados[novoX][novoY].peca != SEM_PECA)
      jogo.tabuleiro.quadrados[novoX][novoY].peca.capturada();

    jogo.tabuleiro.quadrados[novoX][novoY].peca = this;
    jogo.tabuleiro.quadrados[this.posX][this.posY].peca = SEM_PECA;

    this.posX = novoX;
    this.posY = novoY;
  }

  //Utilitária para Bispo, Torre e Rainha
  retaRecursiva(x, y, i, j) {
    x += i;
    y += j;
    if (x < 0 || x > 7 || y < 0 || y > 7) return [];

    if (jogo.tabuleiro.quadrados[x][y].peca != SEM_PECA) {
      if (jogo.tabuleiro.quadrados[x][y].peca.cor == this.cor) return [];
      else return [[x, y]];
    }

    let arrayFinal = [[x, y]];

    arrayFinal = arrayFinal.concat(this.retaRecursiva(x, y, i, j));

    return arrayFinal;
  }

  //Filtra os possíveis lances de uma peça tirando os que levariam a morte do rei imediata
  lancesLegais() {
    let lancesFiltradas = [];
    let lances = this.possiveisLances();

    for (let i = 0; i < lances.length; i++) {
      if (jogo.tabuleiro.suicidioRei(this, lances[i]) == false) {
        lancesFiltradas.push(lances[i]);
      }
    }

    return lancesFiltradas;
  }
}

class Peao extends Peca {
  constructor(cor, posX, posY) {
    super(cor, posX, posY);
    this.ponto = 1;
    this.tipo = PEAO;
  }

  possiveisLances() {
    //Definir diferenças de cor
    let yInicial, yInicialOposto, yFinal, direcao, direcaoOposta;
    if (this.cor == BRANCO) {
      yInicial = 6;
      yInicialOposto = 1;
      yFinal = 0;
      direcao = -1;
      direcaoOposta = 1;
    } else {
      yInicial = 1;
      yInicialOposto = 6;
      yFinal = 7;
      direcao = 1;
      direcaoOposta = -1;
    }

    let arrayFinal = [];

    //Frente
    if (
      dentroTabuleiro(this.posX, this.posY + direcao) &&
      jogo.tabuleiro.quadrados[this.posX][this.posY + direcao].peca == SEM_PECA
    )
      arrayFinal.push([this.posX, this.posY + direcao]);

    //2 casas se começar
    if (
      this.posY == yInicial &&
      jogo.tabuleiro.quadrados[this.posX][this.posY + direcao].peca ==
        SEM_PECA &&
      jogo.tabuleiro.quadrados[this.posX][this.posY + 2 * direcao].peca ==
        SEM_PECA
    )
      arrayFinal.push([this.posX, this.posY + 2 * direcao]);

    //Comer na diagonal
    for (let i = -1; i < 2; i += 2)
      if (dentroTabuleiro(this.posX + i, this.posY + direcao))
        if (
          jogo.tabuleiro.quadrados[this.posX + i][this.posY + direcao].peca !=
          SEM_PECA
        )
          if (
            jogo.tabuleiro.quadrados[this.posX + i][this.posY + direcao].peca
              .cor != this.cor
          )
            arrayFinal.push([this.posX + i, this.posY + direcao]);

    //Passant 
    let ultimoLance = jogo.historico.ultimoLance;
    if (ultimoLance != undefined)
    if (
      ultimoLance.tipo == PEAO &&
      ultimoLance.origem[1] == yInicialOposto &&
      ultimoLance.destino[1] == yInicialOposto + 2 * direcaoOposta
    )
      for (let i = -1; i < 2; i += 2)
        if (this.posX + i == ultimoLance.destino[0] && this.posY == yInicialOposto + 2 * direcaoOposta) {
          arrayFinal.push([this.posX + i, this.posY + direcao]);
        }
      
      return arrayFinal;
  }
}

class Cavalo extends Peca {
  constructor(cor, posX, posY) {
    super(cor, posX, posY);
    this.ponto = 3;
    this.tipo = CAVALO;
  }

  possiveisLances() {
    let arrayFinal = [];
    let arrayTemp = [
      [this.posX + 2, this.posY - 1],
      [this.posX + 2, this.posY + 1],
      [this.posX - 2, this.posY - 1],
      [this.posX - 2, this.posY + 1],
      [this.posX + 1, this.posY + 2],
      [this.posX - 1, this.posY + 2],
      [this.posX + 1, this.posY - 2],
      [this.posX - 1, this.posY - 2],
    ];

    for (let i = 0; i < 8; i++) {
      if (
        dentroTabuleiro(arrayTemp[i][0], arrayTemp[i][1]) &&
        (jogo.tabuleiro.quadrados[arrayTemp[i][0]][arrayTemp[i][1]].peca ==
          SEM_PECA ||
          jogo.tabuleiro.quadrados[arrayTemp[i][0]][arrayTemp[i][1]].peca.cor !=
            this.cor)
      )
        arrayFinal.push(arrayTemp[i]);
    }

    return arrayFinal;
  }
}

class Bispo extends Peca {
  constructor(cor, posX, posY) {
    super(cor, posX, posY);
    this.ponto = 3;
    this.tipo = BISPO;
  }

  possiveisLances() {
    let arrayFinal = [];

    arrayFinal = arrayFinal.concat(
      this.retaRecursiva(this.posX, this.posY, 1, 1),
      this.retaRecursiva(this.posX, this.posY, 1, -1),
      this.retaRecursiva(this.posX, this.posY, -1, 1),
      this.retaRecursiva(this.posX, this.posY, -1, -1)
    );

    return arrayFinal;
  }
}

class Torre extends Peca {
  constructor(cor, posX, posY) {
    super(cor, posX, posY);
    this.ponto = 5;
    this.tipo = TORRE;
  }

  possiveisLances() {
    let arrayFinal = [];

    arrayFinal = arrayFinal.concat(
      this.retaRecursiva(this.posX, this.posY, 1, 0),
      this.retaRecursiva(this.posX, this.posY, -1, 0),
      this.retaRecursiva(this.posX, this.posY, 0, 1),
      this.retaRecursiva(this.posX, this.posY, 0, -1)
    );

    return arrayFinal;
  }
}

class Rainha extends Peca {
  constructor(cor, posX, posY) {
    super(cor, posX, posY);
    this.ponto = 9;
    this.tipo = RAINHA;
  }

  possiveisLances() {
    let arrayFinal = [];

    arrayFinal = arrayFinal.concat(
      this.retaRecursiva(this.posX, this.posY, 1, 1),
      this.retaRecursiva(this.posX, this.posY, 1, -1),
      this.retaRecursiva(this.posX, this.posY, -1, 1),
      this.retaRecursiva(this.posX, this.posY, -1, -1),
      this.retaRecursiva(this.posX, this.posY, 1, 0),
      this.retaRecursiva(this.posX, this.posY, -1, 0),
      this.retaRecursiva(this.posX, this.posY, 0, 1),
      this.retaRecursiva(this.posX, this.posY, 0, -1)
    );

    return arrayFinal;
  }
}

class Rei extends Peca {
  constructor(cor, posX, posY) {
    super(cor, posX, posY);
    this.ponto = 0;
    this.tipo = REI;
  }

  possiveisLances() {
    let arrayFinal = [];
    let arrayTemp = [
      [this.posX + 1, this.posY + 1],
      [this.posX + 1, this.posY - 1],
      [this.posX - 1, this.posY + 1],
      [this.posX - 1, this.posY - 1],
      [this.posX + 1, this.posY],
      [this.posX - 1, this.posY],
      [this.posX, this.posY + 1],
      [this.posX, this.posY - 1],
    ];

    for (let i = 0; i < 8; i++) {
      if (
        dentroTabuleiro(arrayTemp[i][0], arrayTemp[i][1]) &&
        (jogo.tabuleiro.quadrados[arrayTemp[i][0]][arrayTemp[i][1]].peca ==
          SEM_PECA ||
          jogo.tabuleiro.quadrados[arrayTemp[i][0]][arrayTemp[i][1]].peca.cor !=
            this.cor)
      )
        arrayFinal.push(arrayTemp[i]);
    }

    //Roque
    if (!jogo.historico.moveuRei[this.cor]) {
      //Pegar cor contrária
      let corContraria;
      if (this.cor == BRANCO) corContraria = PRETO;
      else corContraria = BRANCO;

      if (
        jogo.tabuleiro
          .ameacasSemRei(corContraria)
          .some((n) => n[0] == this.posX && n[1] == this.posY) == false
      ) {
        //Pegar linha dependendo da cor
        let linha;
        if (this.cor == BRANCO) linha = 7;
        else linha = 0;

        //Roque Menor
        if (!jogo.historico.moveuTorreDireita[this.cor]) {
          if (
            jogo.tabuleiro.quadrados[5][linha].peca == SEM_PECA &&
            jogo.tabuleiro.quadrados[6][linha].peca == SEM_PECA
          )
            if (
              jogo.tabuleiro
                .ameacasSemRei(corContraria)
                .some(
                  (n) =>
                    n[0] == jogo.tabuleiro.quadrados[5][linha].posX &&
                    n[1] == jogo.tabuleiro.quadrados[5][linha].posY
                ) == false
            ) {
              let casaDestino = jogo.tabuleiro.quadrados[6][linha];
              arrayFinal.push([casaDestino.posX, casaDestino.posY]);
            }
        }

        //Roque Maior
        if (!jogo.historico.moveuTorreEsquerda[this.cor]) {
          if (
            jogo.tabuleiro.quadrados[1][linha].peca == SEM_PECA &&
            jogo.tabuleiro.quadrados[2][linha].peca == SEM_PECA &&
            jogo.tabuleiro.quadrados[3][linha].peca == SEM_PECA
          )
            if (
              jogo.tabuleiro
                .ameacasSemRei(corContraria)
                .some(
                  (n) =>
                    n[0] == jogo.tabuleiro.quadrados[3][linha].posX &&
                    n[1] == jogo.tabuleiro.quadrados[3][linha].posY
                ) == false
            ) {
              let casaDestino = jogo.tabuleiro.quadrados[2][linha];
              arrayFinal.push([casaDestino.posX, casaDestino.posY]);
            }
        }
      }
    }
    return arrayFinal;
  }
}
