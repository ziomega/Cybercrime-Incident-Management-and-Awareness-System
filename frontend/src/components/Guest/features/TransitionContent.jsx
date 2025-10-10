import { motion } from "framer-motion"

export default function TransitionContent({ features, activeIndex, contentOpacity, contentX }) {
    const ActiveIcon = features[activeIndex].icon

    return (
        <motion.div style={{ opacity: contentOpacity, x: contentX }} className="lg:w-3/5">
            <div className="rounded-2xl border border-border bg-card/50 p-8 backdrop-blur-sm">
                <div className="mb-6 flex items-center gap-4">
                    <div className="rounded-xl bg-primary/10 p-4 text-primary">
                        <ActiveIcon className="h-8 w-8" />
                    </div>
                    <h3 className="text-3xl font-bold">{features[activeIndex].title}</h3>
                </div>
                <p className="text-muted-foreground">Scroll to explore each feature in detail</p>
            </div>
        </motion.div>
    )
}