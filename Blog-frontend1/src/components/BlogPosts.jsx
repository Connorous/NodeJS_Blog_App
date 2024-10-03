import { useNavigate } from "react-router-dom";
import { useState } from "react";
import uuid from "react-uuid";
import { useEffect } from "react";
import NewCommmentInput from "./NewCommentInput";
import CommentPlaceHolder from "./CommentPlaceHolder";

function BlogPosts({ token, user }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  const [authors, setAuthors] = useState([]);
  const [blogposts, setBlogposts] = useState([]);
  const [currentAuthor, setCurrentAuthor] = useState(null);
  var [error, setError] = useState(null);

  function uuidFromUuidV4() {
    const newUuid = uuid();
    return newUuid;
  }

  if (authors.length === 0) {
    getAuthors();
  }

  async function getAuthors() {
    const settings = {
      method: "GET",
      headers: { Authorization: token },
    };
    try {
      const fetchAuthors = await fetch(
        `http://localhost:3063/authors`,
        settings
      );
      const data = await fetchAuthors.json();
      if (data.success === true) {
        setAuthors(data.authors);
      } else {
        setError(data.msg);
      }
    } catch (e) {
      return e;
    }
  }

  async function loadBlogPosts(author) {
    const settings = {
      method: "GET",
      headers: { Authorization: token },
    };
    try {
      const url = "http://localhost:3063/blogposts/" + author.id;
      const fetchBlogposts = await fetch(url, settings);
      const data = await fetchBlogposts.json();

      if (data.success === true) {
        setBlogposts(data.blogposts);
        setCurrentAuthor(author);
      } else {
        setError(data.msg);
      }
    } catch (e) {
      return e;
    }
  }

  function refreshBlogposts() {
    loadBlogPosts(currentAuthor);
  }

  if (token) {
    if (!currentAuthor) {
      return (
        <>
          <h1>Blog Posts</h1>
          <p>{error}</p>
          <div className="flex-container">
            <div className="blog-authors">
              <h4>Authors</h4>
              {authors.map((author) => (
                <div
                  key={uuidFromUuidV4()}
                  id={author.id}
                >
                  <button onClick={() => loadBlogPosts(author)}>
                    {author.email}
                  </button>
                  <br></br>
                  <br></br>
                  <br></br>
                </div>
              ))}
            </div>
            <div></div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <h1>Blog Posts</h1>
          <div className="flex-container">
            <div className="blog-authors">
              <h4>Authors</h4>
              {authors.map((author) => (
                <div
                  key={uuidFromUuidV4()}
                  id={author.id}
                >
                  <button onClick={() => loadBlogPosts(author)}>
                    {author.email}
                  </button>
                  <br></br>
                  <br></br>
                  <br></br>
                </div>
              ))}
            </div>
            <div className="blog-posts">
              {blogposts.length === 0 ? (
                <h4>{currentAuthor.email}'s Blog currently has no posts</h4>
              ) : (
                <h4>{currentAuthor.email}'s Blog</h4>
              )}

              {blogposts.map((blogpost) => (
                <div
                  key={uuidFromUuidV4()}
                  id={blogpost.id}
                  className="blog-post"
                >
                  <div>
                    <h4>{blogpost.title}</h4>
                    <p>{blogpost.content}</p>

                    {blogpost.owner.email === user.email ? (
                      <div className="flex-container-left">
                        <h6>You posted this on {blogpost.dateCreated}</h6>
                      </div>
                    ) : (
                      <h6>
                        Posted by {blogpost.owner.email} at{" "}
                        {blogpost.dateCreated}
                      </h6>
                    )}
                    <br></br>

                    <NewCommmentInput
                      key={uuidFromUuidV4()}
                      blogpostId={blogpost.id}
                      userId={user.id}
                      token={token}
                      refreshBlogposts={refreshBlogposts}
                    ></NewCommmentInput>

                    <br></br>
                    <div>
                      <br></br>
                      {blogpost.comments.map((comment) => (
                        <div key={uuidFromUuidV4()}>
                          <br></br>
                          <div
                            id={comment.id}
                            className="comment"
                          >
                            <CommentPlaceHolder
                              comment={comment}
                              token={token}
                              user={user}
                              refreshBlogposts={refreshBlogposts}
                            ></CommentPlaceHolder>
                          </div>
                          <br></br>
                        </div>
                      ))}
                    </div>
                  </div>
                  <br></br>
                </div>
              ))}
            </div>
          </div>
          <br></br>
          <br></br>
          <br></br>
        </>
      );
    }
  }
}

export default BlogPosts;
