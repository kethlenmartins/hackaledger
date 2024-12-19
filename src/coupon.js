const xrpl = require('xrpl');

/**
 * Cria um cupom para um produto específico.
 * @param {string} empresaAddress - Endereço da empresa.
 * @param {string} produto - Nome do produto.
 * @param {number} valorEmToken - Quantidade de tokens associados ao cupom.
 * @returns {object} - Objeto do cupom criado.
 */
async function createCoupon(empresaAddress, produto, valorEmToken) {
    // Validando o valor em tokens
    if (isNaN(valorEmToken) || valorEmToken <= 0) {
        console.error(`Valor inválido do cupom para o produto ${produto}: ${valorEmToken}`);
        return { produto, valorEmToken: 'undefined', valorEmFIDZ: 'undefined' }; // Retorna erro explícito
    }

    const valorEmFIDZ = 0.001;  // Valor fixo para o cupom em FIDZ

    const cupom = {
        produto,
        valorEmToken,  // Este é o valor em tokens
        valorEmFIDZ    // Valor fixo em FIDZ
    };

    console.log(`Cupom criado para a empresa ${empresaAddress}:`);
    console.log(`Produto: ${produto}`);
    console.log(`Valor em token ${produto}: ${valorEmToken}`);
    console.log(`Equivalente em FIDZ: ${valorEmFIDZ}`);
    
    return cupom;
}

/**
 * Atribui um cupom a um cliente.
 * @param {object} client - Cliente XRPL.
 * @param {object} empresaWallet - Carteira da empresa.
 * @param {object} clienteWallet - Carteira do cliente.
 * @param {object} cupom - Cupom a ser atribuído.
 */
async function darCupomParaCliente(client, empresaWallet, clienteWallet, cupom) {
    try {
        console.log('Iniciando transferência de cupom...');

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

        // Adicione log para depuração do resultado
        console.log('Resultado da transação:', result);

        if (!result || !result.result) {
            throw new Error('Erro: Resultado da transação inválido.');
        }

        return result;  // Retorne o resultado da transação para o teste
    } catch (error) {
        console.error('Erro ao transferir cupom:', error);
        return undefined;
    }
}

module.exports = { 
    createCoupon,
    darCupomParaCliente
};
