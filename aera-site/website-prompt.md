# Prompt: Build the website for Aera Magazine — a student fashion magazine

> Replace anything in [BRACKETS] with your real info. Attach your inspo images/videos alongside this prompt when you paste it into your coding tool.

---

## Role & goal

You are a senior front-end developer and editorial web designer. Build a complete, responsive, multi-page website for **Aera Magazine**, a student-run fashion magazine at **Palo Alto High School**. It should feel like an indie art/fashion zine online: playful, hand-made and art-directed, but still easy for students, parents and teachers to navigate in a couple of clicks.

## Visual direction (reference: myaloparo.art + attached inspo)

Follow the look of https://www.myaloparo.art:

- **Lots of white space.** Off-white/paper background (`#FFFFFF` or `#FBFAF7`). Content floats in open space instead of sitting in heavy boxes or cards.
- **Hand-drawn ornaments.** Black ink, scribbly, slightly wobbly. Example: a mirrored pair of swirl/flame flourishes across the top of the homepage. Use inline SVG so they can animate.
- **Type pairing:**
  - Display/name: a light geometric sans (e.g. *Montserrat* light, letter-spaced, uppercase) in a soft accent color.
  - Labels/nav/metadata: a tiny monospace or dot-matrix font (e.g. *Doto*, *Space Mono* or *IBM Plex Mono*), lowercase, about 11–13px, generous letter-spacing.
  - Article body: a readable editorial serif (e.g. *Cormorant Garamond*, *Instrument Serif* or *EB Garamond*).
- **Palette:** mostly black and white with one or two soft accents, e.g. baby pink `#F2A7C3` and pale butter/sage `#E9EBC8`. Define every color as a CSS variable so we can re-theme each issue.
- **Collage-style imagery.** Photos and artwork appear as small, irregularly placed cutouts at slightly different sizes and heights, like objects scattered on a table, not in a rigid grid.
- **Tiny nav.** Small lowercase labels spread across the page (e.g. `about` left, `stories` center, `contact` right) instead of a chunky navbar.
- Also borrow from my attached inspo: the **endless bookshelf of colorful spines that turn to show their covers** (screen recording 1) and the **card stack that shuffles and fans out into a 3D ring** (screen recording 2). Full specs for both are below.

### Bold editorial moments (from our Pinterest board, attached)

The calm white base above is the canvas. On top of it, story pages and section headers get **loud, poster-like typography moments**, like a printed fashion magazine. Contrast is the whole point: quiet minimal frame, loud art-directed spreads.

- **Photo-filled giant type.** Huge condensed uppercase headlines (e.g. *Anton*, *Bebas Neue* or *Oswald*, tightly leaded) with a photo showing *through* the letters (`background-clip: text`), set on a solid color field. Example: "EXPRESS YOURSELF FULLY" in cobalt, "INTERNAL RIOT FAILURE" in hot magenta. Use this for story heroes and section titles.
- **Oversized letterforms interacting with photos.** One giant serif or sans letter (G, C, R, a drop-cap "A") sits behind or around a model cutout, so the person overlaps the letter. Big Didone headlines (*Playfair Display* / *Bodoni Moda*, Vogue-style) broken across lines like "Inte / gra / tion".
- **Scattered letter collage.** Words broken into individual letters at mixed sizes, scattered over a photo (like the "Galimonde" spread).
- **Hand-drawn marker overlays.** Red marker scribbles, circles and arrows drawn over posters and photos (like the red apple outline on the "Oh Wonder" poster). Use animated SVG so they draw in on scroll. This ties back to the hand-drawn ornaments in the header.
- **Print textures.**
  - Risograph pink with misregistered or blurred type ("soft gentle focus").
  - Halftone or xerox yellow strips with eyes.
  - Motion-blurred or gradient-blurred display type ("WOOYOUNG") for hover states.
  - Repeated stacked words ("je t'aime / je t'aime / je t'aime").
  - Apply these as CSS filters, SVG noise/grain overlays and `mix-blend-mode`. Keep them subtle: add grain to the whole page at low opacity.
- **Pop-art color blocking.** Split a portrait into a 3×3 grid of tinted squares, each square a different hue (like the "A POP" poster), with stars and sticker shapes. Use this for one feature-story hero.
- **Fashion textures as backgrounds and dividers.** Fabric swatches (leather, linen, velvet), animal print (tiger, leopard), mosaic tiles, a polka-dot numeral (e.g. "2026" filled with dots for the issue year) and high-contrast B&W flower graphics. Use them as section dividers, tag backgrounds or cutouts in the collage.
- **Elegant script logotype accent.** A flourishy calligraphic script (e.g. *Pinyon Script* or *Italianno*) for small accents only, like "the portfolio" or "letter from the editor", inside a thin selection box with corner handles (the "Portfolio" pin).
- **Expanded palette for these moments**, all as CSS variables:
  - Bold colors: cobalt `#2433E8`, hot magenta `#E0218A`, cherry red `#E5231B`, highlighter yellow `#F4E21A`, deep wine `#6E1E2B`.
  - Base and soft colors: off-white `#F4F1EA`, black `#0B0B0B`, the soft pink `#F2A7C3`.
  - Each issue can pick one "issue color" that themes its bookshelf spine, story heroes and accent links.
