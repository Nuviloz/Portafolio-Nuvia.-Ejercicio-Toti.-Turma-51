document.addEventListener('DOMContentLoaded', function() {
    
    // --- LÓGICA PARA EL FORMULARIO DE CONTACTO ---
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevenir el envío real para validar primero
            let isValid = true;

            // Limpiar errores previos
            clearFormErrors();

            // Campos del formulario
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');

            // Validar Nombre
            if (nameInput.value.trim() === '') {
                displayFormError('nameError', 'El campo nombre es obligatorio.', nameInput);
                isValid = false;
            }

            // Validar Email
            if (emailInput.value.trim() === '') {
                displayFormError('emailError', 'El campo email es obligatorio.', emailInput);
                isValid = false;
            } else if (!isValidEmail(emailInput.value.trim())) {
                displayFormError('emailError', 'Por favor, ingrese un email válido.', emailInput);
                isValid = false;
            }

            // Validar Mensaje
            if (messageInput.value.trim() === '') {
                displayFormError('messageError', 'El campo mensaje es obligatorio.', messageInput);
                isValid = false;
            }

            if (isValid) {
                // Aquí iría la lógica para enviar el formulario realmente
                // (ej. usando fetch para enviarlo a un backend o un servicio como Formspree)
                // Por ahora, solo una alerta y reseteamos.
                alert('Formulario enviado con éxito! (Simulación)');
                contactForm.reset(); // Limpia el formulario
                clearFormErrors(); // Limpia mensajes de error y bordes
            }
        });
    }

    function displayFormError(elementId, message, inputElement) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
        }
        if (inputElement) {
            inputElement.classList.add('input-error'); // Añade clase para borde rojo
        }
    }

    function clearFormErrors() {
        const errorMessages = document.querySelectorAll('#contactForm .error-message');
        errorMessages.forEach(el => el.textContent = '');

        const errorInputs = document.querySelectorAll('#contactForm .input-error');
        errorInputs.forEach(el => el.classList.remove('input-error'));
    }

    function isValidEmail(email) {
        // Expresión regular simple para validación de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // --- LÓGICA PARA CARGAR REPOSITORIOS DE GITHUB ---
    // Reemplaza 'Nuviloz' con tu nombre de usuario de GitHub si es diferente.
    fetchGithubRepos('Nuviloz'); 

}); // Fin de DOMContentLoaded


async function fetchGithubRepos(username) {
    const reposContainer = document.getElementById('repos-container');
    if (!reposContainer) {
        console.error('Elemento #repos-container no encontrado.');
        return;
    }
    // Mostrar mensaje de carga inicial que ya está en el HTML, o puedes modificarlo aquí
    // reposContainer.innerHTML = '<p>Cargando repositorios...</p>'; 

    const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated&direction=desc`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Error en la API de GitHub: ${response.status} ${response.statusText}`);
        }
        const repos = await response.json();

        reposContainer.innerHTML = ''; // Limpiar mensaje de "Cargando..." o contenido previo

        if (repos.length === 0) {
            reposContainer.innerHTML = '<p>No se encontraron repositorios públicos.</p>';
            return;
        }

        const ul = document.createElement('ul');
        ul.classList.add('repo-list'); // Para aplicar estilos CSS

        repos.forEach(repo => {
            const li = document.createElement('li');
            li.classList.add('repo-item'); // Para aplicar estilos CSS
            li.innerHTML = `
                <h3><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a></h3>
                <p>${repo.description || 'Sin descripción.'}</p>
                <p>
                    <strong>⭐ Estrellas:</strong> ${repo.stargazers_count} | 
                    <strong>🍴 Forks:</strong> ${repo.forks_count} |
                    <strong>Lenguaje:</strong> ${repo.language || 'N/D'}
                </p>
            `;
            ul.appendChild(li);
        });
        reposContainer.appendChild(ul);

    } catch (error) {
        console.error('Falla al buscar repositorios:', error);
        reposContainer.innerHTML = `<p>No fue posible cargar los repositorios. (${error.message})</p>`;
    }
}