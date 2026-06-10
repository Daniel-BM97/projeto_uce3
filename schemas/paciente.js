import mongoose from "mongoose";

const Schema = mongoose.Schema;

//SCHEMA DOS PACIENTES
const PacienteSchema = new Schema({
  nome: String,
  num_sus: String
}, { timestamps: true });

export const PacienteModel = mongoose.model("Paciente", PacienteSchema);