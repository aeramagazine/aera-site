/* ------------------------------------------------------------------
   AERA MAGAZINE — site content
   Edit this file to add issues, stories, staff and gallery photos.
   All images are placeholders (picsum.photos) — TODO: swap for real
   photos in /assets/img/ and update the paths.
------------------------------------------------------------------- */

const IMG = (seed, w = 600, h = 800, gray = false) =>
  `https://picsum.photos/seed/aera-${seed}/${w}/${h}${gray ? '?grayscale' : ''}`;

const BODY = [
  'TODO: replace with the real story. Placeholder copy — this paragraph sits where the opening of the piece goes, setting the scene: the hallway at 7:48am, the click of platform boots on linoleum, the quiet confidence of someone who planned this outfit last night.',
  'Fashion at school is a strange, wonderful thing. It happens under fluorescent lights, between bells, within dress codes and budgets — and still, every single day, people find a way to say something with what they wear.',
  'We spent three weeks talking to students, photographing fits and digging through thrift bins to understand where this season’s looks are coming from. The answer, mostly: each other.',
  'What we found was less a trend and more a feeling — a collective decision to take up a little more space. Layers, colour, texture, the borrowed blazer, the hand-stitched patch. Small rebellions, worn proudly.',
  'This is that story. Read it, then go get dressed.'
];

