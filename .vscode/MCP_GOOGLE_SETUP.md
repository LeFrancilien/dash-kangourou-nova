# Configuration MCP Google Workspace

Ce projet utilise le serveur MCP Google Workspace pour intégrer Gmail, Google Calendar, Drive, Docs, Sheets, et plus encore avec Claude Code.

## Configuration actuelle

Le serveur MCP est configuré dans `.vscode/mcp.json` avec le tier **core** qui inclut :
- **Gmail** : Recherche, lecture, création et modifications de base
- **Drive** : Recherche, lecture, création et gestion de fichiers
- **Calendar** : Recherche, lecture, création et gestion d'événements
- **Tasks** : Gestion des tâches Google
- **Search** : Recherche dans Google Workspace

## Authentification OAuth

Pour utiliser ce serveur MCP, vous devez configurer l'authentification OAuth :

### Option 1 : Configuration automatique (Recommandé)
1. Redémarrez Claude Code
2. Le serveur MCP Google Workspace vous guidera à travers le processus OAuth
3. Suivez les instructions pour autoriser l'accès à votre compte Google

### Option 2 : Configuration manuelle
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez les APIs Google Workspace nécessaires :
   - Gmail API
   - Google Drive API
   - Google Calendar API
   - Google Tasks API
4. Créez des identifiants OAuth 2.0
5. Téléchargez le fichier de credentials JSON
6. Configurez les variables d'environnement si nécessaire

## Tiers d'outils disponibles

Vous pouvez modifier le tier dans `.vscode/mcp.json` :

```json
"google-workspace": {
  "command": "uvx",
  "args": [
    "workspace-mcp",
    "--tool-tier",
    "core"  // Changez en "extended" ou "complete" pour plus de fonctionnalités
  ]
}
```

### Tiers disponibles :
- **core** : Outils essentiels (recommandé pour usage léger)
- **extended** : Core + fonctionnalités supplémentaires
- **complete** : Tous les outils disponibles

### Ou sélectionner des services spécifiques :

```json
"google-workspace": {
  "command": "uvx",
  "args": [
    "workspace-mcp",
    "--tools",
    "gmail",
    "drive",
    "calendar"
  ]
}
```

## Utilisation

Une fois configuré, vous pouvez utiliser Claude Code pour :

- 📧 **Gmail** : "Lis mes derniers emails non lus"
- 📁 **Drive** : "Trouve tous les documents créés cette semaine"
- 📅 **Calendar** : "Crée un événement demain à 14h pour la réunion d'équipe"
- ✅ **Tasks** : "Ajoute 'Finir le rapport' à ma liste de tâches"

## Ressources

- [Documentation Google Workspace MCP](https://github.com/taylorwilsdon/google_workspace_mcp)
- [Site officiel](https://workspacemcp.com)

## Dépannage

Si vous rencontrez des problèmes :
1. Vérifiez que Python 3.10+ est installé : `python3 --version`
2. Vérifiez que uvx est installé : `uvx --version`
3. Redémarrez Claude Code
4. Consultez les logs du serveur MCP dans les paramètres de Claude Code
