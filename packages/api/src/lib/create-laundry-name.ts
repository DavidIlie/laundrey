import { formatDistance } from "date-fns";

export const createLaundryEventName = (date: Date) => {
   return `${formatDistance(date, new Date(), {
      addSuffix: true,
   })}'s Laundry`;
};
