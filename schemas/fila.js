import mongoose from "mongoose";


const Schema = mongoose.Schema;


//SCHEMA DA FILA
const FilaSchema = new Schema({
    id: mongoose.Schema.Types.ObjectId,
    nome: String,
    num_sus: String,
    posicao: String    
});

export const FilaModel = mongoose.model("Fila", FilaSchema);