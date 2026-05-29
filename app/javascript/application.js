import "@hotwired/turbo-rails"
import "./controllers"

document.addEventListener("turbo:load", () => {
  const speakButtons = document.querySelectorAll(".note-speak-button");
  const stopButton = document.querySelector(".stop-button");

  speakButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const text = button.dataset.text;

      if (!text) {
        alert("読み上げる本文がありません");
        return;
      }

      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      utterance.rate = 1;
      utterance.pitch = 1;

      speechSynthesis.speak(utterance);
    });
  });

  if (stopButton) {
    stopButton.addEventListener("click", () => {
      speechSynthesis.cancel();
    });
  }
});