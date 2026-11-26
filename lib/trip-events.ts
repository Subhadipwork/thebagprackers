/** The enquiry form tells the line-art camp scene how the trip is coming along. */
export const TRIP_EVENT = "backpackers:trip";

export type TripDetail = {
  /** Share of the required fields filled in, 0–1. */
  progress: number;
  /** "one": a hiker cheers (a field was just completed) · "all": the whole group (form sent). */
  cheer?: "one" | "all";
};

export function emitTrip(detail: TripDetail) {
  window.dispatchEvent(new CustomEvent<TripDetail>(TRIP_EVENT, { detail }));
}
