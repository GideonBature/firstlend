import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-primary via-primary to-secondary overflow-hidden pt-20">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight">
              Your ambition, Our First Priority.{" "}
              <span className="text-accent">Get the Loan</span> you need today.
            </h1>
            
            <p className="text-xl text-primary-foreground/90 leading-relaxed max-w-2xl">
              Quick access to funds with competitive rates and flexible repayment terms. 
              Your financial goals are within reach with FirstLend.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-lg px-8 py-6 shadow-yellow group">
                Apply Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary-foreground text-black hover:bg-primary-foreground hover:text-primary font-semibold text-lg px-8 py-6"
              >
                Learn More
              </Button>
            </div>
          </div>

          <div className="relative flex justify-center items-center animate-scale-in">
            <div className="relative">
              {/* Outer glow circle */}
              <div className="absolute inset-0 bg-secondary/30 rounded-full blur-3xl scale-110"></div>
              
              {/* Main circle */}
              <div className="relative w-80 h-80 md:w-96 md:h-96 bg-gradient-to-br from-accent to-accent rounded-full flex items-center justify-center shadow-2xl">
                <TrendingUp className="w-32 h-32 md:w-40 md:h-40 text-primary" strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
