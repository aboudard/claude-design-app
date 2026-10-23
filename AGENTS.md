# AGENTS.md — Gestion des utilisateurs

Instructions communes à tous les assistants IA (Claude Code, GitHub Copilot, Cline, Roo, Continue…).
Les spécificités Claude sont dans `CLAUDE.md`.
L'historique de conception et les décisions (le _pourquoi_) sont dans `docs/historique-claude.md`.
Les règles de création des PR (labels obligatoires) sont dans `docs/pull-requests.md`.

## Projet

Écran d'administration des utilisateurs : liste avec sélection multiple et suppression en masse,
actions par ligne (visualiser / éditer / supprimer), dialog de détail (adresse, qualifications en
chips), formulaire de création / édition. Interface en **français**.

## Stack (ne pas changer de version majeure sans demande explicite)

- Angular **22.2** : composants standalone, signals, zoneless, nouvelle syntaxe de contrôle (`@if`, `@for`)
- PrimeNG **22.1** + `@primeuix/themes` **3** : thème **Aura**, primaire **rouge** (`src/app/theme/aura-rouge.preset.ts`)
- primeicons 8 (classes `pi pi-*`), TypeScript 6 (strict), Vitest 5 via `@angular/build:unit-test`, Prettier
- Node.js ≥ 22.22.3 ou ≥ 24.15

## Commandes

| But                                               | Commande                                                              |
| ------------------------------------------------- | --------------------------------------------------------------------- |
| Serveur de dev                                    | `npm start` (http://localhost:4200) — nécessite l'API : `npm run api` |
| API fictive (json-server, port 3000)              | `npm run api` (données : `mock-api/db.json`)                          |
| Build rapide (vérif. de compilation)              | `npm run build:dev`                                                   |
| Build production                                  | `npm run build` (inline les Google Fonts → nécessite Internet)        |
| Tests (une passe)                                 | `npm test`                                                            |
| Formatage                                         | `npm run format` / `npm run format:check`                             |
| **Vérification complète avant de rendre la main** | `npm run verify`                                                      |

Générer avec le CLI : `npx ng g c users/mon-composant` (pas de suffixe `.component`, conforme Angular 20+).

## Structure

```
src/app/
├── app.config.ts            providePrimeNG (preset, traductions FR, couches CSS), LOCALE_ID fr-FR
├── app.routes.ts            routes lazy (loadComponent)
├── theme/                   preset Aura rouge, traductions PrimeNG
└── users/
    ├── user.model.ts        User, Address, UserDraft, helpers purs (isExpired, initials)
    ├── user.service.ts      store signals alimenté par l'API REST (HttpClient, `USERS_API_URL` = /api/users)
    ├── user-list/           p-table, filtres, sélection, ConfirmDialog, Toast
    ├── user-detail-dialog/  p-dialog lecture seule
    └── user-form-dialog/    p-dialog + Signal Forms (création / édition)
```

## Conventions Angular

- Standalone uniquement (pas de NgModule applicatif). Ne **pas** écrire `standalone: true` ni
  `changeDetection: ChangeDetectionStrategy.OnPush` : ce sont les valeurs par défaut en Angular 22.
- `inject()` plutôt que l'injection par constructeur.
- Services singletons : décorateur `@Service()` (Angular 22) plutôt que `@Injectable({ providedIn: 'root' })`.
- `input()`, `output()`, `model()` — jamais `@Input`/`@Output`.
- État local en `signal()` / `computed()` ; pas de `BehaviorSubject` pour de l'état d'UI.
- Templates : `@if` / `@for (… ; track …)` / `@switch` — jamais `*ngIf` / `*ngFor`.
- Pas d'appel de fonction coûteux dans les templates ; préférer un `computed()`.
- Formulaires : Signal Forms (`@angular/forms/signals`, stable en v22), liaison `[formField]`. Sur un nœud
  `[formField]`, ne pas lier `[invalid]` ni poser `maxlength` (erreur de compilation NG8022) : utiliser les validateurs du schéma.
- Pas de `ngClass` / `ngStyle` (liaisons `[class.x]` / `[style.x]`), pas d'import de `CommonModule`.
- `host: {}` dans le décorateur plutôt que `@HostBinding` / `@HostListener`.
- Référence officielle à jour : outil `get_best_practices` du serveur MCP `angular-cli`.
- Un composant = un dossier avec `.ts`, `.html`, `.scss` séparés. Noms de fichiers sans suffixe (`user-list.ts`).
- Membres utilisés seulement par le template : `protected`.

## Conventions PrimeNG 22 (pièges vérifiés)

- Sélecteurs de la table **en minuscules à tirets** : `<p-table-checkbox>`, `<p-table-header-checkbox>`,
  `<p-sort-icon>` (les anciennes formes camelCase `p-tableCheckbox` ne compilent plus).
- Classes sur un composant PrimeNG : utiliser `class="…"`. `styleClass` est ignoré sur plusieurs composants (ex. `p-avatar`, `p-inputicon`).
- Templates nommés : `<ng-template #header>`, `#body`, `#caption`, `#footer`, `#emptymessage`.
- `ConfirmationService` et `MessageService` sont fournis au niveau du composant (`providers`), avec `<p-confirmdialog>` et `<p-toast>` dans son template.
- Styles : utiliser les variables de design `var(--p-…)` (ex. `--p-primary-color`, `--p-text-muted-color`,
  `--p-content-border-color`). **Jamais** de couleur hexadécimale en dur ni de surcharge de classes `.p-*`.
- Changer la couleur ou les tokens : modifier `theme/aura-rouge.preset.ts` (via `definePreset`), pas le SCSS.
- **Licence** : PrimeNG 22 exige une clé PrimeUI (`providePrimeNG({ license })`). Sans clé, un bandeau
  « Invalid PrimeUI License » s'affiche : ce n'est pas un bug du code. Ne jamais écrire de clé en dur dans le dépôt.
- En cas de doute sur une API : lire `node_modules/primeng/types/primeng-<composant>.d.ts` ou utiliser le
  serveur MCP `primeng` plutôt que de se fier à la documentation de versions antérieures.

## Accessibilité et UX

- Boutons icône seuls : `[ariaLabel]` obligatoire (+ `pTooltip`).
- Chaque champ a un `<label for>` relié à `id` / `inputId`.
- Toute suppression passe par `ConfirmationService` ; tout succès est notifié par `MessageService`.
- Contraste ≥ 4.5:1 : c'est pourquoi le primaire est `red.600` et non `red.500`.

## Règles pour les agents

- Lire les fichiers concernés avant de modifier ; changements minimaux et ciblés.
- Textes UI en français ; code, noms de variables et commits en anglais.
- Ajouter ou mettre à jour un test `*.spec.ts` pour toute logique (service, helpers).
- Terminer par `npm run verify` et signaler tout échec plutôt que le masquer.
- Ne pas modifier `package-lock.json` à la main ; ne pas ajouter de dépendance sans le signaler.
- Ne pas toucher à `node_modules/`, `dist/`, `.angular/`.
