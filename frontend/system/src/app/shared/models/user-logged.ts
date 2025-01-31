
export class usuarioLogado{
    id!: number;
    username!: string;
    claims!: claims[];
    menu!:menu[];
    empresa!:number;
}

export class claims {
    value!: string;
    type!: string;
    nome!: string;
}

export class menu{
    value!: string;
    nome!: string;
    id!:number;
    submenu!: submenu[];
}

export class submenu{
    value!: string;
    name!: string;
    route!: string;
}
