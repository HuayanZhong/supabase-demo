import { useCreateSupabase } from "~/composables/useCreateSupabase";

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);

  const { data, error } = await useCreateSupabase().auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
});
