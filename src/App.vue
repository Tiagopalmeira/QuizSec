<script setup>
import { ref } from 'vue'
import perguntas from './perguntas.json'
import { mudo } from './som'
import { tema, alternarTema } from './tema'
import Inicio from './components/Inicio.vue'
import Pergunta from './components/Pergunta.vue'
import Resultado from './components/Resultado.vue'

const tela = ref('inicio')
const indice = ref(0)
const pontos = ref(0)
const respostas = ref([])
const nome = ref('')
const inicioEm = ref(null)
const fimEm = ref(null)

function comecar(nomeInformado) {
  nome.value = nomeInformado || ''
  indice.value = 0
  pontos.value = 0
  respostas.value = []
  inicioEm.value = Date.now()
  tela.value = 'quiz'
}

function responder(detalhe) {
  if (detalhe.acertou) {
    pontos.value++
  }

  respostas.value.push({
    pergunta: perguntas[indice.value],
    tema: perguntas[indice.value].tema,
    escolhida: detalhe.escolhida,
    correta: detalhe.acertou
  })
}

function proxima() {
  if (indice.value < perguntas.length - 1) {
    indice.value++
  } else {
    fimEm.value = Date.now()
    tela.value = 'fim'
  }
}

// volta para a tela inicial em vez de recomecar direto, assim da pra trocar o nome
// caso outro colaborador use o mesmo aparelho em seguida
function voltarInicio() {
  tela.value = 'inicio'
}
</script>

<template>
  <div class="container">
    <header class="no-imprimir">
      <div class="controles">
        <button
          class="icone"
          :title="tema === 'escuro' ? 'Ativar modo claro' : 'Ativar modo escuro'"
          @click="alternarTema()"
        >
          {{ tema === 'escuro' ? '☀️' : '🌙' }}
        </button>
        <button class="icone" :title="mudo ? 'Ativar som' : 'Desativar som'" @click="mudo = !mudo">
          {{ mudo ? '🔇' : '🔊' }}
        </button>
      </div>
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

      <Resultado
        v-else
        :pontos="pontos"
        :total="perguntas.length"
        :respostas="respostas"
        :nome="nome"
        :duracao-ms="fimEm - inicioEm"
        @reiniciar="voltarInicio"
      />
    </Transition>

    <footer class="no-imprimir">Projeto de extensão universitária &mdash; Araçás/BA</footer>
  </div>
</template>

<style scoped>
.controles {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 2px;
}

.icone {
  border: none;
  background: none;
  font-size: 19px;
  line-height: 1;
  padding: 8px;
  opacity: 0.85;
  border-radius: 50%;
}

.icone:active {
  opacity: 1;
}

@media (hover: hover) and (pointer: fine) {
  .icone:hover {
    opacity: 1;
    background-color: rgba(255, 255, 255, 0.12);
  }
}
</style>
