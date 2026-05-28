import "@hotwired/turbo-rails"
import "./controllers"

alert("application.jsが読み込まれています");

document.addEventListener("turbo:load", () => {
  console.log("読み上げJSが読み込まれました");

  const speakButtons = document.querySelectorAll(".note-speak-button");
  console.log("読み上げボタンの数:", speakButtons.length);

  speakButtons.forEach((button) => {
    button.addEventListener("click", () => {
      alert("読み上げボタンがクリックされました");

      const text = button.dataset.text;

      if (!text) {
        alert("読み上げる本文がありません");
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);

      window.speechSynthesis.cancel();

      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 100);
    });
  });
});