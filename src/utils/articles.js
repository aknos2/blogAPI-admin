import day1Title from '/assets/corgi/articles/day1/corgi-running.webp';
import day1CorgiBreeze from '/assets/corgi/articles/day1/corgi-breeze.webp';
import day1CorgiPlant from '/assets/corgi/articles/day1/corgi-eating-plant.webp';

const day1Pages = [
  {
    id: 1,
    title: "Running around the park",
    date: "Thursday, 17 July 2025",
    tags: ["Activities", "Nature"],
    image: day1Title,
    imageAlt: "Corgi running",
    heading: "Today I run all around the parkie",
    subtitle: "I'm speedy-speed, can't catch me!",
    content: "I wuv nature!",
    layout: "titlePage",
  },
  {
    id: 2,
    image: day1CorgiBreeze,
    imageAlt: "Corgi in breeze",
    subtitle: "The wind feels so nice!",
    content: "Little tired but breeze is great!",
    layout: "horizontalImage",
  },
  {
    id: 3,
    image: day1CorgiPlant,
    imageAlt: "Corgi eating plant",
    subtitle: "Found some yummy plants",
    content: "Today was a good day.",
    layout: "horizontalImage",
  }
];

export const articles = [
  {
    pages: day1Pages,
    thumbnail: day1Title,
    date: "Thur, 17",
    tags: ["Activities", "Nature"],
    title: "Running around the park",
    month: 'August',
    year: '2025'
  },
  {
    pages: day1Pages,
    thumbnail: day1CorgiPlant,
    date: "Fri, 18",
    tags: ["Friends", "Nature"],
    title: "Hello",
    month: 'August',
    year: '2025'
  },
  {
    pages: day1Pages,
    thumbnail: day1CorgiBreeze,
    date: "Sat, 19",
    tags: ["Food"],
    title: "A day with burger",
    month: 'August',
    year: '2025'
  },
  {
    pages: day1Pages,
    thumbnail: day1CorgiPlant,
    date: "Wed, 24",
    tags: ["Activities", "City"],
    title: "City is nice",
    month: 'August',
    year: '2025'
  },
  {
    pages: day1Pages,
    thumbnail: day1CorgiBreeze,
    date: "Fri, 12",
    tags: ["Food", "Nature"],
    title: "Good food",
    month: 'January',
    year: '2025'
  },
  {
    pages: day1Pages,
    thumbnail: day1Title,
    date: "Mon, 29",
    tags: ["Friends", "Food"],
    title: "Eating with Kitty",
    month: 'July',
    year: '2025'
  },
  {
    pages: day1Pages,
    thumbnail: day1Title,
    date: "Mon, 31",
    tags: ["Friends", "Food"],
    title: "Eating with Kitty",
    month: 'August',
    year: '2024'
  },


];
