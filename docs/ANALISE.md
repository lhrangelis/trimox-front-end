# Análise crítica do front-end exportado do Claude Design

Este documento avalia os três arquivos exportados do Claude Design (`Trimox.html`, `Trimox_APP_Barber.html` e `Trimox_APP_Ceo.html`, agora em [`design/claude-design/`](../design/claude-design)). Ele também explica as decisões tomadas na reescrita em Next.js.

Resumo: **o design é bom e merece ser preservado. Já o código não pode ir para produção.** Os arquivos são protótipos navegáveis, não uma aplicação. A reescrita mantém a identidade visual, os textos e os fluxos, e troca toda a base técnica.

---

## 1. O que existe nos arquivos

Cada `.html` é um **pacote compactado** do Claude Design. Dentro de tags `<script type="__bundler/...">` há JSON com recursos em gzip + base64. Ao abrir, um carregador descompacta tudo no navegador e monta cada tela em um `<iframe>` separado. Cada tela, por sua vez, é **outro pacote aninhado**.

| Arquivo | Telas (artboards) |
|---|---|
| `Trimox.html` | Logo e identidade · Landing page · Agendamento do cliente (mobile) · Criar conta · Entrar |
| `Trimox_APP_Barber.html` | Agenda · Clientes · Serviços · Profissionais · Caixa · Comissões · Relatórios · Configurações |
| `Trimox_APP_Ceo.html` | Visão geral · Clientes · Financeiro · Planos e recursos |

São 17 telas no total. Depois de descompactar:

| Conteúdo | Tamanho |
|---|---|
| Runtime do Claude Design + React 18 + ReactDOM (repetidos **17 vezes**) | ~3,2 MB |
| Fontes WOFF2 embutidas (repetidas por tela) | ~0,9 MB |
| **Marcação e lógica das telas (o que importa)** | **~0,45 MB** |

Ou seja, **cerca de 90% dos bytes são infraestrutura duplicada**.

---

## 2. Problemas técnicos

### 2.1 Arquitetura e entrega
- **Não é código-fonte.** É um artefato de exportação, sem controle de versão útil: um diff de uma linha vira um blob base64 inteiro.
- **Precisa de JavaScript para mostrar qualquer coisa**, até a landing page. Buscadores e redes sociais recebem só "Loading Trimox…" (**SEO zero**, sem prévia de link).
- **Iframes por tela:** não existe navegação real entre telas. Os links apontam para arquivos que não existem (`Login.dc.html`, `Cadastro.dc.html`, `Agenda.dc.html`… são 15 destinos inválidos).
- O React 18 UMD é carregado 17 vezes. Não há code-splitting, cache nem tree-shaking.
- As telas são *artboards* de tamanho fixo (1440 × N px, 390 × 844 px). Não há layout de aplicação.

### 2.2 Estilo
- **1.605 atributos `style="…"` inline.** Não há uma única classe CSS reutilizável.
- São **43 cores hexadecimais diferentes** sem token. O verde da marca `#1F4A3E` aparece 113 vezes escrito à mão. Trocar a cor da marca exigiria um *find & replace* arriscado.
- Algumas cores de gráfico (`#178563`, `#B5761A`, `#C2412D`) não fazem parte da paleta documentada na tela de identidade.
- O logo em SVG está copiado 21 vezes, a barra lateral 12 vezes e o *switch* 10 vezes. Não há componentes.
- Os hovers e focos visíveis dependem do navegador. Não há estado `:focus-visible` desenhado.

### 2.3 Lógica (JavaScript)
- Usa ES5 (`var`, 231 ocorrências) e uma classe `DCLogic` proprietária, com estado só em memória.
- Os booleanos são passados como **string** (`pressed: on ? 'true' : 'false'`) e as cores são calculadas no JS (`bg: on ? '#15171A' : '#FFFFFF'`), misturando estilo e lógica.
- A formatação de moeda é feita com regex própria (`replace(/\B(?=(\d{3})+(?!\d))/g, '.')`) em vez de `Intl.NumberFormat`. Há três versões diferentes dessa função espalhadas pelas telas.
- **47 de 94 botões não fazem nada** (sem handler), por exemplo "Novo agendamento", "Salvar alterações", "Exportar", paginação e busca.
- Os formulários não têm `onSubmit`, validação, estados de erro nem de carregamento.
- Os dados de exemplo estão espalhados como *arrays* posicionais (`['Gabriel Ramos', '(11) 98765-4321', 'Hoje', 38, '2.470', …]`). São ilegíveis e sem tipagem.

### 2.4 Acessibilidade
Pontos positivos que foram mantidos: alvos de toque com 44 px, `aria-label` nos botões de ícone, `aria-current` no menu, `aria-pressed` nos filtros e `lang="pt-BR"`.

Problemas corrigidos na reescrita:
- **Switches** usam `aria-pressed` em vez de `role="switch"` + `aria-checked`.
- **Abas** (Configurações) e controles segmentados não usam `tablist`/`radiogroup`.
- **Tabelas são `div` com grid.** Leitores de tela perdem cabeçalhos e a relação entre linha e coluna.
- O texto "visualmente oculto" usa `position: absolute` sem pai posicionado, então pode vazar no layout.
- O mapa de calor e alguns gráficos só respondem a `mouseenter`. No teclado, não há como acessar o dado.
- A página de login tem campos sem `name`, e o checkbox "Manter conectado" não tem `name` nem valor enviado.

### 2.5 Responsividade
- A barra lateral do app só faz `flex-wrap`. No celular, ela vira um bloco enorme no topo da página. **Não existe menu mobile.**
- Agenda, listas e tabelas dependem de rolagem horizontal com `min-width` fixo (720–900 px).

