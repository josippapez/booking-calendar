import sgMail from "@sendgrid/mail";
import { NextApiRequest, NextApiResponse } from "next";
const cors = require("cors")({ origin: true });

module.exports = async (req: NextApiRequest, res: NextApiResponse) => {
  cors(req, res, () => {
    if (req.body && req.body.msg && req.body.sendgrid_key) {
      let sendgrid_key = req.body.sendgrid_key;
      const template_id = "d-376c4c28bb694e09b22689b6ea3b977e";
      sgMail.setApiKey(sendgrid_key);
      sgMail
        .send({ ...req.body.msg, templateId: template_id })
        .then(() => {
          return res.status(200).send("Email sent");
        })
        .catch(error => {
          console.error(error);
          return res.status(500).send(error);
        });
    }
    return;
  });
};
