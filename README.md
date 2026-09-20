# QuizzSec

Mini-game de perguntas e respostas para treinamento de conscientização em segurança da
informação, voltado a colaboradores de micro e pequenas empresas de Araçás/BA.

O quiz tem 10 questões sobre phishing, engenharia social e boas práticas com senhas.
Cada resposta mostra na hora se o colaborador acertou e explica o motivo, e no final é
exibida a pontuação com uma orientação de acordo com o percentual de acerto.

Projeto desenvolvido como atividade prática de extensão universitária.

## Tecnologias

- Vue 3 (Composition API, `<script setup>`)
- Vite
- CSS puro, sem framework de interface

Não há backend: as perguntas ficam no arquivo `src/perguntas.json` e todo o resto roda
no navegador. A tela foi feita para funcionar também no celular.

Os sons de acerto e erro são gerados pelo próprio navegador, sem arquivos de áudio, e
podem ser desligados no ícone no canto superior direito.

## Como rodar

Precisa ter o Node.js instalado (versão 18 ou superior).

```bash
npm install
npm run dev
```

Depois é só abrir o endereço que aparece no terminal (normalmente
http://localhost:5173).

Para gerar a versão final, que pode ser publicada em qualquer hospedagem de arquivos
estáticos:

```bash
npm run build
```

Os arquivos são gerados na pasta `dist`.

## Organização dos arquivos

```
src/
  App.vue                 controla qual tela aparece e a pontuação
  main.js
  style.css               estilos gerais
  perguntas.json          as 10 questões, com alternativas e explicações
  components/
    Inicio.vue            tela de abertura
    Pergunta.vue          pergunta, alternativas e feedback
    Resultado.vue         pontuação final e mensagem
```

## Alterar ou incluir perguntas

Basta editar `src/perguntas.json`. Cada questão segue este formato:

```json
{
  "id": 11,
  "tema": "Senhas",
  "pergunta": "Texto da pergunta",
  "opcoes": ["Alternativa A", "Alternativa B", "Alternativa C", "Alternativa D"],
  "correta": 2,
  "explicacao": "Por que essa é a resposta certa."
}
```

O campo `correta` é a posição da alternativa correta na lista, começando em 0. No
exemplo acima a resposta certa é a alternativa C.
