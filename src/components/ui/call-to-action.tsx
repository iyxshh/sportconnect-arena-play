
import { MoveRight, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function CTA() {
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col text-center bg-muted rounded-md p-4 lg:p-14 gap-8 items-center">
          <div>
            <Badge>Get started</Badge>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">
              Ready to Connect & Compete?
            </h3>
            <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl mx-auto">
              Join thousands of sports enthusiasts on SportConnect and start challenging players in your area today.
              Find matches, compete, and climb the ranks!
            </p>
          </div>
          <div className="flex flex-row gap-4">
            <Button className="gap-4" variant="outline">
              Learn more <PhoneCall className="w-4 h-4" />
            </Button>
            <Button className="gap-4 bg-sport-purple hover:bg-sport-dark-purple">
              Sign up now <MoveRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { CTA };
