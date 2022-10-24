document.addEventListener('DOMContentLoaded', function () {

	// Cuerpo del correo a enviar a través del formulario
	const email = {
		nombre: '',
		email: '',
		asunto: '',
		mensaje: ''
	}

	// Seleccionar los elementos de la interfaz
	const inputNombre = document.querySelector('#nombre');
	const inpuEmail = document.querySelector('#email');
	const inputAsunto = document.querySelector('#asunto');
	const inputMensaje = document.querySelector('#mensaje');
	const formulario = document.querySelector('#formulario');
	const btnSubmit = document.querySelector('#formulario button[type="submit"]');
	const spinner = document.querySelector('#spinner');

	// Asignar eventos
	inputNombre.addEventListener('input', validar);
	inpuEmail.addEventListener('input', validar);
	inputAsunto.addEventListener('input', validar);
	inputMensaje.addEventListener('input', validar);
	formulario.addEventListener('submit', enviarEmail);

	function enviarEmail(e) {
		// Previniendo su acción por defecto, es decir, se desea que al escuchar el evento 'submit', primero aparezca el spinner, simulando el procesamiento de datos, antes de enviar el objeto 'email'
		e.preventDefault();
		spinner.classList.add('flex');
		spinner.classList.remove('hidden');

		// Controlando el tiempo que aparece el spinner, el tiempo se escribe en ms
		setTimeout(() => {
			spinner.classList.remove('flex');
			spinner.classList.add('hidden');

			// Limpiando formulario y deshabilitando el botón
			resetFormulario();

			// Crear alerta de envío satisfactorio
			const alertaExito = document.createElement('P');
			alertaExito.classList.add('box-input__exito');
			alertaExito.textContent = 'Mensaje enviado';

			// Inyectando alerta
			formulario.appendChild(alertaExito);

			// Controlando el tiempo que aparece la alerta
			setTimeout(() => {
				alertaExito.remove();
			}, 3000);

		}, 3000); // Timeout de spinner
	}

	function validar(e) {
		// 1. Verificar si el campo está vacío y previniendo los espacios en blanco
		if (e.target.value.trim() === '') {
			/* Mostrar el aviso identificando el ID del elemento que está disparando el evento 'input'; por otro lado, .parentElement, ubicará el elemento padre del input en cuestión. Esto para poder inyectar a través de HTML el mensaje de alerta en ese sitio en particular. */
			mostrarAlerta(`El campo ${e.target.id} es obligatorio`, e.target.parentElement);

			//! Reiniciando el valor del input a vacío, cuando el formato no fue el correcto o el usuario eliminó el contenido. Esto es para limpiar cualquier dato agregado al objeto 'email'
			email[e.target.name] = '';

			//! Actualizando el array que crea la función y deshabilitando el botón
			comprobarEmail();

			// Detiene la ejecución
			return;
		}

		// 2. Validando el correo electrónico: apuntando únicamente al input de email y negando la condición para evitar colocar un else innecesario. Sólo buscamos el resultado false.
		if (e.target.id === 'email' && !validarEmail(e.target.value)) {
			mostrarAlerta('Formato de e-mail no válido', e.target.parentElement);

			//! Reiniciando el valor del input a vacío, cuando el formato no fue el correcto o el usuario eliminó el contenido. Esto es para limpiar cualquier dato agregado al objeto 'email'
			email[e.target.name] = '';

			//! Actualizando el array que crea la función y deshabilitando el botón
			comprobarEmail();

			return;
		}

		// 3. Una vez relleno el campo correspondiente, se desea eliminar el mensaje
		limpiarAlerta(e.target.parentElement);

		/* 4. Llegado a este punto, se ha aprobado todas las reglas de validación.
		Es momento de rellenar el objeto 'email' con los datos ingresados por el usuario. Mediante HTML, seleccionar los inputs contenedores de dicha información; en este ejemplo, a través el atributo 'name'. */

		// sin espacios en blanco y en minúscula
		email[e.target.name] = e.target.value.trim().toLowerCase();
		// Comprobar el objeto 'email'
		comprobarEmail();
	}

	function mostrarAlerta(mensaje, referencia) {
		// Esta función se coloca primero porque igualmente primero necesitamos comprobar si ya existe una alerta. Si ya existe, eliminarla, para evitar se genere nuevamente
		limpiarAlerta(referencia);

		// Si no existe, generarla en HTML.
		// Se recomienda que el tag elegido, se escriba en mayúsculas
		const error = document.createElement('P');
		error.textContent = mensaje;
		// Generando CSS del elemento
		error.classList.add('box-input__error');

		// Inyectar error al formulario
		// .appendChild(), agrega un nuevo elemento a lo ya existente
		referencia.appendChild(error);
	}

	function limpiarAlerta(referencia) {
		// Comprobar si ya existe una alerta ligada a la referencia (e.target.parentElement)
		const alerta = referencia.querySelector('.box-input__error');
		// Si existe, eliminarla
		if (alerta) {
			alerta.remove();
		}
	}

	function validarEmail(email) {
		const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
		// El .test() retonará un valor booleano
		const resultado = regex.test(email);
		return resultado;
	}

	function comprobarEmail() {
		/* Object.values, toma todos los valores de las llaves del objeto 'email' y los ingresa a un array. De ese modo se verifica si existen strings vacíos con un array method: .includes() y retorna un valor booneano. */
		if (Object.values(email).includes('')) {
			// Si encuentra campos vacíos, deshabilitar el botón
			btnSubmit.classList.add('btn--opacity');
			btnSubmit.disabled = true;
			return;
		}

		// Si no existen campos vacíos, puede proceder al envío, habilitando el botón
		btnSubmit.classList.remove('btn--opacity');
		btnSubmit.disabled = false;
	}

	function resetFormulario() {
		// Una vez tomanda la decisión de limpiar los campos, se debe reiniciar el objeto 'email' que ya contenía la información ingresada por el usuario.
		email.nombre = '';
		email.email = '';
		email.asunto = '';
		email.mensaje = '';

		// Limpiando formulario
		formulario.reset();

		// Actualizando el array que crea la función y deshabilitando el botón
		comprobarEmail();
	}

});
