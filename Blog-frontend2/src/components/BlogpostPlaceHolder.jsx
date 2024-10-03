import { useState } from "react";

function BlogpostPlaceHolder({ blogpost, token, refreshBlogposts }) {
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(blogpost.title);
  const [editedContent, setEditedContent] = useState(blogpost.content);

  var edTitle = editedTitle;
  var edCont = editedContent;

  var [error, setError] = useState(null);

  function disardEdits() {
    setEditing(false);
    setEditedTitle(blogpost.title);
    setEditedContent(blogpost.content);
  }

  async function updateBlogpost() {
    console.log("saving");
    const settings = {
      method: "Put",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: editedTitle,
        content: editedContent,
      }),
    };
    try {
      const url = "http://localhost:3063/blogpost/" + blogpost.id;
      const updatedBlogpost = await fetch(url, settings);
      if (updatedBlogpost) {
        refreshBlogposts();
      } else {
        setError("Something went wrong when updating the comment.");
      }
    } catch (e) {
      return console.log(e);
    }
  }

  async function deleteBlogpost() {
    const settings = {
      method: "Delete",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    };
    try {
      const url = "http://localhost:3063/blogpost/" + blogpost.id;
      const deletedBlogpost = await fetch(url, settings);
      if (deletedBlogpost) {
        refreshBlogposts();
      } else {
        setError("Something went wrong when updating the comment.");
      }
    } catch (e) {
      return console.log(e);
    }
  }

  async function changePublishType(publish) {
    const settings = {
      method: "Put",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        published: publish,
      }),
    };
    try {
      const url = "http://localhost:3063/blogpost/publish/" + blogpost.id;
      const updatedBlogpost = await fetch(url, settings);
      if (updatedBlogpost) {
        refreshBlogposts();
      } else {
        setError(
          "Something went wrong when updating the publish status of your blog post."
        );
      }
    } catch (e) {
      return console.log(e);
    }
  }

  return (
    <>
      <p>{error}</p>
      {editing === true ? (
        <div>
          <h4>Title</h4>
          <input
            type="text"
            name="title"
            value={edTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          ></input>
          <h4>Content</h4>
          <textarea
            type="text"
            name="contnet"
            value={edCont}
            onChange={(e) => setEditedContent(e.target.value)}
          ></textarea>
          <div className="flex-container-left">
            <h6>You posted this on {blogpost.dateCreated}</h6>
          </div>
          <div className="flex-container-btns">
            <button onClick={() => updateBlogpost()}>Save Changes</button>
            <button onClick={() => disardEdits()}>Discard Edits</button>
          </div>
        </div>
      ) : (
        <div>
          <h4>{blogpost.title}</h4>
          <p>{blogpost.content}</p>
          <p>{error}</p>
          <div className="flex-container-left">
            <h6>You posted this on {blogpost.dateCreated}</h6>
          </div>
          <div className="flex-container-btns">
            <button onClick={() => setEditing(true)}>Edit</button>
            <button onClick={() => deleteBlogpost()}>Delete</button>
          </div>
        </div>
      )}
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      {blogpost.published === true ? (
        <div>
          <p>It is currently published for others to read.</p>
          <button onClick={() => changePublishType(false)}>Unpublish</button>
        </div>
      ) : (
        <div>
          <p>It is currently not published so others cannot read it.</p>
          <button onClick={() => changePublishType(true)}>Publish</button>
        </div>
      )}
    </>
  );
}

export default BlogpostPlaceHolder;
