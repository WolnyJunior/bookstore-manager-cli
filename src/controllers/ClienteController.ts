import { Cliente } from "../models/Cliente";
import { ClienteService } from "../services";

export interface EntradaCliente {
    nome: string
    email: string
    telefone: string
}

export class ClienteController {
    constructor(private readonly clienteService: ClienteService) { }

    cadastrar(entrada: EntradaCliente): Promise<Cliente> {
        return this.clienteService.cadastrar(entrada)
    }
    listar(): Promise<Cliente[]> {
        return this.clienteService.listar()
    }
    buscarPorId(id: string): Promise<Cliente> {
        return this.clienteService.buscarPorId(Number(id))
    }
    atualizar(id: string, entrada: EntradaCliente): Promise<Cliente> {
        return this.clienteService.atualizar(Number(id), entrada)
    }
    remover(id: string): Promise<void> {
        return this.clienteService.remover(Number(id))
    }
}