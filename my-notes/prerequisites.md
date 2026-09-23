# Overview of Web Application Deployment

To host an application, there are 2 common approaches:

* **On-premises:** Run the application on your organization’s own infrastructure.
* **Cloud hosting:** Run the application using a cloud provider’s resources. 2 main cloud offerings:

  * **Infrastructure as a Service (IaaS):** Provides computing resources such as virtual servers, storage, and networking. You manage the operating system, application, and deployment process. Examples: **Amazon EC2** and **Azure Virtual Machines**
  * **Platform as a Service (PaaS):** Provides a managed environment with built-in tools for deploying and running applications. You focus on your code and configuration. Examples: **Heroku**, **Render**, **Vercel**, **Fly.io**

These approaches can also be combined in a **hybrid deployment**.

In this tutorial, we will focus on **Vercel**.

## Tools Used in This Tutorial

# Overview of Web Application Deployment

Two common hosting approaches are:

| Approach          | Description                                                                                          |
| ----------------- | ---------------------------------------------------------------------------------------------------- |
| **On-premises**   | Run the application on infrastructure managed by your organization, typically in its own facilities. |
| **Cloud hosting** | Run the application using a provider’s infrastructure or managed platform.                           |

A **hybrid deployment** combines on-premises and cloud resources.

For deploying our own application, two relevant cloud service models are:

| Model                                  | What the provider supplies                                 | What you manage                                                 | Examples                                                                                            |
| -------------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **IaaS — Infrastructure as a Service** | Compute, storage, and networking.                          | Operating system, runtime, application, and deployment process. | Amazon EC2, Azure Virtual Machines.                                                                 |
| **PaaS — Platform as a Service**       | A managed platform for deploying and running applications. | Application code, dependencies, and configuration.              | Heroku, Render; Vercel provides a managed application platform with a similar developer experience. |

