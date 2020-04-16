const express = require("express");
const cors = require("cors");
const uuidv4 = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  if (!title) {
    return response
      .status(400)
      .json({ error: { message: "this 'title' is empty" } });
  }

  if (!url) {
    return response
      .status(400)
      .json({ error: { message: "this 'url' is empty" } });
  }

  if (techs.length <= 0) {
    return response
      .status(400)
      .json({ error: { message: "this 'techs' is empty" } });
  }

  const newRepo = { id: uuidv4.uuid(), title, url, techs, likes: 0 };
  repositories.push(newRepo);

  return response.json(newRepo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  if (!uuidv4.isUuid(id)) {
    return response
      .status(400)
      .json({ error: { message: "this 'id' is not valid" } });
  }

  const index = repositories.findIndex((item) => item.id === id);

  if (index < 0)
    return response
      .status(404)
      .json({ error: { message: "this repository not found" } });

  const { title, url, techs } = request.body;
  repositories[index] = { ...repositories[index], title, url, techs };

  return response.json(repositories[index]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  if (!uuidv4.isUuid(id)) {
    return response
      .status(400)
      .json({ error: { message: "this 'id' is not valid" } });
  }

  const index = repositories.findIndex((item) => item.id === id);

  if (index < 0)
    return response
      .status(404)
      .json({ error: { message: "this repository not found" } });

  repositories.splice(index, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  if (!uuidv4.isUuid(id))
    return response
      .status(400)
      .json({ error: { message: "this 'id' is not valid" } });

  const index = repositories.findIndex((item) => item.id === id);

  if (index < 0)
    return response
      .status(400)
      .json({ error: { message: "this repository not found" } });

  repositories[index] = {
    ...repositories[index],
    likes: (repositories[index].likes += 1),
  };

  return response
    .json({
      likes: repositories[index].likes,
    })
    .status(201);
});

module.exports = app;
