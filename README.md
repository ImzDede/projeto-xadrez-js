# ♟️ Jogo de Xadrez em JavaScript

Um jogo de xadrez completo e funcional, desenvolvido do zero com JavaScript puro e a biblioteca p5.js para o tabuleiro. O projeto implementa todas as regras oficiais do xadrez, incluindo movimentos especiais, todas as condições de xeque/xeque-mate e empates.

**🎮 Jogue agora mesmo: [Clique aqui para jogar!](https://imzdede.github.io/chess-project-js)**

![GIF de demonstração do jogo](caminho/para/seu/gif-aqui.gif)

---

## 📖 Índice

* [Sobre o Projeto](#-sobre-o-projeto)
* [Funcionalidades](#-funcionalidades)
* [Tecnologias Utilizadas](#-tecnologias-utilizadas)
* [Desafios e Aprendizados](#-desafios-e-aprendizados)
* [Roadmap](#️-próximos-passos-roadmap)
* [Autor](#-autor)

---

## 💻 Sobre o Projeto

Este projeto foi criado como um desafio pessoal para aprofundar meus conhecimentos em **lógica de programação complexa**, **arquitetura de software com Orientação a Objetos** e **manipulação de interface com JavaScript**. O objetivo era construir um jogo de xadrez robusto que não apenas funcionasse, mas que também fosse estruturado de forma limpa e escalável, implementando todas as regras do jogo.

---

## ✨ Funcionalidades


* **Arquitetura Orientada a Objetos:** Código modular com classes para `Jogo`, `Tabuleiro`, `Peças` e `Jogadores`.
* **Validação de Movimentos:** Lógica completa para todos os movimentos, capturas e defesas de acordo com as regras oficiais.
* **Mecânicas Especiais Implementadas:**
    * **Roque:** Permite o roque menor e o maior, validando todas as condições necessárias.
    * **Captura *En Passant*:** Lógica completa para a captura especial de peões.
    * **Promoção de Peão:** Interface para o jogador escolher a peça ao promover um peão.
* **Lógica de Fim de Jogo Avançada:**
    -   Detecção precisa de **Xeque** e **Xeque-Mate**.
    -   Identificação de todas as condições de **Empate**:
        -   Afogamento.
        -   Tripla Repetição de Posição.
        -   Insuficiência de Material.
        -   Regra dos 50 Movimentos.
* **Interface Interativa:**
    * Destaque visual para a peça selecionada e seus movimentos legais.
    * Painel com histórico de jogadas em notação algébrica.
    * Configurações para customizar a experiência de jogo.
    * Cálculo de vantagem de material.
    * Múltiplos temas de tabuleiro e configurações de interface.
    * Design Responsivo: A interface se adapta de forma fluida a diferentes tamanhos e proporções de tela.

---

## 🎥 Demonstrações em GIF

### Movimentos Especiais
| Roque | En Passant | Promoção |
|------|-----------|---------|
| ![Roque](https://i.imgur.com/ztn9ZUc.gif) | ![En Passant](https://i.imgur.com/80D7xSH.gif) | ![Promoção](https://i.imgur.com/Ky7Dlpi.gif) |

### Interface e Recursos
| Configurações de Tema | Configurações Gerais |
|-----------------|-----------------------|
| ![Temas](https://i.imgur.com/ZpmJW20.gif) | ![Configurações](https://i.imgur.com/nVWIVpO.gif) |

### Finais de Jogo
| Xeque-Mate | Empate (Exemplo: afogamento) |
|-----------|----------------------------------------------------------|
| ![Xeque-Mate](https://i.imgur.com/VLvERIX.gif) | ![Empates](https://i.imgur.com/gNdO8HH.gif) |

---

## 🚀 Tecnologias Utilizadas

O projeto foi desenvolvido utilizando as seguintes tecnologias:

* **HTML5**
* **CSS3**
* **JavaScript (ES6+)**
* **p5.js:** Biblioteca utilizada para a renderização do tabuleiro e das peças no canvas.

---

## 🧠 Desafios e Aprendizados

O desenvolvimento deste projeto foi uma jornada de grande aprendizado. Alguns dos principais desafios foram:

1.  **Validação de Movimentos e Anti-Suicídio:**
    -   **Desafio:** Garantir que um jogador não pudesse realizar um movimento que deixasse seu próprio rei em xeque.
    -   **Solução:** Implementei uma função de simulação que cria um estado temporário do tabuleiro em memória para cada lance possível. O movimento só é validado e adicionado à lista de lances legais se, após a simulação, o rei do jogador não estiver sob ataque.

2.  **Gerenciamento de Estado Assíncrono na Promoção de Peão:**
    -   **Desafio:** Pausar a execução do jogo para permitir que o usuário escolhesse a peça para a promoção do peão, sem travar a interface.
    -   **Solução:** Utilizei `async/await` na função de movimento. A função retorna uma `Promise` que só é resolvida quando o jogador clica em uma das opções de promoção, garantindo que o fluxo do jogo aguarde a entrada do usuário de forma limpa e não-bloqueante.

3. **Gerenciamento de Regras de Empate Complexas:**
    - **Desafio:** Implementar regras de empate sutis, como a "tripla repetição", que exigem a memorização e comparação de todos os estados anteriores do tabuleiro durante a partida.

    - **Solução:** Desenvolvi um sistema de "mapeamento" que converte a posição de todas as peças, direitos de roque e o jogador da vez em uma string única (semelhante à notação FEN). Essa string é salva a cada jogada, permitindo uma verificação eficiente do histórico para detectar repetições e aplicar a regra corretamente.

---

## 🗺️ Próximos Passos (Roadmap)

-   [ ] **Navegação no Histórico:** Adicionar botões para avançar e retroceder nas jogadas, permitindo a análise da partida.
-   [ ] **Relógios de Jogo:** Incluir temporizadores para modalidades como Blitz, Rápido e Clássico.
-   [ ] **Persistência de Dados:** Salvar estatísticas dos jogadores (vitórias/derrotas/empates) e histórico de confrontos diretos utilizando o `localStorage` do navegador.
-   [ ] **Aprimoramentos Visuais e Sonoros:** Adicionar efeitos sonoros para jogadas, capturas e xeque; incluir diferentes sets de peças selecionáveis e implementar animações fluidas para os movimentos.

---

## 👤 Autor

**André Felipe Dilly Steiger**

* LinkedIn: https://www.linkedin.com/in/andré-felipe-dilly-steiger-2b6734322
* GitHub: [@ImzDede](https://github.com/ImzDede)