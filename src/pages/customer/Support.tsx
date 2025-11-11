import { useState } from "react";
import { CustomerLayout } from "@/components/customer/CustomerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Phone,
  Mail,
  MessageCircle,
  Clock,
  FileText,
  Shield,
  Calculator,
  Send,
  HelpCircle,
  MessageSquare,
  Headphones,
  CheckCircle2,
} from "lucide-react";
import FirstLendChat from "./FirstLendChat";

const faqData = [
  {
    question: "How do I apply for a loan?",
    answer:
      "You can apply for a loan by clicking on 'Apply for New Loan' in the navigation bar or dashboard. Fill out the application form with your details and submit it for review.",
  },
  {
    question: "What documents do I need to apply?",
    answer:
      "You'll need a valid government-issued ID, proof of income, bank statements, and proof of address. Complete KYC verification for faster processing.",
  },
  {
    question: "How long does loan approval take?",
    answer:
      "Loan approval typically takes 24-48 hours for standard applications. KYC verified customers may receive approval within 12 hours.",
  },
  {
    question: "Can I make early repayments?",
    answer:
      "Yes, you can make early repayments without any penalties. Early repayments may also help improve your credit score.",
  },
  {
    question: "What happens if I miss a payment?",
    answer:
      "Missing a payment may result in late fees and could affect your credit score. Please contact support immediately if you're unable to make a payment on time.",
  },
  {
    question: "How do I check my loan balance?",
    answer:
      "You can check your loan balance in the 'My Loans' section or on your dashboard. All loan details are visible there.",
  },
  {
    question: "Can I increase my loan amount?",
    answer:
      "Yes, you can apply for a loan increase after completing your current loan or by submitting a new application. Approval depends on your credit score and repayment history.",
  },
  {
    question: "How do I update my contact information?",
    answer:
      "You can update your contact information in the 'Profile' section. Make sure to keep your details up to date for important notifications.",
  },
];

