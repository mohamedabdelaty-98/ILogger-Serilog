# GitHub Pages documentation source

This folder is a ready-to-copy GitHub Pages documentation site built with the Just the Docs theme.

## Publish from a repository

1. Copy the contents of this folder into the root-level `docs` directory of your GitHub repository. The repository should then contain `docs/_config.yml`, `docs/index.md`, and `docs/serilog-logging-guide.md`.
2. Commit and push those files to the branch you want to publish.
3. In GitHub, open the repository **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select your publishing branch and the `/docs` folder, then save.
6. Wait for the Pages deployment to finish. GitHub will show the site URL on the Pages settings screen.

The guide link on the landing page points to the Markdown page. GitHub Pages/Jekyll renders it as a web page.

## If the theme does not build

The remote theme setting needs GitHub Pages' Jekyll plugin support. If Pages reports a theme/plugin build error, switch the source to **GitHub Actions** and use the official Pages Jekyll workflow, or remove the `remote_theme` and `plugins` lines for a plain Jekyll site.
