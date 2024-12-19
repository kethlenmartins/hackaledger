const xrpl = require('xrpl');

/**
 * Cria um cupom para um produto específico
 * @param {string} empresaAddress - Endereço da carteira da empresa
 * @param {string} produto - Nome do produto que está atrelado ao token
 * @param {number} valorEmToken - Quantidade de tokens associados ao cupom
 * @returns {object} 
 */
async function createCoupon(empresaAddress, produto, valorEmToken) {
    // Valida o valor em tokens
    if (isNaN(valorEmToken) || valorEmToken <= 0) {
        console.error(`Valor inválido do cupom para o produto ${produto}: ${valorEmToken}`);
        return { produto, valorEmToken: 'undefined', valorEmFIDZ: 'undefined' };
    }

    const valorEmFIDZ = 0.001;  // Valor fixo e baixo em vez de doação

    const cupom = {
        produto,
        valorEmToken,  // valor em tokens da empresa
        valorEmFIDZ    // Valor fixo em FIDZ
    };

    console.log(`Cupom criado para a empresa ${empresaAddress}:`);
    console.log(`Produto: ${produto}`);
    console.log(`Valor em token ${produto}: ${valorEmToken}`);
    console.log(`Equivalente em FIDZ: ${valorEmFIDZ}`);
    
    return cupom;
}

/**
 * Atribui um cupom a um cliente
 * @param {object} client - Cliente XRPL -> conexão na xrpl
 * @param {object} empresaWallet - Carteira da empresa
 * @param {object} clienteWallet - Carteira do cliente
 * @param {object} cupom
 */
async function darCupomParaCliente(client, empresaWallet, clienteWallet, cupom) {
    try {

        if (cupom.valorEmToken === 'undefined') {
            throw new Error('Valor do cupom inválido');
        }

        const amountInDrops = xrpl.xrpToDrops(cupom.valorEmToken);

        const transaction = {
            TransactionType: 'Payment',
            Account: empresaWallet.address,
            Destination: clienteWallet.address,
            Amount: amountInDrops,
        };

        const prepared = await client.autofill(transaction);
        if (!prepared) {
            throw new Error('Erro ao preencher a transação.');
        }

        const signed = empresaWallet.sign(prepared);

        if (!signed || !signed.tx_blob) {
            throw new Error('Erro: tx_blob não gerado.');
        }

        const result = await client.submitAndWait(signed.tx_blob);

        if (!result || !result.result) {
            throw new Error('Erro: Resultado da transação inválido.');
        }

        return result; 
    } catch (error) {
        console.error('Erro ao transferir cupom:', error);
        return undefined;
    }
}

module.exports = { 
    createCoupon,
    darCupomParaCliente
};
