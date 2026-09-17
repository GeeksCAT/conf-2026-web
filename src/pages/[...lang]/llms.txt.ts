import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import type { Locale } from '../../i18n/ui';
import { getLocale, localizedPath } from '../../i18n/utils';

export const prerender = true;

export function getStaticPaths() {
  return [{ params: { lang: undefined } }, { params: { lang: 'en' } }, { params: { lang: 'es' } }];
}

const siteUrl = 'https://conf.geeks.cat';

interface LocaleStrings {
  title: string;
  tagline: string;
  intro: string;
  scheduleHeading: string;
  sectionsHeading: string;
  sections: { name: string; path: string; desc: string }[];
  endpointsHeading: string;
  endpoints: { name: string; url: string; desc: string }[];
  languagesHeading: string;
}

const strings: Record<Locale, LocaleStrings> = {
  ca: {
    title: 'GeeksCAT Conf 2026',
    tagline:
      'La conferència de geeks per a geeks de Catalunya. Una jornada de programació, arquitectura, IA lliure, sistemes i comunitat a Girona el 26 de setembre de 2026.',
    intro:
      "GeeksCAT Conf 2026 és l'evolució de la mítica \"Festa Open Source\". Manté el mateix esperit comunitari i afronta nous reptes tecnològics. L'esdeveniment tindrà lloc el dissabte 26 de setembre de 2026 a L'Estació Espai Jove de Girona (Carrer de Santa Eugènia, 17, 17005 Girona).",
    scheduleHeading: 'Agenda i Horaris (26 de setembre de 2026)',
    sectionsHeading: 'Seccions principals',
    sections: [
      { name: 'Inici', path: '/', desc: 'Pàgina principal del congrés.' },
      {
        name: 'Agenda',
        path: '/agenda',
        desc: 'Horari complet de les ponències, xerrades i espais de trobada.',
      },
      {
        name: 'Ponents',
        path: '/speakers',
        desc: 'Llistat de ponents confirmats, perfils i biografies.',
      },
      { name: 'Entrades', path: '/tickets', desc: "Informació sobre reserva i compra d'entrades." },
      {
        name: 'Crida a ponències (CFP)',
        path: '/cfp',
        desc: 'Propostes de xerrades obertes a la comunitat.',
      },
      {
        name: 'Patrocinadors',
        path: '/sponsors',
        desc: 'Paquets de patrocini i empreses col·laboradores.',
      },
      {
        name: 'Codi de Conducta',
        path: '/coc',
        desc: 'Compromís de convivència, respecte i seguretat de la comunitat.',
      },
    ],
    endpointsHeading: "Endpoints estructurats per a agents d'IA i WebMCP",
    endpoints: [
      {
        name: 'Context complet per a LLMs (llms-full.txt)',
        url: `${siteUrl}/llms-full.txt`,
        desc: 'Document exhaustiu amb tots els abstracts complets de les xerrades, biografies de ponents i codi de conducta per a models amb finestres de context grans.',
      },
      {
        name: "Informació de l'esdeveniment (JSON)",
        url: `${siteUrl}/api/event.json`,
        desc: 'Dades bàsiques, dates, ubicació i xarxes.',
      },
      {
        name: 'Agenda completa (JSON)',
        url: `${siteUrl}/api/agenda.json`,
        desc: 'Sessions, horaris, descripcions i ponents per idioma (ca, en, es).',
      },
      {
        name: 'Llistat de ponents (JSON)',
        url: `${siteUrl}/api/speakers.json`,
        desc: 'Dades detallades de cada ponent (bio, foto, enllaços).',
      },
      {
        name: 'Manifest WebMCP',
        url: `${siteUrl}/.well-known/webmcp.json`,
        desc: "Manifest de capacitats i eines WebMCP per a agents d'IA.",
      },
      {
        name: 'Eines client WebMCP',
        url: `${siteUrl}/scripts/webmcp.js`,
        desc: "Proveïdor d'eines W3C WebMCP per al navegador.",
      },
    ],
    languagesHeading: 'Versions en altres idiomes',
  },
  en: {
    title: 'GeeksCAT Conf 2026',
    tagline:
      'The tech conference by geeks for geeks in Catalonia. A full day of programming, architecture, open AI, systems, and community in Girona on September 26, 2026.',
    intro:
      'GeeksCAT Conf 2026 is the evolution of the legendary "Festa Open Source". Keeping the same community spirit while taking on new tech challenges. The event takes place on Saturday, September 26, 2026 at L\'Estació Espai Jove in Girona (Carrer de Santa Eugènia, 17, 17005 Girona, Catalonia).',
    scheduleHeading: 'Schedule & Timetable (September 26, 2026)',
    sectionsHeading: 'Main Sections',
    sections: [
      { name: 'Home', path: '/', desc: 'Main conference homepage.' },
      {
        name: 'Agenda',
        path: '/agenda',
        desc: 'Full timetable of keynotes, sessions, and networking spaces.',
      },
      { name: 'Speakers', path: '/speakers', desc: 'Confirmed speakers list, bios, and links.' },
      {
        name: 'Tickets',
        path: '/tickets',
        desc: 'Information on reserving and purchasing tickets.',
      },
      {
        name: 'Call for Proposals (CFP)',
        path: '/cfp',
        desc: 'Talk proposals open to the community.',
      },
      { name: 'Sponsors', path: '/sponsors', desc: 'Sponsorship packages and partner companies.' },
      {
        name: 'Code of Conduct',
        path: '/coc',
        desc: 'Community commitment to respectful, inclusive, and safe spaces.',
      },
    ],
    endpointsHeading: 'Structured Endpoints for AI Agents and WebMCP',
    endpoints: [
      {
        name: 'Full LLM Context (llms-full.txt)',
        url: `${siteUrl}/en/llms-full.txt`,
        desc: 'Comprehensive document with all full talk abstracts, speaker bios, and code of conduct for LLMs with large context windows.',
      },
      {
        name: 'Event Information (JSON)',
        url: `${siteUrl}/api/event.json`,
        desc: 'Core event details, dates, venue, and social channels.',
      },
      {
        name: 'Full Schedule (JSON)',
        url: `${siteUrl}/api/agenda.json`,
        desc: 'Sessions, timings, descriptions, and speakers across languages (ca, en, es).',
      },
      {
        name: 'Speakers Directory (JSON)',
        url: `${siteUrl}/api/speakers.json`,
        desc: 'Detailed speaker profiles (bio, photo, links).',
      },
      {
        name: 'WebMCP Manifest',
        url: `${siteUrl}/.well-known/webmcp.json`,
        desc: 'WebMCP capabilities and tools manifest for AI agents.',
      },
      {
        name: 'WebMCP Client Tools',
        url: `${siteUrl}/scripts/webmcp.js`,
        desc: 'In-browser W3C WebMCP tool provider.',
      },
    ],
    languagesHeading: 'Other Language Versions',
  },
  es: {
    title: 'GeeksCAT Conf 2026',
    tagline:
      'La conferencia de geeks para geeks de Cataluña. Una jornada de programación, arquitectura, IA libre, sistemas y comunidad en Girona el 26 de septiembre de 2026.',
    intro:
      'GeeksCAT Conf 2026 es la evolución de la mítica "Festa Open Source". Mantiene el mismo espíritu comunitario y afronta nuevos retos tecnológicos. El evento tendrá lugar el sábado 26 de septiembre de 2026 en L\'Estació Espai Jove de Girona (Carrer de Santa Eugènia, 17, 17005 Girona).',
    scheduleHeading: 'Agenda y Horarios (26 de septiembre de 2026)',
    sectionsHeading: 'Secciones principales',
    sections: [
      { name: 'Inicio', path: '/', desc: 'Página principal del congreso.' },
      {
        name: 'Agenda',
        path: '/agenda',
        desc: 'Horario completo de las ponencias, charlas y espacios de encuentro.',
      },
      {
        name: 'Ponentes',
        path: '/speakers',
        desc: 'Listado de ponentes confirmados, perfiles y biografías.',
      },
      {
        name: 'Entradas',
        path: '/tickets',
        desc: 'Información sobre reserva y compra de entradas.',
      },
      {
        name: 'Llamada a ponencias (CFP)',
        path: '/cfp',
        desc: 'Propuestas de charlas abiertas a la comunidad.',
      },
      {
        name: 'Patrocinadores',
        path: '/sponsors',
        desc: 'Paquetes de patrocinio y empresas colaboradoras.',
      },
      {
        name: 'Código de Conducta',
        path: '/coc',
        desc: 'Compromiso de convivencia, respeto y seguridad de la comunidad.',
      },
    ],
    endpointsHeading: 'Endpoints estructurados para agentes de IA y WebMCP',
    endpoints: [
      {
        name: 'Contexto completo para LLMs (llms-full.txt)',
        url: `${siteUrl}/es/llms-full.txt`,
        desc: 'Documento exhaustivo con todos los abstracts completos de las charlas, biografías de ponentes y código de conducta para modelos con ventanas de contexto amplias.',
      },
      {
        name: 'Información del evento (JSON)',
        url: `${siteUrl}/api/event.json`,
        desc: 'Datos básicos, fechas, ubicación y redes.',
      },
      {
        name: 'Agenda completa (JSON)',
        url: `${siteUrl}/api/agenda.json`,
        desc: 'Sesiones, horarios, descripciones y ponentes por idioma (ca, en, es).',
      },
      {
        name: 'Listado de ponentes (JSON)',
        url: `${siteUrl}/api/speakers.json`,
        desc: 'Datos detallados de cada ponente (bio, foto, enlaces).',
      },
      {
        name: 'Manifiesto WebMCP',
        url: `${siteUrl}/.well-known/webmcp.json`,
        desc: 'Manifiesto de capacidades y herramientas WebMCP para agentes de IA.',
      },
      {
        name: 'Herramientas cliente WebMCP',
        url: `${siteUrl}/scripts/webmcp.js`,
        desc: 'Proveedor de herramientas W3C WebMCP para el navegador.',
      },
    ],
    languagesHeading: 'Versiones en otros idiomas',
  },
};

