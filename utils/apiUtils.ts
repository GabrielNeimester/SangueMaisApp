import { api } from "../config/api";

export const fetchHemocentro = async (id: string) => {
    const response = await fetch(`${api}/hemocentro/hemocentroShow/${id}`);
    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    return response.json();
};

export const fetchQuestoes = async (id: string) => {
    const response = await fetch(`${api}/questoes/hemocentro/${id}`);
    if (!response.ok) {
        throw new Error('Erro ao buscar as questões');
    }
    return response.json();
};

export const fetchOpcoes = async (questaoId: string) => {
    const response = await fetch(`${api}/opcoes/${questaoId}`);
    if (!response.ok) {
        throw new Error('Erro ao buscar as opções');
    }
    return response.json()
}
