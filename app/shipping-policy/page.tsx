import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy - Samiya Online',
  description:
    'Read our shipping policy to understand delivery times, shipping methods, costs, and international shipping options for your Samiya Online orders.',
  openGraph: {
    title: 'Shipping Policy - Samiya Online',
    description:
      'Read our shipping policy to understand delivery times, shipping methods, costs, and international shipping options for your Samiya Online orders.',
    type: 'website',
    images: ['/opengraph-image.png']
  },
  twitter: {
    card: 'summary_large_image',
    site: '@samiya_online',
    title: 'Shipping Policy - Samiya Online',
    description:
      'Read our shipping policy to understand delivery times, shipping methods, costs, and international shipping options for your Samiya Online orders.',
    images: ['/opengraph-image.png']
  }
};

export default function ShippingPolicyPage() {
  let content = '';
  try {
    content = fs.readFileSync(path.join(process.cwd(), 'app/shipping-policy/content.txt'), 'utf-8');
  } catch (e) {
    content = 'Shipping Policy content could not be loaded.';
  }

  // Split content into lines and process for rendering
  const lines = content.split('\n');
  const lastUpdatedLine = lines.find(line => line.toLowerCase().startsWith('last updated'));
  const lastUpdated = lastUpdatedLine ? lastUpdatedLine.replace('Last updated on ', '') : '';
  const title = lines[0] || 'Shipping Policy';
  const bodyLines = lines.slice(2); // skip title and last updated

  // Helper to render bullet points
  function renderBullets(lines) {
    return (
      <ul className="space-y-6 list-none">
        {lines.map((line, idx) => (
          <li key={idx} className="flex items-start space-x-4">
            <span
              className="flex-shrink-0 w-2 h-2 bg-luxury-gold rounded-full mt-3"
              aria-hidden="true"
            ></span>
            <p>{line.replace(/^•\s*/, '')}</p>
          </li>
        ))}
      </ul>
    );
  }

  // Parse sections
  let sections = [];
  let currentSection = null;
  bodyLines.forEach(line => {
    if (/^[A-Za-z &-]+:$/.test(line)) {
      if (currentSection) sections.push(currentSection);
      currentSection = {
        heading: line.replace(':', ''),
        bullets: [],
        paragraphs: []
      };
    } else if (/^• /.test(line)) {
      if (currentSection) currentSection.bullets.push(line);
    } else if (line.trim() !== '') {
      if (currentSection) currentSection.paragraphs.push(line);
    }
  });
  if (currentSection) sections.push(currentSection);

  return (
    <main className="min-h-screen bg-luxury-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <article className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <header className="text-center mb-12">
            <h1 className="luxury-heading text-4xl md:text-5xl text-luxury-black mb-4">{title}</h1>
            {lastUpdated && (
              <p className="luxury-body text-luxury-gray text-sm">
                <time dateTime={lastUpdated}>{`Last updated on ${lastUpdated}`}</time>
              </p>
            )}
          </header>

          <section className="prose prose-lg max-w-none">
            <div className="luxury-body text-luxury-black leading-relaxed space-y-6">
              {sections.map((section, idx) => (
                <div key={idx}>
                  <h2 className="luxury-heading text-2xl text-luxury-black mt-8 mb-6">
                    {section.heading}
                  </h2>
                  {section.bullets.length > 0 && renderBullets(section.bullets)}
                  {section.paragraphs.map((p, i) => {
                    const colonIdx = p.indexOf(':');
                    return (
                      <p
                        key={i}
                        className={`text-lg ${
                          section.heading.includes('Shipping Methods') && 'ml-6'
                        }`}
                      >
                        {colonIdx > 0 && <strong>{p.slice(0, colonIdx + 1)}</strong>}
                        {colonIdx > 0 ? p.slice(colonIdx + 1) : p}
                      </p>
                    );
                  })}
                </div>
              ))}
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
