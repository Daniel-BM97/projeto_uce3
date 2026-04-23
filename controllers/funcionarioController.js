import { FuncionarioModel } from "../schemas/funcionario.js";
import { convertHashPassword } from "./services/passwordService.js";

export const criarFuncionario = async (nome, cpf, senha, data_nasc) => {
  const hashedPassword = convertHashPassword(senha);

  return await FuncionarioModel.create({nome, cpf, senha: hashedPassword, data_nasc });
};

 