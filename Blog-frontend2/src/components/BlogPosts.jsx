import { useNavigate } from "react-router-dom";
import { useState } from "react";
import uuid from "react-uuid";
import { useEffect } from "react";
import BlogpostPlaceHolder from "./BlogpostPlaceHolder";
import NewBlogpostInput from "./NewBlogpostInput";
import NewCommmentInput from "./NewCommentInput";
import CommentPlaceHolder from "./CommentPlaceHolder";

function BlogPosts({ token, user }) {
  var [error, setError] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  const [blogposts, setBlogposts] = useState([]);

  function uuidFromUuidV4() {
    const newUuid = uuid();
    return newUuid;
  }

  if (blogposts.length === 0) {
    loadBlogPosts();
  }

  async function loadBlogPosts() {
    const settings = {
      method: "GET",
      headers: { Authorization: token },
    };
    try {
      const url = "http://localhost:3063/blogposts/published/" + user.id;
      const fetchBlogposts = await fetch(url, settings);
      const data = await fetchBlogposts.json();

      if (data.success === true) {
        setBlogposts(data.blogposts);
      } else {
        setError(data.msg);
      }
    } catch (e) {
      return e;
    }
  }

  function refreshBlogposts() {
    loadBlogPosts();
  }

  if (user) {
    if (!user.author) {
      return (
        <>
          <h1>Not an Author</h1>
          <p>
            You are currently not an author. Please apply to be an author before
            creating blog posts or call technical support.
          </p>
        </>
      );
    } else {
      return (
        <>
          <h1>Your Blog Posts</h1>
          <p>{error}</p>
          <div className="flex-container">
            <div className="blog-posts">
              <h4>{user.email}'s Blog</h4>

              <NewBlogpostInput
                userId={user.id}
                token={token}
                refreshBlogposts={refreshBlogposts}
              ></NewBlogpostInput>

              {blogposts.map((blogpost) => (
                <div
                  key={uuidFromUuidV4()}
                  id={blogpost.id}
                  className="blog-post"
                >
                  <div>
                    <BlogpostPlaceHolder
                      blogpost={blogpost}
                      token={token}
                      refreshBlogposts={refreshBlogposts}
                    ></BlogpostPlaceHolder>
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
