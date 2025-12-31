# Guide Antigravity - Gestion des serveurs MCP

## 🎯 Important : Antigravity vs Claude Code

⚠️ **Antigravity n'utilise PAS le fichier `.vscode/mcp.json`** !

Antigravity gère les serveurs MCP via son interface graphique intégrée.

## 📋 Ouvrir le panneau MCP

1. Cliquez sur l'icône MCP dans la barre latérale (ou)
2. Menu : View → MCP → Manage MCP Servers (ou)
3. Raccourci : `Cmd/Ctrl + Shift + M`

## 🏪 Ajouter des serveurs via MCP Store

### Méthode 1 : Via MCP Store (Recommandé)

1. Dans le panneau "Manage MCP servers"
2. Cliquez sur l'onglet **"MCP Store"** (à droite)
3. Recherchez les serveurs :
   - Tapez "Google Workspace" dans la barre de recherche
   - Tapez "GitHub"
   - Tapez "Shadcn"
4. Cliquez sur **"Install"** ou **"Add"** pour chaque serveur

### Méthode 2 : Ajout manuel

Si les serveurs ne sont pas dans le store :

1. Dans le panneau "Manage MCP servers"
2. Cliquez sur le bouton **"+"** ou **"Add Server"**
3. Remplissez les informations :

#### Google Workspace
```
Name: google-workspace
Command: uvx
Arguments: workspace-mcp --tool-tier core
```

#### GitHub
```
Name: github
Command: npx
Arguments: -y @modelcontextprotocol/server-github
Environment:
  GITHUB_PERSONAL_ACCESS_TOKEN: votre_token_ici
```

#### Shadcn
```
Name: shadcn
Command: npx
Arguments: shadcn@latest mcp
```

## 🔧 Configurer un serveur existant

1. Dans la liste des serveurs, cliquez sur le serveur
2. Cliquez sur **"Configure"** ou l'icône ⚙️
3. Modifiez les paramètres
4. Cliquez sur **"Save"**

## ✅ Activer/Désactiver un serveur

1. Trouvez le serveur dans la liste
2. Cliquez sur le bouton à bascule (toggle) à droite
3. Le serveur devient "Enabled" ou "Disabled"

## 🔍 Vérifier qu'un serveur fonctionne

Un serveur correctement configuré affiche :
- ✅ **Enabled** - Le serveur est activé
- 🟢 **Connected** - Le serveur est connecté
- 📊 **XX/XX tools** - Nombre d'outils disponibles

Exemple dans votre capture :
- GitHub : 40/40 tools ✅

## 🐛 Dépannage

### Serveur "Disabled"
→ Cliquez sur le toggle pour l'activer

### Serveur "Enabled" mais pas de tools
→ Vérifiez les logs (cliquez sur le serveur puis "View Logs")

### Erreur de connexion
→ Vérifiez les credentials (tokens, API keys)

### Serveur n'apparaît pas
→ Redémarrez Antigravity : Cmd/Ctrl + Shift + P → "Reload Window"

## 📊 Serveurs visibles dans votre Antigravity

D'après votre capture d'écran, vous avez déjà :
- ✅ Firebase
- ✅ GitHub (40/40 tools)
- ✅ GitKraken
- ✅ Netlify
- ✅ Drizzly Ask
- ✅ Supabase

## 🎯 Serveurs à ajouter

Pour compléter votre configuration, ajoutez :
- ⬜ **Google Workspace** - Gmail, Drive, Calendar, Tasks
- ⬜ **Shadcn** - Composants UI (si vous l'utilisez)

## 🔐 Configuration des tokens

### Pour GitHub

1. Créez un nouveau token sur [github.com/settings/tokens](https://github.com/settings/tokens)
2. Permissions : `repo`, `read:user`, `user:email`, `read:org`
3. Dans Antigravity :
   - Ouvrez le serveur GitHub
   - Cliquez sur "Configure"
   - Ajoutez le token dans "Environment Variables"
   - Sauvegardez

### Pour Google Workspace

1. Le serveur vous guidera pour l'authentification OAuth
2. Suivez les instructions à l'écran
3. Autorisez l'accès à votre compte Google

## 💡 Astuces

### Voir tous les outils disponibles
1. Cliquez sur un serveur
2. Développez la liste des outils
3. Vous verrez toutes les fonctions disponibles

### Filtrer les serveurs
Utilisez la barre de recherche en haut du panneau MCP

### Rafraîchir la liste
Cliquez sur le bouton "Refresh" 🔄 en haut à droite

## 📚 Ressources

- [Documentation MCP](https://modelcontextprotocol.io/)
- [Google Workspace MCP](https://github.com/taylorwilsdon/google_workspace_mcp)
- [GitHub MCP](https://github.com/github/github-mcp-server)

## 🆘 Besoin d'aide ?

1. Cliquez sur un serveur problématique
2. Cliquez sur "View Logs" pour voir les erreurs
3. Consultez les guides spécifiques :
   - `.vscode/GITHUB_MCP_SETUP.md`
   - `.vscode/MCP_GOOGLE_SETUP.md`
   - `.vscode/SECURITE_TOKEN.md`
