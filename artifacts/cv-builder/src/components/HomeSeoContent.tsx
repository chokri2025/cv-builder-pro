import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SEO_CITIES, SEO_SKILLS } from '../data/seo-data';
import { getHomeFaqs } from '../lib/home-seo';

/** Landing pages linked from the homepage — the entry points into the job × city cluster. */
const FEATURED_SKILLS = ['software-engineer', 'nurse', 'teacher', 'accountant', 'project-manager'];
const FEATURED_CITIES = ['london', 'new-york', 'dubai'];

/**
 * Crawlable content for the builder page.
 *
 * The homepage is a tool, so it had no body copy at all for a crawler to read and
 * no links into the landing pages. This block sits at the end of the (scrollable)
 * form column: a short answer set and the entry points into the guide cluster.
 */
export default function HomeSeoContent({ langPrefix }: { langPrefix: string }) {
  const { t } = useTranslation();
  const faqs = getHomeFaqs(t);

  const skills = FEATURED_SKILLS.map((slug) => SEO_SKILLS.find((s) => s.slug === slug)).filter(
    (s): s is (typeof SEO_SKILLS)[number] => Boolean(s),
  );
  const cities = FEATURED_CITIES.map((slug) => SEO_CITIES.find((c) => c.slug === slug)).filter(
    (c): c is (typeof SEO_CITIES)[number] => Boolean(c),
  );

  return (
    <div className="home-seo">
      <section className="home-seo-block">
        <h2 className="home-seo-title">{t('home.faqTitle')}</h2>
        <dl className="home-seo-faqs">
          {faqs.map((faq) => (
            <div key={faq.q} className="home-seo-faq">
              <dt>{faq.q}</dt>
              <dd>{faq.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="home-seo-block">
        <h2 className="home-seo-title">{t('home.guidesTitle')}</h2>
        <ul className="home-seo-links">
          {skills.map((skill) => (
            <li key={skill.slug}>
              <Link to={`${langPrefix}/resume/${skill.slug}`}>
                {t('seo.related.skill', { skill: skill.label })}
              </Link>
            </li>
          ))}
          {cities.map((city) => (
            <li key={city.slug}>
              <Link to={`${langPrefix}/resume/${city.slug}`}>
                {t('seo.related.city', { city: city.label })}
              </Link>
            </li>
          ))}
          <li>
            <Link to={`${langPrefix}/sitemap`}>{t('seo.sitemap')}</Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