const Support = () => {
  const { toast } = useToast();
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      toast({
        title: "Ticket Submitted Successfully",
        description: "Our support team will respond within 24 hours.",
      });
      setTicketForm({ subject: "", category: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <CustomerLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Help & Support
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're here to help you with any questions or concerns. Get instant assistance through our AI chat or contact our support team.
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Call Us */}
          <Card className="hover:shadow-lg transition-shadow border-2 hover:border-blue-200">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Call Us</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Mon-Fri 9AM - 5PM WAT
                  </p>
                  <p className="font-bold text-xl text-blue-600">+234 700 FIRSTLEND</p>
                  <Badge className="mt-2 bg-green-100 text-green-700 border-green-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Available Now
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Us */}
          <Card className="hover:shadow-lg transition-shadow border-2 hover:border-purple-200">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Email Us</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    24/7 Email Support
                  </p>
                  <p className="font-semibold text-purple-600">support@firstlend.com</p>
                  <Badge className="mt-2 bg-blue-100 text-blue-700 border-blue-200">
                    Response within 24hrs
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Chat */}
          <Card className="hover:shadow-lg transition-shadow border-2 hover:border-green-200">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg relative">
                  <MessageCircle className="w-8 h-8 text-white" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">AI Assistant</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Instant AI-powered help
                  </p>
                  <p className="font-semibold text-green-600">Chat now with our AI</p>
                  <Badge className="mt-2 bg-green-100 text-green-700 border-green-200">
                    <Headphones className="w-3 h-3 mr-1" />
                    Online 24/7
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Chat Section */}
        <Card className="shadow-xl border-2 border-blue-100">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Chat with FirstLend AI Assistant</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Get instant answers powered by artificial intelligence
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <FirstLendChat />
          </CardContent>
        </Card>

        {/* Support Ticket Form */}
        <Card className="shadow-lg border-2">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center">
                <Send className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Submit a Support Ticket</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Can't find what you're looking for? Send us a detailed message
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleTicketSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-semibold">
                  Subject <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="subject"
                  placeholder="Brief description of your issue"
                  value={ticketForm.subject}
                  onChange={(e) =>
                    setTicketForm({ ...ticketForm, subject: e.target.value })
                  }
                  className="border-2 focus:border-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-semibold">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={ticketForm.category}
                  onValueChange={(value) =>
                    setTicketForm({ ...ticketForm, category: value })
                  }
                  required
                >
                  <SelectTrigger id="category" className="border-2 focus:border-blue-500">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="loan-application">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Loan Application
                      </div>
                    </SelectItem>
                    <SelectItem value="payment-issue">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" />
                        Payment Issue
                      </div>
                    </SelectItem>
                    <SelectItem value="account-access">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Account Access
                      </div>
                    </SelectItem>
                    <SelectItem value="technical-support">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Technical Support
                      </div>
                    </SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-semibold">
                  Message <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="message"
                  placeholder="Please describe your issue in detail. Include any relevant information that might help us assist you better."
                  className="min-h-[140px] border-2 focus:border-blue-500"
                  value={ticketForm.message}
                  onChange={(e) =>
                    setTicketForm({ ...ticketForm, message: e.target.value })
                  }
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-6 rounded-xl shadow-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Ticket
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Customer Support Hours */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl border-0">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                  <Clock className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Customer Support Hours</h3>
                  <div className="space-y-1 text-sm text-blue-100">
                    <p className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Monday - Friday: 9:00 AM - 5:00 PM (WAT)
                    </p>
                    <p className="flex items-center gap-2 opacity-75">
                      <Clock className="w-4 h-4" />
                      Saturday - Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-center md:text-right bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="flex items-center gap-2 justify-center md:justify-end mb-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-sm font-medium text-green-100">Emergency Support</p>
                </div>
                <p className="font-bold text-2xl">Available 24/7</p>
                <p className="text-xs text-blue-100 mt-1">For urgent loan-related issues</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQs */}
        <Card className="shadow-lg border-2">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Quick answers to common questions
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="w-full space-y-2">
              {faqData.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-2 rounded-xl px-4 hover:border-blue-200 transition-colors"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-600">
                          {index + 1}
                        </span>
                      </div>
                      <span className="font-semibold">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-9 pb-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                className="border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
              >
                View All FAQs
                <FileText className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <Card className="shadow-lg border-2">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
            <CardTitle className="text-xl">Additional Resources</CardTitle>
            <p className="text-sm text-muted-foreground">
              Explore helpful guides and documentation
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="justify-start h-auto py-6 px-5 border-2 hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <div className="flex items-start gap-3 text-left w-full">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-bold text-sm mb-1">User Guide</div>
                    <div className="text-xs text-muted-foreground">
                      Learn how to use our platform
                    </div>
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto py-6 px-5 border-2 hover:border-purple-300 hover:bg-purple-50 transition-all group"
              >
                <div className="flex items-start gap-3 text-left w-full">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 transition-colors">
                    <Shield className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-bold text-sm mb-1">Privacy Policy</div>
                    <div className="text-xs text-muted-foreground">
                      How we protect your data
                    </div>
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto py-6 px-5 border-2 hover:border-green-300 hover:bg-green-50 transition-all group"
              >
                <div className="flex items-start gap-3 text-left w-full">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-bold text-sm mb-1">Terms & Conditions</div>
                    <div className="text-xs text-muted-foreground">
                      Read our terms
                    </div>
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start h-auto py-6 px-5 border-2 hover:border-amber-300 hover:bg-amber-50 transition-all group"
              >
                <div className="flex items-start gap-3 text-left w-full">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 transition-colors">
                    <Calculator className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="font-bold text-sm mb-1">Loan Calculator</div>
                    <div className="text-xs text-muted-foreground">
                      Calculate your loan
                    </div>
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
};

export default Support;
