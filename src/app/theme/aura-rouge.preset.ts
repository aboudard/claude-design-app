import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

/**
 * Thème Aura avec le rouge comme couleur primaire.
 *
 * - `semantic.primary` remplace la palette primaire (emerald par défaut) par la palette red.
 * - `colorScheme.light.primary` décale la teinte principale de 500 vers 600 :
 *   le blanc sur red-500 (#ef4444) n'atteint que 3,8:1 de contraste, contre 4,8:1 sur red-600.
 *   Supprimez ce bloc pour revenir au rouge Aura d'origine.
 */
export const AuraRouge = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{red.50}',
      100: '{red.100}',
      200: '{red.200}',
      300: '{red.300}',
      400: '{red.400}',
      500: '{red.500}',
      600: '{red.600}',
      700: '{red.700}',
      800: '{red.800}',
      900: '{red.900}',
      950: '{red.950}',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{primary.600}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.700}',
          activeColor: '{primary.800}',
        },
        highlight: {
          background: '{primary.50}',
          focusBackground: '{primary.100}',
          color: '{primary.700}',
          focusColor: '{primary.800}',
        },
      },
    },
  },
});
