//Dimensões
let szTab, szQdr;

let cores = {
  tabuleiroClaro: "#E9D08E",
  tabuleiroEscuro: "#B06D38",
  marcacao: "#ffee006f",
}

definirCores(modal.selectTema.value)

//Variáveis de controle
let mostrarCoordenadas = modal.checkCoordenadas.checked;
let mostrarDestacar = modal.checkDestacar.checked;
let mostrarLances = modal.checkLances.checked;

//Objetos princiapis
let sistema;
let jogadores;
let jogo;
let hud;

//Utilitários
const abc = "abcdefgh"
const SEM_PECA = -1;
const BRANCO = 0;
const PRETO = 1;

//Estados
const VITORIA_BRANCO = 2;
const VITORIA_PRETO = 3;
const EMPATE = 4;

//Tipo de peças
const PEAO = 0;
const CAVALO = 1;
const BISPO = 2;
const TORRE = 3;
const RAINHA = 4;
const REI = 5;

//Roque
const SEM_ROQUE = 0;
const ROQUE_MENOR = 1;
const ROQUE_MAIOR = 2;

//Menus
const PRINCIPAL = 0;
const JOGADORES = 1;
const CONFIGURACAO = 2;
const JOGO = 3;

//Imagens
let imagens = [];

function preload() {
  imagens[PEAO] = [loadImage("assets/pecas/bPeao.png"), loadImage("assets/pecas/pPeao.png")];
  imagens[REI] = [loadImage("assets/pecas/bRei.png"), loadImage("assets/pecas/pRei.png")];
  imagens[CAVALO] = [loadImage("assets/pecas/bCavalo.png"), loadImage("assets/pecas/pCavalo.png")];
  imagens[RAINHA] = [loadImage("assets/pecas/bRainha.png"), loadImage("assets/pecas/pRainha.png")];
  imagens[TORRE] = [loadImage("assets/pecas/bTorre.png"), loadImage("assets/pecas/pTorre.png")];
  imagens[BISPO] = [loadImage("assets/pecas/bBispo.png"), loadImage("assets/pecas/pBispo.png")];
}

function corOposta(cor) {
  let corOposta;
  if (cor == BRANCO) corOposta = PRETO;
  else corOposta = BRANCO;
  
  return corOposta;
}

function tipoEmString(tipo, peao) {
    if (tipo == SEM_PECA) return ""
    else if (tipo == PEAO) {
      if (peao) return "P"
      else return "";
    } else if (tipo == TORRE) return "T";
    else if (tipo == CAVALO) return "C";
    else if (tipo == BISPO) return "B";
    else if (tipo == RAINHA) return "D";
    else return "R";
  }

function posicaoEmString(posX, posY) {
  return abc.charAt(posX) + (8 - posY)
}

function dentroTabuleiro(x, y) {
    if (x >= 0 && x <= 7 && y >= 0 && y <= 7) return true;
    else return false;
  }

function atualizarPontuacaoHtml() {
  document.getElementById('pontuacao-brancas').textContent = jogadores[BRANCO].stringVantagem;
  document.getElementById('pontuacao-pretas').textContent = jogadores[PRETO].stringVantagem;
}

function resetarJogo() {
  jogo = new Jogo();
  hud = new Hud();
  definirJogadores();
  jogadores[BRANCO].atualizarCapturadasHtml()
  jogadores[PRETO].atualizarCapturadasHtml()
  controles.listaJogadas.innerHTML = ""
  //Mapear começo do jogo
  jogo.historico.guardarMapa(jogo.historico.mapear())
}