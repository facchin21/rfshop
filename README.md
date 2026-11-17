# RF Shop

Monorepo de la app de barberías y su API.

- `apps/mobile` es la app Expo.
- `server` es el backend Spring Boot.

La app habla con el API en local. El deploy queda para después.

## Cuentas de prueba

El API las crea la primera vez que arranca, si la base está vacía.

- Cliente: `ana@barber.test` / `usuario123`
- Barbero: `martin@barber.test` / `barber123`

El barbero ya tiene el local Barber Rivadavia, en Rivadavia 2322, con turnos de 30 minutos. Ana tiene uno reservado.

## Backend

Hace falta Java 21 y Postgres en `localhost:5432`, base `rfshop`, usuario y clave `rfshop`. Con esos valores el API arranca sin copiar el `.env`. Cloudinary, el mail y la detección de imágenes quedan vacíos: reservar un turno no los necesita.

```bash
cd server
./mvnw spring-boot:run
```

El API escucha en el puerto 8080. Registro, login, roles, el listado de barberías y los turnos del mes son públicos. El resto pide `Authorization: Bearer`.

Para Docker, primero generá el jar. Compose ya trae los valores de Postgres:

```bash
cd server
./mvnw -DskipTests package
docker compose up --build
```

## App

```bash
npm install --prefix apps/mobile
npm start
```

En la web usa `http://localhost:8080`. En el teléfono usa el host de Expo y el puerto 8080. Si el API está en otra URL, definí `EXPO_PUBLIC_API_URL`.
