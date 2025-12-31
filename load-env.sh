#!/bin/bash
# Script pour charger les variables d'environnement depuis .env.local
# Usage: source load-env.sh

if [ -f .env.local ]; then
    echo "🔑 Chargement des variables d'environnement depuis .env.local..."
    set -a
    source .env.local
    set +a
    echo "✅ Variables chargées :"
    if [ ! -z "$GITHUB_TOKEN" ]; then
        echo "   - GITHUB_TOKEN: ${GITHUB_TOKEN:0:20}..."
    fi
    echo ""
    echo "💡 Pour vérifier : echo \$GITHUB_TOKEN"
else
    echo "❌ Fichier .env.local non trouvé"
    echo "📝 Créez le fichier avec votre GITHUB_TOKEN"
fi
