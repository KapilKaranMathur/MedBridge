import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Check } from "lucide-react";
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
    <div className="bg-background">
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
                      <Badge variant="outline" className="w-fit border-emerald-500 text-emerald-400 py-1.5">
                        Logged in as {currentUser.role === "doctor" ? "Doctor" : "Patient"}
                      </Badge>
                      <div className="flex gap-4">
                        {currentUser.role === "doctor" ? (
                          <Button asChild size="lg" className="bg-emerald-600 text-white hover:bg-emerald-700">
                            <Link href="/doctor/dashboard">
                              Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        ) : (
                          <>
                            <Button asChild size="lg" className="bg-emerald-600 text-white hover:bg-emerald-700">
                              <Link href="/patient/doctors">
                                Find Doctors <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="border-emerald-700/30 hover:bg-muted/80">
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

      <hr />

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
                  className="border-emerald-900/20 hover:border-emerald-800/40 transition-all duration-300"
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
                    <p>{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <hr />

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

      <hr className="w-1/2 mx-auto my-4" />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            What Our Users Say
          </h2>
          <MarqueeDemo />
        </div>
      </section>

      <hr className="w-1/2 mx-auto my-4" />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-linear-to-r from-emerald-900 to-emerald-950/70 border-emerald-800/70">
            <CardContent className="p-8 md:p-12 lg:p-16 relative overflow-hidden">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Ready to take control of your healthcare?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Join thousands of users who have simplified their healthcare
                  journey with our platform. Get started today and experience
                  healthcare the way it should be - easy, accessible, and
                  personalized.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
