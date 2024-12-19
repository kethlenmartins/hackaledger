const xrpl = require('xrpl');

// Função para enviar XRP
async function sendXRP(client, senderWallet, receiverAddress, amount, tag, senderType) {
    if (senderType !== 'empresa') {
        console.error('Apenas carteiras empresariais podem enviar XRP.');
        return;
    }

    const payment = {
        TransactionType: 'Payment',
        Account: senderWallet.address,
        Amount: xrpl.xrpToDrops(amount),
        Destination: receiverAddress,
        DestinationTag: tag
    };

    const prepared = await client.autofill(payment);
    const signed = senderWallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);

    if (result.result.meta.TransactionResult === 'tesSUCCESS') {
        console.log(`Pagamento enviado com sucesso. Tag de Destino: ${tag}`);
    } else {
        console.error(`Erro ao enviar pagamento: ${result.result.meta.TransactionResult}`);
    }
}

// Função para gastar XRP
async function spendXRP(client, customerWallet, targetBusinessWallet, amount, tag) {
    const payment = {
        TransactionType: 'Payment',
        Account: customerWallet.address,
        Amount: xrpl.xrpToDrops(amount),
        Destination: targetBusinessWallet,
        DestinationTag: tag
    };

    const prepared = await client.autofill(payment);
    const signed = customerWallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);

    if (result.result.meta.TransactionResult === 'tesSUCCESS') {
        console.log(`Pagamento enviado com sucesso para a empresa com Tag: ${tag}`);
    } else {
        console.error(`Erro ao enviar pagamento: ${result.result.meta.TransactionResult}`);
    }
}

module.exports = { sendXRP, spendXRP };
