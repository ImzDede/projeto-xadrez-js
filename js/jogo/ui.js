class Hud {
  constructor() {
    this.botoesPromocao = [];
    this.promocao = false;
  }

  desenhar() {
    rectMode(CORNER);
    jogo.tabuleiro.desenhar();

    //Menu Promoção
    for (let i = 0; i < this.botoesPromocao.length; i++)
      this.botoesPromocao[i].desenhar();
  }

  interacaoMouse() {
    for (let i = 0; i < this.botoesPromocao.length; i++)
      this.botoesPromocao[i].interacaoMouse();
  }

  criarPromocao(peca) {
    //Promessa pra quando for jogar o lance, apenas terminar após a escolha do jogador
    return new Promise((resolve) => {
      let cor = peca.cor;
      let fator;

      //Ativar para que não haja interferência de click com o jogo
      this.promocao = true;

      //Fator para desenhar pra cima ou pra baixo
      if (cor == BRANCO) fator = 1;
      else fator = -1;

      //Criar os 4 botões
      for (let i = 0; i < 4; i++) {
        this.botoesPromocao[i] = new Botao(
          imagens[i + 1][cor],
          peca.x + szQdr / 2,
          peca.y + szQdr / 2 + szQdr * (i + 1) * fator,
          szQdr,
          szQdr,
          () => {
            this.promover(peca, i + 1);
            this.desabilitarPromocao();
            resolve();
          }
        );
      }
    });
  }

  desabilitarPromocao() {
    this.botoesPromocao = [];
    this.promocao = false;
  }

  promover(peca, tipo) {
    if (tipo == TORRE)
      jogo.tabuleiro.quadrados[peca.posX][peca.posY].peca = new Torre(
        peca.cor,
        peca.posX,
        peca.posY
      );
    else if (tipo == CAVALO)
      jogo.tabuleiro.quadrados[peca.posX][peca.posY].peca = new Cavalo(
        peca.cor,
        peca.posX,
        peca.posY
      );
    else if (tipo == BISPO)
      jogo.tabuleiro.quadrados[peca.posX][peca.posY].peca = new Bispo(
        peca.cor,
        peca.posX,
        peca.posY
      );
    else if (tipo == RAINHA)
      jogo.tabuleiro.quadrados[peca.posX][peca.posY].peca = new Rainha(
        peca.cor,
        peca.posX,
        peca.posY
      );
      atualizarPontuacaoHtml()
  }
}

class Botao {
  constructor(imagem, x, y, w, h, acao) {
    this.imagem = imagem;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.acao = acao;
    this.fator = 1;
    this.corFundo = color(255);
  }

  desenhar() {
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    imageMode(CENTER);

    //Fundo
    fill(this.corFundo);
    rect(this.x, this.y, this.w, this.h);

    image(this.imagem, this.x, this.y, this.w, this.h);

    if (this.colisao()) {
      //Brilho
      fill(200, 200, 200, 120);
      rect(this.x, this.y, this.w, this.h);
    }
  }

  interacaoMouse() {
    if (this.colisao()) {
      this.acao();
    }
  }

  colisao() {
    if (
      mouseX >= this.x - this.w / 2 &&
      mouseX <= this.x + this.w / 2 &&
      mouseY >= this.y - this.h / 2 &&
      mouseY <= this.y + this.h / 2
    )
      return true;
    else return false;
  }
}