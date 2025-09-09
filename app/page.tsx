import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Megaphone, 
  MessageSquare, 
  BarChart3,
  ArrowRight,
  Linkedin
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-dvh bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">LB</span>
            </div>
            <span className="font-semibold text-xl">LinkBird</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground">
            Scale Your LinkedIn Outreach
            <span className="block text-blue-600">Like Never Before</span>
          </h1>
          <p className="mb-8 text-xl text-muted-foreground max-w-2xl mx-auto">
            Automate your LinkedIn campaigns, manage leads, and track performance with our powerful outreach platform.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="px-8">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Lead Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Organize and track your prospects with our intuitive lead management system.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Megaphone className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Campaign Automation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create and automate LinkedIn outreach campaigns with personalized messaging.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Message Sequences</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Design multi-step message sequences that convert prospects into customers.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-lg">Analytics & Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track performance metrics and optimize your outreach strategy with detailed analytics.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
          <CardContent className="p-8 text-center">
            <Linkedin className="h-12 w-12 mx-auto mb-4" />
            <h2 className="mb-4 text-3xl font-bold">Ready to Transform Your LinkedIn Outreach?</h2>
            <p className="mb-6 text-blue-100 max-w-2xl mx-auto">
              Join thousands of professionals who are already scaling their LinkedIn presence with LinkBird.
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="px-8">
                Get Started Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">LB</span>
              </div>
              <span className="font-semibold">LinkBird</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 LinkBird. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}


