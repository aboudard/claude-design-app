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

## Branche à jour avant fusion

Une PR ne peut être fusionnée que si sa branche contient les derniers commits de `main`, **même sans conflit**.
Avant de demander la fusion : `git fetch origin && git rebase origin/main` (ou `git merge origin/main`),
relancer `npm run verify`, puis pousser (`git push --force-with-lease` après un rebase).
Sur GitHub, le bouton « Update branch » fait la même chose. Cette règle est aussi imposée par la protection
de la branche `main` (« Require branches to be up to date before merging »).
