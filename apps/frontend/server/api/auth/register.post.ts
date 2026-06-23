import { useCreateServerSupabase } from "#server/utils/useCreateServerSupabase";

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);

  const supabase = useCreateServerSupabase(event);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.baseUrl}/login`,
    },
  });

  if (error) {
    return { error: { message: error.message } };
  }

  return {
    user: {
      id: data.user?.id,
      email: data.user?.email,
    },
  };
});
