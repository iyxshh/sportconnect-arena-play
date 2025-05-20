
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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

        {/* Features Section */}
        <section id="features" className="bg-muted/50 py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Why SportConnect?</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                SportConnect makes it easy to find sports partners, compete, and track your progress in your local area.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-background rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-sport-light-purple rounded-full flex items-center justify-center text-xl mb-4">
                  🏆
                </div>
                <h3 className="text-xl font-bold mb-2">Challenge System</h3>
                <p className="text-muted-foreground">
                  Create or join sports challenges in your area. Set stakes with optional bid challenges.
                </p>
              </div>
              
              <div className="bg-background rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-sport-light-purple rounded-full flex items-center justify-center text-xl mb-4">
                  🌎
                </div>
                <h3 className="text-xl font-bold mb-2">Location-Based</h3>
                <p className="text-muted-foreground">
                  Find sports enthusiasts near you with our geolocation-based matchmaking system.
                </p>
              </div>
              
              <div className="bg-background rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-sport-light-purple rounded-full flex items-center justify-center text-xl mb-4">
                  📈
                </div>
                <h3 className="text-xl font-bold mb-2">Ranking System</h3>
                <p className="text-muted-foreground">
                  Climb the district-based leaderboards with our Elo ranking system and earn colored badges.
                </p>
              </div>
              
              <div className="bg-background rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-sport-light-purple rounded-full flex items-center justify-center text-xl mb-4">
                  💬
                </div>
                <h3 className="text-xl font-bold mb-2">In-App Chat</h3>
                <p className="text-muted-foreground">
                  Coordinate with opponents using our real-time chat system after joining challenges.
                </p>
              </div>
              
              <div className="bg-background rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-sport-light-purple rounded-full flex items-center justify-center text-xl mb-4">
                  🏅
                </div>
                <h3 className="text-xl font-bold mb-2">Win/Lose Posters</h3>
                <p className="text-muted-foreground">
                  Show off your victories with auto-generated graphics on your profile.
                </p>
              </div>
              
              <div className="bg-background rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-sport-light-purple rounded-full flex items-center justify-center text-xl mb-4">
                  🔔
                </div>
                <h3 className="text-xl font-bold mb-2">Match Reminders</h3>
                <p className="text-muted-foreground">
                  Never miss a match with our automatic pre-match notifications system.
                </p>
              </div>
            </div>
          </div>
        </section>
        
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
        <section id="faq" className="bg-muted/50 py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Have questions about SportConnect? Here are answers to the most common questions.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-background rounded-lg p-6">
                <h3 className="text-lg font-bold mb-2">Is SportConnect available in my area?</h3>
                <p className="text-muted-foreground">
                  SportConnect is available globally! The experience is best in areas with more active users, so invite your friends to join and grow your local community.
                </p>
              </div>
              
              <div className="bg-background rounded-lg p-6">
                <h3 className="text-lg font-bold mb-2">How do bid challenges work?</h3>
                <p className="text-muted-foreground">
                  Bid challenges allow you to add a monetary stake to your matches. Funds are held in escrow until a winner is confirmed, then automatically transferred to the winner.
                </p>
              </div>
              
              <div className="bg-background rounded-lg p-6">
                <h3 className="text-lg font-bold mb-2">How does the ranking system work?</h3>
                <p className="text-muted-foreground">
                  We use an Elo-based ranking system that awards or deducts points based on match results and opponent ranking. Different colored badges are awarded as you climb the ranks.
                </p>
              </div>
              
              <div className="bg-background rounded-lg p-6">
                <h3 className="text-lg font-bold mb-2">Can I use SportConnect for team sports?</h3>
                <p className="text-muted-foreground">
                  Yes! While initially focused on individual sports, SportConnect supports team challenges where you can coordinate team formations through the in-app chat.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20">
          <div className="container">
            <div className="bg-gradient-to-r from-sport-purple to-sport-dark-purple rounded-2xl p-12 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Connect & Compete?</h2>
              <p className="text-lg mb-8 max-w-xl mx-auto">
                Join thousands of sports enthusiasts on SportConnect and start challenging players in your area today.
              </p>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-sport-purple">
                <Link to="/auth">Create Your Account</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-muted py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sport-purple to-sport-dark-purple">
                SportConnect
              </span>
              <p className="text-muted-foreground mt-2">
                Connect. Compete. Conquer.
              </p>
            </div>
            
            <div className="flex gap-8">
              <div>
                <h4 className="font-medium mb-2">Product</h4>
                <ul className="space-y-1">
                  <li><a href="#features" className="text-muted-foreground hover:text-sport-purple">Features</a></li>
                  <li><a href="#how-it-works" className="text-muted-foreground hover:text-sport-purple">How it works</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-sport-purple">Pricing</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Support</h4>
                <ul className="space-y-1">
                  <li><a href="#faq" className="text-muted-foreground hover:text-sport-purple">FAQs</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-sport-purple">Contact</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-sport-purple">Privacy</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-muted-foreground/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2025 SportConnect. All rights reserved.
            </p>
            
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-sport-purple">
                Terms
              </a>
              <a href="#" className="text-muted-foreground hover:text-sport-purple">
                Privacy
              </a>
              <a href="#" className="text-muted-foreground hover:text-sport-purple">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
