# Aplikacja do przechowywania informacji o samochodach

Prosta aplikacja napisana w Node.js z wykorzystaniem Express.js i Redis, umożliwiająca przechowywanie informacji o samochodach oraz głosowanie na dany model.

## Wymagania

- docker

## Uruchomienie

```
docker-compose up -d --build
```

## Użycie

### Dodawanie samochodu

**Endpoint:** `POST /car`

Przykładowe żądanie:

```
POST http://localhost/car
Body:
{
  "id": "ford_fiesta",
  "brand": "Ford",
  "model": "Fiesta MK8",
  "engine": "1.4 TDI",
  "airConditioning": "automatic"
}
```

### Pobieranie samochodu po ID

**Endpoint:** `GET /car/:id`

Przykładowe żądanie:

```
GET http://localhost/car/ford_fiesta
```

### Pobieranie wszystkich samochodów

**Endpoint:** `GET /cars`

Przykładowe żądanie:

```
GET http://localhost/cars
```

### Usuwanie samochodu po ID

**Endpoint:** `DELETE /car/:id`

Przykładowe żądanie:

```
DELETE http://localhost/car/ford_fiesta
```

### Głosowanie na samochód

**Endpoint:** `POST /car/:id/vote`

Przykładowe żądanie:

```
POST http://localhost/car/ford_fiesta/vote
Body:
{
  "vote": "+"
}
```

### Populowanie przykładowymi danymi

**Endpoint:** `POST /populate`

Ta metoda API służy do populowania aplikacji przykładowymi danymi samochodów. Po wywołaniu tej metody, zostanie dodanych kilka przykładowych samochodów do bazy danych Redis.

Przykładowe żądanie:
```
POST http://localhost/populate
```

Po wykonaniu żądania, aplikacja doda następujące przykładowe samochody do bazy danych Redis:
- Ford Fiesta MK8
- BMW 3 Series
- Audi A4
- Volkswagen Golf
- Mercedes-Benz C-Class

