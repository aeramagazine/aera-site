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

  issues: [
    { id: 'issue-06', no: '06', title: 'soft armor',    season: 'fall 2026',   color: '#F2A7C3', ink: '#0B0B0B', img: IMG('i6', 520, 720), current: true,
      blurb: 'On dressing like protection: padded shoulders, knitwear, and the comfort of a good coat.' },
    { id: 'issue-05', no: '05', title: 'internal riot', season: 'spring 2026', color: '#E0218A', ink: '#FFFFFF', img: IMG('i5', 520, 720),
      blurb: 'Loud colour, louder opinions. Our most rebellious issue yet.' },
    { id: 'issue-04', no: '04', title: 'blue hour',     season: 'winter 2025', color: '#2433E8', ink: '#FFFFFF', img: IMG('i4', 520, 720),
      blurb: 'Shot entirely between 4 and 5pm in December light.' },
    { id: 'issue-03', no: '03', title: 'thrift theory', season: 'fall 2025',   color: '#E7A71C', ink: '#0B0B0B', img: IMG('i3', 520, 720),
      blurb: 'Every look in this issue cost under $20.' },
    { id: 'issue-02', no: '02', title: 'uniform',       season: 'spring 2025', color: '#2A2A2A', ink: '#F4F1EA', img: IMG('i2', 520, 720, true),
      blurb: 'Fifty ways to wear the same thing.' },
    { id: 'issue-01', no: '01', title: 'first light',   season: 'fall 2024',   color: '#EDE6D6', ink: '#0B0B0B', img: IMG('i1', 520, 720),
      blurb: 'Where it all started. Our debut issue.' }
  ],

  stories: [
    { id: 'express-yourself-fully', title: 'Express Yourself Fully', poster: ['EXPRESS', 'YOURSELF', 'FULLY'],
      dek: 'Six students, six rooms, one rule: wear exactly what you want.', tag: 'editorial', author: 'mira',
      date: 'Oct 02, 2026', read: 6, layout: 'poster', color: '#2433E8', img: IMG('s1', 1400, 1000), issue: '06',
      quote: 'I stopped dressing for the hallway and started dressing for me.',
      // ↓ EXAMPLE of a story with its own text + credits. Copy this pattern for real articles.
      body: [
        'We asked six Paly students one question: if nobody was watching, what would you wear to school tomorrow? Then we asked them to actually wear it.',
        'The results ranged from a hand-painted denim jacket to a full suit borrowed from a grandfather’s closet. Every outfit came with a story.',
        '“I used to plan my outfits around what wouldn’t get noticed,” one senior told us. “This semester I flipped it.”',
        'Placeholder: replace these paragraphs with the real article. Each line in quotes is one paragraph — add as many as you need.'
      ],
      credits: { photography: 'Theo Lindqvist', styling: 'Wren Callahan', models: 'Sasha P., Jordan L.', mua: 'Ines R.' } },
    { id: 'fit-check-hallway', title: 'Fit Check: Hallway Edition', poster: ['FIT', 'CHECK'],
      dek: 'Our photographers spent a week stopping people between classes.', tag: 'street style', author: 'theo',
      date: 'Sep 26, 2026', read: 3, layout: 'collage', color: '#F4E21A', img: IMG('s2', 1400, 1000), issue: '06',
      quote: 'Best accessory? My grandma’s brooch. Every day.' },
    { id: 'thrift-swap-report', title: 'The Great Thrift Swap', poster: ['THE GREAT', 'THRIFT SWAP'],
      dek: '412 items in, 389 items out. A report from the gym floor.', tag: 'school news', author: 'eli',
      date: 'Sep 19, 2026', read: 4, layout: 'spread', color: '#E5231B', img: IMG('s3', 1400, 1000), issue: '06',
      quote: 'Someone left in a full vintage suit. We are still not over it.' },
    { id: 'y2k-is-not-over', title: 'Is Y2K Over? (No.)', poster: ['INTERNAL', 'RIOT', 'FAILURE'],
      dek: 'A trend report on low-rise denim, butterfly clips and our refusal to move on.', tag: 'trend report', author: 'priya',
      date: 'Sep 12, 2026', read: 5, layout: 'poster', color: '#E0218A', img: IMG('s4', 1400, 1000), issue: '05',
      quote: 'Trends don’t die at our school. They just get a little more personal.' },
    { id: 'art-room-interview', title: 'Ten Minutes in the Art Room', poster: ['THE ART', 'ROOM'],
      dek: 'In conversation with the teacher who keeps a rack of costumes behind the kiln.', tag: 'interviews', author: 'june',
      date: 'Sep 05, 2026', read: 7, layout: 'spread', color: '#1F6B3A', img: IMG('s5', 1400, 1000), issue: '05',
      quote: 'Getting dressed is the first creative decision you make every day.' },
    { id: 'soft-armor-bts', title: 'Soft Armor: Behind the Shoot', poster: ['SOFT', 'ARMOR'],
      dek: 'Padded coats, borrowed knits and a very cold Saturday on the football field.', tag: 'editorial', author: 'ava',
      date: 'Aug 29, 2026', read: 5, layout: 'collage', color: '#F2A7C3', img: IMG('s6', 1400, 1000), issue: '06',
      quote: 'We wanted it to feel like a hug you could wear.' },
    { id: 'issue-06-launch', title: 'Launch Party: Issue 06', poster: ['LAUNCH', 'NIGHT'],
      dek: 'Zines, a DJ from the senior class and a runway down the library aisle.', tag: 'events', author: 'noor',
      date: 'Aug 22, 2026', read: 2, layout: 'spread', color: '#6E1E2B', img: IMG('s7', 1400, 1000), issue: '06',
      quote: 'Best night of the semester, and it was in the library.' },
    { id: 'dress-up-tuesday', title: 'In Defense of Dressing Up on a Tuesday', poster: ['JE T’AIME', 'JE T’AIME', 'JE T’AIME'],
      dek: 'An opinion: there is no such thing as overdressed for algebra.', tag: 'opinion', author: 'sol',
      date: 'Aug 15, 2026', read: 3, layout: 'poster', color: '#0B0B0B', img: IMG('s8', 1400, 1000), issue: '06',
      quote: 'Overdressed is just a word people use when they’re jealous.' }
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
    { date: 'Dec 12', title: 'Issue 07 Launch Party', where: 'Library · 6pm', note: 'Zines, music, a tiny runway. RSVP below.' }
  ]
};
