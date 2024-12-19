# Documentação dos hooks

## O que é um hook?
Um hook é um código que permite adicionar lógicas personalizadas na XRPL sempre que certas condições sejam atendidas. Os hooks retiram a necessidade de utilizar smart contracts, conforme acontece na Ethereum. Dessa forma, os hooks interagem com a blockchain diretamente a partir de uma conta em vez de serem deployados.

## Hooks do projeto

O projeto conta com os seguintes hooks:
- wallet.js -> lógica de criação das carteiras de empresas e clientes
- issuer.js -> lógica de criação de carteira para emitir FIDZ e controle das transações com FIDZ
- token.js -> lógica para criação de tokens pelas empresas
- coupon.js -> lógica para criação de cupons baseados nos tokens de cada empresa
- transactions.js -> lógica para envio de cupons envolvendo XRP

Além disso, é possível testar o projeto acessando src/tests/xrpl.test.js.

## Como testar a conexão com a XRP Ledger

Para testar a conexão com a XRPL, execute os seguintes comandos em seu terminal:
- `npm install`
- `cd src`
- `node index.js`

Após instalar as dependências e navegar para o diretório correto, o servidor index.js centraliza os diferentes hooks e efetua a XRPL. No terminal, será possível consultar endereços de 4 carteiras (2 empresariais e 2 de cliente). 

Copie o endereço de uma das carteiras e navegue até o [XRPL Explorer da testnet](https://testnet.xrpl.org/). Cole o endereço da carteira na aba de pesquisa e verifique o balance e as transações da carteira recém criada.

Verifique o exemplo da carteira `rP3hfgByFsbtu4F49iqDDVSx3Ls4Webeyr` no [link a seguir](https://testnet.xrpl.org/accounts/rP3hfgByFsbtu4F49iqDDVSx3Ls4Webeyr).