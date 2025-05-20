
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import WhySection from "@/components/sections/WhySection";
import FAQSection from "@/components/sections/FAQSection";
import { CTA } from "@/components/ui/call-to-action";
import { Footer } from "@/components/ui/footer-section";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sport-purple to-sport-dark-purple">
              SportConnect
            </span>
          </Link>
          
          <nav className="hidden md:flex gap-6">
            <Link to="#features" className="text-sm font-medium hover:text-sport-purple transition-colors">
              Features
            </Link>
            <Link to="#how-it-works" className="text-sm font-medium hover:text-sport-purple transition-colors">
              How It Works
            </Link>
            <Link to="#faq" className="text-sm font-medium hover:text-sport-purple transition-colors">
              FAQ
            </Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link to="/auth">Log in</Link>
            </Button>
            <Button asChild className="bg-sport-purple hover:bg-sport-dark-purple">
              <Link to="/auth">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative">
          <div className="container py-20 md:py-32 flex flex-col items-center text-center">
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
              <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-sport-purple opacity-20 blur-[100px]" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-3xl">
              Connect & Compete in Real-Life <span className="bg-clip-text text-transparent bg-gradient-to-r from-sport-purple to-sport-dark-purple">Sports Challenges</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Find local sports enthusiasts, challenge them to matches, and climb the ranks in your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-sport-purple hover:bg-sport-dark-purple">
                <Link to="/auth">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="#how-it-works">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Why Section with BentoGrid */}
        <WhySection />
        
        {/* How It Works Section */}
        <section id="how-it-works" className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Getting started with SportConnect is easy. Follow these simple steps:
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="relative">
                <div className="w-12 h-12 bg-sport-purple rounded-full flex items-center justify-center text-white font-bold mb-4">
                  1
                </div>
                <h3 className="text-lg font-bold mb-2">Create Your Profile</h3>
                <p className="text-muted-foreground">
                  Sign up and complete your profile with your sports preferences and location.
                </p>
                {/* Arrow */}
                <div className="hidden lg:block absolute top-10 right-0 w-full h-4 transform translate-x-1/2">
                  <div className="h-0.5 w-full bg-muted relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 border-t-4 border-r-4 border-b-4 border-muted border-l-0 h-3 w-3 transform rotate-45" />
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="w-12 h-12 bg-sport-purple rounded-full flex items-center justify-center text-white font-bold mb-4">
                  2
                </div>
                <h3 className="text-lg font-bold mb-2">Find Challenges</h3>
                <p className="text-muted-foreground">
                  Browse nearby challenges or create your own to invite local players.
                </p>
                {/* Arrow */}
                <div className="hidden lg:block absolute top-10 right-0 w-full h-4 transform translate-x-1/2">
                  <div className="h-0.5 w-full bg-muted relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 border-t-4 border-r-4 border-b-4 border-muted border-l-0 h-3 w-3 transform rotate-45" />
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="w-12 h-12 bg-sport-purple rounded-full flex items-center justify-center text-white font-bold mb-4">
                  3
                </div>
                <h3 className="text-lg font-bold mb-2">Compete</h3>
                <p className="text-muted-foreground">
                  Meet up in real life and play your match based on the agreed terms.
                </p>
                {/* Arrow */}
                <div className="hidden lg:block absolute top-10 right-0 w-full h-4 transform translate-x-1/2">
                  <div className="h-0.5 w-full bg-muted relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 border-t-4 border-r-4 border-b-4 border-muted border-l-0 h-3 w-3 transform rotate-45" />
                  </div>
                </div>
              </div>
              
              <div>
                <div className="w-12 h-12 bg-sport-purple rounded-full flex items-center justify-center text-white font-bold mb-4">
                  4
                </div>
                <h3 className="text-lg font-bold mb-2">Rise in Ranks</h3>
                <p className="text-muted-foreground">
                  Submit results and watch your ranking improve as you win more matches.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <FAQSection />
        
        {/* CTA Section */}
        <CTA />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
