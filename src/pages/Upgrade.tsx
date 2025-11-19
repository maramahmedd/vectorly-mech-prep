// src/pages/Upgrade.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/ui/navbar";
import { CheckCircle, Star, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Upgrade = () => {
  const features = {
    free: [
      "4 free practice problems",
      "Basic progress tracking", 
      "Community access"
    ],
    premium: [
      "Unlimited practice problems",
      "Advanced analytics & insights",
      "Industry-specific problem filters",
      "Theory deep-dives & explanations", 
      "1-on-1 mentorship sessions",
      "Mock interview simulations",
      "Company-specific interview prep",
      "Priority support"
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-card">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Button variant="ghost" size="sm" asChild className="mb-6">
            <Link to="/practice">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Practice
            </Link>
          </Button>
          
          <h1 className="text-4xl font-bold mb-4">Unlock Your Full Potential</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get unlimited access to premium problems and advanced features to ace your engineering interviews
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="shadow-medium">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Free</CardTitle>
              <div className="text-4xl font-bold text-primary">$0</div>
              <p className="text-muted-foreground">per month</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {features.free.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" disabled>
                Current Plan
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="relative border-primary shadow-strong scale-105">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-primary text-white flex items-center gap-1">
                <Star className="w-3 h-3" />
                Most Popular
              </Badge>
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Premium</CardTitle>
              <div className="text-4xl font-bold text-primary">$30</div>
              <p className="text-muted-foreground">per month</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {features.premium.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="hero" size="lg" className="w-full">
                Start Free Trial
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Cancel anytime • No hidden fees
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">Why Students Choose Premium</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">Comprehensive Coverage</h3>
              <p className="text-muted-foreground text-sm">
                Access problems from all major engineering disciplines and industries
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">Proven Results</h3>
              <p className="text-muted-foreground text-sm">
                95% of premium users receive job offers within 6 months
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">Expert Support</h3>
              <p className="text-muted-foreground text-sm">
                Get personalized guidance from industry professionals
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-muted-foreground">
                Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-muted-foreground">
                Yes! You get a 7-day free trial with full access to all premium features. No credit card required.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">What if I'm not satisfied?</h3>
              <p className="text-muted-foreground">
                We offer a 30-day money-back guarantee. If you're not completely satisfied, we'll refund your payment.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-primary text-white">
            <CardContent className="pt-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Land Your Dream Job?</h2>
              <p className="mb-6 text-white/90">
                Join thousands of engineers who've successfully prepared with Vectorly
              </p>
              <Button variant="secondary" size="lg" className="mb-4">
                Start Your Free Trial Today
              </Button>
              <p className="text-sm text-white/80">
                No commitment • Cancel anytime • 30-day money-back guarantee
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;