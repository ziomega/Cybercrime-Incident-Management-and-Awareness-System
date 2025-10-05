import { motion, useScroll, useTransform } from "framer-motion"
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const { scrollY } = useScroll()
    const bg = useTransform(scrollY, [0, 80], ["rgba(8,12,20,0)", "rgba(8,12,20,0.88)"])
    const shadow = useTransform(scrollY, [0, 80], ["0 0 0 rgba(0,0,0,0)", "0 8px 24px rgba(0,0,0,0.35)"])
    const navigate = useNavigate();

    return (
        <motion.header
            style={{ background: bg, boxShadow: shadow }}
            className="fixed inset-x-0 top-0 z-50 backdrop-blur-md border-b border-white/5"
            aria-label="Primary"
        >
            <nav className="mx-auto flex max-w-screen items-center justify-between px-4 py-3 md:py-4">
                <motion.button 
                    onClick={() => { navigate("/") }} 
                    className="flex items-center gap-2"
                    whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(var(--primary-rgb), 0.4)", }}
                    whileTap={{ scale: 0.98 }}
                >
                    <span
                        className="inline-block h-6 w-6 rounded-md bg-primary ring-1 ring-primary/30 shadow-[0_0_24px_var(--tech-glow)]"
                        aria-hidden
                    />
                    <span className="text-sm font-mono tracking-widest text-primary md:text-base">CIMAS</span>
                </motion.button>
                <div className="hidden items-center gap-6 md:flex">
                    <motion.button
                        onClick={() => { navigate("#features") }}
                        className="text-sm text-muted-foreground"
                        whileHover={{ color: "hsl(var(--foreground))", y: -2}}
                        transition={{ duration: 0.2 }}
                    >
                        Features
                    </motion.button>
                    <motion.button
                        href="#how"
                        className="text-sm text-muted-foreground"
                        whileHover={{ color: "hsl(var(--foreground))", y: -2, }}
                        transition={{ duration: 0.2 }}
                    >
                        How it works
                    </motion.button>
                    <motion.button
                        onClick={() => { navigate("#stats") }}
                        className="text-sm text-muted-foreground"
                        whileHover={{ color: "hsl(var(--foreground))", y: -2, }}
                        transition={{ duration: 0.2 }}
                    >
                        Impact
                    </motion.button>
                </div>
                <div className="flex items-center gap-2">
                    <motion.button
                        initial={{ scale: 1, boxShadow: "0 0 0 rgba(0,0,0,0)",border: "2px solid white" }}
                        whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(var(--primary-rgb), 0.4)",border: "2px solid black",color: "black", backgroundColor: "white" }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
                        onClick={() => { navigate("/login") }}
                    >
                        Start reporting
                    </motion.button>
                </div>
            </nav>
        </motion.header>
    )
}
