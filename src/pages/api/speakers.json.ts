import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const prerender = true;

interface SpeakerItem {
  slug: string;
  name: string;
  role: string;
  bio: string;
  topic?: string;
  links: {
    web?: string;
    x?: string;
    linkedin?: string;
    github?: string;
    mastodon?: string;
    bluesky?: string;
  };
  photo: string;
}

export const GET: APIRoute = async () => {
  const allSpeakers = await getCollection('speakers');
  const locales = ['ca', 'en', 'es'] as const;
  const result: Record<string, SpeakerItem[]> = {};

  for (const locale of locales) {
    result[locale] = allSpeakers
      .filter((s) => s.data.locale === locale && !s.data.draft)
      .map((s) => ({
        slug: s.data.slug,
        name: s.data.name,
        role: s.data.role,
        bio: s.data.bio,
        topic: s.data.topic,
        links: s.data.links,
        photo: s.data.photo,
      }));
  }

  return new Response(JSON.stringify(result, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
