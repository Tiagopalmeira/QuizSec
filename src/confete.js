// confete simples em canvas, sem biblioteca externa, usado quando o resultado e' otimo
export function lancarConfete() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const canvas = document.createElement('canvas')
  canvas.style.cssText =
    'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:999'
  document.body.appendChild(canvas)

  const ctx = canvas.getContext('2d')

  function redimensionar() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  redimensionar()
  window.addEventListener('resize', redimensionar)

  const cores = ['#1d6f42', '#14375e', '#e0b400', '#b3261e', '#2f9e63']
  const particulas = Array.from({ length: 110 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * 0.4,
    r: 4 + Math.random() * 5,
    cor: cores[Math.floor(Math.random() * cores.length)],
    vx: (Math.random() - 0.5) * 2.4,
    vy: 2.2 + Math.random() * 2.6,
    rot: Math.random() * 360,
    vrot: (Math.random() - 0.5) * 9
  }))

  const duracao = 2600
  const inicio = performance.now()

  function quadro(agora) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particulas.forEach((p) => {
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.02
      p.rot += p.vrot

      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate((p.rot * Math.PI) / 180)
      ctx.fillStyle = p.cor
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6)
      ctx.restore()
    })

    if (agora - inicio < duracao) {
      requestAnimationFrame(quadro)
    } else {
      window.removeEventListener('resize', redimensionar)
      canvas.remove()
    }
  }

  requestAnimationFrame(quadro)
}
