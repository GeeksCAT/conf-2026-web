/**
 * WebMCP (Web Model Context Protocol) tool provider for GeeksCAT Conf 2026.
 * Implements the W3C Web Machine Learning Community Group draft specification.
 * https://webmachinelearning.github.io/webmcp/
 */
(() => {
  async function fetchJson(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('[WebMCP] Failed to fetch data:', url, err);
      return null;
    }
  }

  const tools = {
    get_agenda: {
      name: 'get_agenda',
      description:
        'Returns the complete conference schedule (sessions, timings, titles, speakers, and abstracts) for GeeksCAT 2026 in Girona.',
      inputSchema: {
        type: 'object',
        properties: {
          locale: {
            type: 'string',
            enum: ['ca', 'en', 'es'],
            description: 'Language of the schedule (default: ca)',
          },
        },
      },
      execute: async (params) => {
        const lang = params?.locale || document.documentElement.lang || 'ca';
        const data = await fetchJson('/api/agenda.json');
        if (!data) return { error: 'Unable to retrieve agenda' };
        return {
          conference: 'GeeksCAT Conf 2026',
          locale: lang,
          schedule: data[lang] || data.ca || [],
        };
      },
    },

    get_speakers: {
      name: 'get_speakers',
      description:
        'Returns confirmed speakers for GeeksCAT 2026 with their roles, bios, and links.',
      inputSchema: {
        type: 'object',
        properties: {
          locale: {
            type: 'string',
            enum: ['ca', 'en', 'es'],
            description: 'Language of biographies (default: ca)',
          },
          speaker_slug: {
            type: 'string',
            description:
              'Optional speaker slug (e.g. "jordi-mas", "dario-castane", "andrey-sitnik")',
          },
        },
      },
      execute: async (params) => {
        const lang = params?.locale || document.documentElement.lang || 'ca';
        const data = await fetchJson('/api/speakers.json');
        if (!data) return { error: 'Unable to retrieve speakers' };
        const list = data[lang] || data.ca || [];
        if (params?.speaker_slug) {
          const speaker = list.find((s) => s.slug === params.speaker_slug);
          return speaker || { error: `Speaker "${params.speaker_slug}" not found` };
        }
        return {
          conference: 'GeeksCAT Conf 2026',
          locale: lang,
          count: list.length,
          speakers: list,
        };
      },
    },

    get_conference_info: {
      name: 'get_conference_info',
      description:
        'Returns practical details about GeeksCAT Conf 2026: date, venue, location in Girona, tickets link, and contact.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
      execute: async () => {
        const data = await fetchJson('/api/event.json');
        return data || { error: 'Unable to retrieve conference info' };
      },
    },
  };

  // Expose on window for easy developer testing and inspecting in DevTools console
  if (typeof window !== 'undefined') {
    window.__webmcpTools = tools;
  }

  // Feature detection for W3C WebMCP API.
  // document.modelContext is where the current W3C spec places the API;
  // navigator.modelContext is where early Chrome builds exposed it;
  // window.modelContext is where early drafts, polyfills, and inspectors expose it.
  function registerTools() {
    const ctx =
      (typeof document !== 'undefined' && document.modelContext) ||
      (typeof navigator !== 'undefined' && navigator.modelContext) ||
      (typeof window !== 'undefined' && window.modelContext);

    if (!ctx || typeof ctx.registerTool !== 'function') {
      return false;
    }

    try {
      for (const key of Object.keys(tools)) {
        const tool = tools[key];
        const res = ctx.registerTool({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema,
          execute: tool.execute,
        });

        if (res && typeof res.catch === 'function') {
          res.catch((err) => console.warn(`[WebMCP] Failed to register tool "${tool.name}":`, err));
        }
      }
      console.info('[WebMCP] Registered tools for GeeksCAT 2026');
      return true;
    } catch (err) {
      console.warn('[WebMCP] Tool registration failed:', err);
      return false;
    }
  }

  if (!registerTools() && typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => registerTools(), { once: true });
    window.addEventListener('load', () => registerTools(), { once: true });
  }
})();
