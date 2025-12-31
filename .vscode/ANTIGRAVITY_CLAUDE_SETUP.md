# Configuration Claude API pour Google Antigravity

Ce guide vous aide à configurer votre clé API Claude pour utiliser MCP dans Google Antigravity IDE.

## 📋 Prérequis

Pour utiliser Claude dans Antigravity, vous avez besoin d'une des options suivantes :
- **Clé API Anthropic** (recommandé pour MCP)
- Abonnement Claude Pro
- Abonnement Claude Max

## 🔑 Étape 1 : Obtenir votre clé API Anthropic

1. Allez sur [console.anthropic.com](https://console.anthropic.com/)
2. Connectez-vous ou créez un compte
3. Naviguez vers **API Keys** dans le menu
4. Cliquez sur **Create Key**
5. Donnez un nom à votre clé (ex: "Antigravity MCP")
6. Copiez la clé (elle commence par `sk-ant-api...`)

⚠️ **Important** : Sauvegardez cette clé en lieu sûr, elle ne sera affichée qu'une seule fois !

## ⚙️ Étape 2 : Configurer la clé API dans Antigravity

### Option A : Via la commande `/login` (Recommandé)

Dans Google Antigravity :

1. Ouvrez le terminal intégré (`Ctrl+\``)
2. Tapez : `/login`
3. Suivez les instructions pour entrer votre clé API
4. Antigravity sauvegardera automatiquement vos identifiants

### Option B : Via variables d'environnement

Dans votre terminal Antigravity :

```bash
# Linux/Mac
export ANTHROPIC_API_KEY="sk-ant-api-votre-cle-ici"

# Pour rendre permanent, ajoutez à ~/.bashrc ou ~/.zshrc
echo 'export ANTHROPIC_API_KEY="sk-ant-api-votre-cle-ici"' >> ~/.bashrc
source ~/.bashrc
```

```powershell
# Windows (PowerShell)
$env:ANTHROPIC_API_KEY = "sk-ant-api-votre-cle-ici"

# Pour rendre permanent
[System.Environment]::SetEnvironmentVariable('ANTHROPIC_API_KEY', 'sk-ant-api-votre-cle-ici', 'User')
```

### Option C : Fichier de configuration global

Créez ou éditez `~/.claude.json` :

```json
{
  "anthropic_api_key": "sk-ant-api-votre-cle-ici"
}
```

## 🔗 Étape 3 : Configurer MCP avec authentification

Si vous utilisez des serveurs MCP distants qui nécessitent une authentification, mettez à jour `.vscode/mcp.json` :

```json
{
  "servers": {
    "google-workspace": {
      "command": "uvx",
      "args": [
        "workspace-mcp",
        "--tool-tier",
        "core"
      ],
      "env": {
        "ANTHROPIC_API_KEY": "${ANTHROPIC_API_KEY}"
      }
    }
  }
}
```

Ou pour un serveur MCP distant avec OAuth :

```json
{
  "servers": {
    "remote-mcp": {
      "transport": "http",
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${AUTH_TOKEN}"
      }
    }
  }
}
```

## ✅ Étape 4 : Vérifier la configuration

Dans Antigravity :

1. Redémarrez l'IDE
2. Ouvrez le panneau MCP (icône dans la barre latérale)
3. Vérifiez que les serveurs MCP apparaissent comme "Connected"
4. Testez avec une commande simple : "Quel est mon quota API ?"

## 🔧 Dépannage

### Erreur : "Invalid API key"

✓ Vérifiez que votre clé commence par `sk-ant-api`
✓ Assurez-vous qu'il n'y a pas d'espaces avant/après la clé
✓ Vérifiez que la clé n'a pas expiré sur console.anthropic.com
✓ Essayez de régénérer une nouvelle clé

### Erreur : "Please run /login"

✓ Exécutez `/login` dans le terminal Antigravity
✓ Ou configurez la variable d'environnement `ANTHROPIC_API_KEY`
✓ Redémarrez Antigravity après configuration

### MCP ne se connecte pas

✓ Vérifiez que Python 3.10+ est installé : `python3 --version`
✓ Vérifiez que uvx fonctionne : `uvx --version`
✓ Consultez les logs MCP : View → Output → MCP Servers
✓ Redémarrez le serveur MCP depuis le panneau MCP

## 📊 Quota et limites API

Vérifiez votre utilisation sur [console.anthropic.com](https://console.anthropic.com/):
- **Claude Sonnet 4.5** : Meilleur rapport qualité/prix
- **Claude Opus 4.5** : Performance maximale
- **Free tier** : Quota limité, passez à un plan payant si nécessaire

## 🔐 Sécurité

⚠️ **Ne commitez JAMAIS votre clé API dans Git !**

Ajoutez à `.gitignore` :
```
.env
.claude.json
**/secrets/
```

## 📚 Ressources

- [Documentation Antigravity](https://antigravity.google/)
- [Documentation Claude API](https://docs.anthropic.com/)
- [Documentation MCP](https://code.claude.com/docs/en/mcp)
- [Google Antigravity Blog](https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/)

## 💡 Astuce Pro

Pour basculer entre différents modèles Claude dans Antigravity :
1. Ouvrez les paramètres (Cmd/Ctrl + ,)
2. Recherchez "AI Model"
3. Sélectionnez votre modèle préféré :
   - Claude Sonnet 4.5 (rapide, économique)
   - Claude Opus 4.5 (puissant, précis)
