import { useCreateServerSupabase } from "#server/utils/useCreateServerSupabase";

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);

  const supabase = useCreateServerSupabase(event);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
});
