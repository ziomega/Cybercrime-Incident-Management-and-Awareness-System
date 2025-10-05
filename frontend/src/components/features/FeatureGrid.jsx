import { motion } from "framer-motion"
import FeatureCard from "./FeatureCard"

export default function FeatureGrid({ features, gridOpacity }) {
    return (
        <motion.div style={{ opacity: gridOpacity }} className="pointer-events-none absolute inset-0 px-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => (
                    <FeatureCard
                        key={feature.title}
                        feature={feature}
                        index={index}
                    />
                ))}
            </div>
        </motion.div>
    )
}