@AGENTS.md

# Spécifique Claude Code

- Serveurs MCP du projet (`.mcp.json`) : `angular-cli` (bonnes pratiques et docs Angular, `ng` en local) et
  `primeng` (API des composants PrimeNG 22). Les consulter avant d'utiliser une API dont tu n'es pas sûr.
- Boucle de travail : lire → modifier → `npm run build:dev` → `npm test` → `npm run verify` avant de conclure.
- Pour une tâche de plus de 3 fichiers, proposer un plan court avant de modifier.
- Environnement Windows : utiliser des chemins relatifs au projet ; les scripts npm sont multiplateformes.
- `.claude/settings.json` est partagé avec l'équipe ; tes préférences personnelles vont dans
  `.claude/settings.local.json` (ignoré par git).
