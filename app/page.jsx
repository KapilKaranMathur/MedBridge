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
  Stethoscope,
  Activity,
  Calendar,
  Video,
  FileText
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { features } from "../lib/data"; 
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import MarqueeDemo from "../components/MarqueeDemo";

// Fallback features in case the import is empty or fails during dev
const DEMO_FEATURES = [
  {
    icon: <Calendar className="h-6 w-6 text-emerald-400" />,
    title: "Smart Scheduling",
    description: "AI-powered calendar management that prevents double-booking and optimizes doctor availability."
  },
  {
    icon: <Video className="h-6 w-6 text-emerald-400" />,
    title: "HD Teleconsultations",
    description: "Crystal clear video calls with built-in screen sharing for reviewing X-rays and reports."
  },
  {
    icon: <FileText className="h-6 w-6 text-emerald-400" />,
    title: "Digital Prescriptions",
    description: "Instant, legible prescriptions sent directly to the patient's app and local pharmacy."
  }
];

const platformBenefits = [
  "Secure, centralized medical records — single source of truth.",
  "Seamless teleconsultations and in-app messaging.",
  "Effortless appointment scheduling and calendar sync.",
  "Patient-first features: shared prescriptions & visit summaries.",
];

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


  const displayFeatures = features || DEMO_FEATURES;

  return (
    <div className="bg-zinc-950 min-h-screen flex flex-col font-sans selection:bg-emerald-500/30">
      
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-900/10 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] opacity-30" />
      </div>

      <main className="flex-1 relative z-10">
        
