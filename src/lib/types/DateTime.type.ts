/**
 * Date time range properties.
 * @param startDate with format 'YYYY-MM-DD'
 * @param endDate with format 'YYYY-MM-DD'
 * @param startEndTime with format 'HH:mm'
 * @param [timezoneOffset] in hours
 */
export type DateTimeRange = {
  startDate: string;
  endDate: string;
  startEndTime: string;
  timezoneOffset?: number;
};

/**
 * Calculated date time range.
 * @param startdateTime with format 'YYYY-MM-DD HH:mm:ss:SSS'
 * @param endDateTime with format 'YYYY-MM-DD HH:mm:ss:SSS'
 * @param totalDays total number of days in range
 */
export type CalculatedDateTimeRange = {
  startDateTime: string;
  endDateTime: string;
  totalDays: number;
};
