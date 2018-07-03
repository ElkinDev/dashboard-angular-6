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
    {name:'Elkin',lastname:'Mendoza',email:'elkinmendoza00@gmail.com',pass:'Elkin9310!',role:{name:'superAdmin',access:['allAccess']},numdni:'12212151',token:null},
    {name:'Andres',lastname:'Gonzalez',email:'andresgonzales@gmail.com',pass:'123456789',role:{name:'comercial',access:['CreateClient','CreateClientUsers','setPlansToUsersClients']},numdni:'12212151',token:null},
    {name:'Felipe',lastname:'Arias',email:'Felipearias@gmail.com',pass:'123456789',role:{name:'auditor',access:['CreatePaymentClient','setPaymentClient']},numdni:'9589844',token:null},
    {name:'ANGULAR SAS',lastname:'SAS',email:'angularsas@gmail.com',pass:'123456789',role:{name:'empresaClient',access:['CreateMyUsers','SetPlansToMyUsers']},users:[],numdni:'12212151',token:null}
    
]
