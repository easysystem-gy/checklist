# Guide de Contribution - Check-list JRO

Merci de votre intérêt pour contribuer à l'application Check-list JRO ! Ce guide vous aidera à participer efficacement au projet.

## 🚀 Comment contribuer

### 1. Fork et Clone
```bash
# Fork le repository sur GitHub
# Puis cloner votre fork
git clone https://github.com/easysystem-gy/checklist.git
cd checklist
```

### 2. Configuration de l'environnement
```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

### 3. Créer une branche
```bash
# Créer une branche pour votre feature/fix
git checkout -b feature/nom-de-votre-feature
# ou
git checkout -b fix/description-du-bug
```

## 📋 Types de contributions

### 🐛 Correction de bugs
- Vérifier qu'une issue existe pour le bug
- Créer une issue si elle n'existe pas
- Référencer l'issue dans votre commit

### ✨ Nouvelles fonctionnalités
- Discuter de la fonctionnalité dans une issue avant de commencer
- S'assurer qu'elle correspond aux objectifs du projet
- Maintenir la simplicité et l'ergonomie cockpit

### 📚 Documentation
- Améliorer le README
- Ajouter des commentaires dans le code
- Créer des guides d'utilisation

### 🎨 Améliorations UI/UX
- Respecter les contraintes d'utilisation en cockpit
- Maintenir les contrastes élevés
- Préserver l'ergonomie tactile

## 🛠️ Standards de développement

### Code Style
- Utiliser TypeScript pour tous les nouveaux fichiers
- Suivre les conventions ESLint configurées
- Nommer les variables et fonctions de manière explicite

### Structure des commits
```
type(scope): description courte

Description plus détaillée si nécessaire

Fixes #123
```

Types de commits :
- `feat`: nouvelle fonctionnalité
- `fix`: correction de bug
- `docs`: documentation
- `style`: formatage, pas de changement de logique
- `refactor`: refactoring du code
- `test`: ajout ou modification de tests
- `chore`: tâches de maintenance

### Tests
- Tester sur Android 11+ minimum
- Vérifier la persistance des données
- Tester l'ergonomie tactile
- Valider les performances

## 🎯 Priorités du projet

### Haute priorité
- Stabilité et fiabilité
- Performance (< 3s démarrage)
- Ergonomie cockpit
- Persistance des données

### Moyenne priorité
- Nouvelles check-lists
- Personnalisation utilisateur
- Améliorations visuelles
- Optimisations

### Basse priorité
- Fonctionnalités avancées
- Intégrations externes
- Statistiques d'usage

## 🔍 Process de review

### Avant de soumettre
- [ ] Code testé localement
- [ ] Pas de warnings/erreurs
- [ ] Documentation mise à jour
- [ ] Commits bien formatés

### Pull Request
1. Créer une PR avec description claire
2. Lier les issues concernées
3. Ajouter des captures d'écran si UI
4. Attendre la review

### Critères d'acceptation
- Code fonctionnel et testé
- Respect des standards du projet
- Pas de régression
- Documentation à jour

## 🐛 Signaler un bug

### Template d'issue
```markdown
**Description du bug**
Description claire et concise du problème.

**Étapes pour reproduire**
1. Aller à '...'
2. Cliquer sur '...'
3. Voir l'erreur

**Comportement attendu**
Ce qui devrait se passer.

**Captures d'écran**
Si applicable, ajouter des captures.

**Environnement**
- Device: [ex. Samsung Galaxy S21]
- OS: [ex. Android 12]
- Version app: [ex. 1.0.0]

**Contexte additionnel**
Toute autre information utile.
```

## 💡 Proposer une fonctionnalité

### Template de feature request
```markdown
**Problème à résoudre**
Description du problème ou besoin.

**Solution proposée**
Description de la solution souhaitée.

**Alternatives considérées**
Autres solutions envisagées.

**Impact sur l'ergonomie cockpit**
Comment cela affecte l'utilisation en vol.

**Contexte additionnel**
Informations supplémentaires.
```

## 📞 Communication

- **Issues GitHub** : Pour bugs et features
- **Discussions** : Pour questions générales
- **Email** : Pour sujets sensibles

## 🏆 Reconnaissance

Les contributeurs sont listés dans :
- README.md
- Page "À propos" de l'app
- Releases notes

## ⚖️ Code de conduite

- Respecter tous les participants
- Constructif dans les critiques
- Focus sur l'amélioration du projet
- Patience avec les nouveaux contributeurs

## 🛩️ Spécificités aviation

### Contraintes importantes
- **Sécurité** : Aucune fonctionnalité ne doit compromettre la sécurité
- **Simplicité** : Interface simple et claire
- **Fiabilité** : Fonctionnement sans faille
- **Rapidité** : Réponse instantanée aux interactions

### Validation pilote
- Tests avec pilotes expérimentés
- Validation en conditions réelles
- Feedback terrain prioritaire

---

Merci de contribuer à rendre l'aviation plus sûre ! ✈️