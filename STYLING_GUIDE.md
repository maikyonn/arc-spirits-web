# Arc Spirits Styling Guide

Derived from the Monster Card and Artifact Card designs in `arc-spirits-rev-2`.

---

## Color Palette

### Primary Dark Theme (Base)

| Name          | Hex       | Usage                     |
| ------------- | --------- | ------------------------- |
| Abyss Black   | `#0a0404` | Darkest backgrounds       |
| Blood Night   | `#1a0505` | Primary dark background   |
| Shadow Purple | `#1a1520` | Secondary dark background |
| Deep Crimson  | `#2d0a0a` | Dark accent backgrounds   |
| Mystic Purple | `#2a2035` | Card backgrounds          |
| Dark Violet   | `#3a2a40` | Sidebar/panel backgrounds |
| Crimson Void  | `#430d4a` | Gradient mid-tones        |

### Accent Colors

| Name           | Hex       | Usage                               |
| -------------- | --------- | ----------------------------------- |
| Arcane Gold    | `#c4a060` | Primary accent, highlights, borders |
| Cream Text     | `#e8d4b8` | Primary headings                    |
| Pale Pink      | `#fecaca` | Monster card headings               |
| Soft Pink      | `#fca5a5` | Effect names, emphasized text       |
| Muted Lavender | `#a8a0b0` | Body text                           |
| Dusty Rose     | `#b89090` | Secondary text, labels              |
| Slate Gray     | `#908898` | Tertiary text                       |

### State/Status Colors

| State    | Hex       | Usage               |
| -------- | --------- | ------------------- |
| Tainted  | `#dc2626` | Active danger state |
| Corrupt  | `#991b1b` | Medium danger state |
| Fallen   | `#7f1d1d` | Deep danger state   |
| Arcane   | `#0ea5e9` | Magic/special state |
| Inactive | `#64748b` | Disabled state      |

### Effect Type Colors

| Type          | Hex       | Usage          |
| ------------- | --------- | -------------- |
| Before Combat | `#f59e0b` | Amber/warning  |
| During Combat | `#ef4444` | Red/active     |
| After Combat  | `#22c55e` | Green/success  |
| Combat Type   | `#8b5cf6` | Purple/special |

---

## Typography

### Font Family

```css
font-family: 'Opsilon', serif;
```

### Heading Hierarchy

- **H1/Card Title**: 2.1rem, weight 800, letter-spacing 1px, uppercase
- **H2/Section Title**: 22px (1.375rem), weight 700, letter-spacing 0.5px
- **H3/Subsection**: 1rem, weight 700
- **Labels**: 0.65-0.75rem, weight 600-700, letter-spacing 0.08-0.12em, uppercase

### Body Text

- **Primary**: 0.8-0.85rem, weight 400, line-height 1.4
- **Secondary**: 0.7rem, weight 500

---

## Shadows & Glows

### Box Shadows

```css
/* Card shadow - heavy */
box-shadow:
	0 4px 24px rgba(220, 38, 38, 0.3),
	0 0 60px rgba(127, 29, 29, 0.2),
	inset 0 0 100px rgba(0, 0, 0, 0.5);

/* Card shadow - light */
box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);

/* Icon shadow */
box-shadow: 0 0 15px rgba(220, 38, 38, 0.4);

/* Slot shadow */
box-shadow:
	0 2px 8px rgba(0, 0, 0, 0.4),
	inset 0 0 10px rgba(196, 160, 96, 0.1);
```

### Text Shadows

```css
/* Gold glow */
text-shadow: 0 0 8px rgba(196, 160, 96, 0.5);

/* Crimson glow */
text-shadow:
	0 0 10px rgba(220, 38, 38, 0.5),
	0 2px 4px rgba(0, 0, 0, 0.5);

/* Strong heading glow */
text-shadow:
	0 0 20px rgba(220, 38, 38, 0.6),
	0 2px 4px rgba(0, 0, 0, 0.8);
```

---

## Gradients

### Background Gradients

