
function generarPDF() {
    window.print();
  }
  



function buscarArticulo() {
    const busqueda = document.getElementById('busqueda').value.toLowerCase();
    const articulos = document.querySelectorAll('#articulos-lista li');

    for (const articulo of articulos) {
        const nombre = articulo.textContent.toLowerCase();

        // Almacenar el estilo de visualización original
        if (!articulo.originalDisplay) {
            articulo.originalDisplay = window.getComputedStyle(articulo).display;
        }

        if (nombre.includes(busqueda)) {
            articulo.style.display = articulo.originalDisplay;
        } else {
            articulo.style.display = 'none';
        }
    }
}

function buscarArticuloEnTiempoReal() {
    const busqueda = document.getElementById('busqueda').value.toLowerCase();
    const articulos = document.querySelectorAll('#articulos-lista li');

    for (const articulo of articulos) {
        const nombre = articulo.textContent.toLowerCase();

        // Almacenar el estilo de visualización original
        if (!articulo.originalDisplay) {
            articulo.originalDisplay = window.getComputedStyle(articulo).display;
        }

        if (nombre.includes(busqueda)) {
            articulo.style.display = articulo.originalDisplay;
        } else {
            articulo.style.display = 'none';
        }
    }
}

  

    
async function obtenerArticulos() {
  const response = await fetch('http://localhost:3000/articulos');
  const data = await response.json();

  const articulosPorUbicacion = {};

  data.forEach(articulo => {
    const ubicacion = articulo.ubicacion;
    if (!articulosPorUbicacion[ubicacion]) {
      articulosPorUbicacion[ubicacion] = [];
    }
    articulosPorUbicacion[ubicacion].push(articulo);
  });

  const listaArticulos = document.getElementById('articulos-lista');
  listaArticulos.innerHTML = '';

  for (const ubicacion in articulosPorUbicacion) {
    const ubicacionHeader = document.createElement('h2');
    ubicacionHeader.textContent = `${ubicacion}`;
    listaArticulos.appendChild(ubicacionHeader);

    const ubicacionLista = document.createElement('ul');
    ubicacionLista.classList.add('ubicacion-lista');

    articulosPorUbicacion[ubicacion].forEach(articulo => {
      const item = document.createElement('li');
      item.classList.add('articulo-item');

      const nombreColumna = document.createElement('span');
      nombreColumna.classList.add('columna');
      nombreColumna.innerHTML = `<span style="color: red;">Nombre:</span> ${formatearNombre(articulo.nombre)}`;
      item.appendChild(nombreColumna);

      const cantidadColumna = document.createElement('span');
      cantidadColumna.classList.add('columna');
      cantidadColumna.innerHTML = `<span style="color: RED;">Cantidad:</span> ${articulo.cantidad}`;
      item.appendChild(cantidadColumna);

      const precio1Columna = document.createElement('span');
      precio1Columna.classList.add('columna');
      precio1Columna.innerHTML = `<span style="color: red;">Precio1:</span> ${articulo.precio1}`;
      item.appendChild(precio1Columna);

      const precio2Columna = document.createElement('span');
      precio2Columna.classList.add('columna');
      precio2Columna.innerHTML = `<span style="color: red;">Precio2:</span> ${articulo.precio2}`;
      item.appendChild(precio2Columna);

      const precio3Columna = document.createElement('span');
      precio3Columna.classList.add('columna');
      precio3Columna.innerHTML = `<span style="color: red;">Precio3:</span> ${articulo.precio3}`;
      item.appendChild(precio3Columna);

      const botonesContainer = document.createElement('div');
      botonesContainer.classList.add('botones-container');

      const editarBtn = document.createElement('button');
      editarBtn.innerHTML = `<img src="./assets/edit.png" alt="Editar">`;
      editarBtn.addEventListener('click', () => {
        mostrarFormularioActualizar(articulo);
      });
      botonesContainer.appendChild(editarBtn);

      const eliminarBtn = document.createElement('button');
      eliminarBtn.innerHTML = `<img class="delete"src="./assets/delete.png" alt="Eliminar">`;
      eliminarBtn.addEventListener('click', () => {
        eliminarArticulo(articulo.id);
      });
      botonesContainer.appendChild(eliminarBtn);

      item.appendChild(botonesContainer);
      ubicacionLista.appendChild(item);
    });

    listaArticulos.appendChild(ubicacionLista);
  }
}



    function formatearNombre(nombre) {
      return nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
    }

    let articuloIdActualizando;  // Variable para almacenar el ID del artículo que se está actualizando

    function mostrarFormularioActualizar(articulo) {
  const formularioAgregar = document.getElementById('formulario-agregar');
  const formularioActualizar = document.getElementById('formulario-actualizar');
  const h2Actualizar = document.querySelector('#formulario-actualizar h2');

  formularioActualizar.style.display = 'block';
  h2Actualizar.style.display = 'block';

  // Obtén los elementos de los campos del formulario
  const nombreInput = document.getElementById('nombreAct');
  const cantidadInput = document.getElementById('cantidadAct');
  const ubicacionInput = document.getElementById('ubicacionAct');
  const precio1Input = document.getElementById('precio1Act');
  const precio2Input = document.getElementById('precio2Act');
  const precio3Input = document.getElementById('precio3Act');

  // Asigna los valores del artículo a los campos del formulario
  nombreInput.value = articulo.nombre;
  cantidadInput.value = articulo.cantidad;
  ubicacionInput.value = articulo.ubicacion;
  precio1Input.value = articulo.precio1;
  precio2Input.value = articulo.precio2;
  precio3Input.value = articulo.precio3;

  // Enfoca el primer campo del formulario
  nombreInput.focus();

  // Hacer scroll hacia el final de la página
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'  // Animación suave de scroll
  });

  const actualizarBtn = document.getElementById('actualizarBtn');
  const cancelarBtn = document.getElementById('cancelarBtn');

  cancelarBtn.style.display = 'inline-block';  // Mostrar botón "Cancelar"

  // Almacenar el ID del artículo que se está actualizando
  articuloIdActualizando = articulo.id;

  cancelarBtn.addEventListener('click', () => {
    formularioActualizar.style.display = 'none';
    h2Actualizar.style.display = 'none';
    articuloIdActualizando = null;
  });

  actualizarBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    // Solo si hay un artículo en proceso de actualización
    if (articuloIdActualizando) {
      const nuevoNombre = nombreInput.value;
      const nuevaCantidad = cantidadInput.value;
      const nuevaUbicacion = ubicacionInput.value;
      const nuevoPrecio1 = precio1Input.value;
      const nuevoPrecio2 = precio2Input.value;
      const nuevoPrecio3 = precio3Input.value;

      // Llamada para actualizar el artículo
      await actualizarArticulo(
        articuloIdActualizando,
        nuevoNombre,
        nuevaCantidad,
        nuevaUbicacion,
        nuevoPrecio1,
        nuevoPrecio2,
        nuevoPrecio3
      );

      // Ocultar formulario de actualizar y mostrar el de agregar
      formularioActualizar.style.display = 'none';
      h2Actualizar.style.display = 'none';
      cancelarBtn.style.display = 'none';  // Ocultar botón "Cancelar"
      // Limpiar el ID del artículo que se está actualizando después de la actualización
      articuloIdActualizando = null;
    }
  });
}



