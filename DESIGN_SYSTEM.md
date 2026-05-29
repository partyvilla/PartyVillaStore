# PartyVilla Design System

## Overview

PartyVilla is a modern e-commerce platform for gifts and party supplies built with Next.js, React, and Tailwind CSS. The design system uses a cohesive olive green color palette for light mode and an elegant purple theme for dark mode, creating a festive and professional shopping experience.

**Stack:** Next.js 15.2.4 | React 18 | Tailwind CSS 4.1.9 | Radix UI Components

---

## 1. Color Palette

### Light Theme (Default)

#### Primary Colors
- **Primary (`#629539`):** Olive green - Main brand color for buttons, links, and primary actions
- **Primary Foreground (`#ffffff`):** White - Text on primary backgrounds

#### Secondary Colors
- **Secondary (`#7e9146`):** Lighter olive green - Secondary actions and highlights
- **Secondary Foreground (`#ffffff`):** White - Text on secondary backgrounds

#### Neutral Colors
- **Background (`#ffffff`):** Pure white - Main page background
- **Foreground (`#3d4c34`):** Dark olive green - Primary text color
- **Card (`#f7f9f3`):** Very light olive - Card and surface backgrounds
- **Card Foreground (`#3d4c34`):** Dark olive green - Text on cards
- **Muted (`#f0f3e6`):** Light olive - Muted/disabled surfaces
- **Muted Foreground (`#5a6851`):** Muted olive text for secondary content

#### Accent Colors
- **Accent (`#cddba7`):** Pale olive - Accent highlights and hover states
- **Accent Foreground (`#3a4b30`):** Dark olive - Text on accent backgrounds

#### Border & Input
- **Border (`#c6d0b4`):** Olive-tinted border - UI element borders
- **Input (`#ffffff`):** White - Input field backgrounds
- **Ring (`rgba(91, 121, 66, 0.5)`):** Semi-transparent olive green - Focus ring color

#### Semantic Colors
- **Destructive (`#e53e3e`):** Red - Error, delete, and destructive actions
- **Destructive Foreground (`#ffffff`):** White - Text on destructive backgrounds

#### Chart Colors (Data Visualization)
- Chart 1: `#a855f7` (Purple)
- Chart 2: `#fbbf24` (Amber)
- Chart 3: `#6b46c1` (Indigo)
- Chart 4: `#e53e3e` (Red)
- Chart 5: `#4a5568` (Gray)

### Dark Theme

#### Primary Colors
- **Primary (`#a855f7`):** Purple - Main brand color in dark mode
- **Primary Foreground (`#ffffff`):** White text

#### Secondary Colors
- **Secondary (`#fbbf24`):** Amber/Yellow - Secondary actions
- **Secondary Foreground (`#1a1033`):** Deep purple text

#### Neutral Colors
- **Background (`#1a1033`):** Deep purple - Main dark background
- **Foreground (`#ffffff`):** White - Primary text
- **Card (`#221246`):** Slightly lighter purple - Card surfaces
- **Card Foreground (`#ffffff`):** White text
- **Muted (`#2b1e57`):** Muted purple surface
- **Muted Foreground (`#e2e8f0`):** Light gray text

#### Accent Colors
- **Accent (`#fbbf24`):** Amber - Accent highlights
- **Accent Foreground (`#1a1033`):** Deep purple text

#### Border & Input
- **Border (`#3f2d77`):** Purple-tinted borders
- **Input (`#1a1033`):** Deep purple - Input backgrounds
- **Ring (`rgba(168, 85, 247, 0.6)`):** Semi-transparent purple - Focus ring

#### Semantic Colors
- **Destructive (`#e53e3e`):** Red - Error states
- **Destructive Foreground (`#ffffff`):** White text

#### Chart Colors (Dark Mode)
- Chart 1: `#a855f7` (Purple)
- Chart 2: `#fbbf24` (Amber)
- Chart 3: `#c4b5fd` (Light purple for visibility)
- Chart 4: `#f87171` (Light red)
- Chart 5: `#a0aec0` (Light gray)

