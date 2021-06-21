const express = require('express');
const route = express.Router()
const pessoaController = require('../controller/pessoaController')
const receitaController = require('../controller/receitaController')
const totalizadorController = require('../controller/totalizadorController')


// CRUD /api/pessoas 
route.get('/api/pessoas', pessoaController.search) // Lista todas as pessoas
route.get('/api/pessoas/:id', pessoaController.searchWithId)// Lista um pessoa específica
route.post('/api/pessoas', pessoaController.post)// Cadastra uma pessoa específica
route.put('/api/pessoas/:pessoaId', pessoaController.update)// Edita uma pessoa
route.delete('/api/pessoas/:pessoaId', pessoaController.deletePessoa)//Deleta uma pessoa

// CRUD /api/receitas
route.get('/api/receitas', receitaController.searchReceitas)//Retorna uma lista de receitas
route.get('/api/receitas/:receitaId', receitaController.searchWithId)//Retorna uma receita específica
route.post('/api/receitas', receitaController.post)// Cadastra uma receita
route.put('/api/receitas/:receitaId', receitaController.update)//Edita uma receita
route.delete('/api/receitas/:receitaId', receitaController.deleteReceita)// Deleta uma receita

// /api/totalizadores
route.get('/api/totalizadores', totalizadorController.totalizador)
module.exports = route

