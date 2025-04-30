/**
 * Logger simple usando console
 */
function info(...args) {
    console.log('[INFO]', ...args);
}

function warn(...args) {
    console.warn('[WARN]', ...args);
}

function error(...args) {
    console.error('[ERROR]', ...args);
}

export default { info, warn, error };