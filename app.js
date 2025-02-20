import express from "express";
const app = express();
const port = 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Route pour la vérification du webhook
app.get("/webhook", (req, res) => {
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === "votre_token_de_verification") {
    console.log("Vérification du webhook réussie.");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// home page

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Route pour recevoir les messages de WhatsApp
app.post("/webhook", (req, res) => {
  let body = req.body;

  console.log("Données reçues :", JSON.stringify(body, null, 2));

  // Vérifier si le message est valide
  if (body.object === "whatsapp_business_account") {
    body.entry.forEach((entry) => {
      let changes = entry.changes;
      changes.forEach((change) => {
        if (change.value.messages) {
          let message = change.value.messages[0];
          console.log("Message reçu :", message.text.body);
        }
      });
    });

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.listen(port, () => {
  console.log(`Serveur webhook en écoute sur http://localhost:${port}`);
});
