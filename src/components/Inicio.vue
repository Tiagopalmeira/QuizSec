<script setup>
defineProps({
  total: Number
})

defineEmits(['comecar'])
</script>

<template>
  <div class="cartao">
    <h2>Você saberia reconhecer um golpe digital?</h2>

    <p>
      São {{ total }} perguntas rápidas sobre situações que acontecem no dia a dia da
      empresa: e-mails falsos, pedidos suspeitos por telefone ou WhatsApp e cuidados
      com senhas.
    </p>

    <ul class="instrucoes">
      <li>Escolha uma alternativa por pergunta.</li>
      <li>Depois de responder você vê na hora se acertou e o motivo.</li>
      <li>No final aparece a sua pontuação. Não vale nota, o objetivo é aprender.</li>
    </ul>

    <p class="tempo">Tempo estimado: 5 minutos.</p>

    <button class="botao-principal" @click="$emit('comecar')">Começar o quiz</button>
  </div>
</template>

<style scoped>
.instrucoes {
  padding-left: 20px;
  margin: 16px 0;
}

.instrucoes li {
  margin-bottom: 6px;
}

.tempo {
  font-size: 15px;
  color: #5c6773;
  margin-bottom: 20px;
}
</style>
