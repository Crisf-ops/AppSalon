//Variable Global para las secciones de la APP
let pagina = 1;

const cita = {
    nombre:'',
    dia: '',
    hora: '',
    servicio: []
}

document.addEventListener('DOMContentLoaded', function () {
    iniciarApp();
});

function iniciarApp() {    

    mostrarServicios();

    //Resaltar el DIV actual Segun al tab al que se preciona
    mostrarSeccion();

    //Ocualta o muestra una seccion segun el tab al que se presiona
    cambiarSeccion();

    // Paginacion siguiente y anterior
    paginaSiguiente();

    paginaAnterior();

    // Comprueba la pagina actual para ocultar o mostrar la paginacion
    btnPagiador();

    //Mostrar el resumen de la cita
    mostarResumen();

    //Almacenar el nombre del cliente
    nombreCita();

    //Almacenar fecha
    fechaCita();

    //Deshabilitar dias pasados
    deshahilitarDias();
}

//Mostrar Seccion actual
function mostrarSeccion() {

    // Eliminar mostrar-seccion de la seccion anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    //Eliminar la clase de actual en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if (tabAnterior) {
        tabAnterior.classList.remove('actual')
    }

    //Resaltar el Tab Actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual')
}

//Cambiar La Seccion
function cambiarSeccion() {
    //Selecionamos los la clase tabs y los elementos button
    const enlaces = document.querySelectorAll('.tabs button')
    //Iteramos los elementos
    enlaces.forEach((enlace)=>{
        enlace.addEventListener('click', e =>{
            e.preventDefault();

            //pasar el valor de string a entero
            pagina = parseInt(e.target.dataset.paso);

            //Eliminar mostrar-seccion de la seccion anterior
            document.querySelector('.mostrar-seccion').classList.remove('mostrar-seccion');

            //Agregar mostrar-seccion donde dimos click
            const seccion = document.querySelector(`#paso-${pagina}`);
            seccion.classList.add('mostrar-seccion');

            //Eliminar la clase de actual tab anterior
            document.querySelector('.tabs .actual').classList.remove('actual');
            
            //agregamos la clase de actual en el nuevo tab
            const tab = document.querySelector(`[data-paso="${pagina}"]`)
            tab.classList.add('actual')

            //LLamar la funcion de mostrar seccion
            mostrarSeccion();
            btnPagiador();
        })
    })
}

async function mostrarServicios() {
    try {
        const resultado = await fetch('./servicios.json')
        const dt = await resultado.json();
        const { servicios } = dt;

        //general html
        servicios.forEach(servicio => {
            const {id, nombre, precio} = servicio

            //DOM Scripting
            //Generar nombre del servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            
            //Generar precio del servicio
            const precioServicio = document.createElement('P');
            precioServicio.textContent =`$ ${precio}`;
            precioServicio.classList.add('precio-servicio')

            //Generar div de servicio
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio')
            servicioDiv.dataset.idServicio = id;
            
            //Seleccionar un servicio para cita
            //onclik se utiliza mas para elementos creados con JS
            servicioDiv.onclick = seleccionarServicio;


            //Inyectar precio y nombre al div
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio)

            //Inyectar en el HTML
            document.querySelector('#servicios').appendChild(servicioDiv)
            // console.log(servicioDiv);

        });
    } catch (error) {
        console.log(error)
    }
}

function seleccionarServicio(e) {
    
    let elemento;
    //Forzar que el elemento al cual le damos click sea el DIV
    if (e.target.tagName === 'P') {
        elemento = e.target.parentElement;
    } else {
        elemento = e.target;
    }

    //Agregar seleccion al elemento
    //contains: para saber si una clase existe en un elemento
    if (elemento.classList.contains('seleccionado')) {
        //Remover clase
        elemento.classList.remove('seleccionado');
        const id = parseInt(elemento.dataset.idServicio)
        eliminarServicio(id);
    } else {
        //Añadir clase
        elemento.classList.add('seleccionado');
        
        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }
        agregarServicio(servicioObj);
        // console.log(servicioObj)
    }
}
//eliminar servicio
function eliminarServicio(id) {
    
    const {servicio} = cita;

    cita.servicio = servicio.filter( servicio => servicio.id !== id);

    console.log(cita)
}
//Agregar servicio
function agregarServicio(servicioObj) {

    const {servicio} = cita;

    //Los 3 puntos es una copia del arreglo original
    cita.servicio = [...servicio, servicioObj];
    // console.log(cita)
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#next');
    paginaSiguiente.addEventListener('click',() =>{
        pagina++;
        console.log(pagina)

        btnPagiador();
    });
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#back');
    paginaAnterior.addEventListener('click',() =>{
        pagina--;
        console.log(pagina)
        btnPagiador();
    });
}

function btnPagiador() {
    const paginaSiguiente = document.querySelector('#next');
    const paginaAnterior = document.querySelector('#back');

    if (pagina == 1) {
        paginaAnterior.classList.add('ocultar');

    }else if(pagina == 3){
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');
    }else{
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion();// Cambia la seccion que se muestra por la pagina
    // cambiarSeccion();
}

function mostarResumen() {
    //Destructuring
    const {nombre, fecha,hora,servicio} = cita;

    //Seleccionar el resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    //Validacion de objeto
    if (Object.values(cita).includes('')) {
        const noServicio = document.createElement('P')
        noServicio.textContent = 'Falta datos de Servicios, Hora, Fecha o Nombre'
        noServicio.classList.add('invalidar-cita')
        //agregar a resumen div
        resumenDiv.appendChild(noServicio)
    } else {
        
    }
}

function nombreCita() {
    const nombreInput = document.querySelector('#nombre')

    nombreInput.addEventListener('input', event =>{
        //Trim no cuenta los espacios que se deja el usuario(eliminar espacios en blancos)
        const nombreTexto = event.target.value.trim();

        //Validacion de que nombreTexto debe tener algo
        if (nombreTexto === '' || nombreTexto.length < 3) {
            mostrarAlerta('Nombre no valido','error')
        }else{
            const alerta = document.querySelector('.alerta')
            if (alerta) {
                alerta.remove();
            }
            cita.nombre = nombreTexto;
        }
        
    })
}

function mostrarAlerta(mensaje, tipo) {

    //Si hay una alerta no crear otra
    const alertaPrevia = document.querySelector('.alerta')
    if (alertaPrevia) {
        return;
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if (tipo === 'error') {
        alerta.classList.add('error')
    }

    //insertar en el html
    const formulario = document.querySelector('.formulario');
    formulario.appendChild (alerta);

    //Eliminar la alerta despues de 3 segundos
    setTimeout(() => {
        alerta.remove()
    }, 3500);
}

function fechaCita() {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e =>{

        const dia = new Date(e.target.value).getUTCDay();
        // const opciones = {
        //     weekday : 'long',
        //     year: 'numeric',
        //     month: 'long'
        // }
        if ([0].includes(dia)) {
            e.preventDefault();
            fechaInput.value='';
            mostrarAlerta('El Domingo no trabajamos','error')
        } else {
            cita.fecha = fechaInput.value;
            console.log (cita)
        }
    })
}

function deshahilitarDias() {
    const inputFecha = document.querySelector('#fecha').setAttribute('min',fechaDeshabilitar)
    
    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth() +1;
    const dia = fechaAhora.getDate() ;

    //formato deseado: AAAA-MM-DD
    const fechaDeshabilitar = `${year}-${mes}-${dia}`;
    console.log(dia)
   
}