### Sidebar Theme

#### Light Mode Sidebar
- Background: `#f9f5ff` (Very light purple)
- Foreground: `#6b46c1` (Indigo)
- Primary: `#a855f7` (Purple)
- Primary Foreground: `#ffffff` (White)
- Accent: `#fbbf24` (Amber)
- Accent Foreground: `#6b46c1` (Indigo)
- Border: `#cbd5e0` (Light gray)
- Ring: `rgba(168, 85, 247, 0.5)` (Semi-transparent purple)

#### Dark Mode Sidebar
- Background: `#1f1842` (Dark purple)
- Foreground: `#ffffff` (White)
- Primary: `#a855f7` (Purple)
- Primary Foreground: `#ffffff` (White)
- Accent: `#fbbf24` (Amber)
- Accent Foreground: `#1a1033` (Deep purple)
- Border: `#3f2d77` (Purple-tinted)
- Ring: `rgba(168, 85, 247, 0.6)` (Semi-transparent purple)

---

## 2. Typography

### Fonts

#### Primary Font: DM Sans
- **Purpose:** Body text, UI components
- **Usage:** All body copy, buttons, form labels, and general UI text
- **CSS Variable:** `--font-dm-sans`
- **Import Source:** Google Fonts
- **Display Mode:** `swap` (ensures fast fallback)

#### Display Font: Space Grotesk
- **Purpose:** Headings and display elements
- **Usage:** h1, h2, h3, h4, h5, h6 and major headlines
- **CSS Variable:** `--font-space-grotesk`
- **Import Source:** Google Fonts
- **Display Mode:** `swap`
- **Letter Spacing:** `-0.01em` (tight, modern look)

### Font Sizing

Tailwind CSS default scale is used. Common sizes:
- **Text Base:** 1rem (16px) - Default body text
- **Text SM:** 0.875rem (14px) - Secondary text, hints
- **Text XS:** 0.75rem (12px) - Fine print, badges
- **Text LG:** 1.125rem (18px) - Subheadings
- **Text XL:** 1.25rem (20px) - Headings
- **Text 2XL:** 1.5rem (24px) - Major headings
- **Text 3XL:** 1.875rem (30px) - Page titles

### Font Weights

- **Normal (400):** Default text, body
- **Medium (500):** Emphasized text, labels
- **Semibold (600):** Card titles, highlights
- **Bold (700):** Headings (h1-h6)

### Line Heights

- **Headings:** Normal (auto calculated)
- **Body:** Tailwind default
- **Input/Form:** Tight for compact UI

---

## 3. Border Radius

Central radius unit: `--radius: 0.5rem` (8px)

### Radius Scale
- **sm:** `calc(var(--radius) - 4px)` = 4px
- **md:** `calc(var(--radius) - 2px)` = 6px
- **lg:** `var(--radius)` = 8px (default/standard)
- **xl:** `calc(var(--radius) + 4px)` = 12px

### Component-Specific Rounding
- **Buttons:** `rounded-md` (6px)
- **Cards:** `rounded-xl` (12px)
- **Inputs:** Default rounded
- **Product Cards:** `rounded-lg` (8px)
- **Badges:** `rounded-md` (6px)
- **Modals/Dialogs:** `rounded-lg` (8px)

---

## 4. Spacing

Uses Tailwind CSS spacing scale (multiples of 0.25rem):

### Common Spacing Values
- **xs:** 0.5rem (4px)
- **sm:** 0.5rem (8px)
- **md:** 1rem (16px)
- **lg:** 1.5rem (24px)
- **xl:** 2rem (32px)
- **2xl:** 2.5rem (40px)
- **3xl:** 3rem (48px)

### Component Spacing Examples
- **Card Padding:** `py-6 px-6` (vertical 24px, horizontal 24px)
- **Card Gap:** `gap-6` (24px between items)
- **Button Padding:** `px-4 py-2` (default size)
- **Product Card Padding:** `p-4` (16px) on mobile, adjusted for screen sizes
- **Form Input Padding:** Default Tailwind
- **Margin Between Sections:** `mb-4` to `mb-8` (16px to 32px)

