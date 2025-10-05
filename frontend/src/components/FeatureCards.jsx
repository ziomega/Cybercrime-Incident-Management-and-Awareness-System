import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { features } from "./features/featuresData"
import { ChevronRight } from "lucide-react"

// Main component for displaying features
export default function FeatureCards() {
    const [activeIndex, setActiveIndex] = useState(0)
    const featureContainerRef = useRef(null)

    const handleFeatureClick = useCallback((index) => {
        const section = document.querySelector(`[data-feature-index="${index}"]`)
        if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "center" })
        }
    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        const index = parseInt(entry.target.dataset.featureIndex, 10)
                        setActiveIndex(index)
                    }
                }
            },
            {
                rootMargin: "-50% 0px -50% 0px",
                threshold: 0,
            }
        )

        const sections = featureContainerRef.current?.querySelectorAll("[data-feature-index]")
        sections?.forEach((section) => observer.observe(section))

        return () => sections?.forEach((section) => observer.unobserve(section))
    }, [])

    return (
        <section className="relative bg-gray-900 py-20 text-white sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
                    <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                        A New Era of Law Enforcement
                    </h2>
                    <p className="mt-6 text-lg tracking-tight text-gray-300">
                        Our platform is engineered to provide unparalleled efficiency, security, and intelligence for modern law enforcement agencies.
                    </p>
                </div>

                <div className="mt-16 grid grid-cols-1 items-start gap-y-10 gap-x-8 md:mt-20 md:grid-cols-4">
                    {/* Feature List / Sidebar */}
                    <div className="sticky top-24 col-span-1 flex flex-col gap-y-2">
                        {features.map((feature, index) => (
                            <FeatureNavItem
                                key={feature.title}
                                title={feature.title}
                                isActive={activeIndex === index}
                                onClick={() => handleFeatureClick(index)}
                            />
                        ))}
                    </div>

                    {/* Feature Content Display */}
                    <div className="relative col-span-3" ref={featureContainerRef}>
                        {features.map((feature, index) => (
                            <div key={feature.title} data-feature-index={index} className="flex h-[80vh] items-center">
                                <AnimatePresence>
                                    {activeIndex === index && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -50 }}
                                            transition={{ duration: 0.5, ease: "easeInOut" }}
                                            className={`w-full rounded-3xl bg-gray-800 p-8 shadow-2xl shadow-black/20 lg:p-12`}
                                        >
                                            <FeatureContent feature={feature} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

// Navigation item for the feature list
function FeatureNavItem({ title, isActive, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`group flex w-full items-center justify-between rounded-lg p-4 text-left transition-colors duration-300 ${
                isActive ? "bg-blue-600 text-white shadow-md" : "bg-gray-800 hover:bg-gray-700"
            }`}
        >
            <span className="text-lg font-semibold">{title}</span>
            <ChevronRight
                className={`h-6 w-6 transform text-gray-400 transition-transform duration-300 ${
                    isActive ? "translate-x-1 text-white" : "group-hover:translate-x-1"
                }`}
            />
        </button>
    )
}

// Component to display the content of a single feature
function FeatureContent({ feature }) {
    const { icon: Icon, title, description, details } = feature
    return (
        <div className="flex flex-col gap-y-6">
            <div className="flex items-center gap-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-700 text-blue-400">
                    <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-white">{title}</h3>
            </div>
            <p className="text-lg text-gray-300">{description}</p>
            <ul className="mt-4 space-y-3">
                {details.map((detail, i) => (
                    <li key={i} className="flex items-start">
                        <ChevronRight className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-blue-400" />
                        <span className="text-gray-300">{detail}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}