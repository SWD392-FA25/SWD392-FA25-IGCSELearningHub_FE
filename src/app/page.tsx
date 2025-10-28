import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 bg-gradient-to-br from-background to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-6">
                <div className="inline-block px-4 py-2 bg-primary/10 rounded-full">
                  <span className="text-sm font-medium text-primary">Welcome to IGCSE Learning</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  Master IGCSE Courses with Expert Guidance
                </h1>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  Comprehensive online learning platform designed to help you excel in IGCSE examinations. Learn from
                  experienced instructors and join thousands of successful students.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link
                    href="/courses"
                    className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity text-center"
                  >
                    Explore Courses
                  </Link>
                  <Link
                    href="/about"
                    className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors text-center"
                  >
                    Learn More
                  </Link>
                </div>
              </div>

              {/* Right Visual */}
              <div className="relative h-96 bg-primary/5 rounded-2xl flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl" />
                <div className="relative text-center">
                  <div className="text-6xl font-bold text-primary/20">📚</div>
                  <p className="text-muted-foreground mt-4">Interactive Learning Experience</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-20 bg-background border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose Us?</h2>
              <p className="text-lg text-muted-foreground">Everything you need to succeed in IGCSE</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-8 border border-border rounded-xl hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🎓</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Expert Instructors</h3>
                <p className="text-muted-foreground">
                  Learn from experienced IGCSE educators with proven track records
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 border border-border rounded-xl hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📖</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Comprehensive Content</h3>
                <p className="text-muted-foreground">
                  Complete course materials covering all IGCSE subjects and topics
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 border border-border rounded-xl hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">✅</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Practice Tests</h3>
                <p className="text-muted-foreground">Real exam-style questions to prepare you for success</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">Ready to Start Learning?</h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Join our community of successful IGCSE students and begin your journey to academic excellence today.
            </p>
            <Link
              href="/courses"
              className="inline-block px-8 py-3 bg-primary-foreground text-primary rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Browse All Courses
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
