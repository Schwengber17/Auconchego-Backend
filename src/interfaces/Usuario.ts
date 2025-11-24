import type {TipoUsuario} from "../types/common.js";

export interface IUsuario {
    id_usuario: number;
    nome: string;
    email: string;
    senha: string;
    telefone: string;
    tipo_usuario: TipoUsuario; // no DER é varchar; aqui tipamos como union
}

// criação (não inclui id)
export interface IUsuarioCreate {
    nome: string;
    email: string;
    senha: string;
    telefone: string;
    tipo_usuario?: TipoUsuario; // pode defaultar para "TUTOR" quando for tutor
}

// atualização (todos opcionais)
export interface IUsuarioUpdate {
    nome?: string;
    email?: string;
    senha?: string;
    telefone?: string;
    tipo_usuario?: TipoUsuario;
}
