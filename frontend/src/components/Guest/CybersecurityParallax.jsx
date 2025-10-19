import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function CybersecurityParallax() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    // Demo data for sticky cards (cybersecurity themed)
    const cards = [
        {
            tagline: "Step 1",
            title: "Report a Cyber Crime",
            excerpt: "Initiate the process by reporting any suspicious activity or cyber crime through our secure platform. Provide detailed information to help us understand the issue.",
            image: "https://images.unsplash.com/photo-1581093588401-7b8bd3802a4f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&q=80&w=1960&auto=format&fit=crop"
        },
        {
            tagline: "Step 2",
            title: "Case Assignment",
            excerpt: "Once reported, your case is assigned to a dedicated cybersecurity expert who will analyze the details and prioritize the investigation.",
            image: "https://images.unsplash.com/photo-1581091012184-7a4b6b6d5a6f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&q=80&w=1970&auto=format&fit=crop"
        },
        {
            tagline: "Step 3",
            title: "Evidence Collection",
            excerpt: "Our team collects and analyzes digital evidence, including logs, network data, and other artifacts, to build a strong case against the perpetrators.",
            image: "https://images.unsplash.com/photo-1581092334395-6d8c5e6f5b4c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&q=80&w=1970&auto=format&fit=crop"
        },
        {
            tagline: "Step 4",
            title: "Comprehensive Report",
            excerpt: "A detailed report is prepared, summarizing the findings, evidence, and actionable recommendations to address the incident effectively.",
            image: "https://images.unsplash.com/photo-1581091012184-7a4b6b6d5a6f?q=80&w=1970&auto=format&fit=crop"
        },
        {
            tagline: "Step 5",
            title: "Strengthen Security",
            excerpt: "Based on the findings, implement measures to prevent future incidents, enhance your security infrastructure, and ensure resilience.",
            image: "https://images.unsplash.com/photo-1581092334395-6d8c5e6f5b4c?q=80&w=1970&auto=format&fit=crop"
        },
        {
            tagline: "Step 6",
            title: "Monitor Systems",
            excerpt: "Set up continuous monitoring systems to detect and respond to potential threats in real-time, ensuring ongoing protection.",
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&q=80&w=2070&auto=format&fit=crop"
        },
        {
            tagline: "Step 7",
            title: "Incident Response Training",
            excerpt: "Train your team on incident response protocols to ensure they are prepared to handle future cybersecurity challenges effectively.",
            image: "https://images.unsplash.com/photo-1526379095098-8463e763d1c7?q=80&w=2070&auto=format&fit=crop"
        },
        {
            tagline: "Step 8",
            title: "Regular Security Audits",
            excerpt: "Conduct periodic security audits to identify vulnerabilities and ensure compliance with the latest cybersecurity standards.",
            image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop"
        },
        {
            tagline: "Step 9",
            title: "Update Security Policies",
            excerpt: "Review and update your organization's security policies to align with evolving threats and industry best practices.",
            image: "https://images.unsplash.com/photo-1556742031-c6961e8560b0?q=80&w=2070&auto=format&fit=crop"
        },
        {
            tagline: "Step 10",
            title: "Collaborate with Experts",
            excerpt: "Engage with cybersecurity experts and organizations to stay informed about the latest threats and solutions.",
            image: "https://images.unsplash.com/photo-1526372925646-5d4b6a3229a6?q=80&w=2070&auto=format&fit=crop"
        }
    ];

    const StickyCard = ({ card, index, isLast }) => {
        const ref = useRef(null);
        const { scrollYProgress } = useScroll({
            target: ref,
            offset: ["start end", "end start"],
        });
        const scale = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.5, 0.5]);
        return (
            <motion.div
                ref={ref}
                style={{ scale, zIndex: index + 1, willChange: "transform", transformOrigin: "center top" }}
                className="sticky top-36 grid grid-cols-1 md:grid-cols-2 gap-6 w-full h-[90vh] min-h-[600px] bg-white/95 border border-slate-800 backdrop-blur rounded-xl overflow-hidden shadow-xl"
            >
                <div className="flex flex-col justify-center p-8 md:p-10">
                    <div className="text-teal-600 font-semibold uppercase tracking-wide text-sm md:text-base">
                        {card.tagline}
                    </div>
                    <h2 className="mt-2 text-2xl md:text-4xl font-semibold text-slate-900">
                        {card.title}
                    </h2>
                    <p className="mt-3 text-slate-600 leading-relaxed">
                        {card.excerpt}
                    </p>
                    <div className="mt-6">
                        <a
                            href="#"
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm md:text-base border border-slate-900 text-slate-900 rounded hover:bg-slate-900 hover:text-white transition-colors"
                        >
                            Learn more
                        </a>
                    </div>
                </div>
                <div className="relative overflow-hidden">
                    <img
                        src={card.image}
                        alt={card.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>
            </motion.div>
        );
    };

    return (
        <div className="w-full">
            {/* Wrapper ensures hero sticks only while this section is in view */}
            <section className="relative">
                {/* Parallax hero pinned to top while this wrapper scrolls */}
                <section
                    ref={containerRef}
                    className="sticky top-0 z-0 h-[700px] relative overflow-hidden bg-slate-950 flex justify-center items-center"
                    role="img"
                    aria-label="Professional cybersecurity dashboard visualization with parallax effect"
                >
                    {/* Parallax Background Image (becomes static when pinned) */}
                    <motion.div
                        className="absolute inset-0 bg-cover bg-center opacity-40"
                        style={{
                            backgroundImage:
                                "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')",
                            y: backgroundY,
                            scale: 1.2,
                        }}
                    />

                    {/* Dark overlay for text readability */}
                    <div className="absolute inset-0 bg-slate-950/60" />

                    {/* Grid pattern overlay */}
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: `
                            linear-gradient(rgba(56, 189, 248, 0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(56, 189, 248, 0.3) 1px, transparent 1px)
                        `,
                            backgroundSize: "50px 50px",
                        }}
                    />

                    {/* Glowing orbs */}
                    <div className="absolute inset-0">
                        <div className="absolute top-[20%] left-[10%] w-48 h-48 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
                        <div
                            className="absolute bottom-[20%] right-[15%] w-64 h-64 bg-sky-500/10 rounded-full blur-3xl animate-pulse"
                            style={{ animationDelay: "1s" }}
                        />
                    </div>
                </section>

                {/* Sticky stacked cards (Framer Motion) overlaying the hero */}
                <section className="w-full max-w-[1200px] mx-auto relative z-10 -mt-[400px] pt-[400px]">
                    <header className="max-w-3xl mx-auto px-5 py-12 text-center text-white">
                        <p className="opacity-80 mb-2">Platform capabilities</p>
                        <h1 className="text-3xl md:text-5xl font-semibold mb-4">Built for Modern Security Teams</h1>
                        <p className="text-slate-300 leading-relaxed">
                            Scroll to explore key modules. Each card pins while previous ones gently scale down for a smooth, progressive reveal.
                        </p>
                    </header>

                    <div className="relative">
                        {cards.map((card, i) => (
                            <StickyCard key={card.title} card={card} index={i} isLast={i === cards.length - 1} />
                        ))}
                    </div>

                    {/* Spacer so the last sticky card can fully show before page end */}
                    <div className="h-96" />
                </section>
            </section>
        </div>
    );
}