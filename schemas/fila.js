import mongoose from "mongoose";


const Schema = mongoose.Schema;


//SCHEMA DA FILA
const FilaSchema = new Schema({
    id: mongoose.Schema.Types.ObjectId,
    paciente: String,
    prioridade: { type: Number, default: 0 },
    status: { 
        type: String, 
        enum: ["aguardando", "em_atendimento", "finalizado"],
        default: "aguardando"
    },
    etapa: {
        type: String,
        enum: ["triagem", "consulta"],
        default: "triagem"
  } 
});

export const FilaModel = mongoose.model("Fila", FilaSchema);