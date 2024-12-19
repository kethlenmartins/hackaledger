const xrpl = require('xrpl');
const { createToken, tokens } = require('./token'); // Importando as funções de token
const { createCoupon, darCupomParaCliente } = require('./coupon'); // Importando as funções de cupons
const { createAndFundWallet, getBalance } = require('./wallet'); // Importando funções de carteiras

(async () => {
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233'); // Conexão com a rede XRPL de testes
    await client.connect();

    // Criar e financiar a carteira da empresa 1
    const empresa1Wallet = await createAndFundWallet(client);
    await getBalance(client, empresa1Wallet);

    // Criar e financiar a carteira da empresa 2
    const empresa2Wallet = await createAndFundWallet(client);
    await getBalance(client, empresa2Wallet);

    // Criar e financiar a carteira do cliente 1
    const cliente1Wallet = await createAndFundWallet(client);
    await getBalance(client, cliente1Wallet);

    // Criar e financiar a carteira do cliente 2
    const cliente2Wallet = await createAndFundWallet(client);
    await getBalance(client, cliente2Wallet);

    // Criando Tokens
    createToken(empresa1Wallet.address, '$BURGUER', 1.2); // Token para hamburgueria (1 token = 1.2 FIDZ)
    createToken(empresa2Wallet.address, '$CAMISETA', 3);  // Token para loja de roupas (1 token = 3 FIDZ)

    // Criando cupons para clientes (com valor fixo de 0.001 FIDZ)
    const cupom1 = await createCoupon(empresa1Wallet.address, 'Hamburguer XPresso', 0.001); // 0.001 FIDZ = 1 token (XRP)
    const cupom2 = await createCoupon(empresa2Wallet.address, 'Camiseta', 0.001); // 0.001 FIDZ = 1 token (XRP)

    if (!empresa1Wallet.address || !cliente1Wallet.address) {
        console.error('Erro: Endereço da carteira não encontrado.');
    } else {
        console.log(`Transferindo cupom da Empresa 1 para Cliente 1: ${cupom1.produto}`);
        await darCupomParaCliente(client, empresa1Wallet, cliente1Wallet, cupom1); // Empresa 1 -> Cliente 1
    }

    if (!empresa2Wallet.address || !cliente2Wallet.address) {
        console.error('Erro: Endereço da carteira não encontrado.');
    } else {
        console.log(`Transferindo cupom da Empresa 2 para Cliente 2: ${cupom2.produto}`);
        await darCupomParaCliente(client, empresa2Wallet, cliente2Wallet, cupom2); // Empresa 2 -> Cliente 2
    }

    // Desconectando
    await client.disconnect();
})();
