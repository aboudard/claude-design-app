import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import { AuraRouge } from './theme/aura-rouge.preset';
import { PRIMENG_FR } from './theme/primeng-fr';
import { PRIMEUI_LICENSE } from './theme/license.generated';

registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    providePrimeNG({
      ripple: true,
      theme: {
        preset: AuraRouge,
        options: {
          darkModeSelector: '.app-dark',
          cssLayer: { name: 'primeng', order: 'theme, base, primeng' },
        },
      },
      translation: PRIMENG_FR,
      // PrimeNG 22+ : clé PrimeUI requise ; générée localement, jamais commitée (voir README).
      license: PRIMEUI_LICENSE,
    }),
  ],
};
