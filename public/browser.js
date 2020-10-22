function itemTemplate(item) {
    return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
        <span class="item-text">${item.text}</span>
        <div>
          <button data-id=${item._id} class="update-me btn btn-secondary btn-sm mr-1">Update</button>
          <button data-id=${item._id} class="delete-me btn btn-danger btn-sm">Delete</button>
        </div>
      </li>
      `
}

document.addEventListener("submit", function(event) {
    event.preventDefault();
    let inputField = document.getElementById("create-field");
    let inputText = inputField.value;
    inputField.value = "";
    inputField.focus();
    if (inputText) {
        axios.post("/create-item", { item: inputText }).then(function(response) {
            let ul = document.getElementById("item-list");
            ul.insertAdjacentHTML("beforeend", itemTemplate(response.data));
        }).catch(function(error) {
            alert("Something went wrong. Try again");
        })
    } 
});

document.addEventListener("click", function(event) {
    if (event.target.classList.contains("update-me")) {
        let itemElement = event.target.parentElement.parentElement.querySelector(".item-text");
        let newText = prompt("Update your item", itemElement.innerHTML);
        let id = event.target.getAttribute("data-id");
        if (newText) {
            axios.post("/update-item", {  id: id, text: newText }).then(function(response) {
                itemElement.innerHTML = newText;
            }).catch(function(reason) {
                alert("Something went wrong. Try again.");
            });
        }
    }

    if (event.target.classList.contains("delete-me")) {
        let id = event.target.getAttribute("data-id");
        axios.post("/delete-item", { id: id }).then(function(response) {
            event.target.parentElement.parentElement.remove();
        }).catch(function(response) {
            alert("Something went wrong. Try again.");
        });
    }
});