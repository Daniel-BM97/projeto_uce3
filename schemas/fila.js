import mongoose from "mongoose";

const Schema = mongoose.Schema;

const FilaSchema = new Schema(
    {
        paciente: { type: String, required: true },
        num_sus: { type: String, required: true },
        prioridade: { type: Number, default: 0 },
        posicao: { type: Number, required: true },
        status: {
            type: String,
            enum: ["aguardando", "em_atendimento", "finalizado"],
            default: "aguardando",
        },
        etapa: {
            type: String,
            enum: ["triagem", "consulta"],
            default: "triagem",
        },
    },
    { timestamps: true }
);

export const FilaModel = mongoose.model("Fila", FilaSchema);
