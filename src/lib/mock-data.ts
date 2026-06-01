export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  emoji: string;
};

export const products: Product[] = [
  { id: "p1", name: "Synthetic Oil 5W-30 (1L)", category: "Lubricants", price: 480, stock: 42, sku: "OIL-5W30-1L", emoji: "🛢️" },
  { id: "p2", name: "Brake Pad Set — Front", category: "Brakes", price: 2150, stock: 18, sku: "BRK-FRT-01", emoji: "🛑" },
  { id: "p3", name: "Air Filter — Universal", category: "Filters", price: 650, stock: 64, sku: "FIL-AIR-U", emoji: "🌬️" },
  { id: "p4", name: "Spark Plug (Iridium)", category: "Ignition", price: 320, stock: 120, sku: "SPK-IR-01", emoji: "⚡" },
  { id: "p5", name: "Microfiber Towel Pack", category: "Detailing", price: 280, stock: 90, sku: "DET-MF-PK", emoji: "🧽" },
  { id: "p6", name: "Tire Inflator 12V", category: "Tools", price: 1890, stock: 14, sku: "TLS-INF-12", emoji: "🔧" },
  { id: "p7", name: "Engine Coolant (1L)", category: "Lubricants", price: 380, stock: 56, sku: "CLT-1L", emoji: "🧪" },
  { id: "p8", name: "Wiper Blade 22\"", category: "Exterior", price: 520, stock: 32, sku: "WPR-22", emoji: "🚿" },
  { id: "p9", name: "Car Battery 12V 60Ah", category: "Electrical", price: 6500, stock: 9, sku: "BAT-60", emoji: "🔋" },
  { id: "p10", name: "Headlight Bulb LED", category: "Electrical", price: 1450, stock: 22, sku: "LED-HL-01", emoji: "💡" },
  { id: "p11", name: "Car Wax — Premium", category: "Detailing", price: 890, stock: 28, sku: "WAX-PRM", emoji: "✨" },
  { id: "p12", name: "Fuel Additive 250ml", category: "Lubricants", price: 420, stock: 47, sku: "FUEL-ADD", emoji: "⛽" },
];

export const categories = [
  "All",
  "Lubricants",
  "Brakes",
  "Filters",
  "Ignition",
  "Detailing",
  "Tools",
  "Exterior",
  "Electrical",
];

export const revenueSeries = [
  { d: "Mon", revenue: 18400, orders: 24 },
  { d: "Tue", revenue: 22100, orders: 29 },
  { d: "Wed", revenue: 19800, orders: 26 },
  { d: "Thu", revenue: 28400, orders: 35 },
  { d: "Fri", revenue: 31200, orders: 41 },
  { d: "Sat", revenue: 42600, orders: 56 },
  { d: "Sun", revenue: 36800, orders: 48 },
];

export const cashFlowSeries = [
  { d: "W1", inflow: 84000, outflow: 32000 },
  { d: "W2", inflow: 96000, outflow: 41000 },
  { d: "W3", inflow: 112000, outflow: 38000 },
  { d: "W4", inflow: 128000, outflow: 52000 },
];

export const recentSales = [
  { id: "TXN-10412", customer: "Walk-in", items: 3, total: 2890, method: "GCash", time: "2m ago", status: "Paid" },
  { id: "TXN-10411", customer: "Carlo R.", items: 1, total: 6500, method: "Card", time: "8m ago", status: "Paid" },
  { id: "TXN-10410", customer: "Mika S.", items: 5, total: 4120, method: "Cash", time: "14m ago", status: "Paid" },
  { id: "TXN-10409", customer: "Jun P.", items: 2, total: 980, method: "Maya", time: "22m ago", status: "Paid" },
  { id: "TXN-10408", customer: "Walk-in", items: 4, total: 3450, method: "Cash", time: "31m ago", status: "Refunded" },
];

export const topProducts = [
  { name: "Synthetic Oil 5W-30", sold: 142, revenue: 68160 },
  { name: "Brake Pad Set — Front", sold: 38, revenue: 81700 },
  { name: "Air Filter — Universal", sold: 96, revenue: 62400 },
  { name: "Spark Plug (Iridium)", sold: 210, revenue: 67200 },
  { name: "Car Wax — Premium", sold: 54, revenue: 48060 },
];

export const peso = (n: number) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(n);

