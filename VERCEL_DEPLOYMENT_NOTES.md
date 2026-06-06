# ZAJEL Vercel Deployment Notes

This project is ready for Vercel deployment.

## Important Structure

- `index.html`, `style.css`, `script.js`, and `img/` are served as static frontend files by Vercel.
- `api/shipments/[trackingNumber].js` is the Vercel Serverless API route.
- `server.js` is only for local Express development.
- No `vercel.json` file is required.

## Local Run

```bash
npm install
npm start
```

Open:

```text
http://localhost:3000
http://localhost:3000/api/shipments/ZAJ-12345678
```

## Vercel Test URLs

After deployment, test:

```text
https://your-project.vercel.app/style.css
https://your-project.vercel.app/api/shipments/ZAJ-12345678
```

If `/style.css` shows CSS code, the frontend assets are working correctly.
