## Getting Started

```
yarn install
yarn dev
```

## Challenges
- Noticed that the browser wasn't always caching GIFs when unmounting trending gallery to show search. Worked around by applying display: none when search is active to keep component mounted.
- React Strict Mode is causing Trending fetch to fire twice on app mounts, resulting in a conflicting key, have removed the key prop from Gallery tiles for now. Have not resolved this yet due to time constraints but likely needs a guard to prevent fetch firing twice.

## Noteworthy
- Utilised Panda CSS for UI as it's fairly lightweight/un-opinionated, nice tokens out of box, and is compatible with things like React Server Components.
- Search submission was implemented using a debounced search field that submits on changes.
- Intersection Observer for infinite scroll implementation without leaning on an external.
- API key is hard-coded, this would be raised likely to a protected API route for production apps.
- Very minor but I couldn't help but add a _tiny_ amount of responsiveness for mobile/desktop.

## If I Had More Time
Aside from implementing more of the additional requirements, I would likely also implement a few other improvements like:
  - Animate search clear button on press.
  - Copy link control for tiles to link to Giphy.
  - Markdown Copy control for pasting into things like Github.
  - Last fetched trending with a date/time to caching trending for ~2 minutes. Add a refresh control to app.