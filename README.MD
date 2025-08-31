# Projeto de Automação com Playwright

Este projeto utiliza Playwright com TypeScript para automação de testes end-to-end, suportando múltiplos ambientes (UAT, RC, etc...) com configuração via arquivos `.env`.

---

## Estrutura do projeto

- `playwright.config.ts` — Configuração principal do Playwright, carregando variáveis de ambiente conforme o ambiente selecionado.
- `tests/` — Diretório onde ficam os testes automatizados.
- `.env.uat`, `.env.rc`, `.env.prd` — Arquivos de configuração de variáveis de ambiente para cada ambiente.

---

## Pré-requisitos

- Node.js (versão 16 ou superior recomendada)
- npm ou yarn
- Navegadores suportados pelo Playwright (serão instalados automaticamente)

---

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/RafaelFerSilva/playwright_code_base_ts.git
   cd playwright_code_base_ts
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```
3. Instale o cross-env para garantir compatibilidade na definição de variáveis de ambiente:
   ```bash
   npm install --save-dev cross-env
   # ou
   yarn add --dev cross-env
   ```

## Configuração dos ambientes

Crie os arquivos .env.uat, .env.rc e na raiz do projeto com as variáveis específicas para cada ambiente. Exemplo .env.uat:

    BASE_URL=https://uat.seusite.com
    HEADLESS=false
    TRACE=on
    SCREENSHOT=only-on-failure
    VIDEO=off
    ACTION_TIMEOUT=15000
    NAVIGATION_TIMEOUT=30000
    TEST_TIMEOUT=60000
    RETRIES=1
    REPORTER=html
    TEST_CHROMIUM=true
    TEST_FIREFOX=true
    TEST_WEBKIT=true
    TEST_MOBILE=true

- BASE_URL: URL base para os testes em cada ambiente.
- HEADLESS: se o navegador roda em modo headless (true/false).
- TRACE: ativa ou não o trace para debugging.
- SCREENSHOT: captura screenshot só em falhas ou desativa.
- VIDEO: grava vídeo dos testes (off, on, retain-on-failure).
- ACTION_TIMEOUT e NAVIGATION_TIMEOUT: tempos para ações e navegação.
- TEST_TIMEOUT: timeout global do teste.
- RETRIES: número de tentativas em caso de falha.
- REPORTER: formato do relatório.
- TEST_CHROMIUM, TEST_FIREFOX, TEST_WEBKIT, TEST_MOBILE: ativar/desativar execução em cada projeto.

Ajuste os valores conforme necessário para cada ambiente.

## Scripts para execução dos testes

No package.json estão configurados scripts para facilitar a execução dos testes em cada ambiente:

```json
"scripts": {
  "test:uat": "cross-env ENV=uat npx playwright test",
  "test:rc": "cross-env ENV=rc npx playwright test",
}
```

## Como executar

Para rodar os testes no ambiente UAT:

    npm run test:uat

Para rodar no ambiente RC:

    npm run test:rc

## Personalização

- Variáveis de ambiente controlam comportamento como modo headless, captura de screenshots, gravação de vídeo, retries, timeouts, e quais browsers executar.

- Ajuste os arquivos .env.\* para alterar essas configurações sem modificar o código.

- Para rodar testes em browsers específicos, use as variáveis TEST_CHROMIUM, TEST_FIREFOX, TEST_WEBKIT e TEST_MOBILE com valores true ou false.

## Relatórios

O relatório padrão é em HTML e será gerado na pasta playwright-report após a execução dos testes.

Você pode alterar o formato do relatório via variável REPORTER no arquivo .env.

## Dicas

- Use HEADLESS=false para ver os testes rodando visualmente durante o desenvolvimento.
- Ative TRACE=on para gerar traces detalhados em caso de falhas.
- Ajuste RETRIES para controlar quantas vezes um teste falha será reexecutado.
