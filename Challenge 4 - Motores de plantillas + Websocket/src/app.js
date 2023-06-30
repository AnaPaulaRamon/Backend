import express from 'express';
import {engine} from 'express-handlebars';
import cartsRouter from './routes/carts.js';
import productsRouter from './routes/products.js';
import ProductManager from './classes/productManager.js';
import __dirname from './utils.js';
import {Server} from 'socket.io';

const app = express();
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () =>  {
    console.log('Server listening in port ', PORT)
});
export const io = new Server(server); 

const prodContainer = new ProductManager();

app.engine('handlebars',engine())
app.set('views',__dirname+'/views')
app.set('view engine','handlebars')

const admin = true;
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname+'/public'));
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.use((req,res,next)=>{
    console.log(new Date().toTimeString().split(" ")[0], req.method, req.url);
    req.auth = admin;
    next();
})

app.get('/', (req,res) => {
    prodContainer.getProducts().then(result=>{
        let info = result.message;
        let preparedObject ={
            products : info
        }
        res.render('home',preparedObject)
    })
})


app.get('/realtimeproducts',(req,res)=>{
    prodContainer.getProducts().then(result=>{
        let info = result.message;
        let preparedObject ={
            products : info
        }
        res.render('realTimeProducts',preparedObject)
    })
})

//socket
io.on('connection', async socket=>{
    console.log(`El socket ${socket.id} se ha conectado`)
    // let pets = await contenedor.getAllPets();
    // socket.emit('deliverPets',pets);
    // socket.emit('addProduct', 'hey there, this is the server')
    socket.emit('welcome', 'hey it is me')

})