import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

// Use environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateTokens() {
  for (let i = 0; i < 100; i++) {
    const token = crypto.randomUUID();
    const { error } = await supabase.from('minesweeper_tokens').insert([{ token }]);

    if (error) console.error('Error inserting token:', error);
    else console.log(`Generated URL: https://minesweeper-promo.cc-systems.net/game?token=${token}`);
  }
}-

generateTokens();
