# PageTemplate Usage Guide

The `PageTemplate` component provides a consistent layout for all pages on the Riddlen site.

## Basic Usage

```jsx
import PageTemplate from '../components/PageTemplate';

export default function MyPage() {
  return (
    <PageTemplate
      title="My Page - Riddlen"
      description="Description of my page"
      currentPage="game"
    >
      <h1>My Page Content</h1>
      <p>Add your content here...</p>
    </PageTemplate>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | "Riddlen - The Web3 Riddle Economy" | Page title for SEO |
| `description` | string | Default description | Meta description for SEO |
| `currentPage` | string | "home" | Current page for header navigation highlighting |
| `children` | ReactNode | - | Page content |
| `showFloatingRiddles` | boolean | true | Show/hide floating emoji background |
| `showFooter` | boolean | true | Show/hide footer |
| `containerMaxWidth` | string | "1200px" | Max width of content container |

## Examples

### Standard Page

```jsx
import PageTemplate from '../components/PageTemplate';

export default function About() {
  return (
    <PageTemplate
      title="About Riddlen - Proof-of-Solve Economy"
      description="Learn about Riddlen's mission to reward human intelligence"
      currentPage="home"
    >
      <section style={{ padding: '4rem 0' }}>
        <h1 className="page-title">About Riddlen</h1>
        <p>Your content here...</p>
      </section>
    </PageTemplate>
  );
}
```

### Page Without Footer

```jsx
import PageTemplate from '../components/PageTemplate';

export default function Game() {
  return (
    <PageTemplate
      title="Play Riddlen - Solve Riddles, Earn RDLN"
      currentPage="game"
      showFooter={false}
    >
      <div className="game-container">
        {/* Game interface */}
      </div>
    </PageTemplate>
  );
}
```

### Wide Layout Page

```jsx
import PageTemplate from '../components/PageTemplate';

export default function Dashboard() {
  return (
    <PageTemplate
      title="Dashboard - Riddlen"
      currentPage="dashboard"
      containerMaxWidth="1400px"
    >
      <div className="dashboard-grid">
        {/* Dashboard widgets */}
      </div>
    </PageTemplate>
  );
}
```

## Styling Your Content

Add page-specific styles using `<style jsx>` tags:

```jsx
import PageTemplate from '../components/PageTemplate';

export default function StyledPage() {
  return (
    <PageTemplate title="Styled Page" currentPage="home">
      <section className="hero-section">
        <h1 className="hero-title">Welcome</h1>
        <p className="hero-text">This is a styled section</p>
      </section>

      <style jsx>{`
        .hero-section {
          padding: 6rem 0;
          text-align: center;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(45deg, #ffffff, #FFD700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1.5rem;
        }

        .hero-text {
          font-size: 1.2rem;
          color: #cccccc;
          max-width: 800px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </PageTemplate>
  );
}
```

## Pre-Built Section Components

### Card Grid Section

```jsx
<section className="card-section">
  <h2 className="section-title">Features</h2>
  <div className="card-grid">
    <div className="card">
      <div className="card-icon">🧩</div>
      <h3>Feature 1</h3>
      <p>Description</p>
    </div>
    {/* More cards... */}
  </div>

  <style jsx>{`
    .card-section {
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
    }

    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .card {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 215, 0, 0.2);
      border-radius: 20px;
      padding: 2rem;
      transition: all 0.3s ease;
    }

    .card:hover {
      transform: translateY(-10px);
      border-color: rgba(255, 215, 0, 0.4);
      box-shadow: 0 20px 40px rgba(255, 215, 0, 0.1);
    }

    .card-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .card h3 {
      color: #FFD700;
      margin-bottom: 0.5rem;
    }

    .card p {
      color: #cccccc;
    }
  `}</style>
</section>
```

## Common Page Values

### currentPage Options
- `"home"` - Home/Landing page
- `"game"` - Game page
- `"dashboard"` - Dashboard page
- `"airdrop"` - Airdrop page
- `"docs"` - Documentation pages

## Tips

1. **SEO**: Always set a unique `title` and `description` for each page
2. **Navigation**: Use the correct `currentPage` value to highlight active nav items
3. **Responsive**: Test your content on mobile - the template handles header/footer responsiveness
4. **Consistency**: Use the same color palette (gold: #FFD700, orange: #FFA500) across pages
5. **Performance**: Avoid heavy components in page templates - lazy load if needed
