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
