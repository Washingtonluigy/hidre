#!/usr/bin/env node

/**
 * Este script precisa ser executado com as credenciais de service_role do Supabase
 *
 * Para aplicar as migrations automaticamente:
 * 1. Vá para: https://supabase.com/dashboard/project/jlkwxwrimwntrytbjemx/settings/api
 * 2. Copie a chave "service_role" (NÃO a anon key)
 * 3. Execute: SUPABASE_SERVICE_KEY="sua-service-key" node apply-migration.js
 */

const fs = require('fs');
const https = require('https');

const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const PROJECT_URL = 'https://jlkwxwrimwntrytbjemx.supabase.co';

if (!SERVICE_KEY) {
  console.error('\n❌ ERRO: SUPABASE_SERVICE_KEY não fornecida');
  console.error('\nPara executar este script:');
  console.error('1. Acesse: https://supabase.com/dashboard/project/jlkwxwrimwntrytbjemx/settings/api');
  console.error('2. Copie a chave "service_role"');
  console.error('3. Execute: SUPABASE_SERVICE_KEY="sua-key" node apply-migration.js\n');
  process.exit(1);
}

console.log('\n🔄 Aplicando migrations...\n');
console.log('⚠️  AVISO: A API REST do Supabase não suporta execução direta de SQL DDL.');
console.log('📝 Por favor, execute o SQL manualmente:\n');
console.log('1. Acesse: https://supabase.com/dashboard/project/jlkwxwrimwntrytbjemx/sql/new');
console.log('2. Copie o conteúdo do arquivo: complete-migration.sql');
console.log('3. Cole no SQL Editor e execute\n');

process.exit(0);
