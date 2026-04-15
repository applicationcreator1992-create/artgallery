import { NextRequest, NextResponse } from "next/server";

// In-memory storage for demo purposes
// In production, use a proper database
const reviews: Record<string, any[]> = {};

export async function POST(request: NextRequest) {
  try {
    const { productId, rating, title, content, author, email } =
      await request.json();

    // Validation
    if (!productId || !rating || !title || !content || !author || !email) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Create review object
    const review = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      productId,
      rating: Number(rating),
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      email: email.trim(),
      date: new Date().toISOString(),
      verified: false, // In production, you'd verify against actual purchase data
    };

    // Store review (in production, use database)
    if (!reviews[productId]) {
      reviews[productId] = [];
    }
    reviews[productId].push(review);

    console.log(`New review for product ${productId}:`, review);

    // In production, you might want to:
    // 1. Send notification email
    // 2. Update product average rating
    // 3. Check for spam/inappropriate content
    // 4. Sync with your review service

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.error("Review submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 },
    );
  }

  // Return reviews for the product
  const productReviews = reviews[productId] || [];

  return NextResponse.json({
    productId,
    reviews: productReviews,
    total: productReviews.length,
    averageRating:
      productReviews.length > 0
        ? productReviews.reduce((sum, review) => sum + review.rating, 0) /
          productReviews.length
        : 0,
  });
}
