import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
    ShieldCheck,
    FileText,
    Users,
    BarChart,
    Shield,
    Eye,
    AlertTriangle,
    ClipboardList,
    BookOpen,
    Briefcase,
} from "lucide-react";

export default function CybersecurityParallax() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "200%"]);

    const cards = [
        {
            tagline: "Step 1",
            title: "Report a Cyber Crime",
            excerpt: "Initiate the process by reporting any suspicious activity or cyber crime through our secure platform.",
            icon: ShieldCheck,
            image: "https://images.unsplash.com/photo-1581093588401-7b8bd3802a4f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&q=80&w=1960&auto=format&fit=crop"
        },
        {
            tagline: "Step 2",
            title: "Case Assignment",
            excerpt: "Your case is assigned to a dedicated cybersecurity expert for analysis and investigation.",
            icon: FileText,
            image: "https://images.unsplash.com/photo-1581091012184-7a4b6b6d5a6f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&q=80&w=1970&auto=format&fit=crop"
        },
        {
            tagline: "Step 3",
            title: "Evidence Collection",
            excerpt: "Our team collects and analyzes digital evidence to build a strong case against perpetrators.",
            icon: Users,
            image: "https://images.unsplash.com/photo-1581092334395-6d8c5e6f5b4c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&q=80&w=1970&auto=format&fit=crop"
        },
        {
            tagline: "Step 4",
            title: "Comprehensive Report",
            excerpt: "A detailed report is prepared, summarizing findings, evidence, and actionable recommendations.",
            icon: BarChart,
            image: "https://images.unsplash.com/photo-1581091012184-7a4b6b6d5a6f?q=80&w=1970&auto=format&fit=crop"
        },
        {
            tagline: "Step 5",
            title: "Strengthen Security",
            excerpt: "Implement measures to prevent future incidents and enhance your security infrastructure.",
            icon: Shield,
            image: "https://images.unsplash.com/photo-1581092334395-6d8c5e6f5b4c?q=80&w=1970&auto=format&fit=crop"
        },
    ];

    const StickyCard = ({ card, index }) => {
        const ref = useRef(null);
        const { scrollYProgress } = useScroll({
            target: ref,
            offset: ["start end", "end start"],
        });

        const scale = useTransform(scrollYProgress, [0, 0.3, 1], [0.8, 1, 0.8]);
        const rotate = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? 5 : -5, 0]);
        const imageScale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);

        const isEven = index % 2 === 0;

        return (
            <motion.div
                ref={ref}
                style={{ scale, rotate, zIndex: index, willChange: "transform", transformOrigin: "center" }}
                className="sticky top-28 w-full max-w-4xl mx-auto h-[70vh] min-h-[500px] my-12"
            >
                <div className="relative w-full h-full bg-slate-800/60 backdrop-blur-xl border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
                    <div className={`grid grid-cols-1 md:grid-cols-2 w-full h-full ${isEven ? '' : 'md:grid-flow-row-dense'}`}>
                        <div className={`flex flex-col justify-center p-8 md:p-12 ${isEven ? 'md:order-1' : 'md:order-2'}`}>
                            <div className="flex items-center gap-3">
                                <div className="bg-slate-700/80 text-teal-300 p-3 rounded-lg">
                                    <card.icon className="w-6 h-6" />
                                </div>
                                <div className="text-teal-400 font-semibold uppercase tracking-wider text-sm">
                                    {card.tagline}
                                </div>
                            </div>
                            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-white">
                                {card.title}
                            </h2>
                            <p className="mt-3 text-slate-300 leading-relaxed">
                                {card.excerpt}
                            </p>
                        </div>
                        <div className={`relative overflow-hidden ${isEven ? 'md:order-2' : 'md:order-1'}`}>
                            <motion.div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{
                                    backgroundImage: `url(${card.image})`,
                                    scale: imageScale,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="w-full bg-slate-900">
            <section
                ref={containerRef}
                className="relative h-[80vh] min-h-[600px] flex flex-col justify-center items-center text-center p-5 overflow-hidden"
            >
                <motion.div
                    className="absolute inset-0 bg-cover bg-center opacity-20"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')",
                        y: backgroundY,
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />

                <motion.div style={{ y: textY }} className="relative z-10">
                    <p className="text-teal-400 font-semibold">Our Commitment to Digital Safety</p>
                    <h1 className="text-4xl md:text-6xl font-bold mt-2 leading-tight text-white">
                        Proactive Cyber Defense
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-slate-300">
                        A comprehensive, step-by-step approach to managing cyber incidents and strengthening your security posture.
                    </p>
                </motion.div>
            </section>

            <section className="relative z-10 -mt-32">
                <div className="relative">
                    {cards.map((card, i) => (
                        <StickyCard key={card.title} card={card} index={i} />
                    ))}
                </div>
                <div className="h-96" />
            </section>
        </div>
    );
}