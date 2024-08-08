import { z } from 'zod'

const formSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').default(''),
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório').default(''),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres').min(1, 'Senha é obrigatória').default(''),
  bio: z.string().min(1, 'Biografia é obrigatória').default(''),
  newsletter: z.boolean().optional().default(false),
  country: z.string().min(1, 'País é obrigatório').default('br'),
  prosseguir: z.string().min(1, 'Escolha uma opção').default('sim'),
  skills: z.array(z.string()).min(1, 'Selecione pelo menos uma habilidade').default([])
})


const formSchemaObject = {
  fields: [
    {
      label: "Nome",
      name: "name",
      as: "input",
      type: "text",
      rules: formSchema.shape.name,
      columns: 2, // Ocupará metade da linha (6 colunas em um grid de 12)
    },
    {
      label: "Email",
      name: "email",
      as: "input",
      type: "email",
      rules: formSchema.shape.email,
      columns: 2, // Ocupará metade da linha (6 colunas em um grid de 12)
    },
    {
      label: "Senha",
      name: "password",
      as: "input",
      type: "password",
      rules: formSchema.shape.password,
      columns: 3, // Ajuste conforme necessário
    },
    {
      label: "País",
      name: "country",
      as: "select",
      rules: formSchema.shape.country,
      children: [
        { text: "Brasil", value: "br" },
        { text: "Estados unidos", value: "us" },
        { text: "Canada", value: "ca" },
      ],
      columns: 4,
    },
    {
      label: "Deseja prosseguir?",
      name: "prosseguir",
      as: "radio",
      rules: formSchema.shape.prosseguir,
      children: [
        { text: "Sim", value: "sim" },
        { text: "Não", value: "nao" },
      ],
      columns: 4,
    },
    {
      label: "Biografia",
      name: "bio",
      as: "textarea",
      rules: formSchema.shape.bio,
      columns: 3,
    },
    {
      label: "Newsletter",
      name: "newsletter",
      as: "checkbox",
      rules: formSchema.shape.newsletter,
      default: true,
      columns: 1,
    },
    {
      label: "Selecione suas habilidades",
      name: "skills",
      as: "checkbox",
      rules: formSchema.shape.skills,
      children: [
        { text: "Vue.js", value: "vue" },
        { text: "React", value: "react" },
        { text: "Angular", value: "angular" },
      ],
      columns: 6,
    },
  ],
};


export { formSchemaObject }
