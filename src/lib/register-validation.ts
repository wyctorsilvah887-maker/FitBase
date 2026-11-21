export type RegisterField = "gymName" | "email" | "password" | "fee" | "terms";
export type RegisterErrors = Partial<Record<RegisterField, string>>;

/** "1.234,50" -> 1234.5 (o campo guarda o valor formatado em pt-BR). */
export function parseFee(input: string): number {
  const value = parseFloat(input.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(value) ? value : 0;
}

/** Digita só números e o campo vira dinheiro: 12000 -> "120,00". */
export function formatCurrencyInput(value: string): string {
  const digits = value.replace(/\D/g, "");
  const cents = parseInt(digits || "0", 10) / 100;
  return cents.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** 0 = curta demais, 1 = simples, 2 = boa, 3 = forte. */
export function getPasswordLevel(password: string): 0 | 1 | 2 | 3 {
  if (password.length < 6) return 0;
  let score = 1;
  if (password.length >= 10) score += 1;
  if (/[a-zA-Z]/.test(password) && /\d/.test(password)) score += 1;
  return Math.min(score, 3) as 1 | 2 | 3;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateRegister(values: {
  gymName: string;
  email: string;
  password: string;
  fee: number;
  acceptedTerms: boolean;
}): RegisterErrors {
  const errors: RegisterErrors = {};
  if (values.gymName.trim().length < 2) errors.gymName = "Informe o nome da academia.";
  if (!values.email.trim()) errors.email = "Informe o e-mail que você usa para entrar.";
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = "Confira o e-mail: ele parece incompleto.";
  if (!values.password) errors.password = "Crie uma senha.";
  else if (values.password.length < 6) errors.password = "A senha precisa ter pelo menos 6 caracteres.";
  if (values.fee <= 0) errors.fee = "Informe o valor da mensalidade. Você pode alterar depois no painel.";
  if (!values.acceptedTerms) errors.terms = "Aceite os Termos de Uso para criar a conta.";
  return errors;
}

/** Traduz o erro do Firebase e diz em qual campo ele deve aparecer. */
export function authErrorMessage(code?: string): { field: "email" | "password" | null; message: string } {
  switch (code) {
    case "auth/email-already-in-use":
      return { field: "email", message: "Já existe uma conta com este e-mail. Entre com ele ou use outro e-mail." };
    case "auth/invalid-email":
      return { field: "email", message: "Confira o e-mail: ele parece incompleto." };
    case "auth/weak-password":
      return { field: "password", message: "Senha muito fraca. Use pelo menos 6 caracteres." };
    case "auth/network-request-failed":
      return { field: null, message: "Sem conexão com a internet. Verifique a rede e tente de novo." };
    case "auth/too-many-requests":
      return { field: null, message: "Muitas tentativas seguidas. Aguarde alguns minutos e tente de novo." };
    case "auth/operation-not-allowed":
      return { field: null, message: "O cadastro por e-mail não está ativado neste projeto. Ative em Authentication, no Firebase." };
    default:
      return { field: null, message: "Não foi possível criar a conta. Tente de novo em instantes." };
  }
}
