package org.example.rfshop.Auth.Infrastructure.Exception;

public class InvalidCredentials extends RuntimeException {
    public InvalidCredentials() {
        super("El correo o la contraseña no son correctos.");
    }
}
