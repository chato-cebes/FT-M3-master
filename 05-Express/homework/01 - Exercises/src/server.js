// const bodyParser = require("body-parser");
const express = require("express");

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let publications = [];

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());

let id = 1;

// Crea la ruta `/posts`
server.post("/posts", newpost);
// Crea el Get a ruta "/post"
server.get("/posts", getpost);
// Crea un get en la ruta /posts/:author
server.get("/posts/:author", getauthor);
// Actualiza en la ruta /posts/:id
server.put("/posts/:id", refreshid);
// Ejecuta un delete en la ruta `/posts/:id`
server.delete("posts/:id", deletePost);
// Ejecuta un delete en la ruta `/author/:name`
server.delete("/author/:name", deleteauthor);

function newpost(req, res) {
  const { author, title, contents } = req.body;
  if (!author || !title || !contents) {
    return res.status(400).json({
      error:
        "No se recibieron los parámetros necesarios para crear la publicación",
    });
  }
  let obj = { id, author, title, contents };
  publications.push(obj);
  id++;
  res.status(200).json(obj);
}

function getpost(req, res) {
  const { term, author, title } = req.query;
  if (term) {
    let getbyterm = publications.filter((post) => {
      return post.title.includes(term) || post.contents.includes(term);
    });
    if (getbyterm.length > 0) res.status(200).json(getbyterm);
    res.status(200).json(publications);
  } else if (author && title) {
    let filter2 = publications.filter((post) => {
      return post.title === title && post.author === author;
    });
    if (filter2.length > 0) res.status(200).json(filter2);
    res.status(400).json({
      error: "No existe ninguna publicación con dicho título y autor indicado",
    });
  } else {
    res.status(200).json(publications);
  }
}

function getauthor(req, res) {
  const { author } = req.params;
  if (author) {
    const filter = publications.filter((posts) => posts.author === author);

    if (filter.length > 0) res.status(200).json(filter);
    else
      res
        .status(400)
        .json({ error: "No existe ningun post del autor indicado" });
  }
}

function refreshid(req, res) {
  const { id } = req.params;
  const { title, contents } = req.body;
  if (!id || !title || !contents) {
    return res.status(400).json({
      error: "No se recibieron los parámetros necesarios para modificar la publicación",
    });
  }

  const idfilter = publications.find((post) => post.id == id);
  if (idfilter > 0) {
    idfilter = { id, title, contents };
    return res.status(200).json(idfilter);
  } else {
    return res.status(400).json({
      error: "No se recibió el id correcto necesario para modificar la publicación",
    });
  }
}

function deletePost(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      error: "No se recibió el id de la publicación a eliminar",
    });
  }  

  const filter = publications.find((post) => post.id == id);
  if (filter.length < 0) {
    return res.status(400).json({
      error: "No se recibió el id correcto necesario para eliminar la publicación",
    });
  } else {
  publications = publications.filter((post) => post.id != id);
  return res.status(200).json({ success: true });
  }
}

function deleteauthor(req, res) {
  const { name } = req.params;
  if (!name) {
    res.status(400).json({ error: "No se recibió el nombre del autor" });
  }

  const filter = publications.filter((post) => post.author === name);
  if (filter.length > 0) {
    publications = publications.filter((post) => post.author != name);
    return res.status(200).json(filter);
  } else {
    res.status(400).json({
      error:
        "No se recibió el nombre correcto necesario para eliminar las publicaciones del autor",
    });
  }
}

//NO MODIFICAR EL CODIGO DE ABAJO. SE USA PARA EXPORTAR EL SERVIDOR Y CORRER LOS TESTS
module.exports = { publications, server };
