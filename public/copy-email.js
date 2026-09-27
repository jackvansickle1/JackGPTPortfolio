const copyText = async (value) => {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // Fall through to the selection-based path for restricted browsers.
    }
  }

  const field = document.createElement("textarea");
  field.value = value;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.append(field);
  field.select();

  try {
    return document.execCommand("copy");
  } finally {
    field.remove();
  }
};

for (const button of document.querySelectorAll("[data-copy-email]")) {
  button.addEventListener("click", async () => {
    const statusId = button.getAttribute("aria-describedby");
    const status = statusId ? document.getElementById(statusId) : null;
    const email = button.dataset.copyEmail;

    button.disabled = true;
    try {
      const copied = await copyText(email);
      if (!copied) throw new Error("Copy command unavailable");
      if (status) status.textContent = "Project email copied.";
    } catch {
      if (status) status.textContent = `Copy unavailable. Select ${email}.`;
    } finally {
      button.disabled = false;
    }
  });
}
