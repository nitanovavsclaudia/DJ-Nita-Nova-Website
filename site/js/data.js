/* Daten fuer Line-ups, Playlists, Artists und Videos.
   Aus dem Design-Board "C Editorial" 1:1 uebernommen (Texte nicht veraendern, ausser bewusst).
   Pflege: Bios der Artists, Playlist-Tracks, Video-IDs hier eintragen. */
window.NN = window.NN || {};

/* Playlists (Spotify-ID, Titel, Untertitel) */
NN.lists = [
    { title: 'Chart Swagger', sub: 'Shake it Off with Katie, Drake and Taylor', id: '49PxHBIXauWQGNE0PWW326' },
    { title: 'Peak Disco Classics', sub: 'Sparkle & Shine', id: '7efELFMDb1sqQNC7VJXpwH' },
    { title: 'Peak 2000er HipHop', sub: '', id: '6yod9K1KQIuHQOtQims443' },
    { title: "Gatsby's got Vibes", sub: '20s meets Elektro', id: '0tW2TfSY81v8bJGdDmunS3' },
    { title: 'Peak Dance & House Classics', sub: 'Rhythm is a..?', id: '7EDw0hRR2wA72ukUa9xIyr' },
    { title: 'Rooftop House', sub: "Drinks'n Chats for first shoulder shimmeys", id: '0EQNx1CY4MeX3u9EirPbNl' }
  ];

/* Lokale Playlist-Cover: erscheinen automatisch, sobald img/covers/<playlist-id>.webp existiert
   (siehe README). Ursprung der alten Spotify-Cover-URLs, nur zur Referenz fuer tools/fetch_remote.sh:
NN.plCoversRemote = { '49PxHBIXauWQGNE0PWW326': 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da84b05593e0a5bbda2249375c79', '7efELFMDb1sqQNC7VJXpwH': 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da8466cd78fc85a59f9cb4cb3a83', '6yod9K1KQIuHQOtQims443': 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da8449008b6540872d2dad2f267e', '0tW2TfSY81v8bJGdDmunS3': 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da844728d284ec4efa171d635745', '7EDw0hRR2wA72ukUa9xIyr': 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da8460f6266ec03bee6075193070', '0EQNx1CY4MeX3u9EirPbNl': 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da84c9787b718d51ffb1b03646e2' };
*/

