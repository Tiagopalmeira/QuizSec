<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { tocar } from '../som'
import { lancarConfete } from '../confete'

const props = defineProps({
  pontos: Number,
  total: Number,
  respostas: Array,
  nome: String,
  duracaoMs: Number
})

defineEmits(['reiniciar'])

const CHAVE_MELHOR = 'quizzsec-melhor'

const exibido = ref(0)
const copiado = ref(false)
const abertas = ref(new Set())
const melhorAnterior = ref(null)
const bateuRecorde = ref(false)
let contador

const percentual = computed(() => Math.round((props.pontos / props.total) * 100))
const percentualExibido = computed(() => Math.round((exibido.value / props.total) * 100))

const faixa = computed(() => {
  if (percentual.value >= 80) return 'alta'
  if (percentual.value >= 50) return 'media'
  return 'baixa'
})

const mensagens = {
  alta: {
    titulo: 'Muito bem, você está preparado!',
    texto: 'Você reconhece os golpes mais usados hoje. Continue desconfiando de mensagens com urgência e confirmando pedidos estranhos por um canal oficial.'
  },
  media: {
    titulo: 'Bom resultado, mas dá para melhorar.',
    texto: 'Você acertou boa parte das situações, porém algumas passariam despercebidas no dia a dia. Vale revisar as explicações das questões que você errou.'
  },
  baixa: {
    titulo: 'Atenção: é preciso reforçar.',
    texto: 'Boa parte das situações apresentadas aqui acontece com frequência em empresas. Refaça o quiz com calma, lendo as explicações, e procure o responsável pela TI em caso de dúvida.'
  }
}

const duracaoTexto = computed(() => {
  if (!props.duracaoMs || Number.isNaN(props.duracaoMs)) return null

  const segundosTotais = Math.round(props.duracaoMs / 1000)
  const min = Math.floor(segundosTotais / 60)
  const seg = segundosTotais % 60

  return min === 0 ? `${seg}s` : `${min}min ${seg}s`
})

// agrupa os acertos por tema (phishing, engenharia social, senhas...) pra mostrar onde reforcar
const porTema = computed(() => {
  const grupos = {}

  props.respostas.forEach((r) => {
    if (!grupos[r.tema]) grupos[r.tema] = { acertos: 0, total: 0 }
    grupos[r.tema].total++
    if (r.correta) grupos[r.tema].acertos++
  })

  return Object.entries(grupos).map(([tema, v]) => ({
    tema,
    acertos: v.acertos,
    total: v.total,
    percentual: Math.round((v.acertos / v.total) * 100)
  }))
})

const todasAbertas = computed(() => abertas.value.size === props.respostas.length)

function alternarPergunta(i) {
  const novo = new Set(abertas.value)
  novo.has(i) ? novo.delete(i) : novo.add(i)
  abertas.value = novo
}

function alternarTodas() {
  abertas.value = todasAbertas.value ? new Set() : new Set(props.respostas.map((_, i) => i))
}

const dataFormatada = computed(() =>
  new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
)

async function compartilhar() {
  const texto = `Fiz o quiz QuizzSec sobre segurança digital e acertei ${props.pontos} de ${props.total} (${percentual.value}%)!`

  if (navigator.share) {
    try {
      await navigator.share({ title: 'QuizzSec', text: texto })
    } catch (e) {
      // usuario cancelou o compartilhamento, tudo bem
    }
    return
  }

  try {
    await navigator.clipboard.writeText(texto)
    copiado.value = true
    setTimeout(() => (copiado.value = false), 2500)
  } catch (e) {
    console.warn('nao foi possivel copiar o resultado', e)
  }
}

function imprimir() {
  window.print()
}

onMounted(() => {
  tocar('fim')

  // sobe a pontuacao aos poucos em vez de mostrar o numero final de uma vez
  contador = setInterval(() => {
    if (exibido.value >= props.pontos) {
      clearInterval(contador)
      return
    }
    exibido.value++
  }, 130)

  if (percentual.value >= 80) {
    setTimeout(() => lancarConfete(), 350)
  }

  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE_MELHOR) || 'null')
    melhorAnterior.value = salvo

    if (!salvo || props.pontos > salvo.pontos) {
      bateuRecorde.value = Boolean(salvo)
      localStorage.setItem(CHAVE_MELHOR, JSON.stringify({ pontos: props.pontos, total: props.total }))
    }
  } catch (e) {
    console.warn('nao foi possivel acessar o historico salvo neste aparelho', e)
  }
})