### Gap Values (Flexbox)
- **Gap 1:** 0.25rem (4px)
- **Gap 2:** 0.5rem (8px)
- **Gap 3:** 0.75rem (12px)
- **Gap 4:** 1rem (16px)
- **Gap 6:** 1.5rem (24px)

---

## 5. Shadows

### Shadow Scale
- **shadow-none:** No shadow
- **shadow-xs:** `0 1px 2px 0 rgba(0, 0, 0, 0.05)` - Subtle
- **shadow-sm:** `0 1px 2px 0 rgba(0, 0, 0, 0.05)` - Default for cards
- **shadow-md:** `0 4px 6px -1px rgba(0, 0, 0, 0.1)`
- **shadow-lg:** `0 10px 15px -3px rgba(0, 0, 0, 0.1)`

### Component Usage
- **Cards:** `shadow-sm` (default)
- **Buttons:** `shadow-xs`
- **Product Cards on Hover:** `hover:shadow-md` (elevated effect)
- **Dropdowns/Modals:** `shadow-lg`
- **Headers:** `shadow-sm` (subtle depth)

---

## 6. Components

### 6.1 Button Component

**File:** `components/ui/button.tsx`

#### Variants
- **default:** Primary olive green, white text, shadow
- **destructive:** Red background, white text, for delete/danger actions
- **outline:** Bordered style with transparent background, accent hover
- **secondary:** Lighter olive green background
- **ghost:** No background, accent hover (minimal style)
- **link:** Text only, underlined (like a hyperlink)

#### Sizes
- **default:** `h-9 px-4 py-2` (36px height)
- **sm:** `h-8 rounded-md gap-1.5 px-3` (32px height, compact)
- **lg:** `h-10 rounded-md px-6` (40px height, large)
- **icon:** `size-9` (36x36px square for icon buttons)

#### Features
- **Gap:** `gap-2` between icon and text
- **Icon Sizing:** SVG defaults to `size-4` (16px)
- **Disabled State:** `disabled:pointer-events-none disabled:opacity-50`
- **Focus State:** `focus-visible:ring-ring/50 focus-visible:ring-[3px]`
- **Transitions:** `transition-all` for smooth state changes

#### Usage Examples
```tsx
<Button variant="default" size="md">Add to Cart</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="destructive">Delete</Button>
<Button variant="ghost" size="icon"><Icon /></Button>
```

### 6.2 Card Component

**File:** `components/ui/card.tsx`

#### Subcomponents
- **Card:** Main container (`bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm`)
- **CardHeader:** Header section with auto grid layout
- **CardTitle:** Bold title text
- **CardDescription:** Secondary text for card descriptions
- **CardContent:** Main content area with padding
- **CardFooter:** Footer section with flex layout
- **CardAction:** Action button area (top-right positioning)

#### Structure
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
    <CardAction><!-- Action button --></CardAction>
  </CardHeader>
  <CardContent>
    <!-- Main content -->
  </CardContent>
  <CardFooter>
    <!-- Footer actions -->
  </CardFooter>
</Card>
```

#### Styling
- **Gap between children:** `gap-6` (24px)
- **Padding:** `py-6` (vertical), `px-6` (content areas)
- **Border:** Subtle border using `border-border`
- **Border-bottom/top padding:** Automatically adjusted with `[.border-b]:pb-6` and `[.border-t]:pt-6`
- **Responsive:** Container queries for internal layout

### 6.3 Input Components

**Files:** 
- `components/ui/input.tsx`
- `components/ui/labeled-input.tsx`
- `components/ui/password-input.tsx`

#### Input
- White background (`bg-input`)
- Subtle border (`border-border`)
- Focus ring (olive green ring)
- Padding: Standard form field padding
- Border radius: `rounded-md`

#### LabeledInput
- Wrapper component combining `<label>` and `<Input>`
- Label positioning above input
- Gap between label and input

#### PasswordInput
- Input with show/hide password toggle
- Eye icon button to reveal/hide
- Uses same styling as regular input

### 6.4 Badge Component

**File:** `components/ui/badge.tsx`

#### Purpose
- Tags, labels, status indicators
- Small, inline elements

#### Variants
- **default:** Filled variant
- **secondary:** Secondary color variant
- **destructive:** Red for alerts
- **outline:** Border only

#### Sizing
- Compact padding: `px-2.5 py-0.5`
- Small text size: `text-xs`
- Rounded: `rounded-md`

### 6.5 Dialog Component

**File:** `components/ui/dialog.tsx`

#### Features
- Built on Radix UI Dialog primitives
- Modal overlay with backdrop
- Centered content area
- Close button (X icon)
- Smooth animations

#### Structure
```tsx
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    <!-- Content -->
  </DialogContent>
