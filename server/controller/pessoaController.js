const { cpf } = require('cpf-cnpj-validator');
const pessoa = require('../model/people');
const mongoose = require('mongoose')
const moment = require('moment');

 
/**
 * A função assíncrona "post" permite o cadastro de novas pessoas.
 * Esta função recebe um objeto e utiliza para criar um novo registro no banco. 
 * Dentro desta, há a validação de todos os campos necessarios.
 * a função save(), que recebe os dados do modelo, 
 * retorna um json representando a nova
 * linha criada no DB.
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @returns {Object}
 */
async function post(req, res) {
   try {
        console.log(req.body)
        console.log("post")
        const nome = req.body.nome
        const dataNascimento = req.body.dataNascimento
        const cpfData =  req.body.cpf
        const ativo = req.body.ativo
        const meta =  req.body.meta

        if(!moment(dataNascimento).isValid()){
            res.status(400).json({
                message:"Formato de data invalido."
            })
        }
        if (moment(dataNascimento).isAfter(moment())) {
            res.status(400).json({
                message:"Data não pode ser maior que a de hoje"
            })
        }
        if(!cpf.isValid(cpfData)){
            res.status(400).json({
                message:"CPF não válido"
            })
        }
        if (meta <= 0) {
            res.status(400).json(
                {
                    message:"Meta não pode ser menor/igual a zero"
                }
            )

        }
        const people = new pessoa.pessoaModel({
            nome:nome,
            dataNascimento: moment(dataNascimento).format("YYYY-MM-DD"),
            cpf:cpf.format(cpfData),
            ativo:ativo,
            meta:meta
        })
    
        // salva no banco
        const data = await people.save(people);
        res.status(201).json(data)
    }
    catch(err){
        res.status(500).json(err.message)
    }
    
} 

exports.post = post

/**
 * a função search retorna todos os registros da tabela pessoa - MongoDB
 * @param {Object} req 
 * @param {Object} res 
 * @returns {Array}
 */
async function search(req,res) {
    try {
        const pagina = parseInt(req.query.pagina)
        const tamanho = parseInt(req.query.tamanho)
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
        const countQuery = await pessoa.pessoaModel.count();
        const data = await pessoa.pessoaModel.find().limit(tamanho).skip(pagina*tamanho)
        const response = {
            pagina: pagina,
            tamanho: tamanho,
            numeroRegistros: countQuery,
            registros: data
        }
         res.status(200).json(response)
    } catch(e) {
        res.status(500).json({message:e.message})
    }
}
exports.search = search

/**
 * A função recebe uma path variable 
 * e a usa para buscar o registro no banco com base na coluna _id.
 * Se a consulta for bem sucedida, a função
 * retorna um Array com o regitro.
 * @param {Object} req 
 * @param {Object} res 
 * @returns {Array}
 */
async function searchWithId(req,res) {
    try {
        const id = req.params.id;

        if ( !mongoose.Types.ObjectId.isValid(id) ) {
            res.status(400).json({
                message:'valor informado não pode ser ID do banco'
            })

        }
        const data = await pessoa.pessoaModel.find({"_id": id});
        res.status(200).json(data[0]);
    } catch(e) {
        res.status(500).json({message:e.message})
    }
}

exports.searchWithId = searchWithId



/** 
 * Esta função implementa a rota /api/pessoas/:pessoaId
 * A função assíncrona "update", após todas as validações necessárias,
 * através da função findOneAndUpdate() atualiza os valores definidos
 * na linha com "_id" igual a  "pessoaId".
 * "pessoaId" é uma path variable.
 * @param {Object} req 
 * @param {Object} res
 * @returns {Object} 
 */

async function update (req,res) {
    try {
        const pessoaId = req.params.pessoaId
        const nome = req.body.nome
        const dataNascimento = req.body.dataNascimento
        const cpfData = req.body.cpf
        const ativo = req.body.ativo
        const meta = req.body.meta

        if(!moment(dataNascimento).isValid()){
            res.status(400).json({
                message:"Formato de data invalido."
            })
        }
        if (moment(dataNascimento).isAfter(moment())) {
            res.status(400).json({
                message:"Data não pode ser maior que a de hoje"
            })
        }
        if(!cpf.isValid(cpfData)){
            res.status(400).json({
                message:"CPF não válido"
            })
        }

        if ( !mongoose.Types.ObjectId.isValid(pessoaId) ) {
            res.status(400).json({
                message:'valor informado não pode ser ID do banco'
            })

        }
        if (meta <= 0) {
            res.status(400).json(
                {
                    message:"Meta não pode ser menor/igual a zero"
                }
            )

        }

        // a função find busca no banco na tabela pessoa as linhas para a condicao dada como argumento 
        const existePessoa = await pessoa.pessoaModel.find({_id:pessoaId})
        if(existePessoa.length === 0){
            res.status(400).json({
                message:"pessoa não cadastrada"
            })
        }
        
        const dadosDaBusca = {"_id": pessoaId}
        const dadosNovos = {nome: nome, dataNascimento: moment(dataNascimento).format("YYYY-MM-DD"), cpf: cpf.format(cpfData), ativo: ativo, meta: meta}
        
       const newData = await pessoa.pessoaModel.findOneAndUpdate(dadosDaBusca, dadosNovos, {
            upsert: true
        });
        res.status(201).json(newData)
    
    } catch(e) {
    
        res.status(500).json({message:e.message})
        
    }
}
exports.update = update

/**
 * A função assíncrona "deletePessoa" foi adicionada como sugestão.
 * Após todas as validações necessárias, esta permite remover uma
 * pessoa baseando-se na path variable "pessoaId".
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @returns {Array}
 */
async function deletePessoa (req, res){
    
    try {
        const pessoaId = req.params.pessoaId

        if ( !mongoose.Types.ObjectId.isValid(pessoaId) ) {
            res.status(400).json({
                message:'valor informado não pode ser ID do banco'
            })

        }
        
        const existePessoa = await pessoa.pessoaModel.find({_id:pessoaId})
        if(existePessoa.length === 0){
            res.status(400).json({
                message:"pessoa não cadastrada"
            })
        }

        await pessoa.pessoaModel.findByIdAndDelete({"_id": pessoaId})
        res.status(200).json()
    
    } catch (e) {

        res.status(500).json({message:e.message})
    
    }

}
exports.deletePessoa = deletePessoa