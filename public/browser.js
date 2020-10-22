document.addEventListener("click", function(event) {
    if (event.target.classList.contains("update-me")) {
        let itemElement = event.target.parentElement.parentElement.querySelector(".item-text");
        let newText = prompt("Update your item", itemElement.innerHTML);
        let id = event.target.getAttribute("data-id");
        axios.post("/update-item", {  id: id, text: newText }).then(function(response) {
            itemElement.innerHTML = newText;
        }).catch(function(reason) {
            alert("Something went wrong. Try again.");
        })
    }
});