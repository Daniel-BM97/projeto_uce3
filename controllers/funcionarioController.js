import { FuncionarioModel } from "../schemas/funcionario.js";
import { convertHashPassword, comparePassword } from "./services/passwordService.js";

export const criarFuncionario = async (nome, cpf, senha, data_nasc) => {
    const hashedPassword = convertHashPassword(senha);

    const funcionario = await FuncionarioModel.create({
        nome,
        cpf,
        senha: hashedPassword,
        data_nasc,
    });

    const funcionarioObj = funcionario.toObject();
    delete funcionarioObj.senha;

    return funcionarioObj;
};

export const autenticarFuncionario = async (nome, senha) => {
    const funcionario = await FuncionarioModel.findOne({ nome });

    if (!funcionario) {
        throw new Error("Usuário não encontrado");
    }

    const senhaConfere = comparePassword(senha, funcionario.senha);

    if (!senhaConfere) {
        throw new Error("Senha incorreta");
    }

    return funcionario;
};
