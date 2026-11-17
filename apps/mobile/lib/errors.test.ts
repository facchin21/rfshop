import { errorMessage } from './errors';

describe('errorMessage', () => {
  it('lee el mensaje del API', () => {
    expect(errorMessage({ message: 'El correo o la contraseña no son correctos.' })).toBe(
      'El correo o la contraseña no son correctos.',
    );
  });

  it('junta los errores de validación', () => {
    expect(errorMessage(['The email should be valid', 'The password must be at least 6 characters long'])).toBe(
      'The email should be valid\nThe password must be at least 6 characters long',
    );
  });

  it('usa un texto propio si la respuesta no trae mensaje', () => {
    expect(errorMessage(null)).toBe('No pudimos completar la solicitud.');
  });
});
