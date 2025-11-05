# flowchart

This repository hosts a small static demonstration that renders a fire hydrant
hydraulic flow chart using [Chart.js](https://www.chartjs.org/). The chart uses
input parameters such as static pressure, Hazen-Williams coefficient, hydrant
outlet diameter, hose length, and flow range to estimate the residual pressure
along a hose line. The Hazen-Williams relationship uses the characteristic flow
log/exponent of 1.85 to capture how friction losses grow with discharge.

## Getting started

Open `public/index.html` in a modern browser. The page loads Chart.js from a CDN
and requires no build tooling.

When the page loads, adjust any of the values in the input panel to immediately
re-compute the hydraulic curve. The chart shades the area under the line to
highlight the available residual pressure across the chosen flow range.

## Repository status

No remote GitHub origin is configured for this repository, so it is not yet
linked to the upstream `flowchart` project. Add a remote if you plan to push
changes upstream:

```bash
git remote add origin git@github.com:<your-account>/flowchart.git
```
