<script setup>
import { ref } from 'vue'

defineProps({
  total: Number
})

const emit = defineEmits(['comecar'])

const nome = ref('')

function iniciar() {
  emit('comecar', nome.value.trim())
}
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
      <li>No final aparece a sua pontuação e um certificado de participação.</li>
    </ul>

    <p class="tempo">Tempo estimado: 5 minutos.</p>

    <div class="campo-nome">
      <label for="nome">Seu nome (opcional, aparece no certificado)</label>
      <input
        id="nome"
        v-model="nome"
        type="text"
        placeholder="Ex.: Maria da Silva"
        maxlength="60"
        autocomplete="name"
        @keyup.enter="iniciar"
      />
    </div>

    <button class="botao-principal" @click="iniciar">Começar o quiz</button>
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
  color: var(--texto-suave);
  margin-bottom: 20px;
}

.campo-nome {
  margin-bottom: 20px;
}

.campo-nome label {
  display: block;
  font-size: 14px;
  color: var(--texto-suave);
  margin-bottom: 6px;
}

.campo-nome input {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 2px solid var(--borda);
  border-radius: 6px;
  background-color: var(--cartao-bg);
  color: var(--texto);
}

.campo-nome input:focus {
  outline: none;
  border-color: var(--primaria);
}
</style>
