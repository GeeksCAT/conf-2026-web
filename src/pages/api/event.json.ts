import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = async () => {
  const eventInfo = {
    name: 'GeeksCAT Conf 2026',
    edition: 2026,
    date: '2026-06-14',
    location: {
      city: 'Girona',
      region: 'Catalonia',
      venue: 'Girona (veure secció com arribar a la web)',
    },
    urls: {
      website: 'https://conf.geeks.cat',
      agenda: 'https://conf.geeks.cat/agenda',
      speakers: 'https://conf.geeks.cat/speakers',
      tickets: 'https://conf.geeks.cat/tickets',
      cfp: 'https://conf.geeks.cat/cfp',
      coc: 'https://conf.geeks.cat/coc',
    },
    community: {
      telegram: 'https://t.me/silicongirona',
      contactEmail: 'hola@geeks.cat',
    },
    descriptions: {
      ca: 'La conferència de geeks per a geeks de Catalunya. Una jornada de programació, arquitectura, IA lliure, sistemes i comunitat a Girona.',
      en: 'The tech conference made by geeks for geeks in Catalonia. Talks on programming, architecture, open AI, systems, and community in Girona.',
      es: 'La conferencia de geeks para geeks de Cataluña. Una jornada de programación, arquitectura, IA libre, sistemas y comunidad en Girona.',
    },
  };

  return new Response(JSON.stringify(eventInfo, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
