import { MapPin, Phone, Mail, Building2 } from 'lucide-react';
import { generateBaseMetadata } from 'lib/utils/generateMetadata';

export const metadata = generateBaseMetadata({
  title: 'Contact Us',
  description:
    'Get in touch with Samiya Online for inquiries, support, or feedback. Find our contact details, business information, and location.',
  url: '/contact'
});

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-luxury-white pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="text-center mb-16">
          <h1 className="luxury-heading text-4xl md:text-5xl text-luxury-black mb-4">Contact Us</h1>
          <p className="luxury-body text-luxury-gray text-lg max-w-2xl mx-auto">
            You may contact us using the information below
          </p>
          <p className="luxury-body text-luxury-gray text-sm mt-2">
            <time dateTime="2025-08-08">Last updated on 08-08-2025 18:04:42</time>
          </p>
        </header>

        <section
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
          aria-label="Contact Information"
        >
          <article className="bg-white rounded-xl border border-luxury-gray/10 p-8 shadow-sm">
            <header className="flex items-center mb-6">
              <div
                className="w-12 h-12 bg-luxury-gold/10 rounded-lg flex items-center justify-center mr-4"
                aria-hidden="true"
              >
                <Building2 className="w-6 h-6 text-luxury-gold" />
              </div>
              <h2 className="luxury-heading text-xl text-luxury-black">Business Information</h2>
            </header>
            <div className="space-y-4">
              <div>
                <h3 className="luxury-body text-sm text-luxury-gray uppercase tracking-wider mb-1">
                  Legal Entity
                </h3>
                <p className="luxury-body text-luxury-black font-medium">SAMIYA SILKS</p>
              </div>
            </div>
          </article>

          <article className="bg-white rounded-xl border border-luxury-gray/10 p-8 shadow-sm">
            <header className="flex items-center mb-6">
              <div
                className="w-12 h-12 bg-luxury-gold/10 rounded-lg flex items-center justify-center mr-4"
                aria-hidden="true"
              >
                <Phone className="w-6 h-6 text-luxury-gold" />
              </div>
              <h2 className="luxury-heading text-xl text-luxury-black">Get in Touch</h2>
            </header>
            <address className="space-y-6 not-italic">
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-luxury-gray mr-3" aria-hidden="true" />
                <div>
                  <h3 className="luxury-body text-sm text-luxury-gray uppercase tracking-wider">
                    Phone
                  </h3>
                  <a
                    href="tel:+919562700999"
                    className="luxury-body text-luxury-black hover:text-luxury-gold transition-colors"
                  >
                    +91 9562700999
                  </a>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-luxury-gray mr-3" aria-hidden="true" />
                <div>
                  <h3 className="luxury-body text-sm text-luxury-gray uppercase tracking-wider">
                    Email
                  </h3>
                  <a
                    href="mailto:samiyaorders0@gmail.com"
                    className="luxury-body text-luxury-black hover:text-luxury-gold transition-colors"
                  >
                    samiyaorders0@gmail.com
                  </a>
                </div>
              </div>
            </address>
          </article>
        </section>

        <section
          className="bg-white rounded-xl border border-luxury-gray/10 p-8 shadow-sm"
          aria-label="Business Address"
        >
          <header className="flex items-center mb-6">
            <div
              className="w-12 h-12 bg-luxury-gold/10 rounded-lg flex items-center justify-center mr-4"
              aria-hidden="true"
            >
              <MapPin className="w-6 h-6 text-luxury-gold" />
            </div>
            <h2 className="luxury-heading text-xl text-luxury-black">Our Location</h2>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <address className="not-italic">
              <h3 className="luxury-body text-sm text-luxury-gray uppercase tracking-wider mb-2">
                Registered Address
              </h3>
              <div className="luxury-body text-luxury-black leading-relaxed">
                <p>MP-IX/348 B, PAZHERI PLAZA</p>
                <p>KODATHIPPADI, MANNARKKAD</p>
                <p>MANNARKAD-I, KERALA</p>
                <p className="font-medium">PIN: 678582</p>
              </div>
            </address>

            <address className="not-italic">
              <h3 className="luxury-body text-sm text-luxury-gray uppercase tracking-wider mb-2">
                Operational Address
              </h3>
              <div className="luxury-body text-luxury-black leading-relaxed">
                <p>MP-IX/348 B, PAZHERI PLAZA</p>
                <p>KODATHIPPADI, MANNARKKAD</p>
                <p>MANNARKAD-I, KERALA</p>
                <p className="font-medium">PIN: 678582</p>
              </div>
            </address>
          </div>
        </section>

        <section className="text-center mt-16" aria-label="Contact Actions">
          <div className="bg-luxury-gold/5 rounded-xl p-8 border border-luxury-gold/10">
            <h2 className="luxury-heading text-2xl text-luxury-black mb-4">Ready to Connect?</h2>
            <p className="luxury-body text-luxury-gray mb-6 max-w-2xl mx-auto">
              Whether you have questions about our products, need assistance with an order, or want
              to learn more about our services, we&apos;re here to help.
            </p>
            <nav
              className="flex flex-col sm:flex-row gap-4 justify-center"
              aria-label="Contact Actions"
            >
              <a
                href="tel:+919562700999"
                className="inline-flex items-center justify-center px-6 py-3 bg-luxury-gold text-luxury-black font-medium rounded-lg hover:bg-luxury-gold/90 transition-colors"
                aria-label="Call us at +91 9562700999"
              >
                <Phone className="w-4 h-4 mr-2" aria-hidden="true" />
                Call Now
              </a>
              <a
                href="mailto:samiyaorders0@gmail.com"
                className="inline-flex items-center justify-center px-6 py-3 border border-luxury-gold text-luxury-black font-medium rounded-lg hover:bg-luxury-gold transition-colors"
                aria-label="Send email to samiyaorders0@gmail.com"
              >
                <Mail className="w-4 h-4 mr-2" aria-hidden="true" />
                Send Email
              </a>
            </nav>
          </div>
        </section>
      </div>
    </main>
  );
}
