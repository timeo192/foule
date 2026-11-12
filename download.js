import { db, getUser } from './_lib.js';
export default async function handler(req, res) {
  const user = await getUser(req);
  if (!user) return res.status(401).json({ error: 'Connexion requise' });
  const slug = req.query.slug;
  const { data } = await db.from('order_items').select('slug, orders!inner(user_id,status)').eq('slug', slug).eq('orders.user_id', user.id).eq('orders.status', 'paid').limit(1);
  if (!data?.length) return res.status(403).json({ error: 'Produit non acheté' });
  const { data: p } = await db.from('products').select('file_path').eq('slug', slug).single();
  const { data: s } = await db.storage.from('produits').createSignedUrl(p.file_path, 60);
  res.json({ url: s.signedUrl });
}
