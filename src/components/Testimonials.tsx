import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Obioma Adeleke",
      role: "Small Business Owner",
      content: "FirstLend was essential for my business with their quick approval process. The interest rates are very competitive and the customer service team were excellent.",
      rating: 5
    },
    {
      name: "Oluwaseun Babajide",
      role: "Education Student",
      content: "I was able to complete my Masters degree thanks to FirstLend's education loan. The flexible repayment terms made it stress-free for me.",
      rating: 5
    },
    {
      name: "Amina Mohammed",
      role: "Entrepreneur",
      content: "The entire loan process was seamless from application to disbursement. FirstLend truly understands the needs of Nigerian businesses.",
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-primary via-secondary to-primary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground">
            Some of our Awesome Testimonials
          </h2>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
            Don't just take our word for it - Hear from our satisfied customers
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-8 bg-background hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="space-y-4">
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
                
                <p className="text-muted-foreground leading-relaxed italic">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
