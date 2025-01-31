export class totaisModel{
  public id_empresa!: Number;
  public data!: Date;
  public tipo!: String;
  public total!: string;

    public mapFromApi(item: any): totaisModel{
      this.id_empresa = item.id_empresa;
      this.data = item.data;
      this.tipo = item.tipo;
      this.total = item.total;

      return this;
    }

}

