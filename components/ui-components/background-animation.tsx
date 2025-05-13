"use client"

import { useTheme } from "next-themes"
import { useEffect, useRef } from "react"

export function BackgroundAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const isDark = theme === "dark"

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = Math.random() * 2 - 1
        this.speedY = Math.random() * 2 - 1
        this.color = isDark ? `rgba(255, 255, 255, ${Math.random() * 0.2})` : `rgba(0, 0, 0, ${Math.random() * 0.1})`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        else if (this.x < 0) this.x = canvas.width

        if (this.y > canvas.height) this.y = 0
        else if (this.y < 0) this.y = canvas.height
      }

      draw() {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Create particles
    const particlesArray: Particle[] = []
    const numberOfParticles = Math.min(100, Math.floor((window.innerWidth * window.innerHeight) / 10000))

    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle())
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update()
        particlesArray[i].draw()
      }

      // Connect particles with lines
      connectParticles()

      requestAnimationFrame(animate)
    }

    // Connect nearby particles with lines
    const connectParticles = () => {
      const maxDistance = 100

      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x
          const dy = particlesArray[a].y - particlesArray[b].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            const opacity = 1 - distance / maxDistance
            ctx.strokeStyle = isDark ? `rgba(255, 255, 255, ${opacity * 0.15})` : `rgba(0, 0, 0, ${opacity * 0.05})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y)
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y)
            ctx.stroke()
          }
        }
      }
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [theme])

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 w-full h-full pointer-events-none" aria-hidden="true" />
}
