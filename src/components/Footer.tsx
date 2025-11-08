import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary/95 text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-xl">F</span>
              </div>
              <span className="text-primary-foreground font-bold text-xl">FirstLend</span>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Your trusted partner for all your lending needs. Fast, secure, and reliable.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-primary-foreground">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-primary-foreground/80 hover:text-accent transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <a href="#products" className="text-primary-foreground/80 hover:text-accent transition-colors text-sm">
                  Loan Products
                </a>
              </li>
              <li>
                <a href="#about" className="text-primary-foreground/80 hover:text-accent transition-colors text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="text-primary-foreground/80 hover:text-accent transition-colors text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold mb-4 text-primary-foreground">Services</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors text-sm">
                  Personal Loan
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors text-sm">
                  Business Loan
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors text-sm">
                  Education Loan
                </a>
              </li>
              <li>
                <a href="#calculator" className="text-primary-foreground/80 hover:text-accent transition-colors text-sm">
                  Loan Calculator
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-4 text-primary-foreground">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors text-sm">
                  Security
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors text-sm">
                  FAQs
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/80 text-sm">
              © 2024 FirstLend Nigeria. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-accent flex items-center justify-center transition-colors group">
                <Facebook className="w-5 h-5 text-primary-foreground group-hover:text-primary" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-accent flex items-center justify-center transition-colors group">
                <Twitter className="w-5 h-5 text-primary-foreground group-hover:text-primary" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-accent flex items-center justify-center transition-colors group">
                <Linkedin className="w-5 h-5 text-primary-foreground group-hover:text-primary" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-accent flex items-center justify-center transition-colors group">
                <Instagram className="w-5 h-5 text-primary-foreground group-hover:text-primary" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
