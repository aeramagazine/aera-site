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

  // Newest issue first. Only one should have current: true.
  // While an issue has no cover photo yet (img: ''), it shows a "coming soon" cover.
  issues: [
    { id: 'issue-01', no: '01', title: 'coming soon', season: 'in the works', color: '#700745', ink: '#FFFFFF', img: '', current: true,
      blurb: 'Our first issue is in the works: stories on fashion & culture, fashion & politics and fashion & environment.' }
  ],

  // Articles, newest first. While this list is empty the site shows "stories coming soon".
  // To add one, copy the EXAMPLE below, remove the // at the start of each line, and fill it in.
  // Desks: 'fashion & culture', 'fashion & politics', 'fashion & environment'
  stories: [
    // { id: 'my-first-story', title: 'My First Story', poster: ['MY FIRST', 'STORY'],
    //   dek: 'One sentence that sums up the story.', tag: 'fashion & culture', author: 'mira',
    //   date: 'Dec 01, 2026', read: 4, layout: 'spread', color: '#700745', issue: '01',
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
    // ── Editors-in-Chief (3) ──
    { id: 'mira',  name: 'Mira Castellanos', role: 'Editor-in-Chief', group: 'Editors-in-Chief', year: 'Class of 2027', fave: 'A thrifted leather trench, always', ig: '@mira.c', img: IMG('p1', 400, 500, true), alt: IMG('p1c', 400, 500),
      bio: 'Runs the editorial calendar and the group chat. Believes every outfit is an argument.' },
    { id: 'june',  name: 'June Okafor',      role: 'Editor-in-Chief', group: 'Editors-in-Chief', year: 'Class of 2027', fave: 'Style icon: her mom in the 90s', ig: '@june.ok', img: IMG('p2', 400, 500, true), alt: IMG('p2c', 400, 500),
      bio: 'Writes the interviews, edits everything else. Owns more tote bags than shoes.' },
    { id: 'kai',   name: 'Kai Moreau',       role: 'Editor-in-Chief', group: 'Editors-in-Chief', year: 'Class of 2027', fave: 'Anything in cobalt blue', ig: '@kai.moreau', img: IMG('p3', 400, 500, true), alt: IMG('p3c', 400, 500),
      bio: 'Sets the creative direction for every issue. Responsible for the bookshelf on the homepage.' },

    // ── Desk Heads (one per section) ──
    { id: 'priya', name: 'Priya Desai',      role: 'Desk Head — Politics & Fashion',      group: 'Desk Heads', year: 'Class of 2028', fave: 'Style icon: Björk', ig: '@priya.writes', img: IMG('p7', 400, 500, true), alt: IMG('p7c', 400, 500),
      bio: 'Covers how clothes, power and protest collide. Has strong opinions about dress codes.' },
    { id: 'sol',   name: 'Sol Ramírez',      role: 'Desk Head — Environmental & Fashion', group: 'Desk Heads', year: 'Class of 2028', fave: 'Loafers with everything', ig: '@sol.r', img: IMG('p8', 400, 500, true), alt: IMG('p8c', 400, 500),
      bio: 'Leads our sustainability coverage — thrift, mending, and where our clothes really come from.' },
    { id: 'wren',  name: 'Wren Callahan',    role: 'Desk Head — Culture & Fashion',       group: 'Desk Heads', year: 'Class of 2027', fave: 'Vintage Levi’s, men’s blazers', ig: '@wren.styles', img: IMG('p6', 400, 500, true), alt: IMG('p6c', 400, 500),
      bio: 'Music, film, art and the people on campus who dress like they mean it.' },

    // ── Managers ──
    { id: 'noor',  name: 'Noor Haddad',      role: 'Media Manager',   group: 'Managers', year: 'Class of 2029', fave: 'Silver jewelry, stacked', ig: '@noor.hd', img: IMG('p10', 400, 500, true), alt: IMG('p10c', 400, 500),
      bio: 'Runs @aerafashionmagazine. Has filmed 200+ fit-check reels.' },
    { id: 'leo',   name: 'Leo Park',         role: 'Website Manager', group: 'Managers', year: 'Class of 2028', fave: 'Monochrome everything', ig: '@leo.park', img: IMG('p12', 400, 500, true), alt: IMG('p12c', 400, 500),
      bio: 'Keeps this website running and posts every new story online.' },
    { id: 'eli',   name: 'Eli Brennan',      role: 'Design Manager',  group: 'Managers', year: 'Class of 2028', fave: 'A really good scarf', ig: '@eli.designs', img: IMG('p9', 400, 500, true), alt: IMG('p9c', 400, 500),
      bio: 'Lays out the print issue and draws the scribbles you see all over this site.' },

    // ── Staff Members (writers / models / photographers) ──
    { id: 'theo',  name: 'Theo Lindqvist',   role: 'Photographer', group: 'Staff Members', year: 'Class of 2028', fave: 'Film cameras & cargo pants', ig: '@theo.shoots', img: IMG('p4', 400, 500, true), alt: IMG('p4c', 400, 500),
      bio: 'Shoots on a camera older than the school. Leads the Fit Check series.' },
    { id: 'ava',   name: 'Ava Nakamura',     role: 'Photographer', group: 'Staff Members', year: 'Class of 2028', fave: 'Hair clips, the more the better', ig: '@ava.nkmr', img: IMG('p5', 400, 500, true), alt: IMG('p5c', 400, 500),
      bio: 'Golden-hour devotee. Will absolutely make you lie down in a field for the shot.' },
    { id: 'rosa',  name: 'Rosa Medina',      role: 'Writer',       group: 'Staff Members', year: 'Class of 2029', fave: 'Big earrings, bigger coats', ig: '@rosa.m', img: IMG('p13', 400, 500, true), alt: IMG('p13c', 400, 500),
      bio: 'Writes for all three desks. Always has a notebook and a pitch.' },
    { id: 'jules', name: 'Jules Ito',        role: 'Model & Writer', group: 'Staff Members', year: 'Class of 2029', fave: 'Platform boots in every colour', ig: '@jules.ito', img: IMG('p11', 400, 500, true), alt: IMG('p11c', 400, 500),
      bio: 'Has walked in every Aera shoot so far. Writes our Fit Check captions.' }
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
    photographer: ['Theo Lindqvist', 'Ava Nakamura'][i % 2],
    model: ['Sasha P.', 'Jordan L.', 'Remy T.', 'Imani K.', 'Lou B.'][i % 5],
    stylist: 'Wren Callahan', mua: ['Ines R.', 'Dani M.'][i % 2]
  })),

  events: [
    { date: 'Oct 24', title: 'Fit Check Photo Day', where: 'Main quad · lunch', note: 'Wear your best. We’ll be shooting all period.' },
    { date: 'Nov 07', title: 'Winter Thrift Swap', where: 'Gym · 3:30pm', note: 'Bring up to 5 items, take up to 5 items.' },
    { date: 'Dec 12', title: 'Issue 01 Launch Party', where: 'Library · 6pm', note: 'Zines, music, a tiny runway. RSVP below.' }
  ]
};
