import { stripe, db } from './_lib.js';
export const config = { api: { bodyParser: false } };
async function raw(req) { const c = []; for await (const x of req) c.push(x); return Buffer.concat(c); }
export default async function handler(req, res) {
  let ev;
  try { ev = stripe.webhooks.constructEvent(await raw(req), req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET); }
  catch { return res.status(400).send('Signature invalide'); }
  if (ev.type === 'checkout.session.completed') {
    await db.from('orders').update({ status: 'paid' }).eq('id', ev.data.object.metadata.order_id);
  }
  res.json({ ok: true });
}
