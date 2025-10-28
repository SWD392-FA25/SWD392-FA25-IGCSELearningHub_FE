import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">About IGCSE-Learning Hub</h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              We are dedicated to providing world-class IGCSE education to students worldwide, empowering them to
              achieve academic excellence and reach their full potential.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="w-full py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Mission */}
              <div className="p-8 border border-border rounded-xl bg-card">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To make quality IGCSE education accessible to every student, regardless of their background or
                  location. We believe in empowering learners with the knowledge, skills, and confidence needed to excel
                  in their examinations and beyond.
                </p>
              </div>

              {/* Vision */}
              <div className="p-8 border border-border rounded-xl bg-card">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🌟</span>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To become the leading global platform for IGCSE education, recognized for our innovative teaching
                  methods, expert instructors, and student success stories. We envision a world where quality education
                  is accessible to all.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="w-full py-20 bg-background border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">Why Choose Us?</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Reason 1 */}
              <div className="p-6 border border-border rounded-xl hover:border-primary/50 transition-colors">
                <div className="text-4xl mb-4">👨‍🏫</div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Expert Instructors</h3>
                <p className="text-muted-foreground">
                  Our team consists of highly qualified educators with years of IGCSE teaching experience and proven
                  track records of student success.
                </p>
              </div>

              {/* Reason 2 */}
              <div className="p-6 border border-border rounded-xl hover:border-primary/50 transition-colors">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Comprehensive Curriculum</h3>
                <p className="text-muted-foreground">
                  Complete coverage of all IGCSE subjects with up-to-date materials aligned with the latest examination
                  syllabus.
                </p>
              </div>

              {/* Reason 3 */}
              <div className="p-6 border border-border rounded-xl hover:border-primary/50 transition-colors">
                <div className="text-4xl mb-4">💻</div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Interactive Learning</h3>
                <p className="text-muted-foreground">
                  Engaging online platform with interactive lessons, practice tests, and real-time feedback to enhance
                  your learning experience.
                </p>
              </div>

              {/* Reason 4 */}
              <div className="p-6 border border-border rounded-xl hover:border-primary/50 transition-colors">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Proven Results</h3>
                <p className="text-muted-foreground">
                  Our students consistently achieve excellent grades, with 95% passing rate and many securing top marks
                  in their IGCSE examinations.
                </p>
              </div>

              {/* Reason 5 */}
              <div className="p-6 border border-border rounded-xl hover:border-primary/50 transition-colors">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Global Community</h3>
                <p className="text-muted-foreground">
                  Join thousands of students from around the world, collaborate with peers, and learn from a diverse
                  global community.
                </p>
              </div>

              {/* Reason 6 */}
              <div className="p-6 border border-border rounded-xl hover:border-primary/50 transition-colors">
                <div className="text-4xl mb-4">⏰</div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Flexible Learning</h3>
                <p className="text-muted-foreground">
                  Learn at your own pace with lifetime access to course materials. Study whenever and wherever it suits
                  you best.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="w-full py-20 bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2">50K+</div>
                <p className="text-primary-foreground/90">Active Students</p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2">95%</div>
                <p className="text-primary-foreground/90">Pass Rate</p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2">150+</div>
                <p className="text-primary-foreground/90">Expert Instructors</p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2">6</div>
                <p className="text-primary-foreground/90">Core Subjects</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="w-full py-20 bg-background border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">Meet Our Team</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Team Member 1 */}
              <div className="text-center">
                <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-5xl">👨‍🎓</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Dr. James Wilson</h3>
                <p className="text-muted-foreground mb-3">Head of Mathematics</p>
                <p className="text-sm text-muted-foreground">
                  20+ years of teaching experience with expertise in IGCSE Mathematics
                </p>
              </div>

              {/* Team Member 2 */}
              <div className="text-center">
                <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-5xl">👩‍🎓</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Prof. Sarah Chen</h3>
                <p className="text-muted-foreground mb-3">Head of Sciences</p>
                <p className="text-sm text-muted-foreground">
                  Specialized in Physics, Chemistry, and Biology with international recognition
                </p>
              </div>

              {/* Team Member 3 */}
              <div className="text-center">
                <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-5xl">👨‍💼</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Mr. Ahmed Hassan</h3>
                <p className="text-muted-foreground mb-3">Head of Languages</p>
                <p className="text-sm text-muted-foreground">
                  Expert in English Language and Literature with 15+ years of experience
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 bg-background border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Join Our Learning Community</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start your IGCSE journey today and experience the difference quality education can make in your academic
              success.
            </p>
            <a
              href="/courses"
              className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Explore Courses
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
