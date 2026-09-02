export const publicSiteMetadata = {
  canonicalUrl: 'https://www.josephtabalonjr.com/',
  title: 'Joseph Tabalon | Senior Data Scientist',
  description:
    'Senior Data Scientist building machine-learning systems from rigorous modeling and evaluation through reliable, secure deployment.',
  socialPreviewUrl: 'https://www.josephtabalonjr.com/social-preview.png',
  socialPreviewAlt: 'Joseph Tabalon, Senior Data Scientist',
  portraitUrl: 'https://www.josephtabalonjr.com/joseph-tabalon.png',
  githubProfileUrl: 'https://github.com/jtabalon',
} as const;

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
    publication: {
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
        {
          label: 'View GitHub profile',
          href: 'https://github.com/jtabalon',
        },
      ],
    },
  },
  careerSnapshot: {
    id: 'career',
    title: 'Career Snapshot',
    entries: [
      {
        organization: 'VivSoft Technologies',
        role: 'Data Scientist, progressing to Senior Data Scientist',
        period: '2021 — Present',
        description:
          'A progression delivering production machine learning in security-conscious environments across modeling, data systems, and deployment.',
        link: null,
      },
      {
        organization: 'San Diego State University',
        role: 'Research Assistant',
        period: '2020 — 2022',
        description:
          'Medical-imaging research contributing to the LungQuant published work.',
        link: {
          label: 'View the published work',
          href: '/#work',
        },
      },
      {
        organization: 'Earlier experience',
        role: 'Air Force Research Laboratory · California Air National Guard',
        period: '2020 — 2023',
        description:
          'Machine-learning research and technical service in mission-focused environments.',
        link: null,
      },
    ],
    education: {
      label: 'Education',
      description:
        'M.S. Statistics, 2022 · B.S. Mathematics (Computer Science emphasis), 2020 · San Diego State University',
    },
  },
  about: {
    id: 'about',
    title: 'About',
    paragraphs: [
      'I’m most interested in the work between a promising model and a dependable system. I move from problem framing, modeling, and evaluation into the data and deployment decisions that make machine learning useful in production.',
      'I work through constraints early and in the open, partnering with product, engineering, and domain collaborators to understand tradeoffs, reduce surprises, and deliver systems people can trust.',
    ],
  },
  contact: {
    id: 'contact',
    title: 'Contact',
    description:
      'I’d be glad to hear about senior production-ML roles where careful modeling, evaluation, and deployment matter.',
    emailLabel: 'Email me',
    emailAddress: 'joseph@tabalon.io',
    emailHref: 'mailto:joseph@tabalon.io',
    linkedInLabel: 'LinkedIn',
    linkedInHref: 'https://www.linkedin.com/in/josephtabalonjr',
  },
} as const;
