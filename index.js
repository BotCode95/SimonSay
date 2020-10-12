
//Botones -- Variables de configuracion
//const MY_OBJECT = {'key': 'value'}; 

const botones = {
	//Botón Celeste
	top_left: { id:"top_left"},
	//Botón Rojo
	top_right: { id:"top_right"},
	//Botón Amarillo
	bottom_left: { id:"bottom_left"},
	//Botón Verde
	bottom_right: { id:"bottom_right"},
}

const estadoJuego = {
	intervalos: {
		inicio:1000,
		secuencia:500
	},
	segundosJuego:3,
	interacciones: false,
	nivelJuego: 0,
	nivelUsuario: 0,
	secuenciaJuego: [],
	secuenciaUsuario:[],
	botones,
}

const accionBotones = document.querySelectorAll(".simon-button");

	const activar = (elementoDom) => {
		elementoDom.classList.add("active");
	}

	const desactivar = (elementoDom) => {
		elementoDom.classList.remove("active");
	}

	const mostrar = (elementoDom) => {
		elementoDom.classList.add("show");
		elementoDom.classList.remove("hide");
	}

	const ocultar = (elementoDom) => {
		elementoDom.classList.add("hide");
		elementoDom.classList.remove("show");
	}

	const activarTodos = (elementos) => {
		elementos.forEach(activar);
	}

	const desactivarTodos = (elementos) => {
		elementos.forEach(desactivar);
	}
// obtener
	const obtener = id => {
		return window.document.getElementById(id);
	}


//onclick accionModalInicio
const accionModalInicio = () => {
	//Obtener nombre del jugador
	const nombreJugadorInicio = obtener("nombre_jugador");
	const nombreJugadorPase =  nombreJugadorInicio.value;

	//validacion del dato
	const acceso = nombreJugadorPase.length;

	if(acceso){
		//Ocultar modal
		const ocultarModal = obtener("inicio_juego");
		ocultar(ocultarModal);
		//mostrar nombre 
		const mostrarNombre = obtener("nombre_usuario");
		mostrarNombre.textContent= nombreJugadorPase;

		//almacenar el nombre en localStorage
	
		localStorage.setItem("nombre", nombreJugadorPase);
		//inicio el juego
		inicializacion();	
	}
}


const accionModalFin = () => {
	const modalFin = obtener("fin_juego");
	ocultar(modalFin);
	inicializacion();

}

//Funcionando el inicio, oculta el modal, aparece el juego y almacena el nombre en localstorage

//---------------------

//Click boton segun ID
const clickBoton = id => {
	if(!estadoJuego.interacciones){
		var audioError = document.getElementById("audioE");
	audioError.play();
	return;

	}
		
	//Guardar la secuenciaUsuario
	estadoJuego.secuenciaUsuario.push(id);
	
	const secuenciaJuegoNivel = estadoJuego.secuenciaJuego[estadoJuego.nivelUsuario];
	const secuenciaUsuarioNivel = estadoJuego.secuenciaUsuario[estadoJuego.nivelUsuario];
	
	var audio = document.getElementById("audio");
	audio.play();

		if(secuenciaJuegoNivel === secuenciaUsuarioNivel){
			//si la respuesta fue identica se suma uno en el nivel de usuario para el sig nivel
			estadoJuego.nivelUsuario++;
		} else {
			// termina el juego
			const elementoJuego = obtener("juego");
			ocultar(elementoJuego);
			desactivarInteracciones();
			//mostrar modal Final
			const modalFinal = obtener("fin_juego");
			mostrar(modalFinal);
			var audioError = document.getElementById("audioE");
			audioError.play();
			
			const puntajeFinal = obtener("puntaje");
			puntajeFinal.textContent = `Tu puntaje es ${estadoJuego.nivelJuego}`;
			
			return;
			}
		//Verificar que tanto juego como usuario esten en el mismo nivel
		if(estadoJuego.nivelJuego === estadoJuego.nivelUsuario){
			desactivarInteracciones();
			estadoJuego.secuenciaUsuario=[];
			estadoJuego.nivelUsuario  = 0;
			reproducirSecuencia();
			}
};

//interacciones

//activar
const activarInteracciones = () => {
	const interaccionJuego = obtener("app");
	interaccionJuego.classList.remove("app-background-dark");

	const elementoTexto = obtener("turno_texto");
	mostrar(elementoTexto);
	elementoTexto.textContent = " TU TURNO";

	estadoJuego.interacciones = true;
};
//desactivar

const desactivarInteracciones = () => {
	const interaccionJuego = obtener("app");
	interaccionJuego.classList.add("app-background-dark");

	const elementoTexto = obtener("turno_texto");
	ocultar(elementoTexto);

	estadoJuego.interacciones = false;
}

const obtenerElementoAleatorio = () => {
	//mostrar al azar la secuencia de los botones(top_left, top_right, bottom_left, bottom_right)
	const botonesIds = Object.keys(estadoJuego.botones);
	const objAleatorio = botonesIds[Math.floor(Math.random() * botonesIds.length)];

	return estadoJuego.botones[objAleatorio];
};

const reproducirSecuencia = () => {
	let secuencia = 0;

	//incrementar secuencia
	estadoJuego.secuenciaJuego.push(obtenerElementoAleatorio().id);
	estadoJuego.nivelJuego= estadoJuego.nivelJuego + 1;
	

	//Intervalo de secuencia
	const intervaloSecuencia = setInterval(() => {
		const intervaloPausa = secuencia % 2 === 1;
		const intervaloFin = secuencia === (estadoJuego.secuenciaJuego.length *2);
	

	if(intervaloPausa) {
		//desactivar los botones
		desactivarTodos(accionBotones);
		secuencia++;

		return;
	}

	if(intervaloFin) {
		clearInterval(intervaloSecuencia);
		//activar Interacciones
				
		//desactivar botones
		desactivarTodos(accionBotones);
		activarInteracciones();	

		return;
	}

		//Funcion secuencia
		const id = estadoJuego.secuenciaJuego[secuencia/2];
		const secuenciaDefinida = obtener(id);
		activar(secuenciaDefinida);
		secuencia++;
		var audioHover = document.getElementById("audio1");
		audioHover.play();

	},estadoJuego.intervalos.secuencia);

};
const inicializacion = () => {	
		let segundosInicio = estadoJuego.segundosJuego;  //segundosJuego O segundosInicio
			//reset
			estadoJuego.secuenciaJuego = [],
			estadoJuego.secuenciaUsuario= [],
			estadoJuego.nivelJuego = 0,
			estadoJuego.nivelUsuario= 0;
		
		//Mostrar Juego
		const InicioJuego = obtener("juego");
		mostrar(InicioJuego);
		const cuentaRegresiva = obtener("cuenta_regresiva");
		//mostrar la cuenta
		mostrar(cuentaRegresiva);
		cuentaRegresiva.textContent= segundosInicio;

		//intervalo para la cuenta
		const intervalo = setInterval(() => {
			segundosInicio--; // tendria que restar 1 segundo

			//Vuelvo a ver el contador
			cuentaRegresiva.textContent=segundosInicio;

			if(segundosInicio===0){
				ocultar(cuentaRegresiva);

				reproducirSecuencia();
				clearInterval(intervalo);
			}
		},estadoJuego.intervalos.inicio);
} //fin inicializacion

	//getItem("nombreQueAlmacena")
	const nombreJugadorAlmacena = localStorage.getItem("nombre");
	const mostrarNombre  = obtener("nombre_jugador");
	mostrarNombre.value = nombreJugadorAlmacena || "anonimo";





