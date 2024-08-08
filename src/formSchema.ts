import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  country: z.string().nonempty("Selecione um país"),
  prosseguir: z.string().nonempty("Selecione uma opção"),
  bio: z.string().optional(),
  newsletter: z.boolean().optional(),
  skills: z.array(z.string()).optional(),
});
