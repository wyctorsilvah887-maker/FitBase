"use client";

import { LegalPage } from "@/components/legal/LegalPage";
import type { LegalSection } from "@/components/legal/LegalPage";

/**
 * E-mail do canal de privacidade. Enquanto estiver vazio, a seção de direitos
 * não mostra endereço nenhum. Preencha com o contato real antes de publicar.
 */
const PRIVACY_CONTACT_EMAIL = "";

const SECTIONS: LegalSection[] = [
  {
    id: "papeis",
    title: "Quem decide sobre os dados",
    body: (
      <>
        <p>
          Esta política explica como o <strong>FitBase</strong> trata dados pessoais, conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). O papel do FitBase muda conforme de quem é o dado:
        </p>
        <ul>
          <li>
            <strong>Dados do gestor e da conta da academia</strong> (quem se cadastra no FitBase): o FitBase é o <strong>Controlador</strong>.
          </li>
          <li>
            <strong>Dados dos alunos</strong> cadastrados pela academia: a academia é a <strong>Controladora</strong> e o FitBase é o <strong>Operador</strong>, tratando os dados apenas para oferecer o sistema, como previsto nos Termos de Uso.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "dados",
    title: "Quais dados tratamos",
    body: (
      <>
        <p>Tratamos somente o que o sistema precisa para funcionar:</p>
        <ul>
          <li>
            <strong>Conta:</strong> e-mail e senha. A senha fica sob guarda do serviço de autenticação do Google Firebase e não é acessível ao FitBase em texto legível.
          </li>
          <li>
            <strong>Perfil da academia:</strong> nome da academia, valor da mensalidade e o registro do aceite dos Termos, com data e hora.
          </li>
          <li>
            <strong>Alunos:</strong> nome, telefone (WhatsApp), plano, situação do plano e datas de matrícula e vencimento.
          </li>
          <li>
            <strong>Pagamentos:</strong> valor, tipo, datas e o aluno a que se referem. O FitBase é um registro interno e não processa pagamentos nem guarda dados de cartão.
          </li>
          <li>
            <strong>Recursos de IA:</strong> o texto que o gestor digita para análise e números resumidos da academia (como total de alunos e faturamento do período).
          </li>
        </ul>
        <p>
          Não pedimos documentos como CPF ou RG. Na versão atual, a ficha de anamnese exibida no painel é um modelo para preenchimento e o FitBase não grava as respostas. Se a academia usar esse tipo de ficha por conta própria, dados de saúde são dados pessoais sensíveis e exigem consentimento específico do aluno, de responsabilidade da academia.
        </p>
      </>
    ),
  },
  {
    id: "finalidades",
    title: "Para que usamos",
    body: (
      <>
        <p>Usamos os dados para:</p>
        <ul>
          <li>criar e manter sua conta e permitir o acesso ao painel;</li>
          <li>registrar alunos, planos, vencimentos e pagamentos e calcular situação e novos vencimentos;</li>
          <li>gerar as análises de IA que você pedir;</li>
          <li>manter a segurança do serviço e cumprir obrigações legais.</li>
        </ul>
        <p>
          As bases legais são a execução do contrato de uso do sistema, o cumprimento de obrigações legais e o legítimo interesse em manter o serviço seguro. Não vendemos dados pessoais nem os usamos para publicidade.
        </p>
      </>
    ),
  },
  {
    id: "compartilhamento",
    title: "Com quem os dados passam",
    body: (
      <>
        <p>Para o sistema funcionar, os dados são processados por empresas contratadas como operadoras:</p>
        <ul>
          <li>
            <strong>Google Firebase e Google Cloud:</strong> autenticação, banco de dados e hospedagem. Os servidores podem ficar fora do Brasil, o que caracteriza transferência internacional de dados, feita sob as garantias previstas na LGPD.
          </li>
          <li>
            <strong>Google (modelos Gemini):</strong> recebem apenas o conteúdo enviado em uma análise de IA. Evite colocar nome, telefone ou outros dados identificáveis de alunos nesses textos.
          </li>
        </ul>
        <p>Também podemos compartilhar dados quando uma lei ou ordem judicial exigir.</p>
      </>
    ),
  },
  {
    id: "navegador",
    title: "O que fica no seu navegador",
    body: (
      <>
        <p>O FitBase guarda pequenas informações no seu aparelho:</p>
        <ul>
          <li>a sessão de login, mantida pelo Firebase, para você não precisar entrar a cada visita;</li>
          <li>o histórico das análises de IA e o contador de uso desse recurso, guardados só neste navegador;</li>
          <li>um rascunho temporário do cadastro (nome da academia, e-mail e mensalidade, nunca a senha), que vale enquanto a aba estiver aberta e é apagado ao criar a conta.</li>
        </ul>
        <p>Nesta versão, o FitBase não usa cookies de publicidade nem ferramentas de rastreamento de terceiros.</p>
      </>
    ),
  },
  {
    id: "retencao",
    title: "Por quanto tempo guardamos",
    body: (
      <p>
        Mantemos os dados enquanto a conta estiver ativa. Ao pedir o encerramento da conta, apagamos ou anonimizamos os dados, exceto os que precisarmos guardar para cumprir obrigação legal ou para nos defender em processo, pelo prazo que a lei exigir.
      </p>
    ),
  },
  {
    id: "direitos",
    title: "Seus direitos",
    body: (
      <>
        <p>
          Você pode pedir a confirmação de que tratamos seus dados, o acesso a eles, a correção de dados incorretos, a anonimização, o bloqueio ou a eliminação de dados desnecessários, a portabilidade, informações sobre com quem compartilhamos e a revogação do consentimento, quando ele for a base do tratamento.
        </p>
        <p>
          Se você é <strong>aluno</strong> de uma academia que usa o FitBase, faça o pedido primeiro à própria academia, que é a controladora dos seus dados. Nós ajudamos a academia a atendê-lo.
        </p>
        {PRIVACY_CONTACT_EMAIL ? (
          <p>
            Para exercer seus direitos como gestor, escreva para <a href={`mailto:${PRIVACY_CONTACT_EMAIL}`}>{PRIVACY_CONTACT_EMAIL}</a>. Você também pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD).
          </p>
        ) : (
          <p>Você também pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD).</p>
        )}
      </>
    ),
  },
  {
    id: "seguranca",
    title: "Segurança e mudanças nesta política",
    body: (
      <>
        <p>
          Usamos a infraestrutura do Google, com conexão criptografada, e o acesso aos dados de cada academia é restrito à conta dela. Nenhum sistema é totalmente imune a falhas; se houver um incidente que traga risco relevante, avisaremos os afetados e a ANPD, como a lei determina.
        </p>
        <p>
          Esta política pode mudar. Quando mudar, atualizamos a versão no topo da página e, se a mudança for relevante, avisamos no painel.
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Política de Privacidade"
      meta="Versão 2026.1. Como o FitBase trata dados pessoais, em linguagem direta."
      sections={SECTIONS}
      closing="Dúvidas sobre seus dados? Volte ao cadastro quando terminar a leitura."
      other={{ href: "/terms", label: "Termos de Uso" }}
    />
  );
}
