export const BOOKING_DRAFT_KEY = "bookingDraft";
export const BOOKING_AUTH_RETURN_KEY = "bookingAuthReturn";
export const BOOKING_RESUME_PATH = "/booking?resume=1";

export interface BookingDraft {
  serviceId: string;
  clinicId: string;
  date: string;
  slotId: string;
}

export const saveBookingDraft = (draft: BookingDraft) => {
  sessionStorage.setItem(BOOKING_DRAFT_KEY, JSON.stringify(draft));
  sessionStorage.setItem(BOOKING_AUTH_RETURN_KEY, BOOKING_RESUME_PATH);
};

export const getBookingDraft = (): BookingDraft | null => {
  try {
    const stored = sessionStorage.getItem(BOOKING_DRAFT_KEY);
    if (!stored) return null;

    const draft = JSON.parse(stored) as Partial<BookingDraft>;
    if (
      typeof draft.serviceId !== "string" ||
      typeof draft.clinicId !== "string" ||
      typeof draft.date !== "string" ||
      typeof draft.slotId !== "string"
    ) {
      return null;
    }

    return draft as BookingDraft;
  } catch {
    return null;
  }
};

export const clearBookingResume = () => {
  sessionStorage.removeItem(BOOKING_DRAFT_KEY);
  sessionStorage.removeItem(BOOKING_AUTH_RETURN_KEY);
};
