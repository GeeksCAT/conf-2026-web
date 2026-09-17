/// <reference path="../.astro/types.d.ts" />

/**
 * Declarative WebMCP HTML attribute extensions for Astro JSX.
 * W3C Web Machine Learning Community Group WebMCP draft specification.
 */
declare namespace astroHTML.JSX {
  interface FormHTMLAttributes {
    toolname?: string | undefined | null;
    tooldescription?: string | undefined | null;
    toolautosubmit?: boolean | string | undefined | null;
  }
  interface InputHTMLAttributes {
    toolparamdescription?: string | undefined | null;
  }
  interface SelectHTMLAttributes {
    toolparamdescription?: string | undefined | null;
  }
  interface TextareaHTMLAttributes {
    toolparamdescription?: string | undefined | null;
  }
}
