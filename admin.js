import { db, getUser } from './_lib.js';
export default async function handler(req, res) {
  const user = await getUser(req);
  const { data: me } = user ? await db.from('profiles').select('is_admin').eq('id', user.id).single() : {};
  if (!me?.is_admin) return res.status(403).json({ error: 'Accès réservé' });
  if (req.method === 'POST') {
    await db.from('orders').update({ status: req.body.status }).eq('id', req.body.id);
    return res.json({ ok: true });
  }
  const { data: orders } = await db.from('orders').select('*, order_items(name,price_cents)').order('created_at', { ascending: false });
  const { data: customers } = await db.from('profiles').select('email,created_at').order('created_at', { ascending: false });
  res.json({ orders, customers });
}
