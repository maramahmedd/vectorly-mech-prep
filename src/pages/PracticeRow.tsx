import { useState, useEffect, useMemo, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL!, import.meta.env.VITE_SUPABASE_ANON_KEY!);

type Problem = {
  id: string; // uuid
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
};

type Props = {
  problem: Problem;
  userId: string; // from your auth context
};

export default function PracticeRow({ problem, userId }: Props) {
  const [status, setStatus] = useState<"none" | "attempted" | "solved">("none");
  const [saving, setSaving] = useState(false);

  // On mount, ask Supabase if user already has an attempt
  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!userId) return;
      const { data, error } = await supabase
        .from("problem_attempts")
        .select("status")
        .eq("user_id", userId)
        .eq("problem_id", problem.id)
        .maybeSingle();

      if (!ignore && !error && data?.status) {
        setStatus(data.status as "attempted" | "solved");
      }
    })();
    return () => { ignore = true; };
  }, [userId, problem.id]);

  const markAttempted = useCallback(async () => {
    if (!userId) return;

    // optimistic UI
    const prev = status;
    setStatus("attempted");
    setSaving(true);

    // upsert so we don’t duplicate; PK is (user_id, problem_id)
    const { error } = await supabase
      .from("problem_attempts")
      .upsert({
        user_id: userId,
        problem_id: problem.id,
        status: "attempted",
      }, { onConflict: "user_id,problem_id" });

    if (error) {
      // rollback optimistic change on failure
      setStatus(prev);
      console.error(error);
    }
    setSaving(false);
  }, [userId, problem.id, status]);

  // If you have a "Mark solved" flow:
  const markSolved = useCallback(async () => {
    if (!userId) return;
    const prev = status;
    setStatus("solved");
    setSaving(true);

    const { error } = await supabase
      .from("problem_attempts")
      .upsert({
        user_id: userId,
        problem_id: problem.id,
        status: "solved",
      }, { onConflict: "user_id,problem_id" });

    if (error) {
      setStatus(prev);
      console.error(error);
    }
    setSaving(false);
  }, [userId, problem.id, status]);

  return (
    <div className="flex items-center justify-between rounded-2xl p-3 shadow-sm border">
      <div>
        <div className="font-medium">{problem.title}</div>
        <div className="text-sm opacity-70">{problem.difficulty}</div>
      </div>

      {status === "none" && (
        <button
          disabled={saving}
          className="px-3 py-1 rounded-xl border hover:bg-gray-50"
          onClick={markAttempted}
          aria-label="Mark as attempted"
        >
          Solve
        </button>
      )}

      {status === "attempted" && (
        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-xl bg-amber-100 text-amber-900">Attempted</span>
          <button
            disabled={saving}
            className="px-3 py-1 rounded-xl border hover:bg-gray-50"
            onClick={markSolved}
          >
            Mark Solved
          </button>
        </div>
      )}

      {status === "solved" && (
        <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900">
          Solved
        </span>
      )}
    </div>
  );
}
