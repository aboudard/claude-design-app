# Historique de conception avec Claude (Cowork)

> Synthèse de la session de travail menée avec Claude (Anthropic) du 16 au 23 octobre 2026, qui a produit ce dépôt.
> À utiliser comme contexte par un assistant IA (GitHub Copilot, Claude Code…) **en complément de `AGENTS.md`**,
> qui reste la référence pour les conventions. Ce fichier raconte le _pourquoi_ ; `AGENTS.md` dit le _comment_.

## 1. Demandes de l'utilisateur (textes d'origine)

1. **Maquette** — « Je voudrais un écran de gestion d'utilisateurs basé sur la librairie PrimeNg, utilisant Angular,
   dans sa dernière version. Je veux le design du thème Aura avec comme couleur principale le rouge. Les utilisateurs
   ont des caractéristiques classiques : nom, email, actif/inactif, date de validité, ID. La liste contient des boutons
   d'action en fin de ligne, pour visualiser, éditer ou supprimer, la possibilité de cocher plusieurs lignes ou toutes
   les lignes, pour effectuer des actions en masse comme supprimer. La visualisation d'un utilisateur lance une Dialog
   avec quelques informations supplémentaires comme l'adresse et les qualifications sous forme de chips. »
2. **Code** — « Je veux bien voir tous ces éléments techniques. » → projet Angular complet.
3. **Analyse + config IA** — « Peux-tu l'analyser, vérifier que tout correspond à la demande initiale, et initialiser
   et optimiser les fichiers de configuration comme claude.md ou autres fichiers nécessaires au bon fonctionnement des
   interactions IA ? »
4. **Git** — initialiser le dépôt, le publier sur `github.com/aboudard/claude-design-app` (public), placer les fichiers
   de configuration IA aux bons endroits.

## 2. Déroulé et résultats

### Étape 1 — Maquette interactive

Maquette cliquable réalisée dans un canevas Claude Design (hors dépôt) : liste, sélection, suppression en masse avec
confirmation, dialog de détail, formulaire, recherche, filtre de statut, toasts. Elle a servi de référence visuelle.

### Étape 2 — Projet Angular

- Versions vérifiées sur npm le 16/10/2026 : **Angular 22.2**, **PrimeNG 22.1.2**, **@primeuix/themes 3.0.1**,
  **primeicons 8**, TypeScript 6, Vitest 5. Projet généré avec Angular CLI 22 (zoneless, sans zone.js).
- Compilé et testé dans un navigateur headless (captures de la liste, de la sélection, du détail et de l'édition).
- Corrections faites pendant la construction (pièges PrimeNG 22, reportés dans `AGENTS.md`) :
  - `p-tableCheckbox` / `p-tableHeaderCheckbox` / `p-sortIcon` → `p-table-checkbox` / `p-table-header-checkbox` / `p-sort-icon` ;
  - `styleClass` ignoré sur `p-avatar` et `p-inputicon` → utiliser `class`.

### Étape 3 — Audit et configuration IA (23/10/2026)

- Le dossier local `C:\tests\ng\ng22\claude-design-app` était identique au projet livré. Conformité à la demande : OK.
- Alignement sur les bonnes pratiques officielles Angular 22 (outil `get_best_practices` du MCP `angular-cli`) :
  - suppression de `changeDetection: OnPush` (défaut en v22) ;
  - `@Service()` au lieu de `@Injectable({ providedIn: 'root' })` pour `UserService` ;
  - `strict` et `strictTemplates` explicites dans `tsconfig.json`.
- Ajouts : 2 fichiers de tests (9 tests), scripts `build:dev`, `format`, `format:check`, `verify`, formatage Prettier
  de tout le code.
- Fichiers IA créés : `AGENTS.md`, `CLAUDE.md`, `.claude/settings.json`, `.mcp.json`, `.vscode/mcp.json`,
  `.vscode/settings.json`, `.vscode/extensions.json`. Les deux serveurs MCP (`angular-cli`, `@primeng/mcp`) ont été
  testés et démarrent.
- Les fichiers de `.claude/`, `.vscode/` et `.mcp.json` ont été copiés par l'utilisateur : l'outil distant de Claude
  n'est pas autorisé à écrire ces emplacements sensibles (permissions d'agents, lancement de programmes).

### Étape 4 — Git

- `git init -b main`, `core.filemode=false` (le partage de dossier marquait tout comme exécutable),
  `.gitattributes` (`eol=lf`), identité locale `Alain Boudard <coco.boudard@gmail.com>`.
- `/Claude outputs/` ajouté au `.gitignore`.
- Commit initial (44 fichiers), `origin` = `https://github.com/aboudard/claude-design-app.git`.
  Le push est fait par l'utilisateur depuis Windows (identifiants GitHub locaux).

## 3. Décisions et leurs raisons

| Décision | Raison |
| --- | --- |
| Primaire `red.600` (#dc2626) et non `red.500` | Blanc sur red-500 = 3,8:1 (échec WCAG AA) ; sur red-600 = 4,8:1. Réversible dans `theme/aura-rouge.preset.ts`. |
| Police Inter | Police de la démo officielle PrimeNG / Aura. |
| 3 composants (liste, détail, formulaire) + 1 service | Responsabilités séparées ; le service est le point de branchement futur de l'API. |
| Reactive Forms typés | Choix initial ; Signal Forms (stable en v22) recommandé pour les **nouveaux** formulaires. |
| Store en mémoire (signals) | Pas d'API fournie ; 10 utilisateurs fictifs (`MOCK_USERS`). |
| `ConfirmationService` / `MessageService` au niveau du composant | Isolation ; pas de dépendance globale. |
| `AGENTS.md` + `CLAUDE.md` qui l'importe | Une seule source de vérité pour tous les assistants (Copilot lit `AGENTS.md`). |
| `.mcp.json` avec `cmd /c npx` pour PrimeNG | Requis sous Windows ; variante macOS/Linux documentée dans le README. |

## 4. Points ouverts

- **Licence PrimeNG 22** : clé PrimeUI obligatoire depuis la v22 (sinon bandeau « Invalid PrimeUI License »).
  Sopra Steria n'est pas éligible à la licence Community → licence commerciale, ou repli sur PrimeNG 21 / Angular 21.
  Clé à fournir via `providePrimeNG({ license })`, jamais commitée (dépôt **public**).
- **Sélection masquée par un filtre** : une ligne cochée puis masquée par la recherche reste sélectionnée et serait
  supprimée en masse (le nombre est affiché dans la confirmation). Option : vider la sélection quand le filtre change.
- **Migration Signal Forms** du formulaire `user-form-dialog` (optionnelle).
- **Branchement API REST** : remplacer le corps des méthodes de `UserService` (HttpClient ou `httpResource`).
- Export CSV : la date de validité est exportée au format brut de `Date`.

## 5. Pour reprendre avec un assistant

1. Lire `AGENTS.md` (conventions, pièges PrimeNG 22, commandes).
2. Lancer `npm install` puis `npm run verify` pour vérifier l'état de départ.
3. Choisir un point ouvert de la section 4 et terminer chaque modification par `npm run verify`.
