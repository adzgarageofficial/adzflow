"""
Generates a Supabase SQL seed migration from the ADZ Excel inventory file.
Run: python scripts/generate_seed.py
"""
import openpyxl
import uuid
import re
from pathlib import Path

wb = openpyxl.load_workbook(r'ADZ-RUGGEd-PRO_INVENTORY-SYSTEM-1.xlsx')
ws = wb['MM']

# ---- Extract raw products ----
def is_formula(v):
    return isinstance(v, str) and v.strip().startswith('=')

raw = []
for row in ws.iter_rows(min_row=4, values_only=True):
    sku = str(row[0]).strip() if row[0] and not is_formula(row[0]) else ''
    if not sku or not sku[0].isalpha():
        continue
    brand = str(row[1]).strip() if row[1] and not is_formula(row[1]) else ''
    item_name = str(row[2]).strip() if row[2] and not is_formula(row[2]) else ''
    desc = str(row[3]).strip() if row[3] and not is_formula(row[3]) else ''
    color = str(row[4]).strip() if row[4] and not is_formula(row[4]) else ''
    uom = str(row[5]).strip() if row[5] and not is_formula(row[5]) else ''
    location = str(row[6]).strip() if row[6] and not is_formula(row[6]) else ''
    srp = float(row[7]) if row[7] and isinstance(row[7], (int, float)) else 0.0
    cost = float(row[9]) if row[9] and isinstance(row[9], (int, float)) else 0.0
    supplier = str(row[8]).strip() if row[8] and not is_formula(row[8]) else ''
    qty = int(row[10]) if row[10] and isinstance(row[10], (int, float)) else 0
    raw.append({
        'sku': sku, 'brand': brand, 'item_name': item_name,
        'desc': desc, 'color': color, 'uom': uom,
        'location': location, 'srp': srp, 'cost': cost, 'supplier': supplier, 'qty': qty,
    })

print(f'Raw products extracted: {len(raw)}')

# ---- Brand normalization ----
BRAND_MAP = {
    'BFGOODRICH OFFROAD - K02': 'BFG',
    'BFGOODRICH OFFROAD - K03': 'BFG',
    'BFGOODRICH OFFROAD - KM3': 'BFG',
    'BFGOODRICH OFFROAD -A-TOURING': 'BFG',
    'BFGOODRICH OFFROAD KM3': 'BFG',
    'BFGOODRICH TT- TRAIL TERRAIN': 'BFG',
    'FUEL': 'FUEL OFFROAD',
    'MICHELINE': 'MICHELIN',
    'PROFENDER PREMIUM': 'PROFENDER',
    'PROFENDER QUEEN SERIES': 'PROFENDER',
    'RAYS ORIG.': 'RAYS ORIG',
    'ARIV-TIRE-007': 'ARIVO',
    'ASDWF': 'ARIVO',
    'VLDF': 'VLF',
    'HAMER DIVIDER': 'HAMER',
    'HAMER H-MAT': 'HAMER',
    'HAMER LED 7"': 'HAMER',
    'OME NITRO CHARGER': 'OME',
    'TRX OFFROAD RIMS': 'TRX',
    'TUNES SERIES': 'TUNER',
    'AC- ELAIN': 'ELAINE',
    'JAOS SJID PLATE': 'JAOS',
    'SEDAN': 'VLF',
}

# ---- Category normalization ----
CAT_MAP = {
    'TIRE': 'TIRES',
    'SHOCK': 'SHOCK ABSORBERS',
    'FRONT STABLINK': 'STABLINK',
    'ARIV-TIRE-007': 'TIRES',
    'ET -10': 'MAGS',
    'ET 0': 'MAGS',
    'ET 5': 'MAGS',
    'ET 10': 'MAGS',
    'ET 20': 'MAGS',
    'ET 25': 'MAGS',
    'ET 35': 'MAGS',
    'ET 38': 'MAGS',
    'ET 40': 'MAGS',
    'ET 55': 'MAGS',
    'RIMS': 'MAGS',
    'CASTER BUSHING': 'SUSPENSION',
    'COIL SPRING': 'SUSPENSION',
    'REAR ADD LEAF': 'SUSPENSION',
    'SUSPENSION FULL KIT': 'SUSPENSION',
}

# ---- Location normalization ----
LOC_MAP = {
    'RACK1': 'RACK 1',
    'RACK9': 'RACK 9',
    'ADD  3': 'RACK 3',
    'ADD 3': 'RACK 3',
    'ADD 5': 'RACK 5',
    'ADD 8': 'RACK 8',
    'SOLD': 'ADZ Main Warehouse',
    'USED': 'ADZ Main Warehouse',
    'NO STICKER': 'ADZ Main Warehouse',
    'W/ STICKER': 'ADZ Main Warehouse',
    'w/ sticker': 'ADZ Main Warehouse',
    'SOLD 215/45/17': 'ADZ Main Warehouse',
    'WH 1': 'ADZ Main Warehouse',
}

def clean_brand(b):
    return BRAND_MAP.get(b, b) if b else 'ADZ GENERIC'

def clean_cat(c):
    return CAT_MAP.get(c, c) if c else 'GENERAL'

def clean_loc(l):
    return LOC_MAP.get(l, l) if l else 'ADZ Main Warehouse'

def esc(s):
    return s.replace("'", "''") if s else ''

# Apply normalization
for p in raw:
    p['brand'] = clean_brand(p['brand'])
    p['item_name'] = clean_cat(p['item_name'])
    p['location'] = clean_loc(p['location'])

# ---- Build lookup tables ----
brands_list = sorted(set(p['brand'] for p in raw if p['brand']))
cats_list = sorted(set(p['item_name'] for p in raw if p['item_name']))
locs_list = sorted(set(p['location'] for p in raw if p['location']))
suppliers_list = sorted(set(p['supplier'] for p in raw if p['supplier']))

