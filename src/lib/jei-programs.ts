export type JeiProgramSeed = {
  slug: string
  name: string
  dateLabel: string
  startDate: string
  endDate: string
  weeklyPrice: number
  stripeUrl: string
  prerequisite?: string
  description: string
  details?: string
}

export const JEI_PROGRAMS: JeiProgramSeed[] = [
  {
    slug: 'blender-l1',
    name: 'Fundamentals of 3D Modeling and Design with Blender (Level 1)',
    dateLabel: '6/1 - 6/5',
    startDate: '2026-06-01',
    endDate: '2026-06-05',
    weeklyPrice: 350,
    stripeUrl: 'https://buy.stripe.com/dRm00d0iP3XT6tT1b68k80a',
    description:
      "Discover the art of bringing your imagination to life! In this beginner-friendly Blender class, you'll learn how 3D characters, buildings, and entire worlds are created for animated films and video games. We'll cover the essential tools of 3D modeling and how to navigate the 3D space using Blender, a powerful free software used by creators worldwide.",
    details:
      "You'll use your new skills to design and build your own castle, and get it printed on a 3D printer! No grades-just creativity, exploration, and the chance to share your final creation with the class.",
  },
  {
    slug: 'product-design-ai',
    name: 'Product Design and Prototyping with AI Tools',
    dateLabel: '6/8 - 6/12',
    startDate: '2026-06-08',
    endDate: '2026-06-12',
    weeklyPrice: 350,
    stripeUrl: 'https://buy.stripe.com/9B6fZb5D9amhbOd7zu8k80c',
    description:
      "In this hands-on class, students will learn the core skills of product design and bring their ideas to life with the AI-powered IDE. They'll work both individually and collaboratively-brainstorming, designing screens, planning user flows, and building features together as a team.",
    details:
      "By the end of the course, each student will have created their own app -a portfolio-ready project that showcases creativity, collaboration, and technical skill for college applications.",
  },
  {
    slug: 'unity-l1',
    name: 'Unity Game Design and Intro to coding with C# (Level 1)',
    dateLabel: '6/15 - 6/19',
    startDate: '2026-06-15',
    endDate: '2026-06-19',
    weeklyPrice: 350,
    stripeUrl: 'https://buy.stripe.com/bJe9AN8Pl7a57xX3je8k80b',
    description:
      "Jump into the world of game creation with this beginner-friendly Unity course! Students learn the basics of 2D game design, coding, and animation while building their very own playable platformer. Using Unity and C#, students create characters, obstacles, collectibles, and a complete level-learning real coding concepts through hands-on creativity.",
    details:
      'Perfect for beginners who want to bring their ideas to life and start their journey into game development while learning how to code!',
  },
  {
    slug: 'blender-l2',
    name: 'Fundamentals of 3D Modeling and Design with Blender (Level 2)',
    dateLabel: '6/22 - 6/26',
    startDate: '2026-06-22',
    endDate: '2026-06-26',
    weeklyPrice: 350,
    stripeUrl: 'https://buy.stripe.com/eVq9AN5D92TP4lL0728k804',
    prerequisite: 'Fundamentals of 3D Modeling and Design with Blender (Level 1)',
    description:
      'Take your 3D skills to the next level in this immersive Level 2 Blender camp! Students dive deeper into modeling, sculpting, materials, and lighting while learning advanced tools like modifiers, rigging basics, particle effects, and scene optimization.',
    details:
      'Campers work on a more complex hero project-from characters to environments-and bring their designs to life with animation essentials. Perfect for students who completed Level 1, this camp boosts creativity, technical skills, and confidence in professional 3D design workflows.',
  },
  {
    slug: 'unity-l2',
    name: 'Unity Game Design and Intro to coding with C# (Level 2)',
    dateLabel: '6/29 - 7/2',
    startDate: '2026-06-29',
    endDate: '2026-07-02',
    weeklyPrice: 350,
    stripeUrl: 'https://buy.stripe.com/5kQeV76Hd7a55pP8Dy8k805',
    prerequisite: 'Unity Game Design Level 1',
    description:
      "Level up your game-building skills in this advanced Unity camp! Students expand on their Level 1 foundation by creating a more complex 2D or 3D game with enhanced mechanics, polished visuals, and smarter C# scripts. They'll learn enemy AI, animations, UI menus, sound effects, and game-ready interactions while building a full playable level.",
    details:
      'Perfect for students who completed Level 1 and are ready for deeper coding, creative design challenges, and real game-development techniques. Students leave with a more advanced project they can proudly showcase and continue improving!',
  },
  {
    slug: 'robotics-l1',
    name: 'Robotics - Level 1 Turn Ideas into Smart Creations with Arduino!',
    dateLabel: '7/6 - 7/10',
    startDate: '2026-07-06',
    endDate: '2026-07-10',
    weeklyPrice: 550,
    stripeUrl: 'https://buy.stripe.com/bJefZb3v16616tT4ni8k806',
    description:
      "In this exciting 1-week camp, students become inventors-building circuits, writing code, and bringing their ideas to life. They'll create interactive projects like motion alarms, auto night lights, and reaction games while learning the fundamentals of electronics and programming. Perfect for beginners, this program builds confidence, creativity, and real-world STEM skills.",
  },
  {
    slug: 'robotics-l2',
    name: 'Robotics - Level 2 Level Up Your Arduino Creations!',
    dateLabel: '7/13 - 7/17',
    startDate: '2026-07-13',
    endDate: '2026-07-17',
    weeklyPrice: 550,
    stripeUrl: 'https://buy.stripe.com/4gMaER3v1cupcSh3je8k807',
    description:
      "Ready to go beyond the basics? In this advanced Arduino camp, students build more powerful, interactive systems by combining sensors, motors, and logic. From smart security systems to automated devices, campers will tackle bigger challenges, improve their coding skills, and create a more sophisticated project they'll be proud to showcase.",
  },
  {
    slug: 'blender-l3',
    name: 'Fundamentals of 3D Modeling and Design with Blender (Level 3)',
    dateLabel: '7/20 - 7/24',
    startDate: '2026-07-20',
    endDate: '2026-07-24',
    weeklyPrice: 350,
    stripeUrl: 'https://buy.stripe.com/6oUdR35D90LH19zcTO8k808',
    prerequisite: 'Fundamentals of 3D Modeling and Design with Blender (Level 2)',
    description:
      "Take your 3D skills even further in this advanced Blender camp! Students create a polished, portfolio-ready project using advanced modeling, sculpting, texturing, lighting, and animation techniques. They'll explore more complex workflows, refine details, and optimize scenes for realistic results. Perfect for students ready to produce high-quality designs and showcase professional-level 3D work.",
  },
  {
    slug: 'unity-l3',
    name: 'Unity Game Design and C# Programming (Level 3)',
    dateLabel: '7/27 - 7/31',
    startDate: '2026-07-27',
    endDate: '2026-07-31',
    weeklyPrice: 350,
    stripeUrl: 'https://buy.stripe.com/8x2cMZ3v11PLg4tg608k809',
    prerequisite: 'Unity Game Design Level 2',
    description:
      "Take your skills to the next level in this advanced Unity camp! Students build a more complete 2D or 3D game with deeper systems like player progression, advanced AI, UI, and polished interactions. They'll strengthen C# skills, organize larger projects, and refine gameplay through testing and iteration. Perfect for students ready to create a portfolio-ready game.",
  },
]

export function formatProgramOptionLabel(program: {
  name: string
  weeklyPrice: number
  dateLabel: string
}) {
  return `${program.name} — $${program.weeklyPrice}/Week — ${program.dateLabel}`
}

export function getStripeUrlForJeiSlug(slug: string): string | undefined {
  return JEI_PROGRAMS.find((p) => p.slug === slug)?.stripeUrl
}
