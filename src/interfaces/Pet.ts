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
    idOng: number;
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
}
