export class financeirosModel {
    public SfId!: number;
    public UserIncId!: number;
    public PessoaOrigemId!: number;
    public EmpresaId!: number;
    public FormaId!: number;
    public IntervaloId!: number;
    public MetodoId!: number;
    public ContaId!: number;
    public CategoriaId!: number;
    public Tipo!: string;
    public PessoaOrigem!: string;
    public Origem!: string;
    public Categoria!: string;
    public Conta!: string;
    public TipoDescricao!: string;
    public Descricao!: string;
    public Obs!: string;
    public Valor!: number;
    public Dt_inc!: Date;

    public mapFromApi(item: any): financeirosModel {
        this.SfId = item.SfId;
        this.UserIncId = item.UserIncId;
        this.PessoaOrigemId = item.PessoaOrigemId;
        this.EmpresaId = item.EmpresaId;
        this.FormaId = item.FormaId;
        this.IntervaloId = item.IntervaloId;
        this.MetodoId = item.MetodoId;
        this.ContaId = item.ContaId;
        this.CategoriaId = item.CategoriaId;
        this.Tipo = item.Tipo;
        this.PessoaOrigem = item.PessoaOrigem;
        this.Origem = item.Origem;
        this.Categoria = item.Categoria;
        this.Conta = item.Conta;
        this.TipoDescricao = item.TipoDescricao;
        this.Descricao = item.Descricao;
        this.Obs = item.Obs;
        this.Valor = item.Valor;
        this.Dt_inc = new Date(item.Dt_inc);

        return this;
    }
}
