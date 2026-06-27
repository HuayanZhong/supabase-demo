import { useCreateServerSupabase } from "#server/utils/useCreateServerSupabase";

export default defineEventHandler(async (event) => {
  const supabase = useCreateServerSupabase(event);
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return { user: null };
  }

  return {
    user: {
      id: data.user.id,
      email: data.user.email,
    },
  };
});