async function actualizarArticulo(id, nombre, cantidad, ubicacion, precio1, precio2, precio3) {
  const botonActualizar = document.getElementById('actualizarBtn');
  botonActualizar.disabled = true;

  const response = await fetch(`http://localhost:3000/articulos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nombre, cantidad, ubicacion, precio1, precio2, precio3 })
  });

  if (response.ok) {
    obtenerArticulos();
  } else {
    alert('Error al actualizar el artículo');
  }

  botonActualizar.disabled = false;
}


    async function eliminarArticulo(id) {
      const response = await fetch(`http://localhost:3000/articulos/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Artículo eliminado correctamente');
        obtenerArticulos();
      } else {
        alert('Error al eliminar el artículo');
      }
    }

    async function agregarArticulo(event) {
      event.preventDefault();

      const nombre = document.getElementById('nombre').value;
      const cantidad = document.getElementById('cantidad').value;
      const ubicacion = document.getElementById('ubicacion').value;

      const response = await fetch('http://localhost:3000/articulos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, cantidad, ubicacion })
      });

      if (response.ok) {
        alert('Artículo agregado correctamente');
        document.getElementById('formulario-agregar').reset();
        obtenerArticulos();
      } else {
        alert('Error al agregar el artículo');
      }
    }

    window.onload = () => {
      obtenerArticulos();
    };