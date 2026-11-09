import { Devolucao, Emprestimo, EmprestimoDetalhado } from "../models/Emprestimo";
import { EmprestimoService } from "../services";

export class EmprestimoController {
    constructor(private readonly emprestimoService: EmprestimoService) { }

    emprestar(clienteId: string, livroId: string): Promise<Emprestimo> {
        return this.emprestimoService.emprestar(Number(clienteId), Number(livroId))
    }
    devolver(id: string): Promise<Devolucao> {
        return this.emprestimoService.devolver(Number(id))
    }
    listar():Promise<EmprestimoDetalhado[]>{
        return this.emprestimoService.listar()
    }
    listarAtivos():Promise<EmprestimoDetalhado[]>{
        return this.emprestimoService.listarAtivos()
    }
}