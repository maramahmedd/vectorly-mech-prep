// src/pages/Privacy.tsx
import Navbar from "@/components/ui/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Globe, Link2, Trash2, RefreshCw } from "lucide-react";

const LastUpdated = "October 5, 2025";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-card">
      <Navbar />

      {/* Hero */}
      <section className="py-16 text-center text-white bg-gradient-hero">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Vectorly Privacy Policy</h1>
          <p className="text-white/90 max-w-3xl mx-auto">
            We respect your privacy and build with security in mind. This page explains what we collect,
            how we use it, and the choices you have.
          </p>
          <p className="mt-4 text-white/70 text-sm">Last Updated: {LastUpdated}</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-6">
        {/* Introduction */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>
              Vectorly (“we,” “us,” or “our”) provides this Privacy Policy to explain how we collect, use, and
              protect personal information from users of <span className="font-medium text-foreground">vectorly.org</span> (the “Site”)
              and related services (the “Services”).
            </p>
            <p>
              By using the Services, you agree to this Privacy Policy. If you do not agree, please discontinue use of
              the Services.
            </p>
          </CardContent>
        </Card>

        {/* Information Collection */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>1) Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-1">Personal Information</h3>
              <p>
                We may collect limited personal information such as email address (for accounts/support), IP address,
                and basic usage logs to ensure functionality, security, and performance.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Cookies & Similar Technologies</h3>
              <p>
                We use cookies to enable essential features (e.g., auth, preferences) and to understand how the Site is
                used. You can control cookies via your browser settings; disabling some cookies may limit functionality.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sharing & Disclosure */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>2) Information Sharing & Disclosure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-medium text-foreground">No selling of data:</span> We do not sell, rent, or trade your
                personal information.
              </li>
              <li>
                <span className="font-medium text-foreground">Internal operations & providers:</span> We may share limited
                data (e.g., IP, usage logs) with trusted providers (e.g., hosting, analytics) strictly to operate,
                secure, and improve the Services.
              </li>
              <li>
                <span className="font-medium text-foreground">Aggregated data:</span> We may share anonymized, aggregated
                insights for research or product improvement. This data does not identify individuals.
              </li>
              <li>
                <span className="font-medium text-foreground">Legal compliance:</span> We may disclose information when required
                by law, court order, or to protect rights, safety, and integrity of the Services.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>3) Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>
              We implement reasonable administrative, technical, and physical safeguards to protect your data. However,
              no method of transmission or storage is 100% secure. In the event of a breach, we will notify affected
              users as required by applicable law and take steps to restore data integrity.
            </p>
          </CardContent>
        </Card>

        {/* International Transfer */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>4) International Data Transfers</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Vectorly is operated in the United States. If you access the Services from outside the U.S., you consent to
            the transfer and processing of your information in the U.S., where laws may differ from those in your country.
          </CardContent>
        </Card>

        {/* Third-Party Links */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>5) Third-Party Links</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Our Services may link to third-party websites or resources. We are not responsible for their content or
            privacy practices. Please review their privacy policies before providing information.
          </CardContent>
        </Card>

        {/* Account Deletion */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>6)Account Deletion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>
              You may request deletion of your Vectorly account by emailing{" "}
              <a className="underline text-foreground" href="mailto:support@vectorly.org">support@vectorly.org</a>.
              Deletion is permanent and cannot be reversed.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>All associated account data and records will be removed from active systems.</li>
              <li>Some anonymized or backup data may persist for a limited period for security and integrity.</li>
              <li>Previously purchased or premium access will be forfeited upon deletion.</li>
              <li>Public or shared content may remain in anonymized form (no personal identifiers).</li>
            </ul>
          </CardContent>
        </Card>

        {/* Changes to Policy */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>7) Changes to This Policy</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            We may update this Privacy Policy periodically. When we do, we will revise the “Last Updated” date above.
            Continued use of the Services after changes take effect signifies your acceptance of the updated policy.
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>8) Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="text-muted-foreground">
              Questions or concerns? We’d love to help.
              <br />
              <span className="text-foreground">support@vectorly.org</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <a href="mailto:support@vectorly.org">Email Support</a>
              </Button>
              <Button variant="hero" asChild>
                <a href="/practice">Start Practicing</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
