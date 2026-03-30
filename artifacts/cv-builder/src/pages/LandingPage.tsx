import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { parseSlug, buildSeoPageData } from '../data/seo-data';

export default function LandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { skill, city } = parseSlug(slug ?? '');
  const page = buildSeoPageData(skill, city);

  useSEO({
    title: page.pageTitle,
    description: page.metaDescription,
    canonical: `https://cvbuilder.replit.app/resume/${slug}`,
  });

  const handleStart = () => {
    navigate('/', { state: { prefilledJobTitle: page.prefilledJobTitle } });
  };

  if (!skill && !city) {
    return (
      <div className="seo-not-found">
        <div className="seo-not-found-inner">
          <h1>Page not found</h1>
          <p>This page doesn't exist. Try our <Link to="/">free CV builder</Link>.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="seo-page">
      <nav className="seo-nav">
        <Link to="/" className="seo-nav-logo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 12h6M9 16h6M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          CV Builder <span className="seo-nav-pro">PRO</span>
        </Link>
        <button className="seo-nav-cta" onClick={handleStart}>
          Build My CV Free →
        </button>
      </nav>

      <header className="seo-hero">
        <div className="seo-hero-inner">
          <div className="seo-badges">
            {skill && <span className="seo-badge">{skill.label}</span>}
            {city && <span className="seo-badge">{city.label}</span>}
            <span className="seo-badge seo-badge-free">100% Free</span>
          </div>
          <h1 className="seo-h1">{page.h1}</h1>
          <p className="seo-h2">{page.h2}</p>
          <p className="seo-intro">{page.intro}</p>
          <div className="seo-cta-row">
            <button className="seo-cta-primary" onClick={handleStart}>
              Start Building My CV
            </button>
            <div className="seo-stats">
              <span>⚡ Ready in 5 minutes</span>
              <span>📄 PDF download</span>
              <span>🎨 3 templates</span>
            </div>
          </div>
        </div>
      </header>

      <section className="seo-tips-section">
        <div className="seo-section-inner">
          <h2 className="seo-section-title">
            {skill ? `Tips for a great ${skill.label} CV` : `Tips for your CV in ${city?.label}`}
          </h2>
          <ul className="seo-tips-list">
            {page.tips.map((tip, i) => (
              <li key={i} className="seo-tip-item">
                <span className="seo-tip-num">{i + 1}</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="seo-how-section">
        <div className="seo-section-inner">
          <h2 className="seo-section-title">How it works</h2>
          <div className="seo-steps">
            <div className="seo-step">
              <div className="seo-step-icon">1</div>
              <h3>Fill in your details</h3>
              <p>Add your experience, skills, education and contact info using our guided form.</p>
            </div>
            <div className="seo-step">
              <div className="seo-step-icon">2</div>
              <h3>Choose a template</h3>
              <p>Pick from Minimal, Modern Sidebar or Creative — all professionally designed.</p>
            </div>
            <div className="seo-step">
              <div className="seo-step-icon">3</div>
              <h3>Download as PDF</h3>
              <p>Export your finished CV as a perfect A4 PDF, ready to send to employers.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="seo-faq-section">
        <div className="seo-section-inner">
          <h2 className="seo-section-title">Frequently asked questions</h2>
          <div className="seo-faqs">
            {page.faqs.map((faq, i) => (
              <details key={i} className="seo-faq-item">
                <summary className="seo-faq-q">{faq.q}</summary>
                <p className="seo-faq-a">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="seo-related-section">
        <div className="seo-section-inner">
          <h2 className="seo-section-title">Related CV guides</h2>
          <div className="seo-related-links">
            {skill ? (
              <>
                <Link to="/resume/new-york" className="seo-related-link">CV Builder – New York</Link>
                <Link to="/resume/london" className="seo-related-link">CV Builder – London</Link>
                <Link to="/resume/toronto" className="seo-related-link">CV Builder – Toronto</Link>
                <Link to="/resume/sydney" className="seo-related-link">CV Builder – Sydney</Link>
              </>
            ) : (
              <>
                <Link to="/resume/software-engineer" className="seo-related-link">Software Engineer CV</Link>
                <Link to="/resume/nurse" className="seo-related-link">Nurse CV</Link>
                <Link to="/resume/teacher" className="seo-related-link">Teacher CV</Link>
                <Link to="/resume/project-manager" className="seo-related-link">Project Manager CV</Link>
              </>
            )}
          </div>
        </div>
      </section>

      <footer className="seo-footer">
        <div className="seo-footer-inner">
          <Link to="/" className="seo-footer-logo">CV Builder Pro</Link>
          <p>Free online CV and resume builder. No sign-up required.</p>
          <div className="seo-footer-links">
            <Link to="/">Home</Link>
            <Link to="/sitemap">Sitemap</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
