# QBITLOG - Digital Agency Website

A modern, responsive website for QBITLOG, a leading software design agency specializing in web development, mobile applications, and digital marketing solutions.

## 🚀 About QBITLOG

QBITLOG is a software design agency that crafts digital experiences that drive results. We specialize in creating innovative web and mobile applications that transform businesses and delight users.

## ✨ Features

- **Modern Design**: Clean, professional interface with smooth animations
- **Responsive Layout**: Optimized for all devices and screen sizes
- **Interactive Components**: Engaging animations and micro-interactions
- **Service Showcase**: Comprehensive display of our development services
- **Contact Integration**: Easy ways for clients to get in touch
- **Performance Optimized**: Fast loading times with Next.js and Turbopack

## 🛠️ Tech Stack

### Frontend

- **Next.js 15.5.3** - React framework with App Router
- **React 19.1.0** - Modern React with latest features
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **GSAP 3.13.0** - Professional-grade animations
- **Framer Motion 12.23.22** - Smooth animations and transitions
- **Lenis 1.3.11** - Smooth scrolling experience

### UI Components

- **Radix UI** - Accessible, unstyled UI primitives
- **Lucide React** - Beautiful, customizable icons
- **Custom Components** - Tailored UI components for unique design

### Development Tools

- **ESLint** - Code linting and formatting
- **Turbopack** - Fast bundling and development
- **Vercel Speed Insights** - Performance monitoring

## 🎯 Services

### Web Development

- Custom web applications using React, Next.js, and modern frameworks
- Responsive, high-performance websites
- Technologies: React, Next.js, Tailwind CSS, TypeScript, Node.js, MongoDB

### Mobile Development

- Native and cross-platform mobile applications
- iOS and Android app development
- Technologies: React Native, Flutter, Swift, Kotlin

### Digital Marketing

- Data-driven marketing strategies
- Social media campaigns and content marketing
- SEO optimization and search ranking improvements

### Graphics Design

- Professional branding and visual identity
- UI/UX design services
- Custom graphics and illustrations

## 🏗️ Project Structure

```
├── app/                          # Next.js App Router
│   ├── _home/                   # Home page components
│   │   ├── components/
│   │   │   ├── hero/           # Hero section
│   │   │   └── about/          # About section
│   │   └── page.tsx            # Home page
│   ├── services/               # Services pages
│   │   ├── _data/              # Service data (JSON)
│   │   ├── _components/        # Service-specific components
│   │   └── [slug]/            # Dynamic service pages
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
├── components/                  # Reusable components
│   ├── animation/              # Animation components
│   ├── global/                 # Global layout components
│   └── ui/                     # UI component library
├── lib/                        # Utility functions
└── public/                     # Static assets
    ├── icons/                  # Technology icons
    └── fonts/                  # Custom fonts
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 22.0.0
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd qbitlog-website
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

## 🎨 Design Features

- **Custom Typography**: Seven Segment font for unique branding
- **Gradient Animations**: Smooth color transitions and effects
- **Interactive Elements**: Hover effects and micro-interactions
- **Smooth Scrolling**: Enhanced user experience with Lenis
- **Responsive Grid**: Adaptive layouts for all screen sizes

## 📱 Responsive Design

The website is fully responsive and optimized for:

- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔧 Customization

### Adding New Services

1. Create a new JSON file in `app/services/_data/`
2. Follow the existing data structure
3. Add corresponding icons to `public/icons/`

### Modifying Animations

- Animation components are in `components/animation/`
- GSAP configurations can be adjusted in individual components
- Smooth scrolling settings in `components/animation/smooth-scrolling/`

### Styling

- Global styles in `app/globals.css`
- Component-specific styles using Tailwind CSS
- Custom CSS variables for consistent theming

## 🚀 Deployment

The project is optimized for deployment on Vercel:

1. **Build the project**

   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Automatic deployments on push to main branch
   - Built-in performance monitoring with Speed Insights

## 📈 Performance

- **Lighthouse Score**: Optimized for 90+ scores
- **Core Web Vitals**: Excellent LCP, FID, and CLS metrics
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Turbopack**: Fast development and build times

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary to QBITLOG.

## 📞 Contact

For business inquiries and project discussions:

- Website: [QBITLOG Website](https://qbitlog.com)
- Email: Contact through the website contact form

---

**QBITLOG** - Crafting Digital Experiences That Drive Results
