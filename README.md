# Demo Battleship Game

This is a classic Battleship game implemented using the Phaser framework. The game allows up to two players to take turns guessing the locations of each other's ships on a grid. The goal is to sink all of the opponent's ships before they sink yours.

## Requirements

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm run dev` | Launch a development web server |
| `npm run build` | Create a production build in the `dist` folder |
| `npm run lint` | Run static analysis |

## Writing Code

After cloning the repo, run `npm install` from your project directory. Then, you can start the local development server by running `npm run dev`.

The local development server runs on `http://localhost:8080` by default. Please see the Vite documentation if you wish to change this, or add SSL support.

Once the server is running you can edit any of the files in the `src` folder. Vite will automatically recompile your code and then reload the browser.

## Project Structure

- `src/main.ts` - The entry point of the game. This file handles the game configuration and initializes the Phaser game instance.
- `src/scenes/` - Contains all the Phaser Scenes that define the different states and logic of the game (e.g., main menu, gameplay, game over).
- `src/components/` - Houses reusable graphical components such as buttons, grids, and other UI elements to keep the code modular and maintainable.
- `src/models/` - Includes data models that represent the game's core logic, such as ship placement, player states, and game rules.
- `public/assets` - Stores all static assets like images, sounds, and other resources used throughout the game.
