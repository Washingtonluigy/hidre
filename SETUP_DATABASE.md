# 🔧 Configuração Rápida do Banco de Dados

## Passo 1: Criar Projeto Supabase (2 minutos)

1. Acesse: **https://app.supabase.com**
2. Clique em **"New Project"**
3. Preencha:
   - **Name**: `business-management-system`
   - **Database Password**: (anote essa senha!)
   - **Region**: `South America (São Paulo)` ou mais próximo
4. Clique em **"Create new project"**
5. ⏳ Aguarde ~2 minutos enquanto o projeto é criado

## Passo 2: Copiar Credenciais (30 segundos)

1. No projeto criado, clique em **⚙️ Settings** (canto inferior esquerdo)
2. Clique em **API**
3. Copie os seguintes valores:
   - **Project URL** (algo como: `https://xxxxx.supabase.co`)
   - **anon public** (chave que começa com `eyJ...`)

## Passo 3: Atualizar .env (30 segundos)

Abra o arquivo `.env` na raiz do projeto e substitua:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...sua-chave-aqui...
```

## Passo 4: Aplicar Migrations (1 minuto)

1. No dashboard do Supabase, clique em **🔍 SQL Editor** (menu lateral)
2. Clique em **"New query"**
3. Abra o arquivo `complete-migration.sql` (está na raiz do projeto)
4. **Copie TODO o conteúdo** do arquivo
5. **Cole** no SQL Editor do Supabase
6. Clique em **"Run"** (ou pressione Ctrl+Enter)
7. ✅ Aguarde a mensagem de sucesso

## Passo 5: Pronto! 🎉

Execute:
```bash
npm run build
```

E recarregue a aplicação. **Ambos os módulos** (Admin e Vendor) agora compartilham o mesmo banco de dados!

---

## ❓ Problemas Comuns

### Erro: "relation already exists"
**Solução**: Algumas tabelas já existem. Ignore esse erro, é normal.

### Erro: "permission denied"
**Solução**: Certifique-se de estar logado no dashboard do Supabase.

### Dados não aparecem
**Solução**: Limpe o cache do navegador (Ctrl+Shift+R) e verifique se o `.env` foi atualizado corretamente.

---

## 📊 O que foi criado no banco?

O script `complete-migration.sql` cria:
- ✅ Tabela de usuários (profiles)
- ✅ Tabela de clientes (customers) **com campo address**
- ✅ Tabela de produtos (products)
- ✅ Tabela de serviços (services)
- ✅ Tabela de vendas (sales)
- ✅ Tabela de orçamentos (quotations)
- ✅ Tabela de manutenções (maintenance_records)
- ✅ Tabela de visitas (visits)
- ✅ Tabela de transações financeiras (financial_transactions)
- ✅ Tabela de contas bancárias (bank_accounts)
- ✅ Tabela de fornecedores (vendors)
- ✅ Políticas de segurança (RLS) configuradas

**Tempo total**: ~5 minutos
