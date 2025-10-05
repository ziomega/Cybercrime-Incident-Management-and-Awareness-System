import { memo } from "react"
import FeatureNavButton from "./FeatureNavButton"

const FeatureSidebar = memo(function FeatureSidebar({ features, activeIndex, onFeatureClick }) {
    return (
        <div className="lg:w-2/5">
            <div className="lg:sticky lg:top-24 lg:h-fit">
                <nav 
                    className="space-y-4"
                    role="tablist"
                    aria-label="Feature sections"
                >
                    {features.map((feature, index) => (
                        <FeatureNavButton
                            key={feature.title}
                            feature={feature}
                            index={index}
                            activeIndex={activeIndex}
                            onClick={() => onFeatureClick(index)}
                        />
                    ))}
                </nav>
            </div>
        </div>
    )
})

export default FeatureSidebar