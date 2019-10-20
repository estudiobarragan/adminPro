export class Usuario{
    constructor(
        public nombre: string,
        public correo: string,
        public clave: string,
        public img?: string,
        public role: string = 'USER_ROLE',
        public google?: boolean,
        public _id?: string
    ){}
}