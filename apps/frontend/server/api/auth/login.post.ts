// POST /api/auth/login — 邮箱密码登录
import { useCreateServerSupabase } from "#server/utils/useCreateServerSupabase";

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);

  const supabase = useCreateServerSupabase(event);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
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
