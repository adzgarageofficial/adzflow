"""
Generate SRP price migration for BFG, Venom, Cooper, Apollo from product_1 supplier images.
Run: python scripts/generate_product1_prices.py
"""
import openpyxl, re
from datetime import datetime

# ── Size normalizer ───────────────────────────────────────────────────────────
def ns(s):
    s = str(s).upper().strip().replace(' ', '')
    s = re.sub(r'^LT', '', s)           # strip LT prefix
    s = s.replace('X', '/')             # 35x12.5 → 35/12.5
    s = re.sub(r'ZR', 'R', s)          # ZR → R
    s = re.sub(r'R(\d+)[C]?$', r'/\1', s)  # R15 / R14C → /15 /14
    s = re.sub(r'-C$', '', s)           # -C suffix
    s = re.sub(r'C$', '', s)            # trailing C
    s = re.sub(r'/+', '/', s).strip('/')
    # normalize trailing zero decimals: 12.50 → 12.5
    s = re.sub(r'(\d+\.\d*?)0+(/|$)', r'\1\2', s)
    s = re.sub(r'(\d+)\.(/|$)', r'\1\2', s)
    return s

# ── BFG KM3 prices (from product_1 image) ────────────────────────────────────
BFG_KM3 = {ns(k): v for k, v in [
    ('235/75R15', 17080), ('30x9.5R15', 17370), ('31x10.5R15', 17720),
    ('33x12.5R15', 21090), ('35x12.5R15', 22640), ('225/75R16', 14740),
    ('235/70R16', 17940), ('235/85R16', 18630), ('255/85R16', 20050),
    ('265/75R16', 20480), ('285/75R16', 22050), ('315/75R16', 27190),
    ('265/70R17', 21890), ('285/70R17', 24480), ('285/75R17', 24340),
    ('295/70R17', 25950), ('35x12.5R17', 27250), ('37x13.5R17', 29170),
    ('275/65R18', 22340), ('285/65R18', 24090), ('295/70R18', 26470),
    ('33x12.5R18', 24930), ('35x12.5R18', 26150), ('285/55R20', 25770),
    ('305/55R20', 28220), ('33x12.5R20', 25450), ('35x12.5R20', 27820),
    ('37x13.5R20', 31250), ('37x13.5R22', 33880),
]}

# ── BFG KO3 prices (from product_1 image) ────────────────────────────────────
BFG_KO3 = {ns(k): v for k, v in [
    ('LT215/75R15', 14320), ('LT235/75R15', 16420), ('LT31x10.5R15', 16920),
    ('LT235/70R16', 16650), ('LT195/65R16', 14630), ('LT225/70R16', 15890),
    ('LT265/75R16', 20780), ('LT285/75R16', 24360), ('LT315/75R16', 25550),
    ('LT265/65R17', 16160), ('LT265/70R17', 18740), ('LT275/70R17', 20740),
    ('LT285/75R17', 21180), ('LT305/70R17', 21000), ('LT295/70R17', 25370),
    ('LT285/55R18', 25320), ('LT285/65R18', 23300), ('LT265/65R18', 16580),
    ('LT275/65R18', 21180), ('LT285/60R18', 22350), ('LT305/65R18', 25070),
    ('LT285/70R18', 23110), ('LT295/70R18', 28160), ('LT255/55R20', 25210),
    ('LT285/55R20', 25210), ('LT275/55R20', 26210), ('LT265/60R20', 27790),
    ('35x11.5R20', 23680),
]}

