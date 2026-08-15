const products = [
  {
    name: "Mid-century Sofa",
    inStock: 10,
    description:
      "A classic mid-century modern sofa with tapered wooden legs and plush cushioning, perfect for any contemporary living room.",
    image:
      "https://res.cloudinary.com/dutb3pknb/image/upload/v1786694820/mid_century_sofa.jpg",
    price: 450000,
    category: "Living Room",
  },
  {
    name: "Velvet Armchair",
    inStock: 15,
    description:
      "A plush velvet armchair with elegant curved arms, adding a touch of luxury and comfort to your living space.",
    image:
      "https://res.cloudinary.com/dutb3pknb/image/upload/v1786694827/velvet_arm_chair.jpg",
    price: 180000,
    category: "Living Room",
  },
  {
    name: "Coffee Table",
    inStock: 12,
    description:
      "A sleek coffee table with a minimalist wood frame, ideal for modern living rooms.",
    image:
      "https://res.cloudinary.com/dutb3pknb/image/upload/v1786694814/coffee_table.jpg",
    price: 95000,
    category: "Living Room",
  },
  {
    name: "Bookshelf",
    inStock: 8,
    description:
      "A sturdy solid wood bookshelf with multiple tiers, offering ample storage for books and decor.",
    image:
      "https://res.cloudinary.com/dutb3pknb/image/upload/v1786694814/book_shelf.jpg",
    price: 130000,
    category: "Living Room",
  },
  {
    name: "Floor Lamp",
    inStock: 20,
    description:
      "A modern floor lamp with a warm ambient glow, perfect for reading corners and cozy evenings.",
    image:
      "https://res.cloudinary.com/dutb3pknb/image/upload/v1786694818/floor_lamp.jpg",
    price: 45000,
    category: "Living Room",
  },

  {
    name: "Platform Bed",
    inStock: 9,
    description:
      "A minimalist platform bed frame with a low profile design, crafted from solid wood for lasting durability.",
    image:
      "https://res.cloudinary.com/dutb3pknb/image/upload/v1786694812/bed.jpg",
    price: 250000,
    category: "Bedroom",
  },
  {
    name: "Nightstand",
    inStock: 18,
    description:
      "A compact wooden nightstand with a single drawer, perfect for bedside essentials.",
    image:
      "https://res.cloudinary.com/dutb3pknb/image/upload/v1786694828/nightstand.jpg",
    price: 55000,
    category: "Bedroom",
  },
  {
    name: "Wardrobe Closet",
    inStock: 5,
    description:
      "A spacious wardrobe closet system with adjustable shelving and hanging space for a well-organized bedroom.",
    image:
      "https://res.cloudinary.com/dutb3pknb/image/upload/v1786694814/closet.jpg",
    price: 550000,
    category: "Bedroom",
  },
  {
    name: "Vanity Mirror",
    inStock: 11,
    description:
      "An elegant vanity table with a built-in mirror and drawers, ideal for your morning routine.",
    image:
      "https://res.cloudinary.com/dutb3pknb/image/upload/v1786694826/vanity_mirror.jpg",
    price: 150000,
    category: "Bedroom",
  },

  {
    name: "Wooden Dining Table",
    inStock: 7,
    description:
      "A solid wood dining table with a natural finish, seating up to six people comfortably.",
    image:
      "https://res.cloudinary.com/dutb3pknb/image/upload/v1786694815/dining_table.jpg",
    price: 320000,
    category: "Dining Room",
  },
  {
    name: "Dining Chair",
    inStock: 24,
    description:
      "A dining chair combining natural texture with modern comfort.",
    image:
      "https://res.cloudinary.com/dutb3pknb/image/upload/v1786694815/dining_chair.jpg",
    price: 55000,
    category: "Dining Room",
  },
  {
    name: "Stool",
    inStock: 16,
    description:
      "A stool with a sleek wooden frame, perfect for kitchen islands.",
    image:
      "https://res.cloudinary.com/dutb3pknb/image/upload/v1786694815/dining_stool.jpg",
    price: 35000,
    category: "Dining Room",
  },
  {
    name: "Sideboard Cabinet",
    inStock: 6,
    description:
      "A stylish sideboard cabinet offering generous storage for dinnerware and linens.",
    image:
      "https://res.cloudinary.com/dutb3pknb/image/upload/v1786694826/sideboard_cabinet.jpg",
    price: 230000,
    category: "Dining Room",
  },
  {
    name: "Pendant Light Fixture",
    inStock: 22,
    description:
      "A statement pendant light fixture that adds warmth and character above your dining table.",
    image:
      "https://res.cloudinary.com/dutb3pknb/image/upload/v1786694825/dining_lights.jpg",
    price: 65000,
    category: "Dining Room",
  },

  {
    name: "Office Chair",
    inStock: 13,
    description:
      "An ergonomic office chair with lumbar support and adjustable height, built for long work sessions.",
    image:
      "https://res.cloudinary.com/dutb3pknb/image/upload/v1786694822/office_chair.jpg",
    price: 120000,
    category: "Office",
  },
  {
    name: "Standing Desk",
    inStock: 10,
    description:
      "A height-adjustable standing desk that lets you switch between sitting and standing throughout the day.",
    image:
      "https://res.cloudinary.com/dutb3pknb/image/upload/v1786694831/standing_table.jpg",
    price: 210000,
    category: "Office",
  },
  {
    name: "Bookcase Shelving Unit",
    inStock: 9,
    description:
      "A modern shelving unit with open compartments, great for books, files, and decor.",
    image:
      "https://res.cloudinary.com/dutb3pknb/image/upload/v1786694823/office_shelf.jpg",
    price: 115000,
    category: "Office",
  },
  {
    name: "Desk Lamp",
    inStock: 30,
    description:
      "A sleek adjustable desk lamp with focused lighting, perfect for late-night work sessions.",
    image:
      "https://res.cloudinary.com/dutb3pknb/image/upload/v1786694820/office_lamp.jpg",
    price: 25000,
    category: "Office",
  },
  {
    name: "Filing Cabinet",
    inStock: 12,
    description:
      "A compact filing cabinet with lockable drawers, keeping your documents organized and secure.",
    image:
      "https://res.cloudinary.com/dutb3pknb/image/upload/v1786694818/filing_cabinet.jpg",
    price: 78000,
    category: "Office",
  },

  {
    name: "Patio Set",
    inStock: 4,
    description:
      "A durable rattan patio set of chairs, built to withstand the elements.",
    image:
      "https://res.cloudinary.com/dutb3pknb/image/upload/v1786694825/patio_chair.jpg",
    price: 380000,
    category: "Outdoor",
  },
  {
    name: "Lounge Chair",
    inStock: 14,
    description:
      "A weather-resistant lounge chair designed for relaxing afternoons on the patio.",
    image:
      "https://res.cloudinary.com/dutb3pknb/image/upload/v1786694824/outdoor_lounge_chair.jpg",
    price: 105000,
    category: "Outdoor",
  },
  {
    name: "Garden Bench",
    inStock: 8,
    description:
      "A classic wooden garden bench, treated for outdoor durability and timeless style.",
    image:
      "https://res.cloudinary.com/dutb3pknb/image/upload/v1786694826/garden_bench.jpg",
    price: 90000,
    category: "Outdoor",
  },
  {
    name: "Hammock Chair",
    inStock: 17,
    description:
      "A cozy hanging hammock chair, perfect for unwinding in your backyard or patio.",
    image:
      "https://res.cloudinary.com/dutb3pknb/image/upload/v1786694818/hammock_chair.jpg",
    price: 42000,
    category: "Outdoor",
  },
  {
    name: "Fire Pit Table",
    inStock: 6,
    description:
      "A stylish fire pit table that doubles as a gathering spot for cool evenings outdoors.",
    image:
      "https://res.cloudinary.com/dutb3pknb/image/upload/v1786694818/firepit_table.jpg",
    price: 180000,
    category: "Outdoor",
  },
];

module.exports = {
  products,
};