// ─────────────────────────────────────────────────────────────
// Catalog (Products module): identity, pricing, media, variants
// ─────────────────────────────────────────────────────────────

export type ProductStatus = "Active" | "Draft" | "Archived" | "Hidden" | "Out of Stock";
export type ProductType = "Physical" | "Service" | "Bundle";

export type ProductVariant = {
  id: string;
  label: string; // "17x8 +35 6x139.7 Matte Black"
  sku: string;
  barcode: string;
  price: number;
  cost: number;
  attrs: Record<string, string>; // { size: "17x8", offset: "+35", boltPattern: "6x139.7", finish: "Matte Black" }
};

export type VehicleFit = {
  make: string;
  model: string;
  years: string;
  boltPattern?: string;
  tireSpec?: string;
  suspension?: string;
};

export type CatalogProduct = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  barcode: string;
  brand: string;
  category: string;
  subcategory?: string;
  collection?: string;
  type: ProductType;
  status: ProductStatus;
  featured: boolean;
  shortDescription: string;
  description: string;
  tags: string[];
  emoji: string;
  media: { count: number; has360: boolean; hasVideo: boolean };
  pricing: {
    cost: number;
    retail: number;
    sale?: number;
    wholesale?: number;
    promo?: number;
  };
  variants: ProductVariant[];
  fitment: VehicleFit[];
  createdAt: string;
  updatedAt: string;
};

export const brands = ["Work Wheels", "Enkei", "RAYS", "Fox Shox", "Bilstein", "Bridgestone", "Michelin", "NGK", "Brembo", "ADZ Garage"];
export const collections = ["New Arrivals", "Off-Road Pro", "Track Day", "Daily Driver", "Overland"];
export const productCategories = [
  "Wheels", "Tires", "Suspension", "Brakes", "Lubricants", "Filters", "Ignition", "Detailing", "Electrical", "Services",
];

