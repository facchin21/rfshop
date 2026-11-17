# RF Shop

Monorepo de la app de barberías y su API.

- `apps/mobile` es la app Expo.
- `server` es el backend Spring Boot. El código viene de [romanmeclazcke/rfshop](https://github.com/romanmeclazcke/rfshop).

La app todavía reserva contra sus rutas locales de Expo. El backend de `server` es el API con usuarios, locales, turnos, reseñas y favoritos.

## App

```bash
npm install --prefix apps/mobile
npm start
```

## Backend

Hace falta Java 21 y Postgres. Copiá `server/.env.example` a `server/.env` y completá los valores.

```bash
cd server
./mvnw spring-boot:run
```

El API escucha en el puerto 8080 y todos los recursos cuelgan de `/api`. El registro (`POST /api/users`) y el login (`POST /api/auth/login`) son públicos. El resto pide JWT.

Para levantarlo con Docker, primero generá el jar:

```bash
cd server
./mvnw -DskipTests package
docker compose up --build
```
