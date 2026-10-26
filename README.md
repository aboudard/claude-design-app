# Gestion des utilisateurs — Angular 22 + PrimeNG 22 (Aura rouge)

Versions vérifiées le 16/10/2026 : Angular 22.2, PrimeNG 22.1.2, @primeuix/themes 3.0.1, primeicons 8.

## Démarrer

```bash
npm install
npm start          # http://localhost:4200
npm run verify     # formatage + build + tests (à lancer avant chaque commit)
```

Node.js ≥ 22.22.3 (ou ≥ 24.15) est requis par Angular CLI 22.

## Licence PrimeNG (important)

Depuis la v22, PrimeNG exige une clé de licence PrimeUI : sans clé, un bandeau
« Invalid PrimeUI License » s'affiche. La licence Community (gratuite) est réservée aux
structures de moins de 10 employés / 1 M$ de CA ; au-delà, une licence commerciale par
développeur est nécessaire. La clé n'est **jamais commitée** (dépôt public). Sur votre machine,
créez le fichier `.primeui-license` (ignoré par git) à la racine, contenant uniquement la clé,
ou définissez la variable d'environnement `PRIMEUI_LICENSE` (CI). Les commandes `npm start`,
`npm run build`, `npm test`… exécutent d'abord `npm run license`, qui génère
`src/app/theme/license.generated.ts` (ignoré par git) lu par `app.config.ts`. Sans clé,
l'application fonctionne avec le bandeau de licence.

Si vous lancez `npx ng …` directement, exécutez avant `npm run license`. La clé est embarquée
dans le bundle front : ce n'est pas un secret côté navigateur, mais elle ne doit pas être dans le dépôt.

Alternative sans clé : la branche 21 (`primeng@21`, Angular 21), quasi identique côté API.

## Structure

```
src/app/
├── app.config.ts                 providePrimeNG (preset, locale FR, couches CSS)
├── theme/
│   ├── aura-rouge.preset.ts      Aura + palette primaire red (teinte 600 pour le contraste)
│   └── primeng-fr.ts             traductions PrimeNG
└── users/
    ├── user.model.ts             User, Address, helpers (isExpired, initials)
    ├── user.service.ts           store signals en mémoire (à remplacer par HttpClient)
    ├── user-list/                p-table + sélection multiple, filtres, actions, suppression en masse
    ├── user-detail-dialog/       p-dialog de visualisation (adresse, qualifications en p-chip)
    └── user-form-dialog/         p-dialog formulaire réactif (création / édition)
```

Composants PrimeNG utilisés : Table (TableCheckbox, TableHeaderCheckbox, SortIcon, Paginator),
Dialog, ConfirmDialog, Toast, Button, Tag, Chip, Avatar, SelectButton, IconField/InputIcon,
InputText, Textarea, DatePicker, ToggleSwitch, InputTags, Message, Tooltip.

## Revenir au rouge Aura d'origine (#ef4444)

Supprimez le bloc `colorScheme` dans `theme/aura-rouge.preset.ts`.

## Assistants IA

| Fichier                 | Rôle                                                                                   |
| ----------------------- | -------------------------------------------------------------------------------------- |
| `AGENTS.md`             | Contexte et conventions communs à tous les agents (Claude, Copilot, Cline…)            |
| `CLAUDE.md`             | Importe `AGENTS.md` + consignes propres à Claude Code                                  |
| `.claude/settings.json` | Permissions partagées de Claude Code (commandes autorisées / interdites)               |
| `.mcp.json`             | Serveurs MCP pour Claude Code : `angular-cli` (`ng mcp`) et `primeng` (`@primeng/mcp`) |
| `.vscode/mcp.json`      | Mêmes serveurs MCP pour GitHub Copilot dans VS Code                                    |

`.mcp.json` lance `@primeng/mcp` via `cmd /c npx` (Windows). Sous macOS / Linux, remplacer par
`"command": "npx", "args": ["-y", "@primeng/mcp@22"]`.
Préférences personnelles : `.claude/settings.local.json` et `CLAUDE.local.md` (ignorés par git).
