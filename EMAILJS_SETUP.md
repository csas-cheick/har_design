# Guide de Configuration EmailJS

## Étapes pour configurer l'envoi d'emails

### 1. Créer un compte EmailJS

1. Allez sur [https://www.emailjs.com/](https://www.emailjs.com/)
2. Créez un compte gratuit (100 emails/mois inclus)
3. Confirmez votre email

### 2. Configurer un Service Email

1. Dans le dashboard EmailJS, allez dans **Email Services**
2. Cliquez sur **Add New Service**
3. Choisissez votre fournisseur email (Gmail, Outlook, etc.)
4. Suivez les instructions pour connecter votre compte
5. Notez le **Service ID** généré

### 3. Créer un Template d'Email

1. Allez dans **Email Templates**
2. Cliquez sur **Create New Template**
3. Utilisez ce contenu pour le template :

**Subject:**
```
Nouveau message de {{from_name}} - {{subject}}
```

**Content:**
```
Vous avez reçu un nouveau message via votre portfolio :

Nom: {{from_name}}
Email: {{from_email}}
Sujet: {{subject}}

Message:
{{message}}

---
Cet email a été envoyé depuis le formulaire de contact de votre portfolio.
```

4. Sauvegardez et notez le **Template ID**

### 4. Obtenir votre Public Key

1. Allez dans **Account** → **General**
2. Trouvez votre **Public Key** (ou API Key)
3. Copiez-la

### 5. Configurer les Variables d'Environnement

1. Copiez le fichier `.env.example` en `.env`
```bash
cp .env.example .env
```

2. Ouvrez `.env` et remplacez les valeurs :
```env
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
```

3. **Important:** Le fichier `.env` ne doit JAMAIS être commité dans Git

### 6. Tester l'envoi d'email

1. Relancez votre serveur de développement :
```bash
npm run dev
```

2. Accédez à la page Contact
3. Remplissez le formulaire et envoyez un message test
4. Vérifiez la réception dans votre boîte email

## Notes importantes

- ✅ Le plan gratuit offre **100 emails par mois**
- ✅ Pas besoin de backend, tout fonctionne côté client
- ✅ Les emails sont envoyés directement depuis le navigateur
- ⚠️ N'exposez jamais vos clés privées
- ⚠️ Le fichier `.env` doit être dans `.gitignore`

## Dépannage

### L'email n'arrive pas
- Vérifiez que tous les identifiants sont corrects
- Consultez la console du navigateur pour les erreurs
- Vérifiez vos spams
- Assurez-vous que le service email est bien connecté dans EmailJS

### Erreur "Public Key invalide"
- Vérifiez que vous utilisez bien le Public Key et non le Private Key
- Reconnectez votre compte dans EmailJS

### Quota dépassé
- Le plan gratuit limite à 100 emails/mois
- Passez à un plan payant si nécessaire

## Support

Pour plus d'informations, consultez la [documentation officielle EmailJS](https://www.emailjs.com/docs/)
