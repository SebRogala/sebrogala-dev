import { defineMiddleware } from 'astro:middleware';
import { bindOneLetterWords } from './lib/typography';

// Every HTML page goes through the typography pass (src/lib/typography.ts).
// Middleware runs for the dev server and for each page the build prerenders,
// so what you see locally is what ships. Endpoints (llms.txt) are not HTML
// and pass through.
export const onRequest = defineMiddleware(async (_, next) => {
  const response = await next();
  if (!response.headers.get('content-type')?.includes('text/html')) return response;
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  return new Response(bindOneLetterWords(await response.text()), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
});
