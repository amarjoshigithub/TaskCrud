from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

comments = [
    {"id": 1, "comment": "Good Person"},
    {"id": 2, "comment": "Bad Person"}
]

@app.route('/api/comments', methods=['GET'])
def get_comments():
    return jsonify(comments)

@app.route('/api/comments', methods=['POST'])
def add_comment():
    data = request.get_json()
    new_comment = {"id": len(comments) + 1, "comment": data["comment"]}
    comments.append(new_comment)
    return jsonify(new_comment), 201

# Modify a comment
@app.route('/api/comments/<int:id>', methods=['PUT'])
def modify_comment(id):
    data = request.get_json()
    new_text = data.get("comment")

    for comment in comments:
        if comment["id"] == id:
            comment["comment"] = new_text
            return jsonify(comment), 200

    return jsonify({"error": "Comment not found"}), 404


# Delete a comment
@app.route('/api/comments/<int:id>', methods=['DELETE'])
def delete_comment(id):
    global comments
    for c in comments:
        if c["id"] == id:
            comments.remove(c)
            return jsonify({"message": f"Comment {id} deleted"}), 200
    return jsonify({"error": "Comment not found"}), 404


if __name__ == '__main__':
    app.run(debug=True)