# Assign UUIDs
brand_ids = {b: str(uuid.uuid4()) for b in brands_list}
cat_ids = {c: str(uuid.uuid4()) for c in cats_list}
loc_ids = {l: str(uuid.uuid4()) for l in locs_list}
# Add ADZ Main Warehouse if not present
if 'ADZ Main Warehouse' not in loc_ids:
    loc_ids['ADZ Main Warehouse'] = str(uuid.uuid4())
    locs_list.append('ADZ Main Warehouse')
supplier_ids = {s: str(uuid.uuid4()) for s in suppliers_list}
product_ids = {}

print(f'Brands: {len(brands_list)}')
print(f'Categories: {len(cats_list)}')
print(f'Warehouses: {len(locs_list)}')
print(f'Suppliers: {len(suppliers_list)}')

# ---- Generate SQL ----
lines = []
lines.append('-- ADZ Garage Inventory Seed Migration')
lines.append('-- Generated from ADZ-RUGGEd-PRO_INVENTORY-SYSTEM-1.xlsx')
lines.append('-- 907 products across 57 brands, 40+ categories\n')

# Brands
lines.append('-- ===== BRANDS =====')
lines.append('INSERT INTO brands (id, name, updated_at) VALUES')
brand_rows = []
for b in brands_list:
    brand_rows.append(f"  ('{brand_ids[b]}', '{esc(b)}', now())")
lines.append(',\n'.join(brand_rows))
lines.append("ON CONFLICT (name) DO NOTHING;\n")

# Categories
lines.append('-- ===== CATEGORIES =====')
lines.append('INSERT INTO categories (id, name, slug, updated_at) VALUES')
cat_rows = []
for c in cats_list:
    slug = re.sub(r'[^a-z0-9]+', '-', c.lower()).strip('-')
    cat_rows.append(f"  ('{cat_ids[c]}', '{esc(c)}', '{slug}', now())")
lines.append(',\n'.join(cat_rows))
lines.append("ON CONFLICT (name) DO NOTHING;\n")

# Warehouses
lines.append('-- ===== WAREHOUSES =====')
lines.append('INSERT INTO warehouses (id, name, updated_at) VALUES')
wh_rows = []
for l in sorted(locs_list):
    wh_rows.append(f"  ('{loc_ids[l]}', '{esc(l)}', now())")
lines.append(',\n'.join(wh_rows))
lines.append("ON CONFLICT (name) DO NOTHING;\n")

# Suppliers (no unique constraint on name — use ON CONFLICT (id))
lines.append('-- ===== SUPPLIERS =====')
if suppliers_list:
    lines.append('INSERT INTO suppliers (id, name, updated_at) VALUES')
    sup_rows = []
    for s in suppliers_list:
        sup_rows.append(f"  ('{supplier_ids[s]}', '{esc(s)}', now())")
    lines.append(',\n'.join(sup_rows))
    lines.append("ON CONFLICT (id) DO NOTHING;\n")

# Products — use subquery lookup for brand_id / category_id so re-runs work even if
# brands/categories already exist with different UUIDs
lines.append('-- ===== PRODUCTS =====')
# Deduplicate by sku — keep last occurrence (same as Excel order)
seen_skus = {}
for p in raw:
    seen_skus[p['sku']] = p
unique_products = list(seen_skus.values())

prod_rows = []
for p in unique_products:
    name = f"{p['item_name']} {p['desc']}".strip() if p['desc'] else p['item_name']
    srp = p['srp'] or 0.0
    cost = p['cost'] or 0.0
    uom = p['uom'].strip() if p['uom'] else ''
    specs_str = '{}'
    if uom or p['color']:
        parts = []
        if uom: parts.append(f'"uom":"{esc(uom)}"')
        if p['color']: parts.append(f'"color":"{esc(p["color"])}"')
        specs_str = '{' + ','.join(parts) + '}'
    prod_rows.append(
        f"INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)\n"
        f"SELECT gen_random_uuid(), '{esc(p['sku'])}', '{esc(name)}', '{esc(p['desc'])}',\n"
        f"       (SELECT id FROM brands WHERE name = '{esc(p['brand'])}'),\n"
        f"       (SELECT id FROM categories WHERE name = '{esc(p['item_name'])}'),\n"
        f"       {srp}, {srp}, {cost}, 'active', now(), '{specs_str}'::jsonb\n"
        f"WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = '{esc(p['sku'])}');"
    )
lines.append('\n'.join(prod_rows))
lines.append('')

# Inventory Levels — deduplicate by (sku, location), sum quantities
# Use subquery JOIN so product_id/warehouse_id are always the live DB values
inv_map = {}  # (sku, location) → qty
for p in raw:
    key = (p['sku'], p['location'])
    inv_map[key] = inv_map.get(key, 0) + max(0, p['qty'])

lines.append('-- ===== INVENTORY LEVELS =====')
inv_rows = []
for (sku, loc), qty in inv_map.items():
    inv_rows.append(
        f"INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)\n"
        f"SELECT gen_random_uuid(), p.id, w.id, {qty}, 0, 0, now()\n"
        f"FROM products p, warehouses w\n"
        f"WHERE p.sku = '{esc(sku)}' AND w.name = '{esc(loc)}'\n"
        f"ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();"
    )
lines.append('\n'.join(inv_rows))
lines.append('')

# Write output
out = Path('supabase/migrations/20260609200000_seed_inventory.sql')
out.write_text('\n'.join(lines), encoding='utf-8')
print(f'\nSQL migration written to: {out}')
print(f'File size: {out.stat().st_size:,} bytes')
