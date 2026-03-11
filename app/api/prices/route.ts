import { NextRequest, NextResponse } from "next/server";

type PriceItem = {
  kategori: string;
  hizmet: string;
  sure: string;
  fiyat: string;
  not: string;
  sira: number;
};

type PricesByCategory = {
  [category: string]: PriceItem[];
};

/** Salon app catalog endpoint service shape (direct array response) */
type CatalogService = {
  id?: string;
  name: string;
  category?: string | null;
  duration_minutes?: number | null;
  price?: number | null;
  price_mode?: string | null;
  price_min?: number | null;
  price_max?: number | null;
  display_price_text?: string | null;
  description?: string | null;
  price_note?: string | null;
  sort_order?: number | null;
};

const PRODUCTION_CATALOG_URL =
  "https://app.lumina-hairstudio.com/api/public/services/catalog";
const FALLBACK_CATEGORY = "Hizmetler";

/** Environment-based salon app catalog URL (local dev → localhost:3000, prod → canlı) */
function getSalonAppCatalogUrl(): string {
  const full = process.env.SALON_APP_CATALOG_URL?.trim();
  if (full) return full;
  const base = process.env.SALON_APP_BASE_URL?.trim();
  if (base) return `${base.replace(/\/$/, "")}/api/public/services/catalog`;
  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3000/api/public/services/catalog";
  }
  return PRODUCTION_CATALOG_URL;
}

function formatPriceTRY(price: number): string {
  return (
    new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price) + " ₺"
  );
}

/** Normalize API response item (accept snake_case or camelCase) */
function normalizeCatalogService(raw: unknown): CatalogService {
  const o = raw as Record<string, unknown>;
  const get = (snake: string, camel: string) =>
    (o[snake] ?? o[camel]) as CatalogService[keyof CatalogService];
  return {
    id: get("id", "id") as string | undefined,
    name: String(get("name", "name") ?? ""),
    category: get("category", "category") as string | null | undefined,
    duration_minutes: get("duration_minutes", "durationMinutes") as number | null | undefined,
    price: get("price", "price") as number | null | undefined,
    price_mode: get("price_mode", "priceMode") as string | null | undefined,
    price_min: get("price_min", "priceMin") as number | null | undefined,
    price_max: get("price_max", "priceMax") as number | null | undefined,
    display_price_text: get("display_price_text", "displayPriceText") as string | null | undefined,
    description: get("description", "description") as string | null | undefined,
    price_note: get("price_note", "priceNote") as string | null | undefined,
    sort_order: get("sort_order", "sortOrder") as number | null | undefined,
  };
}

/** Build fiyat string: display_price_text, else range (price_min–price_max), else single price */
function getPriceString(s: CatalogService): string {
  const display = s.display_price_text?.trim();
  if (display) return display;
  const hasRange =
    s.price_min != null &&
    s.price_max != null &&
    !isNaN(Number(s.price_min)) &&
    !isNaN(Number(s.price_max));
  if (hasRange) {
    const min = Number(s.price_min);
    const max = Number(s.price_max);
    return `${formatPriceTRY(min)} - ${formatPriceTRY(max)}`;
  }
  if (s.price != null && !isNaN(Number(s.price))) {
    return formatPriceTRY(Number(s.price));
  }
  return "";
}

/** Transform catalog array into existing PricesData shape */
function transformCatalogToPrices(
  services: CatalogService[]
): { categories: PricesByCategory; items: PriceItem[] } {
  const items: PriceItem[] = services.map((s, index) => {
    const kategori =
      s.category != null && String(s.category).trim()
        ? String(s.category).trim()
        : FALLBACK_CATEGORY;
    const fiyat = getPriceString(s);
    const sure =
      s.duration_minutes != null && s.duration_minutes > 0
        ? `${s.duration_minutes} dk`
        : "";
    const not = [s.description, s.price_note]
      .map((x) => (x != null ? String(x).trim() : ""))
      .find((x) => x.length > 0) ?? "";
    const sira =
      s.sort_order != null && !isNaN(Number(s.sort_order))
        ? Number(s.sort_order)
        : index;
    return {
      kategori,
      hizmet: s.name?.trim() || "Hizmet",
      sure,
      fiyat,
      not,
      sira,
    };
  });

  items.sort((a, b) => {
    if (a.kategori !== b.kategori)
      return a.kategori.localeCompare(b.kategori, "tr");
    return a.sira - b.sira;
  });

  const categories: PricesByCategory = {};
  for (const item of items) {
    if (!categories[item.kategori]) categories[item.kategori] = [];
    categories[item.kategori].push(item);
  }
  return { categories, items };
}

