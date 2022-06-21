export const getRandomColor = () => {
  const colors = [
    '#ffd6e8',
    '#ffbfd8',
    '#fca1d9',
    '#a3f2ff',
    '#b2f726',
    '#bffffa',
    '#27d9f7',
    '#fefb6b',
    '#fcab64',
    '#80ffdb',
    '#e773ad',
    '#f3b0ff',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
