# Alameen Niniola aka DMLstack — Portfolio

A responsive, dark-themed portfolio built with HTML5, CSS3, vanilla JavaScript, Bootstrap 5, and Bootstrap Icons. No frontend framework or build step is required. EmailJS is optional.

## Run locally

You can open `index.html` directly, but a local static server is recommended so browser APIs behave consistently.

With Python installed, run this command from the project folder:

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

## Personal details

Edit `js/config.js` to configure:
- Your email address
- Your LinkedIn URL
- EmailJS public key
- EmailJS service ID
- EmailJS template ID

Add your CV at `assets/cv/Alameen-Niniola-CV.pdf`. The existing download button points to this location.

## Configure EmailJS

1. Create an account at https://www.emailjs.com/.
2. Add and connect an email service in the EmailJS dashboard.
3. Create an email template.
4. Configure the template's recipient to your own inbox. You can use `{{to_email}}` as the recipient if your EmailJS template setup supports that field; otherwise set the recipient directly to your inbox in the dashboard.
5. Add template variables for:
   - `{{from_name}}`
   - `{{reply_to}}`
   - `{{from_email}}`
   - `{{subject}}`
   - `{{message}}`
6. Set the template's Reply-To field to `{{reply_to}}` where supported.
7. Copy your EmailJS public key, service ID, and template ID into `js/config.js`.
8. Test the form using the local server and confirm that the email arrives.

The browser public key is intended for use in frontend code. Never place email passwords or private credentials in the website files. Use EmailJS dashboard settings, allowed-domain restrictions, and available abuse protections to reduce spam. A client-side honeypot is only basic spam deterrence, not strong security.

## Deploy to Vercel

1. Create a GitHub repository and upload the contents of this folder.
2. In Vercel, choose **Add New → Project** and import the repository.
3. This is a static site: no build command is needed, and the output directory is the project root.
4. Deploy. After configuring `js/config.js`, redeploy the site if necessary.
5. Test the contact form on the live URL.

There is no backend, custom API, database, or serverless function in this project.

## Customization

- Main markup: `index.html`
- Styling and responsive layouts: `css/style.css`
- Navigation, reveal animations, and contact behavior: `js/main.js`
- Email and profile settings: `js/config.js`
- CV: `assets/cv/`
- Favicon: `assets/favicon.svg`

## Notes

- The project preview cards are illustrative CSS mockups, not screenshots of the live applications.
- The HIIT Learning Management System card is presented as a project concept; no unprovided live link is invented.
- Without EmailJS, the contact form opens the visitor’s email app; the visitor must press Send.


## Featured project added

**Spend Wise** is included in the selected-work section with links to its live Vercel demo and GitHub repository.
- Live demo: https://spendwise-xi-inky.vercel.app/
- Source: https://github.com/Alameen512/Spendwise
