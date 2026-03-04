# EdTech Platform (MVP)

MVP scope for now:

- JWT auth + roles (Student/Teacher/Admin)
- Teacher approval by Admin
- Courses/subjects/enrollment
- Live rooms with 6-character join codes
- WebSocket: live count + join approvals + chat
- Video via YouTube (live/recorded IDs stored in DB)

## Prereqs

- Node.js 20+
- Docker Desktop (for Postgres + Redis)

## Local setup

1. Start databases:

```bash
docker compose up -d
```

2. Backend:

```bash
cd backend
npm install
cp .env.example .env
npm run db:push
npm run dev
```

3. Web:

```bash
cd web
npm install
cp .env.example .env.local
npm run dev
```

## URLs

- Backend: `http://localhost:4000`
- Web: `http://localhost:3000`
