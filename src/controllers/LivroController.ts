import { LivroService } from "../services/LivroService";
import { Livro, LivroDetalhado, NovoLivro } from "../models/Livro";

export interface EntradaLivro {
    titulo: string
    genero: string
    isbn: string
    ano_publicacao: string
    quantidade_total: string
    autor_id: string
}

export class LivroController {
    constructor(private readonly livroService: LivroService) { }

    cadastrar(entrada: EntradaLivro): Promise<Livro> {
        return this.livroService.cadastrarLivro(this.converter(entrada))
    }

    listar(): Promise<LivroDetalhado[]> {
        return this.livroService.listarLivros()
    }

    buscarPorId(id: string): Promise<LivroDetalhado> {
        return this.livroService.buscarPorId(Number(id))
    }

    atualizar(id: string, entrada: EntradaLivro): Promise<Livro> {
        return this.livroService.atualizarLivro(Number(id), this.converter(entrada))
    }

    deletar(id: string): Promise<void> {
        return this.livroService.deletarLivro(Number(id))
    }


    private converter(entrada: EntradaLivro): NovoLivro {
        return {
            titulo: entrada.titulo,
            genero: entrada.genero,
            isbn: entrada.isbn,
            ano_publicacao: entrada.ano_publicacao.trim() === "" ? null : Number(entrada.ano_publicacao),
            quantidade_total: Number(entrada.quantidade_total),
            autor_id: Number(entrada.autor_id)
        }
    }
}