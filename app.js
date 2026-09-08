// Rivani Fine Art — Main Application Logic
(function () {
  // Safe Storage Wrapper
  var memoryStorage = {};
  var storage = {
    get: function (key, def) {
      try {
        var item = localStorage.getItem(key);
        return item ? JSON.parse(item) : def;
      } catch (e) {
        return memoryStorage[key] || def;
      }
    },
    set: function (key, val) {
      try {
        localStorage.setItem(key, JSON.stringify(val));
      } catch (e) {
        memoryStorage[key] = val;
      }
    }
  };

  // Complete Collection Dataset (57 Curated Works)
  var fallbackArtworks = [
  {
    "id": 1,
    "title": "Thresholds in Terracotta & Umber",
    "artist": "Rivani Atelier",
    "category": "Abstract",
    "medium": "Oil and cold wax on raw linen \u00b7 Walnut frame",
    "dimensions": "122 \u00d7 91 cm (48 \u00d7 36 in)",
    "price": "\u20b91,00,000",
    "description": "Terracotta, umber and warm ivory geometric abstraction structured around architectural planes.",
    "image": "assets/images/image_1.jpg",
    "views": [
      "assets/images/image_1.jpg"
    ]
  },
  {
    "id": 2,
    "title": "Seated Figure in Ultramarine & Rose",
    "artist": "Rivani Atelier",
    "category": "Figurative",
    "medium": "Oil and pigment on fine Belgian linen \u00b7 Teak frame",
    "dimensions": "132 \u00d7 102 cm (52 \u00d7 40 in)",
    "price": "\u20b91,20,000",
    "description": "Contemporary figurative portrait balancing deep ultramarine robes with quiet dusty rose and neutral stone accents.",
    "image": "assets/images/image_2.jpg",
    "views": [
      "assets/images/image_2.jpg"
    ]
  },
  {
    "id": 3,
    "title": "Monsoon Light over Smoky Foothills",
    "artist": "Rivani Atelier",
    "category": "Landscape",
    "medium": "Oil on canvas \u00b7 Dark bronze frame",
    "dimensions": "122 \u00d7 122 cm (48 \u00d7 48 in)",
    "price": "\u20b91,50,000",
    "description": "Atmospheric mountain landscape under clearing monsoon skies with luminous breaks in the mist.",
    "image": "assets/images/image_3.jpg",
    "views": [
      "assets/images/image_3.jpg"
    ]
  },
  {
    "id": 4,
    "title": "Archway to the Terracotta Sun",
    "artist": "Rivani Atelier",
    "category": "Abstract",
    "medium": "Oil and pigment on linen \u00b7 Brass frame",
    "dimensions": "160 \u00d7 120 cm (63 \u00d7 47 in)",
    "price": "\u20b91,80,000",
    "description": "Bold architectural geometry featuring an arched vermilion portal, deep indigo shadows, and golden celestial sphere.",
    "image": "assets/images/image_4.jpg",
    "views": [
      "assets/images/image_4.jpg"
    ]
  },
  {
    "id": 5,
    "title": "Indigo Pichwai in Royal Courtyard",
    "artist": "Rivani Curated",
    "category": "Sacred",
    "medium": "Natural mineral pigment & gold leaf on handspun cotton \u00b7 Shadowbox frame",
    "dimensions": "135 \u00d7 105 cm (53 \u00d7 41 in)",
    "price": "\u20b91,50,000",
    "description": "Devotional indigo Nathdwara Pichwai depicting blooming sacred lotuses and temple iconography in gold filigree.",
    "image": "assets/images/image_5.jpg",
    "views": [
      "assets/images/image_5.jpg"
    ]
  },
  {
    "id": 6,
    "title": "The Royal Portrait: The Courtyard Prince",
    "artist": "Rivani Atelier",
    "category": "Figurative",
    "medium": "Oil and gold leaf on canvas \u00b7 Hand-carved frame",
    "dimensions": "140 \u00d7 95 cm (55 \u00d7 37 in)",
    "price": "\u20b91,20,000",
    "description": "Poised regal figure standing in contemplation with delicate gold jewelry against weathered palace masonry.",
    "image": "assets/images/image_6.jpg",
    "views": [
      "assets/images/image_6.jpg"
    ]
  },
  {
    "id": 7,
    "title": "Amber Procession at Dawn",
    "artist": "Rivani Atelier",
    "category": "Figurative",
    "medium": "Oil and mineral pigments on canvas \u00b7 Teak frame",
    "dimensions": "135 \u00d7 100 cm (53 \u00d7 39 in)",
    "price": "\u20b91,20,000",
    "description": "Dynamic equestrian and royal court entourage rendered in warm amber, crimson, and golden ochre.",
    "image": "assets/images/image_7.jpg",
    "views": [
      "assets/images/image_7.jpg"
    ]
  },
  {
    "id": 8,
    "title": "Narrative in Silk & Saffron",
    "artist": "Rivani Atelier",
    "category": "Figurative",
    "medium": "Oil and tempera on linen \u00b7 Gilded frame",
    "dimensions": "145 \u00d7 115 cm (57 \u00d7 45 in)",
    "price": "\u20b91,80,000",
    "description": "Classical narrative composition of women draped in heritage sarees gathered in morning conversation.",
    "image": "assets/images/image_8.jpg",
    "views": [
      "assets/images/image_8.jpg"
    ]
  },
  {
    "id": 9,
    "title": "Sapphire Court: Noblewoman in Gold",
    "artist": "Rivani Atelier",
    "category": "Figurative",
    "medium": "Fine oil on Belgian canvas \u00b7 Ornate frame",
    "dimensions": "135 \u00d7 95 cm (53 \u00d7 37 in)",
    "price": "\u20b91,20,000",
    "description": "Courtly portrait of a noblewoman in sapphire blue brocade and gold zari embroidery.",
    "image": "assets/images/image_9.jpg",
    "views": [
      "assets/images/image_9.jpg"
    ]
  },
  {
    "id": 10,
    "title": "Pastels Village Scape \u2014 Set of 4",
    "artist": "Rivani Atelier",
    "category": "Figurative",
    "medium": "Soft pastel and gouache on archival board \u00b7 Floated frame",
    "dimensions": "110 \u00d7 85 cm (43 \u00d7 33 in)",
    "price": "\u20b91,00,000",
    "description": "Ethereal coastal study in soft rose, celadon, and sand captured in a modern sea-facing salon.",
    "image": "assets/images/image_10.jpg",
    "views": [
      "assets/images/image_10.jpg"
    ]
  },
  {
    "id": 11,
    "title": "Monsoon Forest in Golden Light",
    "artist": "Rivani Atelier",
    "category": "Landscape",
    "medium": "Oil and wax on heavy canvas \u00b7 Gilt frame",
    "dimensions": "130 \u00d7 95 cm (51 \u00d7 37 in)",
    "price": "\u20b91,20,000",
    "description": "A dense monsoon forest canopy suffused with amber sunrays filtering through rain mist.",
    "image": "assets/images/image_11.jpg",
    "views": [
      "assets/images/image_11.jpg"
    ]
  },
  {
    "id": 12,
    "title": "Golden Konkan Seascape",
    "artist": "Rivani Atelier",
    "category": "Landscape",
    "medium": "Oil on linen \u00b7 Natural white oak frame",
    "dimensions": "125 \u00d7 95 cm (49 \u00d7 37 in)",
    "price": "\u20b91,20,000",
    "description": "Sunset reflections along the rocky Konkan coastline with golden waves and deep ocean horizons.",
    "image": "assets/images/image_12.jpg",
    "views": [
      "assets/images/image_12.jpg"
    ]
  },
  {
    "id": 13,
    "title": "Golden Lotus in Udaipur Haveli",
    "artist": "Rivani Curated",
    "category": "Sacred",
    "medium": "Embossed 24K gold foil and natural pigment on wood panel",
    "dimensions": "115 \u00d7 85 cm (45 \u00d7 33 in)",
    "price": "\u20b91,00,000",
    "description": "Traditional gold leaf lotus composition inspired by Mewar palace shrines and water lily gardens.",
    "image": "assets/images/image_13.jpg",
    "views": [
      "assets/images/image_13.jpg"
    ]
  },
  {
    "id": 14,
    "title": "Gilded Wildflower Meadow",
    "artist": "Rivani Atelier",
    "category": "Abstract",
    "medium": "Oil, gold leaf and cold wax on canvas \u00b7 Teak frame",
    "dimensions": "120 \u00d7 90 cm (47 \u00d7 35 in)",
    "price": "\u20b91,00,000",
    "description": "Textured botanical abstract in wildflower gold, earthy charcoal, and soft ivory washes.",
    "image": "assets/images/image_14.jpg",
    "views": [
      "assets/images/image_14.jpg"
    ]
  },
  {
    "id": 15,
    "title": "Homage to Klimt",
    "artist": "Rivani Atelier",
    "category": "Figurative",
    "medium": "Gold leaf, enamel and oil on canvas \u00b7 Dark walnut frame",
    "dimensions": "125 \u00d7 95 cm (49 \u00d7 37 in)",
    "price": "\u20b91,20,000",
    "description": "Intricate decorative mosaic patterns and intertwined figures inspired by the Golden Phase.",
    "image": "assets/images/image_15.jpg",
    "views": [
      "assets/images/image_15.jpg"
    ]
  },
  {
    "id": 16,
    "title": "Shrinathji Pichwai in Sea View Salon",
    "artist": "Rivani Curated",
    "category": "Sacred",
    "medium": "Natural pigments & gold on cotton \u00b7 Teak frame",
    "dimensions": "140 \u00d7 105 cm (55 \u00d7 41 in)",
    "price": "\u20b91,50,000",
    "description": "Monumental devotional Pichwai installed in an oceanfront dining gallery, framed in polished teak.",
    "image": "assets/images/image_16.jpg",
    "views": [
      "assets/images/image_16.jpg"
    ]
  },
  {
    "id": 17,
    "title": "Monumental Abstraction in South Mumbai",
    "artist": "Rivani Atelier",
    "category": "Abstract",
    "medium": "Oil and cold wax on Belgian linen \u00b7 Brass frame",
    "dimensions": "155 \u00d7 125 cm (61 \u00d7 49 in)",
    "price": "\u20b91,80,000",
    "description": "A commanding abstract painting creating architectural presence in a sun-drenched residence.",
    "image": "assets/images/image_17.jpg",
    "views": [
      "assets/images/image_17.jpg"
    ]
  },
  {
    "id": 18,
    "title": "Himalayan Landscape in South Mumbai",
    "artist": "Rivani Atelier",
    "category": "Landscape",
    "medium": "Oil on canvas \u00b7 Dark bronze frame",
    "dimensions": "135 \u00d7 100 cm (53 \u00d7 39 in)",
    "price": "\u20b91,20,000",
    "description": "Layered mountain peaks glowing under afternoon light, displayed in a high-ceilinged salon.",
    "image": "assets/images/image_18.jpg",
    "views": [
      "assets/images/image_18.jpg"
    ]
  },
  {
    "id": 19,
    "title": "Tidal Orbit on Ivory",
    "artist": "Rivani Atelier",
    "category": "Abstract",
    "medium": "Mixed media and gold leaf on panel \u00b7 Shadowbox frame",
    "dimensions": "110 \u00d7 110 cm (43 \u00d7 43 in)",
    "price": "\u20b91,20,000",
    "description": "Concentric rings and cosmic tide formations executed in charcoal, gold, and mineral white.",
    "image": "assets/images/image_19.jpg",
    "views": [
      "assets/images/image_19.jpg"
    ]
  },
  {
    "id": 20,
    "title": "Bombay Watercolours on Celadon",
    "artist": "Rivani Atelier",
    "category": "Landscape",
    "medium": "Watercolour & gouache on handmade Arches paper \u00b7 Walnut frame",
    "dimensions": "100 \u00d7 75 cm (39 \u00d7 30 in)",
    "price": "\u20b980,000",
    "description": "Delicate historic colonial facades and marine docks rendered in subtle washes of indigo and sepia.",
    "image": "assets/images/image_20.jpg",
    "views": [
      "assets/images/image_20.jpg"
    ]
  },
  {
    "id": 21,
    "title": "Four Landscapes on Ivory Wall",
    "artist": "Rivani Atelier",
    "category": "Landscape",
    "medium": "Polyptych: 4 framed oil studies on canvas",
    "dimensions": "140 \u00d7 100 cm overall (55 \u00d7 39 in)",
    "price": "\u20b91,50,000",
    "description": "Curated salon polyptych of four seasonal landscape studies mounted on an ivory gallery wall.",
    "image": "assets/images/image_21.jpg",
    "views": [
      "assets/images/image_21.jpg"
    ]
  },
  {
    "id": 22,
    "title": "Gilded Banyan Grove in Bandra",
    "artist": "Rivani Curated",
    "category": "Sacred",
    "medium": "Embossed brass and gold foil on dark wood \u00b7 Shadowbox frame",
    "dimensions": "120 \u00d7 90 cm (47 \u00d7 35 in)",
    "price": "\u20b91,00,000",
    "description": "Luminous brass roots and leafy canopy symbolizing sacred longevity and heritage sanctuary.",
    "image": "assets/images/image_22.jpg",
    "views": [
      "assets/images/image_22.jpg"
    ]
  },
  {
    "id": 23,
    "title": "High-Set Pastels in Sea-Facing Penthouse",
    "artist": "Rivani Atelier",
    "category": "Figurative",
    "medium": "Pastel and gouache on archival board \u00b7 Gilt frame",
    "dimensions": "115 \u00d7 85 cm (45 \u00d7 33 in)",
    "price": "\u20b91,00,000",
    "description": "Delicate figurative study capturing coastal light and breezy interior drapery.",
    "image": "assets/images/image_23.jpg",
    "views": [
      "assets/images/image_23.jpg"
    ]
  },
  {
    "id": 24,
    "title": "Gathering by the Sea at Dusk",
    "artist": "Rivani Atelier",
    "category": "Figurative",
    "medium": "Oil on Belgian linen \u00b7 Rosewood frame",
    "dimensions": "152 \u00d7 122 cm (60 \u00d7 48 in)",
    "price": "\u20b91,80,000",
    "description": "A monumental figurative composition in cobalt blue, ochre and vermilion robes overlooking Marine Drive.",
    "image": "assets/images/image_24.jpg",
    "views": [
      "assets/images/image_24.jpg"
    ]
  },
  {
    "id": 25,
    "title": "Twilight on the Hooghly Ghats",
    "artist": "Rivani Atelier",
    "category": "Landscape",
    "medium": "Luminous oil & watercolour on Arches paper \u00b7 Teak frame",
    "dimensions": "140 \u00d7 95 cm (55 \u00d7 37 in)",
    "price": "\u20b91,20,000",
    "description": "Serene evening waterscape showing riverboats navigating calm waters before temple ghats in twilight.",
    "image": "assets/images/image_25.jpg",
    "views": [
      "assets/images/image_25.jpg"
    ]
  },
  {
    "id": 26,
    "title": "Stepwell of Sienna & Indigo",
    "artist": "Rivani Atelier",
    "category": "Abstract",
    "medium": "Mineral pigments and raw linen collage \u00b7 Dark bronze frame",
    "dimensions": "155 \u00d7 125 cm (61 \u00d7 49 in)",
    "price": "\u20b91,80,000",
    "description": "Rhythmic stepped geometry in burnished terracotta, cream, and deep navy inspired by traditional stepwells.",
    "image": "assets/images/image_26.jpg",
    "views": [
      "assets/images/image_26.jpg"
    ]
  },
  {
    "id": 27,
    "title": "The Indigo Weft & Terracotta",
    "artist": "Rivani Atelier",
    "category": "Abstract",
    "medium": "Textile assemblage & natural dye on linen \u00b7 Shadowbox frame",
    "dimensions": "130 \u00d7 98 cm (51 \u00d7 38 in)",
    "price": "\u20b91,20,000",
    "description": "Textured indigo patches, madder red, and raw unbleached cotton creating a tactile balance of geometry and craft.",
    "image": "assets/images/image_27.jpg",
    "views": [
      "assets/images/image_27.jpg"
    ]
  },
  {
    "id": 28,
    "title": "The Three Sisters by the Sea Window",
    "artist": "Rivani Atelier",
    "category": "Figurative",
    "medium": "Textured impasto oil on canvas \u00b7 Gold leaf frame",
    "dimensions": "145 \u00d7 115 cm (57 \u00d7 45 in)",
    "price": "\u20b91,80,000",
    "description": "Three women draped in vibrant cobalt blue, coral, and mustard silk sarees gathered in contemplation against ocean light.",
    "image": "assets/images/image_28.jpg",
    "views": [
      "assets/images/image_28.jpg"
    ]
  },
  {
    "id": 29,
    "title": "Whispers in the Haveli Courtyard",
    "artist": "Rivani Atelier",
    "category": "Figurative",
    "medium": "Fine oil on canvas \u00b7 Hand-carved heritage frame",
    "dimensions": "150 \u00d7 120 cm (59 \u00d7 47 in)",
    "price": "\u20b91,80,000",
    "description": "Two noblewomen in brocade lehengas standing within the scalloped pink sandstone arches of a royal palace.",
    "image": "assets/images/image_29.jpg",
    "views": [
      "assets/images/image_29.jpg"
    ]
  },
  {
    "id": 30,
    "title": "Spirit in Motion: The White Stallion",
    "artist": "Rivani Atelier",
    "category": "Figurative",
    "medium": "Expressive palette knife oil with cobalt and cinnabar accents",
    "dimensions": "135 \u00d7 100 cm (53 \u00d7 39 in)",
    "price": "\u20b91,20,000",
    "description": "A powerful white horse surging through energetic strokes of mineral blue, deep ochre, and vermilion.",
    "image": "assets/images/image_30.jpg",
    "views": [
      "assets/images/image_30.jpg"
    ]
  },
  {
    "id": 31,
    "title": "Nocturne on the Riverfront",
    "artist": "Rivani Atelier",
    "category": "Landscape",
    "medium": "Luminous oil on canvas \u00b7 Walnut frame",
    "dimensions": "140 \u00d7 105 cm (55 \u00d7 41 in)",
    "price": "\u20b91,50,000",
    "description": "A sweeping night view of riverbanks bathed in golden lamplight beneath dramatic moonlit clouds.",
    "image": "assets/images/image_31.jpg",
    "views": [
      "assets/images/image_31.jpg"
    ]
  },
  {
    "id": 32,
    "title": "Abstract Temple",
    "artist": "Rivani Atelier",
    "category": "Landscape",
    "medium": "Layered oil on linen \u00b7 Minimalist white oak frame",
    "dimensions": "130 \u00d7 95 cm (51 \u00d7 37 in)",
    "price": "\u20b91,20,000",
    "description": "Towering snow-dusted ridges rising through violet mist, captured in a quiet architectural salon setting.",
    "image": "assets/images/image_32.jpg",
    "views": [
      "assets/images/image_32.jpg"
    ]
  },
  {
    "id": 33,
    "title": "Veranda into the Monsoon Grove",
    "artist": "Rivani Atelier",
    "category": "Landscape",
    "medium": "Oil and tempera on canvas \u00b7 Plantation teak frame",
    "dimensions": "125 \u00d7 95 cm (49 \u00d7 37 in)",
    "price": "\u20b91,20,000",
    "description": "Tropical foliage glistening under fresh monsoon rain, viewed from a traditional timber-pillared veranda.",
    "image": "assets/images/image_33.jpg",
    "views": [
      "assets/images/image_33.jpg"
    ]
  },
  {
    "id": 34,
    "title": "The Bodhi Meditation",
    "artist": "Rivani Curated",
    "category": "Sacred",
    "medium": "Carved sandstone relief and distressed gold leaf \u00b7 Framed",
    "dimensions": "110 \u00d7 90 cm (43 \u00d7 35 in)",
    "price": "\u20b91,00,000",
    "description": "A meditative seated Buddha framed by lush forest canopy and temple elephant motifs with antique gilded patina.",
    "image": "assets/images/image_34.jpg",
    "views": [
      "assets/images/image_34.jpg"
    ]
  },
  {
    "id": 35,
    "title": "The Golden Harpist",
    "artist": "Rivani Atelier",
    "category": "Figurative",
    "medium": "Fine oil on linen \u00b7 Ornate gilded French frame",
    "dimensions": "140 \u00d7 95 cm (55 \u00d7 37 in)",
    "price": "\u20b91,20,000",
    "description": "A regal portrait of a lady in ivory gown with a gilded harp, installed in a neoclassical salon with marble credenza.",
    "image": "assets/images/image_35.jpg",
    "views": [
      "assets/images/image_35.jpg"
    ]
  },
  {
    "id": 36,
    "title": "The Saffron Sage",
    "artist": "Rivani Curated",
    "category": "Sacred",
    "medium": "Mineral pigments & gouache on aged paper \u00b7 Teak frame",
    "dimensions": "105 \u00d7 80 cm (41 \u00d7 31 in)",
    "price": "\u20b980,000",
    "description": "A revered contemplative ascetic figure in saffron robes, exuding stillness, discipline and timeless focus.",
    "image": "assets/images/image_36.jpg",
    "views": [
      "assets/images/image_36.jpg"
    ]
  },
  {
    "id": 37,
    "title": "Night Song in the Garden",
    "artist": "Rivani Atelier",
    "category": "Figurative",
    "medium": "Oil and gold pigment on canvas \u00b7 Dark bronze frame",
    "dimensions": "100 \u00d7 100 cm (39 \u00d7 39 in)",
    "price": "\u20b91,00,000",
    "description": "A square format night garden composition with silhouettes, warm candlelight, and reflective emerald foliage.",
    "image": "assets/images/image_37.jpg",
    "views": [
      "assets/images/image_37.jpg"
    ]
  },
  {
    "id": 38,
    "title": "Peaceful Sanctuary",
    "artist": "Rivani Atelier",
    "category": "Figurative",
    "medium": "Oil on canvas \u00b7 Dark walnut frame",
    "dimensions": "135 \u00d7 100 cm (53 \u00d7 39 in)",
    "price": "\u20b91,20,000",
    "description": "A majestic courtly procession depicted in rich crimson, gold, and deep charcoal shades.",
    "image": "assets/images/image_38.jpg",
    "views": [
      "assets/images/image_38.jpg"
    ]
  },
  {
    "id": 39,
    "title": "The Royal Falconers",
    "artist": "Rivani Atelier",
    "category": "Figurative",
    "medium": "Oil and pigment on canvas \u00b7 Antique frame",
    "dimensions": "130 \u00d7 95 cm (51 \u00d7 37 in)",
    "price": "\u20b91,20,000",
    "description": "Dynamic historic narrative depicting horsemen and falconers amidst dramatic terrain.",
    "image": "assets/images/image_39.jpg",
    "views": [
      "assets/images/image_39.jpg"
    ]
  },
  {
    "id": 40,
    "title": "Celestial Mandalas in Maroon",
    "artist": "Rivani Atelier",
    "category": "Landscape",
    "medium": "Horizontal oil on Belgian canvas \u00b7 Brass frame",
    "dimensions": "145 \u00d7 90 cm (57 \u00d7 35 in)",
    "price": "\u20b91,20,000",
    "description": "A panoramic mountain range suffused with golden evening light over deep emerald valleys.",
    "image": "assets/images/image_40.jpg",
    "views": [
      "assets/images/image_40.jpg"
    ]
  },
  {
    "id": 41,
    "title": "Blessings 1",
    "artist": "Rivani Atelier",
    "category": "Figurative",
    "medium": "Oil and gold leaf on canvas \u00b7 Gilded frame",
    "dimensions": "135 \u00d7 100 cm (53 \u00d7 39 in)",
    "price": "\u20b91,20,000",
    "description": "An opulent portrait of royalty adorned in gold filigree and deep lapis lazuli robes.",
    "image": "assets/images/image_41.jpg",
    "views": [
      "assets/images/image_41.jpg"
    ]
  },
  {
    "id": 42,
    "title": "Lotus Sanctuary: Shrinathji Pichwai",
    "artist": "Rivani Curated",
    "category": "Sacred",
    "medium": "Natural pigment & 24K gold foil on handspun cotton",
    "dimensions": "115 \u00d7 85 cm (45 \u00d7 33 in)",
    "price": "\u20b91,00,000",
    "description": "Traditional Nathdwara Pichwai depicting blooming lotus ponds, dancing peacocks, and sacred devotional motifs.",
    "image": "assets/images/image_42.jpg",
    "views": [
      "assets/images/image_42.jpg"
    ]
  },
  {
    "id": 43,
    "title": "Celestial Mandalas in Maroon",
    "artist": "Rivani Atelier",
    "category": "Abstract",
    "medium": "Mixed media and gold leaf on wood panel",
    "dimensions": "100 \u00d7 100 cm (39 \u00d7 39 in)",
    "price": "\u20b91,00,000",
    "description": "Geometric concentric circles and meditative cosmic orbits in warm umber and gold.",
    "image": "assets/images/image_43.jpg",
    "views": [
      "assets/images/image_43.jpg"
    ]
  },
  {
    "id": 44,
    "title": "The Golden Harpist",
    "artist": "Rivani Curated",
    "category": "Sacred",
    "medium": "Embossed brass foil & tempera on wood \u00b7 Shadowbox frame",
    "dimensions": "120 \u00d7 90 cm (47 \u00d7 35 in)",
    "price": "\u20b91,00,000",
    "description": "Sacred banyan roots and golden foliage rendered with dimensional relief and hand-hammered texture.",
    "image": "assets/images/image_44.jpg",
    "views": [
      "assets/images/image_44.jpg"
    ]
  },
  {
    "id": 45,
    "title": "The Necklace of Time",
    "artist": "Rivani Atelier",
    "category": "Landscape",
    "medium": "Oil on canvas \u00b7 Antique gilded frame",
    "dimensions": "135 \u00d7 100 cm (53 \u00d7 39 in)",
    "price": "\u20b91,20,000",
    "description": "Light cascading through carved sandstone jalis and arched Mughal colonnades.",
    "image": "assets/images/image_45.jpg",
    "views": [
      "assets/images/image_45.jpg"
    ]
  },
  {
    "id": 46,
    "title": "Burger at the American Diner",
    "artist": "Rivani Atelier",
    "category": "Figurative",
    "medium": "Oil on linen \u00b7 Mahogany frame",
    "dimensions": "125 \u00d7 95 cm (49 \u00d7 37 in)",
    "price": "\u20b91,20,000",
    "description": "An intimate indoor study of books, manuscripts, and reflective contemplation.",
    "image": "assets/images/image_46.jpg",
    "views": [
      "assets/images/image_46.jpg"
    ]
  },
  {
    "id": 47,
    "title": "Divine Grace: The Charger",
    "artist": "Rivani Atelier",
    "category": "Figurative",
    "medium": "Impasto oil on heavy canvas \u00b7 Walnut frame",
    "dimensions": "140 \u00d7 105 cm (55 \u00d7 41 in)",
    "price": "\u20b91,50,000",
    "description": "Intense, dramatic depiction of a majestic black stallion against warm umber terrain.",
    "image": "assets/images/image_47.jpg",
    "views": [
      "assets/images/image_47.jpg"
    ]
  },
  {
    "id": 48,
    "title": "Radha Krishna",
    "artist": "Rivani Curated",
    "category": "Sacred",
    "medium": "Carved marble composite relief with silver foil patina",
    "dimensions": "110 \u00d7 85 cm (43 \u00d7 33 in)",
    "price": "\u20b91,00,000",
    "description": "Serene Jain iconography and carved celestial canopy with pristine spiritual symmetry.",
    "image": "assets/images/image_48.jpg",
    "views": [
      "assets/images/image_48.jpg"
    ]
  },
  {
    "id": 49,
    "title": "Twilight over Lake Pichola",
    "artist": "Rivani Atelier",
    "category": "Landscape",
    "medium": "Oil on canvas \u00b7 Teak frame",
    "dimensions": "135 \u00d7 95 cm (53 \u00d7 37 in)",
    "price": "\u20b91,20,000",
    "description": "The illuminated palaces of Udaipur floating upon calm waters under indigo twilight.",
    "image": "assets/images/image_49.jpg",
    "views": [
      "assets/images/image_49.jpg"
    ]
  },
  {
    "id": 50,
    "title": "The Red Chariot of Surya: Abstract",
    "artist": "Rivani Atelier",
    "category": "Sacred",
    "medium": "Gold foil, ink and tempera on canvas \u00b7 Gilded frame",
    "dimensions": "100 \u00d7 100 cm (39 \u00d7 39 in)",
    "price": "\u20b91,00,000",
    "description": "Radiant cosmic rays and sun chariot symbolism in gold, vermilion, and deep ochre.",
    "image": "assets/images/image_50.jpg",
    "views": [
      "assets/images/image_50.jpg"
    ]
  },
  {
    "id": 51,
    "title": "The Royal Fort of Amber: Abstract",
    "artist": "Rivani Atelier",
    "category": "Figurative",
    "medium": "Oil on canvas \u00b7 Antique gold leaf frame",
    "dimensions": "140 \u00d7 100 cm (55 \u00d7 39 in)",
    "price": "\u20b91,50,000",
    "description": "Ceremonial elephant adorned in velvet and gilded howdah before fort battlements.",
    "image": "assets/images/image_51.jpg",
    "views": [
      "assets/images/image_51.jpg"
    ]
  },
  {
    "id": 52,
    "title": "Blessings 1",
    "artist": "Rivani Atelier",
    "category": "Landscape",
    "medium": "Oil on canvas \u00b7 Dark timber frame",
    "dimensions": "130 \u00d7 95 cm (51 \u00d7 37 in)",
    "price": "\u20b91,20,000",
    "description": "Rolling green hills and tea plantation terraces veiled in gentle mountain fog.",
    "image": "assets/images/image_52.jpg",
    "views": [
      "assets/images/image_52.jpg"
    ]
  },
  {
    "id": 53,
    "title": "Veduta: The Como Villa & Balcony",
    "artist": "Rivani Curated",
    "category": "Landscape",
    "medium": "Fine oil on linen \u00b7 Classical gilt frame",
    "dimensions": "140 \u00d7 100 cm (55 \u00d7 39 in)",
    "price": "\u20b91,50,000",
    "description": "An Italianate lake vista with stone balustrades, blossoming bougainvillea, and alpine waters.",
    "image": "assets/images/image_53.jpg",
    "views": [
      "assets/images/image_53.jpg"
    ]
  },
  {
    "id": 54,
    "title": "Study in the Library: Homage to Vermeer",
    "artist": "Rivani Curated",
    "category": "Figurative",
    "medium": "Fine oil on panel \u00b7 Dark ebonized Dutch frame",
    "dimensions": "90 \u00d7 75 cm (35 \u00d7 30 in)",
    "price": "\u20b980,000",
    "description": "An exquisite Dutch Master-inspired study of interior light falling upon a reader in a private book collection.",
    "image": "assets/images/image_54.jpg",
    "views": [
      "assets/images/image_54.jpg"
    ]
  },
  {
    "id": 55,
    "title": "Abstract Cityscape",
    "artist": "Rivani Atelier",
    "category": "Sacred",
    "medium": "Mineral pigments & embossed gold leaf on canvas \u00b7 Teak frame",
    "dimensions": "125 \u00d7 95 cm (49 \u00d7 37 in)",
    "price": "\u20b91,20,000",
    "description": "Sacred peacocks roosting in flowering kadamba trees with delicate miniature court detailing.",
    "image": "assets/images/image_55.jpg",
    "views": [
      "assets/images/image_55.jpg"
    ]
  },
  {
    "id": 56,
    "title": "Morning Mist at the Garden",
    "artist": "Rivani Atelier",
    "category": "Figurative",
    "medium": "Oil and tempera on canvas \u00b7 Antique frame",
    "dimensions": "135 \u00d7 100 cm (53 \u00d7 39 in)",
    "price": "\u20b91,20,000",
    "description": "A musician in flow playing a sitar in a sunlit music room with classical columns.",
    "image": "assets/images/image_56.jpg",
    "views": [
      "assets/images/image_56.jpg"
    ]
  },
  {
    "id": 57,
    "title": "Breeze across the Marine Promenade",
    "artist": "Rivani Atelier",
    "category": "Landscape",
    "medium": "Oil on canvas \u00b7 Walnut frame",
    "dimensions": "120 \u00d7 90 cm (47 \u00d7 35 in)",
    "price": "\u20b91,00,000",
    "description": "Coastal Mumbai sea breeze and sunset glow over art deco architecture.",
    "image": "assets/images/image_57.jpg",
    "views": [
      "assets/images/image_57.jpg"
    ]
  }
];
  var fallbackMuse = [
  {
    "artworkId": 1,
    "image": "assets/images/image_1.jpg",
    "title": "Thresholds in Terracotta & Umber"
  },
  {
    "artworkId": 2,
    "image": "assets/images/image_2.jpg",
    "title": "Seated Figure in Ultramarine & Rose"
  },
  {
    "artworkId": 3,
    "image": "assets/images/image_3.jpg",
    "title": "Monsoon Light over Smoky Foothills"
  },
  {
    "artworkId": 4,
    "image": "assets/images/image_4.jpg",
    "title": "Archway to the Terracotta Sun"
  },
  {
    "artworkId": 5,
    "image": "assets/images/image_5.jpg",
    "title": "Indigo Pichwai in Royal Courtyard"
  },
  {
    "artworkId": 6,
    "image": "assets/images/image_6.jpg",
    "title": "The Royal Portrait: The Courtyard Prince"
  },
  {
    "artworkId": 7,
    "image": "assets/images/image_7.jpg",
    "title": "Amber Procession at Dawn"
  },
  {
    "artworkId": 8,
    "image": "assets/images/image_8.jpg",
    "title": "Narrative in Silk & Saffron"
  },
  {
    "artworkId": 9,
    "image": "assets/images/image_9.jpg",
    "title": "Sapphire Court: Noblewoman in Gold"
  },
  {
    "artworkId": 10,
    "image": "assets/images/image_10.jpg",
    "title": "Pastels Village Scape \u2014 Set of 4"
  },
  {
    "artworkId": 11,
    "image": "assets/images/image_11.jpg",
    "title": "Monsoon Forest in Golden Light"
  },
  {
    "artworkId": 12,
    "image": "assets/images/image_12.jpg",
    "title": "Golden Konkan Seascape"
  },
  {
    "artworkId": 13,
    "image": "assets/images/image_13.jpg",
    "title": "Golden Lotus in Udaipur Haveli"
  },
  {
    "artworkId": 14,
    "image": "assets/images/image_14.jpg",
    "title": "Gilded Wildflower Meadow"
  },
  {
    "artworkId": 15,
    "image": "assets/images/image_15.jpg",
    "title": "Homage to Klimt"
  },
  {
    "artworkId": 16,
    "image": "assets/images/image_16.jpg",
    "title": "Shrinathji Pichwai in Sea View Salon"
  },
  {
    "artworkId": 17,
    "image": "assets/images/image_17.jpg",
    "title": "Monumental Abstraction in South Mumbai"
  },
  {
    "artworkId": 18,
    "image": "assets/images/image_18.jpg",
    "title": "Himalayan Landscape in South Mumbai"
  },
  {
    "artworkId": 19,
    "image": "assets/images/image_19.jpg",
    "title": "Tidal Orbit on Ivory"
  },
  {
    "artworkId": 20,
    "image": "assets/images/image_20.jpg",
    "title": "Bombay Watercolours on Celadon"
  },
  {
    "artworkId": 21,
    "image": "assets/images/image_21.jpg",
    "title": "Four Landscapes on Ivory Wall"
  },
  {
    "artworkId": 22,
    "image": "assets/images/image_22.jpg",
    "title": "Gilded Banyan Grove in Bandra"
  },
  {
    "artworkId": 23,
    "image": "assets/images/image_23.jpg",
    "title": "High-Set Pastels in Sea-Facing Penthouse"
  },
  {
    "artworkId": 24,
    "image": "assets/images/image_24.jpg",
    "title": "Gathering by the Sea at Dusk"
  },
  {
    "artworkId": 25,
    "image": "assets/images/image_25.jpg",
    "title": "Twilight on the Hooghly Ghats"
  },
  {
    "artworkId": 26,
    "image": "assets/images/image_26.jpg",
    "title": "Stepwell of Sienna & Indigo"
  },
  {
    "artworkId": 27,
    "image": "assets/images/image_27.jpg",
    "title": "The Indigo Weft & Terracotta"
  },
  {
    "artworkId": 28,
    "image": "assets/images/image_28.jpg",
    "title": "The Three Sisters by the Sea Window"
  },
  {
    "artworkId": 29,
    "image": "assets/images/image_29.jpg",
    "title": "Whispers in the Haveli Courtyard"
  },
  {
    "artworkId": 30,
    "image": "assets/images/image_30.jpg",
    "title": "Spirit in Motion: The White Stallion"
  },
  {
    "artworkId": 31,
    "image": "assets/images/image_31.jpg",
    "title": "Nocturne on the Riverfront"
  },
  {
    "artworkId": 32,
    "image": "assets/images/image_32.jpg",
    "title": "Abstract Temple"
  },
  {
    "artworkId": 33,
    "image": "assets/images/image_33.jpg",
    "title": "Veranda into the Monsoon Grove"
  },
  {
    "artworkId": 34,
    "image": "assets/images/image_34.jpg",
    "title": "The Bodhi Meditation"
  },
  {
    "artworkId": 35,
    "image": "assets/images/image_35.jpg",
    "title": "The Golden Harpist"
  },
  {
    "artworkId": 36,
    "image": "assets/images/image_36.jpg",
    "title": "The Saffron Sage"
  },
  {
    "artworkId": 37,
    "image": "assets/images/image_37.jpg",
    "title": "Night Song in the Garden"
  },
  {
    "artworkId": 38,
    "image": "assets/images/image_38.jpg",
    "title": "Peaceful Sanctuary"
  },
  {
    "artworkId": 39,
    "image": "assets/images/image_39.jpg",
    "title": "The Royal Falconers"
  },
  {
    "artworkId": 40,
    "image": "assets/images/image_40.jpg",
    "title": "Celestial Mandalas in Maroon"
  },
  {
    "artworkId": 41,
    "image": "assets/images/image_41.jpg",
    "title": "Blessings 1"
  },
  {
    "artworkId": 42,
    "image": "assets/images/image_42.jpg",
    "title": "Lotus Sanctuary: Shrinathji Pichwai"
  },
  {
    "artworkId": 43,
    "image": "assets/images/image_43.jpg",
    "title": "Celestial Mandalas in Maroon"
  },
  {
    "artworkId": 44,
    "image": "assets/images/image_44.jpg",
    "title": "The Golden Harpist"
  },
  {
    "artworkId": 45,
    "image": "assets/images/image_45.jpg",
    "title": "The Necklace of Time"
  },
  {
    "artworkId": 46,
    "image": "assets/images/image_46.jpg",
    "title": "Burger at the American Diner"
  },
  {
    "artworkId": 47,
    "image": "assets/images/image_47.jpg",
    "title": "Divine Grace: The Charger"
  },
  {
    "artworkId": 48,
    "image": "assets/images/image_48.jpg",
    "title": "Radha Krishna"
  },
  {
    "artworkId": 49,
    "image": "assets/images/image_49.jpg",
    "title": "Twilight over Lake Pichola"
  },
  {
    "artworkId": 50,
    "image": "assets/images/image_50.jpg",
    "title": "The Red Chariot of Surya: Abstract"
  },
  {
    "artworkId": 51,
    "image": "assets/images/image_51.jpg",
    "title": "The Royal Fort of Amber: Abstract"
  },
  {
    "artworkId": 52,
    "image": "assets/images/image_52.jpg",
    "title": "Blessings 1"
  },
  {
    "artworkId": 53,
    "image": "assets/images/image_53.jpg",
    "title": "Veduta: The Como Villa & Balcony"
  },
  {
    "artworkId": 54,
    "image": "assets/images/image_54.jpg",
    "title": "Study in the Library: Homage to Vermeer"
  },
  {
    "artworkId": 55,
    "image": "assets/images/image_55.jpg",
    "title": "Abstract Cityscape"
  },
  {
    "artworkId": 56,
    "image": "assets/images/image_56.jpg",
    "title": "Morning Mist at the Garden"
  },
  {
    "artworkId": 57,
    "image": "assets/images/image_57.jpg",
    "title": "Breeze across the Marine Promenade"
  }
];

  var artworks = (window.RIVANI_ARTWORKS && window.RIVANI_ARTWORKS.length) 
    ? window.RIVANI_ARTWORKS 
    : fallbackArtworks;

  var muse = (window.RIVANI_MUSE && window.RIVANI_MUSE.length) 
    ? window.RIVANI_MUSE 
    : fallbackMuse;

  window.RIVANI_ARTWORKS = artworks;
  window.RIVANI_MUSE = muse;

  var filter = 'All';
  var query = '';
  var shortlist = storage.get('rivaniShortlist', []);

  function $(s) { return document.querySelector(s); }
  function $$(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }

  var categories = ['All'];
  artworks.forEach(function (a) {
    if (a.category && categories.indexOf(a.category) === -1) {
      categories.push(a.category);
    }
  });

  function saveShortlist() {
    storage.set('rivaniShortlist', shortlist);
    renderCount();
  }

  var audioChime = null;
  function playChime() {
    try {
      if (!audioChime) {
        audioChime = new Audio('final.mp3');
      }
      audioChime.currentTime = 0;
      var promise = audioChime.play();
      if (promise !== undefined) {
        promise.catch(function () { /* safe browser audio restriction catch */ });
      }
    } catch (e) {}
  }

  function renderCount() {
    var el = $('#shortlistCount');
    if (el) el.textContent = shortlist.length;
    var heroNum = $('#heroCountNum');
    if (heroNum) heroNum.textContent = artworks.length + 100;
  }

  function toggleShortlist(id) {
    var wasIn = shortlist.indexOf(id) !== -1;
    if (wasIn) {
      shortlist = shortlist.filter(function (x) { return x !== id; });
    } else {
      shortlist = shortlist.concat([id]);
      playChime();
    }
    saveShortlist();
    renderArt();
    renderShortlist();
  }

  // Hero Background Scrolling Chain of Images
  function initHeroSlideshow() {
    var track = $('.hero-marquee-track');
    if (!track) return;

    var chainImages = [
      'assets/images/image_24.jpg',
      'assets/images/image_27.jpg',
      'assets/images/image_29.jpg',
      'assets/images/image_25.jpg',
      'assets/images/image_28.jpg',
      'assets/images/image_26.jpg',
      'assets/images/image_1.jpg',
      'assets/images/image_2.jpg',
      'assets/images/image_22.jpg',
      'assets/images/image_31.jpg',
      'assets/images/image_33.jpg',
      'assets/images/image_30.jpg'
    ];

    // Duplicate list for infinite seamless loop
    var fullChain = chainImages.concat(chainImages);

    track.innerHTML = fullChain
      .map(function (src) {
        return '<div class="hero-marquee-card" style="background-image: url(\'' + src + '\');"></div>';
      })
      .join('');
  }

  // Advisory Section Slideshow
  function initAdvisorySlideshow() {
    var slider = $('.advisory-slider');
    if (!slider) return;

    var advisoryImages = [
      'assets/images/image_29.jpg',
      'assets/images/image_24.jpg',
      'assets/images/image_28.jpg',
      'assets/images/image_26.jpg',
      'assets/images/image_25.jpg',
      'assets/images/image_33.jpg'
    ];

    slider.innerHTML = advisoryImages
      .map(function (src, idx) {
        return '<div class="advisory-slide ' + (idx === 0 ? 'active' : '') + '" style="background-image: url(\'' + src + '\');"></div>';
      })
      .join('');

    var currentSlide = 0;
    var slides = $$('.advisory-slide');

    if (slides.length > 1) {
      setInterval(function () {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
      }, 4000);
    }
  }

  function renderFilters() {
    var container = $('#filters');
    if (!container) return;
    container.innerHTML = categories
      .map(function (c) {
        return '<button class="filter-btn ' + (filter === c ? 'active' : '') + '" data-filter="' + c + '">' + c.toUpperCase() + '</button>';
      })
      .join('');

    $$('[data-filter]').forEach(function (b) {
      b.onclick = function () {
        filter = b.getAttribute('data-filter');
        renderFilters();
        renderArt();
      };
    });
  }

  function visible() {
    return artworks.filter(function (a) {
      var matchCat = filter === 'All' || a.category === filter;
      var q = query.toLowerCase().trim();
      var matchQuery =
        !q ||
        (a.title + ' ' + a.artist + ' ' + a.category + ' ' + a.medium + ' ' + a.dimensions + ' ' + a.price)
          .toLowerCase()
          .indexOf(q) !== -1;
      return matchCat && matchQuery;
    });
  }

  function renderArt() {
    var list = visible();
    var countEl = $('#shownCount');
    if (countEl) countEl.textContent = list.length + ' OF ' + artworks.length + ' WORKS';

    var grid = $('#artGrid');
    if (!grid) return;

    if (!list.length) {
      grid.innerHTML = '<div style="grid-column: 1/-1; padding: 40px 0; text-align: center; color: var(--ink-soft); font-family: \'Playfair Display\', serif; font-size: 20px;">No artworks matched your query.</div>';
      return;
    }

    grid.innerHTML = list
      .map(function (a) {
        var isSaved = shortlist.indexOf(a.id) !== -1;
        return [
          '<article class="art-card">',
          '  <div class="image-wrap" data-open="' + a.id + '">',
          '    <img loading="lazy" src="' + a.image + '" alt="' + a.title + ' by ' + a.artist + '">',
          '    <button class="save-btn ' + (isSaved ? 'saved' : '') + '" data-save="' + a.id + '" aria-label="Shortlist ' + a.title + '">',
          '      ' + (isSaved ? '♥' : '♡'),
          '    </button>',
          '  </div>',
          '  <div class="card-meta">',
          '    <div class="artist-cat">',
          '      <span>' + a.category + '</span>',
          '      <span>' + (a.dimensions || '') + '</span>',
          '    </div>',
          '    <h3>' + a.title + '</h3>',
          '    <div class="specs">' + a.medium + '</div>',
          '    <div class="price-row">',
          '      <div class="price">' + a.price + '</div>',
          '      <button class="view-link" data-open="' + a.id + '">VIEW DETAILS →</button>',
          '    </div>',
          '  </div>',
          '</article>'
        ].join('\n');
      })
      .join('');

    $$('[data-save]').forEach(function (b) {
      b.onclick = function (e) {
        e.stopPropagation();
        toggleShortlist(+b.getAttribute('data-save'));
      };
    });

    $$('#artGrid [data-open]').forEach(function (el) {
      el.onclick = function (e) {
        if (e.target.closest('[data-save]')) return;
        openProduct(+el.getAttribute('data-open'));
      };
    });
  }

  function openProduct(id) {
    var a = artworks.find(function (x) { return x.id === id; });
    if (!a) return;

    var whatsappMsg = encodeURIComponent(
      "Hello Rivani Fine Art, I would like to inquire about acquiring '" + a.title + "' (" + a.price + ", Dimensions: " + a.dimensions + "). Is this piece available for private viewing or delivery?"
    );
    var emailSubject = encodeURIComponent("Acquisition Inquiry: " + a.title + " (" + a.price + ")");
    var emailBody = encodeURIComponent(
      "Dear Rivani Curatorial Team,\n\nI am interested in acquiring the following artwork:\n\nTitle: " + a.title + "\nPrice: " + a.price + "\nDimensions: " + a.dimensions + "\nMedium: " + a.medium + "\n\nPlease share availability, viewing appointments, and delivery details.\n\nThank you."
    );

    var views = (a.views && a.views.length) ? a.views : [a.image];
    var galleryHtml = views
      .map(function (src, idx) {
        return '<div class="gallery-main-wrap"><img src="' + src + '" alt="' + a.title + ' view ' + (idx + 1) + '" loading="eager" /></div>';
      })
      .join('');

    var isSaved = shortlist.indexOf(a.id) !== -1;

    $('#modalContent').innerHTML = [
      '<div class="product-modal">',
      '  <div class="product-gallery">',
      galleryHtml,
      '  </div>',
      '  <div class="product-info">',
      '    <p class="eyebrow">' + a.category + ' · ' + a.artist + '</p>',
      '    <h2>' + a.title + '</h2>',
      '    <p class="lead">' + a.description + '</p>',
      '    <div class="details">',
      '      <div><span>MEDIUM</span><b>' + a.medium + '</b></div>',
      (a.dimensions ? '<div><span>DIMENSIONS</span><b>' + a.dimensions + '</b></div>' : ''),
      '      <div><span>PRICE</span><b>' + a.price + ' (Bespoke Frame Included)</b></div>',
      '      <div><span>AVAILABILITY</span><b>Available for Immediate Acquisition</b></div>',
      '      <div><span>AUTHENTICITY</span><b>Registered Provenance & Certificate</b></div>',
      '    </div>',
      '    <div class="modal-actions">',
      '      <a href="https://wa.me/919820009498?text=' + whatsappMsg + '" target="_blank" rel="noopener" class="button whatsapp-btn full">💬 INQUIRE ON WHATSAPP (+91 9820009498)</a>',
      '      <button class="button dark full" id="modalInquireEmail">✉️ INQUIRE VIA EMAIL</button>',
      '      <button class="button light-outline full" id="modalSave">' + (isSaved ? '♥ REMOVE FROM SHORTLIST' : '♡ ADD TO SHORTLIST') + '</button>',
      '      <button class="text-btn" id="modalInquireForm" style="margin-top: 10px; text-align: center; width: 100%;">Or Fill Direct Inquiry Form ↓</button>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('\n');

    $('#modal').classList.add('open');
    $('#modal').setAttribute('aria-hidden', 'false');
    document.body.classList.add('lock');

    var emailInquireBtn = $('#modalInquireEmail');
    if (emailInquireBtn) {
      emailInquireBtn.onclick = function () {
        closeModal();
        openInquiryModal([a]);
      };
    }

    var saveBtn = $('#modalSave');
    if (saveBtn) {
      saveBtn.onclick = function () {
        toggleShortlist(a.id);
        openProduct(a.id);
      };
    }

    var formBtn = $('#modalInquireForm');
    if (formBtn) {
      formBtn.onclick = function () {
        closeModal();
        openInquiryModal([a]);
      };
    }
  }

  function closeModal() {
    var modal = $('#modal');
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
    document.body.classList.remove('lock');
  }

  function renderMuse() {
    var museGrid = $('#museGrid');
    if (!museGrid) return;

    var items = (muse && muse.length) ? muse : artworks.map(function (a) {
      return { artworkId: a.id, image: a.image, title: a.title };
    });

    museGrid.innerHTML = items
      .map(function (item) {
        var art = artworks.find(function (a) { return a.id === item.artworkId; }) || artworks[0];
        if (!art) return '';
        return [
          '<div class="muse-item" data-open="' + art.id + '">',
          '  <img loading="lazy" src="' + item.image + '" alt="' + art.title + ' installed in interior">',
          '  <div class="muse-label">',
          '    ' + art.title,
          '    <span>' + (art.dimensions ? art.dimensions : '') + ' · ' + art.price + ' · VIEW ARTWORK →</span>',
          '  </div>',
          '</div>'
        ].join('\n');
      })
      .join('');

    $$('#museGrid [data-open]').forEach(function (el) {
      el.onclick = function () {
        openProduct(+el.getAttribute('data-open'));
      };
    });
  }

  function openDrawer() {
    renderShortlist();
    var drawer = $('#shortlistDrawer');
    if (drawer) {
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
    }
    document.body.classList.add('lock');
  }

  function closeDrawer() {
    var drawer = $('#shortlistDrawer');
    if (drawer) {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
    }
    document.body.classList.remove('lock');
  }

  function renderShortlist() {
    var chosen = artworks.filter(function (a) { return shortlist.indexOf(a.id) !== -1; });
    var container = $('#shortlistItems');
    var drawerActions = $('#drawerActions') || $('.drawer-actions');
    var copyStatus = $('#copyStatus');
    if (!container) return;

    if (!chosen.length) {
      container.innerHTML = '<p class="empty">Your shortlist is currently empty.<br><span style="font-size: 13px; font-family: sans-serif; color: var(--ink-soft); display: block; margin-top: 8px;">Browse available works and tap the heart icon to curate your collection.</span></p>';
      if (copyStatus) copyStatus.textContent = '';
      if (drawerActions) {
        drawerActions.innerHTML = [
          '<a href="#available" id="drawerExploreBtn" class="button dark full">VIEW THE COLLECTION</a>',
          '<a href="#contact" id="drawerContactBtn" class="button light-outline full">CONTACT US</a>',
          '<a href="https://wa.me/919820009498?text=Hello%20Rivani%20Fine%20Art%2C%20I%20would%20like%20to%20inquire%20about%20your%20art%20collection." target="_blank" rel="noopener" class="button whatsapp-btn full">💬 INQUIRE ON WHATSAPP</a>'
        ].join('\n');

        var deb = $('#drawerExploreBtn');
        if (deb) {
          deb.onclick = function () {
            closeDrawer();
          };
        }
        var dcb = $('#drawerContactBtn');
        if (dcb) {
          dcb.onclick = function () {
            closeDrawer();
          };
        }
      }
      return;
    }

    container.innerHTML = chosen
      .map(function (a) {
        return [
          '<div class="short-item">',
          '  <img src="' + a.image + '" alt="' + a.title + '">',
          '  <div>',
          '    <h4>' + a.title + '</h4>',
          '    <p>' + a.category + ' · ' + a.dimensions + '</p>',
          '    <p><strong>' + a.price + '</strong></p>',
          '  </div>',
          '  <button class="remove" data-remove="' + a.id + '" aria-label="Remove ' + a.title + '">×</button>',
          '</div>'
        ].join('\n');
      })
      .join('');

    if (drawerActions) {
      drawerActions.innerHTML = [
        '<button id="sendShortlistWhatsApp" class="button whatsapp-btn full">💬 INQUIRE ON WHATSAPP</button>',
        '<button id="sendShortlistEmail" class="button dark full" onclick="sendShortlistEmail()">✉️ EMAIL SHORTLIST TO RIVANI</button>',
        '<button id="copyEnquiry" class="button light-outline full">COPY ENQUIRY LIST</button>'
      ].join('\n');

      var ssw = $('#sendShortlistWhatsApp');
      if (ssw) ssw.onclick = sendShortlistWhatsApp;

      var sse = $('#sendShortlistEmail');
      if (sse) sse.onclick = sendShortlistEmail;

      var ce = $('#copyEnquiry');
      if (ce) ce.onclick = copyEnquiry;
    }

    $$('[data-remove]').forEach(function (b) {
      b.onclick = function () {
        toggleShortlist(+b.getAttribute('data-remove'));
      };
    });
  }

  function getShortlistText() {
    var chosen = artworks.filter(function (a) { return shortlist.indexOf(a.id) !== -1; });
    if (!chosen.length) return '';
    var lines = [
      'RIVANI FINE ART — COLLECTOR SHORTLIST',
      '===================================='
    ];
    chosen.forEach(function (a, i) {
      lines.push((i + 1) + '. ' + a.title);
      lines.push('   Category: ' + a.category);
      lines.push('   Dimensions: ' + a.dimensions);
      lines.push('   Price: ' + a.price);
    });
    lines.push('====================================');
    lines.push('Contact: inquiry@rivaniart.com | WhatsApp: +91 9820009498');
    lines.push('Please confirm availability, custom framing options, and private viewing schedules.');
    return lines.join('\n');
  }

  function sendShortlistWhatsApp() {
    var chosen = artworks.filter(function (a) { return shortlist.indexOf(a.id) !== -1; });
    if (!chosen.length) {
      alert('Please add at least one artwork to your shortlist first.');
      return;
    }
    var text = getShortlistText();
    var url = 'https://wa.me/919820009498?text=' + encodeURIComponent(text);
    window.open(url, '_blank');
  }

  function sendShortlistEmail() {
    var chosen = artworks.filter(function (a) { return shortlist.indexOf(a.id) !== -1; });
    closeDrawer();
    openInquiryModal(chosen);
  }

  function copyEnquiry() {
    if (!shortlist.length) {
      var st = $('#copyStatus');
      if (st) st.textContent = 'Add at least one work to your shortlist first.';
      return;
    }
    var text = getShortlistText();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        var st = $('#copyStatus');
        if (st) {
          st.textContent = '✓ Shortlist copied to clipboard.';
          setTimeout(function () { st.textContent = ''; }, 4000);
        }
      }).catch(function () {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      var st = $('#copyStatus');
      if (st) {
        st.textContent = '✓ Shortlist copied to clipboard.';
        setTimeout(function () { st.textContent = ''; }, 4000);
      }
    } catch (err) {
      var st = $('#copyStatus');
      if (st) st.textContent = 'Select and copy your shortlist items manually.';
    }
    document.body.removeChild(ta);
  }

  var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzug_SlaVDnXd-pi6uC7LCzgih8sCLhxCcII3UNM9Z0VVGoKLRIHDRK7Phb7fWMmTKi/exec';
  var currentInquiryWorks = [];

  function openInquiryModal(targetWorks) {
    try { playChime(); } catch (e) {}
    currentInquiryWorks = (targetWorks && targetWorks.length) ? targetWorks : [];
    if (!currentInquiryWorks.length && typeof shortlist !== 'undefined' && shortlist.length) {
      currentInquiryWorks = artworks.filter(function (a) { return shortlist.indexOf(a.id) !== -1; });
    }

    var formView = $('#inquiryFormView');
    var successView = $('#inquirySuccessView');
    var worksWrap = $('#popSelectedWorksWrap');
    var worksList = $('#popSelectedList');
    var worksTitle = $('#popSelectedTitle');

    if (formView) formView.style.display = 'block';
    if (successView) successView.style.display = 'none';

    if (worksWrap && worksList) {
      if (currentInquiryWorks.length) {
        worksWrap.style.display = 'block';
        if (worksTitle) {
          worksTitle.textContent = 'Acquisition Artwork' + (currentInquiryWorks.length > 1 ? 's (' + currentInquiryWorks.length + ')' : '');
        }
        worksList.innerHTML = currentInquiryWorks.map(function (w) {
          return [
            '<div class="inquiry-work-card">',
            '  <img src="' + w.image + '" alt="' + w.title + '" />',
            '  <div class="inquiry-work-card-info">',
            '    <h4>' + w.title + '</h4>',
            '    <p>' + (w.category || '') + (w.dimensions ? ' · ' + w.dimensions : '') + '</p>',
            '  </div>',
            '  <div class="inquiry-work-price">' + (w.price || '') + '</div>',
            '</div>'
          ].join('');
        }).join('');
      } else {
        worksWrap.style.display = 'none';
        worksList.innerHTML = '';
      }
    }

    var modal = $('#inquiryModal');
    if (modal) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    }
    document.body.classList.add('lock');
  }

  function showInquirySuccess(works, name, phone) {
    var formView = $('#inquiryFormView');
    var successView = $('#inquirySuccessView');
    var successWorksText = $('#successWorksText');
    var successCollectorText = $('#successCollectorText');

    if (formView) formView.style.display = 'none';
    if (successView) successView.style.display = 'block';

    var wList = (works && works.length) ? works : currentInquiryWorks;
    var countText = (wList && wList.length) ? (wList.length === 1 ? wList[0].title : wList.length + ' Artworks') : 'Acquisition Request';

    if (successWorksText) successWorksText.textContent = countText;
    if (successCollectorText) successCollectorText.textContent = (name || 'Collector') + (phone ? ' (' + phone + ')' : '');

    var modal = $('#inquiryModal');
    if (modal) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    }
    document.body.classList.add('lock');
  }

  function closeInquiryModal() {
    var modal = $('#inquiryModal');
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
    if (!$('#modal.open') && !$('#shortlistDrawer.open')) {
      document.body.classList.remove('lock');
    }
  }

  function initApp() {
    initHeroSlideshow();
    initAdvisorySlideshow();
    renderFilters();
    renderArt();
    renderMuse();
    renderCount();
    renderShortlist();

    var searchInput = $('#searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        query = e.target.value;
        renderArt();
      });
    }

    var searchBtn = $('#searchBtn');
    if (searchBtn) {
      searchBtn.onclick = function () {
        var avail = document.querySelector('#available');
        if (avail) {
          avail.scrollIntoView({ behavior: 'smooth' });
          var input = $('#searchInput');
          if (input) setTimeout(function () { input.focus(); }, 350);
        }
      };
    }

    var sb = $('#shortlistBtn');
    if (sb) sb.onclick = openDrawer;

    var os = $('#openShortlist');
    if (os) os.onclick = openDrawer;

    var ssw = $('#sendShortlistWhatsApp');
    if (ssw) ssw.onclick = sendShortlistWhatsApp;

    var sse = $('#sendShortlistEmail');
    if (sse) sse.onclick = sendShortlistEmail;

    var ce = $('#copyEnquiry');
    if (ce) ce.onclick = copyEnquiry;

    var directEmailBtn = $('#directEmailBtn');
    if (directEmailBtn) {
      directEmailBtn.onclick = function (e) {
        e.preventDefault();
        openInquiryModal();
      };
    }

    var popWaBtn = $('#popWhatsAppBtn');
    if (popWaBtn) {
      popWaBtn.onclick = function () {
        var name = ($('#popName') && $('#popName').value.trim()) || 'Collector';
        var phone = ($('#popPhone') && $('#popPhone').value.trim()) || '';
        var city = ($('#popCity') && $('#popCity').value.trim()) || '';
        var msg = ($('#popMessage') && $('#popMessage').value.trim()) || '';
        var worksSummary = currentInquiryWorks.map(function (w, i) { return (i + 1) + '. ' + w.title + ' (' + (w.price || '') + ')'; }).join('\n');

        var text = [
          'RIVANI FINE ART — ACQUISITION INQUIRY',
          'Name: ' + name,
          (phone ? 'Phone: ' + phone : ''),
          (city ? 'City / Location: ' + city : ''),
          (worksSummary ? 'Artworks:\n' + worksSummary : ''),
          (msg ? 'Notes: ' + msg : ''),
          '-----------------------------------',
          'Sent to Rivani Fine Art desk.'
        ].filter(Boolean).join('\n');

        window.open('https://wa.me/919820009498?text=' + encodeURIComponent(text), '_blank');
      };
    }

    var popForm = $('#popInquiryForm');
    if (popForm) {
      popForm.onsubmit = function (e) {
        e.preventDefault();
        try { playChime(); } catch (err) {}
        var name = ($('#popName') && $('#popName').value.trim()) || '';
        var phone = ($('#popPhone') && $('#popPhone').value.trim()) || '';
        var email = ($('#popEmail') && $('#popEmail').value.trim()) || '';
        var city = ($('#popCity') && $('#popCity').value.trim()) || '';
        var message = ($('#popMessage') && $('#popMessage').value.trim()) || '';

        if (!name || !phone) {
          alert('Please enter your Name and Phone / WhatsApp number.');
          return;
        }

        var btn = $('#popSubmitBtn');
        if (btn) {
          btn.disabled = true;
          btn.textContent = '⏳ SUBMITTING REQUEST...';
        }

        var worksSummary = currentInquiryWorks.map(function (w, i) {
          return (i + 1) + '. ' + w.title + ' (' + (w.price || '') + (w.dimensions ? ', ' + w.dimensions : '') + ')';
        }).join('\n');

        var fullMsg = [
          (worksSummary ? 'Works of Interest:\n' + worksSummary : 'General acquisition inquiry from website.'),
          (city ? 'Location: ' + city : ''),
          (message ? 'Collector Notes: ' + message : '')
        ].filter(Boolean).join('\n\n');

        var payload = new URLSearchParams();
        payload.append('name', name);
        payload.append('phone', phone);
        payload.append('email', email || 'N/A');
        payload.append('message', fullMsg);

        fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: payload.toString()
        })
          .then(function () {
            showInquirySuccess(currentInquiryWorks, name, phone);
            popForm.reset();
          })
          .catch(function (err) {
            console.error('Submission error:', err);
            showInquirySuccess(currentInquiryWorks, name, phone);
            popForm.reset();
          })
          .finally(function () {
            if (btn) {
              btn.disabled = false;
              btn.textContent = '✉️ SUBMIT ACQUISITION REQUEST';
            }
          });
      };
    }

    $$('[data-close]').forEach(function (x) { x.onclick = closeModal; });
    $$('[data-drawer-close]').forEach(function (x) { x.onclick = closeDrawer; });
    $$('[data-inquiry-close]').forEach(function (x) { x.onclick = closeInquiryModal; });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeModal();
        closeDrawer();
        closeInquiryModal();
      }
    });

    var contactForm = $('#contactForm');
    if (contactForm) {
      var getFormData = function () {
        var name = ($('#formName') && $('#formName').value.trim()) || '';
        var phone = ($('#formPhone') && $('#formPhone').value.trim()) || '';
        var email = ($('#formEmail') && $('#formEmail').value.trim()) || '';
        var city = ($('#formCity') && $('#formCity').value.trim()) || '';
        var message = ($('#formMessage') && $('#formMessage').value.trim()) || '';
        return { name: name, phone: phone, email: email, city: city, message: message };
      };

      var submitWa = $('#submitWhatsApp');
      if (submitWa) {
        submitWa.onclick = function () {
          var data = getFormData();
          if (!data.name || !data.phone) {
            alert('Please provide your Name and Phone / WhatsApp number.');
            return;
          }
          var text = [
            'RIVANI FINE ART — ACQUISITION INQUIRY',
            'Name: ' + data.name,
            'Phone / WhatsApp: ' + data.phone,
            (data.email ? 'Email: ' + data.email : ''),
            (data.city ? 'City / Location: ' + data.city : ''),
            (data.message ? 'Notes / Request: ' + data.message : ''),
            '-----------------------------------',
            'Inquiry sent to Rivani Fine Art desk.'
          ]
            .filter(Boolean)
            .join('\n');

          window.open('https://wa.me/919820009498?text=' + encodeURIComponent(text), '_blank');
          var fs = $('#formStatus');
          if (fs) {
            fs.style.color = '#195237';
            fs.textContent = '✓ Opening WhatsApp with your inquiry details...';
          }
        };
      }

      contactForm.onsubmit = function (e) {
        e.preventDefault();
        playChime();
        var data = getFormData();
        if (!data.name || !data.phone) {
          alert('Please provide your Name and Phone / WhatsApp number.');
          return;
        }

        var submitBtn = $('#submitFormBtn');
        var fs = $('#formStatus');

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = '⏳ SUBMITTING REQUEST...';
        }
        if (fs) {
          fs.style.color = 'var(--ink-soft)';
          fs.textContent = 'Submitting your request to Rivani Fine Art desk...';
        }

        var fullMessage = data.message;
        if (data.city) {
          fullMessage = 'City / Location: ' + data.city + (fullMessage ? '\n\n' + fullMessage : '');
        }

        var payload = new URLSearchParams();
        payload.append('name', data.name);
        payload.append('phone', data.phone);
        payload.append('email', data.email || 'N/A');
        payload.append('message', fullMessage || 'Acquisition inquiry from website.');

        fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: payload.toString()
        })
          .then(function () {
            if (fs) {
              fs.style.color = '#195237';
              fs.innerHTML = '✓ <strong>Thank you!</strong> Your acquisition request has been submitted. Our curatorial team will review your inquiry and connect with you shortly.';
            }
            showInquirySuccess([], data.name, data.phone);
            contactForm.reset();
          })
          .catch(function (err) {
            console.error('Submission error:', err);
            showInquirySuccess([], data.name, data.phone);
            contactForm.reset();
          })
          .finally(function () {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = '✉️ SUBMIT ACQUISITION REQUEST';
            }
          });
      };
    }
    window.openInquiryModal = openInquiryModal;
    window.closeInquiryModal = closeInquiryModal;
    window.openDrawer = openDrawer;
    window.closeDrawer = closeDrawer;
    window.sendShortlistEmail = sendShortlistEmail;
    window.playChime = playChime;
  }

  // Execute immediately and on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
