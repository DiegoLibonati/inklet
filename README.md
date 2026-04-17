# Inklet

## Educational Purpose

This project was created primarily for **educational and learning purposes**.  
While it is well-structured and could technically be used in production, it is **not intended for commercialization**.  
The main goal is to explore and demonstrate best practices, patterns, and technologies in software development.

## Getting Started

1. Clone the repository
2. Navigate to the project folder
3. Execute: `npm install`
4. Execute: `npm run dev`

The application will open automatically at `http://localhost:3000`

## Description

**Inklet** is a browser-based freehand drawing application built on the HTML5 Canvas API. It provides an 800×600 pixel canvas where users can draw freely using their mouse — pressing and holding to paint, and moving to create continuous strokes.

The brush engine combines filled circles at each cursor position with connecting line segments, producing smooth, gap-free strokes at any speed. Every stroke is rendered instantly with no perceptible lag.

Users have full control over two brush properties: **size**, adjustable from 1px to 30px in 1px increments using the increase (+) and decrease (−) buttons; and **color**, selected through a native color picker that supports the full RGB spectrum. The current brush size is displayed in real time in the toolbar. A **Clear** button wipes the entire canvas in one click, resetting it to a blank state.

State across the toolbar and canvas is managed through a reactive pub/sub store — changes to brush size or color are reflected immediately without any page reload or manual sync.

The application has zero production dependencies. It is built with pure Vanilla TypeScript compiled by Vite, making it extremely lightweight and fast to load.

> Desktop only — mouse input required. Mobile and touch devices are not supported.

## Technologies used

1. Typescript
2. CSS3
3. HTML5
4. Vite

## Libraries used

#### Dependencies

```
No production dependencies - Pure Vanilla TypeScript
```

#### devDependencies

```
"@eslint/js": "^9.39.2"
"@testing-library/dom": "^10.4.0"
"@testing-library/jest-dom": "^6.6.3"
"@testing-library/user-event": "^14.5.2"
"@types/jest": "^30.0.0"
"eslint": "^9.39.2"
"eslint-config-prettier": "^10.1.8"
"eslint-plugin-prettier": "^5.5.5"
"globals": "^17.3.0"
"husky": "^9.1.7"
"jest": "^30.3.0"
"jest-environment-jsdom": "^30.3.0"
"lint-staged": "^16.2.7"
"prettier": "^3.8.1"
"ts-jest": "^29.4.6"
"typescript": "^5.2.2"
"typescript-eslint": "^8.54.0"
"vite": "^7.1.6"
```

## Portfolio Link

[`https://www.diegolibonati.com.ar/#/project/inklet`](https://www.diegolibonati.com.ar/#/project/inklet)

## Testing

1. Navigate to the project folder
2. Execute: `npm test`

For coverage report:

```bash
npm run test:coverage
```

## Security

### npm audit

Check for vulnerabilities in dependencies:

```bash
npm audit
```

## Known Issues

None at the moment.
