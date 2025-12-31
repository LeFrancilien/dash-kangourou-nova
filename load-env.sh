#!/bin/bash
# Script pour charger les variables d'environnement depuis .env.local
# Usage: source load-env.sh

if [ -f .env.local ]; then
    echo "🔑 Chargement des variables d'environnement depuis .env.local..."
    export $(cat .env.local | grep -v '^#' | grep -v '^$' | xargs)
    echo "✅ Variables chargées :"
    echo "   - GITHUB_TOKEN: ${GITHUB_TOKEN:0:20}..."
    echo ""
    echo "💡 Pour vérifier : echo \$GITHUB_TOKEN"
else
    echo "❌ Fichier .env.local non trouvé"
    echo "📝 Créez le fichier avec votre GITHUB_TOKEN"
fi
