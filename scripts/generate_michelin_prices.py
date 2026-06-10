import openpyxl
import re
from datetime import datetime

# ── PDF price data (extracted from MICHELIN.pdf) ──────────────────────────────
# Format: (normalized_size, normalized_type, srp)
PDF_PRICES_RAW = [
    # PAGE 1 - Energy XM2+, Pilot Sport 3, Primacy 4 ST, Primacy SUV+
    ("175/70/13", "ENERGY XM2+", 4680),
    ("165/60/14", "ENERGY XM2+", 4690),
    ("185/60/14", "ENERGY XM2+", 5210),
    ("165/65/14", "ENERGY XM2+", 4760),
    ("175/65/14", "ENERGY XM2+", 4600),
    ("185/65/14", "ENERGY XM2+", 5600),
    ("175/70/14", "ENERGY XM2+", 6040),
    ("185/70/14", "ENERGY XM2+", 5530),
    ("195/70/14", "ENERGY XM2+", 6080),
    ("175/50/15", "ENERGY XM2+", 5750),
    ("195/50/15", "PILOT SPORT 3", 7020),
    ("185/55/15", "ENERGY XM2+", 5980),
    ("195/55/15", "ENERGY XM2+", 6290),
    ("185/60/15", "ENERGY XM2+", 5550),
    ("195/60/15", "PRIMACY 4 ST", 6890),
    ("205/60/15", "ENERGY XM2+", 7110),
    ("175/65/15", "ENERGY XM2+", 5630),
    ("185/65/15", "ENERGY XM2+", 6580),
    ("195/65/15", "ENERGY XM2+", 6790),
    ("205/65/15", "ENERGY XM2+", 5950),
    ("215/65/15", "ENERGY XM2+", 8110),
    ("205/70/15", "PRIMACY SUV+", 7820),
    ("205/45/16", "PILOT SPORT 3", 8280),
    ("195/50/16", "ENERGY XM2+", 7420),
    ("205/50/16", "PILOT SPORT 4 ST", 7930),
    ("185/55/16", "ENERGY XM2+", 7210),
    ("195/55/16", "PRIMACY 5", 7650),
    ("205/55/16", "ENERGY XM2+", 6510),
    # PAGE 2
    ("215/55/16", "PRIMACY 5", 9110),
    ("225/55/16", "PRIMACY 5", 9840),
    ("195/60/16", "PRIMACY 5", 8570),
    ("205/60/16", "PRIMACY 5", 7880),
    ("215/60/16", "ENERGY XM2+", 9000),
    ("235/60/16", "PRIMACY 4 ST", 11400),
    ("205/65/16", "PRIMACY 5", 6880),
    ("215/65/16", "ENERGY XM2+", 8050),
    ("215/70/16", "PRIMACY SUV+", 10260),
    ("265/70/16", "PRIMACY SUV+", 11890),
    ("205/40/17", "PILOT SPORT 5", 11440),
    ("245/40/17", "PILOT SPORT 5", 14160),
    ("205/45/17", "PILOT SPORT 5", 9950),
    ("215/45/17", "PILOT SPORT 5", 10200),
    ("225/45/17", "PRIMACY 5", 10370),
    ("235/45/17", "PRIMACY 5", 11130),
    ("245/45/17", "PRIMACY 4 ST", 11600),
    ("205/50/17", "PRIMACY 5", 8680),
    ("215/50/17", "PRIMACY 5", 10310),
    ("225/50/17", "PRIMACY 5", 10530),
    ("205/55/17", "PRIMACY 5", 9920),
    ("215/55/17", "PRIMACY 5", 9670),
    ("225/55/17", "PRIMACY 5", 10960),
    ("235/55/17", "PRIMACY 5", 11670),
    ("215/60/17", "PRIMACY 5", 9680),
    ("225/60/17", "PRIMACY 5", 11000),
    ("235/60/17", "PRIMACY SUV+", 10790),
    ("225/65/17", "PRIMACY SUV+", 10510),
    ("245/65/17", "PRIMACY SUV+", 13230),
    ("255/65/17", "PRIMACY SUV+", 11570),
    ("265/65/17", "PRIMACY SUV+", 10790),
    ("265/70/17", "PRIMACY SUV+", 12950),
    ("225/45/18", "PRIMACY 5", 10890),
    ("245/45/18", "PRIMACY 5", 11970),
    ("215/50/18", "PRIMACY SUV+", 10320),
    ("225/50/18", "PRIMACY 5", 10790),
    ("235/50/18", "PRIMACY 5", 11420),
    ("245/50/18", "PRIMACY 5", 12960),
    ("215/55/18", "PRIMACY 5", 12830),
    ("225/55/18", "PRIMACY 5", 10890),
    # PAGE 3
    ("235/55/18", "PRIMACY 5", 11160),
    ("225/60/18", "PRIMACY SUV+", 12440),
    ("235/60/18", "E PRIMACY ST", 11320),
    ("245/60/18", "PRIMACY SUV+", 12580),
    ("255/60/18", "PRIMACY SUV+", 13630),
    ("265/60/18", "PRIMACY SUV+", 11990),
    ("235/65/18", "PRIMACY SUV+", 15320),
    ("275/65/18", "PRIMACY SUV+", 15370),
    ("255/45/19", "PILOT SPORT EV", 19050),
    ("235/50/19", "PRIMACY 5", 14520),
    ("225/55/19", "PRIMACY SUV+", 11630),
    ("235/55/19", "PRIMACY 4SUV", 14730),
    ("245/55/19", "PRIMACY SUV+", 14740),
    ("245/40/20", "E-PRIMACY", 14950),
    ("255/40/20", "PILOT SPORT EV", 21580),
    ("255/45/20", "PILOT SPORT EV", 15260),
    ("245/50/20", "PRIMACY SUV+", 16740),
    ("265/50/20", "PILOT SPORT 4SUV", 12400),
    ("235/55/20", "PRIMACY SUV+", 18260),
    ("275/60/20", "PRIMACY SUV+", 17680),
    ("225/45/21", "E-PRIMACY", 29050),
    ("265/45/21", "PILOT SPORT EV", 25160),
    # PAGE 3 - Agilis 3 commercial
    ("185/14C", "AGILIS 3", 6510),
    ("195/80/14C", "AGILIS 3", 6810),
    ("195/80/15C", "AGILIS 3", 7230),
    ("205/70/15C", "AGILIS 3", 7640),
    ("215/70/15C", "AGILIS 3", 7930),
    ("225/70/15C", "AGILIS 3", 8810),
    ("215/70/16C", "AGILIS 3", 8450),
    ("235/65/16C", "AGILIS 3", 11550),
    ("235/60/17C", "AGILIS 3", 11160),
    # PAGE 3 - LTX Trail
    ("225/70/15", "LTX TRAIL", 8410),
    ("235/70/15", "LTX TRAIL", 9360),
    ("265/70/15", "LTX TRAIL", 11280),
    ("235/75/15", "LTX TRAIL", 9220),
    # PAGE 4 - LTX Trail continued
    ("235/70/16", "LTX TRAIL", 10840),
    ("245/70/16", "LTX TRAIL", 10150),
    ("265/70/16", "LTX TRAIL", 11490),
    ("235/65/17", "LTX TRAIL", 11290),
    ("265/65/17", "LTX TRAIL", 12510),
    ("265/60/18", "LTX TRAIL", 13520),
    ("285/60/18", "LTX TRAIL", 16630),
    # PAGE 4 - Pilot Sport 5 (performance)
    ("245/35/18", "PILOT SPORT 5", 14980),
    ("255/35/18", "PILOT SPORT 5", 14240),
    ("265/35/18", "PILOT SPORT 5", 15190),
    ("215/40/18", "PILOT SPORT 5", 12650),
    ("225/40/18", "PILOT SPORT 4", 10660),
    ("225/40/18", "PILOT SPORT 5", 15230),
    ("235/40/18", "PILOT SPORT 5", 12950),
    ("245/40/18", "PILOT SPORT 5", 14560),
    ("255/40/18", "PILOT SPORT 5", 14580),
    ("215/45/18", "PILOT SPORT 5", 15770),
    ("225/45/18", "PILOT SPORT 5", 14560),
    ("235/45/18", "PILOT SPORT 5", 13590),
    ("245/45/18", "PILOT SPORT 5", 14620),
    ("235/35/19", "PILOT SPORT 5", 15850),
    ("245/35/19", "PILOT SPORT 5", 15610),
    ("255/35/19", "PILOT SPORT 5", 20920),
    ("275/35/19", "PILOT SPORT 5", 19390),
    ("225/40/19", "PILOT SPORT 5", 16530),
    ("245/40/19", "PILOT SPORT 5", 15320),
    ("255/40/19", "PILOT SPORT 5", 15320),
    ("275/40/19", "PILOT SPORT 5", 17690),
    ("285/40/19", "PILOT SPORT 5", 22100),
    ("225/45/19", "PILOT SPORT 5", 19210),
    ("235/45/19", "PILOT SPORT 5", 19210),
    ("245/45/19", "PILOT SPORT 5", 19420),
    ("255/45/19", "PILOT SPORT 5", 16390),
    ("245/35/20", "PILOT SPORT 5", 19910),
    ("245/45/20", "PILOT SPORT4", 21790),
    ("315/30/21", "PILOT SPORT4", 30530),
    # PAGE 5 - Pilot Sport 4S
    ("295/30/18", "PILOT SPORT 4S", 31660),
    ("255/35/18", "PILOT SPORT 4S", 23990),
    ("265/35/18", "PILOT SPORT 4S", 24370),
    ("275/35/18", "PILOT SPORT 4S", 24330),
    ("285/35/18", "PILOT SPORT 4S", 28210),
    ("225/40/18", "PILOT SPORT 4S", 19880),
    ("235/40/18", "PILOT SPORT 4S", 17470),
    ("225/50/18", "PILOT SPORT 4S", 16550),
    ("235/50/18", "PILOT SPORT 4S", 17740),
    ("245/30/19", "PILOT SPORT 4S", 25840),
    ("255/30/19", "PILOT SPORT 4S", 24310),
    ("265/30/19", "PILOT SPORT 4S", 29430),
    ("275/30/19", "PILOT SPORT 4S", 32090),
    ("285/30/19", "PILOT SPORT 4S", 35020),
    ("295/30/19", "PILOT SPORT 4S", 33860),
    ("305/30/19", "PILOT SPORT 4S", 35610),
    ("225/35/19", "PILOT SPORT 4S", 22400),
    ("235/35/19", "PILOT SPORT 4S", 23470),
    ("245/35/19", "PILOT SPORT 4S", 24650),
    ("255/35/19", "PILOT SPORT 4S", 23360),
    ("265/35/19", "PILOT SPORT 4S", 28420),
    ("275/35/19", "PILOT SPORT 4S", 31020),
    ("285/35/19", "PILOT SPORT 4S", 33350),
    ("295/35/19", "PILOT SPORT 4S", 35370),
    ("225/40/19", "PILOT SPORT 4S", 21590),
    ("235/40/19", "PILOT SPORT 4S", 23830),
    ("245/40/19", "PILOT SPORT 4S", 24970),
    ("255/40/19", "PILOT SPORT 4S", 28640),
    ("265/40/19", "PILOT SPORT 4S", 30190),
    ("275/40/19", "PILOT SPORT 4S", 28580),
    ("225/45/19", "PILOT SPORT 4S", 20760),
    ("275/30/20", "PILOT SPORT 4S", 32650),
    ("245/30/20", "PILOT SPORT 4S", 28420),
    # PAGE 8 - Pilot Sport 4SUV
    ("255/55/18", "PILOT SPORT 4SUV", 17080),
    ("235/50/19", "PILOT SPORT 4SUV", 19060),
    ("245/50/19", "PILOT SPORT 4SUV", 21910),
    ("255/50/19", "PILOT SPORT 4SUV", 21790),
    ("265/50/19", "PILOT SPORT 4SUV", 19510),
    ("225/55/19", "PILOT SPORT 4SUV", 18290),
    ("235/55/19", "PILOT SPORT 4SUV", 18750),
    ("255/55/19", "PILOT SPORT 4SUV", 20400),
    ("265/55/19", "PILOT SPORT 4SUV", 23220),
    ("275/55/19", "PILOT SPORT 4SUV", 22550),
    ("265/50/20", "PILOT SPORT 4SUV", 12400),
]

