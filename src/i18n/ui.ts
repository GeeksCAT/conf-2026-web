import { common } from './translations/common';
import { nav } from './translations/nav';
import { hero } from './translations/hero';
import { footer } from './translations/footer';
import { index } from './translations/index';
import { cfp } from './translations/cfp';
import { agenda } from './translations/agenda';
import { speakers } from './translations/speakers';
import { sponsors } from './translations/sponsors';

export type Locale = 'ca' | 'en' | 'es';

export const defaultLocale: Locale = 'ca';

export const ui = {
  ca: {
    ...common.ca,
    ...nav.ca,
    ...hero.ca,
    ...footer.ca,
    ...index.ca,
    ...cfp.ca,
    ...agenda.ca,
    ...speakers.ca,
    ...sponsors.ca,
  },
  en: {
    ...common.en,
    ...nav.en,
    ...hero.en,
    ...footer.en,
    ...index.en,
    ...cfp.en,
    ...agenda.en,
    ...speakers.en,
    ...sponsors.en,
  },
  es: {
    ...common.es,
    ...nav.es,
    ...hero.es,
    ...footer.es,
    ...index.es,
    ...cfp.es,
    ...agenda.es,
    ...speakers.es,
    ...sponsors.es,
  },
} as const;

export type UIKey = keyof (typeof ui)['ca'];
