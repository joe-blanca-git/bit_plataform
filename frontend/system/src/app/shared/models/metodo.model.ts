export class metodoModel {
    public Id!: number;
    public Nome!: number;
    public Descricao!: number;
    public Dt_inc!: Date;
    public EmpresaId!: string;
    public Status!: string;

    public mapFromApi(item: any): metodoModel {
        this.Id = item.Id;
        this.Nome = item.Nome;
        this.Descricao = item.Descricao;
        this.Dt_inc = new Date(item.Dt_inc);
        this.EmpresaId = item.EmpresaId;
        this.Status = item.Status;
        return this;
    }
}