```css
/* Primary dark gradient */
background: linear-gradient(135deg, #1a0505 0%, #430d4a 50%, #0d0202 100%);

/* Card background gradient */
background: linear-gradient(135deg, #2a2035 0%, #1a1520 100%);

/* Sidebar gradient */
background: linear-gradient(180deg, #3a2a40 0%, #2a1a30 100%);

/* Main area overlay */
background: linear-gradient(135deg, rgba(45, 10, 10, 0.9) 0%, rgba(26, 5, 5, 0.95) 100%);

/* Stats block gradient */
background: linear-gradient(180deg, #4a0a0a 0%, #2a0606 50%, #1a0404 100%);
```

### Accent Gradients

```css
/* Gold divider */
background: linear-gradient(90deg, #c4a060 0%, transparent 100%);

/* Art overlay */
background: linear-gradient(
	90deg,
	rgba(26, 5, 5, 0.9) 0%,
	rgba(45, 10, 10, 0.4) 30%,
	transparent 60%
);
```

---

## Borders & Shapes

### Border Styles

```css
/* Primary accent border */
border: 2px solid #c4a060;

/* Crimson border */
border: 2px solid #991b1b;

/* Dark purple border */
border: 2px solid #3d0363;

/* Subtle separator */
border-top: 1px solid rgba(180, 140, 100, 0.2);

/* Effect indicator */
border-left: 3px solid #dc2626;
```

### Border Radius

- Cards: 4-6px
- Badges: 3px
- Icons/Circular: 50%

### Clip Paths (Angular Design)

```css
/* Diagonal main area */
clip-path: polygon(0 0, 100% 0, 80% 100%, 0 100%);

/* Diagonal sidebar */
clip-path: polygon(30% 0, 100% 0, 100% 100%, 0% 100%);

/* Angled section */
clip-path: polygon(0 0, 100% 0, 98% 100%, 0 100%);
```

---

## Component Patterns

### Card Container

```css
.card {
	font-family: 'Opsilon', serif;
	position: relative;
	background: linear-gradient(135deg, #1a0505 0%, #430d4a 50%, #0d0202 100%);
	border-radius: 4px;
	overflow: hidden;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
	border: 2px solid #3d0363;
}
```

### Badge/Tag

```css
.badge {
	padding: 4px 10px;
	font-size: 0.65rem;
	font-weight: 700;
	letter-spacing: 0.1em;
	text-transform: uppercase;
	border-radius: 3px;
}
```

### Section Panel

```css
.panel {
	padding: 12px;
	background: rgba(0, 0, 0, 0.4);
	border-left: 3px solid #dc2626;
	clip-path: polygon(0 0, 100% 0, 98% 100%, 0 100%);
}
```

### Icon Slot

```css
.icon-slot {
	width: 48px;
	height: 48px;
	background: rgba(0, 0, 0, 0.4);
	border: 2px solid rgba(196, 160, 96, 0.6);
	border-radius: 50%;
	padding: 2px;
	box-shadow:
		0 2px 8px rgba(0, 0, 0, 0.4),
		inset 0 0 10px rgba(196, 160, 96, 0.1);
}
```

---

## Decorative Elements

### Vein Pattern (SVG)

```css
background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10,50 Q30,20 50,50 T90,50' stroke='%23450a0a' stroke-width='1' fill='none' opacity='0.3'/%3E%3Cpath d='M20,30 Q40,60 60,30 T100,30' stroke='%23450a0a' stroke-width='0.5' fill='none' opacity='0.2'/%3E%3C/svg%3E");
```

### Slash Marks Pattern

```css
background: repeating-linear-gradient(
	-45deg,
	transparent,
	transparent 8px,
	rgba(220, 38, 38, 0.2) 8px,
	rgba(220, 38, 38, 0.2) 10px
);
```

### Skewed Divider

```css
.divider {
	width: 80%;
	height: 4px;
	background: linear-gradient(90deg, #c4a060 0%, transparent 100%);
	transform: skewX(-6deg);
}
```

---

## Sigils & Symbols

- Diamond: `◆` - Section marker, artifact indicator
- Star: `✧` - Empty/placeholder
- Sword: `⚔` - Guardian indicator
- Bullet dots: `•` - List separator

---

## Animation Guidelines

### Transitions

```css
transition: all 0.2s ease;
```

### Hover States

- Slight scale: `transform: scale(1.02)`
- Increased glow: Brighten shadow opacity
- Border highlight: Increase border opacity

---

## Responsive Breakpoints

Suggested for web adaptation:

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

Card layouts should stack vertically on mobile and use grid layouts on larger screens.
