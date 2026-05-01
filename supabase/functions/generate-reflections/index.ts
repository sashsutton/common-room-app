import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { user_id } = await req.json();
    if (!user_id) throw new Error('user_id is required');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: selections, error: selErr } = await supabase
      .from('user_adopt_selections')
      .select('theme_id, adopt_themes(category, theme, description)')
      .eq('user_id', user_id);

    if (selErr) throw selErr;
    if (!selections || selections.length === 0) {
      throw new Error('No themes selected');
    }

    const themeList = selections
      .map((s: any) => {
        const t = s.adopt_themes;
        return `- ${t.theme} (${t.category}): ${t.description}`;
      })
      .join('\n');

    const prompt = `You are a warm, grounded guide supporting someone in a period of reflection and change.

The user has selected the following ADOPT themes as most relevant to their life right now:
${themeList}

Generate exactly 3 Points of Reflection based on the UNIQUE COMBINATION of these themes.
Each reflection must:
- Be 50–70 words maximum
- Speak directly to the user using "you"
- Be compassionate, open-hearted, and plainspoken
- Focus on inner awareness, not action or outcomes
- Draw insight from intersections across themes — not one-to-one mappings
- Feel personal and emotionally resonant, not generic

Do NOT:
- Use coaching clichés ("lean in", "own your story", "growth mindset")
- Give advice, recommendations, or prescriptive steps
- Use clinical or therapy language
- Imply the user is broken, stuck, or deficient
- Repeat or rephrase the theme names

Return ONLY a JSON array of 3 strings. No preamble, no markdown.
["Reflection 1 text here.", "Reflection 2 text here.", "Reflection 3 text here."]`;

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY')!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!anthropicRes.ok) {
      throw new Error(`Anthropic API error: ${anthropicRes.status}`);
    }

    const anthropicData = await anthropicRes.json();
    const rawText = anthropicData.content[0].text.trim();
    const reflections: string[] = JSON.parse(rawText);

    if (!Array.isArray(reflections) || reflections.length !== 3) {
      throw new Error('Invalid reflection format returned');
    }

    const themeIds = selections.map((s: any) => s.theme_id);

    const { error: insertErr } = await supabase.from('reflections').insert({
      user_id,
      theme_ids: themeIds,
      content: reflections,
    });

    if (insertErr) throw insertErr;

    return new Response(JSON.stringify({ reflections }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
