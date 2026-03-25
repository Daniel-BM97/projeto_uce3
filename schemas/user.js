import mongoose from "mongoose";


//SCHEMA DOS USUARIOS
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    id: mongoose.Schema.Types.ObjectId,
    nome: String,
    num_sus: String,
    senha: String,
    data_nasc: Date
});

export const UserModel = mongoose.model("User", UserSchema);
