import { useCreateServerSupabase } from "#server/utils/useCreateServerSupabase";

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);

  const supabase = useCreateServerSupabase(event);
  const config = useRuntimeConfig();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // 验证后跳转到邮箱验证成功提示页
      emailRedirectTo: `${config.public.baseUrl}/verify-email`,
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
