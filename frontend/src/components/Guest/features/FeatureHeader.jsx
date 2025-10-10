import { motion } from "framer-motion"

export default function FeatureHeader() {
    return (
        <div className="mx-auto max-w-7xl px-4 py-20 pb-12 bg-background text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center"
            >
                <h2 className="text-balance text-4xl font-bold md:text-5xl">Powerful Features</h2>
                <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground md:text-lg">
                    Everything you need to manage incidents efficiently and keep your community safe.
                </p>
            </motion.div>
        </div>
    )
}