onUnmounted(() => clearInterval(contador))
</script>

<template>
  <div class="cartao">
    <div class="no-imprimir">
      <h2>Quiz finalizado</h2>

      <div :class="['placar', faixa]">
        <span class="numero">{{ exibido }} de {{ total }}</span>
        <span class="porcento">{{ percentualExibido }}% de acerto</span>
      </div>

      <p v-if="bateuRecorde" class="recorde">Novo recorde neste aparelho!</p>
      <p v-else-if="melhorAnterior" class="recorde-info">
        Melhor resultado registrado neste aparelho: {{ melhorAnterior.pontos }} de {{ melhorAnterior.total }}
      </p>
      <p v-if="duracaoTexto" class="recorde-info">Concluído em {{ duracaoTexto }}</p>

      <h3>{{ mensagens[faixa].titulo }}</h3>
      <p>{{ mensagens[faixa].texto }}</p>

      <div class="lembrete">
        <p><strong>Para levar daqui:</strong></p>
        <ul>
          <li>Nenhuma empresa séria pede senha ou código de verificação por telefone, e-mail ou WhatsApp.</li>
          <li>Pressa e ameaça de bloqueio são as ferramentas preferidas de quem aplica golpe.</li>
          <li>Na dúvida, confirme por um canal que você já usava antes da mensagem chegar.</li>
        </ul>
      </div>
    </div>

    <section class="no-imprimir">
      <h3>Desempenho por tema</h3>
      <div v-for="t in porTema" :key="t.tema" class="linha-tema">
        <div class="linha-tema-topo">
          <span>{{ t.tema }}</span>
          <span>{{ t.acertos }}/{{ t.total }}</span>
        </div>
        <div class="barra-tema">
          <div class="barra-tema-cheia" :style="{ width: t.percentual + '%' }"></div>
        </div>
      </div>
    </section>

    <section class="no-imprimir">
      <div class="cabecalho-secao">
        <h3>Revisão das perguntas</h3>
        <button class="botao-link" @click="alternarTodas">
          {{ todasAbertas ? 'Recolher tudo' : 'Expandir tudo' }}
        </button>
      </div>

      <ul class="lista-revisao">
        <li v-for="(r, i) in respostas" :key="i" class="item-revisao">
          <button class="cabecalho-revisao" @click="alternarPergunta(i)">
            <span :class="['selo', r.correta ? 'selo-ok' : 'selo-erro']">{{ r.correta ? '✔' : '✖' }}</span>
            <span class="texto-revisao">{{ i + 1 }}. {{ r.pergunta.pergunta }}</span>
            <span class="seta" :class="{ aberta: abertas.has(i) }">▾</span>
          </button>

          <div v-show="abertas.has(i)" class="corpo-revisao">
            <p><strong>Sua resposta:</strong> {{ r.pergunta.opcoes[r.escolhida] }}</p>
            <p v-if="!r.correta"><strong>Resposta correta:</strong> {{ r.pergunta.opcoes[r.pergunta.correta] }}</p>
            <p class="explicacao-revisao">{{ r.pergunta.explicacao }}</p>
          </div>
        </li>
      </ul>
    </section>

    <div class="acoes no-imprimir">
      <button class="botao-secundario" @click="compartilhar">Compartilhar resultado</button>
      <span v-if="copiado" class="aviso-copiado">Copiado! Cole onde quiser.</span>
    </div>

    <!-- unica parte que aparece na impressao/PDF, ver regra @media print no style.css -->
    <div class="certificado">
      <h3>Certificado de Participação</h3>
      <p class="certificado-nome">{{ nome || 'Colaborador(a)' }}</p>
      <p>
        concluiu o treinamento de conscientização em segurança da informação
        <strong>QuizzSec</strong>, com aproveitamento de <strong>{{ percentual }}%</strong>
        ({{ pontos }} de {{ total }} questões).
      </p>
      <p class="certificado-data">Araçás/BA &mdash; {{ dataFormatada }}</p>
    </div>

    <button class="botao-secundario no-imprimir" @click="imprimir">
      Gerar certificado (imprimir / salvar em PDF)
    </button>

    <button class="botao-principal no-imprimir" @click="$emit('reiniciar')">Refazer o quiz</button>
  </div>
