import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PacienteSchema = new Schema(
    {
        nome: { type: String, required: true },
        num_sus: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);

export const PacienteModel = mongoose.model("Paciente", PacienteSchema);
