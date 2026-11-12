# Geo-Level vs User-Level Testing

A static practitioner guide to media incrementality testing for marketing analysts, data scientists and media planners. It covers:

- when to use geo-level and user-level experiments, and their pros and cons
- the data and planning each one needs (power, duration, holdouts, pre-registration)
- how experiments relate to other measurement methods: MMM, multi-touch attribution and CausalImpact

The site is plain HTML, CSS and vanilla JavaScript. There is no build step, no framework and no external library.

## Pages

| File | Page |
|---|---|
| `index.html` | Overview |
| `geo-testing.html` | Geo testing |
| `user-level-testing.html` | User-level testing |
| `compare.html` | Compare |
| `planning.html` | Planning |
| `other-methods.html` | Other methods |
| `sources.html` | Sources |
| `404.html` | Not-found page |

Shared assets:

- `assets/css/site.css`: design tokens and components. The style follows [redam94.github.io](https://redam94.github.io/).
- `assets/js/site.js`: mobile nav, current-page marker, in-page table of contents, reveal on scroll.
- `assets/img/*.webp`, `assets/icons/*.svg`: illustrations and icons. `assets/manifest.json` holds their alt text.

## Preview locally

```sh
python3 -m http.server
```

Then open <http://localhost:8000/>.

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, then branch **main** and folder **/ (root)**, and save.

The empty `.nojekyll` file tells GitHub Pages to serve the files as they are, without Jekyll processing.

## Sources

Every factual claim on the site links to its source. The full bibliography is on [`sources.html`](sources.html). Many entries point to the author's research notes at [redam94.github.io/second-brain](https://redam94.github.io/second-brain/), which summarize the primary papers.

## Image credits

The illustrations and icons were generated with [fal](https://fal.ai/). The model for each file is listed in `assets/manifest.json`.