# ── Venom Power prices ────────────────────────────────────────────────────────
VP_MT = {ns(k): v for k, v in [    # Swampthing M/T
    ('27x8.5R14', 7970), ('265/75R16', 10450), ('285/75R16', 12540),
    ('265/70R17', 11160), ('285/70R17', 12650), ('315/70R17', 15140),
    ('35x12.5R17', 15940), ('37x13.5R17', 18740), ('40x13.5R17', 26840),
    ('35x12.5R18', 16290), ('33x12.5R20', 15840), ('40x13.5R20', 16740),
    ('35x12.5R22', 18640), ('40x15.5R22', 36000),
]}
VP_AT = {ns(k): v for k, v in [    # Swampthing AT
    ('205/70R15', 6050), ('305/70R16', 12780), ('315/75R16', 13250),
    ('35x12.5R17', 14630), ('265/70R17', 9830), ('285/70R17', 10780),
    ('295/70R17', 13030), ('265/50R20', 9600), ('33x12.5R20', 14130),
    ('40x13.5R20', 15050),
]}
VP_XT2 = {ns(k): v for k, v in [   # Terra Hunter X/T 2
    ('31x10.5R15', 9360), ('205/65R15', 4550), ('235/75R15', 7610),
    ('215/65R16', 5150), ('245/70R16', 8210), ('265/70R16', 8940),
    ('225/75R16', 8250), ('265/75R16', 9580), ('285/75R16', 10890),
    ('235/85R16', 9730), ('235/65R17', 8580), ('265/70R17', 8840),
    ('285/70R17', 10510), ('235/60R18', 7650), ('265/60R18', 8890),
    ('265/65R18', 9580), ('275/65R18', 9890), ('285/65R18', 11680),
    ('275/70R18', 11570), ('265/50R20', 9600), ('275/55R20', 10000),
    ('275/60R20', 10350),
]}
VP_XT = {ns(k): v for k, v in [    # Terra Hunter X/T
    ('285/55R20', 12740), ('305/55R20', 15350), ('285/45R22', 14620),
    ('305/45R22', 14560), ('37x13.5R22', 19800), ('37x13.5R24', 22500),
]}
VP_RT = {ns(k): v for k, v in [    # Trail Hunter RT
    ('265/75R16', 10080), ('285/75R16', 11010), ('265/65R17', 10190),
    ('265/70R17', 10110), ('285/70R17', 12050), ('33x12.5R17', 14960),
    ('35x12.5R17', 16050), ('285/60R18', 14030), ('265/65R18', 11790),
    ('285/65R18', 12090), ('275/70R18', 13660), ('33x12.5R18', 14990),
    ('35x12.5R18', 15890), ('275/55R20', 12140), ('285/55R20', 13600),
    ('275/60R20', 12260), ('33x12.5R20', 15460), ('35x12.5R20', 16740),
    ('37x13.5R20', 18490), ('37x13.5R22', 22800),
]}
VP_GTS = {ns(k): v for k, v in [   # Ragnarok GTS
    ('275/55R20', 9430), ('275/60R20', 10000), ('285/45R22', 10470),
    ('305/40R22', 10260), ('305/45R22', 10520), ('305/35R24', 11110),
]}

# ── Cooper prices ─────────────────────────────────────────────────────────────
CP_RUGGED = {ns(k): v for k, v in [    # Discoverer Rugged Trek (SYSTEM = SRP)
    ('265/70R17', 17360), ('285/70R17', 18610), ('265/65R18', 16650),
    ('275/65R18', 18960), ('265/50R20', 18210), ('275/55R20', 19960),
    ('285/55R20', 22780), ('305/55R20', 22530),
]}
CP_STT = {ns(k): v for k, v in [       # Discoverer STT Pro (UNIT PRICE = SRP)
    ('31x10.5R15', 17250), ('33x12.5R15', 24240), ('35x12.5R15', 24860),
    ('235/85R16', 21420), ('265/75R16', 20290), ('285/75R16', 22240),
    ('265/70R17', 18890), ('285/70R17', 19870), ('295/70R17', 23880),
    ('315/70R17', 25960), ('37x12.5R17', 27170), ('275/65R18', 22880),
    ('285/65R18', 23140), ('275/70R18', 24490), ('295/55R20', 25660),
    ('35x12.5R20', 27380), ('38x15.5R20', 28930), ('37x13.5R22', 31370),
]}
CP_STRONG = {ns(k): v for k, v in [    # Discoverer Stronghold AT
    ('265/75R16', 17400), ('285/75R16', 18600), ('275/70R17', 17390),
    ('285/70R17', 17940), ('295/70R17', 19760), ('275/65R18', 18040),
    ('285/65R18', 19080), ('275/70R18', 21190), ('275/55R20', 18400),
    ('35x12.5R20', 23680),
]}
CP_AT3 = {ns(k): v for k, v in [       # AT3 LT / AT3 XLT
    ('275/65R18', 18010),               # AT3 LT
    ('285/65R18', 19020), ('275/70R18', 17740), ('275/55R20', 18370),
    ('285/55R20', 20930), ('35x12.5R20', 22590),
]}
CP_ROAD = {ns(k): v for k, v in [      # Discoverer Road+Trail
    ('235/75R15', 11750), ('235/70R16', 15940), ('265/70R16', 14370),
    ('265/75R16', 15570), ('235/65R17', 19070), ('265/65R17', 13730),
    ('265/70R17', 15950), ('235/60R18', 16100), ('265/60R18', 13770),
    ('265/65R18', 15620), ('265/50R20', 17170), ('275/55R20', 16310),
    ('275/60R20', 19560), ('285/45R22', 20550),
]}

