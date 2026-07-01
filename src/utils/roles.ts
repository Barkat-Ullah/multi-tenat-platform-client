export type BackendRole = "USER" | "ORGINIZER" | "CLINIC" | "ADMIN" | "SUPERADMIN";

export const normalizeRole = (role?: string | null): BackendRole => {
  const normalized = role?.trim().toUpperCase();

  if (normalized === "SUPER_ADMIN") return "SUPERADMIN";
  if (normalized === "ORGANIZER") return "ORGINIZER";
  if (normalized === "AGENCY") return "USER";

  if (
    normalized === "USER" ||
    normalized === "ORGINIZER" ||
    normalized === "CLINIC" ||
    normalized === "ADMIN" ||
    normalized === "SUPERADMIN"
  ) {
    return normalized;
  }

  return "USER";
};

export const getDashboardPathByRole = (role?: string | null) => {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === "SUPERADMIN") return "/dashboard/super-admin";
  if (normalizedRole === "ADMIN") return "/dashboard/admin";
  if (normalizedRole === "CLINIC") return "/dashboard/clinic";
  if (normalizedRole === "ORGINIZER") return "/dashboard/orginizer";
  return "/dashboard/user";
};
