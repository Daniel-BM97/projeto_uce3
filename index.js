import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import { FuncionarioModel } from "./schemas/funcionario.js";
import { PacienteModel } from "./schemas/paciente.js";
import { criarFuncionario, autenticarFuncionario } from "./controllers/funcionarioController.js";
import {
    adicionarNaFila,
    listarFila,
    atualizarStatus,
    atualizarEtapa,
} from "./controllers/filaController.js";
import { autenticarToken, JWT_SECRET } from "./middleware/authMiddleware.js";

const app = express();

app.use(express.json());

mongoose
    .connect("mongodb+srv://root:root@cluster0.mhygv6b.mongodb.net/?appName=Cluster0")
    .then(() => console.log("BANCO DE DADOS CONECTADO!"))
    .catch((erro) => console.error("Erro ao conectar ao banco:", erro.message));

app.post("/cadastra_funcionario", async (request, response) => {
    const { nome, cpf, senha, data_nasc } = request.body;

    try {
        const existente = await FuncionarioModel.findOne({ cpf });

        if (existente) {
            return response.status(400).json({ message: "Funcionario ja existe com esse número de CPF" });
        }

        const funcionario = await criarFuncionario(nome, cpf, senha, data_nasc);

        return response.status(201).json({
            message: "Funcionário criado com sucesso",
            funcionario,
        });
    } catch {
        return response.status(400).json({ mensagem: "Erro ao cadastrar funcionário" });
    }
});

app.post("/login", async (request, response) => {
    try {
        const funcionario = await autenticarFuncionario(request.body.nome, request.body.senha);

        const token = jwt.sign(
            { nome: funcionario.nome, cpf: funcionario.cpf },
            JWT_SECRET,
            { expiresIn: "10m" }
        );

        return response.json({ token });
    } catch (erro) {
        if (erro.message === "Usuário não encontrado" || erro.message === "Senha incorreta") {
            return response.status(400).json({ message: erro.message });
        }

        return response.status(500).json({ mensagem: "Erro ao fazer login" });
    }
});

app.post("/cadastra_paciente", autenticarToken, async (request, response) => {
    const { nome, num_sus } = request.body;

    try {
        const existente = await PacienteModel.findOne({ num_sus });

        if (existente) {
            return response.status(400).json({ message: "Paciente já existe com esse número do SUS" });
        }

        const paciente = await PacienteModel.create({ nome, num_sus });

        return response.status(201).json(paciente);
    } catch {
        return response.status(400).json({ mensagem: "Erro ao cadastrar paciente" });
    }
});

app.post("/adiciona_na_fila", autenticarToken, async (request, response) => {
    const { num_sus, prioridade } = request.body;

    if (!num_sus) {
        return response.status(400).json({ message: "num_sus é obrigatório" });
    }

    try {
        const registro = await adicionarNaFila(num_sus, prioridade ?? 0);

        return response.status(201).json({
            message: "Paciente adicionado na fila",
            fila: registro,
        });
    } catch (erro) {
        if (erro.message === "Paciente não cadastrado" || erro.message === "Paciente já está na fila") {
            return response.status(400).json({ message: erro.message });
        }

        return response.status(400).json({ mensagem: "Erro ao adicionar na fila" });
    }
});

app.get("/fila", autenticarToken, async (request, response) => {
    try {
        const fila = await listarFila(request.query.status);

        return response.json({ fila });
    } catch {
        return response.status(400).json({ mensagem: "Erro ao listar fila" });
    }
});

app.patch("/fila/:id/status", autenticarToken, async (request, response) => {
    const { status } = request.body;
    const statusValidos = ["aguardando", "em_atendimento", "finalizado"];

    if (!statusValidos.includes(status)) {
        return response.status(400).json({
            message: "Status inválido. Use: aguardando, em_atendimento ou finalizado",
        });
    }

    try {
        const registro = await atualizarStatus(request.params.id, status);

        return response.json({ message: "Status atualizado", fila: registro });
    } catch (erro) {
        if (erro.message === "Registro da fila não encontrado") {
            return response.status(404).json({ message: erro.message });
        }

        return response.status(400).json({ mensagem: "Erro ao atualizar status" });
    }
});

app.patch("/fila/:id/etapa", autenticarToken, async (request, response) => {
    const { etapa } = request.body;
    const etapasValidas = ["triagem", "consulta"];

    if (!etapasValidas.includes(etapa)) {
        return response.status(400).json({
            message: "Etapa inválida. Use: triagem ou consulta",
        });
    }

    try {
        const registro = await atualizarEtapa(request.params.id, etapa);

        return response.json({ message: "Etapa atualizada", fila: registro });
    } catch (erro) {
        if (erro.message === "Registro da fila não encontrado") {
            return response.status(404).json({ message: erro.message });
        }

        if (erro.message === "Atendimento já finalizado") {
            return response.status(400).json({ message: erro.message });
        }

        return response.status(400).json({ mensagem: "Erro ao atualizar etapa" });
    }
});

app.get("/conectado", autenticarToken, (request, response) => {
    return response.json({ mensagem: "Conectado", usuario: request.usuario });
});

app.listen(3333, () => {
    console.log("SERVIDOR INICIADO COM SUCESSO!");
});
