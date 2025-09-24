async function submitForm(event) {
      event.preventDefault();

      const form = document.getElementById("userForm");
      const formData = new FormData(form);

      try {
        const response = await fetch("/save", {
          method: "POST",
          body: formData
        });

        const result = await response.json();

        if (result.success) {
          showPopup("Data saved successfully!", "success");
          form.reset();
        } else {
          showPopup("Error saving data!", "error");
        }
      } catch (err) {
        showPopup("Server error!", "error");
      }
    }

    function showPopup(message, type) {
      const popup = document.getElementById("popup");
      popup.textContent = message;
      popup.className = "";
      popup.classList.add(type === "success" ? "success" : "error");
      popup.classList.add("show");

      setTimeout(() => {
        popup.classList.remove("show");
      }, 3000);
    }