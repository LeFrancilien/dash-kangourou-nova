# ⚠️ SÉCURITÉ : Gestion des tokens GitHub

## 🚨 IMPORTANT : Votre token a été exposé

Vous avez partagé votre token GitHub dans une conversation. **Vous devez le révoquer immédiatement** après la configuration.

## 🔐 Étapes de sécurisation

### 1️⃣ Révoquer le token exposé

1. Allez sur [github.com/settings/tokens](https://github.com/settings/tokens)
2. Trouvez le token que vous venez de créer
3. Cliquez sur **"Delete"** ou **"Revoke"**
4. Confirmez la révocation

### 2️⃣ Créer un nouveau token (sécurisé)

1. Sur [github.com/settings/tokens](https://github.com/settings/tokens)
2. Cliquez sur **"Generate new token"** → **"Generate new token (classic)"**
3. Donnez un nom : `Antigravity MCP - NOUVEAU`
4. Durée : **90 jours** (pour plus de sécurité)
5. **Permissions requises** :
   - ✅ `repo` (Full control of private repositories)
   - ✅ `read:org` (Read org and team membership)
   - ✅ `read:user` (Read user profile data)
   - ✅ `user:email` (Access user email addresses)
6. Cliquez sur **"Generate token"**
7. **Copiez le nouveau token**

### 3️⃣ Remplacer le token dans .env.local

1. Ouvrez le fichier `.env.local` à la racine du projet
2. Remplacez l'ancien token par le nouveau :
   ```bash
   GITHUB_TOKEN=votre_nouveau_token_ici
   ```
3. Sauvegardez le fichier

### 4️⃣ Redémarrer Antigravity

1. `Cmd/Ctrl + Shift + P`
2. Tapez "Reload Window"
3. Appuyez sur Entrée

## ✅ Vérification de sécurité

### Le fichier .env.local est-il protégé ?

```bash
# Vérifiez que .env.local n'apparaît PAS dans cette commande
git status

# Si le fichier apparaît, ajoutez-le à .gitignore
echo ".env.local" >> .gitignore
```

✅ **Bon signe** : `.gitignore` contient déjà `.env*` (ligne 34)
✅ Votre token est **protégé** et ne sera **jamais commité**

## 🔒 Bonnes pratiques de sécurité

### ❌ Ne JAMAIS faire

- ❌ Partager un token dans un chat, email, ou forum
- ❌ Commiter un token dans Git
- ❌ Copier-coller un token dans une capture d'écran
- ❌ Utiliser un token dans une URL
- ❌ Créer un token sans expiration

### ✅ Toujours faire

- ✅ Utiliser des variables d'environnement
- ✅ Définir une date d'expiration (90 jours max)
- ✅ Donner uniquement les permissions nécessaires
- ✅ Révoquer immédiatement si exposé
- ✅ Utiliser des tokens différents pour différents projets
- ✅ Vérifier régulièrement vos tokens actifs

## 🛡️ Que faire si un token est exposé ?

### Checklist de sécurité

- [ ] **Immédiatement** : Révoquer le token sur GitHub
- [ ] Vérifier l'activité récente du token (logs GitHub)
- [ ] Créer un nouveau token
- [ ] Mettre à jour `.env.local` avec le nouveau token
- [ ] Redémarrer l'application/IDE
- [ ] Surveiller votre compte GitHub pour toute activité suspecte

### Vérifier l'activité du token

1. Allez sur [github.com/settings/security-log](https://github.com/settings/security-log)
2. Recherchez des activités inhabituelles
3. Si quelque chose semble suspect, changez votre mot de passe GitHub

## 📁 Structure des fichiers sécurisés

```
dash-kangourou-nova/
├── .env.local                 # ✅ Token GitHub (ignoré par Git)
├── .gitignore                 # ✅ Contient .env*
├── .vscode/
│   ├── mcp.json              # ✅ Utilise ${GITHUB_TOKEN}
│   └── SECURITE_TOKEN.md     # ✅ Ce fichier
```

## 🔄 Rotation des tokens

### Pourquoi faire une rotation ?

- Limiter la fenêtre d'exposition en cas de compromission
- Respecter les bonnes pratiques de sécurité
- Contrôler l'accès dans le temps

### Fréquence recommandée

- **90 jours** : Pour un usage normal
- **30 jours** : Pour des projets sensibles
- **Immédiatement** : Si le token a été exposé

### Comment faire

1. Créez un nouveau token AVANT d'expirer l'ancien
2. Mettez à jour `.env.local`
3. Testez que tout fonctionne
4. Révoquez l'ancien token

## 📊 Monitoring

### Vérifier vos tokens actifs

```bash
# Lister tous vos tokens GitHub (nécessite GitHub CLI)
gh auth status

# Voir les autorisations d'un token
gh auth status --show-token
```

### Vérifier l'utilisation de votre quota API

```bash
# Depuis le terminal
curl -H "Authorization: token $(cat .env.local | grep GITHUB_TOKEN | cut -d'=' -f2)" \
  https://api.github.com/rate_limit
```

Résultat attendu :
- **5000 requêtes/heure** : Token valide
- **60 requêtes/heure** : Token invalide ou non utilisé

## 🆘 En cas de problème

### Le token ne fonctionne pas

1. Vérifiez que le token est dans `.env.local`
2. Vérifiez les permissions du token sur GitHub
3. Vérifiez que le token n'a pas expiré
4. Redémarrez Antigravity complètement

### Erreur "401 Unauthorized"

- Le token est invalide ou révoqué
- Créez un nouveau token
- Mettez à jour `.env.local`

### Le fichier .env.local est commité par erreur

```bash
# Supprimer du commit mais garder localement
git rm --cached .env.local

# Vérifier que .gitignore contient .env*
grep "\.env" .gitignore

# Commit la suppression
git commit -m "Remove .env.local from git tracking"
git push

# IMPORTANT : Révoquez le token immédiatement !
```

## 📚 Ressources

- [GitHub Tokens Documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security/getting-started/github-security-features)
- [Security Log](https://github.com/settings/security-log)

## ✅ Checklist finale

Avant de continuer, assurez-vous que :

- [ ] Le token est dans `.env.local` (et NON dans `mcp.json`)
- [ ] `.env.local` est dans `.gitignore`
- [ ] `.env.local` n'apparaît PAS dans `git status`
- [ ] Vous avez révoqué l'ancien token exposé
- [ ] Vous avez créé un nouveau token avec expiration
- [ ] Antigravity a été redémarré
- [ ] Le serveur GitHub MCP est "Connected"

## 🎉 Token sécurisé !

Une fois toutes ces étapes complétées, votre token est **sécurisé** et vous pouvez utiliser le serveur MCP GitHub en toute tranquillité ! 🔒
