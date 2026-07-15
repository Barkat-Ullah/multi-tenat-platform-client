export const ONSITE_REQUEST_DRAFT_KEY = "onSiteRequestDraft";
export const ONSITE_REQUEST_AUTH_RETURN_KEY = "onSiteRequestAuthReturn";
export const ONSITE_REQUEST_RESUME_PATH = "/business?onsiteResume=1#request-form-section";

export interface OnSiteRequestDraft {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  medicalRequired: string;
  candidatesCount: string;
}

export const saveOnSiteRequestDraft = (draft: OnSiteRequestDraft) => {
  sessionStorage.setItem(ONSITE_REQUEST_DRAFT_KEY, JSON.stringify(draft));
  sessionStorage.setItem(ONSITE_REQUEST_AUTH_RETURN_KEY, ONSITE_REQUEST_RESUME_PATH);
};

export const getOnSiteRequestDraft = (): OnSiteRequestDraft | null => {
  try {
    const stored = sessionStorage.getItem(ONSITE_REQUEST_DRAFT_KEY);
    if (!stored) return null;

    const draft = JSON.parse(stored) as Partial<OnSiteRequestDraft>;
    if (
      typeof draft.name !== "string" ||
      typeof draft.email !== "string" ||
      typeof draft.phone !== "string" ||
      typeof draft.businessName !== "string" ||
      typeof draft.medicalRequired !== "string" ||
      typeof draft.candidatesCount !== "string"
    ) {
      return null;
    }

    return draft as OnSiteRequestDraft;
  } catch {
    return null;
  }
};

export const clearOnSiteRequestResume = () => {
  sessionStorage.removeItem(ONSITE_REQUEST_DRAFT_KEY);
  sessionStorage.removeItem(ONSITE_REQUEST_AUTH_RETURN_KEY);
};