# Build lookup: (norm_size, norm_type) → srp, and size-only lookup
def norm_size_pdf(s):
    s = s.upper().strip().replace(' ', '')
    s = s.replace('LT', '')
    # Convert ZR→R before stripping (225/40ZR18 → 225/40R18)
    s = s.replace('ZR', 'R').replace('RF', 'R')
    # Remove trailing C from commercial sizes carefully
    # 185R14c → 185/14C, 215/70R16c → 215/70/16C
    s = re.sub(r'R(\d+)[Cc]$', r'/\1C', s)   # R14c → /14C
    # Standard: 175/65R13 → 175/65/13
    s = re.sub(r'R(\d+)$', r'/\1', s)
    s = re.sub(r'/+', '/', s)
    return s.strip('/')

def norm_type(t):
    t = t.upper().strip()
    t = re.sub(r'\s+', ' ', t)
    # Normalize aliases
    aliases = {
        'PILOT SPORT 4 ST': 'PILOT SPORT 4 ST',
        'PILOT SPORT4': 'PILOT SPORT 4',
        'PILOT SPORT 4SUV': 'PILOT SPORT 4SUV',
        'PILOT SPORT 4 SUV': 'PILOT SPORT 4SUV',
        'E PRIMACY ST': 'E PRIMACY',
        'E-PRIMACY': 'E PRIMACY',
        'E PRIMACY': 'E PRIMACY',
    }
    return aliases.get(t, t)

