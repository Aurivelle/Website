document.getElementById("submit-comment").addEventListener("click", () => {
  const comment = document.getElementById("comment-input").value.trim();
  if (comment) {
    const commentList = document.getElementById("comments-section");
    const newComment = document.createElement("div");
    newComment.className = "comment";
    newComment.innerHTML = `<p>${comment}</p>`;
    commentList.appendChild(newComment);
    document.getElementById("comment-input").value = "";
  }
});
