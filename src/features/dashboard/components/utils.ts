export const getMonthLabels = (count: number) => {
  const labels = [];
  const currentDate = new Date();

  for (let i = 0; i < count; i++) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    );
    labels.unshift(
      date.toLocaleString("default", { month: "short", year: "numeric" })
    );
  }
  return labels;
};
