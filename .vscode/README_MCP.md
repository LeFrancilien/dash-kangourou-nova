# Configuration MCP pour Google Antigravity

Ce dossier contient toute la configuration MCP (Model Context Protocol) pour ce projet.

## 📋 Fichiers de configuration

### `mcp.json`
Le fichier principal de configuration MCP contenant tous les serveurs configurés :
- **shadcn** : Composants UI
- **google-workspace** : Gmail, Drive, Calendar, Tasks, Search
- **github** : Repositories, Issues, Pull Requests, Actions

## 📚 Guides de configuration

### 1️⃣ **ANTIGRAVITY_CLAUDE_SETUP.md**
Guide principal pour configurer Claude API dans Google Antigravity IDE.

**Contenu** :
- Obtention de la clé API Anthropic
- Configuration via `/login`
- Variables d'environnement
- Dépannage des erreurs d'authentification

**🎯 À lire en premier !**

### 2️⃣ **MCP_GOOGLE_SETUP.md**
Configuration du serveur MCP Google Workspace.

**Contenu** :
- Configuration OAuth pour Google
- Tiers d'outils disponibles (core, extended, complete)
- Exemples d'utilisation pour Gmail, Drive, Calendar, Tasks
- Section spécifique pour Antigravity

**Services disponibles** :
- 📧 Gmail
- 📁 Google Drive
- 📅 Google Calendar
- ✅ Google Tasks
- 🔍 Google Search

### 3️⃣ **GITHUB_MCP_SETUP.md**
Configuration du serveur MCP GitHub (sans Docker).

**Contenu** :
- Solution au problème Docker
- Obtention du GitHub Personal Access Token
- Configuration avec `npx`
- Alternative avec serveur distant OAuth
- Exemples de commandes

**Fonctionnalités** :
- 📂 Gestion des repositories
- 🔍 Recherche de code
- 📝 Issues et Pull Requests
- 📊 GitHub Actions
- 👥 Gestion des collaborateurs

## 🚀 Démarrage rapide

### Prérequis
1. **Claude API** : Clé API Anthropic configurée
2. **Google Workspace** : Authentification OAuth (automatique)
3. **GitHub** : Personal Access Token

### Installation en 3 étapes

#### 1️⃣ Configurer Claude API
```bash
# Dans Antigravity
/login
# Puis choisir "Anthropic Console" et suivre les instructions
```

#### 2️⃣ Configurer GitHub Token
```bash
# Créer le token sur https://github.com/settings/tokens
# Puis définir la variable d'environnement
export GITHUB_TOKEN="votre_token_ici"
```

#### 3️⃣ Redémarrer Antigravity
```
Cmd/Ctrl + Shift + P → Reload Window
```

## ✅ Vérification

Ouvrez le panneau MCP dans Antigravity et vérifiez que tous les serveurs sont **Connected** :

- ✅ shadcn
- ✅ google-workspace
- ✅ github

## 🔧 Dépannage

### Problème : "Invalid API key"
→ Consultez `ANTIGRAVITY_CLAUDE_SETUP.md`

### Problème : Erreur Docker pour GitHub
→ Consultez `GITHUB_MCP_SETUP.md` (configuration npx)

### Problème : Google Workspace ne se connecte pas
→ Consultez `MCP_GOOGLE_SETUP.md`

## 💡 Exemples d'utilisation

Une fois configuré, vous pouvez demander à Claude :

### Gmail
```
"Lis mes 5 derniers emails non lus"
"Envoie un email à john@example.com"
```

### Google Drive
```
"Liste mes fichiers Drive de cette semaine"
"Crée un nouveau Google Doc appelé 'Notes réunion'"
```

### Google Calendar
```
"Quels sont mes événements aujourd'hui ?"
"Crée un événement demain 14h : réunion équipe"
```

### GitHub
```
"Liste mes repos GitHub"
"Crée une issue sur dash-kangourou-nova"
"Montre-moi les PRs ouvertes"
```

## 🔐 Sécurité

**⚠️ IMPORTANT** : Ne commitez jamais vos tokens ou clés API !

Le fichier `.gitignore` doit contenir :
```
.env
.env.local
**/.claude.json
**/secrets/
```

### Bonnes pratiques
1. Utilisez des variables d'environnement
2. Tokens avec durée limitée (90 jours)
3. Permissions minimales nécessaires
4. Rotation régulière des tokens

## 📊 Architecture

```
.vscode/
├── mcp.json                      # Configuration principale
├── README_MCP.md                 # Ce fichier
├── ANTIGRAVITY_CLAUDE_SETUP.md   # Setup Claude API
├── MCP_GOOGLE_SETUP.md           # Setup Google Workspace
└── GITHUB_MCP_SETUP.md           # Setup GitHub
```

## 📚 Ressources externes

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Google Antigravity](https://antigravity.google/)
- [Claude API](https://docs.anthropic.com/)
- [GitHub MCP Server](https://github.com/github/github-mcp-server)
- [Google Workspace MCP](https://workspacemcp.com)

## 🆘 Support

En cas de problème :
1. Consultez les guides spécifiques dans ce dossier
2. Vérifiez les logs MCP : View → Output → MCP Servers
3. Redémarrez Antigravity
4. Vérifiez que les prérequis sont installés :
   - Python 3.10+ : `python3 --version`
   - uvx : `uvx --version`
   - npx : `npx --version`

## 🎉 Félicitations !

Vous avez maintenant un environnement de développement puissant avec :
- 🤖 Claude AI (Sonnet 4.5 / Opus 4.5)
- 📧 Intégration Google Workspace
- 🐙 Intégration GitHub complète
- 🎨 Composants UI Shadcn

Bon développement ! 🚀
