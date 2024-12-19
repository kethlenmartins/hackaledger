const xrpl = require('xrpl');
const { createToken, tokens } = require('../token');
const { createCoupon, darCupomParaCliente } = require('../coupon');
const { createAndFundWallet, getBalance } = require('../wallet');

describe('XRPL Functionalities', () => {
    let client;

    beforeAll(async () => {
        client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
        await client.connect();
    });

    afterAll(async () => {
        if (client && client.isConnected()) {
            await client.disconnect();
        }
    });

    test(
        'Create and fund wallets',
        async () => {
            const wallet = await createAndFundWallet(client);
            expect(wallet).toHaveProperty('address');
            expect(wallet).toHaveProperty('publicKey');
            expect(wallet).toHaveProperty('privateKey');

            const balance = await getBalance(client, wallet);
            expect(balance).toBeGreaterThanOrEqual(100);
        },
        30000 // Timeout aumentado
    );

    test('Create tokens for a company', () => {
        const companyWallet = { address: 'rBeS7CwSfRf7MBu2TyPP56rAmUh1YLVNag' }; // Mock wallet
        const tokenName = '$BURGUER';
        const conversionRate = 1.2;

        createToken(companyWallet.address, tokenName, conversionRate);
        expect(tokens).toHaveProperty(companyWallet.address);
        expect(tokens[companyWallet.address].nome).toBe(tokenName);
        expect(tokens[companyWallet.address].taxa).toBe(conversionRate);
    });

    test('Create a coupon', async () => {
        const companyWallet = { address: 'rBeS7CwSfRf7MBu2TyPP56rAmUh1YLVNag' }; // Mock wallet
        const product = 'Hamburguer XPresso';
        const tokenValue = 5;

        const coupon = await createCoupon(companyWallet.address, product, tokenValue);
        expect(coupon).toHaveProperty('produto');
        expect(coupon.produto).toBe(product);
        expect(coupon).toHaveProperty('valorEmToken');
        expect(coupon.valorEmToken).toBe(tokenValue);
    });

    test(
        'Transfer coupon from company to client',
        async () => {
            const companyWallet = await createAndFundWallet(client);
            const clientWallet = await createAndFundWallet(client);
    
            console.log('Company Wallet:', companyWallet);
            console.log('Client Wallet:', clientWallet);
    
            const coupon = await createCoupon(companyWallet.address, 'Hamburguer XPresso', 5);
            console.log('Coupon Created:', coupon);
    
            const result = await darCupomParaCliente(client, companyWallet, clientWallet, coupon);
            console.log('Transfer Result:', result);
    
            expect(result).not.toBeUndefined();
            expect(result).not.toBeNull();
    
            // Corrigido para acessar a propriedade correta
            expect(result.result.meta.TransactionResult).toBe('tesSUCCESS');
        },
        30000 // Timeout aumentado
    );
    
    
});
