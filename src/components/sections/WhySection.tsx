
import {
  CalendarIcon,
  GlobeIcon,
  MagnifyingGlassIcon,
  BarChartIcon,
  ChatBubbleIcon,
} from "@radix-ui/react-icons";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";

const features = [
  {
    Icon: MagnifyingGlassIcon,
    name: "Find Local Challenges",
    description: "Discover sports matches and challenges in your area with our location-based matchmaking system.",
    href: "/app/challenges",
    cta: "Browse challenges",
    background: <div className="absolute -right-20 -top-20 opacity-60 bg-sport-light-purple/20 rounded-full w-40 h-40" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: CalendarIcon,
    name: "Create & Join Matches",
    description: "Set up your own sports challenges or join existing ones. Set stakes with optional bid challenges.",
    href: "/app/challenges",
    cta: "Create now",
    background: <div className="absolute -right-20 -top-20 opacity-60 bg-sport-light-purple/20 rounded-full w-40 h-40" />,
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: BarChartIcon,
    name: "Ranking System",
    description: "Climb the district-based leaderboards with our Elo ranking system and earn colored badges.",
    href: "/app/leaderboard",
    cta: "View leaderboards",
    background: <div className="absolute -right-20 -top-20 opacity-60 bg-sport-light-purple/20 rounded-full w-40 h-40" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: ChatBubbleIcon,
    name: "Real-time Chat",
    description: "Coordinate with opponents using our real-time chat system after joining challenges.",
    href: "/app/dashboard",
    cta: "Get started",
    background: <div className="absolute -right-20 -top-20 opacity-60 bg-sport-light-purple/20 rounded-full w-40 h-40" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: GlobeIcon,
    name: "Community Networks",
    description: "Connect with local sports enthusiasts and build your reputation in your district's leaderboard.",
    href: "/app/leaderboard",
    cta: "Join community",
    background: <div className="absolute -right-20 -top-20 opacity-60 bg-sport-light-purple/20 rounded-full w-40 h-40" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];

function WhySection() {
  return (
    <section id="features" className="bg-muted/50 py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why SportConnect?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            SportConnect makes it easy to find sports partners, compete, and track your progress in your local area.
          </p>
        </div>
        
        <BentoGrid className="lg:grid-rows-3">
          {features.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}

export default WhySection;
