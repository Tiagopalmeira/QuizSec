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
      <h1>QuizzSec</h1>
      <p>Quiz de conscientização em segurança da informação</p>
      <div class="controles">
        <button class="botao-modo" @click="alternarTema()">
          {{ tema === 'escuro' ? 'Modo claro' : 'Modo escuro' }}
        </button>
        <button class="botao-modo" @click="mudo = !mudo">
          {{ mudo ? 'Ativar som' : 'Desativar som' }}
        </button>
      </div>
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
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.botao-modo {
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: none;
  color: var(--header-texto);
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 20px;
}

.botao-modo:active {
  background-color: rgba(255, 255, 255, 0.15);
}

@media (hover: hover) and (pointer: fine) {
  .botao-modo:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }
}
</style>
