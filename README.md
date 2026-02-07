# To-Do List REST API

Projekt akademicki - aplikacja serwerowa REST API do zarządzania listą zadań.

## Technologie

- **Node.js** - środowisko uruchomieniowe
- **Express** - framework webowy
- **TypeScript** - typowany JavaScript
- **SQLite** - lokalna baza danych

## Struktura projektu

```
to_do_list/
├── src/
│   ├── database/       # Konfiguracja bazy danych
│   ├── models/         # Modele danych
│   ├── controllers/    # Logika biznesowa
│   ├── routes/         # Definicje endpointów
│   ├── types/          # Typy TypeScript
│   └── server.ts       # Główny plik serwera
├── public/             # Prosty frontend (opcjonalny)
└── package.json
```

## Instalacja

```bash
npm install
```

## Uruchomienie

### Tryb deweloperski (z hot reload)
```bash
npm run dev
```

### Build i uruchomienie produkcyjne
```bash
npm run build
npm start
```

## API Endpoints

### Autoryzacja (sesje)
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me
```

Wszystkie endpointy `/api/lists` i `/api/tasks` wymagają zalogowania.

### Pobierz wszystkie zadania
```
GET /api/tasks
```

### Dodaj nowe zadanie
```
POST /api/tasks
Content-Type: application/json

{
  "title": "Tytuł zadania",
  "description": "Opis zadania (opcjonalny)"
}
```

### Aktualizuj zadanie
```
PUT /api/tasks/:id
Content-Type: application/json

{
  "title": "Nowy tytuł",
  "description": "Nowy opis",
  "completed": true
}
```

### Usuń zadanie
```
DELETE /api/tasks/:id
```

## Użytkownicy i własność danych

Listy i zadania są przypisane do zalogowanego użytkownika (pole `user_id`).
Po włączeniu logowania stare listy bez `user_id` mogą być niewidoczne, dopóki nie zostaną przypisane do konta.

## Frontend

Prosty frontend dostępny pod adresem `http://localhost:3000`.

- `login.html` — logowanie
- `register.html` — rejestracja
- `index.html` — lista planów i zadań (po zalogowaniu)

## Kody odpowiedzi HTTP

- **200 OK** - Żądanie zakończone sukcesem
- **201 Created** - Zasób został utworzony
- **400 Bad Request** - Błędne dane wejściowe
- **404 Not Found** - Zasób nie został znaleziony
- **500 Internal Server Error** - Błąd serwera

Służy wyłącznie do wizualnej prezentacji działania API.

## Konfiguracja

Ustaw zmienną środowiskową `SESSION_SECRET` dla sesji (szczególnie na produkcji).
