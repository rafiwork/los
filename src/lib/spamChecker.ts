import { supabase } from "@/integrations/supabase/client";

let cachedSpamWords: string[] = [];
let lastFetch = 0;

export async function loadSpamWords(): Promise<string[]> {
  if (Date.now() - lastFetch < 60000 && cachedSpamWords.length > 0) return cachedSpamWords;
  const { data } = await supabase.from("spam_words" as any).select("word");
  cachedSpamWords = (data as any[])?.map(d => d.word.toLowerCase()) || [];
  lastFetch = Date.now();
  return cachedSpamWords;
}

export function checkSpam(content: string, spamWords: string[]): string | null {
  const lower = content.toLowerCase();
  for (const word of spamWords) {
    if (lower.includes(word.toLowerCase())) return word;
  }
  return null;
}

export async function recordViolation(userId: string, word: string, contentType: string, contentId?: string): Promise<{ banned: boolean; banDays: number; permanent: boolean; warningOnly: boolean }> {
  try {
    const session = (await supabase.auth.getSession()).data.session;
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/record-spam-violation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ word, contentType, contentId: contentId || null }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }
  return { banned: false, banDays: 0, permanent: false, warningOnly: true };
}

export async function isSpamBanned(userId: string): Promise<{ banned: boolean; permanent: boolean; banUntil: string | null }> {
  const { data } = await supabase.from("spam_bans" as any).select("*").eq("user_id", userId).single();
  if (!data) return { banned: false, permanent: false, banUntil: null };
  const ban = data as any;
  if (ban.is_permanent) return { banned: true, permanent: true, banUntil: null };
  if (ban.ban_until && new Date(ban.ban_until) > new Date()) {
    return { banned: true, permanent: false, banUntil: ban.ban_until };
  }
  return { banned: false, permanent: false, banUntil: null };
}
