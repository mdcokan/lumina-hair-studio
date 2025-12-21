import { NextResponse } from "next/server";

type LocalizedText = {
  text?: string;
  languageCode?: string;
};

type AuthorAttribution = {
  displayName?: string;
  photoUri?: string;
  uri?: string;
};

type GoogleReview = {
  rating?: number;
  text?: LocalizedText; // Places API (New) genelde böyle dönüyor
  relativePublishTimeDescription?: string;
  publishTime?: string;
  authorAttribution?: AuthorAttribution;
};

type GooglePlaceResponse = {
  displayName?: LocalizedText;
  rating?: number;
  userRatingCount?: number;
  reviews?: GoogleReview[];
};

type ReviewResponse = {
  authorName: string;
  rating: number;
  text: string;
  relativeTime: string;
  profilePhotoUrl?: string;
  authorUrl?: string;
};

type ApiResponse = {
  placeName?: string;
  rating?: number;
  userRatingCount?: number;
  reviews: ReviewResponse[];
  placeId: string;
  googleUrl: string;
};

function safeText(t: unknown): string {
  // Bazen string, bazen {text, languageCode} gibi obje gelebilir diye garantiye alıyoruz.
  if (typeof t === "string") return t;
  if (t && typeof t === "object") {
    const maybe = t as { text?: unknown };
    if (typeof maybe.text === "string") return maybe.text;
  }
  return "";
}

export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID;

    if (!apiKey || !placeId) {
      console.error("Missing GOOGLE_MAPS_API_KEY or GOOGLE_PLACE_ID");
      return NextResponse.json({ error: "API configuration missing" }, { status: 500 });
    }

    // ✅ Places API (New) v1 endpoint
    // languageCode=tr -> yorumları mümkünse Türkçe döndürür
    const url = `https://places.googleapis.com/v1/places/${placeId}?languageCode=tr`;

    // ✅ FieldMask'i doğru path’lerle veriyoruz (hata buradan geliyordu)
    const fieldMask =
      "displayName,rating,userRatingCount," +
      "reviews.rating,reviews.text,reviews.relativePublishTimeDescription," +
      "reviews.authorAttribution.displayName,reviews.authorAttribution.photoUri,reviews.authorAttribution.uri";

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": fieldMask,
      },
      // Next.js cache istemiyorsan:
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google Places API error:", response.status, errorText);
      return NextResponse.json({ error: "Failed to fetch reviews" }, { status: response.status });
    }

    const data: GooglePlaceResponse = await response.json();

    const reviews: ReviewResponse[] = (data.reviews ?? [])
      .slice(0, 6)
      .map((r) => {
        const authorName = r.authorAttribution?.displayName ?? "Anonim";
        const text = safeText(r.text) || ""; // ✅ kesin string
        const rating = typeof r.rating === "number" ? r.rating : 5;

        return {
          authorName,
          rating,
          text,
          relativeTime: r.relativePublishTimeDescription ?? "",
          profilePhotoUrl: r.authorAttribution?.photoUri,
          authorUrl: r.authorAttribution?.uri,
        };
      })
      // boş yorumları ayıklayalım (istersen kaldır)
      .filter((r) => r.text.trim().length > 0);

    // Google Maps işletme sayfası URL'si (placeId ile)
    const googleUrl = `https://www.google.com/maps/place/?q=place_id:${placeId}&hl=tr&gl=TR`;

    const result: ApiResponse = {
      placeName: safeText(data.displayName),
      rating: data.rating,
      userRatingCount: data.userRatingCount,
      reviews,
      placeId,
      googleUrl,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching Google reviews:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
