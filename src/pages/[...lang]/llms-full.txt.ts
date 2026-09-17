import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import type { Locale } from '../../i18n/ui';
import { getLocale } from '../../i18n/utils';

export const prerender = true;

export function getStaticPaths() {
  return [{ params: { lang: undefined } }, { params: { lang: 'en' } }, { params: { lang: 'es' } }];
}

const siteUrl = 'https://conf.geeks.cat';

interface FullLocaleStrings {
  title: string;
  tagline: string;
  docDesc: string;
  genInfoHeading: string;
  fields: {
    name: string;
    date: string;
    venue: string;
    address: string;
    tickets: string;
    contact: string;
    philosophy: string;
  };
  scheduleHeading: string;
  speakerPrefix: string;
  speakersHeading: string;
  rolePrefix: string;
  linksPrefix: string;
  cocHeading: string;
  languagesHeading: string;
}

const strings: Record<Locale, FullLocaleStrings> = {
  ca: {
    title: 'GeeksCAT Conf 2026 — Context Complet',
    tagline:
      'La conferència de geeks per a geeks de Catalunya. Una jornada de programació, arquitectura, IA lliure, sistemes i comunitat a Girona el 26 de setembre de 2026.',
    docDesc:
      "Aquest document conté la informació exhaustiva i íntegra sobre la GeeksCAT Conf 2026 per a models de llenguatge i agents d'IA amb finestres de context extenses.",
    genInfoHeading: 'Informació General',
    fields: {
      name: 'GeeksCAT Conf 2026',
      date: 'Dissabte, 26 de setembre de 2026 (09:30 - 18:45 CEST)',
      venue: "L'Estació Espai Jove",
      address: 'Carrer de Santa Eugènia, 17, 17005 Girona, Catalunya',
      tickets:
        "Esdeveniment comunitari sense ànim de lucre. Reserva d'entrades a: https://conf.geeks.cat/tickets",
      contact: 'hola@geeks.cat | Comunitat a Telegram: https://t.me/silicongirona',
      philosophy:
        'L\'evolució de la mítica "Festa Open Source". Sessions tècniques, taules rodones, programari lliure, IA local, sistemes i espai de comunitat oberta.',
    },
    scheduleHeading: 'Programa Complet i Abstracts de les Ponències',
    speakerPrefix: 'Ponent',
    speakersHeading: 'Ponents Confirmats i Biografies Completes',
    rolePrefix: 'Rol',
    linksPrefix: 'Enllaços',
    cocHeading: 'Codi de Conducta Íntegre',
    languagesHeading: 'Versions en altres idiomes',
  },
  en: {
    title: 'GeeksCAT Conf 2026 — Full Context',
    tagline:
      'The tech conference by geeks for geeks in Catalonia. A full day of programming, architecture, open AI, systems, and community in Girona on September 26, 2026.',
    docDesc:
      'This document provides comprehensive and complete information about GeeksCAT Conf 2026 for language models and AI agents with large context windows.',
    genInfoHeading: 'General Information',
    fields: {
      name: 'GeeksCAT Conf 2026',
      date: 'Saturday, September 26, 2026 (09:30 - 18:45 CEST)',
      venue: "L'Estació Espai Jove",
      address: 'Carrer de Santa Eugènia, 17, 17005 Girona, Catalonia',
      tickets:
        'Non-profit community event. Ticket reservation at: https://conf.geeks.cat/en/tickets',
      contact: 'hola@geeks.cat | Telegram Community: https://t.me/silicongirona',
      philosophy:
        'The evolution of the legendary "Festa Open Source". Technical sessions, roundtables, free software, local AI, systems, and open community.',
    },
    scheduleHeading: 'Complete Schedule and Talk Abstracts',
    speakerPrefix: 'Speaker',
    speakersHeading: 'Confirmed Speakers and Full Biographies',
    rolePrefix: 'Role',
    linksPrefix: 'Links',
    cocHeading: 'Full Code of Conduct',
    languagesHeading: 'Other Language Versions',
  },
  es: {
    title: 'GeeksCAT Conf 2026 — Contexto Completo',
    tagline:
      'La conferencia de geeks para geeks de Cataluña. Una jornada de programación, arquitectura, IA libre, sistemas y comunidad en Girona el 26 de septiembre de 2026.',
    docDesc:
      'Este documento contiene la información exhaustiva e íntegra sobre la GeeksCAT Conf 2026 para modelos de lenguaje y agentes de IA con ventanas de contexto amplias.',
    genInfoHeading: 'Información General',
    fields: {
      name: 'GeeksCAT Conf 2026',
      date: 'Sábado, 26 de septiembre de 2026 (09:30 - 18:45 CEST)',
      venue: "L'Estació Espai Jove",
      address: 'Carrer de Santa Eugènia, 17, 17005 Girona, Cataluña',
      tickets:
        'Evento comunitario sin ánimo de lucro. Reserva de entradas en: https://conf.geeks.cat/es/tickets',
      contact: 'hola@geeks.cat | Comunidad en Telegram: https://t.me/silicongirona',
      philosophy:
        'La evolución de la mítica "Festa Open Source". Sesiones técnicas, mesas redondas, software libre, IA local, sistemas y espacio de comunidad abierta.',
    },
    scheduleHeading: 'Programa Completo y Abstracts de las Ponencias',
    speakerPrefix: 'Ponente',
    speakersHeading: 'Ponentes Confirmados y Biografías Completas',
    rolePrefix: 'Rol',
    linksPrefix: 'Enlaces',
    cocHeading: 'Código de Conducta Íntegro',
    languagesHeading: 'Versiones en otros idiomas',
  },
};

