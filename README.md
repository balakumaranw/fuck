# Business Graph — Website

A responsive, static agency website for **Business Graph**, built with HTML, CSS, and vanilla JavaScript. It is ready to upload to GitHub and deploy on Vercel.

## Included features

- Futuristic dark theme with cyan and violet accents
- Responsive navigation for desktop and mobile
- Hero dashboard illustration
- Services, workflow, team, pricing, AI demo, and contact sections
- Scroll reveal animations and interactive demo chat
- Contact form that prepares an email using the visitor's email app
- No build step or framework dependencies

## Run locally

You can open `index.html` directly in a browser. For a local server, run:

```bash
python -m http.server 8000
```

Then visit <http://localhost:8000>.

## Important: configure the contact form

Before publishing, open `script.js` and find:

```js
const recipient = 'hello@yourdomain.com';
```

Replace it with the email address where you want to receive enquiries.

**Note:** This is a static-site contact form. It opens the visitor's default email application; it does not store or send submissions to a database. For a form that submits directly on the website, connect a form service or add a backend/API endpoint.

## Deploy to GitHub and Vercel

### 1. Create a GitHub repository

1. Sign in to GitHub and create a new repository, for example `business-graph-website`.
2. Upload the contents of this project folder to the repository root. Make sure `index.html`, `styles.css`, and `script.js` are at the top level.

Or use Git:

```bash
git init
git add .
git commit -m "Create Business Graph website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/business-graph-website.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

### 2. Deploy on Vercel

1. Sign in to [Vercel](https://vercel.com/).
2. Choose **Add New → Project**.
3. Import your GitHub repository.
4. Vercel should detect a static site. If configuration is requested:
   - Framework Preset: **Other**
   - Build Command: leave empty
   - Output Directory: `.`
   - Install Command: leave empty
5. Select **Deploy**.

Vercel will provide a public deployment URL. You can add a custom domain in the project's **Settings → Domains**.

## Customize

- Brand name and page content: `index.html`
- Colors, layout, and responsive styles: `styles.css` (`:root` variables near the top)
- Navigation, chat demo, and contact behavior: `script.js`

## Before launch checklist

- [ ] Replace the placeholder contact email in `script.js`
- [ ] Confirm all team names and titles are correct
- [ ] Add your official social media links and contact details
- [ ] Replace placeholder initials with approved team photos if desired
- [ ] Test the site on mobile and desktop
- [ ] Test the contact form on a device with an email app configured

## Project structure

```text
business-graph/
├── index.html
├── styles.css
├── script.js
└── README.md
```

## License

Add a license file if you intend to publish this project for reuse. Otherwise, all rights are reserved by the project owner.
