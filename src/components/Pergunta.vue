<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { tocar } from '../som'

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
  const foiCerto = i === props.pergunta.correta
  tocar(foiCerto ? 'acerto' : 'erro')
  emit('responder', { acertou: foiCerto, escolhida: i })
}

function classe(i) {
  if (!respondeu.value) return ''
  if (i === props.pergunta.correta) return 'certa'
  if (i === escolhida.value) return 'errada'
  return 'apagada'
}

// atalhos de teclado pra quem esta usando computador: 1-4 escolhe, Enter avanca
function teclado(e) {
  if (!respondeu.value) {
    const posicao = Number(e.key) - 1
    if (posicao >= 0 && posicao < props.pergunta.opcoes.length) {
      escolher(posicao)
    }
    return
  }

  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    emit('proxima')
  }
}

onMounted(() => window.addEventListener('keydown', teclado))
onUnmounted(() => window.removeEventListener('keydown', teclado))
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

    <span class="tema-badge">{{ pergunta.tema }}</span>
    <h2 class="enunciado">{{ pergunta.pergunta }}</h2>

    <ul class="opcoes">
      <li v-for="(opcao, i) in pergunta.opcoes" :key="i" :style="{ animationDelay: i * 0.07 + 's' }">
        <button :class="['opcao', classe(i)]" :disabled="respondeu" @click="escolher(i)">
          <span class="letra">{{ letras[i] }}</span>
          {{ opcao }}
        </button>
      </li>
    </ul>

    <p class="dica-teclado">No computador: teclas 1 a 4 para responder e Enter para avançar.</p>

    <Transition name="surge">
      <div v-if="respondeu">
        <div :class="['feedback', acertou ? 'ok' : 'nao-ok']" aria-live="polite">
          <strong>{{ acertou ? '✔ Você acertou!' : '✖ Resposta incorreta.' }}</strong>
          <p>{{ pergunta.explicacao }}</p>
        </div>

        <button class="botao-principal" @click="emit('proxima')">
          {{ numero === total ? 'Ver resultado' : 'Próxima pergunta' }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.topo {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: var(--texto-suave);
  margin-bottom: 6px;
}

.barra {
  height: 6px;
  background-color: var(--borda);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 18px;
}

.barra-cheia {
  height: 100%;
  background-color: var(--header-bg);
  transition: width 0.4s ease;
}

.tema-badge {
  display: inline-block;
  background-color: var(--tema-badge-bg);
  color: var(--tema-badge-texto);
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
  animation: entrada 0.35s ease both;
}

@keyframes entrada {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
}

.opcao {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  text-align: left;
  padding: 12px;
  border: 2px solid var(--borda);
  border-radius: 6px;
  background-color: var(--cartao-bg);
  color: var(--texto);
  transition: border-color 0.2s, background-color 0.2s, transform 0.1s;
}

@media (hover: hover) and (pointer: fine) {
  .opcao:hover:enabled {
    border-color: var(--header-bg);
    background-color: var(--opcao-hover-bg);
  }
}

.opcao:active:enabled {
  transform: scale(0.99);
}

.letra {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  border-radius: 50%;
  background-color: var(--tema-badge-bg);
  font-size: 14px;
  font-weight: bold;
}

.opcao:disabled {
  cursor: default;
}

.certa {
  border-color: var(--certo-borda);
  background-color: var(--certo-bg);
  animation: pulso 0.5s ease;
}

.certa .letra {
  background-color: var(--certo-borda);
  color: #fff;
}

.errada {
  border-color: var(--errado-borda);
  background-color: var(--errado-bg);
  animation: tremor 0.4s ease;
}

.errada .letra {
  background-color: var(--errado-borda);
  color: #fff;
}

.apagada {
  opacity: 0.5;
}

@keyframes pulso {
  40% {
    transform: scale(1.03);
  }
}

@keyframes tremor {
  20% {
    transform: translateX(-7px);
  }
  40% {
    transform: translateX(7px);
  }
  60% {
    transform: translateX(-4px);
  }
  80% {
    transform: translateX(4px);
  }
}

.dica-teclado {
  display: none;
  font-size: 13px;
  color: var(--texto-suave);
  margin: -8px 0 16px 0;
}

@media (hover: hover) and (pointer: fine) {
  .dica-teclado {
    display: block;
  }
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
  border-color: var(--certo-borda);
  background-color: var(--certo-bg);
}

.nao-ok {
  border-color: var(--errado-borda);
  background-color: var(--errado-bg);
}

.surge-enter-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.surge-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
