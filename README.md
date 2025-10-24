# eCommerce Application

## Description
This project is a feature-rich eCommerce web application developed using modern frontend technologies and the commercetools API. The goal is to deliver a scalable, maintainable, and user-friendly online shopping platform that demonstrates real-world software development practices in a team setting. It covers the full cycle of eCommerce functionality—from user authentication to catalog browsing, product management, shopping cart interaction, and profile customization.

## Technology stack
1. TypeScript — A statically typed superset of JavaScript that improves code readability and supports scalable development.
2. Vite — A fast and modern frontend build tool with native support for ES modules.
3. Vitest — A modern and lightning-fast testing framework inspired by Jest, with code coverage support via @vitest/coverage-v8 and c8.
4. ESLint — A powerful linting tool for identifying and fixing issues in TypeScript/JavaScript code.
5. Stylelint — A linter for CSS and SCSS, using stylelint-config-standard and stylelint-config-clean-order for consistent styling.
6. Prettier — An opinionated code formatter integrated with Husky and lint-staged for automatic formatting on commit.
7. Husky — A tool for managing Git hooks, used to run linters and formatters before each commit.
8. Lint-staged — Runs linters and formatters only on staged files to improve pre-commit efficiency.
9. Sass (SCSS) — A CSS extension language that adds support for variables, nesting, and other advanced features.
10. CommerceTools — A headless commerce platform used for managing product data, user profiles, cart, and checkout functionality.

## Setup Instructions
1. Clone the Repository

git clone https://github.com/GSasha9/eCommerce_App.git
cd eCommerce_App

2. Install Dependencies

Run npm install

3. Run the Development Server

npm run dev

This starts the Vite development server.

4. Build for Production

npm run build

5. Preview Production Build Locally

npm run preview


## Available Scripts
| Script                 | Description                                          |
|------------------------|------------------------------------------------------|
| `npm run dev`          | Runs the app in development mode using Vite.        |
| `npm run build`        | Builds the app for production using TypeScript and Vite. |
| `npm run preview`      | Serves the production build locally.                |
| `npm run lint`         | Runs ESLint to analyze code for issues.             |
| `npm run stylelint`    | Lints all CSS and SCSS files.                       |
| `npm run prettier`     | Checks code formatting for all `ts`, `css`, and `scss` files. |
| `npm run prettier:check` | Checks for formatting issues without fixing them.  |
| `npm run prettier:fix` | Automatically fixes formatting issues.              |
| `npm test`             | Runs all unit tests using Vitest.                   |
| `npm run test:coverage`| Runs tests with code coverage reporting.            |
