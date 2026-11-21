export type LoginField = "email" | "password";
export type LoginErrors = Partial<Record<LoginField, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateLogin(values: { email: string; password: string }): LoginErrors {
  const errors: LoginErrors = {};
  if (!values.email.trim()) errors.email = "Informe o e-mail da sua conta.";
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = "Confira o e-mail: ele parece incompleto.";
  if (!values.password) errors.password = "Digite sua senha.";
  return errors;
}

/** Erro de e-mail para o pedido de nova senha (só depende do e-mail digitado). */
export function validateResetEmail(email: string): string | undefined {
  if (!email.trim()) return "Digite seu e-mail acima e toque em “Esqueci a senha”.";
  if (!EMAIL_RE.test(email.trim())) return "Confira o e-mail: ele parece incompleto.";
  return undefined;
}

/**
 * Traduz o erro do Firebase ao entrar. Credenciais erradas usam uma mensagem única,
 * sem dizer se foi o e-mail ou a senha, para não revelar quais e-mails têm conta.
 */
export function loginErrorMessage(code?: string): { field: LoginField | null; message: string } {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-login-credentials":
      return { field: "password", message: "E-mail ou senha incorretos. Confira os dados ou use “Esqueci a senha”." };
    case "auth/invalid-email":
      return { field: "email", message: "Confira o e-mail: ele parece incompleto." };
    case "auth/user-disabled":
      return { field: null, message: "Esta conta está desativada. Fale com o suporte do FitBase." };
    case "auth/too-many-requests":
      return { field: null, message: "Muitas tentativas seguidas. Aguarde alguns minutos ou use “Esqueci a senha”." };
    case "auth/network-request-failed":
      return { field: null, message: "Sem conexão com a internet. Verifique a rede e tente de novo." };
    default:
      return { field: null, message: "Não foi possível entrar agora. Tente de novo em instantes." };
  }
}

/** Mensagem após pedir nova senha. Não confirma se o e-mail existe. */
export const RESET_SENT_MESSAGE =
  "Se houver uma conta com este e-mail, enviamos o link para criar uma nova senha. Confira também o spam.";

export function resetErrorMessage(code?: string): string {
  switch (code) {
    case "auth/invalid-email":
      return "Confira o e-mail: ele parece incompleto.";
    case "auth/too-many-requests":
      return "Muitos pedidos seguidos. Aguarde alguns minutos e tente de novo.";
    case "auth/network-request-failed":
      return "Sem conexão com a internet. Verifique a rede e tente de novo.";
    default:
      return "Não foi possível enviar o link agora. Tente de novo em instantes.";
  }
}
