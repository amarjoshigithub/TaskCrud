import unittest
import json
from app import app, comments

class CommentsAPITestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

        # Reset comments before each test
        global comments
        comments.clear()
        comments.extend([
            {"id": 1, "comment": "Good Person"},
            {"id": 2, "comment": "Bad Person"}
        ])

    def test_get_comments(self):
        response = self.app.get('/api/comments')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(len(data), 2)
        self.assertEqual(data[0]["comment"], "Good Person")

    def test_add_comment(self):
        response = self.app.post('/api/comments', json={"comment": "Neutral Person"})
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data["comment"], "Neutral Person")
        self.assertEqual(data["id"], 3)

    def test_modify_comment_success(self):
        response = self.app.put('/api/comments/1', json={"comment": "Excellent Person"})
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["comment"], "Excellent Person")

    def test_modify_comment_not_found(self):
        response = self.app.put('/api/comments/99', json={"comment": "Unknown"})
        self.assertEqual(response.status_code, 404)
        data = json.loads(response.data)
        self.assertIn("error", data)

    def test_delete_comment_success(self):
        response = self.app.delete('/api/comments/2')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn("deleted", data["message"])
        self.assertEqual(len(comments), 1)

    def test_delete_comment_not_found(self):
        response = self.app.delete('/api/comments/99')
        self.assertEqual(response.status_code, 404)
        data = json.loads(response.data)
        self.assertIn("error", data)


if __name__ == '__main__':
    unittest.main()
