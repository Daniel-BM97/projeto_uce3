import express, { request } from "express";
import mongoose from "mongoose";
import  jwt  from "jsonwebtoken";

import {FuncionarioModel} from "./schemas/funcionario.js";
import {FilaModel} from "./schemas/fila.js";
import {criarFuncionario, loginFuncionario} from "./controllers/funcionarioController.js";

const app = express();

app.use(express.json());


mongoose.connect("mongodb+srv://root:root@cluster0.mhygv6b.mongodb.net/?appName=Cluster0").then(()=>console.log("BANCO DE DADOS CONECTADO!"));



app.post("/cadastra_funcionario", async (request, response)=>{

    const body = request.body;
    
    try{
        //VERIFICA SE O FUNCIONARIO JA EXISTE
        const elemento = await FuncionarioModel.findOne({ cpf: body.cpf });
        console.log(elemento);

        if(elemento){
            return response.status(400).json({ message: "Funcionario ja existe com esse número de CPF" });
        }else{
        const novoFuncionario = await criarFuncionario(body.nome, body.cpf, body.senha, body.data_nasc);
        return response.status(201).json({message: "Funcionário criado com sucesso", funcionario: novoFuncionario});
        }

    }catch(erro){

        return response.status(400).json({mensagem: "Erro catch"});
    }
   
});

app.post("/login", async (request,response) => {

    console.log(request.body)
    const token_usuario = jwt.sign({nome:request.body.nome},"segredo",{expiresIn: '10m'});

    try {

        const nomeUsuario = await FuncionarioModel.findOne({ nome: request.body.nome });
        console.log(nomeUsuario);

        if(!nomeUsuario){
            
            return response.status(400).json({message: "Usuário não encontrado"});
            
        }

        if(nomeUsuario){
            console.log("Usuário existe");
            const status = loginFuncionario(request.body.nome, request.body.senha);
            console.log(status);
                if(status){
                     return response.json({ token: token_usuario });
                }
        }
    

    } catch (Error) {
        console.log("Usuário");
        console.log(Error);
        return response.status(500).json({mensagem: "Erro"});

    }
    
})


app.post("/adiciona_na_fila", async (request, response)=>{
    if (!request.headers.authorization) {
        return response.status(401).json({ message: "Voce nao possui permissao para acessar essa rota" });
    }

    try{
        // VERIFICA SE O USUÁRIO JÁ ESTÁ NA FILA
        const elemento = await FilaModel.findOne({ nome: request.body.nome });
        
        if(elemento){
            return response.status(400).json({ message: "Usuário ja existe na Fila" });
        }

    await FilaModel.create({
        nome:request.body.nome,
        num_sus: request.body.num_sus,
        posicao: request.body.posicao

    });

    return response.status(201).json({mensagem: "Pedido na fila"});
    
    }catch(erro){
        return response.status(400).json({mensagem: "Erro"});
    }
    console.log("Fui Chamado");
    console.log(request.body);
})

app.get("/conectado",async (request,response)=>{
    if (!request.headers.authorization) {
        return response.status(401).json({ message: "Voce nao possui permissao para acessar essa rota" });
    }else{
        return response.json({mensagem:"Conectado"});
    }
})

app.get("/fila", async (request, response)=>{
    if (!request.headers.authorization) {
        return response.status(401).json({ message: "Voce nao possui permissao para acessar essa rota" });
    }
    
    console.log("/fila");
    const fila = await FilaModel.find({});
    console.log(fila);
    return response.json({ fila });

})
app.listen(3333 ,async (request,response)=>{
    console.log("SERVIDOR INICIADO COM SUCESSO!");
    
});
