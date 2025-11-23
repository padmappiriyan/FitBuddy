// Capitalize first letter
export const capitalize = (text: string): string => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Format muscle name → chest → Chest
export const formatMuscle = (muscle: string): string => {
  return capitalize(muscle.replace("_", " "));
};

// Format difficulty → beginner → Beginner
export const formatDifficulty = (level: string): string => {
  return capitalize(level);
};

// Truncate long exercise names or descriptions
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Filter exercises by search keyword
export const filterExercises = (list: any[], keyword: string): any[] => {
  if (!keyword) return list;
  return list.filter((item) =>
    item.name.toLowerCase().includes(keyword.toLowerCase())
  );
};

// Group exercises by muscle category
export const groupByMuscle = (exercises: any[]) => {
  return exercises.reduce((groups: any, item) => {
    const muscle = item.muscle;
    if (!groups[muscle]) groups[muscle] = [];
    groups[muscle].push(item);
    return groups;
  }, {});
};
