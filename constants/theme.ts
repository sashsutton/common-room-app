export const Colors = {
  primary: '#465362',
  accent: '#EAC67A',
  secondary: '#AEC6CF',
  background: '#F6F6F3',
  text: '#2B2B2B',
  subtext: '#999999',
  error: '#B05A5A',
} as const;

export const CategoryColors: Record<string, string> = {
  'Creativity, culture and legacy': '#E6CFF1',
  'Health and wellbeing': '#A7D7C5',
  'Lifework and resilience': '#C1C8E4',
  'Relationships and belonging': '#F6B5B5',
  'Self development and inner growth': '#F5DEB3',
};

export const Typography = {
  heading: { fontFamily: 'Georgia', fontSize: 24, lineHeight: 32 },
  subheading: { fontFamily: 'Georgia', fontSize: 18, lineHeight: 26 },
  body: { fontSize: 16, lineHeight: 24 },
  label: { fontSize: 14, lineHeight: 20 },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const MIN_TOUCH_TARGET = 44;