Providers such as AWS and Azure offer multiple service models, not just IaaS. [Cloud service models](https://aws.amazon.com/types-of-cloud-computing/)

**This tutorial focuses on deploying a Next.js application with Vercel.**

## Tools Used in This Tutorial

| Tool               | Purpose                                                          |
| ------------------ | ---------------------------------------------------------------- |
| **Node.js**        | Run JavaScript outside the browser.                              |
| **npm and npx**    | Install dependencies, run scripts, and execute package commands. |
| **Next.js**        | Build the web application using React.                           |
| **Git and GitHub** | Track code changes and host the repository.                      |
| **Vercel**         | Build and deploy the application.                                |

## Node.js

**Node.js is a JavaScript runtime**: it executes JavaScript outside the browser, either on your computer or on a remote server.

Check the installed version:

```bash
node --version
```

## npm and npx

**npm is a package manager** used to install dependencies and run project scripts.

| Command                             | Purpose                                                                                   |
| ----------------------------------- | ----------------------------------------------------------------------------------------- |
| `npm --version`                     | Display the installed npm version.                                                        |
| `npm install`                       | Install project dependencies; create or update the lockfile when needed.                  |
| `npm ci`                            | Install dependencies from the existing lockfile without changing it; commonly used in CI. |
| `npm run dev`                       | Run the script named `dev` in `package.json`.                                             |
| `npx create-next-app@latest my-app` | Run the Next.js project generator to create an application named `my-app`.                |

`npx` executes package commands, downloading the package if needed.

| File or directory   | Purpose                                                                  |
| ------------------- | ------------------------------------------------------------------------ |
| `package.json`      | Defines project metadata, dependency requirements, and scripts.          |
| `package-lock.json` | Records the resolved dependency versions for reproducible installations. |
| `node_modules/`     | Contains installed dependency files.                                     |

Dependencies are installed in `node_modules/`, **not inside `package-lock.json`**. See [npm install](https://docs.npmjs.com/cli/v11/commands/npm-install/) and [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci/).



###### Create the Next.js application

```bash
npx create-next-app@latest vercel-onboarding --ts --app --no-src-dir
cd vercel-onboarding
```

| Argument | Purpose |
|---|---|
| `@latest` | Use the latest published version of the generator. |
| `vercel-onboarding` | Name the project directory. |
| `--ts` | Use TypeScript. |
| `--app` | Use the App Router, with routes defined under `app/`. |
| `--no-src-dir` | Place `app/` at the project root instead of inside `src/`. |

The generator creates the project files and normally installs dependencies and initializes a local Git repository. It does not create a GitHub repository.


## Next.js

**Next.js is a React framework for building web applications using JavaScript or TypeScript.**

It provides:

* Pages, layouts, and routing.
* Server endpoints through route handlers.
* Server rendering and static generation.
* Development and production build tools.

For local development, run this command from the project directory:

```bash
npm run dev
```

The application is normally available at **http://localhost:3000**. `localhost` refers to your own computer, and `3000` is the port. Use the address printed in the terminal if another port is selected. [Next.js setup](https://nextjs.org/docs/app/getting-started/installation)

### What happens when you run `npm run dev`?

With this entry in `package.json`:

```json
{
  "scripts": {
    "dev": "next dev"
  }
}
```

1. **npm** reads the `scripts` section.
2. **`run dev`** selects the script named `dev`.
3. **`next dev`** starts the Next.js development server using Node.js.
4. You open the local application in your browser.

`dev` is a script name, not a special JavaScript command. Running it starts local development; it does not deploy the application to Vercel.

## Next.js

- A **React** framework to build web applications with JavaScript or TypeScript
- Provides pages, routing, API endpoints, server rendering, and static generation.

- Common Next.js commands:
  - `next dev`: start the development server.
  - `next build`: build the app for production.
  - `next start`: start the production server after a build.
- Next.js needs a package manager for dependancy installation + project scipt execution eg:
    - npm : `npm install`, `npm run dev`
    - Yarn | `yarn install`, `yarn dev`
    - pnpm | `pnpm install`, `pnpm dev`
    - Bun | `bun install`, `bun run dev`

 In local development mode, `npm run dev` executes the project's `next dev` script, when configured in `package.json`, to start the dev server. Open `http://localhost:3000` to view the application locally.


## Next.js

- A **React framework** for building web applications with JavaScript or TypeScript. - It provides pages, routing, API endpoints, server rendering, and static generation.
- To work with a Next.js project, we use a **package manager** to install its dependencies and run its scripts. Examples:
  - **npm:** `npm install`, `npm run dev`
  - **Yarn:** `yarn install`, `yarn dev`
  - **pnpm:** `pnpm install`, `pnpm dev`
  - **Bun:** `bun install`, `bun run dev`
- These project scripts can execute Next.js commands:
  - `next dev`: start the development server.
  - `next build`: build the app for production.
  - `next start`: start the production server after a build.
- In our dev project, `package.json` maps the `dev` script to `next dev`. Running `npm run dev` therefore starts the development server, and we can view the app locally at `http://localhost:3000`.

## nmp (Node Package Manager)

**npm is a package manager used in JavaScript and TypeScript projects.**. We use it to install and manage project dependencies and run scripts.

| Command | Purpose |
|---|---|
| `npm --version` | Check the installed npm version. |
| `npm install` | Read `package.json`, install dependencies into `node_modules/`, and create or update `package-lock.json` to record the exact resolved versions. |
| `npx <command>` | Run a package command, downloading the package if needed. `npx` is included with npm. |
| `npx create-next-app@latest my-app` | Run the Next.js project generator to create the initial structure and files for an application named `my-app`. |

- `node --version`
- `npm run dev`. On aura grossièrement :
> npm -> lance le script "dev" -> Next.js -> s'exécute avec Node.js -> serveur local: http://localhost:3000

```
npm = le programme/package manager.
npm run = « exécute un script défini dans package.json ».
dev = simplement le nom du script.
next dev = la vraie commande exécutée derrière.
```


## Node.js

- JavaScript was originally designed to run in browsers. **Node.js is a runtime that executes JavaScript outside the browser** (on your computer/localhost or a remote server)

