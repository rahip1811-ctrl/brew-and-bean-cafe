/**
 * The menu, in one place. `/menu` renders all of it; the landing page shows
 * only the items flagged `featured`, so the teaser can never list something
 * the full menu doesn't have.
 *
 * Photography is deliberately sparse here. There are six usable food photos
 * and forty-odd items, so each category leads with one image and the rest are
 * typographic — which is how a specialty café's own menu board reads anyway.
 * Repeating the same croissant across nine tiles would look cheaper, not richer.
 */

export type Diet = "veg" | "egg";

export type MenuItem = {
  name: string;
  description: string;
  /** Rupees. */
  price: number;
  diet: Diet;
  /** Path under /public. Only the lead item in each category carries one. */
  image?: string;
  /** Shown in the landing page's featured teaser. */
  featured?: boolean;
};

export type MenuCategory = {
  id: string;
  label: string;
  /** Sits under the category name on the /menu page. */
  note: string;
  items: MenuItem[];
};

export const menu: MenuCategory[] = [
  {
    id: "coffee",
    label: "Coffee",
    note: "Roasted in small lots. Ask what's on the bar today.",
    items: [
      {
        name: "Brown Sugar Cloud",
        description: "Espresso · brown sugar · cold foam",
        price: 240,
        diet: "veg",
        image: "/images/cappuccino-latte-art.jpg",
        featured: true,
      },
      {
        name: "Honey Cinnamon Latte",
        description: "Espresso · steamed milk · honey · cinnamon",
        price: 220,
        diet: "veg",
        featured: true,
      },
      {
        name: "Filter Kaapi",
        description: "Chikmagalur decoction, pulled the long way",
        price: 160,
        diet: "veg",
        featured: true,
      },
      {
        name: "Espresso",
        description: "A single shot of whatever we're proudest of",
        price: 150,
        diet: "veg",
      },
      {
        name: "Cortado",
        description: "Equal parts espresso and warm milk",
        price: 180,
        diet: "veg",
      },
      {
        name: "Flat White",
        description: "Double ristretto under a thin veil of milk",
        price: 210,
        diet: "veg",
      },
      {
        name: "V60 Single Origin",
        description: "Hand poured, one cup at a time. Takes six minutes.",
        price: 260,
        diet: "veg",
      },
      {
        name: "Cold Brew",
        description: "Steeped eighteen hours, served over a single rock",
        price: 230,
        diet: "veg",
      },
      {
        name: "Saffron Tonic Espresso",
        description: "Espresso · kesar · tonic · orange peel",
        price: 260,
        diet: "veg",
      },
    ],
  },
  {
    id: "tea",
    label: "Tea",
    note: "Leaves steeped properly, never stewed.",
    items: [
      {
        name: "Masala Chai",
        description: "Ginger, green cardamom, and a long slow boil",
        price: 150,
        diet: "veg",
        image: "/images/table-spread-cheesecake.jpg",
        featured: true,
      },
      {
        name: "Kashmiri Kahwa",
        description: "Green tea · saffron · slivered almond",
        price: 180,
        diet: "veg",
        featured: true,
      },
      {
        name: "Matcha Latte",
        description: "Ceremonial grade, whisked to order",
        price: 250,
        diet: "veg",
        featured: true,
      },
      {
        name: "Iced Peach Oolong",
        description: "Cold steeped overnight, lightly sweetened",
        price: 190,
        diet: "veg",
      },
      {
        name: "Lemongrass & Mint Tisane",
        description: "Caffeine free, cut fresh each morning",
        price: 170,
        diet: "veg",
      },
    ],
  },
  {
    id: "breakfast",
    label: "Breakfast",
    note: "Served from eight until the kitchen runs out.",
    items: [
      {
        name: "Masala Scramble & Toast",
        description: "Soft eggs, green chilli, coriander, buttered sourdough",
        price: 290,
        diet: "egg",
        image: "/images/croissants-coffee.jpg",
        featured: true,
      },
      {
        name: "Avocado & Chilli Toast",
        description: "Smashed avocado · lime · chilli oil · toasted seeds",
        price: 320,
        diet: "veg",
        featured: true,
      },
      {
        name: "Poha with Sev & Lime",
        description: "The Sunday morning one. Curry leaf, peanut, pomegranate.",
        price: 180,
        diet: "veg",
        featured: true,
      },
      {
        name: "Granola, Curd & Seasonal Fruit",
        description: "Baked in house with jaggery and almond",
        price: 240,
        diet: "veg",
      },
      {
        name: "Chilli Cheese Toastie",
        description: "Amul cheese, green chilli, pressed until it leaks",
        price: 260,
        diet: "veg",
      },
    ],
  },
  {
    id: "pastries",
    label: "Pastries",
    note: "Laminated overnight, baked at six, gone by four.",
    items: [
      {
        name: "Kesar Pista Croissant",
        description: "Saffron cream · pistachio · fresh strawberry",
        price: 280,
        diet: "veg",
        image: "/images/signature-cream-croissant.jpg",
        featured: true,
      },
      {
        name: "Classic Croissant",
        description: "Buttery, flaky and freshly baked",
        price: 160,
        diet: "veg",
        featured: true,
      },
      {
        name: "Cardamom Bun",
        description: "Knotted, twice proved, crusted in demerara",
        price: 180,
        diet: "veg",
        featured: true,
      },
      {
        name: "Almond Croissant",
        description: "Yesterday's croissant, today's better idea",
        price: 210,
        diet: "veg",
      },
      {
        name: "Pain au Chocolat",
        description: "Two batons of 64% dark chocolate",
        price: 190,
        diet: "veg",
      },
      {
        name: "Cheese Danish",
        description: "Vanilla bean custard, lemon zest, sugar glaze",
        price: 200,
        diet: "veg",
      },
    ],
  },
  {
    id: "desserts",
    label: "Desserts",
    note: "For the afternoon that turned into an evening.",
    items: [
      {
        name: "Wild Berry Cheesecake",
        description: "Baked vanilla cheesecake under a berry compote",
        price: 280,
        diet: "veg",
        image: "/images/pastries-danish-spread.jpg",
        featured: true,
      },
      {
        name: "Basque Burnt Cheesecake",
        description: "Scorched on top, barely set in the middle",
        price: 290,
        diet: "veg",
        featured: true,
      },
      {
        name: "Affogato",
        description: "Vanilla bean ice cream drowned in espresso",
        price: 230,
        diet: "veg",
        featured: true,
      },
      {
        name: "Tiramisu",
        description: "Mascarpone, our own espresso, a lot of cocoa",
        price: 270,
        diet: "egg",
      },
      {
        name: "Date & Walnut Cake",
        description: "No refined sugar, and none the worse for it",
        price: 220,
        diet: "veg",
      },
    ],
  },
];

/** The three large parallax cards on the landing page. */
export const signatures = [
  {
    name: "Brown Sugar Cloud",
    description: "Espresso · brown sugar · cold foam",
    price: 240,
    image: "/images/cappuccino-latte-art.jpg",
    story:
      "Two ristretto shots, brown sugar stirred through while it's still hot, and a salted cold foam poured slow enough to sit on top rather than sink.",
  },
  {
    name: "Kesar Pista Croissant",
    description: "Saffron cream · pistachio · fresh strawberry",
    price: 280,
    image: "/images/signature-cream-croissant.jpg",
    story:
      "Saffron steeped in warm cream overnight, folded into a croissant that took three days to laminate. We make forty a day and stop.",
  },
  {
    name: "Wild Berry Cheesecake",
    description: "Baked vanilla cheesecake · berry compote",
    price: 280,
    image: "/images/table-spread-cheesecake.jpg",
    story:
      "Baked low and slow so it never cracks, then left overnight. The compote changes with whatever the market has that week.",
  },
];

export const featuredByCategory = menu.map((category) => ({
  ...category,
  items: category.items.filter((item) => item.featured),
}));

export function formatPrice(rupees: number) {
  return `₹${rupees}`;
}
