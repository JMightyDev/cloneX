<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD029 -->

# 🐦 Clone de X (Twitter)

<div align="center">

[![Demo](https://img.shields.io/badge/Demo-Live%20Site-blue)](https://jmighty.fr/x/)
[![React](https://img.shields.io/badge/React-18-61dafb)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Latest-orange)](https://firebase.google.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Latest-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](https://opensource.org/licenses/MIT)

Une réplique moderne et fonctionnelle de X (anciennement Twitter) avec authentification en temps réel et interface responsive.

[Démo](https://jmighty.fr/x/) • [Signaler un Bug](https://github.com/JMightyDev/projet-passerelle-x/issues) • [Suggérer une Feature](https://github.com/JMightyDev/projet-passerelle-x/issues)

</div>

## 📋 Table des Matières

- [🐦 Clone de X (Twitter)](#-clone-de-x-twitter)
  - [📋 Table des Matières](#-table-des-matières)
  - [🔍 Aperçu](#-aperçu)
    - [🌟 Points Forts](#-points-forts)
  - [✨ Fonctionnalités](#-fonctionnalités)
  - [🛠️ Technologies](#️-technologies)
    - [Frontend](#frontend)
    - [Backend \& Services](#backend--services)
    - [Outils de Développement](#outils-de-développement)
  - [📦 Installation](#-installation)
  - [⚙️ Configuration](#️-configuration)
  - [🚀 Utilisation](#-utilisation)
  - [🤝 Contribution](#-contribution)
  - [📄 Licence](#-licence)
  - [📞 Contact](#-contact)

## 🔍 Aperçu

Ce projet est un clone fonctionnel de X (Twitter) développé dans le cadre de la formation React du Programme Rocket de Believemy. Il reproduit les principales fonctionnalités de X tout en utilisant des technologies modernes.

### 🌟 Points Forts

- Interface utilisateur moderne et responsive
- Authentification sécurisée avec Firebase
- Performance optimisée avec React Query
- Animations fluides avec Framer Motion
- Mode sombre natif

## ✨ Fonctionnalités

- **Authentification Utilisateur**

  - Inscription/Connexion sécurisée
  - Gestion des sessions avec Firebase Auth

- **Interactions Sociales**

  - Publication de tweets
  - Réponses aux tweets
  - Système d'abonnements
  - Fils d'actualité personnalisé

- **Interface Utilisateur**

  - Design responsive
  - Animations fluides avec Framer Motion
  - Mode sombre natif
  - Interface similaire à X/Twitter

- **Fonctionnalités Supplémentaires**
  - Recherche en temps réel
  - Suppression de tweets
  - Notifications toast
  - Navigation instantanée

## 🛠️ Technologies

### Frontend

- [React 18](https://react.dev/) (avec Hooks)
- [TailwindCSS](https://tailwindcss.com/) (pour le styling)
- [Framer Motion](https://www.framer.com/motion/) (pour les animations)
- [React Query](https://tanstack.com/query/latest) (gestion du cache et des requêtes)
- [React Router v6](https://reactrouter.com/) (navigation)

### Backend & Services

- [Firebase Authentication](https://firebase.google.com/products/auth)
- [Firebase Realtime Database](https://firebase.google.com/products/realtime-database)
- [Vite](https://vitejs.dev/) (build tool)

### Outils de Développement

- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Git](https://git-scm.com/)

## 📦 Installation

1. **Clonez le repository**

```bash
git clone https://github.com/JMightyDev/projet-passerelle-x.git
cd projet-passerelle-x
```

2. **Installez les dépendances**

```bash
npm install
```

3. **Configurez les variables d'environnement**

Créez un fichier `.env.local` à la racine du projet et ajoutez les variables suivantes (à adapter avec vos valeurs de firebase):

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

4. **Démarrez le serveur de développement**

```bash
npm run dev
```

Votre application devrait maintenant être accessible à l'adresse `http://localhost:5173`.

## ⚙️ Configuration

Pour configurer ce projet, vous aurez besoin de :

1. Un projet [Firebase](https://console.firebase.google.com/) avec :

   - Authentication activée
   - Realtime Database configurée
   - Les règles de sécurité appropriées

2. Les fichiers de configuration suivants :
   - `.env.local` : Variables d'environnement (voir exemple ci-dessus)
   - `vite.config.js` : Configuration de Vite
   - `tailwind.config.js` : Configuration de TailwindCSS
   - `src/config/firebase.js` : Configuration Firebase

## 🚀 Utilisation

Pour utiliser ce projet, suivez les étapes ci-dessus pour l'installer et le configurer. Ensuite, vous pouvez commencer à développer et personnaliser l'application selon vos besoins.

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez suivre les étapes suivantes pour contribuer :

1. Forkez le repository
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commitez vos modifications (`git commit -m 'Add some AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Contact

JMighty - [https://jmighty.fr](https://jmighty.fr)

---

<div align="center">
Fait avec ❤️ par JMighty
</div>
