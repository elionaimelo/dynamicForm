import * as zod from "zod";

export const formSchema = zod.object({
  name: zod.string().min(1, { message: "Nome é obrigatório" }),
  email: zod.string().email({ message: "Email deve ser válido" }),
  password: zod.string().min(8, { message: "Senha muito curta" }),
  country: zod.string().min(1, { message: "País é obrigatório" }),
  prosseguir: zod.string().min(1, { message: "Selecione uma opção" }),
  bio: zod.string().optional(),
  newsletter: zod.boolean(),
  skills: zod.array(zod.string()).nonempty({ message: "Selecione pelo menos uma habilidade" }),
  birthDate: zod.date({ required_error: "Data de nascimento é obrigatória" }),
  phone: zod.string().min(1, { message: "Telefone é obrigatório" }),
  money: zod.number().min(1, { message: "Monetário é obrigatório" }),
});
