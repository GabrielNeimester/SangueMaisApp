export interface IAgendamento{
    hemocentroId: string,
    dataAgendamento: string,
    horario: string,
    cpf: string,
    nomeCompleto: string,
    tipoSanguineo: string,
    dataNascimento: string,
    sexo: string,
    telefone: string,
    email: string
  }

export interface IAgendamentoResponse{
  _id: string,
  hemocentroId: string,
  nomeCompleto: string,
  dataAgendamento: string,
  dataNascimento: string,
  horario: string,
  email: string,
  impedimento: string,
  diasImpedidos: string,
  statusDoacao: string,
}
