const xrpl = require('xrpl');

// Função para criar e financiar a carteira Issuer
async function createAndFundIssuer(client) {
    try {
        const issuerWallet = xrpl.Wallet.generate();

        console.log('Conta Issuer criada com sucesso:');
        console.log(`Endereço: ${issuerWallet.address}`);
        console.log(`Seed: ${issuerWallet.seed}`);
        console.log(`Chave Pública: ${issuerWallet.publicKey}`);
        console.log(`Chave Privada: ${issuerWallet.privateKey}`);

        const response = await client.request({
            method: 'faucet',
            params: {
                destination: issuerWallet.address
            }
        });

        if (response.result && response.result.account) {
            console.log(`Conta Issuer ${issuerWallet.address} financiada com sucesso.`);
        } else {
            console.error(`Erro ao financiar a conta Issuer ${issuerWallet.address}.`);
            return null;
        }

        return issuerWallet;
    } catch (error) {
        console.error('Erro ao criar e financiar a conta Issuer:', error);
        throw error;
    }
}

// Função para criar e emitir um token personalizado para uma empresa
async function createAndIssueCompanyToken(issuerWallet, companyName, clientWallet, amountFIDZ) {
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
    await client.connect();

    // Converte o nome do token para HEX
    const tokenHex = Buffer.from(companyName, "utf8").toString("hex").padEnd(40, '0').toUpperCase();

    try {
        // Configura a Trust Line para a empresa
        const trustLineTx = {
            TransactionType: "TrustSet",
            Account: clientWallet.address, // Endereço do cliente
            LimitAmount: {
                currency: tokenHex,
                issuer: issuerWallet.address,
                value: "1000000" // Limite arbitrário para o token da empresa
            }
        };

        const preparedTrustLine = await client.autofill(trustLineTx);
        const signedTrustLine = clientWallet.sign(preparedTrustLine);
        const trustLineResult = await client.submitAndWait(signedTrustLine.tx_blob);

        if (trustLineResult.result.meta.TransactionResult === "tesSUCCESS") {
            console.log(`Trust Line configurada com sucesso para ${clientWallet.address}`);
        } else {
            console.error(`Erro ao configurar Trust Line: ${trustLineResult.result.meta.TransactionResult}`);
            return;
        }

        // Emite os tokens personalizados para o cliente
        const paymentTx = {
            TransactionType: "Payment",
            Account: issuerWallet.address, // Endereço do emissor
            Destination: clientWallet.address, // Endereço do cliente
            Amount: {
                currency: tokenHex,
                value: (amountFIDZ * 1000).toString(), // 1 token da empresa = 0.001 FIDZ
                issuer: issuerWallet.address // Emissor do token
            }
        };

        const preparedPayment = await client.autofill(paymentTx);
        const signedPayment = issuerWallet.sign(preparedPayment);
        const paymentResult = await client.submitAndWait(signedPayment.tx_blob);

        if (paymentResult.result.meta.TransactionResult === "tesSUCCESS") {
            console.log(
                `Tokens emitidos com sucesso para ${clientWallet.address}: ${amountFIDZ * 1000} tokens da ${companyName}`
            );
        } else {
            console.error(
                `Erro ao emitir tokens. Resultado: ${paymentResult.result.meta.TransactionResult}`
            );
        }
    } catch (error) {
        console.error(`Erro durante a emissão de tokens:`, error);
    } finally {
        await client.disconnect();
    }
}

// Função para realizar a compra de tokens por parte do cliente (pagando em FIDZ)
async function buyTokens(clientWallet, issuerWallet, companyName, fidzAmountToPay) {
    
    const tokenAmount = fidzAmountToPay / 0.001; // Converte o valor em FIDZ para a quantidade de tokens que o cliente quer comprar

    // Emite tokens para o cliente com base no pagamento concluído
    await createAndIssueCompanyToken(issuerWallet, companyName, clientWallet, tokenAmount);
}

module.exports = { createAndFundIssuer, createAndIssueCompanyToken, buyTokens };
