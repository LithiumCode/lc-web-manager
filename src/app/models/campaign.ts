export interface Campaign {
  id: string;
  client: {
    nomeFantasia: string;
    cnpj: string;
    telefone: string;
    email: string;
    endereco: string;
    id: string;
    responsavel: string;
    razaoSocial: string;
    inscricaoEstadual: string;
  };
  createdAt: Date | string;
  createdById: string;
  createdByName?: string;
  days: number;
}

