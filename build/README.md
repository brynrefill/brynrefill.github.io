# Builder tool

My static site builder tool for brynrefill.github.io (no runtime dependencies, no server-side build step required by GitHub Pages).

GitHub Pages serves the generated files directly, it doesn't run this tool.

## How elements fit together
```
build/
  content/*/*.html: unique body content for each page
  components/:      content repeatable for each page
  layout.html:      main page skeleton
  site.json:        one-off site-wide values
  pages.json:       the manifest. One entry per output page
  build.js:         script that reads all of the above and writes the final HTML files
```

## Adding or editing a page
1. Create/edit `build/content/*/*.html` with just the unique `<section>`
   content for that page (no header/footer/aside, no `<head>`).
2. Add/edit its entry in `build/pages.json`:
   ```json
   {
     "id": "my-new-post",
     "out": "posts/my-new-post/index.html",
     "active": "posts",
     "title": "My new post | Bryn Refill's Blog",
     "highlighter": false,
     "contentFile": "content/posts/my-new-post.html",
     "asideContents": "\n            <li><a href=\"#post\">My new post</a></li>\n        ",
     "footerExtra": ""
   }
   ```
   - `active` controls which nav item gets highlighted: `home`, `posts`,
     `tags`, `contact`, or `about`;
   - `highlighter`: if `true` pulls in `/styles/highlighter.css` and
     `/scripts/highlighter.js` for pages with code snippets;
   - `footerExtra` is a way to include rare per-page extras.
3. Run the build script:
   ```bash
   $ npm run build
   ```
   or directly: `node build/build.js`.

Both the `build/` source files and the generated `index.html` files must be committed and pushed to the remote repository.

To change the nav, footer, or right-panel markup site-wide, edit the
corresponding file under `build/components/` (or `build/layout.html` for
`<head>`/body structure) once, then re-run the build script: it will update all the
pages automatically.
