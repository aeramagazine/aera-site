# How to edit the Aera Magazine website

You don't need to know how to code. Almost everything on the site (articles, staff, issues, photos, events) comes from **one file**:

```
assets/js/data.js
```

The pages read that file and build themselves. If you add a story there, it automatically shows up in the stories page, in the home page "latest stories" list and as a new book on the bookshelf.

---

## The folder at a glance

```
aera-site/
├── index.html          ← home page (bookshelf, explore tiles, latest stories)
├── about.html          ← mission, values, our story
├── stories.html        ← list of all articles (filters by tag)
├── story.html          ← the article page (one template for every story)
├── gallery.html        ← "the ring" photo gallery
├── staff.html          ← staff polaroids
├── archive.html        ← every issue
├── join.html           ← join the club, submissions, events, contact, policies
├── HOW-TO-EDIT.md      ← this guide
└── assets/
    ├── js/data.js      ← ★ ALL THE CONTENT LIVES HERE ★
    ├── css/style.css   ← colours, fonts, layout
    └── img/            ← put your real photos here
        ├── stories/
        ├── staff/
        ├── gallery/
        └── issues/
```

**Editing tools:** any plain text editor works. [VS Code](https://code.visualstudio.com) is free and highlights mistakes. You can also edit online on GitHub (see "Putting it online" below). Don't use Word or Google Docs: they add hidden formatting that breaks the file.

---

## Golden rules for editing `data.js`

1. **Copy an existing entry and change the words.** Never start from scratch.
2. Text goes **inside quotes**: `'like this'`.
3. Each entry ends with `},` (curly bracket + comma). If you add an entry, check the comma.
4. **Apostrophes:** use the curly one `’` inside text (`'Paly’s best fits'`), or the page will break. If you must type a straight `'`, write it as `\'`.
5. After saving, **refresh the page**. If it goes blank, you probably missed a quote or comma near the last thing you edited. Undo (Cmd+Z) and try again.

---

## Add a new article

1. **Add the photos.** Drop them into `assets/img/stories/`. Use simple names with no spaces, like `fall-fits-hero.jpg`. Landscape photos about 1600px wide work best.
2. **Open `assets/js/data.js`** and find the `stories: [` list.
3. **Copy the EXAMPLE story** (the lines starting with `//` inside `stories: [`), paste it at the **top** of the list, and delete the `//` at the start of each line. The top story is the newest one, so it shows first. While the list is empty, the site shows "stories coming soon" automatically.
4. **Change the fields:**

| Field | What it is | Example |
|---|---|---|
| `id` | Short web address name. Lowercase, dashes, no spaces. Must be unique. | `'fall-fits-2026'` |
| `title` | Headline | `'Fall Fits at Paly'` |
| `poster` | The giant words in the hero. One line per item, short and CAPS. | `['FALL', 'FITS']` |
| `dek` | One-sentence summary under the headline | `'What everyone wore in week one.'` |
| `tag` | Which desk it belongs to (used by the filter buttons): `'fashion & culture'`, `'fashion & politics'` or `'fashion & environment'` | `'fashion & culture'` |
| `author` | The writer's staff `id` (from the staff list) | `'priya'` |
| `date` | Date shown on the story | `'Oct 20, 2026'` |
| `read` | Minutes to read | `4` |
| `layout` | Which design: `'poster'` (giant photo letters), `'spread'` (magazine spread with a big letter), `'collage'` (pop-art grid + scattered letters) | `'spread'` |
| `color` | The story's colour (hex code) | `'#2433E8'` |
| `img` | Main photo | `'assets/img/stories/fall-fits-hero.jpg'` |
| `photo2` | *(optional)* Second, full-width photo | `'assets/img/stories/fall-fits-2.jpg'` |
| `issue` | Which print issue it belongs to | `'06'` |
| `quote` | The big pull quote | `'Wear the thing.'` |
| `body` | The article: one `'…'` per paragraph, separated by commas | see below |
| `credits` | Photo credits | see below |

The body and credits look like this:

```js
body: [
  'First paragraph of the article.',
  'Second paragraph.',
  '“A quote from someone,” they said.'
],
credits: { photography: 'Theo Lindqvist', styling: 'Wren Callahan', models: 'Sasha P.', mua: 'Ines R.' }
```

5. **Save and refresh.** The story now appears on the Stories page, on the home page and as a book on the shelf. Its address is `story.html?id=fall-fits-2026`.

**Tip:** writers can draft in Google Docs. Then one editor pastes the final paragraphs into `body`, one paragraph per `'…'`.

---

## Add or change a staff member

In `data.js`, find `staff: [`. Copy one person and change it:

```js
{ id: 'maya', name: 'Maya Chen', role: 'Photographer', group: 'Staff Members', year: 'Class of 2028',
  fave: 'Silver rings, always', ig: '@maya.shoots',
  img: 'assets/img/staff/maya-bw.jpg', alt: 'assets/img/staff/maya-color.jpg',
  bio: 'Two or three short sentences about them.' },
```

- `img` is the black-and-white portrait and `alt` is the photo that shows on hover (colour or a silly one). Portrait shape (4:5) works best.
- `group` decides which section of the staff page they appear in. Use exactly one of:
  - `'Editors-in-Chief'`
  - `'Desk Heads'`. Put the desk in their `role`, e.g. `'Desk Head — Politics & Fashion'`, `'Desk Head — Environmental & Fashion'` or `'Desk Head — Culture & Fashion'`.
  - `'Managers'`. Role is `'Media Manager'`, `'Website Manager'` or `'Design Manager'`.
  - `'Staff Members'`. Role is `'Writer'`, `'Photographer'`, `'Model'`, or a combination like `'Model & Writer'`.
- Sections show up in the order they first appear in the list, so keep people grouped together.
- Leave `ig: ''` empty if they don't want their Instagram shown.
- **Removing someone:** delete their whole `{ … },` entry. If they wrote stories, change those stories' `author` first.

---

## Add a new issue

In `data.js`, find `issues: [`. Add the newest at the **top**:

```js
{ id: 'issue-07', no: '07', title: 'your theme', season: 'spring 2027', color: '#700745', ink: '#FFFFFF',
  img: 'assets/img/issues/issue-07-cover.jpg', current: true,
  blurb: 'One line about the issue.' },
```

- `color` is the spine colour on the bookshelf. `ink` is the spine text colour: use white `'#FFFFFF'` on dark colours and black `'#0B0B0B'` on light ones.
- Only **one** issue should have `current: true`. Remove it from the old one.
- Also update the line `issue 06 — “soft armor” — out now` in `index.html`.

---

## Add photos to the gallery

1. Put photos in `assets/img/gallery/`.
2. In `data.js`, the gallery list currently uses placeholder photos. Replace it with your own list, one line per photo:

```js
gallery: [
  { src: 'assets/img/gallery/issue-01-cover-shoot.jpg', w: 600, h: 800, shoot: 'in the magazine',
    photographer: 'Theo Lindqvist', model: 'Sasha P.', stylist: 'Wren Callahan', mua: 'Ines R.' },
  { src: 'assets/img/gallery/fit-check-quad.jpg', w: 800, h: 600, shoot: 'fit checks',
    photographer: 'Ava Nakamura', model: 'Jordan L.', stylist: 'Wren Callahan', mua: 'Dani M.' },
],
```

- `w` and `h` only need the **shape**: `600, 800` = tall, `800, 600` = wide, `600, 600` = square.
- `shoot` names become the sections of the gallery ring. Each shoot gets a tab at the top and a coloured card in the ring that visitors click to enter that shoot. To pick a shoot's colour, edit `COLORS` near the top of `startRing()` in `assets/js/ring.js`.
- About 15–25 photos looks best in the ring.

---

## Update the Instagram grid (home page)

The six squares in the home page's Instagram section can show your real posts:

1. On Instagram, save the image from each of your 6 latest posts. Put the files in `assets/img/instagram/`, named `post-1.jpg` … `post-6.jpg`.
2. For each post, tap **··· → Copy link**.
3. In `data.js`, find `instagramPosts: [` and add one line per post:

```js
instagramPosts: [
  { img: 'assets/img/instagram/post-1.jpg', url: 'https://www.instagram.com/p/ABC123/' },
  { img: 'assets/img/instagram/post-2.jpg', url: 'https://www.instagram.com/p/DEF456/' },
],
```

Clicking a square opens that post on Instagram. If the list is empty, gallery photos are shown instead. Update it whenever you want the grid to feel fresh, e.g. every new issue.

---

## Events, Join page, About page

- **Events:** `events: [` in `data.js`. Copy one event and edit it.
- **Club meeting time and room:** currently Thursdays at lunch in Room 310. To change them, edit `join.html` and the "come find us" section of `about.html`.
- **Sign-up link:** in `join.html`, find `sign up to join ↗` and replace the `href="#"` just before it with your Google Form link.
- **Contact email:** currently aerafashionmagazine@gmail.com. To change it, edit `email:` in `data.js` and search for the address in `join.html`.
- **Section textures on the About page** (the woven, tiger velvet and mosaic images) are drawn by code. To use a real photo instead, for example one your photographers took of fabric or tiles, put it in `assets/img/` and add `data-src` to that `<canvas>` in `about.html`:
  `<canvas class="texture" data-texture="tiger" data-src="assets/img/velvet.jpg" aria-hidden="true"></canvas>`
- **About text and mission:** open `about.html` and edit the sentences directly. The sections are marked with comments like `<!-- OUR MISSION -->`. Text between `<p>` and `</p>` is a paragraph.

---

## Change colours or fonts

Open `assets/css/style.css`. At the very top is a list like:

```css
--pink: #E7D3DF;   /* light plum tint */
--magenta: #700745;   /* the purple accent */
--cobalt: #2433E8;
```

Change a hex code there and it changes everywhere on the site.

**Fonts:** our brand font **Onyx** (`assets/fonts/OPTIOnyx.otf`, the `--f-brand` line) is used **only for the word AERA**: the logo, the big AERA on the home page, cover mastheads and the footer. To show "Aera" in Onyx inside a title, wrap it like `<span class="aera-word">Aera</span>`. **Article titles use Anton** (`--f-cond`) and **body paragraphs use EB Garamond** (`--f-serif`): the team chose these. Accent words in titles (`<em>…</em>`) show in the purple Pinyon Script, the "Join us" font. Other big titles and headings use `--f-title` (Bodoni Moda for now). Change that one line to switch every title font at once. To pick colours, search "color picker" on Google and copy the `#hex` code.

---

## Preview on your computer

Open Terminal and run these two lines:

```bash
cd ~/Desktop/aera-site
```

```bash
python3 -m http.server 5173
```

Then open **http://localhost:5173** in your browser. Refresh after every edit. Press Ctrl+C in Terminal to stop.

(Double-clicking `index.html` mostly works too, but some features need the preview server.)

---

## Putting it online (free)

**Easiest, to share a link today:** go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag the whole `aera-site` folder onto the page. You get a link instantly. To update, drag the folder again.

**Best for a team:** put the folder on **GitHub** and turn on **GitHub Pages** (or connect it to Netlify).
- Staff can then edit `data.js` right in the browser on github.com: open the file, click the ✏️ pencil, edit, then "Commit changes".
- To upload photos: open the folder → **Add file → Upload files**.
- The site updates itself a minute later, and every change is saved in history, so mistakes can be undone.
- Check with your advisor whether Paly has rules about student sites, and whether you'd like a custom address like `aeramagazine.com`.

---

## Before going live, replace the placeholders

- [ ] Placeholder photos (they come from `picsum.photos`) → your real photos
- [ ] Made-up staff names and bios → the real staff
- [ ] Sample stories → real articles (delete the samples)
- [ ] Sign-up Google Form link (`join.html`)
- [ ] Photo consent: make sure everyone pictured, especially under-18s, has agreed to be published
