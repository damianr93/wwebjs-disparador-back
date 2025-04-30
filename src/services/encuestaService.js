import config from '../config/index.js';

/**
 * Retorna el mensaje de bienvenida completo,
 * reemplazando el marcador {encuestaUrl} en la plantilla.
 */
export function getMensajeBienvenida() {
    return config.mensajeBienvenidaTemplate.replace(
        '{encuestaUrl}',
        config.encuestaUrl
    );
}