</Dialog>
```

### 6.6 Select Component

**File:** `components/ui/select.tsx`

#### Features
- Dropdown select menu
- Built on Radix UI Select
- Keyboard navigation support
- Value display in trigger
- Dropdown menu with options

### 6.7 Table Component

**File:** `components/ui/table.tsx`

#### Subcomponents
- **Table:** Main wrapper
- **TableHeader:** Header section
- **TableBody:** Body rows
- **TableFooter:** Footer section
- **TableHead:** Individual header cell
- **TableRow:** Table row
- **TableCell:** Individual cell

#### Styling
- Border separators between rows
- Padding for cells
- Hover effects on rows

### 6.8 Slider Component

**File:** `components/ui/slider.tsx`

#### Purpose
- Range input for price filters, ratings, etc.
- Built on Radix UI Slider

#### Features
- Smooth drag interaction
- Min/max value support
- Step increments
- Focus accessible

### 6.9 Toast Notifications

**Files:** 
- `components/ui/toast.tsx`
- `components/ui/toaster.tsx`

#### Usage
```tsx
import { useToast } from "@/components/ui/use-toast"

const { toast } = useToast()
toast({
  title: "Success",
  description: "Item added to cart",
})
```

#### Features
- Multiple toast variants (default, destructive, etc.)
- Auto-dismiss after timeout
- Stacking support
- Action buttons support

---

## 7. Product Card Component

**File:** `components/products/product-card.tsx`

### Layout
- **Container:** `group h-full bg-white border border-primary/10 rounded-lg overflow-hidden shadow-sm`
- **Image Container:** `h-36 xs:h-40 sm:h-48` (responsive heights)
- **Text Section:** `p-2 xs:p-3 sm:p-4`

### Features
- **Image:** Optimized with Next.js Image component
  - Hover scale effect: `group-hover:scale-110`
  - Transition: `transition-transform duration-700 ease-in-out`
- **Title:** Line-clamped to 2 lines, responsive sizing
- **Price:** Bold, olive green (`text-primary`), larger text
- **Stock Status:**
  - "Out of Stock" overlay with red badge on image
  - "Only X left!" warning for low stock (<= 5)
- **Add to Cart Button:** Outline variant with hover effects
- **Hover Effects:**
  - Shadow elevation: `hover:shadow-md`
  - Border enhancement: `hover:border-primary/20`
  - Lift effect: `hover:-translate-y-1`

### Responsive Design
- **XS (≥480px):** Adjusted image heights and padding
- **SM (≥640px):** Full-sized layout
- **Mobile First:** Base styles for mobile, enhanced at breakpoints

---

## 8. Header/Navigation

**File:** `components/layout/site-header.tsx`

### Brand Section
- Logo SVG (party/gift icon)
- Brand name: "PartyVilla" with tagline "Celebrations Perfected"
- Colors: Olive green (`text-primary`)
- Font: Bold, Space Grotesk for brand name

### Navigation Layout
- **Desktop:** Horizontal layout with search bar
- **Mobile:** Toggle menu with hamburger icon
- **Sticky:** `sticky top-0 z-50`

### Search Component
- Desktop: Wide search bar with suggestions
- Mobile: Toggle to show/hide search
- Placeholder: "Search for balloons, decorations, gifts..."

### User Actions
- Shopping cart button
- User navigation (login/profile/logout)
- Mobile menu toggle

### Mobile Menu
- Expandable menu below header
- Conditional items (admin dashboard, orders, address)
- User authentication options (login/signup)

---

## 9. Footer Component

**File:** `components/layout/footer.tsx`

### Sections
- **About/Branding:** Company info
- **Links:** Navigation links grouped by category
- **Contact:** Contact information
- **Social:** Social media links
- **Copyright:** Legal footer

### Styling
- Background: Subtle color (likely muted background)
- Text: Muted foreground color
- Responsive: Stack vertically on mobile

---

## 10. Responsive Design

### Breakpoints (Tailwind CSS)

Custom breakpoint added:
- **xs:** 480px (extra small, between mobile and standard tablet)

Standard Tailwind breakpoints:
- **sm:** 640px
- **md:** 768px
- **lg:** 1024px
- **xl:** 1280px
- **2xl:** 1536px

### Mobile-First Approach
- Base styles are mobile-optimized
- Enhanced with `sm:`, `md:`, `lg:` prefixes as screen grows
- Example: `h-36 xs:h-40 sm:h-48` (grows with screen)

### Container Queries
Used for responsive component behavior:
- Example: `@container/card-header` for responsive card layouts

---

## 11. Layout & Grids

### Main Layout Structure
```
<html> (RootLayout)
├── <body> (flex flex-col)
│   ├── <AuthProvider>
│   │   ├── <SiteHeader> (sticky top-0 z-50)
│   │   ├── <CategoryNav>
│   │   ├── <div> (flex-grow, main content area)
│   │   │   └── {children}
│   │   ├── <Footer>
│   │   ├── <Toaster>
│   │   ├── <LinkPrefetcher>
│   │   ├── <ImageOptimizer>
│   │   └── <AutoReloadOnReturn>
```

### Page Width Constraints
- **Max Width:** `max-w-6xl` (1152px) on main content
- **Horizontal Padding:** `px-4` (16px) on mobile, adjusted on larger screens
- **Centered:** `mx-auto` for centering

### Grid Layouts
- **Product Grid:** Tailwind grid with responsive columns
  - Mobile: 1-2 columns
  - Tablet: 2-3 columns
  - Desktop: 3-4 columns
- **Admin Dashboard:** Multi-column layouts for data tables

---

## 12. Background & Visual Effects

### Page Background
Gradient background with radial overlays:
```css
backgroundImage: `
  linear-gradient(to bottom, rgba(247, 249, 243, 0.8) 0%, rgba(255, 255, 255, 1) 100%),
  radial-gradient(circle at top right, rgba(146, 184, 94, 0.1), transparent 60%),
  radial-gradient(circle at bottom left, rgba(146, 184, 94, 0.15), transparent 60%)
`
backgroundAttachment: 'fixed'
```

### Effects
- **Fixed background:** Stays in place during scroll for depth
- **Subtle olive tint:** Creates festive, organic feel
- **Smooth gradients:** No harsh transitions

### Scrollbar
Hidden across the site:
```css
* {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
*::-webkit-scrollbar {
  display: none;  /* Chrome, Safari, Opera */
}
```

---

## 13. Animations & Transitions

### Tailwind Animation Classes Used
- `transition-all` - Smooth state transitions
- `transition-transform` - Image hover effects
- `transition-colors` - Color changes on hover
- `duration-200` - Fast transitions (0.2s)
- `duration-300` - Standard transitions (0.3s)
- `duration-700` - Slow transitions (0.7s, images)

### Easing Functions
- `ease-in-out` - Natural acceleration/deceleration

### Common Animation Patterns
- **Button Hover:** Color change with `transition-all`
- **Image Hover:** Scale up with `group-hover:scale-110`
- **Card Hover:** Lift effect with `hover:-translate-y-1`
- **Focus States:** Ring animation on focus

---

## 14. Accessibility

### Focus Indicators
- **Focus Visible Ring:** `focus-visible:ring-ring/50 focus-visible:ring-[3px]`
- **Color:** Olive green ring for light mode, purple for dark mode
- **Contrast:** Meets WCAG AA standards

### Semantic HTML
- Proper heading hierarchy (h1-h6)
- Label associations with form inputs
- Button vs. link usage
- Image alt text required

### ARIA Attributes
- `aria-label` on icon buttons
- `aria-invalid` for form validation states
- Role attributes on custom components

### Keyboard Navigation
- Full keyboard support via Radix UI components
- Tab order follows visual layout
- Enter/Space to activate buttons

### Screen Reader Support
- `sr-only` class for visually hidden but readable content
- Descriptive alt text on images
- Form labels properly associated

---

## 15. Form Elements

### Input Styling
- **Border:** `border-border` (olive-tinted)
- **Background:** White (`bg-input`)
- **Padding:** Standard form field padding
- **Radius:** `rounded-md`
- **Focus:** Ring with primary color
- **Placeholder:** Muted text color

### Textarea
- Multi-line input variant
- Same styling as input
- Adjustable height
- File: `components/ui/textarea.tsx`

### Select Dropdown
- Custom styling with Radix UI
- Dropdown trigger showing current value
- Menu with option items
- File: `components/ui/select.tsx`

### Slider/Range Input
- Range picker component
- Thumb and track styling
- Min/max constraints
- File: `components/ui/slider.tsx`

### Label
- Associated with form inputs
- Optional required indicator
- File: `components/ui/label.tsx`

---

## 16. Admin Dashboard Design

### Sidebar Navigation
- Fixed or collapsible sidebar
- Color scheme: Purple and amber (from sidebar theme)
- Active state highlighting
- Icons + text labels

### Metric Cards
- Display KPIs and stats
- Card-based layout
- Charts/data visualization
- File: `components/admin/admin-metric-card.tsx`

### Data Tables
- Multi-column layouts
- Sortable headers (if implemented)
- Row actions (edit, delete)
- Uses Table component
- Files: `components/admin/management/*.tsx`

### Forms (Admin)
- Product creation/editing
- Category management
- Delivery settings
- Consistent styling with main app
- Files: `components/admin/forms/*.tsx`

---

## 17. Dark Mode Implementation

### Theme Provider
- Uses `next-themes` library
- Automatic light/dark mode detection
- Manual toggle support
- File: `components/layout/theme-provider.tsx`

### CSS Custom Properties
- Root CSS variables for light theme
- `.dark` class selector for dark theme
- All colors defined as CSS variables in `globals.css`
- Tailwind uses these variables via `@theme` directive

### Dark Mode Activation
- `.dark` class on HTML element
- Controlled by theme provider
- System preference detection available

### Color Adjustments
- All color tokens have dark mode variants
- Chart colors adjusted for visibility in dark mode
- Sidebar theme colors optimized for dark mode

---

## 18. Search & Filters

### Search Component
- File: `components/search/search-suggestions.tsx`
- Autocomplete suggestions
- Mobile and desktop variants
- Icon-based search UI

### Collapsible Filters
- File: `components/search/collapsible-filters.tsx`
- Price range slider
- Category filters
- Stock availability toggle
- Expandable/collapsible sections

---

## 19. Cart & Checkout

### Cart Components
- **Cart Button:** Quick access button in header
- **Cart Page:** Full cart management
- **Cart Item:** Individual item rows with quantity controls
- **Add to Cart:** Button on product cards and product detail page
- Files: `components/cart/*.tsx`

### Checkout Flow
- Order summary display
- Shipping address selection
- Payment method selection
- Order confirmation
- File: `components/checkout/*.tsx`

---

## 20. Image Handling

### Image Optimization
- Next.js Image component for optimization
- Responsive sizing
- Lazy loading
- Format optimization (WebP, etc.)
- File: `components/media/image-optimizer.tsx`

### Image Upload
- File: `components/media/image-upload.tsx`
- Product image uploads
- Category image uploads
- Preview before upload

### Image Gallery
- File: `components/products/image-slider.tsx`
- Multiple product images
- Carousel/slider navigation
- Lightbox view (if implemented)

---

## 21. Design System Tools & Standards

### Class Utility Library
- **File:** Uses `clsx` and `tailwind-merge` for className combining
- **Utility Function:** `cn()` helper function for merging Tailwind classes

### Component Patterns
- Slot composition via `@radix-ui/react-slot`
- Class Variance Authority (CVA) for variant management
- React forwarding refs for component extensibility

### Icons
- **Library:** Lucide React
- **Sizing:** Default `size-4` (16px), adjustable
- **Usage:** Icon buttons, navigation, UI indicators

### Data Validation
- **Zod:** Schema validation for forms and API responses
- **React Hook Form:** Form state management with resolver integration

---

## 22. Tailwind CSS Configuration

**File:** `tailwind.config.js`

### Content Paths
```js
content: [
  './app/**/*.{js,ts,jsx,tsx}',
  './components/**/*.{js,ts,jsx,tsx}',
]
```

### Theme Extensions
- Custom `xs` breakpoint: 480px
- All color tokens extended via CSS variables in `globals.css`
- No built-in theme overrides (all via CSS variables)

### Plugins
- Currently no external plugins
- Uses default Tailwind utilities

---

## 23. Performance Optimizations

### Prefetching
- Link prefetching component
- File: `components/navigation/link-prefetcher.tsx`
- Preloads linked pages for instant navigation

### Image Optimization
- Image optimizer component
- File: `components/media/image-optimizer.tsx`
- Lazy loading and format optimization

### Analytics
- Vercel Analytics integration
- File: `app/layout.tsx` (Analytics component)

### Auto Reload
- File: `components/navigation/auto-reload-on-return.tsx`
- Refreshes data when returning to page from background

---

## 24. Component Customization

### Using `cn()` Function
```tsx
import { cn } from "@/lib/utils/utils"

