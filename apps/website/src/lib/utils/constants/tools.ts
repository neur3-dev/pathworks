interface Tool {
  src: string;
  title: string;
  subText: string;
  slug: string;
  show: boolean;
  showFeature: boolean;
}

export const tools: Tool[] = [
  {
    src: '/free-tools/progress-report.svg',
    title: 'Progress Report',
    subText: 'Build a personal progress card you can share with a counselor, parent, or yourself.',
    slug: 'progress',
    show: true,
    showFeature: true
  },
  {
    src: '/free-tools/pomodoro.svg',
    title: 'Pomodoro Timer',
    subText: 'Twenty-five minutes of focus, five minutes of break. ADHD-friendly focus structure.',
    slug: 'pomodoro',
    show: true,
    showFeature: false
  },
  {
    src: '/free-tools/name-picker.svg',
    title: 'Random Name Picker',
    subText: 'Pull a name fairly. Useful for group activities or rotating turns.',
    slug: 'name-picker',
    show: true,
    showFeature: false
  },
  {
    src: '/free-tools/activity-stopwatch.svg',
    title: 'Activity Stopwatch',
    subText: 'Time a task without a countdown. Stop when you are done, not when a timer says you are.',
    slug: 'stopwatch',
    show: true,
    showFeature: true
  },
  {
    src: '/free-tools/tic-tac.svg',
    title: 'Tic Tac Toe',
    subText: 'A small game for a moment of decompression between modules.',
    slug: 'tic-tac-toe',
    show: true,
    showFeature: true
  }
];
