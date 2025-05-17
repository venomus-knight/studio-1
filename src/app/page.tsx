// src/app/page.tsx (New Landing Page)
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { PenTool, ArrowRight, Landmark, Building, BookOpen } from 'lucide-react';

// Header component for the landing page
function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Image 
            src="/images/Emblem-of-India-01.svg"
            alt="Emblem of India"
            width={32}
            height={32}
            className="text-accent"
          />
          <span className="font-bold sm:inline-block font-lora text-lg">
            NYAI <span className="text-accent font-lora">भारत</span>
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm lg:gap-6 ml-auto">
          <Link
            href="#features"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            How It Works
          </Link>
          <Link
            href="#pricing"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Pricing
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/assistant">Sign In</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/assistant">Get Started</Link>
          </Button>
           <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent/10">
            सत्यमेव जयते
           </Button>
        </nav>
      </div>
    </header>
  );
}


export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingHeader />
      <main className="flex-1">
        <section className="container grid lg:grid-cols-2 gap-12 px-4 md:px-6 py-12 md:py-24 lg:py-32 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-lora text-primary">
              The Precedent Research Platform For Indian Legal Professionals
            </h1>
            <p className="max-w-[600px] text-foreground/80 md:text-xl">
              Powered by NYAI. Access landmark judgments from the Supreme Court of India and High Courts. Find relevant case precedents with advanced AI and Indian legal knowledge.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/assistant">Try NYAI Demo <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button variant="outline" size="lg" className="border-primary hover:bg-secondary text-primary">
                Schedule a Demo
              </Button>
            </div>
            <div className="pt-6 text-sm text-foreground/60">
              <p>Trusted by leading law chambers in India</p>
              <div className="flex items-center gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <Landmark className="h-5 w-5 text-accent" />
                  <span>SUPREME COURT BAR</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-accent" />
                  <span>DELHI HIGH COURT</span>
                </div>
              </div>
            </div>
          </div>
          <Card className="p-8 bg-card shadow-xl rounded-xl flex flex-col items-center justify-center space-y-6 min-h-[400px]">
            <PenTool className="h-20 w-20 text-primary" />
            <h2 className="text-3xl font-bold text-center font-lora text-primary">NYAI</h2>
            <p className="text-center text-foreground/80">
              A modern legal research platform
            </p>
            <div className="flex items-center space-x-4 pt-6">
              <BookOpen className="h-8 w-8 text-accent"/>
              <span className="font-medium text-accent font-lora text-lg">सत्यमेव जयते</span>
              <BookOpen className="h-8 w-8 text-accent"/>
            </div>
          </Card>
        </section>
      </main>
       <footer className="py-8 border-t">
        <div className="container text-center text-sm text-foreground/60">
          © {new Date().getFullYear()} NYAI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}