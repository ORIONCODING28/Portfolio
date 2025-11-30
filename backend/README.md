# Portfolio Backend API

Backend Node.js/Express per il Portfolio CMS con autenticazione JWT e PostgreSQL.

## 🚀 Quick Start

### Prerequisiti
- Node.js 18+
- PostgreSQL 14+

### Installazione

1. **Installa le dipendenze**
```bash
cd backend
npm install
```

2. **Configura il database**
```bash
# Crea un database PostgreSQL
createdb portfolio_db

# Copia il file .env
cp .env.example .env

# Modifica .env con le tue credenziali
```

3. **Inizializza il database**
```bash
npm run db:init
npm run db:seed
```

4. **Avvia il server**
```bash
# Sviluppo (con hot reload)
npm run dev

# Produzione
npm start
```

## 📁 Struttura

```
backend/
├── src/
│   ├── db/
│   │   ├── index.js      # Pool PostgreSQL
│   │   ├── init.js       # Schema database
│   │   └── seed.js       # Dati iniziali
│   ├── middleware/
│   │   ├── auth.middleware.js    # JWT verification
│   │   └── error.middleware.js   # Error handling
│   ├── routes/
│   │   ├── auth.routes.js        # Login/logout
│   │   ├── public.routes.js      # API pubbliche
│   │   └── admin.routes.js       # CRUD protette
│   └── index.js          # Entry point
├── uploads/              # File caricati
├── .env.example
└── package.json
```

## 🔐 Autenticazione

### Credenziali Admin Default
- Email: `admin@portfolio.dev`
- Password: `admin123`

⚠️ **Cambia queste credenziali in produzione!**

### Endpoints Auth
| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | User corrente |
| POST | `/api/auth/refresh` | Refresh token |

## 📡 API Endpoints

### Pubblici (no auth)
| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/api/projects` | Lista progetti |
| GET | `/api/projects/:id` | Singolo progetto |
| GET | `/api/skills` | Lista skills |
| GET | `/api/testimonials` | Testimonianze |
| GET | `/api/experiences` | Esperienze |
| GET | `/api/palettes` | Temi disponibili |
| GET | `/api/palettes/active` | Tema attivo |
| GET | `/api/meta` | Meta dati |
| GET | `/api/personal-info` | Info personali |

### Admin (richiede JWT)
| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/api/admin/projects` | Tutti i progetti |
| POST | `/api/admin/projects` | Crea progetto |
| PUT | `/api/admin/projects/:id` | Modifica progetto |
| DELETE | `/api/admin/projects/:id` | Elimina progetto |
| GET | `/api/admin/skills` | Tutte le skills |
| POST | `/api/admin/skills` | Crea skill |
| PUT | `/api/admin/skills/:id` | Modifica skill |
| DELETE | `/api/admin/skills/:id` | Elimina skill |
| ... | ... | (stessi pattern per testimonials, experiences, palettes) |
| PUT | `/api/admin/meta/:key` | Aggiorna meta |
| GET | `/api/admin/personal-info` | Info personali |
| PUT | `/api/admin/personal-info` | Aggiorna info |

## 🗄️ Database Schema

### Tabelle
- `users` - Utenti admin
- `projects` - Progetti portfolio
- `skills` - Competenze tecniche
- `testimonials` - Testimonianze clienti
- `experiences` - Esperienze lavorative
- `palettes` - Temi/palette colori
- `portfolio_meta` - Configurazioni sito
- `personal_info` - Info personali

## 🔧 Variabili Ambiente

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/portfolio_db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=portfolio_db
DB_USER=postgres
DB_PASSWORD=password

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=http://localhost:4200
```

## 🚢 Deploy

### Railway/Render
1. Configura le variabili ambiente
2. Il database viene inizializzato automaticamente al primo avvio

### Docker (opzionale)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📝 Note

- Le password sono hashate con bcrypt (10 rounds)
- I token JWT hanno durata 7 giorni
- Le API admin richiedono header `Authorization: Bearer <token>`
- CORS configurato per il frontend Angular
