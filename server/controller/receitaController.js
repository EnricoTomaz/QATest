const receita = require('../model/receita');
const moment = require('moment');
const pessoa = require('../model/people')
const mongoose = require('mongoose');


/**
 * A função Assíncrona "post", após as validações necessárias,
 * permite a criação de updates nas receitas(novos cadastros).
 * a função save(), que recebe os dados do modelo, 
 * retorna um json representando a nova
 * linha criada no DB.
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @returns {Object}
 */
async function post(req, res){
    try {
        const pessoaId = req.body.pessoaId
        const data = req.body.data
        const valor = req.body.valor

        if(!moment(data).isValid()){
            res.status(400).json({
                message:"Formato de data invalido."
            })
        }
        if (moment(data).isAfter(moment())) {
            res.status(400).json({
                message:"Data não pode ser maior que a de hoje"
            })
        }
        if (valor <= 0) {
            res.status(400).json(
                {
                    message:"Valor não pode ser menor/igual a zero"
                }
            )

        }
        if ( !mongoose.Types.ObjectId.isValid(pessoaId) ) {
            res.status(400).json({
                message:'valor informado não pode ser ID do banco'
            })

        }
        // a função find busca no banco na tabela pessoa as linhas para a condicao dada como argumento 
        const existePessoa = await pessoa.pessoaModel.find({_id:pessoaId})
        console.log(existePessoa)
        if(existePessoa.length === 0){
            res.status(400).json({
                message:"Pessoa não cadastrada"
            })

        }

        const newReceita = new receita.receitaModel({
            pessoaId:pessoaId,
            data: moment(data).format("YYYY-MM-DD"),
            valor:valor
        })
    
        // salva no banco
        const dado = await newReceita.save(newReceita);
        res.status(201).json(dado)

    } catch (e) {
        res.status(500).json({message:e.message})
    }
}
exports.post = post


/**
 * Esta função assíncrona usa a função find() para procurar
 * todas as receitas.
 * @param {Object} req 
 * @param {Object} res
 * @returns {Array} 
 */
async function searchReceitas(req,res) {
    try {
        const pagina = parseInt(req.query.pagina)
        const tamanho = parseInt(req.query.tamanho)
        const valor = req.body.valor

        if (pagina < 0) {
            res.status(400).json(
                {
                    message:"Página não pode ser nulo ou menor que zero"
                }
            )
        }
        if (tamanho < 0 || !tamanho) {
            res.status(400).json(
                {
                    message:"Tamanho não pode ser nulo ou menor que zero"
                }
            )
        }

        // search in the database
        const countQuery = await receita.receitaModel.count();
        const receitas = await receita.receitaModel.find().limit(tamanho).skip(pagina*tamanho)
        const response = {
            pagina: pagina,
            tamanho: tamanho,
            numeroRegistros: countQuery,
            registros: receitas
        }
         res.status(200).json(response)
    } catch(e) {
        res.status(500).json({message:e.message})
    }
}
exports.searchReceitas = searchReceitas


/**
 * A função assíncrona "searchWithId" usa a função find() para procurar
 * uma expecífica linha de receitas a partir de uma path variable.
 * @param {Object} req 
 * @param {Object} res
 * @returns {Array} 
 */
async function searchWithId(req,res) {
    try {
        const id = req.params.receitaId;
        if ( !mongoose.Types.ObjectId.isValid(id) ) {
            res.status(400).json({
                message:'valor informado não pode ser ID do banco'
            })

        }
        const data = await receita.receitaModel.find({"_id": id});
        res.status(200).json(data[0]);
    } catch(e) {
        res.status(500).json({message:e.message})
    }
}
exports.searchWithId = searchWithId


/**
 * A função assíncrona "update", após todas as validações necessárias,
 * através da função findOneAndUpdate() atualiza os valores definidos
 * na linha com "_id" igual a  "receitaId".
 * "receitaId" é uma path variable.
 * 
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @returns {Object}
 */
async function update (req,res) {
    try {
        const receitaId = req.params.receitaId
        const data = req.body.data
        const valor = req.body.valor
        const pessoaId = req.body.pessoaId

        if(!moment(data).isValid()){
            res.status(400).json({
                message:"Formato de data invalido."
            })
        }
        if (moment(data).isAfter(moment())) {
            res.status(400).json({
                message:"Data não pode ser maior que a de hoje"
            })
        }
        if (valor <= 0) {
            res.status(400).json(
                {
                    message:"Valor não pode ser menor/igual a zero"
                }
            )

        }
        if ( !mongoose.Types.ObjectId.isValid(pessoaId) ) {
            res.status(400).json({
                message:'valor informado não pode ser ID do banco'
            })

        }
        // a função find busca no banco na tabela pessoa as linhas para a condicao dada como argumento 
        const existePessoa = await pessoa.pessoaModel.find({_id:pessoaId})
        if(existePessoa.length === 0){
            res.status(400).json({
                message:"pessoa não cadastrada"
            })
        }
        if ( !mongoose.Types.ObjectId.isValid(receitaId) ) {
            res.status(400).json({
                message:'valor informado não pode ser ID do banco'
            })

        }
        // a função find busca no banco na tabela pessoa as linhas para a condicao dada como argumento 
        const existeReceita = await receita.receitaModel.find({_id:receitaId})
        if(existeReceita.length === 0){
            res.status(400).json({
                message:"receita não cadastrada"
            })
        }

        const dadosDaBusca = {"_id": receitaId}
        const dadosNovos = {data: data, valor: valor, pessoaId: pessoaId}
        
       const newData = await receita.receitaModel.findOneAndUpdate(dadosDaBusca, dadosNovos, {
            upsert: true
        });
        res.status(200).json(newData)
       
    } catch(e) {
        res.status(500).json({message:e.message})
    }
}
exports.update = update


/**
 * Após todas as validações necessárias, a função assíncrona
 * "deleteReceita" permite remover uma receita baseando-se
 * na path variable "receitaId".
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @returns {Array}
 */
async function deleteReceita (req, res){
    
    try {
        const receitaId = req.params.receitaId

        if ( !mongoose.Types.ObjectId.isValid(receitaId) ) {
            res.status(400).json({
                message:'valor informado não pode ser ID do banco'
            })

        }
        
        // a função find busca no banco na tabela pessoa as linhas para a condicao dada como argumento 
        const existeReceita = await receita.receitaModel.find({_id:receitaId})
        if(existeReceita.length === 0){
            res.status(400).json({
                message:"receita não cadastrada"
            })
        }

        await receita.receitaModel.findByIdAndDelete({"_id": receitaId})
        res.status(200).json()


    } catch (error) {
        
        res.status(500).json({message:error.message})
    }
     
}
exports.deleteReceita = deleteReceita