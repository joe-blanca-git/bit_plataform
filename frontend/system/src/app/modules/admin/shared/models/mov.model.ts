export class MovModel {
  Id!: number;
  User_Inc!: number;
  User_Inc_Name!: string;
  id_empresa!: number;
  cliente_id!: number;
  Empresa!: string;
  Conta!: string;
  categoria_id!: number;
  Categoria!: string;
  origem_id!: number;
  Origem!: string;
  Descricao!: string;
  Tipo!: string;
  ValorTotal!: number;
  ValorPago!: number;
  ValorPendente!: number;
  StatusConta!: string;
  DataInclusao!: Date;
}

export class Parcelas {
  Id!: number;
  DataInclusao!: Date;
  DataVencimento!: Date;
  Valor!: number;
}