/* Hoerproben: [Titel, Artist, Spotify-Preview-Hash] pro Playlist-ID */
NN.plData = {"49PxHBIXauWQGNE0PWW326": [["APT.", "ROSÉ, Bruno Mars", "a058efb74316a0cabc02c348e81baee58b035995"], ["Shut Up and Dance", "WALK THE MOON", "33669c72b5331f40936eafe0b86a5a7f595faf14"], ["Paint The Town Red", "Doja Cat", "5abac156f155bb3b1e40c74616079010eab36fad"], ["Katchi", "Ofenbach, Nick Waterhouse", "0773e639f7102347bf010a5cbeba4322c93c28c7"], ["WHERE IS MY HUSBAND!", "RAYE", "0194ff4186a1f53bff2cdf6d7660289ca8eb0e7e"], ["Djadja", "Aya Nakamura", "f2312f3189c4a4b49ce9ff0aefe24ac6362423a0"], ["Bad Blood", "Taylor Swift", "d386b9948db98318abac93a9e0f59f4b298f58d2"], ["Mangos mit Chili", "Nina Chuba", "caebad4eaa8057d3e436689eb8bbec88eeda05fc"]], "7efELFMDb1sqQNC7VJXpwH": [["Ladies Night", "Kool & The Gang", "e6a11fc77591de73fe82b0fdec40dfff1e880488"], ["I Will Survive", "Gloria Gaynor", "1feacae84ecc2b05c365f19400e9a19e857b1ac1"], ["I Wanna Dance with Somebody", "Whitney Houston", "6d13b049b24af1bef77aa4d366c088c316ca1b65"], ["Girls Just Want to Have Fun", "Cyndi Lauper", "7f0a39e2981e2dcbf75783cef812e7d84726f650"], ["Moviestar", "Harpo", "f5201d0de3f41f46c37a7585dab9b86f3cd0092f"], ["September", "Earth, Wind & Fire", "4126a5b55c780cb037ddf61cb647aa960503737d"], ["Celebration", "Kool & The Gang", "1ba26bd1583538201bbd9c8b9d822b2d340eb301"], ["Free", "Ultra Naté, Mood II Swing", "217b18897a09934f173f70d5c6b93b104ed0bc4e"]], "6yod9K1KQIuHQOtQims443": [["Hey Ya!", "Outkast", "d24b3c4135ced9157b0ea3015a6bcc048e0c2e3a"], ["Promiscuous", "Nelly Furtado, Timbaland", "bc151048f2138d6cd93d690fcbd95227a85ef5b9"], ["Wiggle", "Jason Derulo, Snoop Dogg", "b1d1ab725a181b112a275db230ed8ad94eb4f33b"], ["Lose My Breath", "Destiny's Child", "0f5f66a92c272e4726a0178c5dfef0ac2454534f"], ["Pump It", "Black Eyed Peas", "c3aa3b2a8c6451a3ce6c20084cca89799722db46"], ["Ride Wit Me", "Nelly, City Spud", "b7babc9e267faa4bc66b9c479bbf96595bf4c33d"], ["Me & U", "Cassie", "4eca073e5603bd17307df236d5aebc7641c1caa2"], ["Beautiful", "Akon, Colby O'Donis", "9e4c833157a8e9bfefb1b35be3dec94825c7898f"]], "0tW2TfSY81v8bJGdDmunS3": [["Don't Drink & Jive", "Glenn Gatsby, Wolfgang Lohr", "2af7e549722b2cc37f25370d355abc25f880a7f2"], ["Istanbul (Not Constantinople)", "Bart & Baker", "f5f3dcc9020d8eb200a86b92a4a41d995538c066"], ["Charleston", "Bob Wilson & His Varsity Rhythm Boys", "e66295d47b696bcddee33d5a9923e64fd97c3129"], ["Swing Swing Swing", "The City of Los Angeles All Stars", "d82af0b6519ff3e3f4a84023c4cd71f07f904c9c"], ["Allez Viens (BruSwing Remix)", "Bart & Baker", "4fdc9bed68b45f18eb16f37db89e235a9a80264a"], ["The Muppet Show Theme", "The Muppets, Joanna Newsom", "77b0ea0aafbe6f66445cb299589dde4de8fd84f8"], ["Yes Sir, That's My Baby", "The Charleston Kids", "beb21a4994ac944a4309db7db5587794057f0957"], ["Veronika, der Lenz ist da", "Max Raabe & Palast Orchester", "7bb278127226071e25f908171c62e83bce5766d3"]], "7EDw0hRR2wA72ukUa9xIyr": [["Freed From Desire", "Gala, Molella, Phil Jay", "cf3b7cab9a6a4ef13de72b8ae6cc0f4019867eaf"], ["Sun Is Shining", "Funkstar De Luxe", "0fcad670c878c1c89ebae867e9e6719e203f5fad"], ["Lola's Theme", "The Shapeshifters", "040b8782e3200ccf8dd437bc639eb518b52d4b6e"], ["Beautiful People", "Barbara Tucker", "7ee1129f98b03566e90ab84e0a2674da90f8a2c2"], ["Gypsy Woman", "Crystal Waters", "9d605b6ad9e9a9542656a6d9cae95c6515e9110a"], ["Beatbox Rocker", "Westbam", "903332902b9e71597a8d14a1d25a279535d8efa2"], ["Pasilda", "Afro Medusa", "627cdb78081f142e6c0cb0eabfec7bcb1bfabeb6"], ["It Just Won't Do", "Tim Deluxe, Sam Obernik", "fa98a2cce356f0a3d8ce2d79f740ab730e8bfe7c"]], "0EQNx1CY4MeX3u9EirPbNl": [["Blue Taxi", "Jeff The Fool", "6ec4fb2a08399017126258f11a0666aae0d26084"], ["THE DON", "Close Counters", "0675b28fe8396f18e2c29d830c1fdf9263d14f6f"], ["Ride", "Tentendo, R.ICO", "dad401118fe3f5cb4ed8b7f42d94034c4b7dcd0a"], ["Late Night's In Swiss", "DJ Romain", "10da2711d0977718654f22f509d4f90498744c10"], ["Vibrant Air", "Klaus Layer, Rick Flair", "73ae1f764c7a23626803c17204cbd6ca57573b64"], ["Greatest Love", "Dj Streaks", "b31e18e1bced8b4307c6f9a45e4f8bde358f1a51"], ["Oh Honey", "Angelo Ferreri", "e2a33b490de3d0c1ebd3e12672941b5af9c05b22"], ["Tondo", "Disclosure, Eko Roosevelt", "5594e27ed44af86c720ed4ec2c47a7ada8071549"]]};

