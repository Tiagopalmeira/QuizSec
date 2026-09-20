<script setup>
import { ref } from 'vue'
import perguntas from './perguntas.json'
import Inicio from './components/Inicio.vue'
import Pergunta from './components/Pergunta.vue'
import Resultado from './components/Resultado.vue'

const tela = ref('inicio')
const indice = ref(0)
const pontos = ref(0)

function comecar() {
  indice.value = 0
  pontos.value = 0
  tela.value = 'quiz'
}

function responder(acertou) {
  if (acertou) {
    pontos.value++
  }
}

function proxima() {
  if (indice.value < perguntas.length - 1) {
    indice.value++
  } else {
    tela.value = 'fim'
  }
}
</script>

<template>
  <div class="container">
    <header>
      <h1>QuizzSec</h1>
      <p>Quiz de conscientização em segurança da informação</p>
    </header>

    <Inicio v-if="tela === 'inicio'" :total="perguntas.length" @comecar="comecar" />

    <!-- o key faz o componente ser recriado a cada pergunta, limpando a resposta anterior -->
    <Pergunta
      v-else-if="tela === 'quiz'"
      :key="indice"
      :pergunta="perguntas[indice]"
      :numero="indice + 1"
      :total="perguntas.length"
      :pontos="pontos"
      @responder="responder"
      @proxima="proxima"
    />

    <Resultado v-else :pontos="pontos" :total="perguntas.length" @reiniciar="comecar" />

    <footer>Projeto de extensão universitária &mdash; Araçás/BA</footer>
  </div>
</template>
