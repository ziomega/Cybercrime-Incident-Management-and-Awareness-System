import { Shield, Zap, Brain, Lock, Activity, Database } from "lucide-react"

export const features = [
    {
        icon: Shield,
        title: "Secure Evidence Chain",
        description: "Tamper-proof evidence management with blockchain-verified chain of custody and encrypted storage.",
        details: [
            "Blockchain-verified chain of custody ensures evidence integrity",
            "Military-grade AES-256 encryption for all stored data",
            "Automated audit logs track every access and modification",
            "Digital signatures prevent tampering and ensure authenticity",
            "Compliant with legal standards for evidence admissibility",
        ],
        color: "from-blue-500/20 to-cyan-500/20",
    },
    {
        icon: Zap,
        title: "Real-Time Dispatch",
        description: "Instant incident routing with AI-powered priority assessment and automated resource allocation.",
        details: [
            "AI algorithms assess incident severity in milliseconds",
            "Automatic routing to nearest available units",
            "Real-time GPS tracking of all field personnel",
            "Dynamic resource reallocation based on priority",
            "Integration with CAD systems for seamless operations",
        ],
        color: "from-purple-500/20 to-pink-500/20",
    },
    {
        icon: Brain,
        title: "Predictive Analytics",
        description: "Machine learning models identify crime patterns, predict hotspots, and optimize patrol routes.",
        details: [
            "Historical data analysis identifies emerging crime patterns",
            "Heat maps visualize high-risk areas in real-time",
            "Predictive models forecast incident likelihood by location",
            "Optimized patrol routes reduce response times by 40%",
            "Continuous learning improves accuracy over time",
        ],
        color: "from-orange-500/20 to-red-500/20",
    },
    {
        icon: Lock,
        title: "Zero-Trust Security",
        description: "Multi-factor authentication, role-based access control, and end-to-end encryption by default.",
        details: [
            "Multi-factor authentication for all user access",
            "Granular role-based permissions control data visibility",
            "End-to-end encryption protects data in transit and at rest",
            "Regular security audits and penetration testing",
            "SOC 2 Type II and ISO 27001 certified infrastructure",
        ],
        color: "from-green-500/20 to-emerald-500/20",
    },
    {
        icon: Activity,
        title: "Live Monitoring",
        description: "Real-time dashboards with incident tracking, team status, and automated alert escalation.",
        details: [
            "Customizable dashboards show critical metrics at a glance",
            "Live incident status updates across all channels",
            "Automated escalation for time-sensitive incidents",
            "Team availability and workload visualization",
            "Mobile-responsive for monitoring on the go",
        ],
        color: "from-indigo-500/20 to-blue-500/20",
    },
    {
        icon: Database,
        title: "Unified Data Hub",
        description: "Centralized repository integrating CAD, RMS, and third-party systems with full audit trails.",
        details: [
            "Single source of truth for all incident data",
            "Seamless integration with existing CAD and RMS systems",
            "API-first architecture for easy third-party connections",
            "Complete audit trails for compliance and accountability",
            "Advanced search and filtering across all data sources",
        ],
        color: "from-yellow-500/20 to-orange-500/20",
    },
]