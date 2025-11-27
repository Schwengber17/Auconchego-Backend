// Define os tipos que serão usados no Enum do Prisma
export type Porte = "PEQUENO" | "MEDIO" | "GRANDE";
export type Sexo = "MACHO" | "FEMEA";
export type Status = "DISPONIVEL" | "ADOTADO" | "RESERVADO";

// Interface para a criação de um novo Pet. Não inclui o 'id'.
export interface IPetCreate {
    nome: string;
    especie: string;
    raca: string;
    porte: Porte;
    sexo: Sexo;
    status?: Status; // Status é opcional na criação, pois tem um valor default
    necessidadesEspeciais: boolean;
    tratamentoContinuo: boolean;
    doencaCronica: boolean;
    idOng?: number; // Opcional: tutor pode não ter ONG vinculada
    imagens?: string[];

    // NOVOS CAMPOS
    idade?: number;
    peso?: number;
    local?: string;
    vacinado?: boolean;
    castrado?: boolean;
    temperamento?: string[];
    descricao?: string;
    descricaoSaude?: string;
    dataResgate?: Date | string;
    idTutorOrigem?: number;
    idTutorAdotante?: number;
}

// Interface para a atualização de um Pet. Todos os campos são opcionais.
export interface IPetUpdate {
    nome?: string;
    especie?: string;
    raca?: string;
    porte?: Porte;
    sexo?: Sexo;
    status?: Status;
    necessidadesEspeciais?: boolean;
    tratamentoContinuo?: boolean;
    doencaCronica?: boolean;
    idOng?: number;
    imagens?: string[];

    // NOVOS CAMPOS
    idade?: number;
    peso?: number;
    local?: string;
    vacinado?: boolean;
    castrado?: boolean;
    temperamento?: string[];
    descricao?: string;
    descricaoSaude?: string;
    dataResgate?: Date | string;
    tutorId?: number;
    adotanteId?: number;
}
