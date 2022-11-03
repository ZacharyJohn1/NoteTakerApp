const express = require("express");
const path = require("path");
const app = express();
const PORT = 3001;
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const data = require("./db/db.json");
app.use(express.static("public"));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use("/api", api);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});
// GET request for notes
app.get("/api/notes", (req, res) => {
  // Send a message to the client
  // res.status(200).json(`${req.method} request received to get note`);

  // Log our request to the terminal
  console.info(`${req.method} request received to get note`);
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const allNotes = JSON.parse(data);
      res.json(allNotes);
    }
  });
});
// POST request to add a notes
app.post("/api/notes", (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a new note.`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      text,
      title,
      id: uuidv4(),
    };

    // Obtain existing notes
    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNote = JSON.parse(data);

        // Add a new note
        parsedNote.push(newNote);

        // Write updated note back to the file
        fs.writeFile(
          "./db/db.json",
          JSON.stringify(parsedNote, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info("Successfully updated Notes!")
        );
      }
    });

    const response = {
      status: "success",
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json("Error in posting note");
  }
});
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
