<script setup>
import { ref } from 'vue'
import perguntas from './perguntas.json'
import { mudo } from './som'
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
      <button class="som" :title="mudo ? 'Ativar som' : 'Desativar som'" @click="mudo = !mudo">
        {{ mudo ? '🔇' : '🔊' }}
      </button>
      <h1>QuizzSec</h1>
      <p>Quiz de conscientização em segurança da informação</p>
    </header>

    <Transition name="troca" mode="out-in">
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
    </Transition>

    <footer>Projeto de extensão universitária &mdash; Araçás/BA</footer>
  </div>
</template>

<style scoped>
.som {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: none;
  font-size: 20px;
  line-height: 1;
  padding: 4px;
  opacity: 0.85;
}

.som:hover {
  opacity: 1;
}
</style>
