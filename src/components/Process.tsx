import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, FileText, CheckCircle2, Zap, Award, Clock } from "lucide-react";

const Process = () => {
  const steps = [
    {
      number: "1",
      icon: UserPlus,
      title: "Create your account",
      description: "Register in minutes with your basic information and get started on your loan journey."
    },
    {
      number: "2",
      icon: FileText,
      title: "Submit Application",
      description: "Fill out a simple application form and upload required documents securely."
    },
    {
      number: "3",
      icon: CheckCircle2,
      title: "Get Loan Approval",
      description: "Receive approval within 24-48 hours and get funds disbursed to your account."
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Competitive Operations",
      description: "Best interest rates in the market with transparent pricing and no hidden fees."
    },
    {
      icon: Award,
      title: "Excellent Award Rating",
      description: "Consistently rated 5-star by our customers for excellent service delivery."
    },
    {
      icon: Clock,
      title: "24/7 Open Application Time",
      description: "Apply anytime, anywhere. Our digital platform is always open for you."
    }
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Process Section */}
        <div className="mb-20">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Fast & Easy Application Process
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get your loan in three simple steps - quick, easy, and hassle-free
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="p-8 text-center space-y-4 hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="relative inline-block">
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-accent-foreground">{step.number}</span>
                    </div>
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                      <step.icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </Card>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-accent"></div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6">
              Start Application
            </Button>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div>
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Why People Choose Us
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We provide the best lending experience with customer-focused solutions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-8 text-center space-y-4 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <benefit.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
