export class pessoasModel {
    public Id!: number;
    public TipoId!: number;
    public EmpresaId!: number;
    public Nome!: string;
    public Cidade!: string;
    public Estado!: string;
    public Idade!: number;
    public Descricao!: string;
    public Cargo!: string;
    public Fone!: string;
    public UserId!: number;
    public urlImagem!: string;
    public Status!: string;

    public mapFromApi(item: any): pessoasModel {
        this.Id = Number(item.Id);
        this.TipoId = Number(item.TipoId);
        this.EmpresaId = Number(item.EmpresaId);
        this.Nome = item.Nome;
        this.Cidade = item.Cidade;
        this.Estado = item.Estado;
        this.Idade = Number(item.Idade);
        this.Descricao = item.Descricao;
        this.Cargo = item.Cargo;
        this.Fone = item.Fone;
        this.UserId = Number(item.UserId);
        this.urlImagem = item.urlImagem;
        this.Status = item.Status;
        return this;
    }
}
