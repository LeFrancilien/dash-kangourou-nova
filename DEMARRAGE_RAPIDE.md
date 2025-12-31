# 🚀 Démarrage Rapide - Configuration MCP pour Antigravity

## ⚡ Configuration en 3 minutes

### 1️⃣ Charger le token GitHub (MAINTENANT)

Votre token est déjà configuré dans `.env.local`. Chargez-le :

```bash
# Dans le terminal Antigravity
source load-env.sh
```

Vous devriez voir :
```
🔑 Chargement des variables d'environnement depuis .env.local...
✅ Variables chargées :
   - GITHUB_TOKEN: github_pat_11AKO7U3...
```

### 2️⃣ Redémarrer Antigravity

1. Appuyez sur `Cmd/Ctrl + Shift + P`
2. Tapez "Reload Window"
3. Appuyez sur Entrée

### 3️⃣ Vérifier la connexion

1. Ouvrez le **panneau MCP** (icône dans la barre latérale)
2. Vérifiez que les 3 serveurs sont **Connected** :
   - ✅ shadcn
   - ✅ google-workspace
   - ✅ github

### 4️⃣ Tester

Testez avec cette commande :
```
"Liste mes repositories GitHub"
```

## 🚨 IMPORTANT - Sécurité

### ⚠️ Action URGENTE requise

Votre token GitHub a été exposé dans une conversation. Vous DEVEZ :

1. **Maintenant** : Utiliser le token actuel pour tester
2. **Après les tests** : Révoquer ce token et en créer un nouveau

### 📋 Guide complet de sécurité

👉 **Lisez [.vscode/SECURITE_TOKEN.md](.vscode/SECURITE_TOKEN.md)**

Ce guide contient :
- Comment révoquer le token exposé
- Comment créer un nouveau token sécurisé
- Bonnes pratiques de sécurité
- Que faire en cas de compromission

## ✅ Checklist de démarrage

- [ ] `source load-env.sh` exécuté
- [ ] Antigravity redémarré
- [ ] Les 3 serveurs MCP sont "Connected"
- [ ] Test réussi : "Liste mes repos GitHub"
- [ ] **Lu le guide de sécurité** : `.vscode/SECURITE_TOKEN.md`
- [ ] **Planifié** : Révoquer le token exposé après les tests

## 🎯 Prochaines étapes après configuration

### Révoquer et créer un nouveau token (À FAIRE AUJOURD'HUI)

1. Allez sur [github.com/settings/tokens](https://github.com/settings/tokens)
2. **Révoquez** le token actuel
3. **Créez** un nouveau token avec les mêmes permissions
4. Mettez à jour `.env.local` avec le nouveau token
5. Exécutez à nouveau `source load-env.sh`
6. Redémarrez Antigravity

## 📚 Documentation complète

### Guides disponibles

| Fichier | Description |
|---------|-------------|
| `.vscode/README_MCP.md` | Hub central de documentation MCP |
| `.vscode/ANTIGRAVITY_CLAUDE_SETUP.md` | Configuration Claude API |
| `.vscode/MCP_GOOGLE_SETUP.md` | Configuration Google Workspace |
| `.vscode/GITHUB_MCP_SETUP.md` | Configuration GitHub MCP |
| `.vscode/SECURITE_TOKEN.md` | **Guide de sécurité - À LIRE !** |

### Fichiers de configuration

| Fichier | Description | Git |
|---------|-------------|-----|
| `.vscode/mcp.json` | Configuration des serveurs MCP | ✅ Commité |
| `.env.local` | **Token GitHub (SECRET)** | ❌ Ignoré |
| `load-env.sh` | Script de chargement des variables | ✅ Commité |

## 🔧 Dépannage rapide

### Problème : GitHub MCP "Disabled" ou erreur Docker

✅ **Solution appliquée** : Configuration avec `npx` (pas de Docker requis)

### Problème : "GITHUB_PERSONAL_ACCESS_TOKEN not found"

```bash
# Vérifiez que la variable est chargée
echo $GITHUB_TOKEN

# Si vide, rechargez
source load-env.sh
```

### Problème : "Invalid API key" pour Claude

```bash
# Exécutez dans Antigravity
/login
# Choisissez "Anthropic Console"
```

## 💡 Exemples de commandes

Une fois configuré, essayez :

### GitHub
```
"Crée une issue 'Setup MCP terminé ✅' sur dash-kangourou-nova"
"Liste mes 5 derniers commits"
"Cherche 'TODO' dans mon code"
```

### Google Workspace
```
"Lis mes 3 derniers emails"
"Quels sont mes événements cette semaine ?"
"Crée une tâche 'Révoquer le token GitHub exposé'"
```

## 🎉 Vous êtes prêt !

Votre environnement est configuré avec :
- ✅ Claude AI (Sonnet 4.5 / Opus 4.5)
- ✅ Google Workspace MCP
- ✅ GitHub MCP
- ✅ Shadcn UI

**N'oubliez pas** : Révoquez le token exposé après vos tests ! 🔐

## 📞 Support

En cas de problème :
1. Consultez les guides dans `.vscode/`
2. Vérifiez les logs MCP : View → Output → MCP Servers
3. Redémarrez Antigravity
4. Lisez le guide de sécurité si c'est lié aux tokens

Bon développement ! 🚀
