import { stripe, db, getUser } from './_lib.js';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const user = await getUser(req);
  if (!user) return res.status(401).json({ error: 'Connectez-vous pour commander.' });
  const { data: products } = await db.from('products').select('*').in('slug', req.body?.slugs || []).eq('active', true);
  if (!products?.length) return res.status(400).json({ error: 'Votre panier est vide.' });
  const total = products.reduce((s, p) => s + p.price_cents, 0);
  const { data: order } = await db.from('orders').insert({ user_id: user.id, email: user.email, total_cents: total }).select().single();
  await db.from('order_items').insert(products.map(p => ({ order_id: order.id, slug: p.slug, name: p.name, price_cents: p.price_cents })));
  const origin = `https://${req.headers.host}`;
  const session = await stripe.checkout.sessions.create({
    mode: 'payment', customer_email: user.email, locale: 'fr',
    line_items: products.map(p => ({ quantity: 1, price_data: { currency: 'eur', unit_amount: p.price_cents, product_data: { name: p.name } } })),
    metadata: { order_id: order.id }, success_url: `${origin}/?success=1`, cancel_url: `${origin}/?cancel=1`,
  });
  await db.from('orders').update({ stripe_session_id: session.id }).eq('id', order.id);
  res.json({ url: session.url });
}
