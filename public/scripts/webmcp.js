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

  /**
   * Discovers and registers declarative WebMCP forms (HTML forms with toolname, tooldescription, etc.)
   * according to the W3C Web Machine Learning Community Group WebMCP draft specification.
   * If the browser doesn't natively expose declarative form tools, bridges them into registerTool.
   */
  function registerDeclarativeForms(ctx) {
    if (typeof document === 'undefined') return;
    const forms = document.querySelectorAll('form[toolname]');

    for (const form of forms) {
      const toolName = form.getAttribute('toolname');
      if (!toolName) continue;
      if (tools[toolName]) continue;

      const description = form.getAttribute('tooldescription') || `Interact with ${toolName} form`;
      const inputs = form.querySelectorAll('input[name], select[name], textarea[name]');
      const properties = {};

      for (const input of inputs) {
        const name = input.getAttribute('name');
        if (!name) continue;
        const paramDesc =
          input.getAttribute('toolparamdescription') || input.getAttribute('placeholder') || name;
        properties[name] = {
          type: 'string',
          description: paramDesc,
        };
      }

      const declarativeTool = {
        name: toolName,
        description,
        inputSchema: {
          type: 'object',
          properties,
        },
        execute: async (params) => {
          if (params && typeof params === 'object') {
            for (const [k, v] of Object.entries(params)) {
              const field = form.querySelector(`[name="${k}"]`);
              if (field) {
                field.value = String(v);
                field.dispatchEvent(new Event('input', { bubbles: true }));
                field.dispatchEvent(new Event('change', { bubbles: true }));
              }
            }
          }
          if (form.getAttribute('toolautosubmit') !== null) {
            if (typeof form.requestSubmit === 'function') {
              form.requestSubmit();
            } else {
              form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            }
          }
          return { success: true, tool: toolName, values: params };
        },
      };

      tools[toolName] = declarativeTool;

      if (ctx && typeof ctx.registerTool === 'function') {
        try {
          const res = ctx.registerTool({
            name: declarativeTool.name,
            description: declarativeTool.description,
            inputSchema: declarativeTool.inputSchema,
            execute: declarativeTool.execute,
          });
          if (res && typeof res.catch === 'function') {
            res.catch((err) =>
              console.warn(`[WebMCP] Failed to register declarative tool "${toolName}":`, err)
            );
          }
        } catch (err) {
          console.warn(`[WebMCP] Declarative tool registration failed for "${toolName}":`, err);
        }
      }
    }
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

    // Register declarative forms found in the DOM
    registerDeclarativeForms(ctx);

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

  function init() {
    registerTools();
  }

  if (typeof window !== 'undefined') {
    init();
    window.addEventListener('DOMContentLoaded', () => init(), { once: true });
    window.addEventListener('load', () => init(), { once: true });
  }
})();