- **Article layouts should feel like magazine spreads, not blog posts.**
  - Two-column text with drop caps.
  - Pull quotes set huge in serif.
  - Full-bleed photos next to narrow text columns.
  - Rotated text running down the image edge.
  - Clean, sans-serif photo credit captions in small type.
  - Provide 3 article layout variants that writers can pick per story: `layout: "poster"` (giant photo-filled type), `layout: "spread"` (two-page magazine look), and `layout: "collage"` (scattered cutouts, letters and marker scribbles).

## Homepage: fun interactive animation that is still easy to navigate

Build a hero with these interactions. Use GSAP (with ScrollTrigger + Flip, now free) for all animation so the bookshelf, ring and scroll effects share one library. Keep total JS lean and load page-specific animation only on the pages that need it:

1. **Ornament draw-in.** On load, the hand-drawn header ornaments "draw" themselves using SVG stroke-dashoffset. On scroll they gently fade or drift apart.
2. **The Aera Bookshelf: the main hero interaction** (see my attached screen recording).
   - Below a big serif headline (e.g. "THE AERA ARCHIVE" or "THE PERSONAL CURATION" style), show a single row of **book spines standing on an invisible shelf**. Each book stands for an issue, a story or a section of the site.
   - **Spines:**
     - Each spine is a vertical rectangle with its own height, width and color, drawn from the Aera palette plus a few bold extras (pink, cherry red, cobalt, forest green, mustard, orange, charcoal, cream).
     - The title is printed **sideways** (`writing-mode: vertical-rl`), mixing fonts: chunky condensed sans, tiny mono and serif.
     - Some spines lean slightly against their neighbours. A few have a tiny red dot or sticker on top.
   - **Endless loop:**
     - The whole shelf scrolls slowly and continuously to the left in a seamless infinite loop, duplicating the set so there's never a gap.
     - Scrolling the page or dragging/swiping the shelf speeds it up or reverses it, with momentum easing.
   - **Featured book turns to face front:**
     - One book at a time rotates 90° on its Y axis, using CSS 3D transforms with `perspective` and `transform-style: preserve-3d`.
     - It shows its **front cover**: a real Aera cover image or a story's hero photo.
     - As it moves on, it rotates back into a spine and the next featured book turns.
     - On hover (desktop) or tap (mobile), any spine pulls out slightly (translateY up a few px), and its cover flips open to face you with a mono caption, e.g. `issue 03 — "soft armor" — fall 2026`.
     - Clicking a cover opens that issue or story.
   - **Data:** books are generated from `issues.json` / `stories`, so adding an issue automatically adds a book. Each entry needs: title, spine color, spine font, spine width/height, cover image and link.
   - **Mobile:** the shelf is shorter and swipeable, and tapping a spine turns it to its cover.
   - **Reduced motion:** books stand still and the featured cover is shown front-facing.
   - **Backdrop:** keep the shelf on the light paper background. The shelf can sit inside a slightly inset "page" panel with tiny mono corner labels (`aera` top-left, `about` top-right, `part i` centered), like the recording.
3. **Floating cutout strip** (secondary, used as the gallery teaser lower on the page). Small photo cutouts drift slowly sideways like a slow marquee.
   - On hover, a cutout lifts, tilts a few degrees and shows a credit caption.
   - Clicking a cutout opens the gallery.
4. **Cursor detail.** A small custom cursor such as a needle, a sparkle or a pink dot. It turns into a `view →` label over clickable items. Disable it on touch devices.
5. **Name hover.** The "Aera" wordmark subtly reacts on hover, e.g. letters wiggle or switch to a hand-drawn version.

**Navigation must stay obvious:**
- The tiny nav is always visible (sticky) and links to every section.
- Below the hero, show a clear "Latest stories" row with plain text titles, so nobody *has* to use the shelf to find content.
- On mobile, use a hamburger that opens a full-screen menu with large tap targets.
- Respect `prefers-reduced-motion`: turn off the shelf loop, card shuffle, ring spin, marquee and draw-in, and show static layouts instead.

## Pages / sections

1. **Home:** animated hero (above), latest issue feature, 3–6 latest stories, a gallery teaser, social links and a newsletter strip.
2. **About / Mission:**
   - Mission statement in large serif type.
   - Short history of the magazine.
   - Our values (e.g. sustainability, self-expression, inclusivity, student voice).
   - A hand-drawn divider between parts.
3. **Staff / Masthead:**
   - Grouped by role: Editors-in-Chief, Creative Directors, Photography, Styling, Writing, Design, Social Media, Faculty Advisor.
   - Each person gets a cutout portrait (B&W photo with a hover reveal: the photo switches to color or a fun alt photo), name, role, grade/class year, a 2–3 line bio, a "fave fit / style icon" fun fact and optional Instagram.
   - Use a "polaroids pinned to a board" feel with slight random rotation.
