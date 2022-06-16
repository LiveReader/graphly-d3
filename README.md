<p align="center">
  <img src="./docs/public/icons/graphly-d3-icon.png" width="30%">
</p>

# Graphly D3 Docs

This is the repository for the official documentation for the [Graphly D3](https://github.com/livereader/graphly-d3) library.
It documents the API and how to use the library by providing examples and tutorials to try out in place.  
The official documentation is hosted at [https://graphly-d3.livereader.com](https://graphly-d3.livereader.com).

## Deployment

A GitHub Action runs when a commit is pushed to the main branch with a new version tag.
This Action builds and publishes a Docker image to the GHCR.
The new version will be automatically deployed within the hour.

## Tooling

This documentation is built with [Vitepress](https://vitepress.vuejs.org/) to generate a static website out of the markdown files.
