import express from "express";
import mongoose from "mongoose";

import {FuncionarioModel} from "./schemas/funcionario.js";
import {FilaModel} from "./schemas/fila.js";
import {criarFuncionario} from "./controllers/funcionarioController.js";

const app = express();

app.use(express.json());


mongoose.connect("mongodb+srv://root:root@cluster0.mhygv6b.mongodb.net/?appName=Cluster0").then(()=>console.log("BANCO DE DADOS CONECTADO!"));



app.post("/funcionario", async (request, response)=>{

    const body = request.body;
    
    try{
        //VERIFICA SE O FUNCIONARIO JA EXISTE
        const elemento = await FuncionarioModel.findOne({ cpf: body.cpf });
        
        if(elemento){
            console.log("Funcionário já Cadastrado");
            return response.status(400).json({ message: "Funcionario ja existe com esse número de CPF" });
            
        }
        const novoFuncionario = await criarFuncionario(body.nome, body.cpf, body.senha, body.data_nasc);
        return response.status(201).json({message: "Funcionário criado com sucesso", funcionario: novoFuncionario});

    }catch(erro){

        return response.status(400).json({mensagem: "Erro"});
    }
   
});

app.post("/login", async (request,response) => {

    console.log(request.body)

    try {

        const nomeUsuario = await FuncionarioModel.findOne({ nome: request.body.nome });
        console.log(nomeUsuario);

        if(!nomeUsuario){
            
            return response.status(400).json({message: "Usuário não encontrado"});
            
        }

        if(nomeUsuario){
            console.log("Usuário existe");
            const senha = await FuncionarioModel.findOne({nome: request.body.nome, senha: request.body.senha});
            console.log(senha);
                if(senha){
                    return response.json({message: "logado"});
                }else{
                    return response.status(400).json({message: "Senha Incorreta"});
                }
        }
    

    } catch (Error) {
        console.log("Usuário");
        console.log(Error);
        return response.status(400).json({mensagem: "Erro"});

    }
    
})


app.post("/adiciona_na_fila", async (request, response)=>{


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

app.listen( 3333 ,()=>{
    console.log("SERVIDOR INICIADO COM SUCESSO!")
});
