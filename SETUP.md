# Setup

## Clone the Repo

```shell
$ git clone git@github.com:hackdanismo/ngad.git
```

## Setup the Client API
The `client-api` is the API that handles clients - companies/organisations - that are listed on the platform. This data is stored in a local `SQLite` database and uses the `Prisma ORM` to manage the connection.

### Setup Database
First, check that `SQLite` is installed on your machine:

```shell
$ sqlite3 --version
```

### Install Packages
Next, we need to check that `Node` and `npm` are installed:

```shell
$ node --version
$ npm --version
```

In the terminal, open the `client-api` and run the install command to install the packages:

```shell
$ cd platform/client-api
$ npm install
```

If there is no `.env` file in the root of the `client-api` folder, add an `.env` file and add the following to create the `dev.db` database when using `Primsa ORM`:

```
DATABASE_URL="file:./dev.db"
```

Run the following commands to setup the schema and migrate the database using `Prisma ORM`:

```shell
$ npx prisma generate
$ npx prisma migrate dev --name init
```

### Run Server
Run the server using `Node`:

```shell
$ node server.js
```

## Setup Frontend
Open a new terminal and open the `Next` application:

```shell
$ cd platform/frontend
```

### Install Packages
Use `Node` and `npm` to install the packages:

```shell
$ npm install
```

### Run the Development Server
Run the development server using `npm`:

```shell
$ npm run dev
```

The application will run in a browser window/tab: `http://localhost:3000/`

The `client-api` should be running at the same time as the frontend of the application.