---

## 3. Inconsistências de produto e de dados

Valores que foram conferidos e batem: Caixa (R$ 980 = soma das 11 movimentações), Agenda (23 agendamentos), Relatórios (R$ 43.200 / 606 atendimentos), Financeiro (recebido + a receber = MRR) e ARR = MRR × 12.

Valores que **não batem**:

1. **MRR por plano ≠ MRR total.** Solo R$ 35.328 + Equipe R$ 96.492 + Rede R$ 53.048 = **R$ 184.868**. O painel mostra **R$ 184.870**.
2. **Horário do profissional fora do horário da casa.** Em Configurações, a casa fica *fechada na segunda*. Em Profissionais, Bruno trabalha *segunda das 10:00 às 19:00*. A própria tela diz que o horário do profissional "fica dentro deste intervalo".
3. **Expediente da agenda.** A Agenda diz "expediente 09:00–18:00", mas Rafael trabalha até 19:00 e a casa abre até 20:00 de terça a sexta.
4. **Preços dos planos.** Landing, Cadastro e Agendamento mostram `R$ [PREÇO]` e `R$ [00]`, enquanto o painel do CEO e Configurações já usam R$ 69 / R$ 129 / R$ 349 e Serviços tem preços reais. Há **43 placeholders** (`[N]`, `[Nome da barbearia]`, `[DATA]`…) a decidir.
5. **Limite do plano Equipe.** Aparece "Até [N] profissionais" na landing e "até 6 profissionais" no cadastro e no CEO.
6. **Conta acima do limite do plano.** No painel do CEO, o "Salão Vitória Régia" está no plano Equipe (até 6 profissionais) com **7 profissionais**.

## 4. Riscos de produto (para o back-end)

- **"Acessar como cliente"** (CEO) é *impersonation*. Exige trilha de auditoria, aviso visível de sessão e permissão específica.
- **Suspender conta, reenviar cobrança e enviar comunicado para 1.626 contas** acontecem com um clique, sem confirmação.
- **LGPD:** a ficha do cliente guarda observações como "sensível a amônia", que podem ser dado de saúde. Isso pede base legal, consentimento e controle de acesso por papel. A tela de Profissionais já prevê permissões, mas o back-end precisa garantir isso.
- **Exportação CSV** de 1.626 contas e de clientes finais precisa de controle de acesso e registro.
- Não há telas de **erro, vazio, carregamento, 404**, sessão expirada nem *paywall* de teste encerrado.

---

## 5. A reescrita

### Stack escolhida

| Camada | Escolha | Por quê |
|---|---|---|
| Framework | **Next.js 16 (App Router)** | Landing com HTML pré-renderizado (SEO, prévia de link), app e admin no mesmo projeto, rotas reais e code-splitting por rota |
| UI | **React 19** + **TypeScript** (strict) | Componentes tipados no lugar de markup duplicado |
| Estilo | **Tailwind CSS 4** com tokens em `@theme` | As 43 cores viram ~30 tokens nomeados (`bg-brand`, `text-muted`…), trocáveis em um só lugar |
| Fontes | `next/font` | Schibsted Grotesk + Instrument Serif hospedadas pelo próprio site, sem requisição ao Google nem *layout shift* |
| Qualidade | ESLint (`eslint-config-next`) + `tsc` | — |

### Organização

```
src/
  app/
    (site)/            landing, identidade, entrar, cadastro
    agendar/[slug]/    página pública de agendamento (mobile-first)
    app/               app da barbearia (layout com menu lateral + menu mobile)
    admin/             painel do CEO (layout escuro próprio)
  components/
    brand/             Logo
    ui/                Button, Switch, Badge, StatCard, Segmented, FilterChips, Field…
    layout/            Sidebar e AppShell responsivos
  lib/
    format.ts          moeda/números com Intl (pt-BR)
    data/              dados de exemplo tipados, um arquivo por domínio
```

### O que mudou além da tecnologia
- **Dados tipados e centralizados** em `src/lib/data`, prontos para virar chamadas de API.
- **Inconsistências 1, 2, 3, 5 e 6 corrigidas** nos dados de exemplo:
  - o MRR total passou a ser *derivado* da soma dos planos, e a ponte de MRR e o "a receber" foram recalculados a partir dele;
  - a casa abre na segunda das 10h às 19h;
  - a agenda mostra o expediente real do dia;
  - o Vitória Régia ficou com 6 profissionais.
- **Placeholders de preço** trocados pelos preços já definidos no painel do CEO (Solo R$ 69, Equipe R$ 129, Rede R$ 349) e o teste fixado em 14 dias (o mesmo valor do histórico de contas). Isso é uma **decisão de produto pendente**, e os valores estão em um só lugar (`src/lib/data/plans.ts`). Os logos de clientes na landing continuam como placeholder.
- **Formulários** com `method="post"`: se alguém enviar antes de o JavaScript carregar, a senha não vai parar na URL.
- **Acessibilidade:** `role="switch"`, abas com `tablist`, tabelas semânticas, foco visível e gráficos com texto alternativo e acesso por teclado.
- **Mobile:** menu recolhível no app e no admin.
- **Ações destrutivas** (suspender conta, reenviar cobrança, enviar comunicado) passam a pedir confirmação.

### O que fica para depois
- Integração com back-end/API, autenticação e permissões reais.
- Formulários com validação de servidor (Server Actions ou API).
- Testes (Vitest + Testing Library, Playwright para fluxos).