# Build price lookups
price_by_size_type = {}
price_by_size = {}

for raw_size, raw_type, srp in PDF_PRICES_RAW:
    ns = norm_size_pdf(raw_size)
    nt = norm_type(raw_type)
    key = (ns, nt)
    if key not in price_by_size_type:
        price_by_size_type[key] = srp
    # Size-only (for fallback) - store the first match
    if ns not in price_by_size:
        price_by_size[ns] = (srp, raw_type)

# ── Excel products ────────────────────────────────────────────────────────────
SIZE_TYPOS = {
    '214/45/17': '215/45/17',  # MICHELINE-PCR typo
}

def norm_size_excel(s):
    s = s.upper().strip()
    s = re.sub(r'\s+', '', s)          # remove spaces (handles "205/ 65/15")
    s = s.replace('C', '')             # strip trailing C from commercial (we'll add back below)
    s = re.sub(r'/+', '/', s)
    s = s.strip('/')
    s = SIZE_TYPOS.get(s, s)
    return s

def norm_type_excel(t):
    t = t.upper().strip()
    t = re.sub(r'\s+', ' ', t)
    t = re.sub(r'-+', ' ', t)         # PILOT SPORT-5 → PILOT SPORT 5
    t = re.sub(r'\s+', ' ', t).strip()
    aliases = {
        'ENERGY XM2': 'ENERGY XM2+',         # older branding
        'PRIMACY ST': 'PRIMACY 5',            # no direct match, use P5
        'PRIMACY 3': 'PRIMACY 5',             # discontinued, map to P5
        'PRIMACY SUV': 'PRIMACY SUV+',
        'PRIMACY5': 'PRIMACY 5',
        'PILOTSPORT 5': 'PILOT SPORT 5',
        'PILOT SPORT 5': 'PILOT SPORT 5',
        'PILOT SPORT 4': 'PILOT SPORT 4',
        'PILOT SPORT 4S': 'PILOT SPORT 4S',
        'PILOT SPORT 4 SUV': 'PILOT SPORT 4SUV',
        'PILOT SPORT EV': 'PILOT SPORT EV',
        'AGILIS 3 RC': 'AGILIS 3',            # RC = Reinforced Commercial
        'AGILIS 3': 'AGILIS 3',
        'AGILIS-3': 'AGILIS 3',
        'LTX TRAIL ST': 'LTX TRAIL',          # ST suffix not in PDF
        'LTX TRAIL': 'LTX TRAIL',
        'E PRIMACY': 'E PRIMACY',
        'PRIMACY 4 ST': 'PRIMACY 4 ST',
        'PRIMACY 5': 'PRIMACY 5',
        'PRIMACY SUV+': 'PRIMACY SUV+',
    }
    return aliases.get(t, t)

