import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Calculator as CalcIcon, DollarSign, Calendar, TrendingDown } from "lucide-react";

const Calculator = () => {
  const [amount, setAmount] = useState(1000000);
  const [rate, setRate] = useState(15);
  const [term, setTerm] = useState(12);

  const monthlyPayment = (amount * (rate / 100 / 12) * Math.pow(1 + rate / 100 / 12, term)) / (Math.pow(1 + rate / 100 / 12, term) - 1);
  const totalPayment = monthlyPayment * term;
  const totalInterest = totalPayment - amount;

  return (
    <section id="calculator" className="py-20 bg-gradient-to-br from-primary via-secondary to-primary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-4">
            <CalcIcon className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Loan Calculator
          </h2>
          <p className="text-xl text-primary-foreground/90">
            Calculate your monthly payments and see how much your loan will cost
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Input Card */}
          <Card className="p-8 bg-background space-y-8">
            <h3 className="text-2xl font-bold text-foreground mb-6">Enter Loan Details</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-sm font-medium text-foreground">Loan Amount</label>
                  <span className="text-lg font-bold text-primary">₦{amount.toLocaleString()}</span>
                </div>
                <Slider
                  value={[amount]}
                  onValueChange={(val) => setAmount(val[0])}
                  min={100000}
                  max={10000000}
                  step={100000}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₦100K</span>
                  <span>₦10M</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-sm font-medium text-foreground">Interest Rate (Annual)</label>
                  <span className="text-lg font-bold text-primary">{rate}%</span>
                </div>
                <Slider
                  value={[rate]}
                  onValueChange={(val) => setRate(val[0])}
                  min={5}
                  max={30}
                  step={0.5}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5%</span>
                  <span>30%</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-sm font-medium text-foreground">Loan Term</label>
                  <span className="text-lg font-bold text-primary">{term} months</span>
                </div>
                <Slider
                  value={[term]}
                  onValueChange={(val) => setTerm(val[0])}
                  min={1}
                  max={60}
                  step={1}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 month</span>
                  <span>60 months</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground italic">
              These calculations are estimates. Actual rates and terms may vary.
            </p>
          </Card>

          {/* Results Card */}
          <div className="space-y-4">
            <Card className="p-6 bg-accent border-accent">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-accent-foreground" />
                <span className="text-sm font-medium text-accent-foreground">Monthly Payment</span>
              </div>
              <p className="text-4xl font-bold text-accent-foreground">₦{monthlyPayment.toLocaleString('en-NG', { maximumFractionDigits: 2 })}</p>
            </Card>

            <Card className="p-6 bg-background">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">Total Payment</span>
              </div>
              <p className="text-3xl font-bold text-primary">₦{totalPayment.toLocaleString('en-NG', { maximumFractionDigits: 2 })}</p>
            </Card>

            <Card className="p-6 bg-background">
              <div className="flex items-center gap-3 mb-2">
                <TrendingDown className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-foreground">Total Interest</span>
              </div>
              <p className="text-3xl font-bold text-green-600">₦{totalInterest.toLocaleString('en-NG', { maximumFractionDigits: 2 })}</p>
            </Card>

            <Card className="p-6 bg-accent/10 border-accent">
              <h4 className="font-bold text-foreground mb-4">Loan Summary</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Principal Amount</span>
                  <span className="font-semibold text-foreground">₦{amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Interest Rate</span>
                  <span className="font-semibold text-foreground">{rate}% p.a.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Loan Duration</span>
                  <span className="font-semibold text-foreground">{term} months</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-border">
                  <span className="text-muted-foreground">You will pay back</span>
                  <span className="font-bold text-foreground">₦{totalPayment.toLocaleString('en-NG', { maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </Card>

            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg py-6 shadow-yellow">
              Apply for This Loan
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calculator;
