export const sanitizeText = (value: string) =>
  value.replace(/[<>]/g, "").trim();
