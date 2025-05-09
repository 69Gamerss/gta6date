# GTA VI Release Countdown Website

A modern, responsive, dark-themed website that displays a live countdown timer to the official release of GTA VI, along with a trailer embed, social features, and more.

## Features

- **Live Countdown Timer**: Displays days, hours, minutes, and seconds until May 26, 2026
- **Trailer Modal**: Embedded YouTube trailer that plays when opened
- **Social Links**: Links to Rockstar's Twitter, YouTube, Reddit, and Discord
- **Add to Calendar**: Button to add the GTA VI release date to Google Calendar
- **Responsive Design**: Mobile-first approach that scales elegantly to large desktop screens
- **Dark Theme**: Stylish dark theme with GTA-inspired neon accents

## Deployment Instructions

### Option 1: Deploy to GitHub Pages

1. Create a new GitHub repository
2. Upload all files from this deployment folder to your repository
3. Go to Settings > Pages
4. Select the main branch as the source
5. Click Save
6. Your site will be published at `https://yourusername.github.io/repository-name/`

#### Using a Custom Domain with GitHub Pages

1. In your repository, create a file named `CNAME` (no file extension)
2. Add your domain name to this file (e.g., `gta6.yourdomain.com` or `yourdomain.com`)
3. Save the file and commit it to your repository
4. Configure your domain DNS settings:

   For an apex domain (yourdomain.com):
   - Add four A records pointing to GitHub's IP addresses:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```

   For a subdomain (e.g., gta6.yourdomain.com):
   - Add a CNAME record pointing to your GitHub Pages URL:
     ```
     CNAME: yourusername.github.io
     ```

5. Wait for DNS changes to propagate (can take up to 24-48 hours)
6. Go back to your repository settings
7. In the GitHub Pages section, you should see your custom domain
8. Check the "Enforce HTTPS" option for secure access

### Option 2: Deploy to Netlify

1. Sign up for a free Netlify account at [netlify.com](https://www.netlify.com/)
2. Drag and drop this deployment folder to the Netlify dashboard
3. Your site will be published with a Netlify subdomain
4. You can configure a custom domain in the Netlify settings

### Option 3: Deploy to Vercel

1. Sign up for a free Vercel account at [vercel.com](https://vercel.com/)
2. Install the Vercel CLI: `npm i -g vercel`
3. Navigate to this deployment folder in your terminal
4. Run `vercel` and follow the prompts
5. Your site will be published with a Vercel subdomain
6. You can configure a custom domain in the Vercel settings

### Option 4: Deploy to Any Web Hosting

1. Upload all files from this deployment folder to your web hosting via FTP or their control panel
2. Make sure the files are in the public HTML directory (often called `public_html`, `www`, or `htdocs`)
3. Your site will be accessible at your domain name

## File Structure

- `index.html` - The main HTML file containing the website structure, styles, and JavaScript
- `assets/` - Directory containing the background image and other assets
  - `gta6-bg-8k.jpg` - The background image for the website

## Customization

You can customize the website by editing the `index.html` file:

- Change the release date by modifying the `releaseDate` variable in the JavaScript section
- Update the YouTube trailer by changing the `iframe.src` URL in the trailer modal code
- Modify the colors by editing the CSS variables in the `:root` selector
- Update the social links by changing the `href` attributes in the social buttons

## Browser Compatibility

The website is compatible with all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## License

This project is open source and available under the MIT License.
