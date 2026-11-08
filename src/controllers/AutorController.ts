import { Autor } from "../models/Autor"
import { AutorService } from "../services/AutorService"

export interface EntradaAutor {
    nome: string
    nacionalidade: string
    data_nascimento: string
}

export class AutorController {
    constructor(private readonly service: AutorService) {}

    cadastrar(entrada: EntradaAutor): Promise<Autor> {
        return this.service.cadastrar(entrada)
    }
    listar(): Promise<Autor[]> {
        return this.service.listar()
    }
    buscarPorId(id: string): Promise<Autor> {
        return this.service.buscarPorId(Number(id))
    }
    atualizar(id: string, entrada: EntradaAutor): Promise<Autor> {
        return this.service.atualizar(Number(id), entrada)
    }
    remover(id: string): Promise<void> {
        return this.service.remover(Number(id))
    }
}
