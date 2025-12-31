# Configuration MCP GitHub pour Antigravity

Ce guide vous aide à configurer le serveur MCP GitHub dans Google Antigravity **sans Docker**.

## 🎯 Problème résolu

❌ **Erreur Docker** : "docker: failed to connect to the docker API"
✅ **Solution** : Configuration avec `npx` (pas besoin de Docker)

## 🔑 Étape 1 : Obtenir votre GitHub Personal Access Token

Vous avez déjà un token dans votre capture d'écran, mais voici comment en créer un nouveau si nécessaire :

1. Allez sur [github.com/settings/tokens](https://github.com/settings/tokens)
2. Cliquez sur **"Generate new token"** → **"Generate new token (classic)"**
3. Donnez un nom : `Antigravity MCP`
4. Sélectionnez la durée : 90 jours ou "No expiration"
5. **Permissions requises** (cochez ces scopes) :
   - ✅ `repo` (Full control of private repositories)
   - ✅ `read:org` (Read org and team membership)
   - ✅ `read:user` (Read user profile data)
   - ✅ `user:email` (Access user email addresses)
6. Cliquez sur **"Generate token"**
7. **Copiez le token** (commence par `ghp_` ou `github_pat_`)

⚠️ **Important** : Sauvegardez ce token en lieu sûr !

## ⚙️ Étape 2 : Configurer le token dans Antigravity

### Option A : Variable d'environnement (Recommandé)

Dans le terminal Antigravity :

```bash
# Linux/Mac
export GITHUB_TOKEN="votre_token_ici"

# Pour rendre permanent
echo 'export GITHUB_TOKEN="votre_token_ici"' >> ~/.bashrc
source ~/.bashrc
```

```powershell
# Windows (PowerShell)
$env:GITHUB_TOKEN = "votre_token_ici"

# Pour rendre permanent
[System.Environment]::SetEnvironmentVariable('GITHUB_TOKEN', 'votre_token_ici', 'User')
```

### Option B : Directement dans mcp.json

Si vous préférez mettre le token directement (moins sécurisé) :

```json
{
  "servers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "votre_token_ici"
      }
    }
  }
}
```

⚠️ **Attention** : Ne commitez jamais ce fichier avec votre token !

## 📝 Configuration actuelle

Le fichier `.vscode/mcp.json` a été configuré avec :

```json
"github": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
  }
}
```

Cette configuration :
- ✅ **Pas besoin de Docker** (utilise `npx`)
- ✅ Utilise la variable d'environnement `GITHUB_TOKEN`
- ✅ Télécharge automatiquement le serveur MCP officiel de GitHub

## 🚀 Étape 3 : Tester la configuration

1. **Redémarrez Antigravity** complètement
2. Ouvrez le panneau **MCP** dans la barre latérale
3. Vérifiez que le serveur **GitHub** apparaît comme **"Connected"**
4. Testez avec une commande :
   ```
   Liste mes repositories GitHub
   ```
   ou
   ```
   Crée une issue sur mon repo dash-kangourou-nova
   ```

## 🔧 Alternative : Serveur MCP GitHub distant (OAuth)

Si vous préférez éviter la gestion du token, utilisez le serveur distant de GitHub :

```json
"github-remote": {
  "type": "http",
  "url": "https://api.githubcopilot.com/mcp/",
  "oauth": true
}
```

**Avantages** :
- ✅ Pas de token à gérer
- ✅ Authentification OAuth automatique
- ✅ Pas d'installation locale
- ✅ Toujours à jour

**Note** : Cette option nécessite VS Code 1.101+ ou Antigravity avec support OAuth.

## 🛠️ Fonctionnalités disponibles

Avec le serveur MCP GitHub, vous pouvez :

- 📂 **Repositories** : Lister, créer, cloner des repos
- 🔍 **Recherche** : Chercher du code, des issues, des PRs
- 📝 **Issues** : Créer, lire, modifier des issues
- 🔀 **Pull Requests** : Créer, reviewer, merger des PRs
- 📊 **Actions** : Voir les workflows, les runs
- 👥 **Collaborateurs** : Gérer les accès, les équipes
- 🏷️ **Labels, Milestones** : Organiser vos projets

## 🔐 Sécurité

### ⚠️ Ne commitez JAMAIS votre token !

Ajoutez à `.gitignore` :
```
.env
.env.local
**/.mcp.json
**/mcp.json
**/secrets/
```

### ✅ Bonnes pratiques

1. **Utilisez des variables d'environnement** pour les tokens
2. **Durée limitée** : Préférez des tokens qui expirent (90 jours)
3. **Permissions minimales** : Ne donnez que les scopes nécessaires
4. **Rotation régulière** : Renouvelez vos tokens tous les 3-6 mois
5. **Token par usage** : Créez des tokens différents pour différents outils

## 🔍 Dépannage

### Erreur : "docker: failed to connect to the docker API"
✅ **Résolu** : La configuration avec `npx` n'utilise pas Docker

### Erreur : "GITHUB_PERSONAL_ACCESS_TOKEN not found"
✓ Vérifiez que la variable d'environnement `GITHUB_TOKEN` est définie
✓ Redémarrez le terminal après avoir défini la variable
✓ Vérifiez avec : `echo $GITHUB_TOKEN` (Linux/Mac) ou `$env:GITHUB_TOKEN` (Windows)

### Erreur : "Unauthorized" ou "401"
✓ Vérifiez que votre token est valide sur [github.com/settings/tokens](https://github.com/settings/tokens)
✓ Assurez-vous d'avoir les bonnes permissions (scopes)
✓ Vérifiez que le token n'a pas expiré

### Le serveur n'apparaît pas dans le panneau MCP
✓ Vérifiez que `npx` est installé : `npx --version`
✓ Vérifiez les logs MCP : View → Output → MCP Servers
✓ Redémarrez Antigravity complètement

### Erreur : "Cannot find module"
✓ Vérifiez votre connexion internet
✓ Essayez de télécharger manuellement : `npx -y @modelcontextprotocol/server-github --help`
✓ Videz le cache npm : `npm cache clean --force`

## 📊 Quota et limites

GitHub API a des limites de taux :
- **Authentifié** : 5000 requêtes/heure
- **Non authentifié** : 60 requêtes/heure

Vérifiez votre quota : `curl -H "Authorization: token VOTRE_TOKEN" https://api.github.com/rate_limit`

## 📚 Ressources

- [GitHub MCP Server officiel](https://github.com/github/github-mcp-server)
- [Documentation GitHub API](https://docs.github.com/en/rest)
- [Guide pratique GitHub MCP](https://github.blog/ai-and-ml/generative-ai/a-practical-guide-on-how-to-use-the-github-mcp-server/)
- [Configuration MCP dans VS Code](https://code.visualstudio.com/docs/copilot/customization/mcp-servers)

## 💡 Exemples de commandes

Une fois configuré, essayez :

### Repositories
```
"Liste tous mes repos publics"
"Crée un nouveau repo appelé 'test-mcp'"
"Clone le repo username/repo-name"
```

### Issues
```
"Crée une issue 'Bug: Login ne fonctionne pas' dans dash-kangourou-nova"
"Liste les issues ouvertes avec le label 'bug'"
"Ferme l'issue #42"
```

### Pull Requests
```
"Crée une PR de la branche feature vers main"
"Liste les PRs en attente de review"
"Merge la PR #15"
```

### Recherche
```
"Cherche 'TODO' dans mon repo"
"Trouve les fichiers TypeScript modifiés cette semaine"
"Recherche les issues assignées à @moi"
```

## 🎉 C'est prêt !

Votre serveur MCP GitHub est maintenant configuré et prêt à l'emploi dans Antigravity, **sans Docker** ! 🚀