wb = openpyxl.load_workbook('ADZ-RUGGEd-PRO_INVENTORY-SYSTEM-1.xlsx', data_only=True)
ws = wb['MICHELIN ']

products = []
seen_skus = set()
for row in ws.iter_rows(min_row=10, values_only=True):
    code = row[0]
    desc = row[3]
    if not code or not str(code).strip().startswith('MICH'):
        continue
    sku = str(code).strip()
    raw_desc = str(desc).strip() if desc else ''
    if sku in seen_skus:
        continue
    seen_skus.add(sku)
    products.append((sku, raw_desc))

# ── Match and generate SQL ────────────────────────────────────────────────────
matched = []
issues = []

for sku, raw_desc in products:
    # Parse description: handle formats like:
    # "ENERGY XM2+ - 175/65/14"
    # "AGILIS-3 235/60/17" (no dash separator, type has dash)
    # "LTX TRAIL  265/65/17" (double space)
    # "PILOT SPORT-5 205/45/17"
    # "PILOT SPORT 5 -245/45/19" (dash before size)

    # Try split on ' - ' first
    if ' - ' in raw_desc:
        parts = raw_desc.split(' - ', 1)
        raw_type = parts[0].strip()
        raw_size = parts[1].strip()
    else:
        # No ' - ' separator: last token is size
        tokens = raw_desc.rsplit(None, 1)
        if len(tokens) == 2:
            raw_type = tokens[0].strip(' -')
            raw_size = tokens[1].strip(' -')
        else:
            issues.append((sku, raw_desc, 'PARSE ERROR'))
            continue

    ne = norm_size_excel(raw_size)
    te = norm_type_excel(raw_type)

    # Check if commercial (C suffix in original)
    is_commercial = 'C' in raw_size.upper().split('/')[-1] or raw_size.upper().endswith('C')
    if is_commercial:
        ne_with_c = ne + 'C'
    else:
        ne_with_c = ne

    # Try exact size+type match
    key = (ne_with_c if is_commercial else ne, te)
    srp = price_by_size_type.get(key)
    match_note = 'EXACT'

    if srp is None and is_commercial:
        # Try without C
        key2 = (ne, te)
        srp = price_by_size_type.get(key2)
        if srp:
            match_note = 'APPROX (no C)'

    if srp is None and not is_commercial:
        # Commercial tire type but no C in Excel size — try C variant (e.g. AGILIS 3 235/60/17)
        if te in ('AGILIS 3',):
            key_c = (ne + 'C', te)
            srp = price_by_size_type.get(key_c)
            if srp:
                match_note = 'COMMERCIAL (added C)'

    if srp is None:
        # Size-only fallback
        sz = ne_with_c if is_commercial else ne
        if sz in price_by_size:
            srp, pdf_type = price_by_size[sz]
            match_note = f'SIZE-ONLY (PDF: {pdf_type})'
            if pdf_type.upper() != te.upper():
                issues.append((sku, raw_desc, f'TYPE MISMATCH: excel={te} pdf={pdf_type} size={sz} price={srp}'))
        else:
            issues.append((sku, raw_desc, f'NOT IN PDF (size={ne}, type={te})'))
            continue

    matched.append((sku, raw_desc, srp, match_note))

