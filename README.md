# QuizzSec

Mini-game de perguntas e respostas para treinamento de conscientização em segurança da
informação, voltado a colaboradores de micro e pequenas empresas de Araçás/BA.

O quiz tem 10 questões sobre phishing, engenharia social e boas práticas com senhas.
Cada resposta mostra na hora se o colaborador acertou e explica o motivo, e no final é
exibida a pontuação com uma orientação de acordo com o percentual de acerto.

Projeto desenvolvido como atividade prática de extensão universitária.

## Funcionalidades

- Perguntas com feedback imediato e explicação de cada resposta
- Desempenho separado por tema (phishing, engenharia social, senhas) na tela final
- Revisão pergunta a pergunta, com a resposta certa marcada em cada uma
- Certificado de participação com nome (opcional) e data, pronto pra imprimir ou
  salvar em PDF pelo próprio navegador
- Compartilhar o resultado (usa o menu de compartilhamento do celular quando
  disponível, ou copia o texto na área de transferência)
- Melhor resultado salvo no aparelho, pra comparar em novas tentativas
- Modo escuro (segue a preferência do sistema, com opção de trocar manualmente)
- Sons de acerto/erro e animações de transição entre as telas
- Atalhos de teclado no computador (teclas 1 a 4 e Enter)
- Layout responsivo, testado em celular (retrato e paisagem) e desktop

## Tecnologias

- Vue 3 (Composition API, `<script setup>`)
- Vite
- CSS puro, sem framework de interface

Não há backend: as perguntas ficam no arquivo `src/perguntas.json` e todo o resto roda
no navegador, inclusive o que é salvo (melhor resultado e preferência de tema ficam no
`localStorage` do próprio aparelho).

Os sons de acerto/erro são gerados pelo navegador via Web Audio, sem arquivos de áudio,
e podem ser desligados no ícone de alto-falante no cabeçalho. O confete que aparece
quando o aproveitamento é alto usa `canvas`, também sem bibliotecas externas.

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
