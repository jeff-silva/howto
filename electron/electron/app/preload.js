window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const element = document.elementFromPoint(200, 100);

    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    });

    element.dispatchEvent(clickEvent);
    console.log("Clique simulado no elemento:", element);
  }, 2000);
});
