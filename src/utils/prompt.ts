import { createInterface } from "node:readline/promises"
import { stdin as input, stdout as output } from "node:process"

const terminalInterface = createInterface({ input, output })

export async function perguntar(mensagem: string, valorPadrao?: string): Promise<string> {
    const indicacaoPadrao = valorPadrao ? `[${valorPadrao}]` : ""
    const resposta = (await terminalInterface.question(`${mensagem}${indicacaoPadrao}:`)).trim()
    return resposta === "" && valorPadrao !== undefined ? valorPadrao : resposta
}
export function fecharPrompt(): void {
    terminalInterface.close()
}
