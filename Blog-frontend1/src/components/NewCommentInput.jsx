import { useState } from "react";

function NewCommmentInput({ blogpostId, userId, token, refreshBlogposts }) {
  const [showInput, setShowInput] = useState(false);
  const [commentContent, setCommenContent] = useState("");

  var [error, setError] = useState(null);

  var content = commentContent;

  async function postComment() {
    const settings = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        content: commentContent,
        blogpostId: blogpostId,
        ownerId: userId,
      }),
    };
    try {
      const url = "http://localhost:3063/comment";
      const postComment = await fetch(url, settings);
      if (postComment) {
        refreshBlogposts();
      } else {
        setError("Something went wrong when creating the comment.");
      }
    } catch (e) {
      return console.log(e);
    }
  }

  return (
    <>
      {showInput === true ? (
        <div className="flex-container-left">
          <div>
            <p>{error}</p>
            <p>Write a comment:</p>

            <textarea
              type="text"
              name="comment"
              value={content}
              onChange={(e) => setCommenContent(e.target.value)}
            ></textarea>
            <br></br>
            <button onClick={() => postComment()}>Post Comment</button>
          </div>

          <button onClick={() => setShowInput(false)}>×</button>
        </div>
      ) : (
        <div>
          <br></br>
          <button onClick={() => setShowInput(true)}>Write a Comment</button>
          <br></br>
        </div>
      )}
    </>
  );
}

export default NewCommmentInput;
