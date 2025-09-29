# ✈️ Check-list Avion - Application Mobile

Une application mobile professionnelle de check-lists pour pilotes d'avion, développée avec React Native et Expo.

## 📱 Aperçu

Cette application remplace les check-lists papier traditionnelles par une solution numérique interactive, ergonomique et fiable pour une utilisation en cockpit.

### 🎯 Fonctionnalités principales

- **5 types de check-lists** : Prévol, Démarrage, Roulage, Décollage, Atterrissage
- **Validation tactile** : Boutons circulaires avec états visuels (gris/vert)
- **Sauvegarde automatique** : État persistant même après fermeture
- **Réinitialisation rapide** : Remise à zéro pour nouveau vol
- **Progression visuelle** : Barre de progression et pourcentage
- **Mode cockpit** : Interface sombre optimisée pour l'aviation
- **Ergonomie** : Gros boutons adaptés à l'utilisation à une main

## 🚀 Installation

### Prérequis
- Node.js 18+
- Expo CLI
- Android Studio (pour build APK)

### Développement local
```bash
# Cloner le repository
git clone https://github.com/votre-username/checklist-avion.git
cd checklist-avion

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

### Build APK pour Android
```bash
# Installer EAS CLI
npm install -g @expo/cli eas-cli

# Se connecter à Expo
npx expo login

# Configurer EAS Build
eas build:configure

# Générer l'APK
eas build --platform android --profile production
```

## 📋 Check-lists incluses

### Prévol
- Documentation de vol vérifiée
- Contrôle extérieur de l'avion effectué
- Essence vérifiée (quantité et qualité)
- Niveaux d'huile vérifiés
- Gouvernes libres et dégagées
- Instruments et commutateurs sur OFF
- Ceintures et harnais attachés
- Porte et verrière fermées et verrouillées

### Démarrage
- Batterie principale ON
- Pompe à essence électrique ON
- Mélange RICHE
- Hélice PETITE PROFONDEUR
- Magnetos sur BOTH
- Contacteur de démarrage ENGAGE
- Huile pressurisation OK
- Générateur ON

### Roulage
- Freins testés
- Instruments de vol vérifiés
- Compas magnétique ajusté
- Transpondeur réglé
- Radio communication testée
- Contrôles de vol libres
- Trim ajusté pour le décollage
- Volets positionnés

### Décollage
- Piste libre et dégagée
- Vent vérifié
- Volets configurés
- Trim réglé
- Magnetos vérifiés
- Mélange ajusté
- Pleine puissance appliquée
- Vitesse de rotation atteinte

### Atterrissage
- Circuit d'atterrissage intégré
- Train d'atterrissage sorti
- Volets configurés
- Mélange ajusté
- Vitesse d'approche maintenue
- Piste alignée
- Arrondi et flare
- Freinage et roulage

## 🎨 Design

- **Palette aviation** : Gris foncé, vert validation, rouge alerte
- **Mode sombre** : Optimisé pour utilisation en cockpit
- **Contrastes élevés** : Lisibilité en plein soleil
- **Boutons tactiles** : 60px de diamètre pour manipulation aisée
- **Navigation simple** : Utilisation à une main

## 🛠️ Technologies

- **React Native** : Framework mobile cross-platform
- **Expo** : Plateforme de développement et déploiement
- **TypeScript** : Typage statique pour plus de robustesse
- **AsyncStorage** : Stockage local persistant
- **Lucide Icons** : Icônes vectorielles optimisées
- **EAS Build** : Service de build cloud

## 📱 Compatibilité

- **Android** : 11+ (API level 30+)
- **Smartphones** : Optimisé pour Samsung Galaxy
- **Taille** : < 50 Mo installé
- **Performance** : Démarrage < 3 secondes

## 🔧 Structure du projet

```
app/
├── (tabs)/
│   ├── index.tsx          # Accueil - sélection check-lists
│   ├── current.tsx        # Check-list en cours
│   └── settings.tsx       # Paramètres application
├── checklist/
│   └── [id].tsx          # Interface check-list détaillée
└── _layout.tsx           # Layout principal

components/               # Composants réutilisables
hooks/                   # Hooks personnalisés
```

## 🧪 Tests

- ✅ Persistance des données après fermeture
- ✅ Lisibilité en conditions de vol
- ✅ Ergonomie tactile en cockpit
- ✅ Performance sur Samsung Android 11+

## 📄 Licence

MIT License - Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! Merci de :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📞 Support

Pour toute question ou support :
- Ouvrir une [issue](https://github.com/votre-username/checklist-avion/issues)
- Email : support@checklist-avion.com

## 🛩️ Sécurité

Cette application est conçue comme aide-mémoire et ne remplace pas les procédures officielles de votre aéronef. Toujours se référer au manuel de vol officiel.

---

**Voler en sécurité avec des check-lists structurées** ✈️