export const catalog: CatalogProduct[] = [
  {
    id: "cp-001",
    name: "Work Emotion T7R 17x8 6-Lug",
    slug: "work-emotion-t7r-17x8-6-lug",
    sku: "WHL-WORK-T7R-178",
    barcode: "4901234500017",
    brand: "Work Wheels",
    category: "Wheels",
    subcategory: "Forged",
    collection: "Track Day",
    type: "Physical",
    status: "Active",
    featured: true,
    shortDescription: "Lightweight forged 6-lug wheel for trucks & SUVs.",
    description: "Premium JDM forged wheel engineered for strength and weight reduction.",
    tags: ["6x139.7", "17 inch", "Forged", "JDM"],
    emoji: "🛞",
    media: { count: 6, has360: true, hasVideo: true },
    pricing: { cost: 14500, retail: 22500, sale: 20990, wholesale: 18500 },
    variants: [
      { id: "v1", label: "17x8 +35 Matte Black", sku: "WHL-WORK-T7R-178-MB", barcode: "4901234500024", price: 22500, cost: 14500, attrs: { size: "17x8", offset: "+35", boltPattern: "6x139.7", finish: "Matte Black" } },
      { id: "v2", label: "17x8 +35 Bronze", sku: "WHL-WORK-T7R-178-BR", barcode: "4901234500031", price: 23200, cost: 14500, attrs: { size: "17x8", offset: "+35", boltPattern: "6x139.7", finish: "Bronze" } },
      { id: "v3", label: "17x9 +20 Matte Black", sku: "WHL-WORK-T7R-179-MB", barcode: "4901234500048", price: 23500, cost: 15000, attrs: { size: "17x9", offset: "+20", boltPattern: "6x139.7", finish: "Matte Black" } },
    ],
    fitment: [
      { make: "Toyota", model: "Hilux", years: "2016–2024", boltPattern: "6x139.7", tireSpec: "265/65R17" },
      { make: "Ford", model: "Ranger", years: "2015–2024", boltPattern: "6x139.7", tireSpec: "265/65R17" },
      { make: "Mitsubishi", model: "Montero Sport", years: "2016–2023", boltPattern: "6x139.7" },
    ],
    createdAt: "2025-09-12", updatedAt: "2026-05-20",
  },
  {
    id: "cp-002",
    name: "Bridgestone Dueler A/T 265/65R17",
    slug: "bridgestone-dueler-at-265-65-17",
    sku: "TIR-BRD-DUE-26565",
    barcode: "8901234500024",
    brand: "Bridgestone",
    category: "Tires",
    subcategory: "All-Terrain",
    collection: "Overland",
    type: "Physical",
    status: "Active",
    featured: true,
    shortDescription: "All-terrain truck tire with long-mileage tread.",
    description: "Confident grip on highway and off-road conditions.",
    tags: ["All-Terrain", "17 inch", "Truck"],
    emoji: "🛞",
    media: { count: 4, has360: false, hasVideo: false },
    pricing: { cost: 6200, retail: 9800, sale: 8990 },
    variants: [
      { id: "v1", label: "265/65R17", sku: "TIR-BRD-DUE-26565-1", barcode: "8901234500031", price: 9800, cost: 6200, attrs: { size: "265/65R17" } },
      { id: "v2", label: "265/70R17", sku: "TIR-BRD-DUE-26570", barcode: "8901234500048", price: 10200, cost: 6500, attrs: { size: "265/70R17" } },
    ],
    fitment: [
      { make: "Toyota", model: "Hilux", years: "2016–2024", tireSpec: "265/65R17" },
      { make: "Nissan", model: "Navara", years: "2015–2024", tireSpec: "265/65R17" },
    ],
    createdAt: "2025-08-02", updatedAt: "2026-05-18",
  },
  {
    id: "cp-003",
    name: "Fox 2.0 Performance Series Shock",
    slug: "fox-2-0-performance-shock",
    sku: "SUS-FOX-20-PRF",
    barcode: "7501234500031",
    brand: "Fox Shox",
    category: "Suspension",
    subcategory: "Shocks",
    collection: "Off-Road Pro",
    type: "Physical",
    status: "Active",
    featured: false,
    shortDescription: "Monotube IFP shock for lifted trucks.",
    description: "Race-bred damping tech tuned for daily and trail use.",
    tags: ["Lifted", "Shock", "Monotube"],
    emoji: "🪛",
    media: { count: 5, has360: false, hasVideo: true },
    pricing: { cost: 4200, retail: 6890, wholesale: 5500 },
    variants: [
      { id: "v1", label: "Front Pair (0–2\" Lift)", sku: "SUS-FOX-20-F02", barcode: "7501234500048", price: 13780, cost: 8400, attrs: { position: "Front", lift: "0-2\"" } },
      { id: "v2", label: "Rear Pair (0–2\" Lift)", sku: "SUS-FOX-20-R02", barcode: "7501234500055", price: 12980, cost: 7900, attrs: { position: "Rear", lift: "0-2\"" } },
    ],
    fitment: [
      { make: "Toyota", model: "Land Cruiser Prado", years: "2010–2023", suspension: "Coil" },
      { make: "Mitsubishi", model: "Montero Sport", years: "2016–2023", suspension: "Coil" },
    ],
    createdAt: "2025-10-04", updatedAt: "2026-05-21",
  },
  {
    id: "cp-004",
    name: "Brembo Brake Pad — Front (Toyota)",
    slug: "brembo-brake-pad-front-toyota",
    sku: "BRK-BRM-FRT-TOY",
    barcode: "8001234500048",
    brand: "Brembo",
    category: "Brakes",
    type: "Physical",
    status: "Active",
    featured: false,
    shortDescription: "Low-dust ceramic pad with strong cold bite.",
    description: "OE-quality replacement pad, quiet and long-lasting.",
    tags: ["Ceramic", "Front", "OE"],
    emoji: "🛑",
    media: { count: 3, has360: false, hasVideo: false },
    pricing: { cost: 1280, retail: 2150, sale: 1990 },
    variants: [],
    fitment: [
      { make: "Toyota", model: "Hilux", years: "2016–2024" },
      { make: "Toyota", model: "Fortuner", years: "2016–2024" },
    ],
    createdAt: "2025-07-15", updatedAt: "2026-04-30",
  },
  {
    id: "cp-005",
    name: "Synthetic Oil 5W-30 (1L)",
    slug: "synthetic-oil-5w30-1l",
    sku: "OIL-5W30-1L",
    barcode: "4801234500055",
    brand: "ADZ Garage",
    category: "Lubricants",
    type: "Physical",
    status: "Active",
    featured: false,
    shortDescription: "Full synthetic engine oil — API SP.",
    description: "Premium full synthetic oil for modern gas engines.",
    tags: ["5W-30", "Synthetic"],
    emoji: "🛢️",
    media: { count: 2, has360: false, hasVideo: false },
    pricing: { cost: 260, retail: 480, wholesale: 380 },
    variants: [],
    fitment: [],
    createdAt: "2025-06-10", updatedAt: "2026-05-12",
  },
  {
    id: "cp-006",
    name: "Wheel Alignment — 4 Wheel",
    slug: "wheel-alignment-4-wheel",
    sku: "SVC-ALIGN-4W",
    barcode: "—",
    brand: "ADZ Garage",
    category: "Services",
    type: "Service",
    status: "Active",
    featured: true,
    shortDescription: "Precision 4-wheel computerized alignment.",
    description: "Includes camber, caster and toe adjustment with printout.",
    tags: ["Service", "Labor", "Alignment"],
    emoji: "🛠️",
    media: { count: 1, has360: false, hasVideo: false },
    pricing: { cost: 0, retail: 1500 },
    variants: [],
    fitment: [],
    createdAt: "2025-05-01", updatedAt: "2026-05-01",
  },
  {
    id: "cp-007",
    name: "Tire Balancing (per wheel)",
    slug: "tire-balancing",
    sku: "SVC-BAL-1",
    barcode: "—",
    brand: "ADZ Garage",
    category: "Services",
    type: "Service",
    status: "Active",
    featured: false,
    shortDescription: "Dynamic computer wheel balancing.",
    description: "Per-wheel dynamic balancing for vibration-free ride.",
    tags: ["Service", "Balancing"],
    emoji: "⚖️",
    media: { count: 1, has360: false, hasVideo: false },
    pricing: { cost: 0, retail: 150 },
    variants: [],
    fitment: [],
    createdAt: "2025-05-01", updatedAt: "2026-05-01",
  },
  {
    id: "cp-008",
    name: "Suspension Installation — Labor",
    slug: "suspension-installation-labor",
    sku: "SVC-INST-SUS",
    barcode: "—",
    brand: "ADZ Garage",
    category: "Services",
    type: "Service",
    status: "Active",
    featured: false,
    shortDescription: "Labor for shock/coilover install (pair).",
    description: "Full bay install with torque-to-spec and alignment check.",
    tags: ["Service", "Labor", "Installation"],
    emoji: "🔧",
    media: { count: 1, has360: false, hasVideo: false },
    pricing: { cost: 0, retail: 2500 },
    variants: [],
    fitment: [],
    createdAt: "2025-05-01", updatedAt: "2026-05-01",
  },
  {
    id: "cp-009",
    name: "NGK Iridium Spark Plug",
    slug: "ngk-iridium-spark-plug",
    sku: "SPK-NGK-IR",
    barcode: "4901234500062",
    brand: "NGK",
    category: "Ignition",
    type: "Physical",
    status: "Draft",
    featured: false,
    shortDescription: "Long-life iridium plug.",
    description: "Pre-gapped iridium spark plug.",
    tags: ["Iridium", "Ignition"],
    emoji: "⚡",
    media: { count: 1, has360: false, hasVideo: false },
    pricing: { cost: 180, retail: 320 },
    variants: [],
    fitment: [],
    createdAt: "2026-05-15", updatedAt: "2026-05-22",
  },
  {
    id: "cp-010",
    name: "Premium Car Wax",
    slug: "premium-car-wax",
    sku: "WAX-PRM",
    barcode: "4801234500079",
    brand: "ADZ Garage",
    category: "Detailing",
    type: "Physical",
    status: "Archived",
    featured: false,
    shortDescription: "Carnauba wax for deep gloss.",
    description: "Hand-applied carnauba wax.",
    tags: ["Detailing", "Wax"],
    emoji: "✨",
    media: { count: 2, has360: false, hasVideo: false },
    pricing: { cost: 420, retail: 890 },
    variants: [],
    fitment: [],
    createdAt: "2024-12-01", updatedAt: "2026-03-10",
  },
];

