import { FuncionarioModel } from "../schemas/funcionario.js";
import { convertHashPassword } from "./services/passwordService.js";
import { comparePassword }  from "./services/passwordService.js";

export const criarFuncionario = async (nome, cpf, senha, data_nasc) => {
  const hashedPassword = convertHashPassword(senha);

  return await FuncionarioModel.create({nome, cpf, senha: hashedPassword, data_nasc });
};

export const loginFuncionario = async (nome, senha)=>{
  const funcionario = await FuncionarioModel.findOne({ nome });
 
  const comparaSenha = comparePassword(senha, funcionario.senha);
  if (!comparaSenha) {
    console.log("Senha incorreta");
    throw new Error("Senha incorreta");
    return false;
  }

  return true;
}

 