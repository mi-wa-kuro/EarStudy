import "@hotwired/turbo-rails"
import "./controllers"

document.addEventListener("turbo:load", () => {
  const playButtonIcon = document.getElementById("play-button-icon");
  const noteItems = document.querySelectorAll(".note-item");
  const selectedNoteTitle = document.getElementById("selected-note-title");
  const playButton = document.querySelector(".play-button");
  const repeatButton = document.querySelector(".repeat-button");
  const editLink = document.getElementById("selected-note-edit-link");
  const deleteLink = document.getElementById("selected-note-delete-link");

  let selectedNoteContent = "";
  let selectedNoteId = "";
  let isPaused = false;
  let isRepeat = false;

  if (repeatButton) {
    repeatButton.addEventListener("click", () => {
      isRepeat = !isRepeat;

      if (isRepeat) {
        repeatButton.classList.add("repeat-button--active");
      } else {
        repeatButton.classList.remove("repeat-button--active");
      }
    });
  }

  noteItems.forEach((noteItem) => {
    noteItem.addEventListener("click", () => {
      const id = noteItem.dataset.noteId;
      const title = noteItem.dataset.noteTitle;
      const content = noteItem.dataset.noteContent;

      noteItems.forEach((item) => {
        item.classList.remove("note-item--selected");
      });

      noteItem.classList.add("note-item--selected");

      if (selectedNoteTitle && title) {
        selectedNoteTitle.textContent = title;
      }

      selectedNoteContent = content;
      selectedNoteId = id;

      if (editLink) {
        editLink.href = `/notes/${selectedNoteId}/edit`;
      }

      if (deleteLink) {
        deleteLink.href = `/notes/${selectedNoteId}`;
    }
    });
  });

  if (playButton) {
    playButton.addEventListener("click", () => {
      if (!selectedNoteContent) {
        alert("読み上げるノートを選択してください");
        return;
      }

      if (speechSynthesis.paused) {
        speechSynthesis.resume();
        playButtonIcon.src = "/assets/pause.png";
        isPaused = false;
        return;
      }

      if (speechSynthesis.speaking) {
        speechSynthesis.pause();
        playButtonIcon.src = "/assets/play.png";
        isPaused = true;
        return;
      }

      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(selectedNoteContent);
      utterance.lang = "ja-JP";
      utterance.rate = 1;
      utterance.pitch = 1;

      utterance.onend = () => {
        isPaused = false;

        if (isRepeat && selectedNoteContent) {
          const repeatUtterance = new SpeechSynthesisUtterance(selectedNoteContent);
          repeatUtterance.lang = "ja-JP";
          repeatUtterance.rate = 1;
          repeatUtterance.pitch = 1;

          repeatUtterance.onend = utterance.onend;

          speechSynthesis.speak(repeatUtterance);
          playButtonIcon.src = "/assets/pause.png";
          return;
        }

        playButtonIcon.src = "/assets/play.png";
      };

      speechSynthesis.speak(utterance);
      playButtonIcon.src = "/assets/pause.png";
    });
  }
  if (editLink) {
  editLink.addEventListener("click", (event) => {
    if (!selectedNoteId) {
      event.preventDefault();
      alert("編集するノートを選択してください");
    }
  });
}

if (deleteLink) {
  deleteLink.addEventListener("click", (event) => {
    if (!selectedNoteId) {
      event.preventDefault();
      alert("削除するノートを選択してください");
    }
  });
}

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

      if (playButtonIcon) {
        playButtonIcon.src = "/assets/play.png";
        playButtonIcon.alt = "再生";
      }

      isPaused = false;
    });
  }
});