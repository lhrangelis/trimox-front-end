# trimox-front-end

Front-end do **Trimox**, um software de gestão para barbearias e salões de beleza. O projeto reúne:

- **Site:** landing, identidade visual, entrar e criar conta.
- **Agendamento online:** página pública que o cliente final usa para marcar horário.
- **App da barbearia:** agenda, clientes, serviços, profissionais, caixa, comissões, relatórios e configurações.
- **Painel do CEO:** visão geral, clientes, financeiro, planos e recursos.

O código foi reescrito a partir dos protótipos do Claude Design, que estão guardados em [`design/claude-design/`](design/claude-design). A análise crítica do material original e as decisões da reescrita estão em [`docs/ANALISE.md`](docs/ANALISE.md).

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- Tailwind CSS 4, com os tokens da marca em `src/app/globals.css`
- Fontes Schibsted Grotesk e Instrument Serif via `next/font`

## Rodando localmente

Requer Node.js 20 ou mais recente.

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

| Rota | Tela |
|---|---|
| `/` | Landing page |
| `/identidade` | Logo, cores e tipografia |
| `/entrar`, `/cadastro` | Login e criação de conta |
| `/agendar/barbearia-central` | Agendamento do cliente (mobile) |
| `/app/agenda` … `/app/configuracoes` | App da barbearia |
| `/admin` … `/admin/planos` | Painel do CEO |

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Serve o build |
| `npm run lint` | ESLint |

## Estrutura

```
src/
  app/            rotas (site, agendar, app, admin)
  components/     brand, ui, layout, charts
  lib/format.ts   moeda, números e datas em pt-BR
  lib/data/       dados de exemplo tipados (substituir pela API)
```

Ainda não há back-end. Todos os dados vêm de `src/lib/data`, e as ações (salvar, enviar, pagar) só alteram o estado da tela.
