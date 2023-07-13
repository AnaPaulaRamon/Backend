const socket = io();


//---------------------------SOCKET BEGINS--------------------------------------
socket.on('addProduct',data=>{
    let products = data.payload;
    fetch('/realTimeProducts.handlebars').then(string=>string.text()).then(template=>{ // cuando hacemos fetch a un archuvo lo trae como un texto plano, asi que lo convertimos a text() para que quede como un texto manipulable
        const processedTemplate = Handlebars.compile(template); // con la libreria handlebars compilamos la template (hay que poner el script de handlebars at the beginning of the index.html)
        const templateObject={ // prepara el objeto para enviarlo a la plantilla
            products:products
        }
         let html = processedTemplate(templateObject);
         let div = document.getElementById('realtimeproducts-container');
         div.innerHTML = html;
    })
})

socket.on('welcome', (data) =>{
    console.log(data)
})

//-----------------------------SOCKET ENDS----------------------------------------------

// ADD PRODUCT IN REALTIMEPRODUCTS

document.addEventListener('submit',sendForm);

function sendForm(event){
    event.preventDefault();
    let form = document.getElementById('register-form');
    let data = new FormData(form);
    const payload = new URLSearchParams(data)
    fetch('/api/products',{
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',                 
            'Accept': '*/*' 
         },
        body:payload
    }).then(result=>{
        return result.json();
    }).then(json=>{
        Swal.fire({
            title:'Success',
            text:json.message,
            icon:'success',
            timer:4000,
        }).then(result=>{
            //location.href='/'
        })
    })
}

