// `emoji` — необязательное поле, оставлено для документации.

export const LEVELS = [
  {
    id: 1,
    name: 'Мелководье',
    emoji: '🐚',
    icon: 'shell',
    sky: ['#00789e', '#003d56'],
    speedMult: 1.0,
    cols: 7,
    rows: 4,
    layout: [1, 0, 1, 0, 1, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 2, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  },
  {
    id: 2,
    name: 'Риф',
    emoji: '🪸',
    icon: 'coral',
    sky: ['#004f72', '#001f2e'],
    speedMult: 1.16,
    cols: 7,
    rows: 4,
    layout: [2, 1, 2, 1, 2, 1, 2, 1, 3, 1, 2, 1, 3, 1, 2, 1, 3, 2, 3, 1, 2, 1, 2, 1, 3, 1, 2, 1],
  },
  {
    id: 3,
    name: 'Глубины',
    emoji: '🪼',
    icon: 'jellyfish',
    sky: ['#002235', '#000c16'],
    speedMult: 1.32,
    cols: 7,
    rows: 4,
    layout: [4, 2, 3, 2, 3, 2, 4, 2, 3, 2, 3, 2, 3, 2, 3, 5, 3, 4, 3, 5, 3, 2, 3, 3, 2, 3, 3, 2],
  },
  {
    id: 4,
    name: 'Кит в сетях',
    emoji: '🐋',
    icon: 'whale',
    sky: ['#000510', '#000002'],
    speedMult: 1.45,
    cols: 7,
    rows: 2,
    isWhaleLvl: true,
    layout: [1, 0, 2, 0, 1, 0, 2, 0, 2, 0, 1, 0, 2, 0],
  },
];

function validateLevels(levels) {
  levels.forEach((level, index) => {
    const expected = level.cols * level.rows;

    if (level.layout.length !== expected) {
      throw new Error(
        `[levels] Invalid layout length for level ${index + 1} (${level.name}): expected ${expected}, got ${level.layout.length}`,
      );
    }
  });
}

validateLevels(LEVELS);