window.AERA = {
  name: 'Aera Magazine',
  school: 'Palo Alto High School',
  email: 'aerafashionmagazine@gmail.com',
  instagram: 'https://www.instagram.com/aerafashionmagazine/',
  handle: '@aerafashionmagazine',

  // Home-page Instagram grid: your 6 latest posts.
  // Save each post's image into assets/img/instagram/ and paste the post's link.
  // (On Instagram: open the post → ··· → Copy link.)  Leave empty to show placeholders.
  instagramPosts: [
    // { img: 'assets/img/instagram/post-1.jpg', url: 'https://www.instagram.com/p/XXXXXXXX/' },
  ],

  // Magazine cut-outs scattered around the big AERA on the home page (visitors can drag them).
  // Use PNGs with a see-through background (on iPhone: long-press the subject in a photo → Copy/Share).
  // Put them in assets/img/cutouts/. Leave empty to show the drawn stand-ins.
  cutouts: [
    // { img: 'assets/img/cutouts/eye.png', outline: '#7F1239' },
  ],

  // Newest issue first. Only one should have current: true.
  // While an issue has no cover photo yet (img: ''), it shows a "coming soon" cover.
  issues: [
    { id: 'issue-01', no: '01', title: 'coming soon', season: 'in the works', color: '#7F1239', ink: '#FFFFFF', img: '', current: true,
      blurb: 'Our first issue is in the works: stories on fashion & culture, fashion & politics and fashion & environment.' }
  ],

  // Articles, newest first. While this list is empty the site shows "stories coming soon".
  // To add one, copy the EXAMPLE below, remove the // at the start of each line, and fill it in.
  // Desks: 'fashion & culture', 'fashion & politics', 'fashion & environment'
  stories: [
    // { id: 'my-first-story', title: 'My First Story', poster: ['MY FIRST', 'STORY'],
    //   dek: 'One sentence that sums up the story.', tag: 'fashion & culture', author: 'mira',
    //   date: 'Dec 01, 2026', read: 4, layout: 'spread', color: '#7F1239', issue: '01',
    //   img: 'assets/img/stories/my-first-story.jpg', photo2: 'assets/img/stories/my-first-story-2.jpg',
    //   quote: 'A line from the story worth making huge.',
    //   body: [
    //     'First paragraph.',
    //     'Second paragraph.'
    //   ],
    //   credits: { photography: 'Name', styling: 'Name', models: 'Name', mua: 'Name' } },
  ],
  body: BODY,

  // Staff page sections appear in this order. `group` decides the section,
  // `role` is the title shown on the polaroid. TODO: replace placeholder people.
  staff: [
    // To add a photo, bio etc. fill in the empty fields, e.g.
    //   img: 'assets/img/staff/lily.jpg', year: 'Class of 2027', bio: 'One or two sentences.', fave: 'Favourite piece or style icon', ig: '@handle'
    // Cards without a photo show the person's initials.

    // ── Editors-in-Chief ──
    { id: 'lily',     name: 'Lily Chen',          role: 'Editor-in-Chief', group: 'Editors-in-Chief', year: '', img: '', bio: '', fave: '', ig: '' },
    { id: 'cecilia',  name: 'Cecilia Cassago',    role: 'Editor-in-Chief', group: 'Editors-in-Chief', year: '', img: '', bio: '', fave: '', ig: '' },
    { id: 'noor',     name: 'Noor Khan',          role: 'Editor-in-Chief', group: 'Editors-in-Chief', year: '', img: '', bio: '', fave: '', ig: '' },

    // ── Desk Heads ──
    { id: 'kalea',    name: 'Kalea Chen',         role: 'Desk Head, Culture',     group: 'Desk Heads', year: '', img: '', bio: '', fave: '', ig: '' },
    { id: 'lenox',    name: 'Lenox Hancock',      role: 'Desk Head, Politics',    group: 'Desk Heads', year: '', img: '', bio: '', fave: '', ig: '' },
    { id: 'zara',     name: 'Zara Bellubi',       role: 'Desk Head, Environment', group: 'Desk Heads', year: '', img: '', bio: '', fave: '', ig: '' },

    // ── Media Managers ──
    { id: 'harlow',   name: 'Harlow B',           role: 'Media Manager', group: 'Media Managers', year: '', img: '', bio: '', fave: '', ig: '' },
    { id: 'violet',   name: 'Violet Caspari',     role: 'Media Manager', group: 'Media Managers', year: '', img: '', bio: '', fave: '', ig: '' },

    // ── Website Managers ──
    { id: 'kimberly', name: 'Kimberly Li',        role: 'Website Manager', group: 'Website Managers', year: '', img: '', bio: '', fave: '', ig: '' },
    { id: 'ruhi',     name: 'Ruhi Karamchandani', role: 'Website Manager', group: 'Website Managers', year: '', img: '', bio: '', fave: '', ig: '' }
  ],

  // Gallery sections: each `shoot` name becomes a tab + coloured card in the ring.
  gallery: [
    ['g1', 600, 800, 'in the magazine'], ['g2', 800, 600, 'in the magazine'], ['g3', 600, 600, 'in the magazine'], ['g4', 600, 900, 'fit checks'],
    ['g5', 600, 800, 'fit checks'], ['g6', 800, 600, 'in the magazine'], ['g7', 600, 750, 'fit checks'], ['g8', 600, 600, 'in the magazine'],
    ['g9', 600, 850, 'fit checks'], ['g10', 800, 600, 'fit checks'], ['g11', 600, 800, 'in the magazine'], ['g12', 600, 600, 'fit checks'],
    ['g13', 600, 800, 'in the magazine'], ['g14', 700, 600, 'fit checks'], ['g15', 600, 900, 'in the magazine'], ['g16', 600, 700, 'fit checks'],
    ['g17', 600, 800, 'in the magazine'], ['g18', 800, 600, 'fit checks']
  ].map(([seed, w, h, shoot], i) => ({
    id: seed, src: IMG(seed, w, h), w, h, shoot,
    // placeholder photos: replace with real shoots and credits
    photographer: 'Aera staff', model: '', stylist: '', mua: ''
  })),

  events: [
    { date: 'Oct 24', title: 'Fit Check Photo Day', where: 'Main quad · lunch', note: 'Wear your best. We’ll be shooting all period.' },
    { date: 'Nov 07', title: 'Winter Thrift Swap', where: 'Gym · 3:30pm', note: 'Bring up to 5 items, take up to 5 items.' },
    { date: 'Dec 12', title: 'Issue 01 Launch Party', where: 'Library · 6pm', note: 'Zines, music, a tiny runway. RSVP below.' }
  ]
};
