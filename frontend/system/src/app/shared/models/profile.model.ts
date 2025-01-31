export class profileModel {
    public userName!: string;
    public nome!: string | null;
    public idade!: number | null;
    public email!: string;
    public estado!: string | null;
    public cidade!: string | null;
    public empresaId!: number | null;
    public id!: number;
    public pessoaId!: number;
    public status!: string;

    // Função para mapear os dados da API para o modelo
    public mapFromApi(item: any): profileModel {
        this.userName = item.UserName;
        this.nome = item.Nome;
        this.idade = item.Idade;
        this.email = item.Email;
        this.estado = item.Estado;
        this.cidade = item.Cidade;
        this.empresaId = item.EmpresaId;
        this.id = parseInt(item.Id, 10);
        this.pessoaId = parseInt(item.PessoaId, 10);
        this.status = item.Status;
        return this;
    }
}