function Component({ className, ...props }) {
  return (
    <div className={cn("base-classes", className)} {...props} />
  )
}
```

### With Class Variance Authority (CVA)
```tsx
const buttonVariants = cva("base-classes", {
  variants: {
    variant: {
      default: "styles",
      outline: "styles",
    },
    size: {
      default: "styles",
      sm: "styles",
    },
  },
})
```

### Extending Components
- Pass custom `className` prop to combine with base styles
- Use `asChild` prop (if available) for polymorphism
- Tailwind merge ensures proper specificity

---

## 25. Color Usage Guidelines

### When to Use Colors

**Primary (Olive Green #629539)**
- Main call-to-action buttons
- Links and primary interactions
- Brand elements and branding
- Hover states on secondary elements

**Secondary (Lighter Olive #7e9146)**
- Secondary buttons and actions
- Alternative call-to-actions
- Background accents

**Accent (Pale Olive #cddba7)**
- Highlights and focus states
- Hover backgrounds
- Visual emphasis

**Muted (#f0f3e6)**
- Disabled states
- Secondary backgrounds
- Less important UI areas

**Destructive (Red #e53e3e)**
- Delete buttons
- Error messages
- Critical alerts
- Form validation errors

**Border (#c6d0b4)**
- UI borders and dividers
- Form input borders
- Card borders

### Dark Mode Adjustments
- Purple replaces olive green as primary in dark mode
- Amber becomes more prominent
- All backgrounds shift to deep purple tones
- Text is white/light for contrast

---

## 26. Usage Examples

### Creating a Styled Button
```tsx
import { Button } from "@/components/ui/button"

