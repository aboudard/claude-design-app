// Génère src/app/theme/license.generated.ts (ignoré par git) avec la clé PrimeUI.
// Source, par priorité : variable d'environnement PRIMEUI_LICENSE, puis fichier .primeui-license (ignoré par git).
// Sans clé : valeur vide (PrimeNG affiche son bandeau de licence, l'application fonctionne).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const keyFile = new URL('../.primeui-license', import.meta.url);
const target = new URL('../src/app/theme/license.generated.ts', import.meta.url);

const key = (
  process.env.PRIMEUI_LICENSE ??
  (existsSync(keyFile) ? readFileSync(keyFile, 'utf8') : '')
).trim();

const content = `// Fichier généré par scripts/gen-license.mjs — ne pas modifier ni commiter.
export const PRIMEUI_LICENSE: string | undefined = ${key ? JSON.stringify(key) : 'undefined'};
`;

if (!existsSync(target) || readFileSync(target, 'utf8') !== content) {
  writeFileSync(target, content);
}
console.log(key ? 'Licence PrimeUI : clé détectée.' : 'Licence PrimeUI : aucune clé (voir README).');
