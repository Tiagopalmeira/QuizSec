import { ref } from 'vue'

export const mudo = ref(false)

// os sons sao gerados pelo proprio navegador (Web Audio) para nao precisar de arquivos mp3
let contexto

function audio() {
  if (!contexto) {
    contexto = new (window.AudioContext || window.webkitAudioContext)()
  }
  return contexto
}

function nota(freq, atraso, duracao, forma = 'sine') {
  const ctx = audio()
  const osc = ctx.createOscillator()
  const volume = ctx.createGain()
  const inicio = ctx.currentTime + atraso

  osc.type = forma
  osc.frequency.setValueAtTime(freq, inicio)

  volume.gain.setValueAtTime(0.0001, inicio)
  volume.gain.exponentialRampToValueAtTime(0.18, inicio + 0.02)
  volume.gain.exponentialRampToValueAtTime(0.0001, inicio + duracao)

  osc.connect(volume)
  volume.connect(ctx.destination)
  osc.start(inicio)
  osc.stop(inicio + duracao + 0.02)
}

const sons = {
  acerto: () => {
    nota(660, 0, 0.12)
    nota(880, 0.09, 0.22)
  },
  erro: () => {
    nota(220, 0, 0.16, 'square')
    nota(160, 0.14, 0.26, 'square')
  },
  fim: () => {
    nota(523, 0, 0.14)
    nota(659, 0.12, 0.14)
    nota(784, 0.24, 0.32)
  }
}

export function tocar(tipo) {
  if (mudo.value) return

  // em alguns navegadores o audio so libera depois de um clique, por isso o try
  try {
    const ctx = audio()
    if (ctx.state === 'suspended') ctx.resume()
    sons[tipo]()
  } catch (e) {
    console.warn('nao foi possivel tocar o som', e)
  }
}
