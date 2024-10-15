import dayjs from "dayjs";

export default () => {
  return {
    date(value) {
      return dayjs(value).format("DD/MM/YYYY");
    },
  };
};
