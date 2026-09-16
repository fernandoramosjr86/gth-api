export type Sexo = 'M' | 'F';

export interface Pessoa {
  id: number;
  nome: string;
  dataNascimento: string;
  cpf: string;
  sexo: Sexo;
  altura: number;
  peso: number;
}

export interface PessoaPayload {
  nome: string;
  dataNascimento: string;
  cpf: string;
  sexo: Sexo;
  altura: number;
  peso: number;
}

export interface PesoIdeal {
  pessoaId: number;
  nome: string;
  pesoIdeal: number;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
