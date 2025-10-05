import { useRef, useEffect, useState } from "react";
import Stepper from "./Stepper";
import { Step } from "./Stepper";

export default function CybersecurityParallax() {
    const containerRef = useRef(null);
    const [scrollOffset, setScrollOffset] = useState(0);

    // Effect to track scroll position relative to the container's center
    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const containerCenter = rect.top + rect.height / 2;
                const windowCenter = window.innerHeight / 2;
                const offset = containerCenter - windowCenter;
                setScrollOffset(offset);
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section 
            ref={containerRef}
            className="relative h-[800px] overflow-hidden bg-slate-950 flex justify-center items-center"
            role="img"
            aria-label="Professional cybersecurity dashboard visualization with parallax effect"
        >
            <div className="w-full h-full relative [perspective:800px]">
                {/* Background Layers (move slowest) */}
                <div 
                    className="absolute inset-0 transition-transform duration-100 ease-out" 
                    // REMOVED: style={{ transform: `translateY(${-scrollOffset * 0.1}px)` }}
                >
                    {/* Darker background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-black" />
                    
                    {/* Subtle grid pattern */}
                    <div 
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: `
                                linear-gradient(rgba(100, 100, 100, 0.3) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(100, 100, 100, 0.3) 1px, transparent 1px)
                            `,
                            backgroundSize: '50px 50px'
                        }}
                    />
                </div>

                {/* Mid-ground Layers (glowing shapes) */}
                <div
                    className="absolute inset-0 transition-transform duration-100 ease-out"
                    style={{ transform: `translateY(${-scrollOffset * 0.3}px) translateZ(-200px)` }}
                >
                    <div className="absolute top-[10%] left-[15%] w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-[15%] right-[20%] w-72 h-72 bg-sky-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
                    <div className="absolute top-[25%] right-[10%] w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl animate-pulse animation-delay-4000" />
                </div>

                {/* Reporting Flow Steps (Foreground) */}
                <div 
                    className="absolute inset-0 flex justify-center items-center transition-transform duration-100 ease-out"
                    style={{ transform: `translateY(${-scrollOffset * 0.5}px) translateZ(0px)` }}
                >
                    <Stepper>
                        <Step 
                            title="Step 1: Login" 
                            description="Securely log in to the reporting dashboard." 
                            icon={<svg />} 
                        />
                        <Step 
                            title="Step 2: Upload Evidence" 
                            description="Describe the crime and upload all relevant evidence." 
                            icon={<svg />} 
                        />
                    </Stepper>
                </div>

                {/* Bottom Gradient Transition */}
                <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-slate-950 to-transparent z-20" />
            </div>
        </section>
    );
}