// ─────────────────────────────────────────────────────────────
// Inventory module: stock ops, movements, warehouses, suppliers
// ─────────────────────────────────────────────────────────────

export type Warehouse = { id: string; name: string; type: "Warehouse" | "Showroom" | "Bay" | "Branch"; address: string };
export const warehouses: Warehouse[] = [
  { id: "wh-main", name: "Main Warehouse", type: "Warehouse", address: "Quezon City HQ" },
  { id: "wh-show", name: "Showroom Floor", type: "Showroom", address: "Quezon City HQ" },
  { id: "wh-bay", name: "Installation Bay", type: "Bay", address: "Quezon City HQ" },
  { id: "wh-bgc", name: "BGC Branch", type: "Branch", address: "Taguig" },
];

export type InventoryStatus = "In Stock" | "Low Stock" | "Out of Stock" | "Reserved" | "Incoming";

export type InventoryRecord = {
  id: string;
  productId: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  warehouseId: string;
  onHand: number;
  reserved: number;
  incoming: number;
  reorderPoint: number;
  cost: number;
  retail: number;
  emoji: string;
};

export const inventory: InventoryRecord[] = [
  { id: "iv1", productId: "cp-001", sku: "WHL-WORK-T7R-178-MB", name: "Work T7R 17x8 +35 Matte Black", brand: "Work Wheels", category: "Wheels", warehouseId: "wh-main", onHand: 12, reserved: 2, incoming: 8, reorderPoint: 6, cost: 14500, retail: 22500, emoji: "🛞" },
  { id: "iv2", productId: "cp-001", sku: "WHL-WORK-T7R-178-BR", name: "Work T7R 17x8 +35 Bronze", brand: "Work Wheels", category: "Wheels", warehouseId: "wh-main", onHand: 4, reserved: 1, incoming: 0, reorderPoint: 6, cost: 14500, retail: 23200, emoji: "🛞" },
  { id: "iv3", productId: "cp-002", sku: "TIR-BRD-DUE-26565-1", name: "Bridgestone Dueler 265/65R17", brand: "Bridgestone", category: "Tires", warehouseId: "wh-main", onHand: 28, reserved: 4, incoming: 0, reorderPoint: 12, cost: 6200, retail: 9800, emoji: "🛞" },
  { id: "iv4", productId: "cp-002", sku: "TIR-BRD-DUE-26565-1", name: "Bridgestone Dueler 265/65R17", brand: "Bridgestone", category: "Tires", warehouseId: "wh-bgc", onHand: 9, reserved: 0, incoming: 12, reorderPoint: 10, cost: 6200, retail: 9800, emoji: "🛞" },
  { id: "iv5", productId: "cp-003", sku: "SUS-FOX-20-F02", name: "Fox 2.0 Front Pair (0-2\" Lift)", brand: "Fox Shox", category: "Suspension", warehouseId: "wh-main", onHand: 0, reserved: 0, incoming: 6, reorderPoint: 3, cost: 8400, retail: 13780, emoji: "🪛" },
  { id: "iv6", productId: "cp-004", sku: "BRK-BRM-FRT-TOY", name: "Brembo Front Pads (Toyota)", brand: "Brembo", category: "Brakes", warehouseId: "wh-main", onHand: 18, reserved: 2, incoming: 0, reorderPoint: 8, cost: 1280, retail: 2150, emoji: "🛑" },
  { id: "iv7", productId: "cp-005", sku: "OIL-5W30-1L", name: "Synthetic Oil 5W-30 (1L)", brand: "ADZ Garage", category: "Lubricants", warehouseId: "wh-main", onHand: 96, reserved: 8, incoming: 48, reorderPoint: 40, cost: 260, retail: 480, emoji: "🛢️" },
  { id: "iv8", productId: "cp-009", sku: "SPK-NGK-IR", name: "NGK Iridium Spark Plug", brand: "NGK", category: "Ignition", warehouseId: "wh-main", onHand: 3, reserved: 0, incoming: 0, reorderPoint: 24, cost: 180, retail: 320, emoji: "⚡" },
];