/* Artists hinter den Line-ups. bio, die mit "[" beginnt, wird nicht angezeigt (Platzhalter). */
NN.artists = {
    sax: { role: 'Saxophon', name: 'Simona Turk', bio: '[Kurzbeschreibung: Wer spielt, was ist der Stil, wo ist sie schon aufgetreten?]', url: 'https://www.instagram.com/simonaturksaxophone/', insta: true, handle: '@simonaturksaxophone', photo: '/img/artists/sax.webp', pos: '50% 30%' },
    piano: { role: 'Piano', name: 'Wido Kim', bio: '[Kurzbeschreibung: Wer spielt, was ist der Stil, wo ist er schon aufgetreten?]', url: 'https://www.instagram.com/wido.kim_music/', insta: true, handle: '@wido.kim_music', photo: '/img/artists/piano.webp', pos: '36% 50%' },
    chor: { role: 'Chor', name: 'Unsung Collective', bio: '[Kurzbeschreibung: Besetzung, Repertoire, Einsatz z. B. bei Trauung oder Party?]', url: 'https://www.instagram.com/unsung_collective/', insta: true, handle: '@unsung_collective', photo: '/img/artists/chor.webp', pos: '50% 50%' },
    vj: { role: 'VJ', name: 'Pavel Franzusov', bio: '[Kurzbeschreibung: Visuals live zum Set, Technikbedarf, Beispiele?]', url: 'https://franzusov.de/', insta: false, handle: 'franzusov.de', photo: '/img/artists/vj.webp', pos: '50% 50%' }
  };

/* Line-up-Baukasten: t Titel, d Beschreibung, f "Ideal fuer", a Artist-Schluessel */
NN.combos = [
    { t: 'DJ', d: 'Der Klassiker: Von Eröffnungstanz bis letzter Song, persönlich kuratiert und tanzbar.', f: 'Hochzeit · Corporate · Private Party', a: [] },
    { t: 'DJ + Vocals', d: 'Live-Gesang im DJ-Set: Gesangseinlagen über die Beats, z. B. „Freed From Desire“ oder „Zombie“.', f: 'Hochzeit · Firmenfeier · Geburtstag', a: [] },
    { t: 'DJ + Sax', d: 'Beats mit Saxophon obendrauf: elegant, clubbig und ein echter Hingucker.', f: 'Sektempfang · Dinner · Party', a: ['sax'] },
    { t: 'DJ + Chor', d: 'Ein Chor singt live zum Set: Gänsehaut-Momente bei Trauung, Sektempfang und Party.', f: 'Trauung · Hochzeit · Gala', a: ['chor'] },
    { t: 'DJ + VJ', d: 'Visuals live zum Set: Licht, Projektionen und Motive auf Leinwand oder Wand.', f: 'Firmen-Events · Launch · Club-Feeling', a: ['vj'] },
    { t: 'DJ + Technik', d: 'Ton und Licht aus einer Hand: Soundanlage, Mikrofone und Partylicht, passend zur Location.', f: 'Hochzeit · Firmenfeier · Private Party', a: [] },
    { t: 'Vocals + Piano', d: 'Ohne DJ: akustisch, emotional und nah dran.', f: 'Trauung · Sektempfang · Dinner', a: ['piano'] },
  ];

/* Videos: t Titel, id YouTube-ID, v 1 = Hochformat (9:16) */
NN.reels = { 1: { t: 'Corporate', id: 'gRq_w-gEbjE' }, 2: { t: 'Hochzeit & Private Party', id: 'jB67ePODs-o' }, 3: { t: 'Team Liebe Event', id: 'zmBi-acoRCk' }, 4: { t: 'Live Gesang 1', id: 'YD9oklFHb8U', v: 1 }, 5: { t: 'Live Gesang 2', id: '4n98ThhMBSo', v: 1 }, 6: { t: 'Live Gesang 3', id: '9avtELFt21s', v: 1 } };

/* Hintergrund der Video-Karte je Video (g Verlauf) */
NN.reelBgs = {
  1: { g: 'linear-gradient(200deg,#F0806A,#C9505F 55%,#5a1f29)' },
  2: { g: 'radial-gradient(ellipse 60% 50% at 50% 35%,rgba(255,236,214,.6),transparent 65%),linear-gradient(170deg,#FFB877,#F0806A 50%,#C9505F)' },
  3: { g: 'radial-gradient(ellipse 70% 60% at 40% 30%,#FFB877,transparent 70%),linear-gradient(180deg,#C9505F,#2a1418)' },
  4: { g: 'linear-gradient(200deg,#F0806A,#C9505F 55%,#5a1f29)' },
  5: { g: 'radial-gradient(ellipse 70% 60% at 40% 30%,#FFB877,transparent 70%),linear-gradient(180deg,#C9505F,#2a1418)' },
  6: { g: 'radial-gradient(ellipse 60% 50% at 50% 35%,rgba(255,236,214,.6),transparent 65%),linear-gradient(170deg,#FFB877,#F0806A 50%,#C9505F)' }
};
