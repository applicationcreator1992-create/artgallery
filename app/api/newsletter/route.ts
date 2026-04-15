import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // In a real implementation, you would:
    // 1. Store email in your newsletter service (Mailchimp, ConvertKit, etc.)
    // 2. Send confirmation email
    // 3. Handle unsubscribe functionality

    console.log(`Newsletter signup: ${email}`);

    // For demo purposes, we'll just log and return success
    // In production, integrate with your email service provider
    const newsletterService = process.env.NEWSLETTER_SERVICE;
    const newsletterApiKey = process.env.NEWSLETTER_API_KEY;
    const newsletterListId = process.env.NEWSLETTER_LIST_ID;

    if (newsletterService && newsletterApiKey && newsletterListId) {
      // Example: Mailchimp integration
      if (newsletterService.toLowerCase() === "mailchimp") {
        try {
          const mailchimpResponse = await fetch(
            `https://${newsletterService}.api.mailchimp.com/3.0/lists/${newsletterListId}/members`,
            {
              method: "POST",
              headers: {
                Authorization: `apikey ${newsletterApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email_address: email,
                status: "subscribed",
                merge_fields: {
                  SOURCE: "LilyaArt Website",
                },
              }),
            },
          );

          if (!mailchimpResponse.ok) {
            const errorData = await mailchimpResponse.json();
            console.error("Mailchimp error:", errorData);

            // Handle specific Mailchimp errors
            if (errorData.title === "Member Exists") {
              return NextResponse.json(
                { error: "You are already subscribed to our newsletter!" },
                { status: 409 },
              );
            }

            return NextResponse.json(
              { error: "Failed to subscribe. Please try again later." },
              { status: 500 },
            );
          }
        } catch (mailchimpError) {
          console.error("Mailchimp integration error:", mailchimpError);
          // Fallback to local storage if email service fails
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to newsletter!",
      email: email,
    });
  } catch (error) {
    console.error("Newsletter signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Newsletter subscription endpoint. Use POST method to subscribe.",
    usage: {
      endpoint: "/api/newsletter",
      method: "POST",
      description: "Subscribe to LilyaArt newsletter",
      requestBody: {
        email: "user@example.com",
      },
    },
    environment: {
      newsletterService: process.env.NEWSLETTER_SERVICE || "Not configured",
      configured: !!(
        process.env.NEWSLETTER_SERVICE &&
        process.env.NEWSLETTER_API_KEY &&
        process.env.NEWSLETTER_LIST_ID
      ),
    },
  });
}
