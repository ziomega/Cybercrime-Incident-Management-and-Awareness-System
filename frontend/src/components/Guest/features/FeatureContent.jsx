import { memo } from "react"
import FeatureDetailSection from "./FeatureDetailSection"

const FeatureContent = memo(function FeatureContent({ features, activeIndex = 0 }) {
    return (
        <div className="lg:w-3/5" role="tabpanel" aria-labelledby={`feature-tab-${activeIndex}`}>
            {features.map((feature, index) => (
                <FeatureDetailSection
                    key={feature.title}
                    feature={feature}
                    index={index}
                    isActive={index === activeIndex}
                />
            ))}
        </div>
    )
})

export default FeatureContent