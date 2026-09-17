import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = async () => {
  const allTalks = await getCollection('talks');
  const allSpeakers = await getCollection('speakers');
  const allPages = await getCollection('pages');

  const speakersMap = new Map(
    allSpeakers.filter((s) => s.data.locale === 'ca').map((s) => [s.data.slug, s.data])
  );

  const scheduleDetailed = allTalks
    .filter((tk) => tk.data.locale === 'ca' && !tk.data.draft)
    .sort((a, b) => a.data.time.localeCompare(b.data.time))
    .map((item) => {
      if (item.data.type === 'session') {
        const speaker = speakersMap.get(item.data.speakerSlug);
        const speakerHeader = speaker ? `\nPonent: ${speaker.name} (${speaker.role})` : '';
        const body = item.body?.trim() ? `\n\n${item.body.trim()}` : '';
        return `### ${item.data.time} - ${item.data.end}: ${item.data.title}${speakerHeader}${body}`;
      }
      const spacerBody = item.body?.trim() ? `\n\n${item.body.trim()}` : '';
      return `### ${item.data.time} - ${item.data.end}: ${item.data.title}${spacerBody}`;
    })
    .join('\n\n---\n\n');

  const speakersDetailed = allSpeakers
    .filter((s) => s.data.locale === 'ca' && !s.data.draft)
    .sort((a, b) => a.data.name.localeCompare(b.data.name))
    .map((s) => {
      const links = Object.entries(s.data.links || {})
        .filter(([_, val]) => Boolean(val))
        .map(([key, val]) => `- ${key}: ${val}`)
        .join('\n');
      const linksSection = links ? `\n\nEnllaços:\n${links}` : '';
      return `### ${s.data.name}\n**Rol:** ${s.data.role}\n\n${s.data.bio}${linksSection}`;
    })
    .join('\n\n---\n\n');

  const cocPage = allPages.find((p) => p.id === 'coc-ca' || p.data.locale === 'ca');
  const cocContent = cocPage?.body?.trim() || '';

  const content = `# GeeksCAT Conf 2026 — Context Complet

> La conferència de geeks per a geeks de Catalunya. Una jornada de programació, arquitectura, IA lliure, sistemes i comunitat a Girona el 26 de setembre de 2026.
> Web oficial: https://conf.geeks.cat

Aquest document conté la informació exhaustiva i íntegra sobre la GeeksCAT Conf 2026 per a models de llenguatge i agents d'IA amb finestres de context extenses.

## Informació General

- **Nom:** GeeksCAT Conf 2026
- **Data:** Dissabte, 26 de setembre de 2026 (09:30 - 18:45 CEST)
- **Lloc:** L'Estació Espai Jove
- **Adreça:** Carrer de Santa Eugènia, 17, 17005 Girona, Catalunya
- **Preu:** Esdeveniment comunitari sense ànim de lucre. Reserva d'entrades a: https://conf.geeks.cat/tickets
- **Contacte:** hola@geeks.cat | Comunitat a Telegram: https://t.me/silicongirona
- **Filosofia:** L'evolució de la mítica "Festa Open Source". Sessions tècniques, taules rodones, programari lliure, IA local, sistemes i espai de comunitat oberta.

## Programa Complet i Abstracts de les Ponències

${scheduleDetailed}

## Ponents Confirmats (Biografies i Xarxes)

${speakersDetailed}

## Codi de Conducta (Política de Convivència)

${cocContent}

## Endpoints i Recursos Estructurats per a Agents d'IA

- API Event bàsic: https://conf.geeks.cat/api/event.json
- API Agenda (JSON per idioma): https://conf.geeks.cat/api/agenda.json
- API Ponents (JSON per idioma): https://conf.geeks.cat/api/speakers.json
- Manifest WebMCP: https://conf.geeks.cat/.well-known/webmcp.json
- Eines client W3C WebMCP: https://conf.geeks.cat/scripts/webmcp.js
- Resum llms.txt: https://conf.geeks.cat/llms.txt
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
