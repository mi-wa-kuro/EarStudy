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
  const speakButtons = document.querySelectorAll(".note-speak-button");
  const stopButton = document.querySelector(".stop-button");

  let selectedNoteContent = "";
  let selectedNoteId = "";
  let isRepeat = false;

  const resetSpeech = () => {
    speechSynthesis.resume();
    speechSynthesis.cancel();

    if (playButtonIcon) {
      playButtonIcon.src = playButtonIcon.dataset.playSrc;
      playButtonIcon.alt = "再生";
    }
  };

  if (repeatButton) {
    repeatButton.addEventListener("click", () => {
      isRepeat = !isRepeat;
      repeatButton.classList.toggle("repeat-button--active", isRepeat);
    });
  }

  noteItems.forEach((noteItem) => {
    noteItem.addEventListener("click", () => {
      resetSpeech();

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

      if (speechSynthesis.paused && speechSynthesis.speaking) {
        speechSynthesis.resume();

        if (playButtonIcon) {
          playButtonIcon.src = playButtonIcon.dataset.pauseSrc;
        }

        return;
      }

      if (speechSynthesis.speaking) {
        speechSynthesis.pause();

        if (playButtonIcon) {
          playButtonIcon.src = playButtonIcon.dataset.playSrc;
        }

        return;
      }

      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(selectedNoteContent);
      utterance.lang = "ja-JP";
      utterance.rate = 1;
      utterance.pitch = 1;

      utterance.onend = () => {
        if (isRepeat && selectedNoteContent) {
          speechSynthesis.speak(utterance);

          if (playButtonIcon) {
            playButtonIcon.src = playButtonIcon.dataset.pauseSrc;
          }

          return;
        }

        if (playButtonIcon) {
          playButtonIcon.src = playButtonIcon.dataset.playSrc;
        }
      };

      speechSynthesis.speak(utterance);

      if (playButtonIcon) {
        playButtonIcon.src = playButtonIcon.dataset.pauseSrc;
      }
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
      resetSpeech();
    });
  }
});