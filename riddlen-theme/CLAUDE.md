# Claude Code Configuration - Riddlen Theme Directory

**Directory Purpose:** Shared theme and design system

## 🎯 What This Directory Is For

**Shared styling, branding, and design assets** used across all Riddlen applications.

### What Lives Here
- ✅ Shared Tailwind configs
- ✅ Color palettes
- ✅ Typography definitions
- ✅ Shared CSS/SCSS
- ✅ Brand assets (logos, icons)
- ✅ Design tokens

### What Does NOT Live Here
- ❌ Application-specific styles (keep in each app)
- ❌ Component implementations (use app directories)
- ❌ .env files

---

## 📁 Stay In Your Lane

- Modify only shared theme assets
- Don't change application code
- Don't duplicate styles - import from here

---

## 🔒 Security Policy

Theme files are public (no secrets expected).

### Files to NEVER Access
- `.env` files (shouldn't be here anyway)

See `../.claudeignore` for restricted files.

---

## 🔄 Git Workflow

```bash
cd /var/www/riddlen/riddlen-theme

# Update theme
vim tailwind.config.js

# Test in app
cd ../frontend && npm run dev

# Commit theme changes
cd ../riddlen-theme
git add .
git commit -m "theme: update primary color palette"
git push
```

### Commit Messages
```
theme: <what changed>

Examples:
- theme: add dark mode color variants
- theme: update typography scale
- theme: add new brand icons
- theme: fix button hover states
```

---

## ✅ Testing Theme Changes

### Before Committing
```bash
# Test in all apps
cd ../frontend && npm run dev
cd ../frontend-staging && npm run dev
cd ../riddlen-frames && npm run dev
cd ../riddlen-devlog && npm run dev

# Check for visual regressions
# Verify consistent styling across apps
```

### Test Checklist
- [ ] Changes work in all apps
- [ ] No visual regressions
- [ ] Dark/light modes work
- [ ] Responsive design intact
- [ ] Accessibility maintained

---

## 🎨 Theme Structure

```
riddlen-theme/
├── README.md            # Usage guide
├── tailwind.config.js   # Shared Tailwind config
├── colors.js            # Color palette
├── typography.js        # Font definitions
├── components/          # Shared style components
├── assets/
│   ├── logos/
│   ├── icons/
│   └── images/
└── docs/
    └── design-system.md
```

### Usage in Apps
```javascript
// In app tailwind.config.js
module.exports = {
  presets: [
    require('../riddlen-theme/tailwind.config.js')
  ],
  // App-specific overrides
}
```

---

## 🧹 Keep It Clean

### Regular Maintenance
```bash
# Remove unused styles
# Update outdated design tokens
# Archive old brand assets

mv riddlen-theme/old-logo.svg riddlen-theme/assets/archive/
git commit -m "theme: archive old logo"
```

---

## 📦 Archive Strategy

Archive:
- Old brand assets (logos, colors)
- Deprecated design patterns
- Unused style components

```bash
mkdir -p riddlen-theme/archive
mv riddlen-theme/old-design-system/ riddlen-theme/archive/
git commit -m "theme: archive old design system"
```

---

## 🔗 Related Directories

### Apps Using This Theme
- `/frontend/` - Main site
- `/frontend-staging/` - Staging site
- `/riddlen-frames/` - Frames app
- `/riddlen-devlog/` - Devlog app

### Import Pattern
```javascript
// In each app
import '../riddlen-theme/colors.js'
```

---

## 🎯 Design System Standards

### Color Naming
```javascript
colors: {
  'riddlen-purple': '#...',
  'riddlen-blue': '#...',
  'riddlen-dark': '#...',
}
```

### Component Classes
```css
.btn-primary { }
.card-riddlen { }
.text-riddlen { }
```

---

## ⚠️ Common Mistakes

### ❌ Don't Do This
- Hardcode colors in apps (use theme)
- Duplicate styles across apps
- Make breaking changes without testing all apps
- Include app-specific styles here

### ✅ Do This Instead
- Use theme variables
- Import shared styles
- Test changes in all apps
- Keep only shared styles here

---

## 🎯 Summary

✅ **DO:**
- Maintain shared theme assets
- Test changes across all apps
- Use consistent naming
- Archive old assets
- Document design system

❌ **DON'T:**
- Include app-specific styles
- Make breaking changes
- Duplicate styles
- Skip cross-app testing

**Goal:** Maintain consistent branding and design across all Riddlen applications.

---

**Related Files:**
- `../frontend/tailwind.config.js` - App-specific config
- `../DESIGN_SYSTEM.md` - Design documentation
- `../.claudeignore` - Restricted files
