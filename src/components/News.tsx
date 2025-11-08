import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight, Calendar } from "lucide-react";

const News = () => {
  const articles = [
    {
      category: "BUSINESS LOAN",
      title: "Business Loan Updates for 2024",
      description: "New loan products and improved terms for small and medium businesses.",
      date: "1 Dec 2024"
    },
    {
      category: "PERSONAL LOAN",
      title: "Achieving Financial Freedom",
      description: "Tips and strategies for managing your personal finance effectively.",
      date: "10 Dec 2024"
    },
    {
      category: "EDUCATION LOAN",
      title: "Invest in Your Education",
      description: "How education loans can help you achieve your academic goals.",
      date: "5 Dec 2024"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Latest News from our Company
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay updated with the latest news, tips, and insights from FirstLend
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {articles.map((article, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="bg-primary h-48 flex items-center justify-center">
                <FileText className="w-16 h-16 text-primary-foreground/60" />
              </div>
              <div className="p-6 space-y-4">
                <div className="inline-block px-3 py-1 bg-primary/10 rounded-full">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                    {article.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground">{article.title}</h3>
                <p className="text-muted-foreground">{article.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{article.date}</span>
                  </div>
                  <Button variant="ghost" className="text-primary hover:text-primary/80 group">
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

export default News;
