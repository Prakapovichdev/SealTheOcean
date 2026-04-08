export const BONUS_DEFS = [
  {
    kind: 'wide',
    color: '#22f0a8',
    icon: 'wide',
    label: 'Широкая платформа',
    desc: '+платформа 6 сек',
  },
  {
    kind: 'slow',
    color: '#4cc9f0',
    icon: 'turtle',
    label: 'Замедление',
    desc: 'мяч медленнее 5 сек',
  },
  {
    kind: 'life',
    color: '#ff6b9d',
    icon: 'heart',
    label: '+1 жизнь',
    desc: 'так держать',
  },
  {
    kind: 'fire',
    color: '#ffe066',
    icon: 'fire',
    label: 'Звёздный взрыв',
    desc: '+120 очков',
  },
];

export function getRandomBonusDef() {
  return BONUS_DEFS[Math.floor(Math.random() * BONUS_DEFS.length)];
}
