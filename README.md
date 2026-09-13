# TrioCharge — Loja Virtual

Site de vendas para o carregador wireless 3 em 1 (carrega iPhone/MagSafe, Apple Watch e AirPods ao mesmo tempo).

Feito com Next.js + Tailwind CSS. Sem custo de hospedagem (roda de graça na Vercel).

## Rodando localmente

```bash
npm install
npm run dev
```

Depois abra http://localhost:3000

## O que já está pronto

- Landing page completa (hero, benefícios, como funciona, garantia, FAQ)
- Seção de compra com seletor de quantidade e cálculo de frete
- Integração com Mercado Pago (Checkout Pro) já programada — falta só sua chave
- Página de confirmação de pedido (`/sucesso`)

## O que falta configurar antes de vender de verdade

### 1. Mercado Pago (pagamento)

1. Crie uma conta em https://www.mercadopago.com.br
2. Acesse https://www.mercadopago.com.br/developers/panel/app e crie uma aplicação
3. Copie o **Access Token de produção**
4. Copie o arquivo `.env.local.example` para `.env.local` e cole a chave:
   ```
   MERCADOPAGO_ACCESS_TOKEN=seu_token_aqui
   ```
5. Reinicie o servidor (`npm run dev`)

Sem isso, o botão "Finalizar compra" mostra um aviso e não processa pagamento.

### 2. Frete (Melhor Envio)

O cálculo de frete no site hoje é **um valor fixo de exemplo** (arquivo
`app/api/frete/route.ts`). Para calcular o frete real pelo CEP do cliente:

1. Crie uma conta em https://melhorenvio.com.br
2. Gere um token de API no painel
3. Adicione `MELHOR_ENVIO_TOKEN` no `.env.local`
4. Me avise para eu conectar a API de verdade nessa rota

### 3. Preço e estoque

O preço atual (R$ 149,90) é um placeholder em `lib/product.ts`. Assim que você
souber o custo do fornecedor + frete de importação, me passe o valor e eu
ajusto a margem e o preço final.

### 4. Domínio e publicação

O site está pronto para publicar de graça na Vercel:

```bash
npx vercel
```

Isso gera um link público em segundos. Depois, se quiser um domínio próprio
(ex: `triocharge.com.br`), é só comprar (Registro.br, ~R$ 40/ano) e apontar
para a Vercel — te ajudo nesse passo quando chegar a hora.

## Fotos do produto

As imagens em `public/produto/` vieram do fornecedor (Gorila Shield). Quando
o produto físico chegar, vale substituir por fotos e vídeos próprios — passa
mais confiança para o cliente do que imagens genéricas de fornecedor.
