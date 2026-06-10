"""
Apply all price migration SQL files directly to Supabase using service role key.
Run: python scripts/apply_price_migrations.py
"""
import re, os
import requests

SUPABASE_URL = "https://zzqlfxibkofvblnimahd.supabase.co"
SERVICE_KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6cWxmeGlia29mdmJsbmltYWhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDkwODMxMiwiZXhwIjoyMDk2NDg0MzEyfQ.e8_WzSRwHFc2GBizxE2BOWYZH8xydF-_tDo8NQbxTfo"

HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal",
}

MIGRATIONS = [
    "supabase/migrations/20260609220000_arivo_srp_prices.sql",
    "supabase/migrations/20260609230000_michelin_srp_prices.sql",
    "supabase/migrations/20260610090000_product1_srp_prices.sql",
]

def parse_updates(sql_text):
    """Extract (sku, retail_price, base_price) from UPDATE statements."""
    pattern = re.compile(
        r"UPDATE products SET retail_price\s*=\s*(\d+),\s*base_price\s*=\s*(\d+).*?WHERE sku\s*=\s*'([^']+)'"
    )
    return [(sku, int(rp), int(bp)) for rp, bp, sku in pattern.findall(sql_text)]

total_ok = total_err = 0

for migration_path in MIGRATIONS:
    if not os.path.exists(migration_path):
        print(f"SKIP (not found): {migration_path}")
        continue

    with open(migration_path, encoding="utf-8") as f:
        sql = f.read()

    updates = parse_updates(sql)
    print(f"\n{migration_path}")
    print(f"  Applying {len(updates)} price updates...")

    ok = err = 0
    for sku, retail_price, base_price in updates:
        resp = requests.patch(
            f"{SUPABASE_URL}/rest/v1/products?sku=eq.{requests.utils.quote(sku)}",
            headers=HEADERS,
            json={"retail_price": retail_price, "base_price": base_price},
        )
        if resp.status_code in (200, 204):
            ok += 1
        else:
            err += 1
            if err == 1:
                print(f"  ERROR {resp.status_code} sku={sku!r}: {resp.text[:200]}")
                if "42501" in resp.text:
                    print("  FIX: Run this in Supabase SQL Editor first:")
                    print("       GRANT SELECT, UPDATE ON products TO service_role;")
                    break

    print(f"  Done: {ok} OK | {err} errors")
    total_ok += ok
    total_err += err

print(f"\n{'='*50}")
print(f"TOTAL: {total_ok} updated | {total_err} errors")
