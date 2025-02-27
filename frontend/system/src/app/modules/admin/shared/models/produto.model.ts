export class ProdutoModel {
    id!: number;
    EAN!: number;
    nome!: string;
    un_medida!: string;
    qtde_embalagem!: number;
    valor_custo!: number;
    valor_venda!: number;
    qtde_estoque_min!: number;
    qtde_estoque_max!: number;
    dt_inc!: Date;
    fornecedor_nome!: string;
    id_fornecedor!: number;
    categoria!: string;
    id_categoria!: number;
}

export class ProdutoCategoriaModel {
    id!: number;
    name!: string;
}