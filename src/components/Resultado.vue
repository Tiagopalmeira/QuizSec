<script setup>
import { computed } from 'vue'

const props = defineProps({
  pontos: Number,
  total: Number
})

defineEmits(['reiniciar'])

const percentual = computed(() => Math.round((props.pontos / props.total) * 100))

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
</script>

<template>
  <div class="cartao">
    <h2>Quiz finalizado</h2>

    <div :class="['placar', faixa]">
      <span class="numero">{{ pontos }} de {{ total }}</span>
      <span class="porcento">{{ percentual }}% de acerto</span>
    </div>

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

    <button class="botao-principal" @click="$emit('reiniciar')">Refazer o quiz</button>
  </div>
</template>

<style scoped>
.placar {
  text-align: center;
  padding: 18px;
  border-radius: 6px;
  margin: 16px 0 20px 0;
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
  background-color: #e8f5ed;
  color: #1d6f42;
}

.media {
  background-color: #fdf3e0;
  color: #8a5a00;
}

.baixa {
  background-color: #fbeae9;
  color: #b3261e;
}

.lembrete {
  background-color: #f4f7fa;
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
</style>