export function Example() {
  return (
    <div className="flex gap-2">
      <Button variant="default">Primary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="destructive" size="sm">Delete</Button>
      <Button variant="ghost" size="icon"><Icon /></Button>
    </div>
  )
}
```

### Creating a Card with Content
```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Card content goes here</p>
      </CardContent>
    </Card>
  )
}
```

### Responsive Layout
```tsx
export function Example() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
    </div>
  )
}
```

### Using Toast Notifications
```tsx
import { useToast } from "@/components/ui/use-toast"

export function Example() {
  const { toast } = useToast()
  
  return (
    <button 
      onClick={() => toast({
        title: "Success",
        description: "Action completed successfully",
      })}
    >
      Show Toast
    </button>
  )
}
```

---

## 27. File Structure Reference

```
components/
├── ui/                          # Base UI components
│   ├── button.tsx              # Button with variants
│   ├── card.tsx                # Card layout component
│   ├── input.tsx               # Text input
│   ├── label.tsx               # Form label
│   ├── badge.tsx               # Badge/tag component
│   ├── dialog.tsx              # Modal dialog
│   ├── select.tsx              # Dropdown select
│   ├── table.tsx               # Data table
│   ├── slider.tsx              # Range slider
│   ├── toast.tsx               # Toast notifications
│   ├── textarea.tsx            # Multi-line input
│   └── password-input.tsx      # Password field with toggle
├── layout/
│   ├── site-header.tsx         # Main navigation header
│   ├── footer.tsx              # Footer section
│   └── theme-provider.tsx      # Dark mode provider
├── products/
│   ├── product-card.tsx        # Product display card
│   ├── product-gallery.tsx     # Product image gallery
│   ├── image-slider.tsx        # Image carousel
│   └── stock-management.tsx    # Stock status display
├── cart/
│   ├── cart-button.tsx         # Cart icon button
│   ├── add-to-cart-client.tsx  # Add to cart action
│   └── cart-item.tsx           # Cart item row
├── admin/
│   ├── admin-sidebar.tsx       # Admin navigation
│   ├── admin-metric-card.tsx   # Stat/metric card
│   └── forms/                  # Admin forms
└── search/
    ├── search-suggestions.tsx  # Search with autocomplete
    └── collapsible-filters.tsx # Filter sidebar

