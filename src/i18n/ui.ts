import { agenda } from './translations/agenda';
import { cfp } from './translations/cfp';
import { common } from './translations/common';
import { footer } from './translations/footer';
import { hero } from './translations/hero';
import { index } from './translations/index';
import { nav } from './translations/nav';
import { resum } from './translations/resum';
import { speakers } from './translations/speakers';
import { sponsors } from './translations/sponsors';
import { tickets } from './translations/tickets';

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
    ...tickets.ca,
    ...resum.ca,
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
    ...tickets.en,
    ...resum.en,
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
    ...tickets.es,
    ...resum.es,
  },
} as const;

export type UIKey = keyof (typeof ui)['ca'];
