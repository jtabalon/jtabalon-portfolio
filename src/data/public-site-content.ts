export const publicSiteContent = {
  name: 'Joseph Tabalon',
  role: 'Senior Data Scientist',
  hero: {
    headline: 'Machine learning that holds up beyond the notebook.',
    valueProposition:
      'I build machine-learning systems from rigorous modeling and evaluation through reliable, secure deployment.',
    contactContext: 'About a senior production-ML role.',
    emailLabel: 'Email me',
    emailHref: 'mailto:joseph@tabalon.io',
  },
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
