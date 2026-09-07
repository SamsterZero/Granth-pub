# Contributing to Granthalay Publisher Dashboard

Thank you for helping improve Granthalay Publisher Dashboard. Keep changes focused, protect publisher and reader data boundaries, and describe UI/API changes explicitly.

## Before starting

- Read the [Project Guide](PROJECT.md).
- Search [existing issues](https://github.com/SamsterZero/granthalay-publisher-dashboard/issues).
- Discuss large UI, database schema, authentication, or analytics flow changes before implementing them.
- Use [private vulnerability reporting](SECURITY.md) for security issues.

## Local setup

Install Bun, fork and clone the repository, then run:

```sh
bun install
bun run dev
```

If testing database features, launch the local database container:

```sh
bun run db:start
bun run db:push
```

## Validate a change

Before opening a pull request, verify your changes pass all local static checks:

```sh
bun run check
bun run lint
bun run test
```

## Pull requests

- Link the relevant issue and explain the user-visible outcome.
- Describe automated and manual checks performed.
- Include screenshots or a video recording for visible UI changes.
- Call out schema changes (Drizzle migrations), API endpoint updates, or authentication flow modifications.

Contributions are submitted under the [MIT License](LICENSE) and must follow the [Code of Conduct](CODE_OF_CONDUCT.md).
