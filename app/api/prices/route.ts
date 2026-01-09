import { NextResponse } from "next/server";

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

export async function GET() {
  try {
    // Google Sheets CSV export URL
    const sheetId = "1wAvJhXwHLoBVUqfaj55gOPVKmwmdd4Vemo-61IeWrfg";
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;

    const response = await fetch(csvUrl, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error("Failed to fetch Google Sheets CSV:", response.status);
      return NextResponse.json(
        { error: "Failed to fetch price data" },
        { status: response.status }
      );
    }

    const csvText = await response.text();
    const lines = csvText.split("\n").filter((line) => line.trim().length > 0);

    if (lines.length < 2) {
      return NextResponse.json(
        { error: "No data found in sheet" },
        { status: 404 }
      );
    }

    // Skip header row
    const dataLines = lines.slice(1);

    // Parse CSV (simple parser - handles quoted fields)
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
            i++; // Skip next quote
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

    const items: PriceItem[] = [];

    for (const line of dataLines) {
      if (!line.trim()) continue;

      const columns = parseCSVLine(line);

      // Expected columns: kategori, hizmet, sure, fiyat, not, sira
      if (columns.length < 2) continue; // At least kategori and hizmet

      const kategori = columns[0]?.trim() || "";
      const hizmet = columns[1]?.trim() || "";
      const sure = columns[2]?.trim() || "";
      const fiyat = columns[3]?.trim() || "";
      const not = columns[4]?.trim() || "";
      const siraStr = columns[5]?.trim() || "";

      // Skip if no kategori or hizmet
      if (!kategori || !hizmet) continue;

      // Parse sira (numeric, default 9999 if invalid)
      let sira = 9999;
      if (siraStr) {
        const parsed = parseInt(siraStr, 10);
        if (!isNaN(parsed)) {
          sira = parsed;
        }
      }

      items.push({
        kategori,
        hizmet,
        sure,
        fiyat,
        not,
        sira,
      });
    }

    // Group by category and sort
    const grouped: PricesByCategory = {};
    for (const item of items) {
      if (!grouped[item.kategori]) {
        grouped[item.kategori] = [];
      }
      grouped[item.kategori].push(item);
    }

    // Sort items within each category by sira
    for (const category in grouped) {
      grouped[category].sort((a, b) => a.sira - b.sira);
    }

    return NextResponse.json({
      categories: grouped,
      items: items.sort((a, b) => {
        // Sort by category first, then by sira
        if (a.kategori !== b.kategori) {
          return a.kategori.localeCompare(b.kategori, "tr");
        }
        return a.sira - b.sira;
      }),
    });
  } catch (error) {
    console.error("Error fetching prices:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
