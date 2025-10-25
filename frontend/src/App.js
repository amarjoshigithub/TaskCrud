import React, { useEffect, useState } from "react";

function App() {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [operation, setOperation] = useState(""); // "modify" or "delete"
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/comments")
      .then((res) => res.json())
      .then((data) => setComments(data));
  }, []);

  const addComment = () => {
    if (!comment.trim()) return;
    fetch("http://127.0.0.1:5000/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment }),
    })
      .then((res) => res.json())
      .then((newComment) => setComments([...comments, newComment]));
    setComment("");
  };

  const modifyComment = () => {
    if (!selectedId || !newComment.trim()) return;
    fetch(`http://127.0.0.1:5000/api/comments/${selectedId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment: newComment }),
    })
      .then((res) => res.json())
      .then((updatedComment) => {
        setComments(comments.map((t) => (t.id === selectedId ? updatedComment : t)));
      });
    setNewComment("");
    setSelectedId(null);
    setOperation("");
  };

  const deleteComment = () => {
    if (!selectedId) return;
    fetch(`http://127.0.0.1:5000/api/comments/${selectedId}`, {
      method: "DELETE",
    }).then(() => {
      setComments(comments.filter((t) => t.id !== selectedId));
    });
    setSelectedId(null);
    setOperation("");
  };

  const handleRadioChange = (id, op) => {
    setSelectedId(id);
    setOperation(op);
	
	if (op === "modify") {
		const comment = comments.find((t) => t.id === id);
		if (comment) setNewComment(comment.comment);
	  } else {
		// Clear input if Delete is selected
		setNewComment("");
	  }
  };

  return (
    <div className="container mt-5">
      <h4 className="text-white p-3 text-center rounded" style={{ backgroundColor: "#003366", color: "#000" }}>
        Judge a Person
      </h4>

      <div className="row g-3 mt-3">
        {/* First Column */}
        <div className="col border-end pe-3">
          <div className="input-group mb-4">
		  <input
			type="text"
			className="form-control bg-secondary-subtle border rounded-3 me-2"
			placeholder="Enter a comment"
			value={comment}
			onChange={(e) => setComment(e.target.value)}
		  />

		  <button
			className="btn btn-warning rounded-pill px-4"
			onClick={addComment}
		  >
			Add
		  </button>
		</div>


          <ul className="list-group">
			  {comments.map((t) => (
				<li
				  key={t.id}
				  className="list-group-item d-flex justify-content-between align-items-center mb-2 rounded-3 shadow-sm"
				  style={{
					backgroundColor: "#e7f1ff", // light blue background
					borderRadius: "12px",
					border: "1px solid #bcd0f7",
					padding: "10px 15px"
				  }}
				>
				  <span className="fw-semibold text-dark">{t.comment}</span>
				  <div>
					<label className="me-2">
					  <input
						type="radio"
						name={`op-${t.id}`}
						onChange={() => handleRadioChange(t.id, "modify")}
						checked={selectedId === t.id && operation === "modify"}
					  />{" "}
					  Modify
					</label>

					<label>
					  <input
						type="radio"
						name={`op-${t.id}`}
						onChange={() => handleRadioChange(t.id, "delete")}
						checked={selectedId === t.id && operation === "delete"}
					  />{" "}
					  Delete
					</label>
				  </div>
				</li>
			  ))}
		</ul>

        </div>

        {/* Second Column: Modify */}
        <div className="col border-end pe-3 ps-3">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Change comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={operation !== "modify"}
          />
          <button
            className="btn btn-primary w-100"
            onClick={modifyComment}
            disabled={operation !== "modify"}
          >
            Modify Selected
          </button>
        </div>

        {/* Third Column: Delete */}
        <div className="col ps-3">
          <button
            className="btn btn-danger w-100"
            onClick={deleteComment}
            disabled={operation !== "delete"}
          >
            Delete Selected
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
