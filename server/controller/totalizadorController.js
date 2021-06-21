const pessoa = require('../model/people');
const receita = require('../model/receita');

async function totalizador(req,res) {
    try {
        const pessoas = await pessoa.pessoaModel.find({
            ativo: true
        })
        let soma = 0
        for (let i= 0; i< pessoas.length; i++){
            const pessoa = pessoas[i]
            const receitas = await receita.receitaModel.find({
                pessoaId: pessoa._id
            })
            for(let j = 0; j < receitas.length; j++){
                soma = soma + receitas[j].valor
            }
        }
        res.status(200).json(soma)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
exports.totalizador = totalizador