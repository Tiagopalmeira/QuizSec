import { ref, watchEffect } from 'vue'

const CHAVE = 'quizzsec-tema'

function preferenciaInicial() {
  try {
    const salvo = localStorage.getItem(CHAVE)
    if (salvo === 'claro' || salvo === 'escuro') return salvo
  } catch (e) {
    // navegador sem localStorage disponivel (modo privado, por exemplo), segue com o padrao
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro'
}

export const tema = ref(preferenciaInicial())

watchEffect(() => {
  document.documentElement.dataset.tema = tema.value

  try {
    localStorage.setItem(CHAVE, tema.value)
  } catch (e) {
    // sem problema, so nao guarda a preferencia entre visitas
  }
})

export function alternarTema() {
  tema.value = tema.value === 'escuro' ? 'claro' : 'escuro'
}
