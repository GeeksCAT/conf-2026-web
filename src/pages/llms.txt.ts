import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = async () => {
  const allTalks = await getCollection('talks');
  const allSpeakers = await getCollection('speakers');

  const speakerMap = new Map<string, string>(
    allSpeakers.filter((s) => s.data.locale === 'ca').map((s) => [s.data.slug, s.data.name])
  );

  const schedule = allTalks
    .filter((tk) => tk.data.locale === 'ca' && !tk.data.draft)
    .sort((a, b) => a.data.time.localeCompare(b.data.time))
    .map((item) => {
      if (item.data.type === 'session') {
        const speakerName = speakerMap.get(item.data.speakerSlug) ?? '';
        const by = speakerName ? ` — ${speakerName}` : '';
        return `- **${item.data.time} - ${item.data.end}**: ${item.data.title}${by}`;
      }
      return `- **${item.data.time} - ${item.data.end}**: ${item.data.title}`;
    });

  const content = `# GeeksCAT Conf 2026

> La conferència de geeks per a geeks de Catalunya. Una jornada de programació, arquitectura, IA lliure, sistemes i comunitat a Girona el 26 de setembre de 2026.

GeeksCAT Conf 2026 és l'evolució de la mítica "Festa Open Source". Manté el mateix esperit comunitari i afronta nous reptes tecnològics. L'esdeveniment tindrà lloc el dissabte 26 de setembre de 2026 a L'Estació Espai Jove de Girona (Carrer de Santa Eugènia, 17, 17005 Girona).

## Agenda i Horaris (26 de setembre de 2026)

${schedule.join('\n')}

## Seccions principals

- [Inici](https://conf.geeks.cat/): Pàgina principal del congrés.
- [Agenda](https://conf.geeks.cat/agenda): Horari complet de les ponències, xerrades i espais de trobada.
- [Ponents](https://conf.geeks.cat/speakers): Llistat de ponents confirmats, perfils i biografies.
- [Entrades](https://conf.geeks.cat/tickets): Informació sobre reserva i compra d'entrades.
- [Crida a ponències (CFP)](https://conf.geeks.cat/cfp): Propostes de xerrades obertes a la comunitat.
- [Patrocinadors](https://conf.geeks.cat/sponsors): Paquets de patrocini i empreses col·laboradores.
- [Codi de Conducta](https://conf.geeks.cat/coc): Compromís de convivència, respecte i seguretat de la comunitat.

## Endpoints estructurats per a agents d'IA i WebMCP

- [Informació de l'esdeveniment (JSON)](https://conf.geeks.cat/api/event.json): Dades bàsiques, dates, ubicació i xarxes.
- [Agenda completa (JSON)](https://conf.geeks.cat/api/agenda.json): Sessions, horaris, descripcions i ponents per idioma (ca, en, es).
- [Llistat de ponents (JSON)](https://conf.geeks.cat/api/speakers.json): Dades detallades de cada ponent (bio, foto, enllaços).
- [Manifest WebMCP](https://conf.geeks.cat/.well-known/webmcp.json): Manifest de capacitats i eines WebMCP per a agents d'IA.
- [Eines client WebMCP](https://conf.geeks.cat/scripts/webmcp.js): Proveïdor d'eines W3C WebMCP per al navegador.
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
