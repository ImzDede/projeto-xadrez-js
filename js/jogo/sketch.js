let cnv;

function setup() {
    definirTamanho()
    cnv = createCanvas(szTab, szTab);
    cnv.parent("tela-jogo");
    cnv.id("canvas-jogo");
    cnv.addClass("canvas-container");
    cnv.parent('container-canvas');
    imageMode(CENTER)
    noStroke();

    jogo = new Jogo();
    hud = new Hud();

    //Mapear começo do jogo
    jogo.historico.guardarMapa(jogo.historico.mapear())
}

function draw() {
    hud.desenhar();
}

function mousePressed() {
    if (!hud.promocao) jogo.interacaoMouse();
    hud.interacaoMouse();
}

function windowResized() {
    definirTamanho()
    resizeCanvas(szTab, szTab);
}

function definirTamanho() {
    szTab = (windowWidth < windowHeight) ? windowWidth * 0.7 : windowHeight * 0.7;
    szQdr = szTab / 8;
}

//-------------
//TEMPORÁRIO
//-------------
function keyPressed() {
    if (keyCode == UP_ARROW) {
        resetarJogo()
    }
}

function informacao() {
    console.log("Branco")
    console.log(jogadores[BRANCO].pontos)
    console.log("Preta")
    console.log(jogadores[PRETO].pontos)
}

function ameacasVizualizar(cor) {
    let jogadas = jogo.tabuleiro.ameacas(cor);
    for (let i = 0; i < jogadas.length; i++) {
        let x = jogadas[i][0] * szQdr;
        let y = jogadas[i][1] * szQdr + szQdr;
        fill(255, 255, 255, 60);
        rect(x, y, szQdr, szQdr);
        fill(255, 255, 255, 120);
        circle(x + szQdr / 2, y + szQdr / 2, szQdr / 3);
    }
}

function deletarPecas(coord) {
    for (let i = 0; i < coord.length; i++) {
        jogo.tabuleiro.quadrados[coord[i][0]][coord[i][1]].peca = SEM_PECA;
    }
}

