// JSON-LD for the <head> (passed to Base as `jsonLd`). Person facts live here
// once; every value is something the site already shows on its pages.
import { cardFormats, siteCard } from './ogCard';

const site = 'https://sebrogala.dev';

const person = {
  '@type': 'Person',
  name: 'Sebastian Rogala',
  url: site,
  jobTitle: 'AI-Native Software Engineer',
  sameAs: ['https://linkedin.com/in/sebrogala', 'https://github.com/SebRogala'],
};

export const personJsonLd = {
  '@context': 'https://schema.org',
  ...person,
  image: cardFormats(siteCard).map((path) => new URL(path, site).href),
};

interface BlogPostingInput {
  headline: string;
  description: string;
  url: string;
  /** Absolute URLs, one per aspect ratio (cardFormats). */
  image: string[];
  published: Date;
  updated?: Date;
}

export const blogPostingJsonLd = ({ headline, description, url, image, published, updated }: BlogPostingInput) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline,
  description,
  datePublished: published.toISOString(),
  ...(updated && { dateModified: updated.toISOString() }),
  author: person,
  image,
  url,
  mainEntityOfPage: url,
});