{/*  */}
        <section className="relative pt-38 pb-32 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8 relative z-10">
                <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400 backdrop-blur-md">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                  Healthcare Reimagined
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1]">
                  Connect with doctors <br />
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-emerald-600">
                    anytime, anywhere.
                  </span>
                </h1>
                
                <p className="text-zinc-400 text-lg md:text-xl max-w-lg leading-relaxed">
                  Experience the future of medical care. Book appointments, consult specialists via video, and manage your health records in one secure clinical ecosystem.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  {currentUser ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>

                        Welcome back, {currentUser.role === "doctor" ? `Doctor` : (currentUser.name || "User")}
                      </div>
                      <div className="flex gap-4">
                        {currentUser.role === "doctor" ? (
                          <Button asChild size="lg" className="h-12 px-8 text-base bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-900/20">
                            <Link href="/doctor/dashboard">
                              Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        ) : (
                          <>
                            <Button asChild size="lg" className="h-12 px-8 text-base bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-900/20">
                              <Link href="/patient/doctors">
                                Find Doctors <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:text-white rounded-xl">
                              <Link href="/patient/dashboard">My Appointments</Link>
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      <Button asChild size="lg" className="h-12 px-8 text-base bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-900/20 transition-all hover:scale-105">
                        <Link href="/onboarding">
                          Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:text-white rounded-xl backdrop-blur-sm">
                        <Link href="/patient/doctors">Browse Specialists</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-3xl blur-3xl transform rotate-3 scale-95"></div>
                <div className="relative h-[500px] w-full rounded-3xl overflow-hidden border border-black shadow-2xl bg-black/40">
                  <Image
                    src="/y.png" 
                    alt="Doctor Consultation"
                    fill
                    priority
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />

                  <div className="absolute bottom-8 left-8 bg-zinc-950/90 backdrop-blur border border-zinc-800 p-4 rounded-xl shadow-xl flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-1000 delay-300">
                    <div className="h-10 w-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                        <Activity className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                        <p className="text-white font-semibold text-sm">24/7 Availability</p>
                        <p className="text-zinc-500 text-xs">Certified Specialists</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4"><div className="h-px bg-linear-to-r from-transparent via-zinc-800 to-transparent w-full" /></div>


        <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20 max-w-3xl mx-auto space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                Streamlined Healthcare
              </h2>
              <p className="text-zinc-400 text-lg">
                Our platform integrates every aspect of the patient journey into one cohesive experience.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayFeatures.map((feature, index) => (
                <Card
                  key={index}
                  className="bg-zinc-900/50 border-zinc-800/80 hover:border-emerald-500/30 hover:bg-zinc-900 transition-all duration-300 group"
                >
                  <CardHeader className="pb-4">
                    <div className="h-12 w-12 bg-zinc-950 rounded-lg border border-zinc-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:border-emerald-500/30">
                      {feature.icon ? feature.icon : <Activity className="h-6 w-6 text-emerald-400" />}
                    </div>
                    <CardTitle className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-400 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>


        <section className="py-24 bg-zinc-900/30 border-y border-zinc-800/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                  Why choose <span className="text-emerald-500">MedBridge</span>?
                </h2>
                <p className="text-zinc-400 text-lg">
                  We don't just connect you with doctors; we build a complete ecosystem for your long-term health.
                </p>
                
                <ul className="space-y-6">
                  {platformBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-4 group">
                      <div className="mt-1 h-6 w-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                        <Check className="h-3 w-3 text-emerald-500 group-hover:text-white" />
                      </div>
                      <p className="text-zinc-300 group-hover:text-white transition-colors">{benefit}</p>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="relative">
                <div className="absolute -inset-4 bg-linear-to-r from-emerald-500/20 to-blue-500/20 rounded-3xl blur-2xl opacity-50" />
                <Card className="relative bg-zinc-950 border-zinc-800 p-8 shadow-2xl">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center">
                            <ShieldCheck className="h-6 w-6 text-emerald-500" />
                        </div>
                        <div>
                            <h4 className="text-white font-bold">Enterprise Grade Security</h4>
                            <p className="text-zinc-500 text-sm">HIPAA & GDPR Compliant</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                            <div className="h-full w-3/4 bg-emerald-500 rounded-full animate-pulse" />
                        </div>
                        <div className="h-2 w-2/3 bg-zinc-900 rounded-full" />
                        <div className="h-2 w-1/2 bg-zinc-900 rounded-full" />
                    </div>
                    <div className="mt-8 pt-8 border-t border-zinc-900 flex justify-between items-center text-sm text-zinc-500">
                        <span>Encryption</span>
                        <span className="text-emerald-500 font-mono">AES-256</span>
                    </div>
                </Card>
              </div>
            </div>
          </div>
        </section>


        <section className="py-24 overflow-hidden">
          <div className="container mx-auto px-4 mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Trusted by Thousands</h2>
            <p className="text-zinc-400">Join the community transforming their healthcare experience.</p>
          </div>
          <MarqueeDemo />
        </section>


        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="relative rounded-3xl overflow-hidden border border-emerald-900/50">
              <div className="absolute inset-0 bg-linear-to-br from-emerald-900 to-zinc-950" />
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="relative z-10 p-12 md:p-20 text-center max-w-4xl mx-auto space-y-8">
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                  Ready to take control of your healthcare?
                </h2>
                <p className="text-xl text-emerald-100/70 max-w-2xl mx-auto">
                  Join MedBridge today. Secure records, top specialists, and peace of mind—all in one place.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button asChild size="lg" className="h-14 px-10 text-lg bg-white text-emerald-950 hover:bg-emerald-50 rounded-full">
                    <Link href="/onboarding">Create Free Account</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="h-14 px-10 text-lg border-emerald-500/30 text-emerald-100 hover:bg-emerald-950/50 hover:text-white rounded-full">
                    <Link href="/about">Learn More</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>


      <footer className="bg-zinc-950 py-16 border-t border-zinc-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/20">
                    <Stethoscope className="h-6 w-6 text-white" />
                 </div>
                 <div className="text-2xl font-bold text-white tracking-tight">MedBridge</div>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
                Bridging the gap between patients and providers with secure, efficient technology tailored for modern healthcare.
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


            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-zinc-400 hover:text-emerald-400 transition-colors cursor-pointer group">
                  <MapPin className="h-5 w-5 text-emerald-600 group-hover:text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm">123 Innovation Drive,<br />Medical District, NY 10012</span>
                </li>
                <li className="flex items-center gap-3 text-zinc-400 hover:text-emerald-400 transition-colors cursor-pointer group">
                  <Phone className="h-4 w-4 text-emerald-600 group-hover:text-emerald-500 shrink-0" />
                  <span className="text-sm">+1 (555) 000-0000</span>
                </li>
                <li className="flex items-center gap-3 text-zinc-400 hover:text-emerald-400 transition-colors cursor-pointer group">
                  <Mail className="h-4 w-4 text-emerald-600 group-hover:text-emerald-500 shrink-0" />
                  <span className="text-sm">support@medbridge.com</span>
                </li>
              </ul>
            </div>


            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Security & Trust</h4>
              <ul className="space-y-3">
                {['HIPAA Compliant', 'End-to-End Encryption', 'Verified Specialists', '24/7 Data Monitoring'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-zinc-400 text-sm">
                    <Check className="h-4 w-4 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>


            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Legal</h4>
              <ul className="space-y-3 text-sm text-zinc-500">
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Cookie Policy</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Accessibility</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-900 mt-16 pt-8 text-center text-zinc-600 text-sm">
            © {new Date().getFullYear()} MedBridge Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}