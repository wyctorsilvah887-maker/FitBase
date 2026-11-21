"use client";

import { LegalPage } from "@/components/legal/LegalPage";
import type { LegalSection } from "@/components/legal/LegalPage";

const SECTIONS: LegalSection[] = [
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
  return (
    <LegalPage
      title="Termos de Uso"
      meta="Instrumento particular. Versão 2026.1.Legal"
      sections={SECTIONS}
      closing="Leu tudo? Volte ao cadastro e marque a caixa de aceite para criar sua conta."
      other={{ href: "/privacy", label: "Política de Privacidade" }}
    />
  );
}