# ── Apollo prices ─────────────────────────────────────────────────────────────
AP_ALNAC4G = {ns(k): v for k, v in [
    ('175/55R15', 4290), ('185/55R15', 4090), ('195/55R15', 3750),
    ('195/50R15', 3950), ('185/65R15', 4610), ('195/60R15', 4610),
    ('185/60R15', 4610), ('195/65R15', 3750), ('205/65R15', 3750),
    ('185/55R16', 4400), ('195/50R16', 4600), ('205/55R16', 4970),
    ('215/55R16', 5210), ('195/60R16', 4610), ('205/60R16', 5210),
    ('215/60R16', 5540), ('205/65R16', 4610), ('215/65R16', 5540),
    ('215/60R17', 5630), ('215/45R17', 5970), ('215/55R17', 5630),
    ('225/55R17', 5630), ('225/50R18', 7070), ('225/40R18', 7150),
    ('225/45R18', 7390),
]}
AP_ASPIRE4G = {ns(k): v for k, v in [  # from image 713583163
    ('205/40R17', 5870), ('205/45R17', 5970), ('215/45R17', 6070),
    ('215/50R17', 5970), ('215/55R17', 5970), ('225/45R17', 6190),
    ('225/55R17', 5630), ('225/50R18', 7070), ('225/40R18', 7150),
    ('225/45R18', 7390), ('235/40R18', 7570), ('235/45R18', 7730),
    ('235/50R18', 7320), ('235/55R18', 7440), ('245/40R18', 7630),
    ('245/45R18', 8030), ('235/35R19', 8570), ('235/50R19', 10470),
    ('245/35R19', 8810), ('245/40R19', 8960), ('245/45R19', 8820),
    ('245/50R19', 8730), ('245/35R20', 8880), ('245/40R20', 9000),
    ('245/45R20', 8440), ('255/45R20', 8730),
]}
AP_ALTRUST = {ns(k): v for k, v in [   # from image 709762397
    ('185R14C', 4740), ('195R14C', 5040), ('195R15C', 5350),
    ('205R16C', 8050), ('195/70R15C', 5450), ('205/70R15C', 6130),
    ('215/70R15C', 6410), ('225/70R15C', 6840), ('205/65R16C', 6510),
    ('215/65R16C', 6720), ('235/65R16C', 7430), ('215/70R16C', 6770),
]}
AP_APTERRA_AT2 = {ns(k): v for k, v in [   # from image 715276131
    ('235/75R15', 7760), ('31x10.5R15', 10610), ('235/60R16', 8050),
    ('245/70R16', 8270), ('265/70R16', 8750), ('265/75R16', 10830),
    ('235/65R17', 8360), ('265/65R17', 8980), ('265/70R17', 10070),
    ('265/60R18', 9130), ('275/65R18', 11790), ('265/50R20', 9310),
    ('275/55R20', 12320),
]}
AP_APTERRA_HT2 = {ns(k): v for k, v in [   # from image 714910563
    ('215/65R16', 6730), ('215/70R16', 6110), ('215/60R17', 7610),
    ('225/65R17', 7640), ('235/60R17', 8140), ('265/65R17', 8050),
    ('265/70R17', 8790), ('215/55R18', 7160), ('225/55R18', 7890),
    ('225/60R18', 8430), ('235/60R18', 8180), ('265/60R18', 8180),
    ('225/55R19', 10740), ('235/55R19', 10740), ('265/50R20', 9500),
]}

