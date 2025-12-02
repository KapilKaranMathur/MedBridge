import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Check, 
  MapPin, 
  Phone, 
  Mail, 
  Twitter, 
  Linkedin, 
  Facebook,
  ShieldCheck,
  Stethoscope 
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { creditBenefits, features } from "../lib/data";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import { Marquee } from "../components/ui/marquee";
import MarqueeDemo from "../components/MarqueeDemo";

import { getCurrentUser } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Home() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let currentUser = null;
  if (token) {
    const { verify } = await import("jsonwebtoken");
    try {
      const payload = verify(token, process.env.JWT_SECRET);
      if (payload) {
        currentUser = payload;
      }
    } catch (e) {}
  }

  const platformBenefits = [
    "Secure, centralized medical records — patients and doctors access a single source of truth.",
    "Seamless teleconsultations and in-app messaging for quick follow-ups.",
    "Effortless appointment scheduling and calendar sync to avoid double bookings.",
    "Patient-first features: shared prescriptions, visit summaries, and follow-up reminders.",
  ];

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="relative overflow-hidden py-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <Badge
                  variant="outline"
                  className="bg-emerald-900/30 border-emerald-700/30 px-4 py-2 text-emerald-400 text-sm font-medium"
                >
                  Healthcare made simple
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Connect with doctors <br />{" "}
                  <span className="gradient-title">anytime, anywhere</span>
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl max-w-md">
                  Easily book appointments, connect with doctors over video, and
                  manage your healthcare journey — all in one secure place.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  {currentUser ? (
                    <>
                      <div className="flex flex-col gap-3">
                        <Badge
                          variant="outline"
                          className="w-fit border-emerald-500 text-emerald-400 py-1.5"
                        >
                          Logged in as{" "}
                          {currentUser.role === "doctor" ? "Doctor" : "Patient"}
                        </Badge>
                        <div className="flex gap-4">
                          {currentUser.role === "doctor" ? (
                            <Button
                              asChild
                              size="lg"
                              className="bg-emerald-600 text-white hover:bg-emerald-700"
                            >
                              <Link href="/doctor/dashboard">
                                Go to Dashboard{" "}
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          ) : (
                            <>
                              <Button
                                asChild
                                size="lg"
                                className="bg-emerald-600 text-white hover:bg-emerald-700"
                              >
                                <Link href="/patient/doctors">
                                  Find Doctors{" "}
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                              </Button>
                              <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="border-emerald-700/30 hover:bg-muted/80"
                              >
                                <Link href="/patient/dashboard">
                                  My Appointments
                                </Link>
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Button
                        asChild
                        size="lg"
                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                      >
                        <Link href={"/onboarding"}>
                          Get Started <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>

                      <Button
                        asChild
                        size={"lg"}
                        className={"border-emerald-700/30 hover:bg-muted/80"}
                        variant={"outline"}
                      >
                        <Link href="/patient/doctors">Find Doctors</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <div className="relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden">
                <Image
                  src="/y.png"
                  alt="Doctor Consultation"
                  fill
                  priority
                  className="object-cover md:pt-14 rounded-xl"
                />
              </div>
            </div>
          </div>
        </section>

        <hr className="border-emerald-900/20" />

        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                How It Works
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Our platform makes healthcare accessible with just a few clicks
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                return (
                  <Card
                    key={index}
                    className="border-emerald-900/20 hover:border-emerald-800/40 transition-all duration-300 bg-black/40"
                  >
                    <CardHeader className="pb-2">
                      <div className="bg-emerald-900/20 p-3 rounded-lg w-fit mb-4">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-xl font-semibold text-white">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-zinc-400">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <hr className="border-emerald-900/20" />

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Platform Services
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Smart digital consultations. No fees shown on platform.
              </p>
            </div>
            <div>
              <Card className="mt-12 bg-muted/20 border-emerald-900/30">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-white flex items-center">
                    How Our Platform Helps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {platformBenefits.map((benefit, index) => {
                      return (
                        <li key={index} className="flex items-start">
                          <div className="mr-3 mt-1 bg-emerald-900/20 p-1 rounded-full">
                            <Check className="h-4 w-4 text-emerald-400" />
                          </div>
                          <p className="text-muted-foreground">{benefit}</p>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <hr className="w-1/2 mx-auto my-4 border-emerald-900/20" />

        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
              What Our Users Say
            </h2>
            <MarqueeDemo />
          </div>
        </section>

        <hr className="w-1/2 mx-auto my-4 border-emerald-900/20" />

        <section className="py-20">
          <div className="container mx-auto px-4">
            <Card className="bg-linear-to-r from-emerald-900 to-emerald-950/70 border-emerald-800/70">
              <CardContent className="p-8 md:p-12 lg:p-16 relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    Ready to take control of your healthcare?
                  </h2>
                  <p className="text-lg text-emerald-100/80 mb-8 max-w-3xl">
                    Join thousands of users who have simplified their healthcare
                    journey with our platform. Get started today and experience
                    healthcare the way it should be - easy, accessible, and
                    personalized.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                     <Button 
                        asChild 
                        size="lg" 
                        className="bg-white text-emerald-900 hover:bg-emerald-50"
                     >
                        <Link href="/onboarding">
                           Create Free Account
                        </Link>
                     </Button>
                  </div>
                </div>
                {/* Decorative background circle */}
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-zinc-950 py-12 border-t border-emerald-900/20 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                 <div className="h-8 w-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                    <Stethoscope className="h-5 w-5 text-white" />
                 </div>
                 <div className="text-xl font-bold text-white">MedBridge</div>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Your trusted partner in digital healthcare. We bridge the gap between patients and providers with secure, efficient technology tailored to your needs.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Contact Us
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-emerald-500 shrink-0" />
                  <a
                    href="#"
                    className="text-zinc-400 hover:text-emerald-400 text-sm"
                  >
                    123 Innovation Drive,<br />
                    Medical District, NY 10012
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-emerald-500 shrink-0" />
                  <a href="tel:+15550000000" className="text-zinc-400 hover:text-emerald-400 text-sm">
                    +1 (555) 000-0000
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-emerald-500 shrink-0" />
                  <a href="mailto:support@medbridge.com" className="text-zinc-400 hover:text-emerald-400 text-sm">
                    support@medbridge.com
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Security & Trust</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-zinc-400 text-sm">
                  <Check className="h-4 w-4 text-emerald-500" />
                  HIPAA Compliant
                </li>
                <li className="flex items-center gap-2 text-zinc-400 text-sm">
                  <Check className="h-4 w-4 text-emerald-500" />
                  End-to-End Encryption
                </li>
                <li className="flex items-center gap-2 text-zinc-400 text-sm">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Verified Specialists
                </li>
                <li className="flex items-center gap-2 text-zinc-400 text-sm">
                  <Check className="h-4 w-4 text-emerald-500" />
                  24/7 Data Monitoring
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Stay Connected
              </h4>
              <p className="text-zinc-400 text-sm mb-4">
                Follow us for health tips and platform updates.
              </p>
              <div className="flex gap-4">
                <Link href="#" className="h-10 w-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-emerald-600 hover:text-white transition-all">
                  <Twitter className="h-4 w-4" />
                </Link>
                <Link href="#" className="h-10 w-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-emerald-600 hover:text-white transition-all">
                  <Linkedin className="h-4 w-4" />
                </Link>
                <Link href="#" className="h-10 w-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-emerald-600 hover:text-white transition-all">
                  <Facebook className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-zinc-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-zinc-500 text-sm">
              © {new Date().getFullYear()} MedBridge Inc. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
               <Link href="#" className="text-zinc-500 hover:text-emerald-400 transition-colors">Privacy Policy</Link>
               <Link href="#" className="text-zinc-500 hover:text-emerald-400 transition-colors">Terms of Service</Link>
               <Link href="#" className="text-zinc-500 hover:text-emerald-400 transition-colors">Cookie Policy</Link>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}