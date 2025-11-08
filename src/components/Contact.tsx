import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            We are Here to Help You
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get in touch with us for any inquiries or support
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <Card className="p-8 text-center space-y-4 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 mx-auto bg-pink-100 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Email us now</h3>
            <p className="text-sm text-muted-foreground">We're always ready to help</p>
            <p className="text-primary font-semibold">support@firstlend.com</p>
          </Card>

          <Card className="p-8 text-center space-y-4 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <Phone className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Call us</h3>
            <p className="text-sm text-muted-foreground">Mon-Fri: 8AM - 5PM</p>
            <p className="text-primary font-semibold">+234 700 FIRSTLEND</p>
          </Card>

          <Card className="p-8 text-center space-y-4 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
              <MapPin className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Visit us anytime</h3>
            <p className="text-sm text-muted-foreground">Our office location</p>
            <p className="text-primary font-semibold">Lagos, Nigeria</p>
          </Card>
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-br from-primary via-secondary to-primary rounded-2xl p-12 text-center max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-primary-foreground mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Subscribe to our newsletter for exclusive offers and financial tips
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 bg-background"
            />
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold whitespace-nowrap shadow-yellow">
              Subscribe Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
