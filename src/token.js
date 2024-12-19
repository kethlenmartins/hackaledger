// Um objeto para armazenar os tokens criados
const tokens = {};

// Função para criar um token para uma empresa
function createToken(empresaAddress, nomeToken, taxaEmFIDZ) {
    // Valida se já existe um token para a empresa
    if (tokens[empresaAddress]) {
        console.log(`Token já criado para a empresa ${empresaAddress}`);
        return;
    }

    // Armazena o token com o nome e a taxa de conversão para FIDZ
    tokens[empresaAddress] = {
        nome: nomeToken,
        taxa: taxaEmFIDZ
    };

    console.log(`Token criado: ${nomeToken} (${empresaAddress}) - 1 ${nomeToken} = ${taxaEmFIDZ} FIDZ`);
}

module.exports = {
    createToken,
    tokens
};
