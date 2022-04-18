//Modelos
const Cliente = require('../models/cliente');
const Nutriologo = require('../models/nutriologo');

//Baneo por inactividad
const baneoAutomatico = async() => {

    try{
        //Nutriólogos
        const nutriologos = await Nutriologo.aggregate([
            {$match: {'baneado': false}}
        ]);

        for await (let nutriologo of nutriologos) {
            //Si la diferencia de fechas con la actual es mayor a 6 meses
            nutriologo.baneado = true;
            await Nutriologo.findByIdAndUpdate(id, nutriologo);
        }

        //Clientes
    }catch(error){
        console.log(error);
    }

}