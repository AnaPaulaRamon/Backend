import multer from 'multer';
import __dirname from '../utils.js';
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, "public/images")
    },
    filename:(req,file,cb)=>{
        const imgName = file.originalname;
        cb(null,imgName);
    }
})
const upload = multer({storage:storage});

export default upload;