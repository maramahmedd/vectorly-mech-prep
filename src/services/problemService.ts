import { supabase } from "@/lib/supabase";

export type Problem = {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  subject: string;
  industry: string;
  time_estimate: string;
  companies: string[];
  is_premium: boolean;
};

export async function listProblems(filters: {
  search?: string;
  difficulty?: string;  // "all" | "easy" | "medium" | "hard"
  subject?: string;     // "all" | ...
  industry?: string;    // "all" | ...
}): Promise<Problem[]> {
  let q = supabase.from("problems").select("*").order("created_at", { ascending: false });

  if (filters.difficulty && filters.difficulty !== "all") q = q.eq("difficulty", filters.difficulty);
  if (filters.subject && filters.subject !== "all") q = q.eq("subject", filters.subject);
  if (filters.industry && filters.industry !== "all") q = q.eq("industry", filters.industry);

  if (filters.search && filters.search.trim()) {
    const s = `%${filters.search.trim()}%`;
    q = q.or(`title.ilike.${s},description.ilike.${s},subject.ilike.${s},industry.ilike.${s}`);
  }

  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Problem[];
}
