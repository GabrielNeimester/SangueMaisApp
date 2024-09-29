
export interface IQuestoesResponse {
    page: number;
    limit: number;
    totalQuestoesComOpcoes: number;
    id: string;
    descricao: string;
    opcoes: Array<{
        id: string;
        descricao: string;
    }>;
}