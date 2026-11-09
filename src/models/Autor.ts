export interface Autor {
    id: number
    nome: string
    nacionalidade: string | null
    data_nascimento: string | null
}

export type NovoAutor = Omit<Autor, "id">
