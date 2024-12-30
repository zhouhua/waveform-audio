export type GradientKey = 'purple' | 'yellow' | 'green' | 'blue' | 'indigo' | 'pink' | 'orange';

export const gradientMap: Record<GradientKey, string> = {
  purple: 'linear-gradient(135deg, rgb(233 213 255 / 33%) 0%, rgb(251 207 232 / 33%) 100%)',
  yellow: 'linear-gradient(135deg, rgb(254 240 138 / 33%) 0%, rgb(253 186 116 / 33%) 100%)',
  green: 'linear-gradient(135deg, rgb(187 247 208 / 33%) 0%, rgb(167 243 208 / 33%) 100%)',
  blue: 'linear-gradient(135deg, rgb(191 219 254 / 33%) 0%, rgb(165 243 252 / 33%) 100%)',
  indigo: 'linear-gradient(135deg, rgb(199 210 254 / 33%) 0%, rgb(233 213 255 / 33%) 100%)',
  pink: 'linear-gradient(135deg, rgb(251 207 232 / 33%) 0%, rgb(254 205 211 / 33%) 100%)',
  orange: 'linear-gradient(135deg, rgb(254 215 170 / 33%) 0%, rgb(254 202 202 / 33%) 100%)',
}; 