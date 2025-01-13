export const getLastName = (fullName: string) => {
  // Convert string name to standard form, remove accents and convert to lowercase
  const normalizedFullName = fullName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  // Split string into words
  const words = normalizedFullName.split(' ').filter((word) => word.trim() !== '');

  // Get the last word in the words array
  const lastWord = words.length > 0 ? words[words.length - 1] : '';

  return lastWord;
};
