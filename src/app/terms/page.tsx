"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LpThemeToggle } from "@/components/landing/LpThemeToggle";
import "@/components/landing/landing.css";
import "@/components/auth/auth.css";

const SECTIONS: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: "natureza",
    title: "Natureza do serviço",
    body: (
      <p>
        O <strong>FitBase</strong> é uma plataforma de Software como Serviço (SaaS) destinada exclusivamente à organização administrativa e registro de dados internos de estabelecimentos fitness (academias, estúdios, boxes). A plataforma funciona como um livro de registro digital (ledger), não possuindo funções de instituição bancária, processadora de pagamentos ou consultoria médica/esportiva.
      </p>
    ),
  },
  {
    id: "dados",
    title: "Responsabilidade pelo conteúdo e dados",
    body: (
      <p>
        O Usuário (Gestor da Academia) declara ser o único e exclusivo responsável pela veracidade, integridade e legalidade de todos os dados inseridos na plataforma. O FitBase atua tecnicamente como <strong>Operador de Dados</strong> nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), cabendo ao Usuário a condição de <strong>Controlador</strong>, sendo de sua inteira responsabilidade a obtenção do consentimento prévio e expresso de seus alunos para o tratamento de dados pessoais.
      </p>
    ),
  },
  {
    id: "responsabilidade",
    title: "Limitação de responsabilidade jurídica",
    body: (
      <p>
        A detentora da plataforma não será responsabilizada por: (i) Erros de lançamentos financeiros realizados pelo Usuário; (ii) Eventuais lesões, danos físicos ou óbitos ocorridos nas dependências do estabelecimento do Usuário; (iii) Inadimplência contratual entre o aluno e o Usuário; (iv) Interrupções de serviço decorrentes de falhas técnicas globais da infraestrutura de internet ou serviços de terceiros (Firebase/Google Cloud).
      </p>
    ),
  },
  {
    id: "consultoria",
    title: "Inexistência de consultoria profissional",
    body: (
      <p>
        A plataforma FitBase fornece ferramentas de automatização e análise estratégica de negócios baseada em Inteligência Artificial. Tais análises são sugestivas e não substituem o parecer técnico de contadores, advogados ou profissionais de educação física. O Usuário assume todo o risco comercial ao implementar estratégias sugeridas pela plataforma.
      </p>
    ),
  },
  {
    id: "propriedade",
    title: "Propriedade intelectual e uso indevido",
    body: (
      <p>
        Todo o código-fonte, design, logotipos e algoritmos da plataforma são propriedade intelectual protegida. É estritamente proibida a engenharia reversa, cópia ou uso da ferramenta para atividades ilícitas, sob pena de rescisão imediata do acesso e interpelação judicial por danos morais e lucros cessantes.
      </p>
    ),
  },
  {
    id: "foro",
    title: "Foro de eleição",
    body: (
      <p>
        Para dirimir quaisquer controvérsias oriundas deste instrumento, as partes elegem o foro da Comarca da sede da detentora da plataforma, com renúncia expressa a qualquer outro, por mais privilegiado que seja.
      </p>
    ),
  },
];

export default function TermsPage() {
  const router = useRouter();

  // Quem veio do cadastro volta para ele; quem abriu o link direto vai para o cadastro.
  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) router.back();
    else router.push("/register");
  };

  return (
    <div className="lp lp-terms">
      <div className="lp-wrap">
        <div className="lp-terms-top">
          <Link href="/" className="lp-logo-link" aria-label="FitBase, página inicial">
            <span className="lp-logo" role="img" aria-label="FitBase" />
          </Link>
          <div className="lp-auth-top-right">
            <button type="button" className="lp-text-btn" onClick={goBack}>
              Voltar
            </button>
            <LpThemeToggle />
          </div>
        </div>

        <div className="lp-terms-body">
          <aside className="lp-terms-aside">
            <h1>Termos de Uso</h1>
            <p className="lp-terms-meta">Instrumento particular. Versão 2026.1.Legal</p>
            <ul className="lp-terms-toc">
              {SECTIONS.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          <article className="lp-terms-article">
            {SECTIONS.map((s, i) => (
              <section key={s.id} id={s.id}>
                <h2>
                  <span>{i + 1}.</span>
                  {s.title}
                </h2>
                {s.body}
              </section>
            ))}

            <div className="lp-terms-accept">
              <p>Leu tudo? Volte ao cadastro e marque a caixa de aceite para criar sua conta.</p>
              <button type="button" className="lp-btn lp-btn-primary" onClick={goBack}>
                Voltar ao cadastro
              </button>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
