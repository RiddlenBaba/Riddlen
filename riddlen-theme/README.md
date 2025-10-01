# Riddlen Theme

Official Jekyll theme for Riddlen Protocol documentation.

## Features

- Professional dark theme with Akash-inspired design
- Fixed navigation bar with search
- Collapsible sidebar navigation
- Responsive layout
- SEO optimized
- Client-side search

## Installation

Add this line to your Jekyll site's `Gemfile`:

```ruby
gem "riddlen-theme", path: "../riddlen-theme"
```

And add this line to your Jekyll site's `_config.yml`:

```yaml
theme: riddlen-theme
```

## Usage

The theme provides a `default` layout that includes:
- Fixed top navigation
- Sidebar navigation
- Main content area
- Footer
- Search functionality

## Customization

Configure in `_config.yml`:

```yaml
riddlen:
  version: "v6.0"
  contracts:
    rdln: "0x..."
```

## License

Apache-2.0