export type StockMovement = {
  id: string;
  date: string;
  sku: string;
  name: string;
  warehouseId: string;
  type: "Received" | "Sold" | "Adjusted" | "Damaged" | "Returned" | "Transferred" | "Reserved";
  qty: number; // signed
  reference: string; // PO-1023, TXN-10412, ADJ-002
  user: string;
};

export const stockMovements: StockMovement[] = [
  { id: "m1", date: "2026-05-25 10:42", sku: "OIL-5W30-1L", name: "Synthetic Oil 5W-30 (1L)", warehouseId: "wh-main", type: "Sold", qty: -2, reference: "TXN-10412", user: "Cashier 1" },
  { id: "m2", date: "2026-05-25 09:18", sku: "WHL-WORK-T7R-178-MB", name: "Work T7R Matte Black", warehouseId: "wh-main", type: "Received", qty: 8, reference: "PO-1041", user: "Warehouse" },
  { id: "m3", date: "2026-05-24 17:02", sku: "BRK-BRM-FRT-TOY", name: "Brembo Front Pads", warehouseId: "wh-main", type: "Sold", qty: -1, reference: "TXN-10410", user: "Cashier 2" },
  { id: "m4", date: "2026-05-24 14:30", sku: "TIR-BRD-DUE-26565-1", name: "Bridgestone Dueler", warehouseId: "wh-bgc", type: "Transferred", qty: -4, reference: "TRF-018", user: "Admin" },
  { id: "m5", date: "2026-05-24 14:30", sku: "TIR-BRD-DUE-26565-1", name: "Bridgestone Dueler", warehouseId: "wh-main", type: "Transferred", qty: 4, reference: "TRF-018", user: "Admin" },
  { id: "m6", date: "2026-05-23 11:11", sku: "SUS-FOX-20-F02", name: "Fox 2.0 Front Pair", warehouseId: "wh-main", type: "Damaged", qty: -1, reference: "ADJ-021", user: "Warehouse" },
  { id: "m7", date: "2026-05-22 16:48", sku: "SPK-NGK-IR", name: "NGK Iridium Plug", warehouseId: "wh-main", type: "Returned", qty: 1, reference: "RMA-007", user: "Cashier 1" },
  { id: "m8", date: "2026-05-22 09:00", sku: "WHL-WORK-T7R-178-MB", name: "Work T7R Matte Black", warehouseId: "wh-main", type: "Reserved", qty: -2, reference: "DRAFT-019", user: "Sales" },
];

