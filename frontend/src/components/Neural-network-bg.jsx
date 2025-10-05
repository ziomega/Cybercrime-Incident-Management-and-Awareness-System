import { useEffect, useRef } from "react"

export default function NeuralNetworkBg() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animationId
        const nodes = []
        const nodeCount = 80
        const maxDistance = 150

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener("resize", resize)

        // Initialize nodes
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
            })
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Update and draw nodes
            nodes.forEach((node) => {
                node.x += node.vx
                node.y += node.vy

                // Bounce off edges
                if (node.x < 0 || node.x > canvas.width) node.vx *= -1
                if (node.y < 0 || node.y > canvas.height) node.vy *= -1

                // Draw node
                ctx.beginPath()
                ctx.arc(node.x, node.y, 2, 0, Math.PI * 2)
                ctx.fillStyle = "rgba(114, 184, 255, 0.6)"
                ctx.fill()
            })

            // Draw connections
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x
                    const dy = nodes[i].y - nodes[j].y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance < maxDistance) {
                        ctx.beginPath()
                        ctx.moveTo(nodes[i].x, nodes[i].y)
                        ctx.lineTo(nodes[j].x, nodes[j].y)
                        const opacity = (1 - distance / maxDistance) * 0.3
                        ctx.strokeStyle = `rgba(114, 184, 255, ${opacity})`
                        ctx.lineWidth = 0.5
                        ctx.stroke()
                    }
                }
            }

            animationId = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener("resize", resize)
            cancelAnimationFrame(animationId)
        }
    }, [])

    return <canvas ref={canvasRef} className="absolute inset-0 -z-10" aria-hidden />
}
