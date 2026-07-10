import { FilaModel } from "../schemas/fila.js";
import { PacienteModel } from "../schemas/paciente.js";

export async function adicionarNaFila(num_sus, prioridade = 0) {
    const paciente = await PacienteModel.findOne({ num_sus });

    if (!paciente) {
        throw new Error("Paciente não cadastrado");
    }

    const jaNaFila = await FilaModel.findOne({
        num_sus,
        status: { $ne: "finalizado" },
    });

    if (jaNaFila) {
        throw new Error("Paciente já está na fila");
    }

    const posicao = await FilaModel.countDocuments({
        status: { $ne: "finalizado" },
    });

    return FilaModel.create({
        paciente: paciente.nome,
        num_sus,
        prioridade,
        posicao: posicao + 1,
        status: "aguardando",
        etapa: "triagem",
    });
}

export async function listarFila(filtroStatus) {
    const filtro = filtroStatus ? { status: filtroStatus } : {};

    return FilaModel.find(filtro)
        .sort({ prioridade: -1, posicao: 1, createdAt: 1 })
        .lean();
}

export async function atualizarStatus(id, status) {
    const registro = await FilaModel.findById(id);

    if (!registro) {
        throw new Error("Registro da fila não encontrado");
    }

    registro.status = status;
    await registro.save();

    return registro;
}

export async function atualizarEtapa(id, etapa) {
    const registro = await FilaModel.findById(id);

    if (!registro) {
        throw new Error("Registro da fila não encontrado");
    }

    if (registro.status === "finalizado") {
        throw new Error("Atendimento já finalizado");
    }

    registro.etapa = etapa;
    await registro.save();

    return registro;
}
