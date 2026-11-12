import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
export async function getUser(req) {
  const t = (req.headers.authorization || '').replace('Bearer ', '');
  const { data } = await db.auth.getUser(t);
  return data?.user || null;
}
