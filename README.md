# StudyHub — Landing Page

Self-initiated concept project (EdTech). Static site: HTML5, CSS3, vanilla JavaScript. No build step.

## Run
Open `index.html` in a browser, or serve locally:

    npx serve .

## Structure
- `index.html` — semantic page markup and inline SVG icon sprite
- `css/styles.css` — design tokens (colour, spacing, radius), components, responsive and dark-mode rules
- `js/main.js` — mobile menu toggle
- `images/` — hero background and course/lesson images

## Notes
- Instructor names and the contact address (`hello@studyhub.example`) are placeholders.
- Buttons scroll to on-page sections; connect them to real routes when a backend exists.
- Fonts load from Google Fonts (Plus Jakarta Sans) with system fallbacks.
- Deploy to any static host (Netlify, Vercel, GitHub Pages).
