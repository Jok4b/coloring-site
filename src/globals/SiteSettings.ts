import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: { group: 'Settings' },
  access: { read: () => true },
  fields: [
    { name: 'siteName', type: 'text', defaultValue: 'Coloring Pages', required: true, admin: { description: 'Shown in the header and in Google titles.' } },
    {
      name: 'heroTitle',
      label: 'Home headline',
      type: 'text',
      defaultValue: 'What do you want to color?',
    },
    {
      name: 'heroText',
      label: 'Home text',
      type: 'textarea',
      defaultValue: 'Free coloring pages you can print in one click, or color right here on your phone, tablet or computer.',
    },
    {
      name: 'homeDescription',
      label: 'Google description for the home page',
      type: 'textarea',
      defaultValue: 'Free printable coloring pages for kids and adults. Print in one click, download a PDF, or color online.',
    },
    { name: 'footerText', type: 'textarea', defaultValue: 'Free to print for home and classroom use.' },
  ],
}
