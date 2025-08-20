import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/ui/navbar";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { BookOpen, Target, TrendingUp, Users, CheckCircle, Star, ArrowRight } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Comprehensive Problem Bank",
      description: "Crowdsourced questions from real mechanical engineering interviews across all industries."
    },
    {
      icon: Target,
      title: "Theory-Linked Learning",
      description: "Every problem connects to essential theory, helping you understand the 'why' behind solutions."
    },
    {
      icon: TrendingUp,
      title: "Industry-Specific Practice",
      description: "Filter by automotive, aerospace, energy, and other ME specializations."
    },
    {
      icon: Users,
      title: "Community-Driven",
      description: "Real interview questions contributed by students and professionals in the field."
    }
  ];

  const pricingTiers = [
    {
      name: "Free",
      price: "$0",
      features: ["20 problems per month", "Basic progress tracking", "Community access"],
      cta: "Get Started"
    },
    {
      name: "Pro",
      price: "$9.99",
      features: ["Unlimited problems", "Advanced analytics", "Industry-specific filters", "Theory deep-dives"],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Premium",
      price: "$19.99",
      features: ["Everything in Pro", "1-on-1 mentorship", "Mock interviews", "Company-specific prep"],
      cta: "Contact Sales"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero text-white">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Master Mechanical Engineering <br />
              <span >Interview Success</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              The only platform designed specifically for ME students and new grads. 
              Practice real interview questions, master essential theory, and land your dream internship.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" className="text-lg" asChild>
                <Link to="/practice">Start Practicing <ArrowRight className="ml-2" /></Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg border-white text-white hover:bg-white hover:text-primary">
                View Demo
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>500+ Students</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>1000+ Problems</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>95% Success Rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Example Problems Preview Section */}
      <section className="py-12 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Sample Interview Questions</h2>
            <p className="text-muted-foreground">Real problems from top companies</p>
          </div>
          
          <div className="overflow-x-auto pb-4">
            <div className="flex space-x-4 w-max">
              {[
                {
                  difficulty: "Easy",
                  title: "Force Analysis in Truss Structures",
                  tags: ["Statics", "Automotive"],
                  companies: "Ford, GM"
                },
                {
                  difficulty: "Medium", 
                  title: "Heat Engine Efficiency Analysis",
                  tags: ["Thermodynamics", "Automotive"],
                  companies: "Tesla, Toyota"
                },
                {
                  difficulty: "Hard",
                  title: "Fluid Flow in Turbine Design",
                  tags: ["Fluid Mechanics", "Aerospace"],
                  companies: "Boeing, SpaceX"
                },
                {
                  difficulty: "Medium",
                  title: "Material Selection for High-Stress Components",
                  tags: ["Materials", "Aerospace"],
                  companies: "Lockheed Martin"
                },
                {
                  difficulty: "Easy",
                  title: "Basic Vibration Analysis",
                  tags: ["Dynamics", "Manufacturing"],
                  companies: "GE, Caterpillar"
                }
              ].map((problem, index) => (
                <Card key={index} className="w-80 flex-shrink-0 shadow-medium hover:shadow-strong transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={problem.difficulty === "Easy" ? "secondary" : problem.difficulty === "Medium" ? "default" : "destructive"}>
                        {problem.difficulty}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{problem.companies}</span>
                    </div>
                    <CardTitle className="text-lg">{problem.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {problem.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Vectorly Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Unlike generic coding platforms, we understand the unique challenges of mechanical engineering interviews.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-medium hover:shadow-strong transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Testimonials */}
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-8">What Students Say</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Chen",
                  role: "ME Student, UC Berkeley", 
                  text: "Vectorly helped me land my Tesla internship! The theory-linked problems were exactly what I needed.",
                  company: "Tesla"
                },
                {
                  name: "Marcus Rodriguez",
                  role: "Recent Graduate",
                  text: "Finally, interview prep that actually understands mechanical engineering. Got offers from 3 companies!",
                  company: "Ford"
                },
                {
                  name: "Emily Johnson", 
                  role: "ME Student, MIT",
                  text: "The industry-specific filters saved me so much time. Focused prep for aerospace interviews worked perfectly.",
                  company: "Boeing"
                }
              ].map((testimonial, index) => (
                <Card key={index} className="shadow-medium">
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-warning fill-current" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                    <div className="text-sm">
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-muted-foreground">{testimonial.role}</div>
                      <div className="text-primary font-medium">Now at {testimonial.company}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problem Preview Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Practice Real Interview Questions</h2>
            <p className="text-xl text-muted-foreground">
              Questions tagged by difficulty, industry, and engineering discipline
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-strong">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="medium">Medium</Badge>
                    <Badge variant="outline">Thermodynamics</Badge>
                    <Badge variant="outline">Automotive</Badge>
                  </div>
                  <Star className="w-5 h-5 text-warning" />
                </div>
                <CardTitle className="text-left">Heat Engine Efficiency Analysis</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">
                  Design a heat engine operating between two thermal reservoirs at 800K and 300K. 
                  Calculate the maximum theoretical efficiency and explain how real-world factors 
                  would affect this efficiency in an automotive application.
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>💡 Linked Theory: Carnot Cycle, Second Law of Thermodynamics</span>
                  <span>🏢 Asked at: Ford, GM, Tesla</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Fair Pricing</h2>
            <p className="text-xl text-muted-foreground">
              Start free, upgrade when you're ready to excel
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <Card key={index} className={`relative ${tier.popular ? 'border-primary shadow-strong scale-105' : 'shadow-medium'}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-primary text-white">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <div className="text-4xl font-bold text-primary">{tier.price}</div>
                  <p className="text-muted-foreground">per month</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={tier.popular ? "hero" : "outline"}
                  >
                    {tier.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join hundreds of mechanical engineering students who've landed their dream roles with Vectorly.
          </p>
          <Button variant="hero" size="lg" className="text-lg" asChild>
            <Link to="/practice">Start Your Free Trial <ArrowRight className="ml-2" /></Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary"></div>
              <span className="text-xl font-bold">Vectorly</span>
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <Link to="/about" className="hover:text-primary">About</Link>
              <Link to="/contact" className="hover:text-primary">Contact</Link>
              <Link to="/privacy" className="hover:text-primary">Privacy</Link>
              <Link to="/terms" className="hover:text-primary">Terms</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2024 Vectorly. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
