# Règles de Sécurité Firestore - HAR DESIGN

Ce document contient les règles de sécurité recommandées pour la base de données Firestore.

## Comment appliquer ces règles

1. Allez sur la [Console Firebase](https://console.firebase.google.com/)
2. Sélectionnez votre projet
3. Allez dans **Firestore Database** > **Règles**
4. Copiez-collez les règles ci-dessous
5. Cliquez sur **Publier**

## Règles de Sécurité Recommandées

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Fonction helper pour vérifier si l'utilisateur est authentifié
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Fonction helper pour vérifier si l'utilisateur est admin
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Fonction helper pour vérifier si c'est le propriétaire
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Collection: users
    match /users/{userId} {
      // Lecture: Admin peut tout lire, utilisateur peut lire son propre profil
      allow read: if isAdmin() || isOwner(userId);
      
      // Création: Tout utilisateur authentifié peut créer son profil
      allow create: if isAuthenticated() && request.auth.uid == userId;
      
      // Mise à jour: Admin peut tout modifier, utilisateur peut modifier son profil (sauf role)
      allow update: if isAdmin() || 
                      (isOwner(userId) && 
                       !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role']));
      
      // Suppression: Admin uniquement
      allow delete: if isAdmin();
    }
    
    // Collection: products
    match /products/{productId} {
      // Lecture: Tout le monde (publique)
      allow read: if true;
      
      // Écriture: Admin uniquement
      allow write: if isAdmin();
    }
    
    // Collection: couture_models
    match /couture_models/{modelId} {
      // Lecture: Tout le monde (publique)
      allow read: if true;
      
      // Écriture: Admin uniquement
      allow write: if isAdmin();
    }
    
    // Collection: orders
    match /orders/{orderId} {
      // Lecture: Admin peut tout lire, utilisateur peut lire ses propres commandes
      allow read: if isAdmin() || 
                    (isAuthenticated() && resource.data.userId == request.auth.uid);
      
      // Création: Utilisateur authentifié peut créer une commande
      allow create: if isAuthenticated() && 
                      request.resource.data.userId == request.auth.uid;
      
      // Mise à jour: Admin uniquement (pour changer le statut)
      allow update: if isAdmin();
      
      // Suppression: Admin uniquement
      allow delete: if isAdmin();
    }
    
    // Collection: custom_orders (commandes couture)
    match /custom_orders/{orderId} {
      // Lecture: Admin peut tout lire
      allow read: if isAdmin();
      
      // Écriture: Admin uniquement
      allow write: if isAdmin();
    }
    
    // Collection: transactions (caisse)
    match /transactions/{transactionId} {
      // Lecture et écriture: Admin uniquement
      allow read, write: if isAdmin();
    }
    
    // Collection: measurements (mensurations)
    match /measurements/{measurementId} {
      // Lecture: Admin peut tout lire
      allow read: if isAdmin();
      
      // Écriture: Admin uniquement
      allow write: if isAdmin();
    }
  }
}
```

## Index Firestore Requis

Pour que les requêtes fonctionnent correctement, vous devez créer les index suivants dans Firestore:

### Index Composés Nécessaires

1. **Collection `orders`**
   - Champs: `userId` (Ascending), `createdAt` (Descending)
   - Scope: Collection

2. **Collection `users`**
   - Champs: `role` (Ascending)
   - Scope: Collection

### Comment créer un index

1. Allez dans **Firestore Database** > **Index**
2. Cliquez sur **Créer un index**
3. Configurez selon les spécifications ci-dessus

Alternativement, lorsqu'une requête nécessite un index manquant, Firebase affiche un lien dans la console du navigateur pour créer automatiquement l'index.

## Notes Importantes

- **En développement**: Vous pouvez temporairement utiliser des règles permissives pour tester
- **En production**: Appliquez TOUJOURS les règles de sécurité strictes ci-dessus
- **Tests**: Testez vos règles avec l'émulateur Firebase avant de déployer