/** Legacy: fetch and parse Google Sheets CSV */
async function fetchFromGoogleSheets(): Promise<{
  categories: PricesByCategory;
  items: PriceItem[];
}> {
  const sheetId = "1wAvJhXwHLoBVUqfaj55gOPVKmwmdd4Vemo-61IeWrfg";
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;

  const response = await fetch(csvUrl, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Sheets fetch failed: ${response.status}`);
  }

  const csvText = await response.text();
  const lines = csvText.split("\n").filter((line) => line.trim().length > 0);

  if (lines.length < 2) {
    throw new Error("No data in sheet");
  }

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const dataLines = lines.slice(1);
  const items: PriceItem[] = [];

  for (const line of dataLines) {
    if (!line.trim()) continue;
    const columns = parseCSVLine(line);
    if (columns.length < 2) continue;

    const kategori = columns[0]?.trim() || "";
    const hizmet = columns[1]?.trim() || "";
    const sure = columns[2]?.trim() || "";
    const fiyat = columns[3]?.trim() || "";
    const not = columns[4]?.trim() || "";
    const siraStr = columns[5]?.trim() || "";
    if (!kategori || !hizmet) continue;

    let sira = 9999;
    if (siraStr) {
      const parsed = parseInt(siraStr, 10);
      if (!isNaN(parsed)) sira = parsed;
    }

    items.push({ kategori, hizmet, sure, fiyat, not, sira });
  }

  const grouped: PricesByCategory = {};
  for (const item of items) {
    if (!grouped[item.kategori]) grouped[item.kategori] = [];
    grouped[item.kategori].push(item);
  }
  for (const cat of Object.keys(grouped)) {
    grouped[cat].sort((a, b) => a.sira - b.sira);
  }

  return {
    categories: grouped,
    items: items.sort((a, b) => {
      if (a.kategori !== b.kategori) return a.kategori.localeCompare(b.kategori, "tr");
      return a.sira - b.sira;
    }),
  };
}

const DENEME_NAME = "deneme fiyat";

function buildDebugPayload(
  source: "catalog" | "sheets",
  catalogUrl: string,
  denemeCatalog: Record<string, unknown> | null,
  denemeTransformed: { hizmet: string; fiyat: string; not: string } | null
) {
  return {
    source,
    catalogUrl,
    denemeCatalog,
    denemeTransformed,
  };
}

export async function GET(request: NextRequest) {
  const url = request.url ? new URL(request.url) : null;
  const debugQuery = url?.searchParams.get("debug") === "1";

  const catalogUrl = getSalonAppCatalogUrl();
  if (process.env.NODE_ENV !== "production") {
    console.log("[prices] catalog URL:", catalogUrl);
  }

  // 1) Salon app catalog only (Google Sheets fallback TEMPORARILY disabled for diagnosis)
  try {
    const response = await fetch(catalogUrl, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (process.env.NODE_ENV !== "production") {
      console.log("[prices] catalog fetch ok:", response.ok, "status:", response.status);
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: "Catalog unavailable", catalogUrl, status: response.status },
        { status: 500 }
      );
    }

    const raw = await response.json();
    const rawObj = raw as Record<string, unknown>;
    const rawArray: unknown[] | null = Array.isArray(raw)
      ? raw
      : Array.isArray(rawObj?.data)
        ? (rawObj.data as unknown[])
        : Array.isArray(rawObj?.services)
          ? (rawObj.services as unknown[])
          : null;

    if (!rawArray || rawArray.length === 0) {
      return NextResponse.json(
        { error: "Catalog returned no array", catalogUrl },
        { status: 500 }
      );
    }

    const services = rawArray.map(normalizeCatalogService);
    const { categories, items } = transformCatalogToPrices(services);

    const denemeTransformedItem = items.find((i) =>
      i.hizmet.toLowerCase().includes(DENEME_NAME)
    );
    if (process.env.NODE_ENV !== "production" && denemeTransformedItem) {
      console.log("[prices] Deneme Fiyat (final):", {
        hizmet: denemeTransformedItem.hizmet,
        fiyat: denemeTransformedItem.fiyat,
        not: denemeTransformedItem.not,
      });
    }

    const body: Record<string, unknown> = { categories, items };
    if (debugQuery) {
      const denemeCatalogItem = services.find((s) =>
        String(s.name ?? "").toLowerCase().includes(DENEME_NAME)
      );
      body.debug = buildDebugPayload(
        "catalog",
        catalogUrl,
        denemeCatalogItem
          ? {
              name: denemeCatalogItem.name,
              price: denemeCatalogItem.price,
              price_min: denemeCatalogItem.price_min,
              price_max: denemeCatalogItem.price_max,
              display_price_text: denemeCatalogItem.display_price_text,
              description: denemeCatalogItem.description,
              price_note: denemeCatalogItem.price_note,
            }
          : null,
        denemeTransformedItem
          ? {
              hizmet: denemeTransformedItem.hizmet,
              fiyat: denemeTransformedItem.fiyat,
              not: denemeTransformedItem.not,
            }
          : null
      );
    }
    return NextResponse.json(body);
  } catch (err) {
    console.error("[prices] catalog error:", err);
    return NextResponse.json(
      { error: "Catalog fetch failed", catalogUrl, detail: String(err) },
      { status: 500 }
    );
  }
}
