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
  publishedWork: {
    id: 'work',
    title: 'Published Work',
    item: {
      name: 'LungQuant',
      publicationTitle:
        'CNN-based Deformable Registration Facilitates Fast and Accurate Air Trapping Measurements at Inspiratory and Expiratory CT',
      publicationMeta: 'Radiology: Artificial Intelligence · 2022',
      contribution:
        'As a co-author, Joseph made substantial coding contributions to the released LungQuant pipeline as part of the research team.',
      links: [
        {
          label: 'Read the peer-reviewed paper',
          href: 'https://doi.org/10.1148/ryai.2021210211',
        },
        {
          label: 'Inspect the public GitHub repository',
          href: 'https://github.com/jtabalon/LungQuant',
        },
      ],
    },
  },
  sections: [
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
