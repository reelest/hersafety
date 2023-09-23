import { useCSRFToken } from "@/logic/api";

export default function FormCSRF() {
  const csrfToken = useCSRFToken();
  return (
    <input
      name="csrfmiddlewaretoken"
      value={csrfToken}
      style={{ display: "none" }}
      aria-hidden
    />
  );
}