</template>

<style scoped>
.placar {
  text-align: center;
  padding: 18px;
  border-radius: 6px;
  margin: 16px 0 12px 0;
  animation: surgir 0.5s ease both;
}

@keyframes surgir {
  from {
    opacity: 0;
    transform: scale(0.88);
  }
  70% {
    transform: scale(1.04);
  }
}

.numero {
  display: block;
  font-size: 36px;
  font-weight: bold;
}

.porcento {
  font-size: 15px;
}

.alta {
  background-color: var(--certo-bg);
  color: var(--certo-borda);
}

.media {
  background-color: var(--media-bg);
  color: var(--media-texto);
}

.baixa {
  background-color: var(--errado-bg);
  color: var(--errado-borda);
}

.recorde {
  text-align: center;
  font-weight: bold;
  color: var(--media-texto);
  margin: 0 0 6px 0;
}

.recorde-info {
  text-align: center;
  font-size: 14px;
  color: var(--texto-suave);
  margin: 0 0 6px 0;
}

.lembrete {
  background-color: var(--opcao-hover-bg);
  border-radius: 6px;
  padding: 14px 16px 14px 10px;
  margin: 18px 0;
  font-size: 15px;
}

.lembrete p {
  margin: 0 0 8px 10px;
}

.lembrete ul {
  margin: 0;
  padding-left: 28px;
}

.lembrete li {
  margin-bottom: 6px;
}

section {
  margin-top: 24px;
  border-top: 1px solid var(--borda);
  padding-top: 18px;
}

.linha-tema {
  margin-bottom: 12px;
}

.linha-tema-topo {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 4px;
}

.barra-tema {
  height: 8px;
  background-color: var(--borda);
  border-radius: 4px;
  overflow: hidden;
}

.barra-tema-cheia {
  height: 100%;
  background-color: var(--primaria);
  transition: width 0.6s ease;
}

.cabecalho-secao {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cabecalho-secao h3 {
  margin: 0;
}

.botao-link {
  border: none;
  background: none;
  color: var(--primaria);
  font-size: 14px;
  font-weight: bold;
  padding: 4px;
}

.lista-revisao {
  list-style: none;
  padding: 0;
  margin: 12px 0 0 0;
}

.item-revisao {
  border: 1px solid var(--borda);
  border-radius: 6px;
  margin-bottom: 8px;
  overflow: hidden;
}

.cabecalho-revisao {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border: none;
  background-color: var(--cartao-bg);
  color: var(--texto);
}

.selo {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  line-height: 22px;
  text-align: center;
  border-radius: 50%;
  font-size: 13px;
  color: #fff;
}

.selo-ok {
  background-color: var(--certo-borda);
}

.selo-erro {
  background-color: var(--errado-borda);
}

.texto-revisao {
  flex: 1;
  font-size: 15px;
}

.seta {
  transition: transform 0.2s ease;
}

.seta.aberta {
  transform: rotate(180deg);
}

.corpo-revisao {
  padding: 4px 12px 14px 44px;
  font-size: 14px;
  background-color: var(--opcao-hover-bg);
}

.corpo-revisao p {
  margin: 4px 0;
}

.explicacao-revisao {
  color: var(--texto-suave);
}

.acoes {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.aviso-copiado {
  font-size: 13px;
  color: var(--certo-borda);
}

.botao-secundario {
  width: 100%;
  padding: 12px;
  border: 2px solid var(--primaria);
  border-radius: 6px;
  background-color: transparent;
  color: var(--primaria);
  font-weight: bold;
  margin-bottom: 12px;
}

@media (hover: hover) and (pointer: fine) {
  .botao-secundario:hover {
    background-color: var(--opcao-hover-bg);
  }
}

.certificado {
  text-align: center;
  border: 3px double var(--header-bg);
  border-radius: 10px;
  padding: 24px 16px;
  margin-top: 24px;
}

.certificado-nome {
  font-size: 22px;
  font-weight: bold;
  color: var(--header-bg);
  margin: 6px 0;
}

.certificado-data {
  font-size: 13px;
  color: var(--texto-suave);
  margin-top: 10px;
}
</style>
