<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  pergunta: Object,
  numero: Number,
  total: Number,
  pontos: Number
})

const emit = defineEmits(['responder', 'proxima'])

const escolhida = ref(null)
const letras = ['A', 'B', 'C', 'D']

const respondeu = computed(() => escolhida.value !== null)
const acertou = computed(() => escolhida.value === props.pergunta.correta)
const progresso = computed(() => ((props.numero - 1) / props.total) * 100)

function escolher(i) {
  if (respondeu.value) return

  escolhida.value = i
  emit('responder', i === props.pergunta.correta)
}

function classe(i) {
  if (!respondeu.value) return ''
  if (i === props.pergunta.correta) return 'certa'
  if (i === escolhida.value) return 'errada'
  return 'apagada'
}
</script>

<template>
  <div class="cartao">
    <div class="topo">
      <span>Pergunta {{ numero }} de {{ total }}</span>
      <span>Acertos: {{ pontos }}</span>
    </div>

    <div class="barra">
      <div class="barra-cheia" :style="{ width: progresso + '%' }"></div>
    </div>

    <span class="tema">{{ pergunta.tema }}</span>
    <h2 class="enunciado">{{ pergunta.pergunta }}</h2>

    <ul class="opcoes">
      <li v-for="(opcao, i) in pergunta.opcoes" :key="i">
        <button :class="['opcao', classe(i)]" :disabled="respondeu" @click="escolher(i)">
          <span class="letra">{{ letras[i] }}</span>
          {{ opcao }}
        </button>
      </li>
    </ul>

    <div v-if="respondeu" :class="['feedback', acertou ? 'ok' : 'nao-ok']">
      <strong>{{ acertou ? 'Você acertou!' : 'Resposta incorreta.' }}</strong>
      <p>{{ pergunta.explicacao }}</p>
    </div>

    <button v-if="respondeu" class="botao-principal" @click="emit('proxima')">
      {{ numero === total ? 'Ver resultado' : 'Próxima pergunta' }}
    </button>
  </div>
</template>

<style scoped>
.topo {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #5c6773;
  margin-bottom: 6px;
}

.barra {
  height: 6px;
  background-color: #dde3ea;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 18px;
}

.barra-cheia {
  height: 100%;
  background-color: #14375e;
  transition: width 0.3s;
}

.tema {
  display: inline-block;
  background-color: #e4ecf5;
  color: #14375e;
  font-size: 13px;
  padding: 3px 9px;
  border-radius: 10px;
  margin-bottom: 10px;
}

.enunciado {
  font-size: 19px;
  line-height: 1.4;
}

.opcoes {
  list-style: none;
  padding: 0;
  margin: 18px 0;
}

.opcoes li {
  margin-bottom: 10px;
}

.opcao {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  text-align: left;
  padding: 12px;
  border: 2px solid #ccd4dd;
  border-radius: 6px;
  background-color: #fff;
  color: #1f2933;
}

.opcao:hover:enabled {
  border-color: #14375e;
  background-color: #f4f7fa;
}

.letra {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  border-radius: 50%;
  background-color: #e4ecf5;
  font-size: 14px;
  font-weight: bold;
}

.opcao:disabled {
  cursor: default;
}

.certa {
  border-color: #1d6f42;
  background-color: #e8f5ed;
}

.errada {
  border-color: #b3261e;
  background-color: #fbeae9;
}

.apagada {
  opacity: 0.55;
}

.feedback {
  border-left: 5px solid;
  padding: 12px 14px;
  border-radius: 4px;
  margin-bottom: 18px;
}

.feedback p {
  margin: 6px 0 0 0;
  font-size: 15px;
}

.ok {
  border-color: #1d6f42;
  background-color: #e8f5ed;
}

.nao-ok {
  border-color: #b3261e;
  background-color: #fbeae9;
}
</style>
