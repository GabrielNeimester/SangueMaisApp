import { api } from "../config/api";

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
        throw new Error('Erro ao buscar as questões');
    }

    // Aguarde a resolução da Promise e obtenha os dados
    const data = await response.json();

    // Verifique se os dados possuem a estrutura correta
    // Aqui, em vez de data.questoes, você usará o próprio data, que contém os detalhes da questão
    if (!data || !data.id || !data.descricao || !Array.isArray(data.opcoes)) {
        throw new Error('Estrutura inesperada de dados');
    }
    
    // Retorne os dados, caso a estrutura esteja correta
    return data; 
};


export const fetchOpcoes = async (questaoId: string) => {
    const response = await fetch(`${api}/opcoes/${questaoId}`);
    if (!response.ok) {
        throw new Error('Erro ao buscar as opções');
    }
    return response.json()
}
