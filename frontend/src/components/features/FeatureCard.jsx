import { motion } from "framer-motion"

export default function FeatureCard({ feature, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`group rounded-xl border border-border bg-gradient-to-br ${feature.color} p-6 backdrop-blur-sm`}
        >
            <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                <feature.icon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
        </motion.div>
    )
}