# ── Output ────────────────────────────────────────────────────────────────────
print(f"\nMatched: {len(matched)} | Issues: {len(issues)}")
print("\n--- ISSUES ---")
for sku, desc, note in issues:
    print(f"  {sku}: {desc} -> {note}")

print("\n--- MATCHES ---")
for sku, desc, srp, note in matched:
    print(f"  {sku}: {desc} -> {srp:,} ({note})")

# ── Generate SQL ──────────────────────────────────────────────────────────────
ts = datetime.now().strftime('%Y-%m-%d %H:%M')
lines = [
    f"-- MICHELIN SRP price update from official PDF price list",
    f"-- Generated: {ts}",
    f"-- {len(matched)} products updated | {len(issues)} skipped (no match/parse error)",
    "",
]
for sku, desc, srp, note in matched:
    clean_desc = desc.replace("'", "''")
    lines.append(
        f"UPDATE products SET retail_price = {srp}, base_price = {srp}, updated_at = now() WHERE sku = '{sku}'; -- {clean_desc}"
    )

if issues:
    lines.append("")
    lines.append("-- Skipped:")
    for sku, desc, note in issues:
        lines.append(f"-- {sku}: {desc} ({note})")

sql = "\n".join(lines)
out_path = 'supabase/migrations/20260609230000_michelin_srp_prices.sql'
with open(out_path, 'w', encoding='utf-8') as f:
    f.write(sql)
print(f"\nSQL written to {out_path}")
