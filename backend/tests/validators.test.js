const { validateTaskData } = require('../src/utils/validators');

describe('Pruebas Automatizadas - Actividad 5', () => {

    test('1. Debería rechazar una tarea con título vacío o en blanco', () => {
        const isValid = validateTaskData('     ');
        expect(isValid).toBe(false);
    });

    test('2. Debería aceptar una tarea con un título válido (Regla de negocio)', () => {
        const isValid = validateTaskData('Terminar examen práctico');
        expect(isValid).toBe(true);
    });

    test('3. Debería retornar false cuando se envía un dato nulo', () => {
        expect(validateTaskData(null)).toBe(false);
    });
});
