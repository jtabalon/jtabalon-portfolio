export const publicSiteContent = {
  name: 'Joseph Tabalon',
  role: 'Senior Data Scientist',
  navigation: [
    { label: 'Work', targetId: 'work' },
    { label: 'About', targetId: 'about' },
    { label: 'Contact', targetId: 'contact' },
  ],
  sections: [
    {
      id: 'work',
      title: 'Work',
      description: 'Selected public work and supporting evidence.',
    },
    {
      id: 'about',
      title: 'About',
      description: 'A concise introduction to how I approach production machine learning.',
    },
    {
      id: 'contact',
      title: 'Contact',
      description: 'Ways to get in touch about relevant work.',
    },
  ],
} as const;
