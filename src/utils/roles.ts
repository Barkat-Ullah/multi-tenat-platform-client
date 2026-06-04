export const normalizeRole = (role?: string | null) => {
  if (role === "AGENCY") return "USER";
  return role || "USER";
};

export const getDashboardPathByRole = (role?: string | null) => {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === "ADMIN") return "/dashboard/admin";
  if (normalizedRole === "CLINIC") return "/dashboard/clinic";
  if (normalizedRole === "ORGINIZER") return "/dashboard/orginizer";
  return "/dashboard/user";
};
