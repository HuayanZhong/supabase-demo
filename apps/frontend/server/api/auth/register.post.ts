import { useCreateSupabase } from "~/composables/useCreateSupabase";

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);

  const supabase = useCreateSupabase();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.baseUrl}/login`,
    },
  });

  return { data, error };
});
