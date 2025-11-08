import { TrendingUp, DollarSign, Users, Percent } from "lucide-react";
import { Card } from "@/components/ui/card";

const Stats = () => {
  const stats = [
    {
      icon: TrendingUp,
      value: "5,419",
      label: "Loans Disbursed",
      color: "text-accent"
    },
    {
      icon: DollarSign,
      value: "₦8.8B+",
      label: "Total Amount",
      color: "text-accent"
    },
    {
      icon: Users,
      value: "9,701+",
      label: "Happy Customers",
      color: "text-accent"
    },
    {
      icon: Percent,
      value: "9.99%",
      label: "Interest Rate",
      color: "text-accent"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary via-secondary to-primary relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="bg-secondary/50 backdrop-blur-sm border-primary-foreground/10 p-8 hover:scale-105 transition-transform duration-300 hover:shadow-lg"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <h3 className="text-4xl font-bold text-primary-foreground">{stat.value}</h3>
                <p className="text-primary-foreground/80 font-medium">{stat.label}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
