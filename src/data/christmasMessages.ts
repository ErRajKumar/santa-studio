export type MessageCategory =
  | 'Family'
  | 'Friends'
  | 'Funny Christmas Messages'
  | 'Formal Christmas Wishes'
  | 'Corporate Christmas Messages'
  | 'Christmas Party Invitations';

export interface ChristmasMessage {
  id: string;
  category: MessageCategory;
  title: string;
  text: string;
  targetType: 'wishes' | 'invitation';
}

export const MESSAGE_CATEGORIES: MessageCategory[] = [
  'Family',
  'Friends',
  'Funny Christmas Messages',
  'Formal Christmas Wishes',
  'Corporate Christmas Messages',
  'Christmas Party Invitations',
];

export const CHRISTMAS_MESSAGES: ChristmasMessage[] = [
  // 1. FAMILY (9)
  {
    id: 'msg-01',
    category: 'Family',
    title: 'Around the Same Table',
    text: 'No matter how busy the year gets, coming home to the warmth of your table makes everything feel right again. Wishing our family a peaceful, laughter-filled Christmas.',
    targetType: 'wishes',
  },
  {
    id: 'msg-02',
    category: 'Family',
    title: 'For Parents Who Make It Magic',
    text: 'Thank you for turning every December into a season of warm kitchens, glowing lights, and memories we carry all year. Merry Christmas with all our love.',
    targetType: 'wishes',
  },
  {
    id: 'msg-03',
    category: 'Family',
    title: 'Across the Miles',
    text: 'Even though we are celebrating in different cities this December, you are in every carol, candle, and toast at our table. Sending huge Christmas hugs across the miles.',
    targetType: 'wishes',
  },
  {
    id: 'msg-04',
    category: 'Family',
    title: 'New Family Traditions',
    text: 'Here is to quiet mornings by the tree, homemade cookies, and making new traditions together. May this Christmas bring our home endless comfort and joy.',
    targetType: 'wishes',
  },
  {
    id: 'msg-05',
    category: 'Family',
    title: 'To Dear Grandparents',
    text: 'Your stories, kindness, and hugs are the finest gifts our family receives every single year. Wishing you a cozy, gentle, and joyful Christmas Day.',
    targetType: 'wishes',
  },
  {
    id: 'msg-06',
    category: 'Family',
    title: 'For Siblings',
    text: 'From childhood wrapping-paper chaos to grown-up holiday dinners, life is always brighter with you in it. Have the happiest Christmas!',
    targetType: 'wishes',
  },
  {
    id: 'msg-07',
    category: 'Family',
    title: 'Baby’s First Christmas',
    text: 'Seeing the twinkle of the tree reflected in little eyes makes this season sweeter than ever before. Wishing your growing family a magical first Christmas together.',
    targetType: 'wishes',
  },
  {
    id: 'msg-08',
    category: 'Family',
    title: 'Grateful for Us',
    text: 'Gifts come and go, but having a family that shows up through every season is the blessing I treasure most. Merry Christmas to everyone under your roof.',
    targetType: 'wishes',
  },
  {
    id: 'msg-09',
    category: 'Family',
    title: 'Warm Hearth, Happy Hearts',
    text: 'May the scent of pine, warm cider, and good conversation fill your living room all week long. Sending love from our family to yours this Christmas.',
    targetType: 'wishes',
  },

  // 2. FRIENDS (9)
  {
    id: 'msg-10',
    category: 'Friends',
    title: 'True Friendships',
    text: 'Thank you for every coffee catch-up, late-night chat, and honest laugh this year. Wishing you a Christmas filled with rest, good food, and zero alarm clocks.',
    targetType: 'wishes',
  },
  {
    id: 'msg-11',
    category: 'Friends',
    title: 'Cheers to Another Year',
    text: 'Life feels lighter with a friend like you in my corner. Raise a glass to cozy nights, bright lights, and an unforgettable year ahead. Merry Christmas!',
    targetType: 'wishes',
  },
  {
    id: 'msg-12',
    category: 'Friends',
    title: 'Best Neighbors & Friends',
    text: 'Having friends just down the street makes every winter evening warmer. Thank you for all your kindness this year—have a wonderful Christmas!',
    targetType: 'wishes',
  },
  {
    id: 'msg-13',
    category: 'Friends',
    title: 'Rest & Recharge',
    text: 'You worked hard all year—now put your feet up, pour something warm, and enjoy every quiet moment of the holidays. Merry Christmas, my friend.',
    targetType: 'wishes',
  },
  {
    id: 'msg-14',
    category: 'Friends',
    title: 'Old Friends, Best Memories',
    text: 'Years fly by, yet every time we get together it feels like no time has passed at all. Wishing you and yours the happiest Christmas season.',
    targetType: 'wishes',
  },
  {
    id: 'msg-15',
    category: 'Friends',
    title: 'Sparkle & Peace',
    text: 'May your December be rich in good company, sweet treats, and the simple peace of knowing you are deeply appreciated. Merry Christmas!',
    targetType: 'wishes',
  },
  {
    id: 'msg-16',
    category: 'Friends',
    title: 'Long-Distance Catch-Up Soon',
    text: 'I miss our spontaneous hangouts! Sending warm Christmas wishes your way and counting down until we can celebrate together in person.',
    targetType: 'wishes',
  },
  {
    id: 'msg-17',
    category: 'Friends',
    title: 'Festive Spirit',
    text: 'Here is to twinkling lights, terrible holiday movies, and second helpings of dessert. Have the merriest Christmas!',
    targetType: 'wishes',
  },
  {
    id: 'msg-18',
    category: 'Friends',
    title: 'Bright New Beginnings',
    text: 'Wishing you a Christmas wrapped in warmth and a New Year brimming with fresh adventures and small daily joys.',
    targetType: 'wishes',
  },

  // 3. FUNNY CHRISTMAS MESSAGES (8)
  {
    id: 'msg-19',
    category: 'Funny Christmas Messages',
    title: 'Holiday Calories Rule',
    text: 'Good news: Santa checked the list, and calories consumed between December 20 and January 2 officially do not count. Enjoy every bite—Merry Christmas!',
    targetType: 'wishes',
  },
  {
    id: 'msg-20',
    category: 'Funny Christmas Messages',
    title: 'Nice List Technicality',
    text: 'I told Santa you were wonderfully behaved all year. Now we both owe him an explanation, so let us start with cookies. Merry Christmas!',
    targetType: 'wishes',
  },
  {
    id: 'msg-21',
    category: 'Funny Christmas Messages',
    title: 'Gift Receipt Included',
    text: 'May your Christmas sweater be delightfully ugly, your eggnog suspiciously strong, and every gift come with a polite return receipt.',
    targetType: 'wishes',
  },
  {
    id: 'msg-22',
    category: 'Funny Christmas Messages',
    title: 'Professional Napper Season',
    text: 'My Christmas wish for you is three straight days in soft pyjamas, zero emails, and leftovers within arm’s reach. Happy Holidays!',
    targetType: 'wishes',
  },
  {
    id: 'msg-23',
    category: 'Funny Christmas Messages',
    title: 'Wrapping Paper Struggle',
    text: 'I wrapped your Christmas card with the same precision I use for presents: plenty of tape and pure optimism. Wishing you loads of festive laughs!',
    targetType: 'wishes',
  },
  {
    id: 'msg-24',
    category: 'Funny Christmas Messages',
    title: 'Fruitcake Warning',
    text: 'May your home stay warm, your relatives keep politics off the dinner table, and nobody regift you a three-year-old fruitcake. Merry Christmas!',
    targetType: 'wishes',
  },
  {
    id: 'msg-25',
    category: 'Funny Christmas Messages',
    title: 'Battery Not Included',
    text: 'Wishing you a joyful Christmas morning where every single toy already has batteries installed and the coffee pot works on the first try.',
    targetType: 'wishes',
  },
  {
    id: 'msg-26',
    category: 'Funny Christmas Messages',
    title: 'Reindeer Parking',
    text: 'Please leave the driveway clear on December 24—Santa’s sleigh does not have reverse sensors. Have a hilarious and happy Christmas!',
    targetType: 'wishes',
  },

  // 4. FORMAL CHRISTMAS WISHES (8)
  {
    id: 'msg-27',
    category: 'Formal Christmas Wishes',
    title: 'Classic Season’s Greetings',
    text: 'Wishing you and your family a serene Christmas filled with grace, good health, and enduring happiness throughout the coming year.',
    targetType: 'wishes',
  },
  {
    id: 'msg-28',
    category: 'Formal Christmas Wishes',
    title: 'Peace and Goodwill',
    text: 'May the timeless spirit of Christmas bring peace to your home, warmth to your gatherings, and bright promise to the year ahead.',
    targetType: 'wishes',
  },
  {
    id: 'msg-29',
    category: 'Formal Christmas Wishes',
    title: 'Warmest Holiday Regards',
    text: 'Please accept our warmest wishes for a joyful Christmas celebration and a healthy, prosperous New Year.',
    targetType: 'wishes',
  },
  {
    id: 'msg-30',
    category: 'Formal Christmas Wishes',
    title: 'Distinguished Wishes',
    text: 'At this festive time of year, we extend our heartfelt gratitude and sincere wishes for joy, comfort, and serenity this Christmas.',
    targetType: 'wishes',
  },
  {
    id: 'msg-31',
    category: 'Formal Christmas Wishes',
    title: 'Graceful Wintertide',
    text: 'May the quiet beauty of the winter season bring renewed hope, cherished moments with loved ones, and blessings in abundance.',
    targetType: 'wishes',
  },
  {
    id: 'msg-32',
    category: 'Formal Christmas Wishes',
    title: 'Respectful Holiday Greeting',
    text: 'Sending respectful and warm Christmas greetings to you and everyone in your household. May the year ahead be marked by peace and fulfilment.',
    targetType: 'wishes',
  },
  {
    id: 'msg-33',
    category: 'Formal Christmas Wishes',
    title: 'Enduring Joy',
    text: 'With every good wish for a blessed Christmas and continued health, harmony, and success in the new year.',
    targetType: 'wishes',
  },
  {
    id: 'msg-34',
    category: 'Formal Christmas Wishes',
    title: 'Candlelight & Reflection',
    text: 'May this holiday season offer a welcome pause for gratitude, reflection, and joyful celebration alongside those you hold dear.',
    targetType: 'wishes',
  },

  // 5. CORPORATE CHRISTMAS MESSAGES (8)
  {
    id: 'msg-35',
    category: 'Corporate Christmas Messages',
    title: 'Client Appreciation',
    text: 'Thank you for placing your trust in us throughout this year. It has been a privilege working together, and we wish you and your team a wonderful Christmas.',
    targetType: 'wishes',
  },
  {
    id: 'msg-36',
    category: 'Corporate Christmas Messages',
    title: 'Team Gratitude',
    text: 'None of this year’s milestones would have been possible without your dedication and creativity. Wishing you a restful Christmas break and a bright New Year.',
    targetType: 'wishes',
  },
  {
    id: 'msg-37',
    category: 'Corporate Christmas Messages',
    title: 'Partners in Success',
    text: 'As the year draws to a close, we extend our sincere appreciation for our partnership. Warmest wishes for a joyous Christmas and continued success in 2027.',
    targetType: 'wishes',
  },
  {
    id: 'msg-38',
    category: 'Corporate Christmas Messages',
    title: 'Valued Customers',
    text: 'From all of us, thank you for being part of our community this year. May your holidays be bright, peaceful, and filled with celebration.',
    targetType: 'wishes',
  },
  {
    id: 'msg-39',
    category: 'Corporate Christmas Messages',
    title: 'Leadership Note',
    text: 'Thank you for bringing energy, care, and resilience to every project this year. Take time to unwind with those you love—Merry Christmas!',
    targetType: 'wishes',
  },
  {
    id: 'msg-40',
    category: 'Corporate Christmas Messages',
    title: 'Vendor & Collaborator Thanks',
    text: 'Working alongside your team has been a highlight of our year. Wishing everyone in your organisation a joyful holiday season and a prosperous New Year.',
    targetType: 'wishes',
  },
  {
    id: 'msg-41',
    category: 'Corporate Christmas Messages',
    title: 'Year-End Cheers',
    text: 'Season’s greetings from our entire studio. We look forward to building great things together in the coming year—have a wonderful Christmas!',
    targetType: 'wishes',
  },
  {
    id: 'msg-42',
    category: 'Corporate Christmas Messages',
    title: 'Warm Business Wishes',
    text: 'May the festive break bring well-deserved rest and inspiration for the months ahead. Warmest Christmas wishes to you and your colleagues.',
    targetType: 'wishes',
  },

  // 6. CHRISTMAS PARTY INVITATIONS (8)
  {
    id: 'msg-43',
    category: 'Christmas Party Invitations',
    title: 'Fireside Dinner Soirée',
    text: 'Join us beside the hearth for a relaxed evening of seasonal dishes, mulled wine, and warm conversation under the Christmas lights.',
    targetType: 'invitation',
  },
  {
    id: 'msg-44',
    category: 'Christmas Party Invitations',
    title: 'Festive Cocktail Evening',
    text: 'Put on your favourite winter attire and celebrate the season with handcrafted cocktails, festive music, and plenty of good cheer.',
    targetType: 'invitation',
  },
  {
    id: 'msg-45',
    category: 'Christmas Party Invitations',
    title: 'Family Brunch & Gift Swap',
    text: 'Bring your holiday spirit (and a wrapped Secret Santa gift!) for warm pastries, hot cocoa, and joyful morning games.',
    targetType: 'invitation',
  },
  {
    id: 'msg-46',
    category: 'Christmas Party Invitations',
    title: 'Winter Gala & Midnight Toast',
    text: 'You are cordially invited to an evening of candlelight dining, live jazz, and a sparkling champagne toast to close the year in style.',
    targetType: 'invitation',
  },
  {
    id: 'msg-47',
    category: 'Christmas Party Invitations',
    title: 'Ugly Sweater & Trivia Night',
    text: 'Dust off your loudest festive knitwear and join us for holiday trivia, wood-fired bites, and prizes for the best—or worst—Christmas jumper.',
    targetType: 'invitation',
  },
  {
    id: 'msg-48',
    category: 'Christmas Party Invitations',
    title: 'Open House Carols & Cocoa',
    text: 'Drop in anytime for warm mince pies, spiced cider, and festive sing-alongs around the tree. Friends and family warmly welcomed.',
    targetType: 'invitation',
  },
  {
    id: 'msg-49',
    category: 'Christmas Party Invitations',
    title: 'Office Holiday Celebration',
    text: 'Let us toast a wonderful year together! Join the team for dinner, music, and festive prizes as we kick off the holiday break.',
    targetType: 'invitation',
  },
  {
    id: 'msg-50',
    category: 'Christmas Party Invitations',
    title: 'Christmas Eve Candlelight Supper',
    text: 'Celebrate the quiet magic of Christmas Eve at our table with classic roast, seasonal desserts, and cherished company.',
    targetType: 'invitation',
  },
];