# Combined Apollo lookup: size → srp (pattern-agnostic fallback)
ALL_APOLLO = {}
for d in [AP_ALNAC4G, AP_ASPIRE4G, AP_ALTRUST, AP_APTERRA_AT2, AP_APTERRA_HT2]:
    for k, v in d.items():
        if k not in ALL_APOLLO:
            ALL_APOLLO[k] = v

# ── Excel reading ─────────────────────────────────────────────────────────────
wb = openpyxl.load_workbook('ADZ-RUGGEd-PRO_INVENTORY-SYSTEM-1.xlsx', data_only=True)

def read_sheet(name, start_row=10):
    ws = wb[name]
    items = []
    for row in ws.iter_rows(min_row=start_row, values_only=True):
        sku = str(row[0]).strip() if row[0] else ''
        if not sku or sku == 'ITEM CODE' or str(sku).startswith('#'): continue
        desc = str(row[3]).strip() if row[3] else ''
        items.append((sku, desc))
    return items

# ── Matching ──────────────────────────────────────────────────────────────────
updates = []
skipped = []

# --- BFG ---
for sku, desc in read_sheet('BFG'):
    sku_up = sku.upper()
    pattern = 'KM3' if 'KM3' in sku_up else ('K03' if ('K03' in sku_up or 'KO3' in sku_up) else 'K02')
    size = ns(desc)
    if pattern == 'KM3':
        srp = BFG_KM3.get(size)
    elif pattern == 'K03':
        srp = BFG_KO3.get(size)
    else:
        srp = None  # no K02 prices in images
    if srp:
        updates.append((sku, srp, f'BFG {pattern} {desc}'))
    else:
        skipped.append((sku, desc, f'BFG {pattern} no match for size {size!r}'))

# --- Venom ---
VP_MAP = {
    'MT': VP_MT, 'AT': VP_AT, 'XT2': VP_XT2, 'X/T': VP_XT,
    'XT': VP_XT2, 'RT': VP_RT, 'GTS': VP_GTS,
}
for sku, desc in read_sheet('VENOM'):
    desc_up = desc.upper().strip()
    srp = None
    matched_pat = None
    # detect pattern prefix
    for prefix, table in [
        ('MT ', VP_MT), ('AT ', VP_AT), ('X/T ', VP_XT2),
        ('XT ', VP_XT2), ('RT ', VP_RT), ('GTS ', VP_GTS),
    ]:
        if desc_up.startswith(prefix):
            size_part = desc[len(prefix):].strip()
            size = ns(size_part)
            srp = table.get(size)
            if srp is None and prefix == 'XT ':
                srp = VP_XT.get(size)   # try X/T fallback
            matched_pat = prefix.strip()
            break
    if srp is None and matched_pat is None:
        # No prefix - just a size like '285/75/16' or '305/45/22'
        size = ns(desc)
        srp = VP_MT.get(size) or VP_XT2.get(size) or VP_AT.get(size) or VP_GTS.get(size) or VP_XT.get(size)
        matched_pat = 'size-only'
    if srp:
        updates.append((sku, srp, f'Venom {matched_pat} {desc}'))
    else:
        skipped.append((sku, desc, f'Venom no match'))

# --- Cooper ---
CP_PAT = {
    'STT PRO': CP_STT, 'STT': CP_STT,
    'RUGGED TRECK': CP_RUGGED, 'RUGGED TREK': CP_RUGGED,
    'RUGGED TRK': CP_RUGGED,
    'AT3 XLT': CP_AT3, 'AT3 LT': CP_AT3, 'AT3': CP_AT3,
    'ROAD TRAIL': CP_ROAD, 'ROAD + TRAIL': CP_ROAD, 'RAOD TRAIL': CP_ROAD,
    'STRONG HOLD': CP_STRONG, 'STRONG HOLD AT': CP_STRONG,
}
for sku, desc in read_sheet('COOPER'):
    parts = re.split(r'\s*-\s*', desc, maxsplit=1)
    pat_raw = parts[0].strip().upper() if len(parts) == 2 else ''
    size_raw = parts[1].strip() if len(parts) == 2 else desc.strip()
    table = CP_PAT.get(pat_raw)
    if table is None:
        # try partial match
        for k, t in CP_PAT.items():
            if k in pat_raw:
                table = t
                break
    size = ns(size_raw)
    srp = table.get(size) if table else None
    if srp:
        updates.append((sku, srp, f'Cooper {pat_raw} {size_raw}'))
    else:
        skipped.append((sku, desc, f'Cooper no match (pat={pat_raw!r} size={size!r})'))

