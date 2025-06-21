# 3D Portfolio

A modern, interactive 3D portfolio website showcasing full-stack development expertise with stunning brown gradient design and Three.js animations.

![Portfolio Preview](https://img.shields.io/badge/Portfolio-Live-brightgreen)
![Status](https://img.shields.io/badge/Status-Production%20Ready-blue)
![Three.js](https://img.shields.io/badge/Three.js-r128-orange)

## Features

- **Interactive 3D Animations** - Immersive cube-based 3D scenes using Three.js
- **Modern Brown Gradient Design** - Professional color scheme with warm tones
- **Fully Responsive** - Optimized for all devices and screen sizes
- **Working Contact Form** - Netlify Forms integration
- **Performance Optimized** - Lazy loading, mobile detection, and efficient rendering
- **SEO Ready** - Proper meta tags, sitemap, and robot.txt
- **Professional Sections** - Hero, About, Experience, Projects, and Contact

## Tech Stack

- **Frontend:** HTML5, CSS3 (Modern Features), Vanilla JavaScript
- **3D Graphics:** Three.js with OrbitControls
- **Design:** CSS Grid, Flexbox, Glassmorphism, Brown Gradients
- **Forms:** Netlify Forms integration
- **Deployment:** Netlify ready with configuration files

## Quick Start

### Local Development
```bash
# Clone the repository
git clone https://github.com/[yourusername]/portfolio.git
cd portfolio

# Start local server
python -m http.server 8000
# or
npx http-server . -p 8000

# Open http://localhost:8000
```

### Deployment

#### Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Build settings are configured in `netlify.toml`
3. Deploy automatically on push to main branch

#### Render
1. Connect your GitHub repository to Render
2. Settings configured in `render.yaml`
3. Auto-deploy on push

#### Manual Deploy
Upload all files to your web server - no build process required!

## Contact Form Setup

The contact form uses Netlify Forms for email delivery:
- Update email address in HTML contact form
- Form submissions send to your configured email
- Includes success/error messaging
- Professional email handling included

## Customization

### Colors
Update the brown gradient scheme in `styles.css`:
```css
:root {
    --primary-brown: #8B4513;
    --secondary-brown: #A0522D;
    --accent-brown: #CD853F;
    --light-brown: #DEB887;
    --dark-brown: #654321;
}
```

### 3D Objects
Modify cube designs in `script.js`:
- `createHomeObjects()` - Main hero section cubes
- `createAboutObjects()` - About section animations
- `createProjectObjects()` - Project showcase cubes

## Performance Features

- **Mobile Optimization** - Reduced particle count on mobile devices
- **Lazy Loading** - Efficient resource loading
- **Memory Management** - Proper cleanup and disposal
- **Browser Compatibility** - Works on all modern browsers

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Mobile browsers

## Project Structure

```
portfolio/
├── index.html          # Main HTML file
├── styles.css         # Main stylesheet with brown theme
├── script.js          # JavaScript with 3D animations
├── netlify.toml       # Netlify deployment config
├── render.yaml        # Render deployment config
├── robots.txt         # SEO robots file
├── sitemap.xml        # SEO sitemap
├── package.json       # Project metadata
└── README.md          # Documentation
```

## Highlights

- **Professional Design** - Clean, modern interface with brown gradient theme
- **3D Innovation** - Unique cube-based animations replacing traditional designs
- **Full-Stack Focus** - Emphasis on modern web technologies and scalable applications
- **Contact Integration** - Working email form with professional styling
- **Production Ready** - Optimized for deployment on Netlify/Render

