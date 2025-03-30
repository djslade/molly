export const toTitleCase = (title: string) => {
  return title
    .toLowerCase()
    .split(" ")
    .map((word: any) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};
