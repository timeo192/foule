# Foule — mise en ligne

1. **Supabase** : créez un projet, exécutez `supabase.sql` (SQL Editor), créez un bucket privé `produits` avec `journal.pdf`, `guide.pdf`, `tableau.xlsx`. Mettez l’URL et la clé *anon* dans `public/config.js`. Puis rendez-vous admin : `update profiles set is_admin=true where email='vous@exemple.fr';`
2. **Stripe** : récupérez la clé secrète (mode test d’abord). Après déploiement, ajoutez un webhook `https://VOTRE-SITE.vercel.app/api/webhook` sur l’événement `checkout.session.completed` et copiez son secret. Activez les reçus par e-mail (Paramètres > E-mails clients) pour les confirmations.
3. **Vercel** : importez ce dossier (GitHub ou `vercel` en CLI), ajoutez les 4 variables de `.env.example`, déployez.
4. Test : carte `4242 4242 4242 4242`. Gestion : `/admin.html`.