export type Supplier = {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  products: number;
  onTime: number; // %
  outstandingPO: number;
};

export const suppliers: Supplier[] = [
  { id: "sp-1", name: "Work Wheels PH Distribution", contact: "Daniel Cruz", phone: "+63 917 555 0142", email: "daniel@workph.com", products: 24, onTime: 96, outstandingPO: 1 },
  { id: "sp-2", name: "Bridgestone Philippines", contact: "Maria Lim", phone: "+63 917 555 0218", email: "supply@bridgestone.ph", products: 38, onTime: 92, outstandingPO: 2 },
  { id: "sp-3", name: "Fox Performance Asia", contact: "Kenji Sato", phone: "+63 917 555 0399", email: "kenji@foxasia.com", products: 14, onTime: 88, outstandingPO: 1 },
  { id: "sp-4", name: "Brembo Asia Pacific", contact: "Lucia Rivera", phone: "+63 917 555 0411", email: "lucia@brembo-ap.com", products: 22, onTime: 94, outstandingPO: 0 },
];

export type PurchaseOrder = {
  id: string;
  supplierId: string;
  supplier: string;
  createdAt: string;
  expected: string;
  status: "Draft" | "Sent" | "Partial" | "Received" | "Cancelled";
  items: number;
  total: number;
  received: number; // %
};

export const purchaseOrders: PurchaseOrder[] = [
  { id: "PO-1041", supplierId: "sp-1", supplier: "Work Wheels PH", createdAt: "2026-05-18", expected: "2026-05-28", status: "Partial", items: 12, total: 174000, received: 67 },
  { id: "PO-1040", supplierId: "sp-2", supplier: "Bridgestone PH", createdAt: "2026-05-16", expected: "2026-05-26", status: "Sent", items: 24, total: 148800, received: 0 },
  { id: "PO-1039", supplierId: "sp-3", supplier: "Fox Performance Asia", createdAt: "2026-05-14", expected: "2026-05-30", status: "Sent", items: 6, total: 50400, received: 0 },
  { id: "PO-1038", supplierId: "sp-4", supplier: "Brembo Asia Pacific", createdAt: "2026-05-10", expected: "2026-05-20", status: "Received", items: 30, total: 38400, received: 100 },
  { id: "PO-1037", supplierId: "sp-2", supplier: "Bridgestone PH", createdAt: "2026-05-05", expected: "2026-05-15", status: "Received", items: 18, total: 111600, received: 100 },
  { id: "PO-1036", supplierId: "sp-1", supplier: "Work Wheels PH", createdAt: "2026-05-02", expected: "2026-05-12", status: "Draft", items: 4, total: 58000, received: 0 },
];