export const GET: APIRoute = async ({ params }) => {
  const locale = getLocale(params.lang);
  const s = strings[locale];

  const allTalks = await getCollection('talks');
  const allSpeakers = await getCollection('speakers');

  const speakerMap = new Map<string, string>(
    allSpeakers.filter((sp) => sp.data.locale === locale).map((sp) => [sp.data.slug, sp.data.name])
  );

  const schedule = allTalks
    .filter((tk) => tk.data.locale === locale && !tk.data.draft)
    .sort((a, b) => a.data.time.localeCompare(b.data.time))
    .map((item) => {
      if (item.data.type === 'session') {
        const speakerName = speakerMap.get(item.data.speakerSlug) ?? '';
        const by = speakerName ? ` — ${speakerName}` : '';
        return `- **${item.data.time} - ${item.data.end}**: ${item.data.title}${by}`;
      }
      return `- **${item.data.time} - ${item.data.end}**: ${item.data.title}`;
    });

  const languageLinks = [
    { label: 'Català', path: '/llms.txt' },
    { label: 'English', path: '/en/llms.txt' },
    { label: 'Español', path: '/es/llms.txt' },
  ]
    .map((l) => `- [${l.label}](${siteUrl}${l.path})`)
    .join('\n');

  const sectionLinks = s.sections
    .map((sec) => `- [${sec.name}](${siteUrl}${localizedPath(sec.path, locale)}): ${sec.desc}`)
    .join('\n');

  const endpointLinks = s.endpoints.map((ep) => `- [${ep.name}](${ep.url}): ${ep.desc}`).join('\n');

  const content = `# ${s.title}

> ${s.tagline}

${s.intro}

## ${s.scheduleHeading}

${schedule.join('\n')}

## ${s.sectionsHeading}

${sectionLinks}

## ${s.endpointsHeading}

${endpointLinks}

## ${s.languagesHeading}

${languageLinks}
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
