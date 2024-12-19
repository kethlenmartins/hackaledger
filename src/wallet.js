const xrpl = require('xrpl');

// Função para criar e financiar uma carteira automaticamente usando o XRPL
async function createAndFundWallet(client) {
    try {
        // Criação e financiamento de carteira com o faucet nativo da xrpl
        const fundedWallet = (await client.fundWallet()).wallet;

        console.log('Carteira criada e financiada com sucesso:');
        console.log(`Endereço: ${fundedWallet.address}`);
        console.log(`Seed: ${fundedWallet.seed}`);
        console.log(`Chave Pública: ${fundedWallet.publicKey}`);
        console.log(`Chave Privada: ${fundedWallet.privateKey}`);

        return fundedWallet;
    } catch (error) {
        console.error('Erro ao criar e financiar a carteira:', error);
        throw error;
    }
}

// Função para obter o saldo de uma conta
async function getBalance(client, wallet) {
    try {
        const balance = await client.getXrpBalance(wallet.address);
        console.log(`Saldo da carteira (${wallet.address}): ${balance} XRP`);
        return balance;
    } catch (error) {
        console.error(`Erro ao obter saldo da carteira ${wallet.address}:`, error);
        throw error;
    }
}

module.exports = { createAndFundWallet, getBalance };
