import mongoose from "mongoose";


//SCHEMA DOS PACIENTES
const PacienteSchema = new Schema({
  nome: String,
  num_sus: String
}, { timestamps: true });

export const PacienteModel = mongoose.model("Paciente", PacienteeSchema);