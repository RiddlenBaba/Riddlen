# Riddlen Design System

This guide provides the design tokens, components, and patterns used across the Riddlen frontend.

## Color Palette

### Primary Colors
```css
--gold: #FFD700
--orange: #FFA500
--red-orange: #FF6347
--dark-bg: #0a0a0a
--purple-bg: #1a0a2e
--blue-bg: #16213e
```

### Text Colors
```css
--white: #ffffff
--light-gray: #cccccc
--medium-gray: #999999
--dark-gray: #666666
--muted-gray: #888888
```

### Gradients
```css
/* Primary Gradient */
background: linear-gradient(45deg, #FFD700, #FFA500);

/* Hero Text Gradient */
background: linear-gradient(45deg, #ffffff, #FFD700);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;

/* Background Gradient */
background: linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 30%, #16213e 70%, #0f0f0f 100%);

/* Card Gradient */
background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05));
```

## Typography

### Font Families
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Font Sizes
```css
--heading-xl: 3.5rem    /* Main hero titles */
--heading-lg: 2.5rem    /* Section titles */
--heading-md: 1.5rem    /* Subsection titles */
--heading-sm: 1.3rem    /* Card titles */

--body-lg: 1.2rem       /* Large body text */
--body-md: 1rem         /* Standard body text */
--body-sm: 0.9rem       /* Small text */
--body-xs: 0.75rem      /* Extra small text */
```

### Font Weights
```css
--weight-regular: 400
--weight-medium: 500
--weight-semibold: 600
--weight-bold: 700
--weight-extrabold: 800
```

## Component Library

### Buttons

#### Primary Button
```jsx
<a href="#" className="btn-primary">
  <i className="fas fa-play"></i> Button Text
</a>

<style jsx>{`
  .btn-primary {
    background: linear-gradient(45deg, #FFD700, #FFA500);
    color: #000;
    padding: 1rem 2rem;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 35px rgba(255, 215, 0, 0.4);
  }
`}</style>
```

#### Secondary Button
```jsx
<a href="#" className="btn-secondary">Button Text</a>

<style jsx>{`
  .btn-secondary {
    background: transparent;
    color: #FFD700;
    padding: 1rem 2rem;
    border: 2px solid #FFD700;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    display: inline-block;
  }

  .btn-secondary:hover {
    background: rgba(255, 215, 0, 0.1);
    transform: translateY(-2px);
  }
`}</style>
```

### Cards

#### Feature Card
```jsx
<div className="feature-card">
  <div className="feature-icon">🧩</div>
  <h3>Card Title</h3>
  <p>Card description text goes here.</p>
</div>

<style jsx>{`
  .feature-card {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 215, 0, 0.2);
    border-radius: 20px;
    padding: 2rem;
    transition: all 0.3s ease;
  }

  .feature-card:hover {
    transform: translateY(-10px);
    border-color: rgba(255, 215, 0, 0.4);
    box-shadow: 0 20px 40px rgba(255, 215, 0, 0.1);
  }

  .feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    text-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
  }

  .feature-card h3 {
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: #FFD700;
  }

  .feature-card p {
    color: #cccccc;
    line-height: 1.6;
  }
`}</style>
```

