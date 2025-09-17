class Jogador {
  constructor(nome, cor) {
    this.nome = nome;
    this.cor = cor;
    this.capturadas = [];
  }

  get pontos() {
    let somador = 0;
    const pecas = jogo.tabuleiro.pecas(this.cor);

    for (let i = 0; i < pecas.length; i++) {
      somador += pecas[i].ponto;
    }

    return somador
  }

  get stringVantagem() {
    let diferenca;
    diferenca = this.pontos - jogadores[corOposta(this.cor)].pontos;

    if (diferenca > 0) return "+" + diferenca;
    else return "";
  }

  adicionarCapturadas(peca) {
    this.capturadas.push(peca.tipo);
    this.capturadas.sort((a, b) => b - a)
    this.atualizarCapturadasHtml()
  }

  atualizarCapturadasHtml() {
    const destino = (this.cor === BRANCO) ? controles.capturadasBrancas : controles.capturadasPretas

    destino.innerHTML = "";

    for (let i = 0; i < this.capturadas.length; i++) {
      let cor;
      let tipo;
      if (this.cor == BRANCO) cor = "p"
      else cor = "b"

      const nomes = ["Peao", "Cavalo", "Bispo", "Torre", "Rainha"];
      tipo = nomes[this.capturadas[i]]

      let imagem = document.createElement("img");
      imagem.src = "assets/pecas/" + cor + tipo + ".png";
      imagem.alt = tipo;

      destino.appendChild(imagem)  
    }

    atualizarPontuacaoHtml()
  }
}