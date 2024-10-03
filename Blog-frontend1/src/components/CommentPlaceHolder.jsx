import { useState } from "react";

function CommentPlaceHolder({ comment, user, token, refreshBlogposts }) {
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  var [error, setError] = useState(null);

  var edCont = editedContent;

  function disardEdits() {
    setEditing(false);
    setEditedContent(comment.content);
  }

  async function updateComment() {
    const settings = {
      method: "Put",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: editedContent,
      }),
    };
    try {
      const url = "http://localhost:3063/comment/" + comment.id;
      const updatedComment = await fetch(url, settings);

      if (updatedComment) {
        refreshBlogposts();
      } else {
        setError("Something went wrong when updating the comment.");
      }
    } catch (e) {
      return console.log(e);
    }
  }

  async function deleteComment() {
    const settings = {
      method: "Delete",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    };
    try {
      const url = "http://localhost:3063/comment/" + comment.id;
      const deleteComment = await fetch(url, settings);

      if (deleteComment) {
        refreshBlogposts();
      } else {
        setError("Something went wrong when deleting the comment.");
      }
    } catch (e) {
      return console.log(e);
    }
  }

  if (!editing) {
    return (
      <>
        <p>{comment.content}</p>
        {comment.author === user.email ? (
          <div>
            <h6>You posted this on {comment.dateCreated}</h6>
            <p>{error}</p>
            <br></br>
            <div className="flex-container-btns">
              <button onClick={() => setEditing(true)}>Edit</button>
              <button onClick={() => deleteComment()}>Delete</button>
            </div>
          </div>
        ) : (
          <h6>
            Posted by {comment.author} at {comment.dateCreated}
          </h6>
        )}
      </>
    );
  } else {
    return (
      <>
        {comment.author === user.email ? (
          <div>
            <textarea
              className="editarea"
              name="edited comment"
              value={edCont}
              onChange={(e) => setEditedContent(e.target.value)}
            >
              {comment.content}
            </textarea>
            <h6>You posted this on {comment.dateCreated}</h6>
            <br></br>
            <div className="flex-container-btns">
              <button onClick={() => updateComment()}>Save Changes</button>
              <button onClick={() => disardEdits()}>Discard Edits</button>
            </div>
          </div>
        ) : (
          <>
            <button onClick={() => setEditing(false)}>Redisplay</button>
          </>
        )}
      </>
    );
  }
}

export default CommentPlaceHolder;