4. **Stories / News:**
   - Filterable index with tags such as `editorial`, `trend report`, `street style`, `interviews`, `school news`, `events`, `opinion`.
   - Each story card shows a thumbnail, mono date/tag, serif title and author.
   - **Article template:**
     - Big hero image and pull quotes.
     - Full-bleed photo spreads.
     - Image captions with photographer, model and stylist credits.
     - Author byline linking to their staff bio.
     - Estimated read time.
     - "Next story" link at the bottom.
5. **Photography Gallery: "The Ring"** (see screen recording 2).
   - **Intro: shuffling card stack.**
     - When the page opens, gallery images appear as a **stack of overlapping cards** in the center, at mixed sizes.
     - Photos are mixed with a few graphic "type cards": a giant letter "a" on black, a bold red word, a lime sticker, the Aera logo on cobalt.
     - Cards quickly shuffle and slide over each other, a new image landing on top every ~0.4s, like flipping through a lookbook.
   - **Then they fan out into a ring:**
     - The stack unfolds into a **3D ring/carousel** of cards in a circle.
     - Cards near the front are large and in full color. Cards toward the back are smaller and slightly faded.
     - The whole ring slowly rotates.
     - Animate from stack to ring with GSAP (Flip plugin or a timeline). Position cards on a circle with `rotateY` + `translateZ`, or with 2D sin/cos for an elliptical ring.
   - **Interaction:**
     - Drag or scroll to spin the ring.
     - Hover a card to bring it forward.
     - Click a card to open the lightbox with keyboard arrows, swipe and credits (photographer / model / stylist / MUA).
   - **Optional control panel (playful nod to the recording):** tiny mono sliders in the ring's empty center, labelled `sharp ↔ rounded` (corner radius), `small ↔ large` (card size) and `push ↔ linear` (spin easing). Visitors can play with how the ring looks.
   - Tiny mono corner labels on the frame: `aera` top-left, `the gallery — shoot 03` top-right, `motion` bottom-center.
   - **Also include a plain view:** a toggle `ring / grid` that switches to a simple masonry grid, filterable by shoot or issue. This is the accessible view; use it automatically on mobile and with `prefers-reduced-motion`.
   - Lazy-load the images.
6. **Social:**
   - Large playful links to Instagram **[@aerafashionmagazine](https://www.instagram.com/aerafashionmagazine/)** (our only social account for now — no TikTok or Pinterest).
   - Optionally embed a grid of recent posts (static placeholders for now).
7. **Footer:**
   - Tiny mono text: school name, "Aera Magazine — a student publication of Palo Alto High School", contact email, @aerafashionmagazine, social icons, newsletter signup and copyright.

## Extra sections recommended for a school publication

- **Issues / Archive:** a full-page version of the bookshelf with every past issue as a spine, sorted by year. Clicking a book opens the issue as a flipbook (PDF or embedded Issuu).
- **Get Involved / Join Us:**
  - No application deadline — Aera is also a school club, so students can join anytime. List the roles we welcome and when/where the club meets.
  - Meeting times and room number.
  - Link to a Google Form application.
  - Model/photographer call-outs.
- **Submissions:** a form, or a link to one, for readers to submit art, outfit photos or story pitches, with clear guidelines.
- **Events:** launch parties, fashion shows, thrift swaps and photo days, with date, location and RSVP link.
- **Street Style / "Fit Check":** a recurring photo series of students' outfits around campus, which is great for engagement.
- **Contact:** email, advisor contact and a simple form.
- **Policies page:**
  - Editorial policy.
  - Photo consent and model release note (important for minors).
  - Corrections policy.
  - Accessibility statement.
- **Support / Sponsors (optional):** local business sponsors and ad rates, or a donate link if the school allows it.

## Technical requirements

- **Stack:** [choose one]
  - **(a)** Plain HTML/CSS/JS. Simplest; host free on GitHub Pages or Netlify.
  - **(b)** Astro + Markdown content collections. Recommended: staff can add stories by writing a `.md` file.
- Keep all content in editable data files (`/content/stories/*.md`, `staff.json`, `gallery.json`, `issues.json`) so non-coders on staff can update the site without touching layout code.
- Use placeholder images and lorem text where real content is missing, with clear `TODO` comments.
- **Responsive:** test at 375px, 768px, 1280px and 1920px. The cutout strip becomes swipeable on mobile.
- **Accessibility:**
  - Semantic HTML.
  - Alt text fields for every image.
  - Visible focus states.
  - AA color contrast for body text. The pale pink accent is for decoration only, not small body text.
  - Every animation can be paused.
- **Performance:**
  - Images in WebP/AVIF with `srcset`.
  - Lazy-loading.
  - Fonts via Google Fonts with `display=swap`.
  - Lighthouse score of 90+ in every category.
- **SEO/sharing:** page titles, meta descriptions, Open Graph images per story and a favicon made from the ornament.
- Include a README explaining how to run it locally, how to add a story, staff member or gallery shoot, and how to deploy.

## Deliverable

Build the full site with the file structure, all pages and sample content (6 stories, 10 staff members, 20 gallery images, 3 past issues). Then explain how to run it and where to edit each section.
