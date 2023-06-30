import {fileURLToPath} from 'url';
import {dirname} from 'path';

const filename= fileURLToPath(import.meta.url); // esto provee un entorno de tu aplicacion, es una entidad de ubicacion
const __dirname = dirname(filename); // convierte filename que es una entidad de ubicacion en una ruta

export const  makeId = (length) => {
    var result = "";
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export default __dirname;