# Radiant Hospital Ambulance Management

This is a Next.js application for managing the Radiant Hospital's ambulance fleet. It provides features for tracking ambulances, managing drivers and emergency technicians, and recording transactions.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your_username_/Project-Name.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```

### Usage

To start the development server, run:

```sh
  npm run dev
```

This will start the application on http://localhost:3000.

### Database

The application uses a MySQL database. The schema and sample data can be found in the `database.sql` file.

To import the database, run the following command:

```sh
  mysql -u your_username -p your_database_name < database.sql
```
