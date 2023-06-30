const socket = io();

const titleAux = document.getElementById('title')

titleAux.innerText = 'something else'

//---------------------------EVENTOS DE SOCKET --------------------------------------
// socket.on('seeProducts',data=>{
//     let products = data;
//     fetch('../views/realTimeProducts.handlebars').then(string=>string.text()).then(template=>{ // cuando hacemos fetch a un archuvo lo trae como un texto plano, asi que lo convertimos a text() para que quede como un texto manipulable
//         const processedTemplate = Handlebars.compile(template); // con la libreria handlebars compilamos la template (hay que poner el script de handlebars at the beginning of the index.html)
//         const templateObject={ // prepara el objeto para enviarlo a la plantilla
//             products:products
//         }
//         const html = processedTemplate(templateObject);
//         let div = document.getElementById('prodTable');
//         div.innerHTML=html;
//     })
// })

socket.on('welcome', (data) =>{
    alert(data);
    console.log(data)
})

//-----------------------------FIN DE SOCKET ----------------------------------------------
document.addEventListener('submit',enviarFormulario);

function enviarFormulario(event){
    event.preventDefault();
    let form= document.getElementById('petForm');
    let data = new FormData(form);
    fetch('/api/products',{
        method:'POST',
        body:data
    }).then(result=>{
        return result.json();
    }).then(json=>{
        Swal.fire({
            title:'Éxito',
            text:json.message,
            icon:'success',
            timer:2000,
        }).then(result=>{
            //location.href='/'
        })
    })
}

// document.getElementById("image").onchange = (e)=>{
//     let read = new FileReader();
//     read.onload = e =>{
//         document.querySelector('.image-text').innerHTML = "¡Qué hermoso!"
//         document.getElementById("preview").src = e.target.result;
//     }
    
//     read.readAsDataURL(e.target.files[0])
// }