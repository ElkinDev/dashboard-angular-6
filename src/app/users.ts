export class Users {
    constructor(
        name:string,
        lastname:string,
        correo:string,
        pass:string,
        role:string,
    ){

    }
}

export const userList=[
    {name:'Elkin',lastname:'Mendoza',email:'elkinmendoza00@gmail.com',pass:'Elkin9310!',role:'superAdmin',numdni:'12212151',token:null},
    {name:'Andres',lastname:'Gonzalez',email:'andresgonzales@gmail.com',pass:'123456789',role:'comercial',numdni:'12212151',token:null},
    {name:'Felipe',lastname:'Arias',email:'Felipearias@gmail.com',pass:'123456789',role:'auditor',numdni:'12212151',token:null},
    {name:'ANGULAR SAS',lastname:'SAS',email:'angularsas@gmail.com',pass:'123456789',role:'empresaClient',users:[],numdni:'12212151',token:null}
    
]
