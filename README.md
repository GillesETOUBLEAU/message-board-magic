# 🟡 LiveSticky

Application de messages collaboratifs en temps réel pour ateliers et événements.

Les participants envoient des messages qui s'affichent sous forme de post-its colorés sur un écran de projection, le tout modéré par un administrateur.

## 👥 Parcours Participant

1. **Accès** → Se rendre sur la page d'accueil et saisir le **code d'accès** fourni par l'organisateur
2. **Identification** → Renseigner son **nom** et **email** (pas de création de compte)
3. **Envoi de message** → Rédiger et soumettre un message depuis le tableau de bord de l'événement
4. **Visualisation** → Les messages approuvés apparaissent en temps réel sur l'écran de projection

> 💡 Le code d'accès peut aussi être transmis via **QR code** ou **lien direct** (`?code=XXXX`), ce qui pré-remplit automatiquement le champ.

## 🔐 Parcours Administrateur

1. **Connexion** → Cliquer sur "Login" en bas de la page d'accueil → authentification Supabase (email/mot de passe)
2. **Gestion des événements** → Créer/modifier des événements (nom, description, code d'accès unique)
3. **Modération des messages** → Approuver ou rejeter les messages soumis par les participants
4. **Paramètres de projection** → Personnaliser l'affichage (couleurs des post-its, taille de police, couleur de fond, titre)
5. **Projection** → Ouvrir l'écran de projection dans un nouvel onglet pour l'afficher sur un vidéoprojecteur
6. **Export** → Exporter les messages en CSV/XLSX

## 🖥️ Écran de Projection

- Affiche les messages approuvés sous forme de **post-its colorés**
- Mise à jour **en temps réel**
- Personnalisable (couleurs, police, fond)
- Conçu pour être projeté en **plein écran**

## 📋 Routes

| Route | Accès | Description |
|---|---|---|
| `/` | Public | Page d'accueil — saisie du code d'accès |
| `/event/:slug/dashboard` | Participant (avec code) | Envoi de messages |
| `/event/:slug/projection` | Public | Écran de projection |
| `/admin` | Admin authentifié | Gestion événements + modération |

## 🔒 Sécurité

- Accès participants protégé par **code d'accès unique** par événement
- Administration protégée par **authentification Supabase + rôle admin** (table `user_roles`)
- **Row-Level Security (RLS)** sur toutes les tables
- Les tentatives d'accès sont **journalisées** (`event_access_attempts`)

## 🛠️ Stack technique

- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Supabase (Auth, Database, RLS)
- TanStack React Query

## 🚀 Installation locale

```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm i
npm run dev
```

## 📦 Déploiement

```sh
npm run build
```

Les fichiers générés se trouvent dans le dossier `dist`.

## 📧 Contact

contact@livesticky.fr