# --- Apollo ---
AP_PAT_HINT = {
    'ALNAC 4G': AP_ALNAC4G, 'ASPIRE 4G': AP_ASPIRE4G, 'ASPIRE 4G+': AP_ASPIRE4G,
    'APTERRA 2': AP_APTERRA_AT2, 'APTERRA AT2': AP_APTERRA_AT2,
    'APTERRA HT2': AP_APTERRA_HT2, 'APTERRA HT 2': AP_APTERRA_HT2,
    'ALTRUST': AP_ALTRUST, 'ALTRUST GRIP': AP_ALTRUST, 'ALTRUST +': AP_ALTRUST,
}
for sku, desc in read_sheet('APOLLO'):
    desc_up = desc.upper().strip()
    srp = None
    table = None
    size_raw = desc

    # check for explicit pattern prefix like "ALNAC 4G - 185/65/15" or "ASPIRE 4G+ 215/50/17"
    # try dash separator first, then space-before-digit
    m = re.match(r'^([A-Z][A-Z0-9 /+]+?)\s*[-–]\s*(\d.+)$', desc_up)
    if not m:
        m = re.match(r'^([A-Z][A-Z0-9/+]+(?:\s+\d+[A-Z+]*)?)\s+(\d.+)$', desc_up)
    if m:
        pat_hint = m.group(1).strip()
        size_raw = m.group(2).strip()
        # strip trailing AT/HT suffix from size like "265/65/17 - AT"
        size_raw = re.sub(r'\s*-\s*(AT|HT)\s*$', '', size_raw.upper()).strip()
        table = AP_PAT_HINT.get(pat_hint)
        if table is None:
            # check suffix hint
            if '- AT' in desc_up or ' AT' in pat_hint:
                table = AP_APTERRA_AT2
            elif '- HT' in desc_up or ' HT' in pat_hint:
                table = AP_APTERRA_HT2

    if table is None:
        # plain size with optional suffix
        size_raw2 = re.sub(r'\s*-\s*(AT|HT)\s*$', '', desc_up).strip()
        size_raw = size_raw2
        if '- AT' in desc_up:
            table = AP_APTERRA_AT2
        elif '- HT' in desc_up:
            table = AP_APTERRA_HT2
        elif desc_up.endswith('C') or re.search(r'\d+[RC]$', desc_up):
            table = AP_ALTRUST

    size = ns(size_raw)
    srp = (table.get(size) if table else None) or ALL_APOLLO.get(size)

    if srp:
        updates.append((sku, srp, f'Apollo {desc}'))
    else:
        skipped.append((sku, desc, f'Apollo no match (size={size!r})'))

# ── Write SQL ─────────────────────────────────────────────────────────────────
ts = datetime.now().strftime('%Y-%m-%d %H:%M')
lines = [
    '-- BFG / Venom Power / Cooper / Apollo SRP price update from supplier price lists',
    f'-- Generated: {ts}',
    f'-- {len(updates)} products updated | {len(skipped)} skipped',
    '',
]
for sku, srp, note in updates:
    clean = note.replace("'", "''")
    lines.append(f"UPDATE products SET retail_price = {srp}, base_price = {srp}, updated_at = now() WHERE sku = '{sku}'; -- {clean}")

lines += ['', '-- Skipped:']
for sku, desc, reason in skipped:
    lines.append(f'-- {sku}: {desc!r} ({reason})')

sql = '\n'.join(lines)
out = 'supabase/migrations/20260610090000_product1_srp_prices.sql'
with open(out, 'w', encoding='utf-8') as f:
    f.write(sql)

print(f'Migration: {out}')
print(f'Updated : {len(updates)}')
print(f'Skipped : {len(skipped)}')
print()
print('=== SKIPPED ===')
for sku, desc, reason in skipped:
    print(f'  {sku:20s} {desc!r:35s} -> {reason}')
