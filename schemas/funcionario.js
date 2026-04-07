import mongoose from "mongoose";


//SCHEMA DOS FUNCIONARIOS
const Schema = mongoose.Schema;

const FuncionarioSchema = new Schema({
    id: mongoose.Schema.Types.ObjectId,
    nome: String,
    cpf: String,
    senha: String,
    data_nasc: Date
});

export const FuncionarioModel = mongoose.model("funcionario", FuncionarioSchema);
