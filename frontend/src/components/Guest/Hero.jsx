import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight } from "lucide-react"
import NeuralNetworkBg from "./Neural-network-bg"

export default function Hero() {
    const { scrollY } = useScroll()
    const y = useTransform(scrollY, [0, 500], [0, 150])
    const opacity = useTransform(scrollY, [0, 300], [1, 0])

    return (
        <motion.section
            initial={{ opacity: 0, x: -100}}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
         className="relative isolate flex min-h-screen items-center justify-center overflow-hidden my-10">
            <motion.div style={{ y, opacity }} className="absolute inset-0">
                <NeuralNetworkBg />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
            </motion.div>

            <div className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <h1 className="text-balance text-5xl font-bold leading-tight md:text-7xl">
                        Intelligent Crime Incident Management
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
                        Real-time reporting, AI-powered analytics, and secure evidence management for modern law enforcement and
                        security teams.
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <button className="group min-w-[160px] px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors flex items-center justify-center">
                            Sign Up Free
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>
                        <button className="min-w-[160px] px-6 py-3 bg-transparent border border-input rounded-md font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
                            Learn More
                        </button>
                    </div>

                    <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            <span>AES-256 Encrypted</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            <span>SOC 2 Compliant</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            <span>Real-time Sync</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 w-full flex justify-center items-center"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-2 text-muted-foreground"
                >
                    <span className="text-xs">Scroll to explore</span>
                    <div className="h-6 w-4 rounded-full border-2 border-muted-foreground/30">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                            className="mx-auto mt-1 h-1.5 w-1.5 rounded-full bg-muted-foreground/50"
                        />
                    </div>
                </motion.div>
            </motion.div>
        </motion.section>
    )
}
