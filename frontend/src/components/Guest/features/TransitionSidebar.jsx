import { motion } from "framer-motion"
import { memo } from "react"
import FeatureNavButton from "./FeatureNavButton"

const TransitionSidebar = memo(function TransitionSidebar({ 
    features, 
    activeIndex, 
    onFeatureClick, 
    sidebarOpacity, 
    sidebarX 
}) {
    return (
        <motion.div 
            style={{ opacity: sidebarOpacity, x: sidebarX }} 
            className="lg:w-2/5"
            role="tablist"
            aria-label="Feature navigation"
        >
            <div className="space-y-4">
                {features.map((feature, index) => (
                    <FeatureNavButton
                        key={feature.title}
                        feature={feature}
                        index={index}
                        activeIndex={activeIndex}
                        onClick={() => onFeatureClick(index)}
                    />
                ))}
            </div>
        </motion.div>
    )
})

export default TransitionSidebar