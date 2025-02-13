
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  customerEmail: string;
  customerName: string;
  date: string;
  tableType: string;
  status: 'accepted' | 'rejected';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customerEmail, customerName, date, tableType, status }: EmailRequest = await req.json();

    const subject = status === 'accepted' 
      ? "Your Table Reservation Has Been Confirmed!" 
      : "Update Regarding Your Table Reservation";

    const html = status === 'accepted' 
      ? `
        <h1>Reservation Confirmed!</h1>
        <p>Dear ${customerName},</p>
        <p>We're pleased to confirm your table reservation:</p>
        <ul>
          <li>Date: ${new Date(date).toLocaleDateString()}</li>
          <li>Table Type: ${tableType}</li>
        </ul>
        <p>We look forward to welcoming you!</p>
        <p>Best regards,<br>La Belle Cuisine Team</p>
      `
      : `
        <h1>Reservation Update</h1>
        <p>Dear ${customerName},</p>
        <p>We regret to inform you that we are unable to accommodate your reservation for:</p>
        <ul>
          <li>Date: ${new Date(date).toLocaleDateString()}</li>
          <li>Table Type: ${tableType}</li>
        </ul>
        <p>Please try booking for a different date or table type.</p>
        <p>We apologize for any inconvenience.</p>
        <p>Best regards,<br>La Belle Cuisine Team</p>
      `;

    const emailResponse = await resend.emails.send({
      from: "La Belle Cuisine <onboarding@resend.dev>",
      to: [customerEmail],
      subject: subject,
      html: html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
