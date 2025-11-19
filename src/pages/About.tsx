// src/pages/About.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/ui/navbar";
import { Users, Target, BookOpen, TrendingUp, HeartHandshake } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-card">
      <Navbar />

      {/* Hero / Mission Section */}
      <section className="py-20 text-center text-black bg-gradient-hero">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Empowering Engineers to Succeed
          </h1>
          <p className="text-lg md:text-xl text-black/90 max-w-3xl mx-auto">
            Vectorly helps engineering students and graduates prepare for real-world interviews
            through interactive problem-solving, theory-linked learning, and personalized analytics.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
            Founded at UC Berkeley by students passionate about bridging the gap between classroom theory 
            and professional interviews, Vectorly began as a small set of engineering problems — and has grown 
            into a full learning ecosystem trusted by hundreds of students across the nation.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                title: "Built by Students",
                text: "Created by engineers who understand the struggle of preparing for highly technical interviews."
              },
              {
                icon: Target,
                title: "Focused on ME Careers",
                text: "Unlike generic coding sites, every problem is tailored to core engineering concepts and real industries."
              },
              {
                icon: TrendingUp,
                title: "Driven by Data",
                text: "We use analytics to personalize your learning journey and help you focus where it matters most."
              }
            ].map((feature, i) => (
              <Card key={i} className="shadow-medium hover:shadow-strong transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">{feature.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 bg-background border-t border-b">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
            To make technical interview preparation accessible, structured, and effective
            for engineers — regardless of background or experience.
          </p>
          <Button variant="hero" size="lg" asChild>
            <a href="/practice">Explore Practice Problems</a>
          </Button>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Meet the Team</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              {
                name: "Mohamed Ganda",
                role: "Co-Founder & Product Lead",
                bio: "UC Berkeley student passionate about bridging engineering education and real-world technical interviews.",
              },
              {
                name: "___",
                role: "Co-Founder ",
                bio: "__",
              },
              {
                name: "___",
                role: "Co-Founder ",
                bio: "__",
              },
              {
                name: "___",
                role: "Co-Founder ",
                bio: "__",
              },
              {
                name: "___",
                role: "Co-Founder ",
                bio: "__",
              },

            ].map((member, i) => (
              <Card key={i} className="shadow-medium hover:shadow-strong transition-all">
                <CardHeader>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <p className="text-muted-foreground">{member.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* Closing */}
      <footer className="py-12 border-t text-center text-muted-foreground">
        <HeartHandshake className="w-6 h-6 mx-auto mb-2 text-primary" />
        <p>Vectorly is built with passion for engineers, by engineers. 🚀</p>
      </footer>
    </div>
  );
};

export default About;
