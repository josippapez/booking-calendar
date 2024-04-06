import sgMail from '@sendgrid/mail';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
  const data = await req.json();

  if (!data || !data.msg) {
    return NextResponse.json({
      status: 500,
      error: 'No data',
      now: Date.now(),
    });
  }

  let sendgrid_key = process.env.NEXT_ENV_SENDGRID_KEY as string;
  const template_id = 'd-376c4c28bb694e09b22689b6ea3b977e';

  sgMail.setApiKey(sendgrid_key);
  return sgMail
    .send({ ...data.msg, templateId: template_id })
    .then(() => {
      return NextResponse.json({
        status: 200,
        sent: true,
        now: Date.now(),
      });
    })
    .catch(error => {
      console.error(error);
      return NextResponse.json({
        status: 500,
        error: error,
        now: Date.now(),
      });
    });
}
