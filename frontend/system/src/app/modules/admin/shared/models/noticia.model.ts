export class NoticiasResponseModel {
  count!: number;
  page!: number;
  totalPages!: number;
  nextPage!: number;
  previousPage!: number;
  showingFrom!: number;
  showingTo!: number;
  items!: NoticiasModel[];
}

export class NoticiasModel {
  id!: number;
  tipo!: string;
  titulo!: string;
  introducao!: string;
  data_publicacao!: string;
  produto_id!: number;
  produtos?: string;
  editorias!: string;
  imagens!: string | Record<string, string>;
  produtos_relacionados?: string;
  destaque!: boolean;
  link!: string;
}