export const GET: APIRoute = async ({ params }) => {
  const locale = getLocale(params.lang);
  const s = strings[locale];

  const allTalks = await getCollection('talks');
  const allSpeakers = await getCollection('speakers');
  const allPages = await getCollection('pages');

  const speakersMap = new Map(
    allSpeakers.filter((sp) => sp.data.locale === locale).map((sp) => [sp.data.slug, sp.data])
  );

  const scheduleDetailed = allTalks
    .filter((tk) => tk.data.locale === locale && !tk.data.draft)
    .sort((a, b) => a.data.time.localeCompare(b.data.time))
    .map((item) => {
      if (item.data.type === 'session') {
        const speaker = speakersMap.get(item.data.speakerSlug);
        const speakerHeader = speaker
          ? `\n${s.speakerPrefix}: ${speaker.name} (${speaker.role})`
          : '';
        const body = item.body?.trim() ? `\n\n${item.body.trim()}` : '';
        return `### ${item.data.time} - ${item.data.end}: ${item.data.title}${speakerHeader}${body}`;
      }
      const spacerBody = item.body?.trim() ? `\n\n${item.body.trim()}` : '';
      return `### ${item.data.time} - ${item.data.end}: ${item.data.title}${spacerBody}`;
    })
    .join('\n\n---\n\n');

  const speakersDetailed = allSpeakers
    .filter((sp) => sp.data.locale === locale && !sp.data.draft)
    .sort((a, b) => a.data.name.localeCompare(b.data.name))
    .map((sp) => {
      const links = Object.entries(sp.data.links || {})
        .filter(([_, val]) => Boolean(val))
        .map(([key, val]) => `- ${key}: ${val}`)
        .join('\n');
      const linksSection = links ? `\n\n${s.linksPrefix}:\n${links}` : '';
      return `### ${sp.data.name}\n**${s.rolePrefix}:** ${sp.data.role}\n\n${sp.data.bio}${linksSection}`;
    })
    .join('\n\n---\n\n');

  const cocPage = allPages.find(
    (p) => p.id === `coc-${locale}` || p.id === `coc-${locale}.md` || p.data.locale === locale
  );
  const cocContent = cocPage?.body?.trim() || '';

  const languageLinks = [
    { label: 'Català', path: '/llms-full.txt' },
    { label: 'English', path: '/en/llms-full.txt' },
    { label: 'Español', path: '/es/llms-full.txt' },
  ]
    .map((l) => `- [${l.label}](${siteUrl}${l.path})`)
    .join('\n');

  const content = `# ${s.title}

> ${s.tagline}
> Web oficial: ${siteUrl}

${s.docDesc}

## ${s.genInfoHeading}

- **Nom / Name / Nombre:** ${s.fields.name}
- **Data / Date / Fecha:** ${s.fields.date}
- **Lloc / Venue / Lugar:** ${s.fields.venue}
- **Adreça / Address / Dirección:** ${s.fields.address}
- **Preu / Tickets / Entradas:** ${s.fields.tickets}
- **Contacte / Contact / Contacto:** ${s.fields.contact}
- **Filosofia / Philosophy / Filosofía:** ${s.fields.philosophy}

## ${s.languagesHeading}

${languageLinks}

## ${s.scheduleHeading}

${scheduleDetailed}

## ${s.speakersHeading}

${speakersDetailed}

## ${s.cocHeading}

${cocContent}
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
