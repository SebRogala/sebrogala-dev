// JSON-LD for the <head> (passed to Base as `jsonLd`). Person facts live here
// once; every value is something the site already shows on its pages.

const site = 'https://sebrogala.dev';

const person = {
  '@type': 'Person',
  name: 'Sebastian Rogala',
  url: site,
  jobTitle: 'AI-First Software Engineer',
  sameAs: ['https://linkedin.com/in/sebrogala', 'https://github.com/SebRogala'],
};

export const personJsonLd = { '@context': 'https://schema.org', ...person };

interface BlogPostingInput {
  headline: string;
  description: string;
  url: string;
  image: string;
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
