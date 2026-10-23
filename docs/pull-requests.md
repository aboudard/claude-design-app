# Pull requests — labels

Toute nouvelle PR doit recevoir **au moins un label** adapté à son contenu, dès sa création.

| Label           | Quand l'utiliser                        |
| --------------- | --------------------------------------- |
| `bug`           | Correction d'un comportement incorrect  |
| `enhancement`   | Nouvelle fonctionnalité ou amélioration |
| `documentation` | Changement limité à la documentation    |
| `accessibility` | Amélioration de l'accessibilité         |

- Choisir parmi les labels existants du dépôt (`gh label list`) ; n'en créer un nouveau que si aucun ne convient.
- Avec la CLI : `gh pr create --label bug …` (ou `gh pr edit <n> --label bug` après coup).
- Relier la PR à son issue avec `Closes #N` dans la description.
