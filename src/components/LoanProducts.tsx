import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Shield, TrendingUp, ArrowRight, CheckCircle } from "lucide-react";

const LoanProducts = () => {
  const products = [
    {
      icon: FileText,
      title: "Personal Loan",
      description: "Quick personal loans up to ₦5,000,000 with flexible repayment terms",
      features: ["Up to ₦5M", "Low interest rates", "Flexible terms"],
      rate: "2.5%",
      color: "border-primary/20"
    },
    {
      icon: Shield,
      title: "Education Loan",
      description: "Invest in your future with our education financing solutions",
      features: ["Student friendly", "Grace period", "Low rates"],
      rate: "2.0%",
      color: "border-primary/20"
    },
    {
      icon: TrendingUp,
      title: "Business Loan",
      description: "Grow your business with our tailored business loan packages",
      features: ["Up to ₦50M", "Business growth", "Quick approval"],
      rate: "3.0%",
      color: "border-accent",
      highlight: true
    }
  ];

  return (
    <section id="products" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Flex Loan Products We Offers
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose from our range of loan products designed to meet your specific financial needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {products.map((product, index) => (
            <Card 
              key={index}
              className={`p-8 ${product.color} ${product.highlight ? 'border-2 shadow-yellow ring-2 ring-accent/20' : ''} hover:shadow-lg transition-all duration-300 hover:scale-105`}
            >
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                  <product.icon className="w-8 h-8 text-primary" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">{product.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                </div>

                <div className="space-y-3">
                  {product.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="text-sm text-muted-foreground">Interest from</span>
                    <span className="text-3xl font-bold text-primary">{product.rate}</span>
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground group">
                    Read More
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LoanProducts;
