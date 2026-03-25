import express from "express";
import mongoose from "mongoose";

import {UserModel} from "./schemas/user.js";
import { FilaModel } from "./schemas/fila.js";

const app = express();

app.use(express.json());


mongoose.connect("mongodb+srv://root:root@cluster0.mhygv6b.mongodb.net/?appName=Cluster0").then(()=>console.log("BANCO DE DADOS CONECTADO!"));



app.post("/users", async (request, response)=>{
    
    try{
        //VERIFICA SE O USUÁRIO JA EXISTE
        const elemento = await UserModel.findOne({ num_sus: request.body.num_sus });
        
        if(elemento){
            console.log("Usuário já existe");
            return response.status(400).json({ message: "Usuário ja existe com esse número do SUS" });
            
        }

    await UserModel.create({
        nome:request.body.nome,
        num_sus: request.body.num_sus,
        senha: request.body.senha,
        data_nasc: request.body.data_nasc

    });

    }catch(erro){

        return response.status(400).json({mensagem: "Erro"});
    }
   
});

app.post("/login", async (request,response) => {

    console.log(request.body)

    try {

        const nomeUsuario = await UserModel.findOne({ nome: request.body.nome });
        console.log(nomeUsuario);

        if(!nomeUsuario){
            
            return response.status(400).json({message: "Usuário não encontrado"});
            
        }

        if(nomeUsuario){
            console.log("Usuário existe");
            const senha = await UserModel.findOne({nome: request.body.nome, senha: request.body.senha});
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

