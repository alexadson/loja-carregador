# TrioCharge — Loja Virtual

Loja virtual completa para venda de um único produto: uma estação de
carregamento wireless 3 em 1, que carrega iPhone (MagSafe), Apple Watch e
AirPods ao mesmo tempo.

Site no ar: **https://loja-carregador.vercel.app**

## Sobre o projeto

Este projeto nasceu de uma conversa simples: montar uma loja online para
revender um carregador wireless importado de um fornecedor (Gorila Shield),
com o menor custo possível pra começar — hospedagem gratuita, sem
mensalidade de plataforma (tipo Shopify), e reinvestindo em tráfego pago só
depois das primeiras vendas.

Foi construído do zero com **Claude Code**, incluindo toda a parte de
negócio junto com o código: comparação de preço com o fornecedor original,
estratégia de aquisição de clientes (orgânico → tráfego pago), e as
integrações reais de pagamento e frete (não são simulações).

## Produto

- **Nome na loja:** TrioCharge
- **Fornecedor:** Gorila Shield (SKU GS-11233)
- Carrega simultaneamente: iPhone (encaixe magnético MagSafe), Apple Watch e
  AirPods
- Entrada USB-C, indicador de LED, design compacto

## Stack técnica

- **Next.js 16** (App Router, Turbopack) + **TypeScript**
- **Tailwind CSS 4**
- **lucide-react** para ícones
- Hospedagem: **Vercel** (plano gratuito)
- Sem banco de dados — o catálogo é um único produto (`lib/product.ts`)

## Funcionalidades

### Landing page de conversão (`app/page.tsx`)
Hero com vídeo do produto em autoplay, seção de benefícios, "como funciona",
garantia, seção de compra e FAQ.

### Vídeo do produto
Vídeo de demonstração do fornecedor, hospedado no **Streamable** (gratuito)
e incorporado com autoplay mudo em loop. (YouTube Shorts foi testado
primeiro, mas a plataforma bloqueia incorporação em outros sites mesmo com
a opção "permitir incorporação" ativada — por isso a troca para Streamable.)

### Frete real (Melhor Envio)
`lib/melhorEnvio.ts` calcula o frete de verdade via API do Melhor Envio,
comparando Correios e transportadoras privadas (Jadlog, Loggi, JeT, etc.),
usando o CEP de origem do estoque (`lib/shipping.ts`) e o CEP do cliente.
Sem o token configurado, cai automaticamente em um valor fixo de exemplo
(não quebra o site).

### Pagamento — dois caminhos
1. **Pix com QR Code na própria página** (`app/api/pix/`): usa a API de
   Pagamentos do Mercado Pago para gerar o QR Code e o código copia-e-cola
   sem sair do site, com contagem regressiva de expiração e verificação
   automática do status a cada poucos segundos até a aprovação.
2. **Cartão ou boleto** (`app/api/checkout/`): usa o Checkout Pro do
   Mercado Pago, redirecionando para a página de pagamento hospedada por
   eles.

Em ambos os casos, o preço do frete é **sempre recalculado no servidor**
no momento do pagamento (nunca confiando no valor vindo do navegador) —
proteção contra manipulação do valor cobrado. Essa lógica compartilhada
fica em `lib/order.ts`.

### Analytics e rastreamento de conversão
Google Analytics (GA4) e Meta Pixel (`components/analytics/`), inativos até
as variáveis de ambiente serem preenchidas. Disparam eventos de início de
checkout e compra concluída com o valor real do pedido
(`lib/analytics.ts`), preparando o terreno para campanhas de tráfego pago
(Meta Ads/Google Ads) com público de remarketing desde o primeiro dia.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000

## Variáveis de ambiente

Copie `.env.local.example` para `.env.local` e preencha:

| Variável | Para quê | Onde conseguir |
|---|---|---|
| `MERCADOPAGO_ACCESS_TOKEN` | Processar pagamentos (Pix, cartão, boleto) | [Painel de desenvolvedores do Mercado Pago](https://www.mercadopago.com.br/developers/panel/app) |
| `MELHOR_ENVIO_TOKEN` | Calcular frete real | Painel do [Melhor Envio](https://melhorenvio.com.br) → Integrações → Tokens |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics (GA4) | [analytics.google.com](https://analytics.google.com) → Admin → Fluxos de dados |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel (Facebook/Instagram Ads) | [business.facebook.com/events_manager](https://business.facebook.com/events_manager) |

Sem `MERCADOPAGO_ACCESS_TOKEN`, os botões de pagamento mostram um aviso e
não processam nada. Sem `MELHOR_ENVIO_TOKEN`, o frete cai num valor fixo de
exemplo.

## Deploy

```bash
npx vercel --prod
```

As variáveis de ambiente de produção são gerenciadas com:

```bash
npx vercel env add NOME_DA_VARIAVEL production
```

## Estrutura do projeto

```
app/
  page.tsx              → monta a landing page a partir dos componentes
  api/checkout/         → cria preferência de pagamento (cartão/boleto)
  api/pix/               → cria e consulta o status do pagamento Pix
  api/frete/             → calcula o frete
  sucesso/               → página de confirmação pós-pagamento
components/
  Hero, Benefits, HowItWorks, Guarantee, BuyBox, FAQ, Footer
  BuyBox.tsx             → toda a lógica de compra (quantidade, frete, e-mail, Pix/cartão)
  PixPayment.tsx         → exibição do QR Code e verificação de status
  analytics/             → Google Analytics e Meta Pixel
lib/
  product.ts             → dados do produto (nome, preço)
  shipping.ts             → CEP de origem e dimensões da embalagem
  melhorEnvio.ts          → integração com a API do Melhor Envio
  order.ts                → validação e cálculo do pedido (compartilhado entre checkout e Pix)
  currency.ts             → formatação de moeda (BRL)
  analytics.ts            → helpers de rastreamento de conversão
public/produto/           → fotos do produto (fornecidas pelo fornecedor)
```

## Decisões e aprendizados ao longo da construção

- **Preço do produto**: comparado com o preço oficial da Gorila Shield
  (que vende um modelo equivalente por R$ 147–188) para não ficar nem caro
  nem abaixo do mercado.
- **Modelo de negócio**: compra de estoque próprio em vez de dropshipping,
  pela entrega mais rápida e controle de qualidade.
- **YouTube Shorts não é incorporável** em sites de terceiros mesmo com a
  opção de incorporação ativada — Streamable resolveu sem esse problema.
- **Preço total no checkout**: o total exibido soma produto + frete, e o
  valor cobrado no Mercado Pago é sempre igual ao exibido (frete
  revalidado no servidor a cada tentativa de pagamento).
- **Contas de terceiros** (Mercado Pago, Melhor Envio, Vercel, YouTube):
  todas as etapas de login, criação de conta e geração de chave de API
  foram feitas pelo dono da loja — o assistente nunca manipula senhas,
  CPF ou dados bancários diretamente.

## Próximos passos

- [ ] Trocar fotos/vídeo do fornecedor por conteúdo próprio depois que o
      estoque chegar
- [ ] Configurar domínio próprio (ex: `triocharge.com.br`)
- [ ] Configurar e-mail transacional de confirmação de pedido
- [ ] Configurar Google Analytics e Meta Pixel com os IDs reais
- [ ] Testar uma compra real de ponta a ponta (Pix e cartão)
