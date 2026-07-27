# Document Task Manager

This repository now contains the backend server in the `server/` folder.

## Backend

- `server/` — Spring Boot backend application
- `server/pom.xml` — Maven project file
- `server/docker-compose.yml` — local development compose configuration
- `server/Dockerfile` — container build definition

## Usage

```bash
git clone https://github.com/YOUR_USERNAME/document-task-manager.git
cd document-task-manager/server
cp .env.example .env
# edit .env
docker compose up --build
```
