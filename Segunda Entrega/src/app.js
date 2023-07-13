import express from 'express';
import {engine} from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import cartsRouter from './routes/carts.js';
import productsRouter from './routes/products.js';
import ProductManager from './daos/mongodb/productManager.js';
import CartManager from './daos/mongodb/cartManager.js';
import __dirname from './utils.js';
import {Server} from 'socket.io';
import multer from 'multer';

const app = express();
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () =>  {
    console.log('Server listening in port ', PORT)
});
export const io = new Server(server); 

const prodContainer = new ProductManager();
const cartContainer = new CartManager();

app.engine('handlebars',engine())
app.set('views',__dirname+'/views')
app.set('view engine','handlebars')

const admin = true;
app.use(express.json(), express.text())
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname+'/public'));
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.use((req,res,next)=>{
    console.log(new Date().toTimeString().split(" ")[0], req.method, req.url);
    req.auth = admin;
    next();
})

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
})

const upload = multer({storage: storage})


app.post('/upload', upload.single('image'), (req,res) => {
    res.send('Image Uploaded')
})

//socket
io.on('connection', async socket=>{
    console.log(`El socket ${socket.id} se ha conectado`)
    socket.emit('welcome', '')
    let products = await prodContainer.getProducts();
    // let cart = await cartContainer.addCart();
    socket.emit('addProduct',products);
    // cartContainer.addCart().then(cart => {
    //     socket.emit('createCart', cart);
    // })
    // socket.on('addProductToCart', async(data) => {
    //    const updatedCart = await cartContainer.addProductToCart(data.cid,data.pid);
    //    console.log(updatedCart)
    // })
})