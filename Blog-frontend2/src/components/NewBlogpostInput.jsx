import { useState } from "react";

function NewBlogpostInput({ userId, token, refreshBlogposts }) {
  const [showInput, setShowInput] = useState(false);
  const [blogpostTitle, setBlogpostTitle] = useState("");
  const [blogpostContent, setBlogpostContent] = useState("");
  const [publish, setPublish] = useState(false);

  var [error, setError] = useState(null);

  var title = blogpostTitle;
  var cont = blogpostContent;
  var pub = publish;

  async function postBlogpost() {
    console.log("sdf");
    const settings = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        title: blogpostTitle,
        content: blogpostContent,
        ownerId: userId,
        publish: publish,
      }),
    };
    try {
      const url = "http://localhost:3063/blogpost";
      const postBlogpost = await fetch(url, settings);
      if (postBlogpost) {
        refreshBlogposts();
        setShowInput(false);
        setBlogpostTitle("");
        setBlogpostContent("");
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
          <div className="new-blogpost">
            <p>{error}</p>
            <p>Write a new blog post:</p>
            <h4>Title</h4>
            <input
              type="text"
              name="title"
              value={title}
              onChange={(e) => setBlogpostTitle(e.target.value)}
            ></input>
            <h4>Content</h4>
            <textarea
              type="text"
              name="comment"
              value={cont}
              onChange={(e) => setBlogpostContent(e.target.value)}
            ></textarea>
            <h4>Publish?</h4>
            <input
              type="checkbox"
              className="publish"
              value={pub}
              onChange={(e) => setPublish(Boolean(e.target.value))}
            ></input>
            <br></br>
            <br></br>
            <br></br>
            <button onClick={() => postBlogpost()}>Post on blog</button>
          </div>

          <button onClick={() => setShowInput(false)}>×</button>
        </div>
      ) : (
        <div>
          <br></br>
          <button onClick={() => setShowInput(true)}>New Blog Post</button>
          <br></br>
        </div>
      )}
    </>
  );
}

export default NewBlogpostInput;
