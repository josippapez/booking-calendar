import sgMail from "@sendgrid/mail";
import type { VercelRequest, VercelResponse } from "@vercel/node";
const cors = require("cors")({ origin: true });

module.exports = async (req: VercelRequest, res: VercelResponse) => {
  cors(req, res, () => {
    let sendgrid_key = req.body.data.sendgrid_key;
    const template_id = "d-376c4c28bb694e09b22689b6ea3b977e";
    sgMail.setApiKey(sendgrid_key);
    sgMail
      .send({ ...req.body.data.msg, templateId: template_id })
      .then(() => {
        return res.status(200).send("Email sent");
      })
      .catch(error => {
        console.error(error);
        return res.status(500).send(error);
      });
  });
};
