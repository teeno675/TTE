# T.T.E — Tiny Teddy Entertainment

A dependency-free photography and videography website built with HTML, CSS, vanilla JavaScript, and IndexedDB.

## Open in Visual Studio

In Visual Studio, choose **File → Open → Folder…** and select this `TTE-Website` folder. You can also open `index.html` directly in a browser. No install or build step is required.

## What’s included

- `index.html` — the responsive portfolio, services, about, and enquiry form
- `admin.html` — a local dashboard for enquiries saved in the same browser
- `css/styles.css` — the visual design and responsive layout
- `js/db.js` — IndexedDB storage
- `js/app.js` — navigation, gallery filtering, lightbox, and theme controls
- `js/forms.js` — validation and enquiry handling
- `js/dashboard.js` — local dashboard behavior

Enquiries are saved only in the visitor’s browser. They are not sent to T.T.E and do not confirm a booking. Replace the clearly marked contact and social placeholders when those details are available.

## Push to the provided GitHub repository

Open the terminal in this folder. If the GitHub repository is empty, run:

```sh
git init -b main
git add .
git commit -m "Add T.T.E photography website"
git remote add origin https://github.com/teeno675/TTE.git
git push -u origin main
```

GitHub may ask you to sign in or authorize Git Credential Manager during the push. If the repository already contains files, clone it first, copy these project files into that clone, then commit and push from the clone so you preserve its existing history.
