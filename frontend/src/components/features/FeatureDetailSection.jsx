import { motion, useReducedMotion } from "framer-motion"
import { memo } from "react"

const FeatureDetailSection = memo(function FeatureDetailSection({ feature, index, isActive = false }) {
    const shouldReduceMotion = useReducedMotion()
    
    const containerVariants = {
        hidden: { 
            opacity: 0, 
            y: shouldReduceMotion ? 0 : 30 
        },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: shouldReduceMotion ? 0.3 : 0.6,
                staggerChildren: shouldReduceMotion ? 0 : 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { 
            opacity: 0, 
            x: shouldReduceMotion ? 0 : -20 
        },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { duration: shouldReduceMotion ? 0.2 : 0.4 }
        }
    }

    return (
        <div 
            data-feature-section={index} 
            className="min-h-[60vh] py-12 lg:py-20"
            id={`feature-section-${index}`}
            role="tabpanel"
            aria-labelledby={`feature-tab-${index}`}
            aria-hidden={!isActive}
        >
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className={`rounded-2xl border border-border/50 bg-gradient-to-br ${feature.color} p-8 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300`}
            >
                <div className="mb-6 flex items-center gap-4">
                    <motion.div 
                        className="rounded-xl bg-primary/10 p-4 text-primary ring-2 ring-primary/20"
                        whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                        transition={{ duration: 0.2 }}
                    >
                        <feature.icon className="h-8 w-8" aria-hidden="true" />
                    </motion.div>
                    <h3 className="text-3xl font-bold tracking-tight">{feature.title}</h3>
                </div>

                <p className="mb-8 text-lg text-muted-foreground leading-relaxed">{feature.description}</p>

                <motion.div 
                    className="space-y-4"
                    variants={containerVariants}
                >
                    {feature.details.map((detail, detailIndex) => (
                        <motion.div
                            key={`${feature.title}-${detailIndex}`}
                            variants={itemVariants}
                            className="flex items-start gap-3 group"
                        >
                            <motion.div 
                                className="mt-1 h-2 w-2 rounded-full bg-primary group-hover:bg-primary/80 transition-colors duration-200" 
                                whileHover={{ scale: shouldReduceMotion ? 1 : 1.2 }}
                                transition={{ duration: 0.2 }}
                                aria-hidden="true"
                            />
                            <p className="flex-1 text-foreground/90 leading-relaxed">{detail}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    )
})

export default FeatureDetailSection