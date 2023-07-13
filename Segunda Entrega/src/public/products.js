// const socket = io();
// let aux = null;

//---------------------------SOCKET BEGINS--------------------------------------
// socket.on('createCart',data=>{
//     aux = data.result._id;
// })

// function addProduct(prod) {
//     console.log('this is cid ', aux, ' and this is pid ', prod)
//     let addProd = {cid: aux, pid: prod}
//     socket.emit('addProductToCart', addProd)
//     Swal.fire({
//         title:'Success',
//         text:'Product added to the cart',
//         icon:'success',
//         timer:2000,
//     })
// }


function addToCartButton (idCart, idProduct){
    console.log("intentamo")
    fetch(`http://localhost:8080/carts/${idCart}/products/${idProduct}`,{
        method:'POST',
    })
};

const botonAtras = document.getElementById('botonAtras');

botonAtras.addEventListener('click', () => {
    window.history.back();
});