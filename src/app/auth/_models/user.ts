export class User {
  id!: number;
  email!: string;
  password!: string;
  fullName!: string;
  max_role!: number;
  nome_grupos!: string;
  is_master!: boolean;
  unidades!: any[];
  unidade_selecionada: any;
  name!: string;
  empresa!: string;
  empresa_ids!: number[];
  responsavel!: boolean;
  subdominio!: any;
  situacao!: any;
  provider!: any;
  permissoes_ativas!: any;
  avatar_body!: number;
  avatar_hair!: number;
  avatar_clothes!: number;
  avatar_extra!: number;
  calenda_nps_id!: number;
}
