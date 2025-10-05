// src/pages/Terms.tsx
import Navbar from "@/components/ui/navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const LastUpdated = "October 5, 2025";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-card">
      <Navbar />

      {/* Hero Section */}
      <section className="py-16 text-center text-white bg-gradient-hero">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Vectorly Terms of Service</h1>
          <p className="text-white/90 max-w-3xl mx-auto">
            Please read these Terms carefully before using Vectorly. By accessing or using our site,
            you agree to these Terms of Service and our Privacy Policy.
          </p>
          <p className="mt-4 text-white/70 text-sm">Last Updated: {LastUpdated}</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 space-y-6">
        {/* Introduction */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Introduction</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-3">
            <p>
              These Terms of Service (“Terms”) are entered into between you and Vectorly, Inc. (“Vectorly,”
              “we,” “us,” or “our”) for the use of our website and related services (the “Services”).
              By accessing or using the Services, you acknowledge that you have read, understood,
              and agree to be bound by these Terms.
            </p>
            <p>
              We may revise these Terms at any time by posting an updated version on this page. Continued use of the
              Services after updates take effect constitutes acceptance of the revised Terms.
            </p>
          </CardContent>
        </Card>

        {/* Use of Services */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>1) Use of Services</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-3">
            <p>
              You agree to use Vectorly solely for lawful purposes and in compliance with these Terms and
              our Privacy Policy. You must not engage in harmful, fraudulent, or abusive activity while using the Services.
            </p>
            <p>
              You may not attempt to reverse engineer, scrape, or otherwise interfere with Vectorly’s
              operation. Unauthorized use of the platform or its content is strictly prohibited.
            </p>
            <p>
              We reserve the right to suspend or terminate any account that violates these Terms or applicable law.
            </p>
          </CardContent>
        </Card>

        {/* Content Ownership */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>2) Content Ownership & Usage</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-3">
            <p>
              All materials available through Vectorly — including software, problems, solutions,
              code examples, text, images, and other content (“Content”) — are owned or licensed by Vectorly
              and protected under applicable copyright laws.
            </p>
            <p>
              By submitting user-generated content to Vectorly, you grant us a worldwide, non-exclusive,
              royalty-free, perpetual, and irrevocable license to use, reproduce, modify, and display your
              content to operate and improve the Services.
            </p>
            <p>
              You agree not to copy, distribute, or commercially exploit any portion of Vectorly’s
              proprietary content without prior written consent.
            </p>
          </CardContent>
        </Card>

        {/* Accounts */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>3) Accounts & Registration</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-3">
            <p>
              To use certain features, you may need to create an account. You agree to provide accurate,
              current, and complete information during registration and to keep it updated.
            </p>
            <p>
              You are responsible for all activity under your account. If you use a third-party service
              (e.g., Google or GitHub) to log in, you are also subject to their terms and privacy policies.
            </p>
            <p>
              Vectorly reserves the right to suspend or delete accounts that contain false or misleading
              information or that engage in unauthorized activity.
            </p>
          </CardContent>
        </Card>

        {/* Banking and Payments */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>4) Payments & Subscriptions</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-3">
            <p>
              Vectorly may offer premium subscriptions or paid content. Payments are processed through secure
              third-party providers. Vectorly does not store or access your banking credentials.
            </p>
            <p>
              All fees are non-refundable unless required by law. You may cancel your subscription at any time.
              After cancellation, access continues until the end of the current billing period.
            </p>
          </CardContent>
        </Card>

        {/* Warranties & Limitations */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>5) Warranties & Limitations of Liability</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-3">
            <p>
              The Services are provided “as is” and “as available.” Vectorly makes no warranties, express or implied,
              regarding reliability, security, or suitability for a particular purpose.
            </p>
            <p>
              To the fullest extent permitted by law, Vectorly shall not be liable for any indirect, incidental,
              or consequential damages arising from use of the Services. Our maximum liability under these Terms
              will not exceed $500.
            </p>
          </CardContent>
        </Card>

        {/* Dispute Resolution */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>6) Dispute Resolution & Arbitration</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-3">
            <p>
              Any disputes arising under these Terms will be resolved through binding arbitration in Alameda County,
              California, under the rules of JAMS (Judicial Arbitration & Mediation Services).
            </p>
            <p>
              You agree that claims must be brought individually and within six (6) months of the event giving rise
              to the dispute. Class actions or collective proceedings are not permitted.
            </p>
          </CardContent>
        </Card>

        {/* Miscellaneous */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>7) Miscellaneous</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-3">
            <p>
              These Terms are governed by the laws of the State of California. If any provision of these Terms
              is found invalid, the remaining provisions shall remain in full effect.
            </p>
            <p>
              Vectorly shall not be liable for delays or failures to perform caused by circumstances beyond its control,
              including natural disasters, acts of war, or network outages.
            </p>
            <p>
              These Terms constitute the entire agreement between you and Vectorly.
            </p>
          </CardContent>
        </Card>

        {/* Cancellation & Refunds */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>8) Cancellations, Refunds, and Termination</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-3">
            <p>
              You can cancel your premium subscription anytime by visiting your account settings. Once canceled,
              you retain access until the end of your current billing cycle.
            </p>
            <p>
              Vectorly may terminate or suspend your account at any time for violation of these Terms or misuse of the
              Services. All fees paid are non-refundable.
            </p>
            <p>
              For billing inquiries, please contact{" "}
              <a href="mailto:billing@vectorly.org" className="underline text-foreground">
                billing@vectorly.org
              </a>.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>9) Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="text-muted-foreground">
              Questions about these Terms? Reach us at{" "}
              <span className="text-foreground">support@vectorly.org</span>
            </div>
            <Button variant="outline" asChild>
              <a href="mailto:support@vectorly.org">Email Support</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
