# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project Overview
 This project is a personal book tracker and discovery app for logging what the user has read, rating and reviewing titles, and finding your next great read.

## Tech Stack

- **Language:** JavaScript (ES6+)
- **Framework:** React 
- **Testing:** Jest
- **Styling:** CSS (mobile-first, breakpoints at 760px / 1024px) 
- **Version control:** Git / GitHub
- **Deployment:** Netlify 

## Commands

```bash
npm install        # install dependencies
npm run dev         # start dev server
npm run build        # production build
npm test          # run Jest tests
npm run lint         # lint
```

## Project Structure

```
src/
  components/     # React components
  utils/        # helper functions
  styles/        # CSS
  __tests__/      # Jest tests
```

## Code Style

- Mobile-first responsive design; test breakpoints at 760px and 1024px
- Prefer functional components and hooks over class components
- Keep components small and single-purpose
- Write tests alongside new features, not after
- No unused imports or console.logs left in committed code

## Git Workflow

- Use SSH remotes, not HTTPS
- Write clear, imperative commit messages ("Add memory card flip animation", not "fixed stuff")
- Don't commit directly to `main` on team projects; branch + PR

## Testing Instructions

- Run `npm test` before committing
- New logic (game rules, data transforms, algorithms) needs unit tests
- Fix root causes of failing tests, not the test assertions

## What NOT to Do

- Don't introduce new dependencies without checking package.json first
- Don't restructure file layout without asking
- Don't remove existing comments unless they're wrong or outdated

## Notes for Claude

- I'm a junior Frontend developer — explain non-obvious tradeoffs briefly, don't over-explain 
- Ask before assuming project scope on early-stage/idea-stage projects