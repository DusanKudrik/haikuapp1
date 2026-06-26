document.addEventListener("DOMContentLoaded", function () {
  const menuScreen = document.getElementById("menu-screen");
  const newHaikuScreen = document.getElementById("new-haiku-screen");
  const listScreen = document.getElementById("list-screen");
  const detailScreen = document.getElementById("detail-screen");
  const settingsScreen = document.getElementById("settings-screen");
  const aboutScreen = document.getElementById("about-screen");

  const appMessageCard = document.getElementById("app-message-card");
  const appMessageTitle = document.getElementById("app-message-title");
  const appMessageText = document.getElementById("app-message-text");

  const deleteModal = document.getElementById("delete-modal");
  const cancelDeleteButton = document.getElementById("cancel-delete-button");
  const confirmDeleteButton = document.getElementById("confirm-delete-button");

  const newHaikuButton = document.getElementById("new-haiku-button");
  const readHaikusButton = document.getElementById("read-haikus-button");
  const createFromListButton = document.getElementById("create-from-list-button");
  const settingsButton = document.getElementById("settings-button");
  const aboutButton = document.getElementById("about-button");
  const themeToggleButton = document.getElementById("theme-toggle-button");

  const backFromNewButton = document.getElementById("back-from-new-button");
  const backFromListButton = document.getElementById("back-from-list-button");
  const backFromDetailButton = document.getElementById("back-from-detail-button");
  const backFromSettingsButton = document.getElementById("back-from-settings-button");
  const backFromAboutButton = document.getElementById("back-from-about-button");

  const saveHaikuButton = document.getElementById("save-haiku-button");
  const deleteHaikuButton = document.getElementById("delete-haiku-button");
  const editHaikuButton = document.getElementById("edit-haiku-button");

  const exportHaikusButton = document.getElementById("export-haikus-button");
  const importHaikusButton = document.getElementById("import-haikus-button");
  const importFileInput = document.getElementById("import-file-input");

  const formTitle = document.getElementById("form-title");

  const titleInput = document.getElementById("haiku-title");
  const lineOneInput = document.getElementById("line-one");
  const lineTwoInput = document.getElementById("line-two");
  const lineThreeInput = document.getElementById("line-three");

  const formMessage = document.getElementById("form-message");
  const haikuList = document.getElementById("haiku-list");
  const searchInput = document.getElementById("search-input");

  const detailTitle = document.getElementById("detail-title");
  const detailDate = document.getElementById("detail-date");
  const detailUpdatedDate = document.getElementById("detail-updated-date");
  const detailLineOne = document.getElementById("detail-line-one");
  const detailLineTwo = document.getElementById("detail-line-two");
  const detailLineThree = document.getElementById("detail-line-three");

  let selectedHaikuId = null;
  let editMode = false;
  let appMessageTimer = null;

  function safeClick(element, handler) {
    if (element) {
      element.addEventListener("click", handler);
    }
  }

  function showAppMessage(type, title, text) {
    if (!appMessageCard || !appMessageTitle || !appMessageText) {
      return;
    }

    clearTimeout(appMessageTimer);

    appMessageCard.className = "app-message-card " + type;
    appMessageTitle.textContent = title;
    appMessageText.textContent = text;
    appMessageCard.classList.remove("hidden");

    appMessageTimer = setTimeout(function () {
      appMessageCard.classList.add("hidden");
    }, 4200);
  }

  function showDeleteModal() {
    if (deleteModal) {
      deleteModal.classList.remove("hidden");
    }
  }

  function hideDeleteModal() {
    if (deleteModal) {
      deleteModal.classList.add("hidden");
    }
  }

  function showScreen(screenToShow) {
    const screens = [
      menuScreen,
      newHaikuScreen,
      listScreen,
      detailScreen,
      settingsScreen,
      aboutScreen
    ];

    screens.forEach(function (screen) {
      if (screen) {
        screen.classList.remove("active");
      }
    });

    if (screenToShow) {
      screenToShow.classList.add("active");
    }
  }

  function getHaikus() {
    const savedHaikus = localStorage.getItem("haikus");

    if (savedHaikus === null) {
      return [];
    }

    try {
      return JSON.parse(savedHaikus);
    } catch (error) {
      showAppMessage(
        "error",
        "Storage error",
        "Your saved haiku data could not be read."
      );

      return [];
    }
  }

  function saveHaikus(haikus) {
    localStorage.setItem("haikus", JSON.stringify(haikus));
  }

  function applySavedTheme() {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");

      if (themeToggleButton) {
        themeToggleButton.textContent = "Light Mode";
      }
    } else {
      document.body.classList.remove("dark-mode");

      if (themeToggleButton) {
        themeToggleButton.textContent = "Dark Mode";
      }
    }
  }

  function toggleTheme() {
    const isDarkMode = document.body.classList.contains("dark-mode");

    if (isDarkMode) {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");

      if (themeToggleButton) {
        themeToggleButton.textContent = "Dark Mode";
      }

      showAppMessage(
        "info",
        "Light mode on",
        "Your appearance setting has been saved."
      );
    } else {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");

      if (themeToggleButton) {
        themeToggleButton.textContent = "Light Mode";
      }

      showAppMessage(
        "info",
        "Dark mode on",
        "Your appearance setting has been saved."
      );
    }
  }

  function clearForm() {
    if (titleInput) titleInput.value = "";
    if (lineOneInput) lineOneInput.value = "";
    if (lineTwoInput) lineTwoInput.value = "";
    if (lineThreeInput) lineThreeInput.value = "";

    if (formMessage) {
      formMessage.textContent = "";
      formMessage.className = "message";
    }
  }

  function resetFormToCreateMode() {
    editMode = false;
    selectedHaikuId = null;

    if (formTitle) formTitle.textContent = "New Haiku";
    if (saveHaikuButton) saveHaikuButton.textContent = "Save Haiku";

    clearForm();
  }

  function resetFormVisualsOnly() {
    editMode = false;

    if (formTitle) formTitle.textContent = "New Haiku";
    if (saveHaikuButton) saveHaikuButton.textContent = "Save Haiku";

    clearForm();
  }

  function setFormToEditMode(haiku) {
    editMode = true;
    selectedHaikuId = haiku.id;

    if (formTitle) formTitle.textContent = "Edit Haiku";
    if (saveHaikuButton) saveHaikuButton.textContent = "Save Changes";

    if (titleInput) titleInput.value = haiku.title;
    if (lineOneInput) lineOneInput.value = haiku.lineOne;
    if (lineTwoInput) lineTwoInput.value = haiku.lineTwo;
    if (lineThreeInput) lineThreeInput.value = haiku.lineThree;

    if (formMessage) {
      formMessage.textContent = "";
      formMessage.className = "message";
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();

    const month = date.toLocaleDateString("en-GB", {
      month: "long"
    });

    const day = date.getDate();

    return year + " " + month + " " + day;
  }

  function clearSearch() {
    if (searchInput) {
      searchInput.value = "";
    }
  }

  function goToCreateHaiku() {
    resetFormToCreateMode();
    showScreen(newHaikuScreen);
  }

  function saveFormHaiku() {
    const title = titleInput.value.trim();
    const lineOne = lineOneInput.value.trim();
    const lineTwo = lineTwoInput.value.trim();
    const lineThree = lineThreeInput.value.trim();

    if (title === "" || lineOne === "" || lineTwo === "" || lineThree === "") {
      formMessage.textContent = "Please fill in the title and all three lines.";
      formMessage.className = "message error";
      return;
    }

    if (editMode === true) {
      updateExistingHaiku(title, lineOne, lineTwo, lineThree);
    } else {
      createNewHaiku(title, lineOne, lineTwo, lineThree);
    }
  }

  function createNewHaiku(title, lineOne, lineTwo, lineThree) {
    const newHaiku = {
      id: Date.now().toString(),
      title: title,
      date: new Date().toISOString(),
      updatedAt: null,
      lineOne: lineOne,
      lineTwo: lineTwo,
      lineThree: lineThree
    };

    const haikus = getHaikus();

    haikus.unshift(newHaiku);

    saveHaikus(haikus);

    resetFormToCreateMode();
    clearSearch();
    renderHaikuList();
    showScreen(listScreen);

    showAppMessage(
      "success",
      "Haiku saved",
      "Your tiny poem has been added to the diary."
    );
  }

  function updateExistingHaiku(title, lineOne, lineTwo, lineThree) {
    const haikus = getHaikus();

    const updatedHaikus = haikus.map(function (haiku) {
      if (haiku.id === selectedHaikuId) {
        return {
          ...haiku,
          title: title,
          lineOne: lineOne,
          lineTwo: lineTwo,
          lineThree: lineThree,
          updatedAt: new Date().toISOString()
        };
      }

      return haiku;
    });

    saveHaikus(updatedHaikus);

    const editedHaikuId = selectedHaikuId;

    resetFormVisualsOnly();

    openHaikuDetail(editedHaikuId);

    showAppMessage(
      "success",
      "Haiku updated",
      "Your changes have been saved."
    );
  }

  function getFilteredHaikus() {
    const haikus = getHaikus();

    if (!searchInput) {
      return haikus;
    }

    const searchTerm = searchInput.value.trim().toLowerCase();

    if (searchTerm === "") {
      return haikus;
    }

    return haikus.filter(function (haiku) {
      const createdDate = formatDate(haiku.date).toLowerCase();

      const searchableText = [
        haiku.title,
        createdDate,
        haiku.lineOne,
        haiku.lineTwo,
        haiku.lineThree
      ].join(" ").toLowerCase();

      return searchableText.includes(searchTerm);
    });
  }

  function createEmptyState(title, text, showCreateButton) {
    const emptyStateCard = document.createElement("div");
    emptyStateCard.className = "empty-state-card";

    const emptyStateTitle = document.createElement("p");
    emptyStateTitle.className = "empty-state-title";
    emptyStateTitle.textContent = title;

    const emptyStateText = document.createElement("p");
    emptyStateText.className = "empty-state-text";
    emptyStateText.textContent = text;

    emptyStateCard.appendChild(emptyStateTitle);
    emptyStateCard.appendChild(emptyStateText);

    if (showCreateButton) {
      const createButton = document.createElement("button");
      createButton.className = "primary-button";
      createButton.textContent = "Create New Haiku";

      createButton.addEventListener("click", function () {
        goToCreateHaiku();
      });

      emptyStateCard.appendChild(createButton);
    }

    return emptyStateCard;
  }

  function renderHaikuList() {
    if (!haikuList) {
      return;
    }

    const allHaikus = getHaikus();
    const haikus = getFilteredHaikus();
    const searchTerm = searchInput ? searchInput.value.trim() : "";

    haikuList.innerHTML = "";

    if (allHaikus.length === 0) {
      if (searchInput) {
        searchInput.classList.add("hidden");
      }

      const emptyState = createEmptyState(
        "No haikus yet",
        "Your first tiny poem is waiting. Write a small moment before it flies away.",
        true
      );

      haikuList.appendChild(emptyState);
      return;
    }

    if (searchInput) {
      searchInput.classList.remove("hidden");
    }

    if (haikus.length === 0 && searchTerm !== "") {
      const emptyState = createEmptyState(
        "No matching haikus",
        "Nothing matched that search. Try a title, a season, a date, or a word from the poem.",
        false
      );

      haikuList.appendChild(emptyState);
      return;
    }

    haikus.forEach(function (haiku) {
      const item = document.createElement("div");
      item.className = "haiku-item";

      const title = document.createElement("p");
      title.className = "haiku-item-title";
      title.textContent = haiku.title;

      const date = document.createElement("p");
      date.className = "haiku-item-date";
      date.textContent = formatDate(haiku.date);

      item.appendChild(title);
      item.appendChild(date);

      item.addEventListener("click", function () {
        openHaikuDetail(haiku.id);
      });

      haikuList.appendChild(item);
    });
  }

  function openHaikuDetail(id) {
    const haikus = getHaikus();

    const haiku = haikus.find(function (item) {
      return item.id === id;
    });

    if (!haiku) {
      return;
    }

    selectedHaikuId = haiku.id;

    if (detailTitle) detailTitle.textContent = haiku.title;
    if (detailDate) detailDate.textContent = "Created: " + formatDate(haiku.date);

    if (detailUpdatedDate) {
      if (haiku.updatedAt) {
        detailUpdatedDate.textContent = "Last edited: " + formatDate(haiku.updatedAt);
      } else {
        detailUpdatedDate.textContent = "";
      }
    }

    if (detailLineOne) detailLineOne.textContent = haiku.lineOne;
    if (detailLineTwo) detailLineTwo.textContent = haiku.lineTwo;
    if (detailLineThree) detailLineThree.textContent = haiku.lineThree;

    showScreen(detailScreen);
  }

  function startEditingSelectedHaiku() {
    if (selectedHaikuId === null) {
      return;
    }

    const haikus = getHaikus();

    const haiku = haikus.find(function (item) {
      return item.id === selectedHaikuId;
    });

    if (!haiku) {
      return;
    }

    setFormToEditMode(haiku);
    showScreen(newHaikuScreen);
  }

  function requestDeleteSelectedHaiku() {
    if (selectedHaikuId === null) {
      return;
    }

    showDeleteModal();
  }

  function confirmDeleteSelectedHaiku() {
    if (selectedHaikuId === null) {
      hideDeleteModal();
      return;
    }

    let haikus = getHaikus();

    haikus = haikus.filter(function (haiku) {
      return haiku.id !== selectedHaikuId;
    });

    saveHaikus(haikus);

    selectedHaikuId = null;
    editMode = false;

    hideDeleteModal();
    renderHaikuList();
    showScreen(listScreen);

    showAppMessage(
      "info",
      "Haiku deleted",
      "The selected haiku was removed from this device."
    );
  }

  function exportHaikus() {
    const haikus = getHaikus();

    if (haikus.length === 0) {
      showAppMessage(
        "info",
        "Nothing to export",
        "There are no haikus to export yet."
      );

      return;
    }

    const backup = {
      app: "Haiku Diary",
      version: 1,
      exportedAt: new Date().toISOString(),
      haikus: haikus
    };

    const jsonText = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonText], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const fileName = "haiku-diary-backup-" + year + "-" + month + "-" + day + ".json";

    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = fileName;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    URL.revokeObjectURL(url);

    showAppMessage(
      "success",
      "Backup exported",
      "Your JSON backup file was created:\n" + fileName
    );
  }

  function isValidImportedHaiku(haiku) {
    return (
      haiku &&
      typeof haiku.id === "string" &&
      typeof haiku.title === "string" &&
      typeof haiku.date === "string" &&
      typeof haiku.lineOne === "string" &&
      typeof haiku.lineTwo === "string" &&
      typeof haiku.lineThree === "string"
    );
  }

  function importHaikusFromFile(file) {
    const reader = new FileReader();

    reader.onload = function (event) {
      try {
        const importedData = JSON.parse(event.target.result);

        if (
          !importedData ||
          importedData.app !== "Haiku Diary" ||
          !Array.isArray(importedData.haikus)
        ) {
          showAppMessage(
            "error",
            "Import failed",
            "This does not look like a valid Haiku Diary backup file."
          );

          return;
        }

        const currentHaikus = getHaikus();
        const existingIds = new Set(
          currentHaikus.map(function (haiku) {
            return haiku.id;
          })
        );

        const validImportedHaikus = importedData.haikus.filter(isValidImportedHaiku);

        let importedCount = 0;
        let skippedCount = 0;

        validImportedHaikus.forEach(function (haiku) {
          if (existingIds.has(haiku.id)) {
            skippedCount += 1;
          } else {
            currentHaikus.push({
              id: haiku.id,
              title: haiku.title,
              date: haiku.date,
              updatedAt: haiku.updatedAt || null,
              lineOne: haiku.lineOne,
              lineTwo: haiku.lineTwo,
              lineThree: haiku.lineThree
            });

            existingIds.add(haiku.id);
            importedCount += 1;
          }
        });

        currentHaikus.sort(function (a, b) {
          return new Date(b.date) - new Date(a.date);
        });

        saveHaikus(currentHaikus);
        clearSearch();
        renderHaikuList();

        showAppMessage(
          "success",
          "Import complete",
          "Imported: " + importedCount + "\nSkipped duplicates: " + skippedCount
        );
      } catch (error) {
        showAppMessage(
          "error",
          "Import failed",
          "The selected file could not be read as a valid JSON backup."
        );
      } finally {
        if (importFileInput) {
          importFileInput.value = "";
        }
      }
    };

    reader.readAsText(file);
  }

  safeClick(newHaikuButton, function () {
    goToCreateHaiku();
  });

  safeClick(readHaikusButton, function () {
    clearSearch();
    renderHaikuList();
    showScreen(listScreen);
  });

  safeClick(createFromListButton, function () {
    goToCreateHaiku();
  });

  safeClick(settingsButton, function () {
    showScreen(settingsScreen);
  });

  safeClick(aboutButton, function () {
    showScreen(aboutScreen);
  });

  safeClick(themeToggleButton, toggleTheme);

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      renderHaikuList();
    });
  }

  safeClick(backFromNewButton, function () {
    if (editMode === true && selectedHaikuId !== null) {
      const haikuIdToReturnTo = selectedHaikuId;

      resetFormVisualsOnly();

      openHaikuDetail(haikuIdToReturnTo);
    } else {
      resetFormToCreateMode();
      showScreen(menuScreen);
    }
  });

  safeClick(backFromListButton, function () {
    clearSearch();
    showScreen(menuScreen);
  });

  safeClick(backFromDetailButton, function () {
    renderHaikuList();
    showScreen(listScreen);
  });

  safeClick(backFromSettingsButton, function () {
    showScreen(menuScreen);
  });

  safeClick(backFromAboutButton, function () {
    showScreen(menuScreen);
  });

  safeClick(saveHaikuButton, saveFormHaiku);

  safeClick(deleteHaikuButton, requestDeleteSelectedHaiku);

  safeClick(cancelDeleteButton, function () {
    hideDeleteModal();
  });

  safeClick(confirmDeleteButton, confirmDeleteSelectedHaiku);

  safeClick(editHaikuButton, startEditingSelectedHaiku);

  safeClick(exportHaikusButton, exportHaikus);

  safeClick(importHaikusButton, function () {
    if (importFileInput) {
      importFileInput.click();
    }
  });

  if (importFileInput) {
    importFileInput.addEventListener("change", function () {
      const file = importFileInput.files[0];

      if (!file) {
        return;
      }

      importHaikusFromFile(file);
    });
  }

  applySavedTheme();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js").catch(function (error) {
      console.log("Service worker registration failed:", error);
    });
  }
});