#### Stat Card
```jsx
<div className="stat-card">
  <div className="stat-number">100M</div>
  <div className="stat-label">Label Text</div>
</div>

<style jsx>{`
  .stat-card {
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05));
    border: 1px solid rgba(255, 215, 0, 0.2);
    border-radius: 20px;
    padding: 2rem;
    text-align: center;
    transition: all 0.3s ease;
  }

  .stat-card:hover {
    transform: translateY(-5px);
    border-color: rgba(255, 215, 0, 0.4);
  }

  .stat-number {
    font-size: 2.5rem;
    font-weight: 800;
    color: #FFD700;
    margin-bottom: 0.5rem;
    text-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
  }

  .stat-label {
    font-size: 1rem;
    color: #cccccc;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`}</style>
```

### Sections

#### Hero Section
```jsx
<section className="hero-section">
  <h1 className="hero-title">Your Title</h1>
  <p className="hero-subtitle">Your subtitle</p>
</section>

<style jsx>{`
  .hero-section {
    padding: 6rem 0;
    text-align: center;
  }

  .hero-title {
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
    background: linear-gradient(45deg, #ffffff, #FFD700);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-subtitle {
    font-size: 1.5rem;
    color: #cccccc;
    max-width: 800px;
    margin: 0 auto;
  }
`}</style>
```

#### Content Section
```jsx
<section className="content-section">
  <h2 className="section-title">Section Title</h2>
  <div className="content-grid">
    {/* Grid items */}
  </div>
</section>

<style jsx>{`
  .content-section {
    padding: 6rem 0;
  }

  .section-title {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 3rem;
    background: linear-gradient(45deg, #ffffff, #FFD700);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .content-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }
`}</style>
```

## Effects & Animations

### Glow Effect
```css
.glow {
  animation: glow 4s ease-in-out infinite alternate;
}

@keyframes glow {
  from { box-shadow: 0 0 20px rgba(255, 215, 0, 0.2); }
  to { box-shadow: 0 0 40px rgba(255, 215, 0, 0.4); }
}
```

### Pulse Effect
```css
.pulse {
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
  50% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.6); }
}
```

### Float Effect
```css
.float {
  animation: float 8s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.1; }
  50% { transform: translateY(-30px) rotate(180deg); opacity: 0.3; }
}
```

### Hover Lift
```css
.lift {
  transition: all 0.3s ease;
}

.lift:hover {
  transform: translateY(-10px);
}
```

## Layout Patterns

### Grid Layouts
```css
/* Auto-fit responsive grid */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

/* 2-column grid */
.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

/* 3-column grid */
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}
```

### Flex Layouts
```css
/* Centered flex */
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

/* Space between */
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

## Responsive Breakpoints

```css
/* Mobile First Approach */

/* Small devices (phones, less than 768px) */
@media (max-width: 767px) {
  /* Mobile styles */
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
  /* Tablet styles */
}

/* Large devices (desktops, 1024px and up) */
@media (min-width: 1024px) {
  /* Desktop styles */
}

/* Extra large devices (large desktops, 1440px and up) */
@media (min-width: 1440px) {
  /* Large desktop styles */
}
```

## Spacing Scale

```css
--space-xs: 0.25rem   /* 4px */
--space-sm: 0.5rem    /* 8px */
--space-md: 1rem      /* 16px */
--space-lg: 1.5rem    /* 24px */
--space-xl: 2rem      /* 32px */
--space-2xl: 3rem     /* 48px */
--space-3xl: 4rem     /* 64px */
--space-4xl: 6rem     /* 96px */
```

## Border Radius Scale

```css
--radius-sm: 8px
--radius-md: 12px
--radius-lg: 20px
--radius-xl: 25px
--radius-full: 50px
```

## Shadows

```css
/* Card shadow */
box-shadow: 0 4px 20px rgba(255, 215, 0, 0.2);

/* Hover shadow */
box-shadow: 0 15px 40px rgba(255, 215, 0, 0.4);

/* Text shadow (glow) */
text-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
```

## Icons

Use Font Awesome 6.4.0 icons:
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
```

Common icons:
- `<i className="fas fa-play"></i>` - Play
- `<i className="fas fa-wallet"></i>` - Wallet
- `<i className="fas fa-coins"></i>` - Coins
- `<i className="fas fa-brain"></i>` - Brain
- `<i className="fas fa-trophy"></i>` - Trophy
- `<i className="fas fa-fire"></i>` - Fire
- `<i className="fas fa-users"></i>` - Users
- `<i className="fab fa-twitter"></i>` - Twitter
- `<i className="fab fa-telegram"></i>` - Telegram
- `<i className="fab fa-github"></i>` - GitHub

## Best Practices

1. **Consistency**: Use design tokens (colors, spacing, etc.) consistently across pages
2. **Accessibility**: Ensure sufficient color contrast (gold on dark backgrounds works well)
3. **Performance**: Optimize images and animations
4. **Mobile First**: Design for mobile, then enhance for desktop
5. **Hover States**: Always provide visual feedback on interactive elements
6. **Loading States**: Show loading indicators for async operations
7. **Error States**: Provide clear error messages with recovery options
8. **Web3 UX**: Guide users through wallet connections and transactions clearly
