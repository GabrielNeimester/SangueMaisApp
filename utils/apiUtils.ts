import { api } from "../config/api";
import { IAgendamentoResponse } from "../interfaces/agendamento";

export const fetchHemocentro = async (id: string) => {
    const response = await fetch(`${api}/hemocentro/hemocentroShow/${id}`);
    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    return response.json();
};

export const fetchQuestoes = async (id: string, page: number) => {
    const response = await fetch(`${api}/questoes/getForm/${id}?page=${page}`);

    if (!response.ok) {
        throw new Error('Erro ao buscar as questões')
    }

    const data = await response.json()


    if (!data || typeof data.totalQuestoesComOpcoes !== 'number') {
        throw new Error('Estrutura inesperada de dados')
    }

    return data
}


export const fetchOpcoes = async (questaoId: string) => {
    const response = await fetch(`${api}/opcoes/${questaoId}`);
    if (!response.ok) {
        throw new Error('Erro ao buscar as opções');
    }
    return response.json()
}


export const createAgendamento = async (agendamento: string) => {
    console.log('Dados enviados:', agendamento);

    const response = await fetch(`${api}/agendamento/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(agendamento),
    });

    if (!response.ok) {
        throw new Error(`Erro ao criar agendamento: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.impedimento === 'temporario' && data.statusDoacao === 'bloqueado') {
        const impedimento = 'nenhum'
        const statusDoacao = 'liberado'
        const diasImpedidos = Number(data.diasImpedidos)
        const dataAgendamento = String(data.dataAgendamento)
        const horario = String(data.horario)
        return { impedimento, statusDoacao, diasImpedidos, dataAgendamento, horario}
    }
    if (data.impedimento === 'definitivo' && data.statusDoacao === 'bloqueado') {
        const impedimento = 'nenhum'
        const statusDoacao = 'liberado'
        const diasImpedidos = 0
        const dataAgendamento = String(data.dataAgendamento)
        const horario = String(data.horario)
        return { impedimento, statusDoacao, diasImpedidos, dataAgendamento, horario}
    }

    if (data.impedimento === 'nenhum' && data.statusDoacao === 'liberado') {
        const impedimento = 'nenhum'
        const statusDoacao = 'liberado'
        const diasImpedidos = 0
        const dataAgend = String(data.dataAgendamento)

        const formatDate = (dataAgendamento:string) => {
            const date = new Date(dataAgendamento);
            return new Intl.DateTimeFormat('pt-BR').format(date); // pt-BR para formato brasileiro
        };
    
        const dataAgendamento = formatDate(dataAgend)
        const horario = String(data.horario)
        return { impedimento, statusDoacao, diasImpedidos, dataAgendamento, horario}
    }


    return data
};