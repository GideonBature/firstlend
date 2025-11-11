import { CustomerLayout } from "@/components/customer/CustomerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
          <p className="text-muted-foreground">
            We're here to help you with any questions or concerns.
          </p>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Call Us</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Mon-Fri 9AM - 5PM
                  </p>
                  <p className="font-semibold">+234 700 FIRSTLEND</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 md:col-span-3">
            <CardHeader>
              <CardTitle>Chat with FirstLend</CardTitle>
            </CardHeader>
            <CardContent>
              <FirstLendChat />
              <Button className="w-full bg-primary text-primary-foreground">
                Submit Query
              </Button>
            </CardContent>
          </Card>

          {/* <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
               
            </CardContent>
          </Card> */}
        </div>

        {/* Support Ticket Form */}
        <Card>
          <CardHeader>
            <CardTitle>Submit a Support Ticket</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Short description of your issue"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="loan-application">
                      Loan Application
                    </SelectItem>
                    <SelectItem value="payment-issue">Payment Issue</SelectItem>
                    <SelectItem value="account-access">
                      Account Access
                    </SelectItem>
                    <SelectItem value="technical-support">
                      Technical Support
                    </SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Please describe your issue in detail."
                  className="min-h-[120px]"
                />
              </div>
              <Button className="w-full bg-primary text-primary-foreground">
                Submit Ticket
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Customer Support Hours */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5" />
                <div>
                  <p className="font-semibold">Customer Support Hours</p>
                  <p className="text-sm opacity-90">
                    Monday - Friday 9:00 AM - 5:00 PM (WAT)
                  </p>
                  <p className="text-sm opacity-90">Saturday - Sunday Closed</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Emergency Support</p>
                <p className="font-semibold">Available 24/7</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQs */}
        <Card>
          <CardHeader>
            <CardTitle>All Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqData.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="mt-4 text-center">
              <Button variant="link">View All FAQs</Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button variant="outline" className="justify-start h-auto py-4">
                <FileText className="w-4 h-4 mr-2" />
                <div className="text-left">
                  <div className="font-semibold">User Guide</div>
                  <div className="text-xs text-muted-foreground">
                    Learn how to use our platform
                  </div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-4">
                <Shield className="w-4 h-4 mr-2" />
                <div className="text-left">
                  <div className="font-semibold">Privacy Policy</div>
                  <div className="text-xs text-muted-foreground">
                    How we protect your data
                  </div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-4">
                <FileText className="w-4 h-4 mr-2" />
                <div className="text-left">
                  <div className="font-semibold">Terms & Conditions</div>
                  <div className="text-xs text-muted-foreground">
                    Read our terms
                  </div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-4">
                <Calculator className="w-4 h-4 mr-2" />
                <div className="text-left">
                  <div className="font-semibold">Loan Calculator</div>
                  <div className="text-xs text-muted-foreground">
                    Calculate your loan
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
