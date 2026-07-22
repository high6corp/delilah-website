# Deployment Rules (read automatically by Claude Code)

This project deploys to Railway through the `deploy` MCP server. Follow these rules.

## Stack & constraints
- **Database: Postgres only** — provisioned automatically on deploy. Do NOT add your
  own database service or hardcode DB credentials.
- Read the DB connection from the `DATABASE_URL` environment variable. It is injected
  at deploy time. Locally, you may set your own `DATABASE_URL` in `.env`.
- The app must listen on the port given by the `PORT` environment variable.
- Supported stacks: Node.js, Next.js, or any app with a standard build/start that
  Railway's Nixpacks builder detects.

## How deployment works
Deployment is a **two-step** flow because your code lives on this machine:

1. **Provision** — call the `deploy_project` MCP tool (or just say *"deploy my app"*).
   It creates the Railway project + Postgres under the control account and returns a
   scoped `RAILWAY_TOKEN` plus the exact `railway up` command to run.
2. **Upload** — run the returned command in the terminal. That uploads THIS directory
   to Railway and builds it. Claude Code should run this command for the user.

> Claude: after calling `deploy_project`, run the returned `deploy_command` with the
> Bash tool from the project root. Requires the Railway CLI (`npm i -g @railway/cli`
> or `railway` on PATH). Then report the `live_url`.

## Available tools
- `deploy_project` — provision Railway project + Postgres, get the deploy command.
- `get_deployment_status` — current status + live URL for a project.
- `list_projects` — all projects under your API key.
- `get_db_info` — DB connection info (credentials masked).
- `update_domain` — attach a custom domain.
- `redeploy` — get the command to push the current directory again.
- `teardown_project` — delete a project (requires confirmation).

## To redeploy after changes
Just say *"redeploy"* — call `redeploy`, then run the returned command. Every run
uploads the current working directory.
