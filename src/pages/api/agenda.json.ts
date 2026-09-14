import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const prerender = true;

interface AgendaSpeaker {
  name: string;
  slug: string;
  role: string;
  photo: string;
}

interface AgendaSession {
  type: 'session';
  slug: string;
  title: string;
  time: string;
  end: string;
  day: number;
  lang: 'ca' | 'en' | 'es';
  speaker: AgendaSpeaker | null;
  abstract: string;
}

interface AgendaSpacer {
  type: 'spacer';
  slug: string;
  title: string;
  time: string;
  end: string;
  day: number;
  abstract: string;
}

type AgendaItem = AgendaSession | AgendaSpacer;

export const GET: APIRoute = async () => {
  const allTalks = await getCollection('talks');
  const allSpeakers = await getCollection('speakers');

  const locales = ['ca', 'en', 'es'] as const;
  const result: Record<string, AgendaItem[]> = {};

  for (const locale of locales) {
    const speakerMap = new Map<string, AgendaSpeaker>(
      allSpeakers
        .filter((s) => s.data.locale === locale)
        .map((s) => [
          s.data.slug,
          {
            name: s.data.name,
            slug: s.data.slug,
            role: s.data.role,
            photo: s.data.photo,
          },
        ])
    );

    const schedule: AgendaItem[] = allTalks
      .filter((tk) => tk.data.locale === locale && !tk.data.draft)
      .sort((a, b) => a.data.time.localeCompare(b.data.time))
      .map((item) => {
        if (item.data.type === 'session') {
          const speaker = speakerMap.get(item.data.speakerSlug) ?? null;
          return {
            type: 'session',
            slug: item.data.slug,
            title: item.data.title,
            time: item.data.time,
            end: item.data.end,
            day: item.data.day,
            lang: item.data.lang,
            speaker,
            abstract: item.body?.trim() ?? '',
          };
        }
        return {
          type: 'spacer',
          slug: item.data.slug,
          title: item.data.title,
          time: item.data.time,
          end: item.data.end,
          day: item.data.day,
          abstract: item.body?.trim() ?? '',
        };
      });

    result[locale] = schedule;
  }

  return new Response(JSON.stringify(result, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
