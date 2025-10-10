import { motion, useReducedMotion } from "framer-motion"
import { memo } from "react"

const FeatureNavButton = memo(function FeatureNavButton({ feature, index, activeIndex, onClick }) {
    const isActive = activeIndex === index
    const shouldReduceMotion = useReducedMotion()

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onClick()
        }
    }

    return (
        <motion.button
            onClick={onClick}
            onKeyDown={handleKeyDown}
            className={`w-full rounded-xl border p-6 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                isActive
                    ? "border-primary bg-primary/5 shadow-lg ring-1 ring-primary/20"
                    : "border-border bg-card/50 hover:border-primary/50 hover:bg-card/70"
            }`}
            whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            transition={{ duration: 0.2 }}
            aria-pressed={isActive}
            role="tab"
            id={`feature-tab-${index}`}
            aria-controls={`feature-section-${index}`}
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
        >
            <div className="flex items-center gap-4">
                <motion.div
                    className={`rounded-lg p-3 transition-all duration-200 ${
                        isActive 
                            ? "bg-primary text-primary-foreground shadow-sm" 
                            : "bg-muted text-muted-foreground group-hover:bg-muted/80"
                    }`}
                    whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                >
                    <feature.icon className="h-5 w-5" aria-hidden="true" />
                </motion.div>
                <div className="flex-1">
                    <h3
                        className={`font-semibold transition-colors duration-200 ${
                            isActive 
                                ? "text-foreground" 
                                : "text-muted-foreground group-hover:text-foreground"
                        }`}
                    >
                        {feature.title}
                    </h3>
                    {isActive && (
                        <motion.p 
                            className="text-sm text-muted-foreground mt-1 leading-relaxed"
                            initial={shouldReduceMotion ? {} : { opacity: 0, height: 0 }}
                            animate={shouldReduceMotion ? {} : { opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.3 }}
                        >
                            {feature.description}
                        </motion.p>
                    )}
                </div>
                {isActive && (
                    <motion.div
                        className="h-2 w-2 rounded-full bg-primary"
                        initial={shouldReduceMotion ? {} : { scale: 0 }}
                        animate={shouldReduceMotion ? {} : { scale: 1 }}
                        transition={{ duration: 0.2 }}
                        aria-hidden="true"
                    />
                )}
            </div>
        </motion.button>
    )
})

export default FeatureNavButton