app/
├── globals.css                 # Design tokens & base styles
├── layout.tsx                  # Root layout
└── (main)/
    ├── shop/page.tsx           # Main shop page
    ├── product/[id]/page.tsx   # Product detail
    └── cart/page.tsx           # Shopping cart

lib/
├── utils/
│   ├── utils.ts               # cn() helper function
│   └── currency.ts            # Currency formatting
```

---

## 28. Maintenance & Updates

### When Adding New Colors
1. Add CSS variable to `:root` and `.dark` in `globals.css`
2. Wire to Tailwind via `@theme` directive
3. Update this documentation
4. Test in both light and dark modes

### When Adding New Components
1. Create in `components/ui/`
2. Use consistent variant/size patterns
3. Include TypeScript types
4. Use CVA for variants if complex
5. Document in this design system

### When Modifying Spacing/Typography
1. Update values in `globals.css` if CSS variables
2. Update Tailwind config if needed
3. Test responsive breakpoints
4. Document changes here

---

## 29. Dependencies

Key design system dependencies:
- **Tailwind CSS 4.1.9** - Utility CSS framework
- **Radix UI Components** - Unstyled, accessible component library
- **Class Variance Authority (CVA)** - Variant management
- **Lucide React** - Icon library
- **next-themes** - Dark mode support
- **clsx & tailwind-merge** - Class merging utilities

---

## 30. Quick Reference

| Element | Color | Component |
|---------|-------|-----------|
| Primary Buttons | Olive Green | `<Button variant="default">` |
| Secondary Buttons | Lighter Olive | `<Button variant="secondary">` |
| Danger Buttons | Red | `<Button variant="destructive">` |
| Links | Olive Green | `<Button variant="link">` |
| Cards | Light Olive BG | `<Card>` |
| Inputs | White BG | `<Input>` |
| Badges | Various | `<Badge variant="...">` |
| Headers | Space Grotesk | `<h1>`, `<h2>`, etc. |
| Body Text | DM Sans | Default |
| Product Cards | White | `<ProductCard>` |
| Focus Ring | Olive Green | Built-in to components |

---

**Last Updated:** 2026-05-30
**Design System Version:** 1.0
**Framework:** Next.js 15 with Tailwind CSS 4 & Radix UI
