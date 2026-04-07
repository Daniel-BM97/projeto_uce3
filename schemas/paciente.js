import mongoose from "mongoose";


//SCHEMA DOS PACIENTES
const PacienteSchema = new Schema({
  nome: String,
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
}, { timestamps: true });

export const PacienteModel = mongoose.model("Paciente", PacienteeSchema);