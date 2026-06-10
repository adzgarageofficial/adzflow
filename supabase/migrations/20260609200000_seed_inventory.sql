-- ADZ Garage Inventory Seed Migration
-- Generated from ADZ-RUGGEd-PRO_INVENTORY-SYSTEM-1.xlsx
-- 907 products across 57 brands, 40+ categories

-- ===== BRANDS =====
INSERT INTO brands (id, name, updated_at) VALUES
  ('48bd7044-fa3d-494d-91fc-61a9985bd401', 'ADD-A-LEAF', now()),
  ('9c175e08-4884-46f2-bd35-8d694e9985c9', 'ADZ GENERIC', now()),
  ('62e747e9-d679-495d-a93c-4203e925a17c', 'APOLLO', now()),
  ('8c4c2800-7411-4748-80ac-1318833f5d42', 'ARIVO', now()),
  ('2d76a0fb-5c46-4c61-8ede-099d070fd22f', 'ATLANDER', now()),
  ('5f9bcc6b-8c65-4870-a003-44501c077ec6', 'BFG', now()),
  ('fdd2fdd0-03ae-4806-a986-dbe569ad37e6', 'BOSCH', now()),
  ('2f9c3131-cdc7-4d71-86a8-14854190fda8', 'COOPER', now()),
  ('3b6b6132-aa3b-4a9d-aeb3-9db6c3d7b672', 'ELAINE', now()),
  ('2279d361-09dd-437a-b149-91e196363b5d', 'FUEL OFFROAD', now()),
  ('0f017d89-fb4c-415a-a3a6-6ef1ffdcd8a1', 'HAMER', now()),
  ('36d7d6d6-fa3a-4945-ab7d-53dab36ee2d6', 'JAOS', now()),
  ('46fe0adf-6fc6-4819-9ada-c8d4f3c16bf0', 'KING SPRING', now()),
  ('c865091f-0199-4e50-9590-5c7949c0c12e', 'LINGLONG', now()),
  ('b204b504-6458-4fab-9dc2-570931dba760', 'MICHELIN', now()),
  ('7ba0929a-281c-4e30-9179-2f645b681cd0', 'MONSTA', now()),
  ('fa8032e8-5cc1-478a-92d6-edae233c5136', 'NITTO', now()),
  ('c498e3f0-5f68-4982-8612-4eb4fdd642a1', 'OME', now()),
  ('f24b1747-928f-45d1-9028-29a4b3b5a961', 'PROFENDER', now()),
  ('ea22a493-60c3-4193-b5a8-ef10b8bab559', 'RAYS ORIG', now()),
  ('b710249a-7393-4666-a83f-d4bedc52af41', 'RIDEMAX', now()),
  ('c85f80a1-20fc-4cfa-84ff-0ed7fd93568f', 'RUGGED PRO', now()),
  ('aa149da2-c4fd-4d16-97ff-2a217da9a023', 'SOLIS', now()),
  ('f6f910a7-d9aa-40f5-9ad7-f630b8913c6f', 'TCF', now()),
  ('afbcf0a6-b985-48ee-866c-9cb809ae372c', 'TE37', now()),
  ('2eb1d34f-9eb0-477c-8f4f-c0228e6b6c04', 'TOYO', now()),
  ('da91c1df-da76-497f-b1bf-66e36f5094d3', 'TRX', now()),
  ('d2c422f1-7493-4d12-8b89-50b10fbb2020', 'TUNER', now()),
  ('d6b020d7-7b18-47da-bb25-53b5c7f874d2', 'VENOM POWER', now()),
  ('63e541ad-bcce-4037-9f47-d17e7fc985fd', 'VENOM RAGNAROK', now()),
  ('49dd0fbd-35c8-41c5-84b5-a608e3a4b48e', 'VLF', now()),
  ('4571e0f1-4c31-4920-8628-cf9e07a6bd4e', 'WORK WHEELS', now())
ON CONFLICT (name) DO NOTHING;

-- ===== CATEGORIES =====
INSERT INTO categories (id, name, slug, updated_at) VALUES
  ('1e401cf7-a15d-4d3c-b75c-1082690543f0', 'DIVIDER', 'divider', now()),
  ('dcd8931d-db90-4774-a667-260a415febc6', 'EXHAUST', 'exhaust', now()),
  ('7fc77612-881d-4c37-a748-34cf1542fa8d', 'FLAT RACK', 'flat-rack', now()),
  ('f40ef53a-84ee-4e93-b58f-1fd0d45b66ff', 'FOGLAMP', 'foglamp', now()),
  ('13ce8d6d-9b88-4b52-b0cb-4da7afec6aa8', 'FRONT BUMPER', 'front-bumper', now()),
  ('ccb89c7a-a877-4fcd-bae1-85ae349d3695', 'GENERAL', 'general', now()),
  ('f0a1fe1b-2171-431c-a9fa-a9e6951126f8', 'H-MATTING', 'h-matting', now()),
  ('1da6e143-afe7-4fc7-a9da-8e19c496cc93', 'HORN', 'horn', now()),
  ('d45b478b-cf89-4bfb-8ca6-1e3508b2ea64', 'LED LIGHT', 'led-light', now()),
  ('f5eed024-8dc3-4030-bf2b-52b6b6a9a432', 'LUGNUST 12X1.5', 'lugnust-12x1-5', now()),
  ('3e454a99-dbec-41b0-af2f-3755d56e38e1', 'MAGS', 'mags', now()),
  ('aaf3ce31-04a9-4e70-8cb4-e393140a63d9', 'MATTING', 'matting', now()),
  ('dd77b27c-1f58-40e2-9a90-8040653e2795', 'MUDFLAPS V1', 'mudflaps-v1', now()),
  ('e586bca3-e3d1-477c-a246-c5470bd15fc8', 'MUDFLAPS V2', 'mudflaps-v2', now()),
  ('fe3b02bc-1c7b-44f0-bbb6-42f8801d764e', 'NUDGE BAR', 'nudge-bar', now()),
  ('bd0cbdf9-08f3-4b62-83e6-8477c1dba42b', 'PANHARD', 'panhard', now()),
  ('ad49e44e-0c48-4de3-951d-d8716e4ba324', 'POWER STEP BOARD', 'power-step-board', now()),
  ('a40e1ec9-7f83-4565-a667-4c8b35e75f89', 'REAR BUMPER', 'rear-bumper', now()),
  ('3ac0ebca-584a-4dd1-9791-242da75cef38', 'ROLLER LID', 'roller-lid', now()),
  ('93012237-8dd6-4309-9ac6-e4cf5125a1dd', 'RUBY LIGHT', 'ruby-light', now()),
  ('ec3b2db9-2556-4621-80c6-de06ee0007b1', 'RUGGED LIGHTZ', 'rugged-lightz', now()),
  ('5abb8b1a-7bfe-4bde-a49f-376545ae803c', 'SHACKLES', 'shackles', now()),
  ('19aa7743-3f11-4862-a904-da72bc3c57b0', 'SHOCK ABSORBERS', 'shock-absorbers', now()),
  ('ba45bdee-fba6-4bb8-be60-0cd2dfbf3a36', 'SKID PLATE', 'skid-plate', now()),
  ('75611c98-6c24-4850-a2fa-b789ef39dab8', 'STABILIZER', 'stabilizer', now()),
  ('c8c67362-2129-403c-b458-8c53ca9ab74a', 'STABLINK', 'stablink', now()),
  ('1cf07a2e-8dfd-4a44-bf7f-068d58b3f097', 'SUSPENSION', 'suspension', now()),
  ('7afe0724-6149-4c51-925d-fbcc5bedabdf', 'TIRES', 'tires', now()),
  ('c4bef1f4-676a-4615-945e-cdc07555a6ab', 'TOW HITCH', 'tow-hitch', now()),
  ('7adc835e-1280-4ad9-90e8-26ddd1969674', 'UCA', 'uca', now()),
  ('7a99d939-c3a9-48bc-98f3-6ec744e930c7', 'WHEEL SPACER', 'wheel-spacer', now())
ON CONFLICT (name) DO NOTHING;

-- ===== WAREHOUSES =====
INSERT INTO warehouses (id, name, updated_at) VALUES
  ('5926be7d-e529-4170-929f-e87f61f32363', 'ADZ Main Warehouse', now()),
  ('1328a823-eb66-4304-93a5-e79f5bbc5ee3', 'RACK 1', now()),
  ('5950916f-4045-44c9-9b24-313ca3f0fff6', 'RACK 10', now()),
  ('5745f16a-907e-414d-ad58-195567b94975', 'RACK 2', now()),
  ('47c2a658-56ec-49f4-9fce-4cba5f9d9f3d', 'RACK 3', now()),
  ('8f6e4cc2-21ad-40a3-9dc8-9472ab13325d', 'RACK 4', now()),
  ('29ae06bd-0751-41eb-a966-4ba0d219d53f', 'RACK 5', now()),
  ('88051ee6-5c49-406d-82a8-4b3db763ae70', 'RACK 6', now()),
  ('6218bc5b-db3f-494e-9b88-86a14231e357', 'RACK 7', now()),
  ('524c7f25-3b58-482d-a11f-70a1453f55c0', 'RACK 8', now()),
  ('59ff3454-50b9-4ad4-95ea-27c6b5691fae', 'RACK 9', now())
ON CONFLICT (name) DO NOTHING;

-- ===== SUPPLIERS =====
INSERT INTO suppliers (id, name, updated_at) VALUES
  ('70b667ac-6d66-47ea-98e1-09b86ea06fb6', 'ADZ', now()),
  ('73a41b76-e674-4bd3-ad14-626bdd9a5c04', 'DRAKESTER', now())
ON CONFLICT (id) DO NOTHING;

-- ===== PRODUCTS =====
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'UCA-RGGDPRO-0001', 'UCA HILUX REVO 2012-2024 RED', 'HILUX REVO 2012-2024 RED',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'UCA'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"RED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'UCA-RGGDPRO-0001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'UCA-RGGDPRO-0002', 'UCA HILUX REVO 2012-2024 SILVER', 'HILUX REVO 2012-2024 SILVER',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'UCA'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"SILVER"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'UCA-RGGDPRO-0002');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'UCA-RGGDPRO-0003', 'UCA HILUX REVO 2012-2024 BLACK', 'HILUX REVO 2012-2024 BLACK',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'UCA'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'UCA-RGGDPRO-0003');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'UCA-RGGDPRO-0004', 'UCA NAVARA 2008-2024 RED', 'NAVARA 2008-2024 RED',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'UCA'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"RED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'UCA-RGGDPRO-0004');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'UCA-RGGDPRO-0005', 'UCA NAVARA 2008-2024 SILVER', 'NAVARA 2008-2024 SILVER',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'UCA'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"SILVER"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'UCA-RGGDPRO-0005');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'UCA-RGGDPRO-0006', 'UCA NAVARA 2008-2024 BLACK', 'NAVARA 2008-2024 BLACK',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'UCA'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'UCA-RGGDPRO-0006');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'UCA-RGGDPRO-0007', 'UCA RANGER 2012-2019 RED T6', 'RANGER 2012-2019 RED T6',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'UCA'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"RED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'UCA-RGGDPRO-0007');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'UCA-RGGDPRO-0008', 'UCA RANGER T9 N.GEN 2022-2024 RED', 'RANGER T9 N.GEN 2022-2024 RED',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'UCA'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"RED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'UCA-RGGDPRO-0008');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'UCA-RGGDPRO-0009', 'UCA RANGER T9 N.GEN 2022-2024 SILVER', 'RANGER T9 N.GEN 2022-2024 SILVER',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'UCA'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"SILVER"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'UCA-RGGDPRO-0009');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'UCA-RGGDPRO-0010', 'UCA RANGER T9 N.GEN 2022-2024 BLACK', 'RANGER T9 N.GEN 2022-2024 BLACK',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'UCA'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'UCA-RGGDPRO-0010');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'UCA-RGGDPRO-0011', 'UCA TRITON L200 2006-2024 RED', 'TRITON L200 2006-2024 RED',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'UCA'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"RED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'UCA-RGGDPRO-0011');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'UCA-RGGDPRO-0012', 'UCA TRITON L200 2006-2024 SILVER', 'TRITON L200 2006-2024 SILVER',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'UCA'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"SILVER"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'UCA-RGGDPRO-0012');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'UCA-RGGDPRO-0013', 'UCA D-MAX 2021 RED', 'D-MAX 2021 RED',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'UCA'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"RED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'UCA-RGGDPRO-0013');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'UCA-RGGDPRO-0014', 'UCA D-MAX 2021 SILVER', 'D-MAX 2021 SILVER',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'UCA'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"SILVER"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'UCA-RGGDPRO-0014');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'STBLNK-RGGDPRO-0001', 'STABLINK HILUX VIGO,REVO,FORTUNER,DMAX,MUX 2021-2024', 'HILUX VIGO,REVO,FORTUNER,DMAX,MUX 2021-2024',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'STABLINK'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'STBLNK-RGGDPRO-0001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'STBLNK-RGGDPRO-0002', 'STABLINK NAVARA NP300 2015+ FRONT', 'NAVARA NP300 2015+ FRONT',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'STABLINK'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'STBLNK-RGGDPRO-0002');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'STBLNK-RGGDPRO-0003', 'STABLINK RANGER T6,T7 EVEREST FRONT', 'RANGER T6,T7 EVEREST FRONT',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'STABLINK'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'STBLNK-RGGDPRO-0003');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'STBLNK-RGGDPRO-0004', 'STABLINK RANGER T9 N.GEN 2023 FRONT', 'RANGER T9 N.GEN 2023 FRONT',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'STABLINK'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'STBLNK-RGGDPRO-0004');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'STBLNK-RGGDPRO-0005', 'STABLINK TRITON 2016-2023 FRONT', 'TRITON 2016-2023 FRONT',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'STABLINK'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'STBLNK-RGGDPRO-0005');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'STBLNK-RGGDPRO-0006', 'STABLINK TRITON 2024 FRONT', 'TRITON 2024 FRONT',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'STABLINK'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'STBLNK-RGGDPRO-0006');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'STBLNK-RGGDPRO-0007', 'STABLINK DMAX,MUX 2012-2020 FRONT', 'DMAX,MUX 2012-2020 FRONT',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'STABLINK'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'STBLNK-RGGDPRO-0007');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PNHRD-RGGDPRO-0001', 'PANHARD FORTUNER 2016+ REAR', 'FORTUNER 2016+ REAR',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'PANHARD'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"RED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PNHRD-RGGDPRO-0001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PNHRD-RGGDPRO-0002', 'PANHARD FORTUNER 2016+ REAR', 'FORTUNER 2016+ REAR',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'PANHARD'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"YELLOW"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PNHRD-RGGDPRO-0002');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PNHRD-RGGDPRO-0003', 'PANHARD FORTUNER 2005 REAR', 'FORTUNER 2005 REAR',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'PANHARD'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"RED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PNHRD-RGGDPRO-0003');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PNHRD-RGGDPRO-0004', 'PANHARD FORTUNER 2005 REAR', 'FORTUNER 2005 REAR',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'PANHARD'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"YELLOW"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PNHRD-RGGDPRO-0004');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PNHRD-RGGDPRO-0005', 'PANHARD MITSUBISHI PAJERO MONTERO', 'MITSUBISHI PAJERO MONTERO',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'PANHARD'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"RED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PNHRD-RGGDPRO-0005');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PNHRD-RGGDPRO-0006', 'PANHARD MITSUBISHI PAJERO MONTERO', 'MITSUBISHI PAJERO MONTERO',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'PANHARD'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"YELLOW"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PNHRD-RGGDPRO-0006');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PNHRD-RGGDPRO-0007', 'PANHARD SUZUKI JIMNY 2019-2021 FRONT/REAR', 'SUZUKI JIMNY 2019-2021 FRONT/REAR',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'PANHARD'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"RED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PNHRD-RGGDPRO-0007');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PNHRD-RGGDPRO-0008', 'PANHARD SUZUKI JIMNY 2019-2021 FRONT/REAR', 'SUZUKI JIMNY 2019-2021 FRONT/REAR',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'PANHARD'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"YELLOW"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PNHRD-RGGDPRO-0008');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'EXH-RGGDPRO-0001', 'EXHAUST HILUX SINGLE TIP', 'HILUX SINGLE TIP',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'EXHAUST'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'EXH-RGGDPRO-0001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'EXH-RGGDPRO-0002', 'EXHAUST HILUX DUAL TIP FULL EXHAUST SIDE EXIT', 'HILUX DUAL TIP FULL EXHAUST SIDE EXIT',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'EXHAUST'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'EXH-RGGDPRO-0002');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'EXH-RGGDPRO-0003', 'EXHAUST HILUX STEPBOARD EXIT CATBACK', 'HILUX STEPBOARD EXIT CATBACK',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'EXHAUST'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'EXH-RGGDPRO-0003');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'EXH-RGGDPRO-0004', 'EXHAUST FORTUNER DUAL TIP', 'FORTUNER DUAL TIP',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'EXHAUST'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'EXH-RGGDPRO-0004');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'EXH-RGGDPRO-0005', 'EXHAUST FORTUNER SINGL TIP', 'FORTUNER SINGL TIP',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'EXHAUST'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'EXH-RGGDPRO-0005');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'EXH-RGGDPRO-0006', 'EXHAUST MONTERO SINGLE TIP', 'MONTERO SINGLE TIP',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'EXHAUST'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'EXH-RGGDPRO-0006');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'EXH-RGGDPRO-0007', 'EXHAUST RANGER RAPTOR DUAL EXIT', 'RANGER RAPTOR DUAL EXIT',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'EXHAUST'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'EXH-RGGDPRO-0007');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'EXH-RGGDPRO-0008', 'EXHAUST RANGER SIDE EXIT TIP', 'RANGER SIDE EXIT TIP',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'EXHAUST'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'EXH-RGGDPRO-0008');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'EXH-RGGDPRO-0009', 'EXHAUST RANGER RAPTOR V6 CATBACK', 'RANGER RAPTOR V6 CATBACK',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'EXHAUST'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'EXH-RGGDPRO-0009');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'EXH-RGGDPRO-0010', 'EXHAUST RANGER DUAL EXIT', 'RANGER DUAL EXIT',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'EXHAUST'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'EXH-RGGDPRO-0010');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'EXH-RGGDPRO-0011', 'EXHAUST RANGER DUAL TIP', 'RANGER DUAL TIP',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'EXHAUST'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'EXH-RGGDPRO-0011');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'EXH-RGGDPRO-0012', 'EXHAUST TRITON DUAL TIP', 'TRITON DUAL TIP',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'EXHAUST'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'EXH-RGGDPRO-0012');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'RGGDLGHT-RGGDPRO-0001', 'RUGGED LIGHTZ TOYOTA 2.0-3 COLORS', 'TOYOTA 2.0-3 COLORS',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'RUGGED LIGHTZ'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'RGGDLGHT-RGGDPRO-0001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'RGGDLGHT-RGGDPRO-0002', 'RUGGED LIGHTZ TOYOTA 3.0-3 COLORS', 'TOYOTA 3.0-3 COLORS',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'RUGGED LIGHTZ'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'RGGDLGHT-RGGDPRO-0002');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'RGGDLGHT-RGGDPRO-0003', 'RUGGED LIGHTZ TOYOTA 2.5-3 COLORS', 'TOYOTA 2.5-3 COLORS',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'RUGGED LIGHTZ'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'RGGDLGHT-RGGDPRO-0003');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'RGGDLGHT-RGGDPRO-0004', 'RUGGED LIGHTZ NEW FORD 2.0-3 COLORS', 'NEW FORD 2.0-3 COLORS',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'RUGGED LIGHTZ'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'RGGDLGHT-RGGDPRO-0004');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MDFLPS-RGGDPRO-0001', 'MUDFLAPS V2 UNIVERSAL', 'UNIVERSAL',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'MUDFLAPS V2'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MDFLPS-RGGDPRO-0001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MDFLPS-RGGDPRO-0002', 'MUDFLAPS V2 UNIVERSAL', 'UNIVERSAL',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'MUDFLAPS V2'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"RED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MDFLPS-RGGDPRO-0002');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MDFLPS-RGGDPRO-0003', 'MUDFLAPS V1 UNIVERSAL', 'UNIVERSAL',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'MUDFLAPS V1'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"BLACK PRINT"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MDFLPS-RGGDPRO-0003');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MDFLPS-RGGDPRO-0004', 'MUDFLAPS V1 UNIVERSAL', 'UNIVERSAL',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'MUDFLAPS V1'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"RED PRINT"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MDFLPS-RGGDPRO-0004');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MDFLPS-RGGDPRO-0005', 'MUDFLAPS V1 UNIVERSAL', 'UNIVERSAL',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'MUDFLAPS V1'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"BLUE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MDFLPS-RGGDPRO-0005');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MDFLPS-RGGDPRO-0006', 'MUDFLAPS V1 UNIVERSAL', 'UNIVERSAL',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'MUDFLAPS V1'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"WHITE PRINT"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MDFLPS-RGGDPRO-0006');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MDFLPS-RGGDPRO-0007', 'MUDFLAPS V1 UNIVERSAL', 'UNIVERSAL',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'MUDFLAPS V1'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"GREY PRINT"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MDFLPS-RGGDPRO-0007');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MDFLPS-RGGDPRO-0008', 'MUDFLAPS V1 UNIVERSAL', 'UNIVERSAL',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'MUDFLAPS V1'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"RED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MDFLPS-RGGDPRO-0008');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'LGNTS-RGGDPRO-001', 'LUGNUST 12X1.5 TOYOTA REVO,ROCO , FORD RANGER,', 'TOYOTA REVO,ROCO , FORD RANGER,',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'LUGNUST 12X1.5'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'LGNTS-RGGDPRO-001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TRS-BFG2025', 'TIRES 35X12.50 R20', '35X12.50 R20',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TRS-BFG2025');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PQS-S-FRT6 001', 'SUSPENSION FORD RANGER T6', 'FORD RANGER T6',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PQS-S-FRT6 001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PQS-S-FRT 002', 'SUSPENSION FORD 4X2 NEW GEN', 'FORD 4X2 NEW GEN',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PQS-S-FRT 002');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PQS-S-FRT 003', 'SUSPENSION FORD 4X4 NEW GEN', 'FORD 4X4 NEW GEN',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PQS-S-FRT 003');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PQS-S-FRT 004', 'SUSPENSION FORD Y2022 4X4 T9', 'FORD Y2022 4X4 T9',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PQS-S-FRT 004');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PQS-S-FRT 005', 'SUSPENSION FORD BI-TURBO', 'FORD BI-TURBO',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PQS-S-FRT 005');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PQS-S-FRT006', 'SUSPENSION FORD EVEREST W/ SPRING', 'FORD EVEREST W/ SPRING',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PQS-S-FRT006');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PQS-S-FRT 007', 'SUSPENSION TOYOTA REVO', 'TOYOTA REVO',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PQS-S-FRT 007');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PQS-S-FRT 008', 'SUSPENSION TOYOTA HILUX GRS', 'TOYOTA HILUX GRS',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PQS-S-FRT 008');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PQS-S-FRT 009', 'SUSPENSION TOYOTA TAMARAW, CHAMP', 'TOYOTA TAMARAW, CHAMP',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PQS-S-FRT 009');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PQS-S-FRT 011', 'SUSPENSION TOYOTA FORTUNER W/ SPRING', 'TOYOTA FORTUNER W/ SPRING',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PQS-S-FRT 011');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PQS-S-FRT 012', 'SUSPENSION MITSUBISHI OLD TRITON', 'MITSUBISHI OLD TRITON',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PQS-S-FRT 012');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PQS-S-FRT O13', 'SUSPENSION MITSUBISHI NEW TRITON', 'MITSUBISHI NEW TRITON',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PQS-S-FRT O13');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PQS-S-FRT 014', 'SUSPENSION MITSUBISHI OLD PAJERO/MONTERO 08-16', 'MITSUBISHI OLD PAJERO/MONTERO 08-16',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PQS-S-FRT 014');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PQS-S-FRT015', 'SUSPENSION MU-X', 'MU-X',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PQS-S-FRT015');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PQS-S-FRT016', 'SUSPENSION NISSAN NAVARA W/ SPRING', 'NISSAN NAVARA W/ SPRING',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PQS-S-FRT016');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PQS-S-FRT 017', 'SUSPENSION ISUZU D-MAX', 'ISUZU D-MAX',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PQS-S-FRT 017');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PQS-S-FRT 018', 'SUSPENSION BYD SHARK', 'BYD SHARK',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PQS-S-FRT 018');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ASDDW', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ASDDW');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PRO-UCA 001', 'UCA TOYOTA HILUX REVO', 'TOYOTA HILUX REVO',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'UCA'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"RED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRO-UCA 001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PRO-UCA 002', 'UCA TOYOTA HILUX GRS', 'TOYOTA HILUX GRS',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'UCA'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"RED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRO-UCA 002');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PRO-UCA 003', 'UCA NISSAN NAVARA', 'NISSAN NAVARA',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'UCA'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"RED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRO-UCA 003');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PRO-UCA 004', 'UCA MITSUBISHI MONTERO', 'MITSUBISHI MONTERO',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'UCA'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"RED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRO-UCA 004');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PRO-UCA 005', 'UCA MITSUBISHI TRITON NEW', 'MITSUBISHI TRITON NEW',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'UCA'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"RED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRO-UCA 005');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PRO-UCA 006', 'UCA FORD RANGER T6', 'FORD RANGER T6',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'UCA'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"RED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRO-UCA 006');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PRO-UCA 007', 'UCA FORD RANGER NEW GEN Y22', 'FORD RANGER NEW GEN Y22',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'UCA'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"RED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRO-UCA 007');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PRO-UCA 008', 'UCA FORD RANGER RAPTOR Y19', 'FORD RANGER RAPTOR Y19',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'UCA'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"RED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRO-UCA 008');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PRO-UCA 009', 'UCA FORD RANGER RAPTOR NEXT.GEN', 'FORD RANGER RAPTOR NEXT.GEN',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'UCA'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"RED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRO-UCA 009');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PRO-UCA 010', 'UCA ISUZU DMAX', 'ISUZU DMAX',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'UCA'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"RED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRO-UCA 010');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PRO-UCA 011', 'UCA ISUZU DMAX y20', 'ISUZU DMAX y20',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'UCA'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"RED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRO-UCA 011');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PRO-UCA 012', 'UCA ISUZU DMAX Y20', 'ISUZU DMAX Y20',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'UCA'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"GREY"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRO-UCA 012');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PRO-UCA 013', 'UCA CHEVROLET COLORADO', 'CHEVROLET COLORADO',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'UCA'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"RED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRO-UCA 013');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PRO-TUNE-SERIES', 'SUSPENSION TOYOTA HILUX GRS- FULL KIT', 'TOYOTA HILUX GRS- FULL KIT',
       (SELECT id FROM brands WHERE name = 'TUNER'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRO-TUNE-SERIES');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'RM-SUS T6 0001', 'SUSPENSION FORD RANGER T6', 'FORD RANGER T6',
       (SELECT id FROM brands WHERE name = 'RIDEMAX'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"FRONT"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'RM-SUS T6 0001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'RM-SUS 4X2 0002', 'SUSPENSION FORD 4x2 y22', 'FORD 4x2 y22',
       (SELECT id FROM brands WHERE name = 'RIDEMAX'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"FRONT"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'RM-SUS 4X2 0002');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'RM-SUS-BT 0003', 'SUSPENSION FORD BI-TURBO', 'FORD BI-TURBO',
       (SELECT id FROM brands WHERE name = 'RIDEMAX'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"FRONT"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'RM-SUS-BT 0003');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'RM-SUS-TR 0004', 'SUSPENSION TOYOTA REVO/FORTUNER', 'TOYOTA REVO/FORTUNER',
       (SELECT id FROM brands WHERE name = 'RIDEMAX'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"FRONT"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'RM-SUS-TR 0004');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'RM-SUS-TT 0005', 'SUSPENSION TOYOTA TAMARAW', 'TOYOTA TAMARAW',
       (SELECT id FROM brands WHERE name = 'RIDEMAX'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"FRONT"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'RM-SUS-TT 0005');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'RM-SUS-TI 0006', 'SUSPENSION TOYOTA INNOVA', 'TOYOTA INNOVA',
       (SELECT id FROM brands WHERE name = 'RIDEMAX'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"FRONT"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'RM-SUS-TI 0006');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'RM-SUS-TC 0007', 'SUSPENSION TOYOTA COMUTER', 'TOYOTA COMUTER',
       (SELECT id FROM brands WHERE name = 'RIDEMAX'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"FRONT"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'RM-SUS-TC 0007');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'RM-SUS-MNT 0008', 'SUSPENSION MITSUBISHI NEW TRITON', 'MITSUBISHI NEW TRITON',
       (SELECT id FROM brands WHERE name = 'RIDEMAX'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"FRONT"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'RM-SUS-MNT 0008');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'RM-SUS-MOT009', 'SUSPENSION MITSUBISHI OLD TRITON', 'MITSUBISHI OLD TRITON',
       (SELECT id FROM brands WHERE name = 'RIDEMAX'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"FRONT"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'RM-SUS-MOT009');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'RM-SUS-MOPM 0010', 'SUSPENSION MITSUBISHI OLD PAJERO/MONTERO', 'MITSUBISHI OLD PAJERO/MONTERO',
       (SELECT id FROM brands WHERE name = 'RIDEMAX'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"FRONT"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'RM-SUS-MOPM 0010');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'RM-SUS-IDM 0011', 'SUSPENSION ISUZU DMAX/ MUX', 'ISUZU DMAX/ MUX',
       (SELECT id FROM brands WHERE name = 'RIDEMAX'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"FRONT"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'RM-SUS-IDM 0011');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'RM-SUS-NN 0012', 'SUSPENSION NISSAN NAVARA/NP300', 'NISSAN NAVARA/NP300',
       (SELECT id FROM brands WHERE name = 'RIDEMAX'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"FRONT"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'RM-SUS-NN 0012');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'RM-SUS-FRT6 001', 'SUSPENSION FORD RANGER T6', 'FORD RANGER T6',
       (SELECT id FROM brands WHERE name = 'RIDEMAX'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"REAR"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'RM-SUS-FRT6 001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'RM-SUS-4X2 002', 'SUSPENSION FORD 4x2 y22', 'FORD 4x2 y22',
       (SELECT id FROM brands WHERE name = 'RIDEMAX'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"REAR"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'RM-SUS-4X2 002');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'RM-SUS-FE 003', 'SUSPENSION FORD EVEREST 2016', 'FORD EVEREST 2016',
       (SELECT id FROM brands WHERE name = 'RIDEMAX'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"REAR"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'RM-SUS-FE 003');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'RM-SUS-TF 004', 'SUSPENSION TOYOTA FORTUNER', 'TOYOTA FORTUNER',
       (SELECT id FROM brands WHERE name = 'RIDEMAX'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"REAR"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'RM-SUS-TF 004');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'RM-SUS-TR 005', 'SUSPENSION TOYOTA REVO', 'TOYOTA REVO',
       (SELECT id FROM brands WHERE name = 'RIDEMAX'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"REAR"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'RM-SUS-TR 005');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'RM-SUS--TC 006', 'SUSPENSION TOYOTA COMUTER', 'TOYOTA COMUTER',
       (SELECT id FROM brands WHERE name = 'RIDEMAX'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"REAR"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'RM-SUS--TC 006');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'RM-SUS-TT 007', 'SUSPENSION TOYOTA TAMARAW', 'TOYOTA TAMARAW',
       (SELECT id FROM brands WHERE name = 'RIDEMAX'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"REAR"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'RM-SUS-TT 007');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'RM-SUS-TI 008', 'SUSPENSION TOYOTA INNOVA', 'TOYOTA INNOVA',
       (SELECT id FROM brands WHERE name = 'RIDEMAX'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"REAR"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'RM-SUS-TI 008');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'RM-SUS-MNT 009', 'SUSPENSION MITSUBISHI NEW TRITON', 'MITSUBISHI NEW TRITON',
       (SELECT id FROM brands WHERE name = 'RIDEMAX'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"REAR"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'RM-SUS-MNT 009');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'RM-SUS-MOT 010', 'SUSPENSION MITSUBISHI OLD TRITON', 'MITSUBISHI OLD TRITON',
       (SELECT id FROM brands WHERE name = 'RIDEMAX'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"REAR"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'RM-SUS-MOT 010');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'RM-SUS-MOP 011', 'SUSPENSION MITSUBISHI OLD PAJERO/MONTERO', 'MITSUBISHI OLD PAJERO/MONTERO',
       (SELECT id FROM brands WHERE name = 'RIDEMAX'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"REAR"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'RM-SUS-MOP 011');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'RM-SUS-ID 012', 'SUSPENSION ISUZU DMAX', 'ISUZU DMAX',
       (SELECT id FROM brands WHERE name = 'RIDEMAX'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"REAR"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'RM-SUS-ID 012');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'RM-SUS-IM 013', 'SUSPENSION ISUZU MUX', 'ISUZU MUX',
       (SELECT id FROM brands WHERE name = 'RIDEMAX'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"REAR"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'RM-SUS-IM 013');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'RM-SUS-NN 014', 'SUSPENSION NISSAN NAVARA/NP300', 'NISSAN NAVARA/NP300',
       (SELECT id FROM brands WHERE name = 'RIDEMAX'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"REAR"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'RM-SUS-NN 014');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'KT-PR-102T', 'SUSPENSION TOYOTA FJ REAR', 'TOYOTA FJ REAR',
       (SELECT id FROM brands WHERE name = 'KING SPRING'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Box","color":"YELLOW"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'KT-PR-102T');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'KTFR-101C-385', 'SUSPENSION TOYOTA 4X2 W/O LOAD FRONT', 'TOYOTA 4X2 W/O LOAD FRONT',
       (SELECT id FROM brands WHERE name = 'KING SPRING'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Box","color":"YELLOW"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'KTFR-101C-385');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'KTFR-101TC-400', 'SUSPENSION TOYOTA 4X4 W/LOAD FRONT', 'TOYOTA 4X4 W/LOAD FRONT',
       (SELECT id FROM brands WHERE name = 'KING SPRING'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Box","color":"YELLOW"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'KTFR-101TC-400');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'KTRR-215C-475', 'SUSPENSION TOYOTA FORTUNER REAR', 'TOYOTA FORTUNER REAR',
       (SELECT id FROM brands WHERE name = 'KING SPRING'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Box","color":"YELLOW"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'KTRR-215C-475');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'KCFR-55T-335', 'SUSPENSION MITSUBISHI W/O LOAD FRONT', 'MITSUBISHI W/O LOAD FRONT',
       (SELECT id FROM brands WHERE name = 'KING SPRING'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Box","color":"YELLOW"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'KCFR-55T-335');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'KCFR-55T', 'SUSPENSION MITSUBISHI W/ LOAD FRONT', 'MITSUBISHI W/ LOAD FRONT',
       (SELECT id FROM brands WHERE name = 'KING SPRING'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Box","color":"YELLOW"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'KCFR-55T');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'KCRR-38', 'SUSPENSION MITSUBISHI MONTERO REAR', 'MITSUBISHI MONTERO REAR',
       (SELECT id FROM brands WHERE name = 'KING SPRING'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Box","color":"YELLOW"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'KCRR-38');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'KCRR-56', 'SUSPENSION MITSUBISHI NEW TRITON FRONT', 'MITSUBISHI NEW TRITON FRONT',
       (SELECT id FROM brands WHERE name = 'KING SPRING'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Box","color":"YELLOW"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'KCRR-56');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'KFFR-122T-440', 'SUSPENSION FORD RANGER NEW W/O LOAD FRONT', 'FORD RANGER NEW W/O LOAD FRONT',
       (SELECT id FROM brands WHERE name = 'KING SPRING'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Box","color":"YELLOW"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'KFFR-122T-440');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'KFRR-122HT-450', 'SUSPENSION FORD RANGER NEW W/O LOAD REAR', 'FORD RANGER NEW W/O LOAD REAR',
       (SELECT id FROM brands WHERE name = 'KING SPRING'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Box","color":"YELLOW"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'KFRR-122HT-450');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'KFFR-24T', 'SUSPENSION FORD BI-TURBO W/O LOAD FRONT', 'FORD BI-TURBO W/O LOAD FRONT',
       (SELECT id FROM brands WHERE name = 'KING SPRING'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Box","color":"YELLOW"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'KFFR-24T');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'KFFR-24HT', 'SUSPENSION FORD BI-TURBO W/ LOAD FRONT', 'FORD BI-TURBO W/ LOAD FRONT',
       (SELECT id FROM brands WHERE name = 'KING SPRING'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Box","color":"YELLOW"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'KFFR-24HT');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'KFFR-08TSP-385', 'SUSPENSION FORD T6/T7 W/O LOAD  FRONT', 'FORD T6/T7 W/O LOAD  FRONT',
       (SELECT id FROM brands WHERE name = 'KING SPRING'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Box","color":"YELLOW"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'KFFR-08TSP-385');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'KFFR-08TSP-395', 'SUSPENSION FORD T6/T7 W/ LOAD FRONT', 'FORD T6/T7 W/ LOAD FRONT',
       (SELECT id FROM brands WHERE name = 'KING SPRING'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Box","color":"YELLOW"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'KFFR-08TSP-395');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'KFRR-106C-510', 'SUSPENSION FORD EVEREST REAR', 'FORD EVEREST REAR',
       (SELECT id FROM brands WHERE name = 'KING SPRING'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Box","color":"YELLOW"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'KFRR-106C-510');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'KFFR-120', 'SUSPENSION FORD RAPTOR W/O LOAD FRONT', 'FORD RAPTOR W/O LOAD FRONT',
       (SELECT id FROM brands WHERE name = 'KING SPRING'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Box","color":"YELLOW"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'KFFR-120');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'KFRR-121', 'SUSPENSION FORD RAPTOR W/O LOAD REAR', 'FORD RAPTOR W/O LOAD REAR',
       (SELECT id FROM brands WHERE name = 'KING SPRING'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Box","color":"YELLOW"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'KFRR-121');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'KFFR-123SP', 'SUSPENSION FORD RAPTOR N.GEN W/O LOAD FRONT', 'FORD RAPTOR N.GEN W/O LOAD FRONT',
       (SELECT id FROM brands WHERE name = 'KING SPRING'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Box","color":"YELLOW"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'KFFR-123SP');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'KFRR-124', 'SUSPENSION FORD RAPTOR N.GEN W/O LOAD REAR', 'FORD RAPTOR N.GEN W/O LOAD REAR',
       (SELECT id FROM brands WHERE name = 'KING SPRING'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Box","color":"YELLOW"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'KFRR-124');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'KFFR-123', 'SUSPENSION FORD RAPTOR N,GEN W/ LOAD FRONT', 'FORD RAPTOR N,GEN W/ LOAD FRONT',
       (SELECT id FROM brands WHERE name = 'KING SPRING'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Box","color":"YELLOW"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'KFFR-123');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'KDFR-7T-375', 'SUSPENSION NISSAN W/O LOAD FRONT', 'NISSAN W/O LOAD FRONT',
       (SELECT id FROM brands WHERE name = 'KING SPRING'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Box","color":"YELLOW"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'KDFR-7T-375');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'KDRR-73', 'SUSPENSION NISSAN NP300 REAR', 'NISSAN NP300 REAR',
       (SELECT id FROM brands WHERE name = 'KING SPRING'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Box","color":"YELLOW"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'KDRR-73');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'KDRR-7310', 'SUSPENSION NISSAN TERRA REAR', 'NISSAN TERRA REAR',
       (SELECT id FROM brands WHERE name = 'KING SPRING'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Box","color":"YELLOW"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'KDRR-7310');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'KHFR-168TC-365', 'SUSPENSION ISUZU AND CHEVY FRONT', 'ISUZU AND CHEVY FRONT',
       (SELECT id FROM brands WHERE name = 'KING SPRING'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Box","color":"YELLOW"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'KHFR-168TC-365');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'KHRR-96-400', 'SUSPENSION TRAILBLAZER REAR', 'TRAILBLAZER REAR',
       (SELECT id FROM brands WHERE name = 'KING SPRING'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Box","color":"YELLOW"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'KHRR-96-400');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'KIRR-02-435', 'SUSPENSION ISUZU MU-X REAR', 'ISUZU MU-X REAR',
       (SELECT id FROM brands WHERE name = 'KING SPRING'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Box","color":"YELLOW"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'KIRR-02-435');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-KM3-001', 'TIRES 235/75/15', '235/75/15',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2021.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-KM3-001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-KM3-002', 'TIRES 285/70/17', '285/70/17',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-KM3-002');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-KM3-003', 'TIRES 35/12.50/17', '35/12.50/17',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-KM3-003');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-KM3-004', 'TIRES 35/12.50/20', '35/12.50/20',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-KM3-004');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-KM3-005', 'TIRES 285/65/18', '285/65/18',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-KM3-005');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-KM3-006', 'TIRES 305/55/20', '305/55/20',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-KM3-006');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-KM3-007', 'TIRES 295/70/18', '295/70/18',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-KM3-007');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-K02-001', 'TIRES 265/70/70', '265/70/70',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-K02-001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-K02-002', 'TIRES 285/70/17', '285/70/17',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2024.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-K02-002');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-K02-003', 'TIRES 295/70/17', '295/70/17',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-K02-003');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-K02-004', 'TIRES 265/65/18', '265/65/18',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-K02-004');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-K02-005', 'TIRES 275/68/18', '275/68/18',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-K02-005');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-K02-006', 'TIRES 285/65/18', '285/65/18',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2024.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-K02-006');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-K02-007', 'TIRES 235/75/15', '235/75/15',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-K02-007');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-K02-008', 'TIRES 275/55/20', '275/55/20',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-K02-008');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-K02-009', 'TIRES 285/55/20', '285/55/20',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2024.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-K02-009');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-K02-010', 'TIRES 305/55/20', '305/55/20',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-K02-010');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-K02-011', 'TIRES 35/12.50/20', '35/12.50/20',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-K02-011');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-K03-001', 'TIRES 235/75/15', '235/75/15',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-K03-001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-K03-002', 'TIRES 235/70/16', '235/70/16',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-K03-002');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-K03-003', 'TIRES 265/65/17', '265/65/17',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-K03-003');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-K03-004', 'TIRES 265/70/17', '265/70/17',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-K03-004');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-K03-005', 'TIRES 285/70/17', '285/70/17',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-K03-005');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-K03-006', 'TIRES 295/70/17', '295/70/17',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-K03-006');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-K03-007', 'TIRES 275/65/18', '275/65/18',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-K03-007');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-K03-008', 'TIRES 265/60/18', '265/60/18',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-K03-008');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-K03-009', 'TIRES 265/65/18', '265/65/18',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-K03-009');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-K03-010', 'TIRES 285/65/18', '285/65/18',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-K03-010');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-K03-011', 'TIRES 305/65/18', '305/65/18',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-K03-011');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-K03-012', 'TIRES 305/55/20', '305/55/20',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-K03-012');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-K03-013', 'TIRES 285/55/20', '285/55/20',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-K03-013');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-K03-014', 'TIRES 275/55/20', '275/55/20',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-K03-014');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-TT-001', 'TIRES 265/50/20', '265/50/20',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2023.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-TT-001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-AT-001', 'TIRES 205/65/15', '205/65/15',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2024.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-AT-001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-AT-002', 'TIRES 185/60/15', '185/60/15',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-AT-002');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-AT-003', 'TIRES 215/60/17', '215/60/17',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-AT-003');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-AT-004', 'TIRES 265/50/20', '265/50/20',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-AT-004');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-001', 'TIRES XT 205/65/15', 'XT 205/65/15',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-002', 'TIRES AT 205/70/15', 'AT 205/70/15',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-002');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-003', 'TIRES X/T 235/75/15', 'X/T 235/75/15',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-003');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-004', 'TIRES XT 235/85/16', 'XT 235/85/16',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-004');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-005', 'TIRES X/T 265/70/16', 'X/T 265/70/16',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-005');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-006', 'TIRES 285/75/16', '285/75/16',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-006');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-007', 'TIRES XT 215/65/16', 'XT 215/65/16',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-007');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-008', 'TIRES X/T 265/65/17', 'X/T 265/65/17',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-008');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-009', 'TIRES RT 265/65/17', 'RT 265/65/17',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-009');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-010', 'TIRES XT 265/70/17', 'XT 265/70/17',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-010');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-011', 'TIRES RT 265/70/17', 'RT 265/70/17',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-011');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-012', 'TIRES RT 275/70/17', 'RT 275/70/17',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-012');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-013', 'TIRES RT 285/70/17', 'RT 285/70/17',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2024.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-013');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-014', 'TIRES XT 285/70/17', 'XT 285/70/17',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-014');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-015', 'TIRES MT 285/70/17', 'MT 285/70/17',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-015');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-016', 'TIRES AT 295/70/17', 'AT 295/70/17',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-016');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-017', 'TIRES MT 315/70/17', 'MT 315/70/17',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-017');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-018', 'TIRES RT 33/12.50/17', 'RT 33/12.50/17',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-018');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-019', 'TIRES RT 35/12.50/17', 'RT 35/12.50/17',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-019');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-020', 'TIRES MT 35/12.50/17', 'MT 35/12.50/17',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-020');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-021', 'TIRES XT 265/60/18', 'XT 265/60/18',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-021');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-022', 'TIRES XT 265/65/18', 'XT 265/65/18',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-022');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-023', 'TIRES XT 275/65/18', 'XT 275/65/18',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-023');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-024', 'TIRES RT 285/60/18', 'RT 285/60/18',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-024');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-025', 'TIRES X/T 285/65/18', 'X/T 285/65/18',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-025');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-026', 'TIRES RT 275/70/18', 'RT 275/70/18',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-026');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-027', 'TIRES RT 285/65/18', 'RT 285/65/18',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-027');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-028', 'TIRES MT 35/12.5/18', 'MT 35/12.5/18',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2024.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-028');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-029', 'TIRES AT 265/50/20', 'AT 265/50/20',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-029');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-030', 'TIRES AT 295/70/20', 'AT 295/70/20',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-030');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-031', 'TIRES RT 275/55/20', 'RT 275/55/20',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-031');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-032', 'TIRES XT 275/55/20', 'XT 275/55/20',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-032');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-033', 'TIRES RT 285/55/20', 'RT 285/55/20',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-033');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-034', 'TIRES RT 305/55/20', 'RT 305/55/20',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-034');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-035', 'TIRES RT 33/12.5/20', 'RT 33/12.5/20',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-035');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-036', 'TIRES RT 35/12.5/20', 'RT 35/12.5/20',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-036');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-037', 'TIRES MT 35/12.5/20', 'MT 35/12.5/20',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-037');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-038', 'TIRES RT 37/12.5/20', 'RT 37/12.5/20',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-038');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-039', 'TIRES RT 38/13.5/20', 'RT 38/13.5/20',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-039');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-040', 'TIRES 275/55/20', '275/55/20',
       (SELECT id FROM brands WHERE name = 'VENOM RAGNAROK'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-040');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-041', 'TIRES XT 305/55/20', 'XT 305/55/20',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-041');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-042', 'TIRES XT 265/50/20', 'XT 265/50/20',
       (SELECT id FROM brands WHERE name = 'VENOM POWER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-042');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VP-TIRE-043', 'TIRES 305/45/22', '305/45/22',
       (SELECT id FROM brands WHERE name = 'VENOM RAGNAROK'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VP-TIRE-043');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'CPTT-001', 'TIRES STT PRO - 285/70/17', 'STT PRO - 285/70/17',
       (SELECT id FROM brands WHERE name = 'COOPER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'CPTT-001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'CPTT-002', 'TIRES STT PRO - 285/70/18', 'STT PRO - 285/70/18',
       (SELECT id FROM brands WHERE name = 'COOPER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'CPTT-002');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'CPTT-003', 'TIRES STT PRO - 35/12.5/20', 'STT PRO - 35/12.5/20',
       (SELECT id FROM brands WHERE name = 'COOPER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2024.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'CPTT-003');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'CPTT-004', 'TIRES AT3 - 285/70/17', 'AT3 - 285/70/17',
       (SELECT id FROM brands WHERE name = 'COOPER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'CPTT-004');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'CPTT-005', 'TIRES AT3 - 285/65/18', 'AT3 - 285/65/18',
       (SELECT id FROM brands WHERE name = 'COOPER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2024.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'CPTT-005');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'CPTT-006', 'TIRES ROAD TRAIL - 265/65/17', 'ROAD TRAIL - 265/65/17',
       (SELECT id FROM brands WHERE name = 'COOPER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2024.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'CPTT-006');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'CPTT-007', 'TIRES ROAD TRAIL - 265/65/18', 'ROAD TRAIL - 265/65/18',
       (SELECT id FROM brands WHERE name = 'COOPER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2024.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'CPTT-007');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'CPTT-008', 'TIRES ROAD TRAIL - 275/55/20', 'ROAD TRAIL - 275/55/20',
       (SELECT id FROM brands WHERE name = 'COOPER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2024.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'CPTT-008');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'CPTT-009', 'TIRES ROAD TRAIL - 265/60/18', 'ROAD TRAIL - 265/60/18',
       (SELECT id FROM brands WHERE name = 'COOPER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'CPTT-009');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'CPTT-010', 'TIRES RAOD TRAIL - 235/70/16', 'RAOD TRAIL - 235/70/16',
       (SELECT id FROM brands WHERE name = 'COOPER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'CPTT-010');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'CPTT-011', 'TIRES RUGGED TRECK - 285/55/20', 'RUGGED TRECK - 285/55/20',
       (SELECT id FROM brands WHERE name = 'COOPER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2024.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'CPTT-011');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'CPTT-012', 'TIRES RUGGED TRECK -305/55/20', 'RUGGED TRECK -305/55/20',
       (SELECT id FROM brands WHERE name = 'COOPER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'CPTT-012');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'CPTT-013', 'TIRES RUGGED TRECK - 285/70/17', 'RUGGED TRECK - 285/70/17',
       (SELECT id FROM brands WHERE name = 'COOPER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'CPTT-013');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'CPTT-014', 'TIRES RUGGED TRECK - 265/50/20', 'RUGGED TRECK - 265/50/20',
       (SELECT id FROM brands WHERE name = 'COOPER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2024.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'CPTT-014');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'CPTT-015', 'TIRES STRONG HOLD - 285/70/17', 'STRONG HOLD - 285/70/17',
       (SELECT id FROM brands WHERE name = 'COOPER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'CPTT-015');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'CPTT-016', 'TIRES STRONG HOLD -275/55/20', 'STRONG HOLD -275/55/20',
       (SELECT id FROM brands WHERE name = 'COOPER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'CPTT-016');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TOTO- TIRE-01', 'TIRES RT - 265/65/17', 'RT - 265/65/17',
       (SELECT id FROM brands WHERE name = 'TOYO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TOTO- TIRE-01');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TOTO- TIRE-02', 'TIRES RT - 265/70/17', 'RT - 265/70/17',
       (SELECT id FROM brands WHERE name = 'TOYO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TOTO- TIRE-02');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TOTO- TIRE-03', 'TIRES RT - 265/60/18', 'RT - 265/60/18',
       (SELECT id FROM brands WHERE name = 'TOYO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TOTO- TIRE-03');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TOTO- TIRE-04', 'TIRES RT - 285/60/18', 'RT - 285/60/18',
       (SELECT id FROM brands WHERE name = 'TOYO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TOTO- TIRE-04');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TOTO- TIRE-05', 'TIRES RT - 285/70/17', 'RT - 285/70/17',
       (SELECT id FROM brands WHERE name = 'TOYO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TOTO- TIRE-05');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TOTO- TIRE-06', 'TIRES RT - 265/ 50/20', 'RT - 265/ 50/20',
       (SELECT id FROM brands WHERE name = 'TOYO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TOTO- TIRE-06');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TOTO- TIRE-07', 'TIRES RT - 305/55/20', 'RT - 305/55/20',
       (SELECT id FROM brands WHERE name = 'TOYO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TOTO- TIRE-07');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TOTO- TIRE-08', 'TIRES RT - 275/55/20', 'RT - 275/55/20',
       (SELECT id FROM brands WHERE name = 'TOYO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TOTO- TIRE-08');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TOTO- TIRE-09', 'TIRES RT - 265/65/18', 'RT - 265/65/18',
       (SELECT id FROM brands WHERE name = 'TOYO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TOTO- TIRE-09');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'NITTO-006', 'TIRES TRAIL GRAPPLE - 35/12.5/20', 'TRAIL GRAPPLE - 35/12.5/20',
       (SELECT id FROM brands WHERE name = 'NITTO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'NITTO-006');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'NITTO-007', 'TIRES TRAIL GRAPPLE - 35/12.5/17', 'TRAIL GRAPPLE - 35/12.5/17',
       (SELECT id FROM brands WHERE name = 'NITTO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'NITTO-007');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'NITTO-008', 'TIRES G2 - 285/70/17', 'G2 - 285/70/17',
       (SELECT id FROM brands WHERE name = 'NITTO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2024.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'NITTO-008');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'NITTO-009', 'TIRES RG - 265/65/17', 'RG - 265/65/17',
       (SELECT id FROM brands WHERE name = 'NITTO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2023.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'NITTO-009');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'NITTO-010', 'TIRES G2 - 265/60/18', 'G2 - 265/60/18',
       (SELECT id FROM brands WHERE name = 'NITTO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2024.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'NITTO-010');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'NITTO-011', 'TIRES EX - 33/12.5/20', 'EX - 33/12.5/20',
       (SELECT id FROM brands WHERE name = 'NITTO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2022.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'NITTO-011');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'NITTO-012', 'TIRES RIDEGE - 275/55/20', 'RIDEGE - 275/55/20',
       (SELECT id FROM brands WHERE name = 'NITTO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'NITTO-012');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'NITTO-013', 'TIRES 420v - 305/45/22', '420v - 305/45/22',
       (SELECT id FROM brands WHERE name = 'NITTO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'NITTO-013');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'NITTO-014', 'TIRES TRAIL GRAPPLER- 295/70/17', 'TRAIL GRAPPLER- 295/70/17',
       (SELECT id FROM brands WHERE name = 'NITTO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'NITTO-014');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'NITTO-015', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'NITTO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'NITTO-015');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TOTO- TIRE-010', 'TIRES 215/65/16', '215/65/16',
       (SELECT id FROM brands WHERE name = 'TOYO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TOTO- TIRE-010');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TOTO- TIRE-011', 'TIRES 235/70/16', '235/70/16',
       (SELECT id FROM brands WHERE name = 'TOYO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TOTO- TIRE-011');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-001', 'TIRES 185/14C', '185/14C',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-002', 'TIRES 175/65/14', '175/65/14',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-002');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-003', 'TIRES 185/65/14', '185/65/14',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2024.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-003');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-004', 'TIRES 185/70/14', '185/70/14',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-004');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-005', 'TIRES 195/15C', '195/15C',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-005');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-006', 'TIRES 185/55/15', '185/55/15',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-006');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-007', 'TIRES ALNAC 4G - 185/65/15', 'ALNAC 4G - 185/65/15',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-007');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-008', 'TIRES ALNAC 4G- 185/60/15', 'ALNAC 4G- 185/60/15',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-008');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-009', 'TIRES 195/50/15', '195/50/15',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-009');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-010', 'TIRES 195/55/15', '195/55/15',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-010');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-011', 'TIRES 205/65/15', '205/65/15',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-011');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-012', 'TIRES 215/70/15-C', '215/70/15-C',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2024.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-012');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-013', 'TIRES 205/70/15-C', '205/70/15-C',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-013');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-014', 'TIRES 195/50/16', '195/50/16',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-014');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-015', 'TIRES 205/55/16', '205/55/16',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-015');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-016', 'TIRES 205/65/16', '205/65/16',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2024.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-016');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-017', 'TIRES 235/65/16-C', '235/65/16-C',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-017');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-018', 'TIRES 215/55/16', '215/55/16',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-018');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-019', 'TIRES 215/65/16', '215/65/16',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-019');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-020', 'TIRES 215/55/17', '215/55/17',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-020');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-021', 'TIRES 215/45/17', '215/45/17',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-021');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-022', 'TIRES ALNAC 4G - 215/60/17', 'ALNAC 4G - 215/60/17',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-022');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-023', 'TIRES 205/45/17', '205/45/17',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-023');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-024', 'TIRES 265/65/17 - AT', '265/65/17 - AT',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-024');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-025', 'TIRES ASPIRE 4G - 225/55/17', 'ASPIRE 4G - 225/55/17',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-025');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-026', 'TIRES 205/55/17', '205/55/17',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-026');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-027', 'TIRES 225/65/17', '225/65/17',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-027');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-028', 'TIRES 265/65/17- HT', '265/65/17- HT',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-028');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-029', 'TIRES ASPIRE 4G+ 215/50/17', 'ASPIRE 4G+ 215/50/17',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-029');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-030', 'TIRES 225/45/18', '225/45/18',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-030');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-031', 'TIRES ALNAC 4G -235/50/18', 'ALNAC 4G -235/50/18',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-031');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-032', 'TIRES 235/60/18', '235/60/18',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-032');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-033', 'TIRES APTERRA 2 - 265/60/18 - AT', 'APTERRA 2 - 265/60/18 - AT',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-033');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-034', 'TIRES 235/55/18', '235/55/18',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-034');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-035', 'TIRES 265/60/18- HT', '265/60/18- HT',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-035');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-036', 'TIRES 235/45/18', '235/45/18',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-036');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-037', 'TIRES 235/40/18', '235/40/18',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-037');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-038', 'TIRES 265/50/20- AT', '265/50/20- AT',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-038');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'APT-039', 'TIRES 265/50/20- HT', '265/50/20- HT',
       (SELECT id FROM brands WHERE name = 'APOLLO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'APT-039');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-001', 'TIRES LTX TRAIL  265/65/17', 'LTX TRAIL  265/65/17',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-002', 'TIRES LTX TRAIL  265/65/17', 'LTX TRAIL  265/65/17',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2024.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-002');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-003', 'TIRES LTX TRAIL  265/65/17', 'LTX TRAIL  265/65/17',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2022.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-003');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-004', 'TIRES PRIMACY 5 - 215/50/17', 'PRIMACY 5 - 215/50/17',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-004');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-005', 'TIRES PRIMACY SUV+ 235/60/17', 'PRIMACY SUV+ 235/60/17',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-005');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-006', 'TIRES PRIMACY SUV+ 265/65/17', 'PRIMACY SUV+ 265/65/17',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-006');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-008', 'TIRES PILOT SPORT-5 205/45/17', 'PILOT SPORT-5 205/45/17',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2024.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-008');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-009', 'TIRES AGILIS-3 235/60/17', 'AGILIS-3 235/60/17',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-009');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-010', 'TIRES LTX TRAIL - 265/60/18', 'LTX TRAIL - 265/60/18',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-010');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-011', 'TIRES PRIMACY 5 -235/50/18', 'PRIMACY 5 -235/50/18',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-011');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-012', 'TIRES PRIMACY5 - 235/55/18', 'PRIMACY5 - 235/55/18',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-012');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-013', 'TIRES E PRIMACY - 235/60/18', 'E PRIMACY - 235/60/18',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-013');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-014', 'TIRES PRIMACY SUV - 265/60/18', 'PRIMACY SUV - 265/60/18',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-014');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-015', 'TIRES PILOT SPORT 4 - 225/40/18', 'PILOT SPORT 4 - 225/40/18',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2023.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-015');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-016', 'TIRES PILOT SPORT 5 - 225/45/18', 'PILOT SPORT 5 - 225/45/18',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-016');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-017', 'TIRES PILOT SPORT 4 SUV - 265/50/20', 'PILOT SPORT 4 SUV - 265/50/20',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-017');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-018', 'TIRES PRIMACY SUV+ - 265/ 70/16', 'PRIMACY SUV+ - 265/ 70/16',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-018');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-019', 'TIRES PRIMACY SUV+ - 215/70/16', 'PRIMACY SUV+ - 215/70/16',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2024.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-019');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-020', 'TIRES PRIMACY 3 - 195/55/16', 'PRIMACY 3 - 195/55/16',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-020');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-021', 'TIRES PRIMACY ST - 195/55/16', 'PRIMACY ST - 195/55/16',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-021');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-022', 'TIRES PRIMACY 5 - 205/65/16', 'PRIMACY 5 - 205/65/16',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-022');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-023', 'TIRES ENERGY XM2+ - 215/65/16', 'ENERGY XM2+ - 215/65/16',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-023');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-024', 'TIRES ENERGY XM2+ - 195/50/16', 'ENERGY XM2+ - 195/50/16',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-024');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-025', 'TIRES LTX TRAIL - 235/70/16', 'LTX TRAIL - 235/70/16',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-025');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-026', 'TIRES ENERGY XM2+ - 185/55/15', 'ENERGY XM2+ - 185/55/15',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-026');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-027', 'TIRES ENERGY XM2+ - 185/60/15', 'ENERGY XM2+ - 185/60/15',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-027');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-028', 'TIRES ENERGY XM2+ - 195/55/15', 'ENERGY XM2+ - 195/55/15',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-028');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-029', 'TIRES ENERGY XM2+ - 205/ 65/15', 'ENERGY XM2+ - 205/ 65/15',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-029');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-030', 'TIRES LTX TRAIL ST - 235/70/15', 'LTX TRAIL ST - 235/70/15',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-030');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-031', 'TIRES ENERGY XM2+ - 175/65/14', 'ENERGY XM2+ - 175/65/14',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-031');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-032', 'TIRES ENERGY XM2+ - 175/70/14', 'ENERGY XM2+ - 175/70/14',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-032');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-033', 'TIRES ENERGY XM2+ - 185/70/14', 'ENERGY XM2+ - 185/70/14',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-033');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-034', 'TIRES AGILIS 3 RC - 185/14C', 'AGILIS 3 RC - 185/14C',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2024.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-034');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-035', 'TIRES AGILIS 3 RC - 185/14C', 'AGILIS 3 RC - 185/14C',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-035');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-036', 'TIRES LTX TRAIL - 235/65/17', 'LTX TRAIL - 235/65/17',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-036');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-037', 'TIRES PILOT SPORT EV - 255/45/20', 'PILOT SPORT EV - 255/45/20',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-037');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-038', 'TIRES AGILIS 3 - 215/70/16C', 'AGILIS 3 - 215/70/16C',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-038');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-039', 'TIRES LTX TRAIL - 225/70/15', 'LTX TRAIL - 225/70/15',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-039');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-040', 'TIRES PRIMACY 5 - 215/55/17', 'PRIMACY 5 - 215/55/17',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-040');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-041', 'TIRES PRIMACY 5 - 215/60/17', 'PRIMACY 5 - 215/60/17',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-041');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-042', 'TIRES PRIMACY SUV - 225/65/17', 'PRIMACY SUV - 225/65/17',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-042');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-043', 'TIRES ENERGY XM2 - 185/65/15', 'ENERGY XM2 - 185/65/15',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-043');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-044', 'TIRES PILOTSPORT 5 215/40/18', 'PILOTSPORT 5 215/40/18',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-044');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-045', 'TIRES PRIMACY 5 245/50/18', 'PRIMACY 5 245/50/18',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-045');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-046', 'TIRES PILOT SPORT 5 245/35/20', 'PILOT SPORT 5 245/35/20',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-046');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-047', 'TIRES PILOT SPORT 5 225/40/18', 'PILOT SPORT 5 225/40/18',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-047');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MONS-TI-001', 'TIRES 285/70/17', '285/70/17',
       (SELECT id FROM brands WHERE name = 'MONSTA'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MONS-TI-001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MONS-TI-002', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'MONSTA'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MONS-TI-002');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MONS-TI-003', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'MONSTA'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MONS-TI-003');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MONS-TI-004', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'MONSTA'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MONS-TI-004');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MONS-TI-005', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'MONSTA'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MONS-TI-005');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MONS-TI-006', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'MONSTA'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MONS-TI-006');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MONS-TI-007', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'MONSTA'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MONS-TI-007');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MONS-TI-008', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'MONSTA'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MONS-TI-008');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MONS-TI-009', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'MONSTA'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MONS-TI-009');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MONS-TI-010', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'MONSTA'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MONS-TI-010');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MONS-TI-011', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'MONSTA'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MONS-TI-011');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MONS-TI-012', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'MONSTA'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MONS-TI-012');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MONS-TI-013', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'MONSTA'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MONS-TI-013');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MONS-TI-014', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'MONSTA'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MONS-TI-014');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MONS-TI-015', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'MONSTA'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MONS-TI-015');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-001', 'TIRES PREMIO ARZ1 - 165/65/13', 'PREMIO ARZ1 - 165/65/13',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-002', 'TIRES PREMIO ARZ1 - 185/70/13', 'PREMIO ARZ1 - 185/70/13',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2022.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-002');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-000', 'TIRES COMPORT 6 - 195/50/16', 'COMPORT 6 - 195/50/16',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-000');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-003', 'TIRES PREMIO ARZ1 - 185/65/14', 'PREMIO ARZ1 - 185/65/14',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-003');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-004', 'TIRES PREMIO ARZ1 - 185/70/14', 'PREMIO ARZ1 - 185/70/14',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-004');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-005', 'TIRES COMPORT 6 - 165/65/14', 'COMPORT 6 - 165/65/14',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-005');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-006', 'TIRES COMPORT 6 - 185/65/14', 'COMPORT 6 - 185/65/14',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-006');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-007', 'TIRES TRANSITO - 195/14c', 'TRANSITO - 195/14c',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-007');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-008', 'TIRES TRANSITO -  185/14c', 'TRANSITO -  185/14c',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-008');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-009', 'TIRES PREMIO ARZ1 - 165/60/15', 'PREMIO ARZ1 - 165/60/15',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2023.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-009');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-010', 'TIRES PREMIO ARZ1 - 175/50/15', 'PREMIO ARZ1 - 175/50/15',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-010');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-011', 'TIRES PREMIO ARZ1 - 175/55/15', 'PREMIO ARZ1 - 175/55/15',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-011');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-012', 'TIRES PREMIO ARZ1 - 175/65/15', 'PREMIO ARZ1 - 175/65/15',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-012');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-013', 'TIRES PREMIO ARZ1 - 185/55/15', 'PREMIO ARZ1 - 185/55/15',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-013');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-014', 'TIRES PREMIO ARZ1 - 185/60/15', 'PREMIO ARZ1 - 185/60/15',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-014');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-015', 'TIRES PREMIO ARZ1 - 195/50/15', 'PREMIO ARZ1 - 195/50/15',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-015');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-016', 'TIRES PREMIO ARZ1 - 205/50/15', 'PREMIO ARZ1 - 205/50/15',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2024.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-016');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-017', 'TIRES PREMIO ARZ1 - 205/60/15', 'PREMIO ARZ1 - 205/60/15',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2021.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-017');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-018', 'TIRES PREMIO ARZ1 - 205/65/15', 'PREMIO ARZ1 - 205/65/15',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-018');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-019', 'TIRES PREMIO ARZ1 - 205/70/15', 'PREMIO ARZ1 - 205/70/15',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-019');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-020', 'TIRES PREMIO ARZ1 -215/65/15', 'PREMIO ARZ1 -215/65/15',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-020');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-021', 'TIRES TRANSITO - 215/70/15', 'TRANSITO - 215/70/15',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-021');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-022', 'TIRES TRANSITO - 225/ 70/15', 'TRANSITO - 225/ 70/15',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-022');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-023', 'TIRES COMPORT 6 - 175/55/15', 'COMPORT 6 - 175/55/15',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-023');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-024', 'TIRES COMPORT 6 - 175/65/15', 'COMPORT 6 - 175/65/15',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-024');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-025', 'TIRES COMPORT 6 - 185/55/15', 'COMPORT 6 - 185/55/15',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-025');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-026', 'TIRES COMPORT 6 - 185/60/15', 'COMPORT 6 - 185/60/15',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-026');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-027', 'TIRES COMPORT 6 - 185/65/15', 'COMPORT 6 - 185/65/15',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-027');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-028', 'TIRES COMPORT 6 - 195/55/15', 'COMPORT 6 - 195/55/15',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-028');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-029', 'TIRES COMPORT 6 - 195/60/15', 'COMPORT 6 - 195/60/15',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-029');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-030', 'TIRES COMPORT 6 - 205/65/15', 'COMPORT 6 - 205/65/15',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-030');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-031', 'TIRES PREMIO ARZ1 - 185/55/16', 'PREMIO ARZ1 - 185/55/16',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-031');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-032', 'TIRES PREMIO ARZ1 - 195/50/16', 'PREMIO ARZ1 - 195/50/16',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-032');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-033', 'TIRES PREMIO ARZ1 - 195/60/16', 'PREMIO ARZ1 - 195/60/16',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-033');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-034', 'TIRES PREMIO ARZ1 - 205/50/16', 'PREMIO ARZ1 - 205/50/16',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-034');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-035', 'TIRES PREMIO ARZ1 - 205/60/16', 'PREMIO ARZ1 - 205/60/16',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-035');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-036', 'TIRES PREMIO ARZ1 - 205/65/16', 'PREMIO ARZ1 - 205/65/16',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-036');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-037', 'TIRES PREMIO ARZ1 - 215/55/16', 'PREMIO ARZ1 - 215/55/16',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2024.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-037');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-038', 'TIRES PREMIO ARZ1 - 215/65/16', 'PREMIO ARZ1 - 215/65/16',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-038');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-039', 'TIRES PREMIO ARZ1 - 215/70/16', 'PREMIO ARZ1 - 215/70/16',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-039');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-040', 'TIRES PREMIO ARZ1 -  235/60/16', 'PREMIO ARZ1 -  235/60/16',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2024.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-040');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-041', 'TIRES PREMIO ARZ1 - 235/60/16', 'PREMIO ARZ1 - 235/60/16',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2022.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-041');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-042', 'TIRES COMPORT 6 - 195/60/16', 'COMPORT 6 - 195/60/16',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-042');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-043', 'TIRES COMPORT 6 - 235/60/16', 'COMPORT 6 - 235/60/16',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-043');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-044', 'TIRES TERRAMAX ARV PRO A/T - 265/70/16', 'TERRAMAX ARV PRO A/T - 265/70/16',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-044');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-045', 'TIRES ULTRA ARZ4 - 195/50/16', 'ULTRA ARZ4 - 195/50/16',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-045');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-046', 'TIRES ULTRA ARZ4 - 205/45/16', 'ULTRA ARZ4 - 205/45/16',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-046');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-047', 'TIRES ULTRA ARZ4 - 205/50/16', 'ULTRA ARZ4 - 205/50/16',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-047');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-048', 'TIRES TERRANO ARV H/T - 215/70/16', 'TERRANO ARV H/T - 215/70/16',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-048');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-049', 'TIRES TERRANO ARV H/T - 225/70/16', 'TERRANO ARV H/T - 225/70/16',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2023.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-049');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-050', 'TIRES TRANSITO ARZ6-C - 7.50/16 LT', 'TRANSITO ARZ6-C - 7.50/16 LT',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2024.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-050');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-051', 'TIRES TRANSITO ARZ6-C - 235/65/16', 'TRANSITO ARZ6-C - 235/65/16',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2023.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-051');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-052', 'TIRES PRIMIO ARZ1 - 215/60/17', 'PRIMIO ARZ1 - 215/60/17',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-052');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-053', 'TIRES TERRAMAX ARV PRO A/T - 265/65/17', 'TERRAMAX ARV PRO A/T - 265/65/17',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-053');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-054', 'TIRES COMPORT 6 - 225/65/17', 'COMPORT 6 - 225/65/17',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-054');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-055', 'TIRES ULTRA ARZ5 - 205/45/17', 'ULTRA ARZ5 - 205/45/17',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-055');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-056', 'TIRES ULTRA ARZ5 - 205/50/17', 'ULTRA ARZ5 - 205/50/17',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-056');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-057', 'TIRES ULTRA ARZ5 - 215/40/17', 'ULTRA ARZ5 - 215/40/17',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-057');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-058', 'TIRES ULTRA ARZ5 - 215/45/17', 'ULTRA ARZ5 - 215/45/17',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-058');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-059', 'TIRES ULTRA ARZ5 - 215/50/17', 'ULTRA ARZ5 - 215/50/17',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-059');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-060', 'TIRES ULTRA ARZ5 - 215/55/17', 'ULTRA ARZ5 - 215/55/17',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-060');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-061', 'TIRES TERRNO ARV H/T -  235/60/17', 'TERRNO ARV H/T -  235/60/17',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2024.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-061');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-062', 'TIRES ULTRA ARZ5 - 225/45/18', 'ULTRA ARZ5 - 225/45/18',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-062');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-063', 'TIRES ULTRA ARZ5 - 235/40/18', 'ULTRA ARZ5 - 235/40/18',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-063');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-064', 'TIRES ULTRA ARZ5 - 235/45/18', 'ULTRA ARZ5 - 235/45/18',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-064');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-065', 'TIRES ULTRA ARZ5 - 235/50/18', 'ULTRA ARZ5 - 235/50/18',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-065');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-066', 'TIRES ULTRA ARZ5 - 235/55/18', 'ULTRA ARZ5 - 235/55/18',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-066');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-067', 'TIRES ULTRA ARZ4 - 225/40/18', 'ULTRA ARZ4 - 225/40/18',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-067');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-068', 'TIRES ULTRA ARZ4 - 225/45/18', 'ULTRA ARZ4 - 225/45/18',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-068');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-069', 'TIRES ULTRA ARZ4 - 235/55/18', 'ULTRA ARZ4 - 235/55/18',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-069');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-070', 'TIRES TERRAMAX ARV PRO A/T - 265/60/18', 'TERRAMAX ARV PRO A/T - 265/60/18',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-070');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-071', 'TIRES TERRANO ARV H/T - 235/ 60/18', 'TERRANO ARV H/T - 235/ 60/18',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-071');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-072', 'TIRES PREMIO SPORT 6 - 205/45/17', 'PREMIO SPORT 6 - 205/45/17',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-072');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-073', 'TIRES TERRAMAX ARV PRO A/T - 265/50/20', 'TERRAMAX ARV PRO A/T - 265/50/20',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-073');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-074', 'TIRES TERRAMAX ARV PRO A/T -  275/55/ 20', 'TERRAMAX ARV PRO A/T -  275/55/ 20',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-074');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-075', 'TIRES PRIMIO SPORT 6 - 215/55/17', 'PRIMIO SPORT 6 - 215/55/17',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-075');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-076', 'TIRES TERRA MAX ARV PRO A/T - 265/70/17', 'TERRA MAX ARV PRO A/T - 265/70/17',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-076');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-077', 'TIRES ULTRA ARZ4 - 235/45/18', 'ULTRA ARZ4 - 235/45/18',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-077');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-078', 'TIRES COMPORT 6 - 185/70/14', 'COMPORT 6 - 185/70/14',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-078');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-079', 'TIRES COMPORT 6 - 175/50/15', 'COMPORT 6 - 175/50/15',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-079');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-080', 'TIRES COMPORT 6 - 185/55/16', 'COMPORT 6 - 185/55/16',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-080');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-081', 'TIRES COMPORT 6 -195/55/16', 'COMPORT 6 -195/55/16',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-081');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-082', 'TIRES COMPORT 6 - 215/60/17', 'COMPORT 6 - 215/60/17',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-082');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-083', 'TIRES COMPORT 6 - 225/60/17', 'COMPORT 6 - 225/60/17',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-083');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-084', 'TIRES COMPORT 6 - 215/55/16', 'COMPORT 6 - 215/55/16',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-084');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-085', 'TIRES COMPORT 6  -175/65/14', 'COMPORT 6  -175/65/14',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-085');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-086', 'TIRES AWSDW', 'AWSDW',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-086');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-087', 'TIRES TRANSITO ARZ 6 - 205/85/16 LT', 'TRANSITO ARZ 6 - 205/85/16 LT',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-087');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-089', 'TIRES COMPORT 6 - 195/50/15', 'COMPORT 6 - 195/50/15',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-089');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-090', 'TIRES PREMIO ARZ1 - 185/65/15', 'PREMIO ARZ1 - 185/65/15',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-090');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-091', 'TIRES PREMIO SPORT 6 - 235/40/18', 'PREMIO SPORT 6 - 235/40/18',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-091');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-092', 'TIRES PREMIO SPORT 6 - 235/45/18', 'PREMIO SPORT 6 - 235/45/18',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-092');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-093', 'TIRES PREMIO SPORT 6 - 215/45/18', 'PREMIO SPORT 6 - 215/45/18',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-093');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-094', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-094');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-095', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-095');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-096', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-096');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-097', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-097');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-098', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-098');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-099', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-099');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-100', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-100');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-101', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-101');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-102', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-102');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-103', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-103');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-104', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-104');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-105', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-105');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-106', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-106');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-107', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-107');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-108', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-108');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-109', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-109');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-110', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-110');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIV-TIRE-', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIV-TIRE-');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIVO-C6-01', 'TIRES COMPORT 6- 205/70/15', 'COMPORT 6- 205/70/15',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIVO-C6-01');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIVO-C6-02', 'TIRES COMPORT 6 - 205/65/16', 'COMPORT 6 - 205/65/16',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIVO-C6-02');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ATLNDR-TT-001', 'TIRES ROVERCLOW A/T - 235/65/17', 'ROVERCLOW A/T - 235/65/17',
       (SELECT id FROM brands WHERE name = 'ATLANDER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ATLNDR-TT-001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ATLNDR-TT-002', 'TIRES ROVERCLAW AT - 235/70/16', 'ROVERCLAW AT - 235/70/16',
       (SELECT id FROM brands WHERE name = 'ATLANDER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ATLNDR-TT-002');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ATLNDR-TT-003', 'TIRES ADWFASD', 'ADWFASD',
       (SELECT id FROM brands WHERE name = 'ATLANDER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ATLNDR-TT-003');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ATLNDR-TT-004', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'ATLANDER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ATLNDR-TT-004');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ATLNDR-TT-005', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'ATLANDER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ATLNDR-TT-005');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ATLNDR-TT-006', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'ATLANDER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ATLNDR-TT-006');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ATLNDR-TT-007', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'ATLANDER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ATLNDR-TT-007');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ATLNDR-TT-008', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'ATLANDER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ATLNDR-TT-008');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ATLNDR-TT-009', 'TIRES TBR -  235/75/17', 'TBR -  235/75/17',
       (SELECT id FROM brands WHERE name = 'LINGLONG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ATLNDR-TT-009');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ATLNDR-TT-010', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'LINGLONG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ATLNDR-TT-010');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ATLNDR-TT-011', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'ATLANDER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ATLNDR-TT-011');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ATLNDR-TT-012', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'ATLANDER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ATLNDR-TT-012');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ATLNDR-TT-013', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'ATLANDER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ATLNDR-TT-013');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ATLNDR-TT-014', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'ATLANDER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ATLNDR-TT-014');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ATLNDR-TT-015', 'TIRES', '',
       (SELECT id FROM brands WHERE name = 'ATLANDER'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ATLNDR-TT-015');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BOSCH 1OF 1', 'HORN BOSCH EUROPA', 'BOSCH EUROPA',
       (SELECT id FROM brands WHERE name = 'BOSCH'),
       (SELECT id FROM categories WHERE name = 'HORN'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"SILVER"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BOSCH 1OF 1');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PRO-MOTO-S-001', 'SUSPENSION YAMAHA XMAX 250/300- 350MM REAR', 'YAMAHA XMAX 250/300- 350MM REAR',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"RED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRO-MOTO-S-001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PRO-MOTO-S-002', 'SUSPENSION YAMAHA XMAX 250/300- 350MM REAR', 'YAMAHA XMAX 250/300- 350MM REAR',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRO-MOTO-S-002');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PRO-MOTO-S-003', 'SUSPENSION YAMAHA NMAX155/HONDA PCX 150 Y13-18 REAR', 'YAMAHA NMAX155/HONDA PCX 150 Y13-18 REAR',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"RED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRO-MOTO-S-003');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PRO-MOTO-S-004', 'SUSPENSION YAMAHA NMAX155 REAR', 'YAMAHA NMAX155 REAR',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRO-MOTO-S-004');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PRO-MOTO-S-005', 'SUSPENSION YAMAHA AEROX 155 REAR', 'YAMAHA AEROX 155 REAR',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"RED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRO-MOTO-S-005');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PRO-MOTO-S-006', 'SUSPENSION YAMAHA MIO125 310MM REAR', 'YAMAHA MIO125 310MM REAR',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRO-MOTO-S-006');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PRO-MOTO-S-007', 'SUSPENSION YAMAHA MIO125 310MM REAR', 'YAMAHA MIO125 310MM REAR',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"RED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRO-MOTO-S-007');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PRO-MOTO-S-008', 'SUSPENSION HONDA CLICK 150i FIRM SPRING 330MM', 'HONDA CLICK 150i FIRM SPRING 330MM',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRO-MOTO-S-008');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PRO-MOTO-S-009', 'SUSPENSION HONDA CLICK 150i FIRM SPRING 330MM', 'HONDA CLICK 150i FIRM SPRING 330MM',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"RED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRO-MOTO-S-009');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PRO-MOTO-S-010', 'SUSPENSION HONDA ADV150 REAR', 'HONDA ADV150 REAR',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"RED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRO-MOTO-S-010');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PRO-MOTO-S-011', 'SUSPENSION', '',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRO-MOTO-S-011');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PRO-MOTO-S-012', 'SUSPENSION', '',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRO-MOTO-S-012');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'AC-ADAL-01', 'SUSPENSION UNIVERSAL', 'UNIVERSAL',
       (SELECT id FROM brands WHERE name = 'ADD-A-LEAF'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'AC-ADAL-01');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'AC-ADAL-02', 'WHEEL SPACER 6X139 X 93X 25MM', '6X139 X 93X 25MM',
       (SELECT id FROM brands WHERE name = 'ELAINE'),
       (SELECT id FROM categories WHERE name = 'WHEEL SPACER'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'AC-ADAL-02');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'AC-ADAL-03', 'WHEEL SPACER 6X139 X 93X 35MM', '6X139 X 93X 35MM',
       (SELECT id FROM brands WHERE name = 'ELAINE'),
       (SELECT id FROM categories WHERE name = 'WHEEL SPACER'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'AC-ADAL-03');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'AC-ADAL-04', 'WHEEL SPACER 6X139 X 106 X 25MM', '6X139 X 106 X 25MM',
       (SELECT id FROM brands WHERE name = 'ELAINE'),
       (SELECT id FROM categories WHERE name = 'WHEEL SPACER'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'AC-ADAL-04');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'AC-ADAL-05', 'WHEEL SPACER 6X139 X 106 X 35MM', '6X139 X 106 X 35MM',
       (SELECT id FROM brands WHERE name = 'ELAINE'),
       (SELECT id FROM categories WHERE name = 'WHEEL SPACER'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'AC-ADAL-05');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'AC-ADAL-06', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'AC-ADAL-06');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-AT-005', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-AT-005');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-AT-006', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-AT-006');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-AT-007', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-AT-007');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-AT-008', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-AT-008');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-AT-009', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-AT-009');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-AT-010', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-AT-010');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-AT-011', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-AT-011');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-AT-012', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-AT-012');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-AT-013', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-AT-013');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'AC-ADAL-07', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'AC-ADAL-07');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'RGD-PRO-SKDPLT-001', 'SKID PLATE TOYOTA HILUX VIGO, REVO, GRS, FORTUNER W/ ARMOR STICKER EMBLEM', 'TOYOTA HILUX VIGO, REVO, GRS, FORTUNER W/ ARMOR STICKER EMBLEM',
       (SELECT id FROM brands WHERE name = 'RUGGED PRO'),
       (SELECT id FROM categories WHERE name = 'SKID PLATE'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GREY"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'RGD-PRO-SKDPLT-001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'AC-ELAIN 0000', 'PANHARD NAVARA NP300 2015+', 'NAVARA NP300 2015+',
       (SELECT id FROM brands WHERE name = 'ELAINE'),
       (SELECT id FROM categories WHERE name = 'PANHARD'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'AC-ELAIN 0000');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TRX', 'STABLINK HILUX VIGO, REVO, FORTUNER, DMAX, MUX, 2021-2024 FRONT', 'HILUX VIGO, REVO, FORTUNER, DMAX, MUX, 2021-2024 FRONT',
       (SELECT id FROM brands WHERE name = 'TRX'),
       (SELECT id FROM categories WHERE name = 'STABLINK'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TRX');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'M-TIRE-0000', 'TIRES PILOT SPORT 5- 235/40/18', 'PILOT SPORT 5- 235/40/18',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'M-TIRE-0000');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHELIN PCR', 'TIRES PILOT SPORT 4S - 245/30/20', 'PILOT SPORT 4S - 245/30/20',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHELIN PCR');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'M-TIRE-001', 'TIRES LTX TRAIL - 245/70/16', 'LTX TRAIL - 245/70/16',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'M-TIRE-001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'M-TIRE-002', 'TIRES ENERGY XM2 - 195/65/15', 'ENERGY XM2 - 195/65/15',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'M-TIRE-002');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'M-TIRE-003', 'TIRES PRIMACY 5 - 225/55/17', 'PRIMACY 5 - 225/55/17',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'M-TIRE-003');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'M-TIRE-004', 'TIRES AGILIS 3 - 205/70/15', 'AGILIS 3 - 205/70/15',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'M-TIRE-004');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'M-TIRE-005', 'TIRES AGILIS 3 - 225/70/15c', 'AGILIS 3 - 225/70/15c',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'M-TIRE-005');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'M-TIRE-006', 'TIRES PRIMACY 5 - 195/55/16', 'PRIMACY 5 - 195/55/16',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'M-TIRE-006');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'M-TIRE-007', 'TIRES PRIMACY 5 - 205/50/17', 'PRIMACY 5 - 205/50/17',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'M-TIRE-007');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'M-TIRE-008', 'TIRES PRIMACY 4 ST - 235/60/16', 'PRIMACY 4 ST - 235/60/16',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'M-TIRE-008');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'M-TIRE-009', 'TIRES ENERGY XM2+ - 205/55/16', 'ENERGY XM2+ - 205/55/16',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'M-TIRE-009');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'M-TIRE-010', 'TIRES PRIMACY 5 - 225/45/18', 'PRIMACY 5 - 225/45/18',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'M-TIRE-010');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'M-TIRE-011', 'TIRES PILOT SPORT 5 - 235/45/19', 'PILOT SPORT 5 - 235/45/19',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'M-TIRE-011');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHE-0001', 'TIRES PILOT SPORT 5 -245/45/19', 'PILOT SPORT 5 -245/45/19',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHE-0001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PRO-UCA-014', 'UCA TOYATA HILUX CHAMP/ TAMRAW', 'TOYATA HILUX CHAMP/ TAMRAW',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'UCA'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"RED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRO-UCA-014');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MECHILIN', 'TIRES PILOT SPORT 4S - 245/35/19', 'PILOT SPORT 4S - 245/35/19',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MECHILIN');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TE37-001', 'MAGS TE37, 18X9 ,6X139 , ET0', 'TE37, 18X9 ,6X139 , ET0',
       (SELECT id FROM brands WHERE name = 'RAYS ORIG'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MM"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TE37-001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TE37-002', 'MAGS TE37, 18X8, 6X139, ET+20', 'TE37, 18X8, 6X139, ET+20',
       (SELECT id FROM brands WHERE name = 'RAYS ORIG'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TE37-002');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TE37-003', 'MAGS M-SPEC TE37 18X8, 6X139, ET+20', 'M-SPEC TE37 18X8, 6X139, ET+20',
       (SELECT id FROM brands WHERE name = 'RAYS ORIG'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"BRONZE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TE37-003');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TE37-004', 'MAGS M-SPEC TE37 18X9, 6X139 , ET0', 'M-SPEC TE37 18X9, 6X139 , ET0',
       (SELECT id FROM brands WHERE name = 'RAYS ORIG'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"BRONZE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TE37-004');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TE37-005', 'MAGS TE37 18X8, 6X139, ET+20', 'TE37 18X8, 6X139, ET+20',
       (SELECT id FROM brands WHERE name = 'RAYS ORIG'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MM"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TE37-005');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TE37-006', 'MAGS TE37 18X8, 6X139, ET 0', 'TE37 18X8, 6X139, ET 0',
       (SELECT id FROM brands WHERE name = 'RAYS ORIG'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"BL"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TE37-006');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TE37-007', 'MAGS GL 57DR-X 18X8 6X139 ET20', 'GL 57DR-X 18X8 6X139 ET20',
       (SELECT id FROM brands WHERE name = 'RAYS ORIG'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"Z2"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TE37-007');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TE37-008', 'MAGS GL 57DRX 17X8, 6X139 ET-0', 'GL 57DRX 17X8, 6X139 ET-0',
       (SELECT id FROM brands WHERE name = 'RAYS ORIG'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"Z2"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TE37-008');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TE37-009', 'MAGS VR TE37 ULTRA M-SPEC 20X9, 5X114, ET+0', 'VR TE37 ULTRA M-SPEC 20X9, 5X114, ET+0',
       (SELECT id FROM brands WHERE name = 'RAYS ORIG'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"BK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TE37-009');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TE37-010', 'MAGS 18X9, 6X139, ET0', '18X9, 6X139, ET0',
       (SELECT id FROM brands WHERE name = 'RAYS ORIG'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GM"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TE37-010');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TE37-011', 'MAGS 18X9, 6X139, ET0', '18X9, 6X139, ET0',
       (SELECT id FROM brands WHERE name = 'RAYS ORIG'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"DS"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TE37-011');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TE37-012', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TE37-012');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TE37-013', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TE37-013');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TE37-014', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TE37-014');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TE37-015', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TE37-015');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TE37-016', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TE37-016');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TE37-017', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TE37-017');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TE37-018', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TE37-018');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TE37-019', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TE37-019');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TE37-020', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TE37-020');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TE37-021', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TE37-021');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MST-SIV', 'MAGS 16X6, 5X139', '16X6, 5X139',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"AHG"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MST-SIV');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MST-S1V', 'MAGS 20X9, 5X150', '20X9, 5X150',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"AHG"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MST-S1V');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'CG-TG2', 'MAGS 17X8, 6X139', '17X8, 6X139',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"AHGRC"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'CG-TG2');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'CG-TG3', 'MAGS 17X8, 6X139', '17X8, 6X139',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MBL"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'CG-TG3');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'EMT-KWM', 'MAGS 18X8, 5X144', '18X8, 5X144',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MBL"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'EMT-KWM');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'W-MOTION-RS11', 'MAGS 17X7.5, 4X100', '17X7.5, 4X100',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'W-MOTION-RS11');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'M1HC-8247', 'MAGS 18X8,  6X139', '18X8,  6X139',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"HGMRC"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'M1HC-8247');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'EMT-T7R', 'MAGS 18X8, 5X114', '18X8, 5X114',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GTS"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'EMT-T7R');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'EMTZR10', 'MAGS 18X8, 5X114', '18X8, 5X114',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MEB"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'EMTZR10');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'WRK-WHLS-OO1', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'WRK-WHLS-OO1');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'WRK-WHLS-002', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'WRK-WHLS-002');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'WRK-WHLS-003', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'WRK-WHLS-003');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'WRK-WHLS-004', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'WRK-WHLS-004');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'WRK-WHLS-005', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'WRK-WHLS-005');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'WRK-WHLS-006', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'WRK-WHLS-006');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'WRK-WHLS-007', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'WRK-WHLS-007');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'WRK-WHLS-008', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'WRK-WHLS-008');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'WRK-WHLS-009', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'WRK-WHLS-009');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'WRK-WHLS-010', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'WRK-WHLS-010');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'WRK-WHLS-011', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'WRK-WHLS-011');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'WRK-WHLS-012', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'WRK-WHLS-012');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'WRK-WHLS-013', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'WRK-WHLS-013');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'WRK-WHLS-014', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'WRK-WHLS-014');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'WRK-WHLS-015', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'WRK-WHLS-015');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'WRK-WHLS-016', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'WRK-WHLS-016');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'WRK-WHLS-017', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'WRK-WHLS-017');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'XT-1785-001', 'MAGS XT-1785 17X9, 6X139,', 'XT-1785 17X9, 6X139,',
       (SELECT id FROM brands WHERE name = 'TRX'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'XT-1785-001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'XT-1785-002', 'MAGS XT-1785 17X9, 6X139,', 'XT-1785 17X9, 6X139,',
       (SELECT id FROM brands WHERE name = 'TRX'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'XT-1785-002');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'XT-1785-003', 'MAGS XT-1785 17X9, 6X139,', 'XT-1785 17X9, 6X139,',
       (SELECT id FROM brands WHERE name = 'TRX'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BRONZE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'XT-1785-003');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VR-ZE40X-004', 'MAGS VR-ZE40X 17X8.5, 6X139', 'VR-ZE40X 17X8.5, 6X139',
       (SELECT id FROM brands WHERE name = 'TRX'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS DM (MM)"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VR-ZE40X-004');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VR-ZE40X-005', 'MAGS VR-ZE40X 17X8.5, 6X139', 'VR-ZE40X 17X8.5, 6X139',
       (SELECT id FROM brands WHERE name = 'TRX'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BRONZE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VR-ZE40X-005');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VR-ZE40X-006', 'MAGS VR-ZE40X 17X8.5, 6X139', 'VR-ZE40X 17X8.5, 6X139',
       (SELECT id FROM brands WHERE name = 'TRX'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS PG W/O MACHINED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VR-ZE40X-006');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'XT1785-007', 'MAGS XT1785 17X8.5, 6X139', 'XT1785 17X8.5, 6X139',
       (SELECT id FROM brands WHERE name = 'TRX'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GUNMETAL MACHINE (PRESS G)"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'XT1785-007');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'LR1890', 'MAGS LR1890 18X9, 6X114', 'LR1890 18X9, 6X114',
       (SELECT id FROM brands WHERE name = 'TRX'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS DM (MM)"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'LR1890');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'JCW272', 'MAGS JCW272 18X9, 6X139', 'JCW272 18X9, 6X139',
       (SELECT id FROM brands WHERE name = 'TRX'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'JCW272');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-4X4-1', 'H-MATTING FORD RANGER/ D-MAX/ BT50/ HILUX/ TRITON', 'FORD RANGER/ D-MAX/ BT50/ HILUX/ TRITON',
       (SELECT id FROM brands WHERE name = 'HAMER'),
       (SELECT id FROM categories WHERE name = 'H-MATTING'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-4X4-1');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-4X4-2', 'H-MATTING FORD RANGER RAPTOR N.GEN', 'FORD RANGER RAPTOR N.GEN',
       (SELECT id FROM brands WHERE name = 'HAMER'),
       (SELECT id FROM categories WHERE name = 'H-MATTING'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-4X4-2');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-4X4-3', 'H-MATTING NISSAN NAVARA , NP300', 'NISSAN NAVARA , NP300',
       (SELECT id FROM brands WHERE name = 'HAMER'),
       (SELECT id FROM categories WHERE name = 'H-MATTING'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-4X4-3');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-4X4-00', 'DIVIDER FORD RANGER, RAPTOR N. GEN 22-25', 'FORD RANGER, RAPTOR N. GEN 22-25',
       (SELECT id FROM brands WHERE name = 'HAMER'),
       (SELECT id FROM categories WHERE name = 'DIVIDER'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-4X4-00');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PROFENER-1-01-1', 'UCA TOYOTA HILUX CHAMP', 'TOYOTA HILUX CHAMP',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'UCA'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"RED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PROFENER-1-01-1');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PRO-SRAB.- 1001', 'STABILIZER TOYOTA HILUX GRS, VIGO, REVO, FORTUNER, DMAX', 'TOYOTA HILUX GRS, VIGO, REVO, FORTUNER, DMAX',
       (SELECT id FROM brands WHERE name = 'PROFENDER'),
       (SELECT id FROM categories WHERE name = 'STABILIZER'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets","color":"BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRO-SRAB.- 1001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'JAOS-101', 'SKID PLATE TOYOTA HILUX REVO, FORTUNER', 'TOYOTA HILUX REVO, FORTUNER',
       (SELECT id FROM brands WHERE name = 'JAOS'),
       (SELECT id FROM categories WHERE name = 'SKID PLATE'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"SILVER"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'JAOS-101');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'arivo-new', 'TIRES PREMIO SPORT 6 - 205/45/17', 'PREMIO SPORT 6 - 205/45/17',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'arivo-new');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIVO31/10', 'TIRES ROCK TRACK R/T - 265/70/17', 'ROCK TRACK R/T - 265/70/17',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIVO31/10');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIVO31/10/15', 'TIRES ROCK TRAK R/T - 31/10.5/15', 'ROCK TRAK R/T - 31/10.5/15',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIVO31/10/15');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIVO-10101', 'TIRES PREMIO SPORT 6 - 245/35/20', 'PREMIO SPORT 6 - 245/35/20',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIVO-10101');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLFS47B-001', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLFS47B-001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLFS47B-002', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLFS47B-002');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLFS47B-003', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLFS47B-003');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLFS47B-004', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLFS47B-004');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLFS47B-005', 'MAGS 17X9 , 6X139  ET-10', '17X9 , 6X139  ET-10',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BRONZE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLFS47B-005');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLFS47B-006', 'MAGS 17X9 , 6X139 ET-10', '17X9 , 6X139 ET-10',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"RED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLFS47B-006');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLFS47B-007', 'MAGS 17X9 , 6X139 ET-10', '17X9 , 6X139 ET-10',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS WHITE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLFS47B-007');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLFS47B-008', 'MAGS 17X9 , 6X139 ET-10', '17X9 , 6X139 ET-10',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"SILVER MACHINED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLFS47B-008');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLFS47B-009', 'MAGS 17X9 , 6X139 ET-10', '17X9 , 6X139 ET-10',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GUNMETAL MACHINED PG"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLFS47B-009');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLFS47B-010', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLFS47B-010');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-001', 'FLAT RACK TOYOTA HILUX REVO', 'TOYOTA HILUX REVO',
       (SELECT id FROM brands WHERE name = 'HAMER'),
       (SELECT id FROM categories WHERE name = 'FLAT RACK'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-002', 'POWER STEP BOARD FORD EVEREST 2022+', 'FORD EVEREST 2022+',
       (SELECT id FROM brands WHERE name = 'HAMER'),
       (SELECT id FROM categories WHERE name = 'POWER STEP BOARD'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-002');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-003', 'POWER STEP BOARD FORD RANGER 2022+ (LED)', 'FORD RANGER 2022+ (LED)',
       (SELECT id FROM brands WHERE name = 'HAMER'),
       (SELECT id FROM categories WHERE name = 'POWER STEP BOARD'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-003');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-004', 'POWER STEP BOARD NISSAN NAVARA/NP300 2021+', 'NISSAN NAVARA/NP300 2021+',
       (SELECT id FROM brands WHERE name = 'HAMER'),
       (SELECT id FROM categories WHERE name = 'POWER STEP BOARD'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-004');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-005', 'POWER STEP BOARD TOYOTA HILUX REVO, ROCCO, GRS', 'TOYOTA HILUX REVO, ROCCO, GRS',
       (SELECT id FROM brands WHERE name = 'HAMER'),
       (SELECT id FROM categories WHERE name = 'POWER STEP BOARD'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-005');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-006', 'GENERAL SHADOW SEERIES - FORD RANGER 2022+', 'SHADOW SEERIES - FORD RANGER 2022+',
       (SELECT id FROM brands WHERE name = 'HAMER'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-006');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-007', 'ROLLER LID TOYOTA HILUX REVO W/O SPORT BAR', 'TOYOTA HILUX REVO W/O SPORT BAR',
       (SELECT id FROM brands WHERE name = 'HAMER'),
       (SELECT id FROM categories WHERE name = 'ROLLER LID'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-007');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-008', 'ROLLER LID ISUZU DMAX/ COLORADO, BT50 2012-2022', 'ISUZU DMAX/ COLORADO, BT50 2012-2022',
       (SELECT id FROM brands WHERE name = 'HAMER'),
       (SELECT id FROM categories WHERE name = 'ROLLER LID'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-008');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-009', 'ROLLER LID FORD RANGER XLT, RANGER RAPTOR 2022+', 'FORD RANGER XLT, RANGER RAPTOR 2022+',
       (SELECT id FROM brands WHERE name = 'HAMER'),
       (SELECT id FROM categories WHERE name = 'ROLLER LID'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-009');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-010', 'FRONT BUMPER KING SERIES - BYD SHARK', 'KING SERIES - BYD SHARK',
       (SELECT id FROM brands WHERE name = 'HAMER'),
       (SELECT id FROM categories WHERE name = 'FRONT BUMPER'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-010');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-011', 'FRONT BUMPER KING SERIES - FORD RANGER 2022+ NO FENDER', 'KING SERIES - FORD RANGER 2022+ NO FENDER',
       (SELECT id FROM brands WHERE name = 'HAMER'),
       (SELECT id FROM categories WHERE name = 'FRONT BUMPER'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-011');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-012', 'FRONT BUMPER KING SERIES - FORD RANGER N. GEN 2022+', 'KING SERIES - FORD RANGER N. GEN 2022+',
       (SELECT id FROM brands WHERE name = 'HAMER'),
       (SELECT id FROM categories WHERE name = 'FRONT BUMPER'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-012');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-013', 'FRONT BUMPER KING SERIES -TOYOTA HILUX REVO 2020+', 'KING SERIES -TOYOTA HILUX REVO 2020+',
       (SELECT id FROM brands WHERE name = 'HAMER'),
       (SELECT id FROM categories WHERE name = 'FRONT BUMPER'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-013');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-014', 'FRONT BUMPER ATLAST SERIES - FORD RANGER RAPTOR N GEN 2022+', 'ATLAST SERIES - FORD RANGER RAPTOR N GEN 2022+',
       (SELECT id FROM brands WHERE name = 'HAMER'),
       (SELECT id FROM categories WHERE name = 'FRONT BUMPER'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-014');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-015', 'FRONT BUMPER GUARDIAN SERIES - FORD RANGER RAPTOR N.GEN 2022+', 'GUARDIAN SERIES - FORD RANGER RAPTOR N.GEN 2022+',
       (SELECT id FROM brands WHERE name = 'HAMER'),
       (SELECT id FROM categories WHERE name = 'FRONT BUMPER'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-015');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-016', 'REAR BUMPER NOVA SERIES - FORD RANGER N.GEN 2022+', 'NOVA SERIES - FORD RANGER N.GEN 2022+',
       (SELECT id FROM brands WHERE name = 'HAMER'),
       (SELECT id FROM categories WHERE name = 'REAR BUMPER'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-016');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-017', 'TOW HITCH TOW HITCH W/ TOW BALL - FORD EVEREST N. GEN', 'TOW HITCH W/ TOW BALL - FORD EVEREST N. GEN',
       (SELECT id FROM brands WHERE name = 'HAMER'),
       (SELECT id FROM categories WHERE name = 'TOW HITCH'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-017');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-018', 'TOW HITCH TOW HITCH W/ TOW BALL HILUX REVO 15-19ON', 'TOW HITCH W/ TOW BALL HILUX REVO 15-19ON',
       (SELECT id FROM brands WHERE name = 'HAMER'),
       (SELECT id FROM categories WHERE name = 'TOW HITCH'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-018');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-019', 'MATTING TRITON', 'TRITON',
       (SELECT id FROM brands WHERE name = 'HAMER'),
       (SELECT id FROM categories WHERE name = 'MATTING'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-019');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-020', 'MATTING D-MAX', 'D-MAX',
       (SELECT id FROM brands WHERE name = 'HAMER'),
       (SELECT id FROM categories WHERE name = 'MATTING'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-020');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-021', 'MATTING X-PANDER', 'X-PANDER',
       (SELECT id FROM brands WHERE name = 'HAMER'),
       (SELECT id FROM categories WHERE name = 'MATTING'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-021');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-022', 'MATTING INNOVA', 'INNOVA',
       (SELECT id FROM brands WHERE name = 'HAMER'),
       (SELECT id FROM categories WHERE name = 'MATTING'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-022');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-023', 'MATTING HONDA CIVIC', 'HONDA CIVIC',
       (SELECT id FROM brands WHERE name = 'HAMER'),
       (SELECT id FROM categories WHERE name = 'MATTING'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-023');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-025', 'MATTING FORTUNER', 'FORTUNER',
       (SELECT id FROM brands WHERE name = 'HAMER'),
       (SELECT id FROM categories WHERE name = 'MATTING'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-025');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-026', 'MATTING MU-X', 'MU-X',
       (SELECT id FROM brands WHERE name = 'HAMER'),
       (SELECT id FROM categories WHERE name = 'MATTING'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-026');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-027', 'LED LIGHT DRIVING LIGHT & COVER LIGHT', 'DRIVING LIGHT & COVER LIGHT',
       (SELECT id FROM brands WHERE name = 'HAMER'),
       (SELECT id FROM categories WHERE name = 'LED LIGHT'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-027');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-028', 'LED LIGHT RUBY SPOT LIGHT 4"', 'RUBY SPOT LIGHT 4"',
       (SELECT id FROM brands WHERE name = 'HAMER'),
       (SELECT id FROM categories WHERE name = 'LED LIGHT'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-028');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-029', 'NUDGE BAR STORM NUDGE BAR TOYOTA HILUX REVO, FORTUNER, 2015-19ON', 'STORM NUDGE BAR TOYOTA HILUX REVO, FORTUNER, 2015-19ON',
       (SELECT id FROM brands WHERE name = 'HAMER'),
       (SELECT id FROM categories WHERE name = 'NUDGE BAR'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-029');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-030', 'FLAT RACK ALUMINUM FLAT RACK FORD RANGER RAPTOR 15-2023', 'ALUMINUM FLAT RACK FORD RANGER RAPTOR 15-2023',
       (SELECT id FROM brands WHERE name = 'HAMER'),
       (SELECT id FROM categories WHERE name = 'FLAT RACK'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-030');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-031', 'RUBY LIGHT 4 inc. SPOT LIGHT', '4 inc. SPOT LIGHT',
       (SELECT id FROM brands WHERE name = 'HAMER'),
       (SELECT id FROM categories WHERE name = 'RUBY LIGHT'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-031');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-032', 'FRONT BUMPER ATLAS SERIES FORD RANGER/ EVEREST 2023-2023', 'ATLAS SERIES FORD RANGER/ EVEREST 2023-2023',
       (SELECT id FROM brands WHERE name = 'HAMER'),
       (SELECT id FROM categories WHERE name = 'FRONT BUMPER'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-032');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-033', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-033');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-034', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-034');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-035', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-035');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-036', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-036');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-037', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-037');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-038', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-038');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-039', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-039');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HAMER-040', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HAMER-040');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLF-S47C-001', 'MAGS 17X9 , 6X114 ,  ETO', '17X9 , 6X114 ,  ETO',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLF-S47C-001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLF-S47C-002', 'MAGS 17X9 , 6X114 ,  ETO', '17X9 , 6X114 ,  ETO',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BRONZE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLF-S47C-002');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLF-S47C-003', 'MAGS 17X9 , 6X114 ,  ETO', '17X9 , 6X114 ,  ETO',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS DM (MM)"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLF-S47C-003');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLF-S47C-004', 'MAGS 17X9 , 6X114 ,  ETO', '17X9 , 6X114 ,  ETO',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GUNMETAL MACHINED (PG)"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLF-S47C-004');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLF-S49-010', 'MAGS 17X9, 6X139 ET20', '17X9, 6X139 ET20',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"color":"GLOSS DM (MM)"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLF-S49-010');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLF-S49-011', 'MAGS 17X9, 6X139 ET0', '17X9, 6X139 ET0',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"color":"MG BLUE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLF-S49-011');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLF-S16-013', 'MAGS 17X9, 6X139, ET-10', '17X9, 6X139, ET-10',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"color":"MG BLUE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLF-S16-013');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLDF07-014', 'MAGS 17X9, 6X139 ET-25', '17X9, 6X139 ET-25',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"color":"MATTE BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLDF07-014');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLDF07-015', 'MAGS 17X9, 6X139 ET-25', '17X9, 6X139 ET-25',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"color":"SILVER MACHINED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLDF07-015');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLDF-12-016', 'MAGS 17X9, 6X139 ET-10', '17X9, 6X139 ET-10',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"color":"MG BLUE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLDF-12-016');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLDF-12-017', 'MAGS 17X9, 6X139 ET-10', '17X9, 6X139 ET-10',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"color":"GLOSS BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLDF-12-017');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLFS53-018', 'MAGS 17X9, 6X139 ET-10', '17X9, 6X139 ET-10',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"color":"SILVER MACHINED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLFS53-018');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLFS58-019', 'MAGS 17X9, 6X139 ET-10', '17X9, 6X139 ET-10',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"color":"MATTE BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLFS58-019');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLFS10-020', 'MAGS 17X9, 6X139 ET-10', '17X9, 6X139 ET-10',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"color":"MATTE GM (G1)"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLFS10-020');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TCFSO1-021', 'MAGS 17X9, 6X139 ET0', '17X9, 6X139 ET0',
       (SELECT id FROM brands WHERE name = 'TCF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"color":"MATTE BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TCFSO1-021');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TCFSO3-022', 'MAGS 17X9, 6X139 ET0', '17X9, 6X139 ET0',
       (SELECT id FROM brands WHERE name = 'TCF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"color":"GLOSS DM (MM)"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TCFSO3-022');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TCFSO3-023', 'MAGS 17X9, 6X139 ET0', '17X9, 6X139 ET0',
       (SELECT id FROM brands WHERE name = 'TCF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"color":"SILVER MACHINED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TCFSO3-023');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TCFS05-024', 'MAGS 17X9, 6X139 ET-10', '17X9, 6X139 ET-10',
       (SELECT id FROM brands WHERE name = 'TCF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"color":"MATTE BRONZE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TCFS05-024');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLF-S47-012', 'MAGS 18X9, 6X139 ET-10', '18X9, 6X139 ET-10',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"color":"GLOSS DM (MM)"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLF-S47-012');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLFS35-025', 'MAGS 18X9, 6X114 ET22', '18X9, 6X114 ET22',
       (SELECT id FROM brands WHERE name = 'TCF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS DM (MM)"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLFS35-025');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLFS12-026', 'MAGS 18X9, 6X139 ET10', '18X9, 6X139 ET10',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"color":"GLOSS DM (MM)"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLFS12-026');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLDF07-028', 'MAGS 18X9, 6X139 ET-15', '18X9, 6X139 ET-15',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"color":"MATTE BRONZE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLDF07-028');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TCFS02-029', 'MAGS 18X9, 6X139 ET0', '18X9, 6X139 ET0',
       (SELECT id FROM brands WHERE name = 'TCF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"color":"PG W/O MACHINED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TCFS02-029');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLFS47B-05', 'MAGS 17X9 , 6X139 ET-10', '17X9 , 6X139 ET-10',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BRONZE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLFS47B-05');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLFS47B-06', 'MAGS 17X9 , 6X139 ET-10', '17X9 , 6X139 ET-10',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"RED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLFS47B-06');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLFS47B-07', 'MAGS 17X9 , 6X139 ET-10', '17X9 , 6X139 ET-10',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS WHITE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLFS47B-07');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLFS47B-08', 'MAGS 17X9 , 6X139 ET-10', '17X9 , 6X139 ET-10',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"SILVER MACHINED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLFS47B-08');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLFS47B-09', 'MAGS 17X9 , 6X139 ET-10', '17X9 , 6X139 ET-10',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GUNMETAL MACHINED (PG)"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLFS47B-09');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLFS58-0001', 'MAGS 17X9 , 6X139 ET-10', '17X9 , 6X139 ET-10',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GUNMETAL MACHINED (PG)"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLFS58-0001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLFS16-010', 'MAGS 17X9 , 6X139 ET-10', '17X9 , 6X139 ET-10',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MAG BLUE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLFS16-010');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLFS49-011', 'MAGS 17X9 , 6X139 ET20', '17X9 , 6X139 ET20',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS DM (MM)"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLFS49-011');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLFS49-012', 'MAGS 17X9 , 6X139 ET0', '17X9 , 6X139 ET0',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MG BLUE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLFS49-012');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLFS10-013', 'MAGS 17X9 , 6X139 ET-10', '17X9 , 6X139 ET-10',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE GM (G1)"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLFS10-013');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLFS53-014', 'MAGS 17X9 , 6X139 ET-10', '17X9 , 6X139 ET-10',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"SILVER MACHINED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLFS53-014');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLFS58-015', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLFS58-015');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLFS58-000', 'MAGS 17X9 , 6X139 ET-10', '17X9 , 6X139 ET-10',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BRONZE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLFS58-000');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLDF07-016', 'MAGS 17X9 , 6X139 ET-25', '17X9 , 6X139 ET-25',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLDF07-016');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLDF07-017', 'MAGS 17X9 , 6X139 ET-25', '17X9 , 6X139 ET-25',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"SILVER MACHINED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLDF07-017');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLDF07-000', 'MAGS 17X9 , 6X139 ET-25', '17X9 , 6X139 ET-25',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GUNMETAL MACHINED (PG)"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLDF07-000');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLDF12-018', 'MAGS 17X9 , 6X139 ET-10', '17X9 , 6X139 ET-10',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MG BLUE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLDF12-018');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLDF12-019', 'MAGS 17X9 , 6X139 ET-10', '17X9 , 6X139 ET-10',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLDF12-019');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TCFSO1-020', 'MAGS 17X9 , 6X139 ET0', '17X9 , 6X139 ET0',
       (SELECT id FROM brands WHERE name = 'TCF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TCFSO1-020');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TCFSO3-021', 'MAGS 17X9 , 6X139 ET0', '17X9 , 6X139 ET0',
       (SELECT id FROM brands WHERE name = 'TCF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS DM (MM)"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TCFSO3-021');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TCFS03-022', 'MAGS 17X9 , 6X139 ET0', '17X9 , 6X139 ET0',
       (SELECT id FROM brands WHERE name = 'TCF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"SILVER MACHINE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TCFS03-022');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TCFS05-023', 'MAGS 17X9 , 6X139 ET-10', '17X9 , 6X139 ET-10',
       (SELECT id FROM brands WHERE name = 'TCF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BRONZE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TCFS05-023');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLFS47-024', 'MAGS 18X8, 6X139 ET-10', '18X8, 6X139 ET-10',
       (SELECT id FROM brands WHERE name = 'TCF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS DM (MM)"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLFS47-024');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLFS35-0026', 'MAGS 18X9, 6X114 ET22', '18X9, 6X114 ET22',
       (SELECT id FROM brands WHERE name = 'TCF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLFS35-0026');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLDF12-026', 'MAGS 18X9, 6X139, ET-10', '18X9, 6X139, ET-10',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS DM (MM)"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLDF12-026');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLDF07-027', 'MAGS 18X9, 6X139, ET15', '18X9, 6X139, ET15',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BRONZE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLDF07-027');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TCFS02-028', 'MAGS 18X9, 6X139, ET0', '18X9, 6X139, ET0',
       (SELECT id FROM brands WHERE name = 'TCF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"PG W/O MACHINED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TCFS02-028');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLF-ULFS10-101', 'MAGS 17X9 , 6X139 ET-10', '17X9 , 6X139 ET-10',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE GM (G1)"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLF-ULFS10-101');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLFS58-029', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLFS58-029');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLFS58-030', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLFS58-030');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLDF12-031', 'MAGS 17X9, 6X139, ET-10', '17X9, 6X139, ET-10',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BRONZE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLDF12-031');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLFS47B-032', 'MAGS 17X9 , 6X139 ET-10', '17X9 , 6X139 ET-10',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLFS47B-032');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLFS58-033', 'MAGS 18X9 , 6X139 ET-10', '18X9 , 6X139 ET-10',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"SILVER MACHINED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLFS58-033');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLFS49-034', 'MAGS 17X9 , 6X139 ET-10', '17X9 , 6X139 ET-10',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS DM (MM)"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLFS49-034');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TCF-SO1-035', 'MAGS 17X9 , 6X139 ET0', '17X9 , 6X139 ET0',
       (SELECT id FROM brands WHERE name = 'TCF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS GUNMETAL (PG)"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TCF-SO1-035');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'CORE - FC894-001', 'MAGS 17X9, 6X139, ET -10', '17X9, 6X139, ET -10',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BRONZE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'CORE - FC894-001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'COVERT-D695-002', 'MAGS 17X9, 6X139, ET1', '17X9, 6X139, ET1',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"CANDY RED W/ BLACK RING"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'COVERT-D695-002');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'COVERT- D716-003', 'MAGS 17X9, 6X139, ET1', '17X9, 6X139, ET1',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"ANTHRACITE W/ BALCK LIP"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'COVERT- D716-003');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VAPOR-D569-004', 'MAGS 17X9, 6X139, ET1', '17X9, 6X139, ET1',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BLACK MACHINED (DDT)"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VAPOR-D569-004');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VAPOR-D560-005', 'MAGS 17X9, 6X139, ET1', '17X9, 6X139, ET1',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VAPOR-D560-005');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'REBEL-D679-006', 'MAGS 17X9, 6X139, ET1', '17X9, 6X139, ET1',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'REBEL-D679-006');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'REBEL-D681-007', 'MAGS 17X9, 6X139, ET1', '17X9, 6X139, ET1',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"BRONZE W/ BLACK LIP"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'REBEL-D681-007');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'F.TRES-FC884-008', 'MAGS 17X9, 6X139, ET0', '17X9, 6X139, ET0',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BLACK W/ GLOSS BLACK LIP"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'F.TRES-FC884-008');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'F.TRES-FC884-009', 'MAGS 17X9, 6X139,ET0', '17X9, 6X139,ET0',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS SILVER W/ MCHINED FACE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'F.TRES-FC884-009');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PISTON-FC886-010', 'MAGS 17X9, 6X139, ET1', '17X9, 6X139, ET1',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BRONZE W/ GLOSS BLACK LIP"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PISTON-FC886-010');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'REBAR-D849-011', 'MAGS 17X9, 6X139, ET1', '17X9, 6X139, ET1',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS BLACK MILLED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'REBAR-D849-011');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VAPOR-D560 -012', 'MAGS 17X9, 6X139, ET18', '17X9, 6X139, ET18',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VAPOR-D560 -012');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BLITZ-D674-013', 'MAGS 17X9, 6X139,ET1', '17X9, 6X139,ET1',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BLACK MACHINED DDT"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BLITZ-D674-013');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'CORE-FC894-014', 'MAGS 17X9, 6X138, ET-10', '17X9, 6X138, ET-10',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"HYPER SILVER W/ MACHINED FACE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'CORE-FC894-014');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'SPLICER-FC903-015', 'MAGS 17X9, 6X139, ET1', '17X9, 6X139, ET1',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"BLACKOUT"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'SPLICER-FC903-015');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'SPLICER-FC903-016', 'MAGS 17X9 ,6X139, ET1', '17X9 ,6X139, ET1',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"BURNT BRONZE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'SPLICER-FC903-016');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'CATALYST-FC402AP-017', 'MAGS 17X9,6X139 ET1', '17X9,6X139 ET1',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"PLATINUM W/ CHROME LIP"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'CATALYST-FC402AP-017');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'CATALYST-FC402MX-018', 'MAGS 17X9 6X139 ET1', '17X9 6X139 ET1',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BLACK W/ GLOSS BLACK LIP"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'CATALYST-FC402MX-018');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'CATALYST-FC402MZ-019', 'MAGS 17X9, 6X139 ,ET1', '17X9, 6X139 ,ET1',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BLACK W/ BRONZE LIP"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'CATALYST-FC402MZ-019');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'CATALYST-FC402AP-020', 'MAGS 20X9, 6X139, ET1', '20X9, 6X139, ET1',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"PLATINUM W/ CHROME LIP"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'CATALYST-FC402AP-020');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BURN-FC403P8-021', 'MAGS 20X9, 6X139, ET1', '20X9, 6X139, ET1',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"CHROME W/ GLOSS BLACK LIP"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BURN-FC403P8-021');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TANTRUM-FC895-022', 'MAGS 20X9, 6X139, ET1', '20X9, 6X139, ET1',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS BLACK MILLED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TANTRUM-FC895-022');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VAPOR-D569-023', 'MAGS 20X9, 6X139, ET1', '20X9, 6X139, ET1',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BLACK MACHINED DDT"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VAPOR-D569-023');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HALO-FC906-24', 'MAGS 20X9, 6X139, ET1', '20X9, 6X139, ET1',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HALO-FC906-24');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HEIST-FC907-025', 'MAGS 20X9, 6X139, ET1', '20X9, 6X139, ET1',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HEIST-FC907-025');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'DYNAMO-FC405-026', 'MAGS 20X9, 6X139, ET1', '20X9, 6X139, ET1',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS SILVER W/ CHROME LIP, BRUSH FACE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'DYNAMO-FC405-026');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'DYNAMO-FC405-027', 'MAGS 20X9, 6X139, ET1', '20X9, 6X139, ET1',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BLACK W/ GLOSS BLACK LIP"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'DYNAMO-FC405-027');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'FLIGHT-FC408AP-028', 'MAGS 20X9, 6X139, ET1', '20X9, 6X139, ET1',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS GUNMETAL W/ CHROME LIP"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'FLIGHT-FC408AP-028');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'FLIGHT-FC408PB-029', 'MAGS 20X9, 6X139, ET1', '20X9, 6X139, ET1',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"CHROME PLATED W/ GLOSS BLACK LIP"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'FLIGHT-FC408PB-029');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HIVE-FC409-030', 'MAGS 20X9, 6X139, ET 1', '20X9, 6X139, ET 1',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS BLACK MILLED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HIVE-FC409-030');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HIVE-FC409-031', 'MAGS 20X9, 6X139, ET1', '20X9, 6X139, ET1',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS GUNMETAL W/ CHROME LIP"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HIVE-FC409-031');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'GRIP-FC900-032', 'MAGS 20X9, 6X139, ET1', '20X9, 6X139, ET1',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'GRIP-FC900-032');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BLITS-D674-033', 'MAGS 20X9, 6X139, ET1', '20X9, 6X139, ET1',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BLACK MACHINE DDT"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BLITS-D674-033');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'FLAME-D805-34', 'MAGS 20X9, 6X139, ET1', '20X9, 6X139, ET1',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"PLATINUM BRONZE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'FLAME-D805-34');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'CORE-FC894-35', 'MAGS 17X9, 6X114, ET+25', '17X9, 6X114, ET+25',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"HYPER SILVER W/ MACHINE FACE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'CORE-FC894-35');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VAPOR-D560-36', 'MAGS 17X9, 6X114, ET1', '17X9, 6X114, ET1',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VAPOR-D560-36');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MST-S1V-001', 'MAGS 16X6, 5X139, ET5', '16X6, 5X139, ET5',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MBL"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MST-S1V-001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MST-S1V-002', 'MAGS 16X6, 5X139, ET-5', '16X6, 5X139, ET-5',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"AHG"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MST-S1V-002');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'W.MOTION-T5R-003', 'MAGS 17X7, 4X100, ET43', '17X7, 4X100, ET43',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE GRAPHITE (MGK)"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'W.MOTION-T5R-003');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'W.MOTION-T5R-004', 'MAGS 17X7, 4X100, ET43', '17X7, 4X100, ET43',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOW SILVER (GSL)"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'W.MOTION-T5R-004');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'W.MOTION-RS11-05', 'MAGS 17X7, 4X100, ET40', '17X7, 4X100, ET40',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'W.MOTION-RS11-05');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'W.MOTION-RS11-06', 'MAGS 17X7, 4X100 ET+40', '17X7, 4X100 ET+40',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"WHT"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'W.MOTION-RS11-06');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MST-S1V-007', 'MAGS 17X8, 6X139 ET0', '17X8, 6X139 ET0',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MBL"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MST-S1V-007');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MST-S1V-008', 'MAGS 17X8, 6X139, ET0', '17X8, 6X139, ET0',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"AHG"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MST-S1V-008');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MST-S1V-009', 'MAGS 17X8, 6X139, ET20', '17X8, 6X139, ET20',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MBL"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MST-S1V-009');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MST-S1V-010', 'MAGS 17X8, 6X139, ET20', '17X8, 6X139, ET20',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"AHG"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MST-S1V-010');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MST-S1V-011', 'MAGS 17X8, 6X139, ET0', '17X8, 6X139, ET0',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MGM"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MST-S1V-011');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'CG-TG2-012', 'MAGS 17X8, 6X139 ET20', '17X8, 6X139 ET20',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"AHGRC"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'CG-TG2-012');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'CG-TG3-013', 'MAGS 17X8, 6X139, ET20', '17X8, 6X139, ET20',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MBL"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'CG-TG3-013');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'EMT-KWM-014', 'MAGS 17X7, 4X100, ET38', '17X7, 4X100, ET38',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"WHT"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'EMT-KWM-014');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'M1HC-8247-015', 'MAGS 18X8, 6X139, ET25', '18X8, 6X139, ET25',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"HGMRC"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'M1HC-8247-015');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'M1HC-8247-016', 'MAGS 18X8, 6X139, ET35', '18X8, 6X139, ET35',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"HGMRC"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'M1HC-8247-016');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MST-S1V-017', 'MAGS 18X9, 6X139, ET0', '18X9, 6X139, ET0',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MBL"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MST-S1V-017');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MST-S1V-018', 'MAGS 18X8, 6X139, ET20', '18X8, 6X139, ET20',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"AHG"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MST-S1V-018');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MST-S1V-019', 'MAGS 18X8, 6X139, ET20', '18X8, 6X139, ET20',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MBL"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MST-S1V-019');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MST-S1V-020', 'MAGS 18X9, 6X139, ET0', '18X9, 6X139, ET0',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"AHG"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MST-S1V-020');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MST-SIV-021', 'MAGS 18X9, 6X139, ET0', '18X9, 6X139, ET0',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MGM"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MST-SIV-021');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'EMT-T7R-022', 'MAGS 18X8, 5X114, ET38', '18X8, 5X114, ET38',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GTS"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'EMT-T7R-022');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'EMT-ZR10-023', 'MAGS 18X8, 5X114, ET38', '18X8, 5X114, ET38',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"HGLC"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'EMT-ZR10-023');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'EMT-ZR10-024', 'MAGS 18X8, 5X114, ET38', '18X8, 5X114, ET38',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"color":"MEB"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'EMT-ZR10-024');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'EMT-KWM-025', 'MAGS 18X8, 5X114, ET38', '18X8, 5X114, ET38',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"color":"MBL"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'EMT-KWM-025');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MST-SIV-026', 'MAGS 20X9, 6X139 ET0', '20X9, 6X139 ET0',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MBL"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MST-SIV-026');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MST-SIV-027', 'MAGS 20X9, 6X139, ET55', '20X9, 6X139, ET55',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"AHG"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MST-SIV-027');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MST-SIV-028', 'MAGS 20X9, 6X139, ET0', '20X9, 6X139, ET0',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"AHG"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MST-SIV-028');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MST-SIV-029', 'MAGS 20X9, 6X139, ET0', '20X9, 6X139, ET0',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MGM"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MST-SIV-029');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MST-SIV-030', 'MAGS 20X9, 5X150 ET40', '20X9, 5X150 ET40',
       (SELECT id FROM brands WHERE name = 'WORK WHEELS'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"AHG"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MST-SIV-030');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHELIN-PCR', 'TIRES PILOT SPORT 5 - 215/45/17', 'PILOT SPORT 5 - 215/45/17',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHELIN-PCR');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHELINE-PCR', 'TIRES PILOT SPORT 5 -214/45/17', 'PILOT SPORT 5 -214/45/17',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2026.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHELINE-PCR');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARIVO-0001', 'TIRES PREMIO ARZ1 195/65/15', 'PREMIO ARZ1 195/65/15',
       (SELECT id FROM brands WHERE name = 'ARIVO'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARIVO-0001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'FUEL-BRAWL-FC401', 'MAGS 22X10, 8X165, ET-18', '22X10, 8X165, ET-18',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BLACK W/ GLOSS BLACK LIP"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'FUEL-BRAWL-FC401');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BGF-KM3-37', 'TIRES 37/13.5/22', '37/13.5/22',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BGF-KM3-37');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HYPE-FC860-00', 'MAGS 18X9, 6X139, ET-10', '18X9, 6X139, ET-10',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BRONZE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HYPE-FC860-00');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VAPOR-D569-001', 'MAGS 18X9, 6X139, ET+1', '18X9, 6X139, ET+1',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BLACK MACHINED FACE DDT"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VAPOR-D569-001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HYPE-FC860-002', 'MAGS 17X9, 6X139,  5X150, ET10', '17X9, 6X139,  5X150, ET10',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"SILVER/ MACHINED FACE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HYPE-FC860-002');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'CHARGER-FC873', 'MAGS 17X9, 6X139 ,ET1', '17X9, 6X139 ,ET1',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"PLATINUM BRONZE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'CHARGER-FC873');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HYPE-FC860', 'MAGS 17X9, 6X139, ET -10', '17X9, 6X139, ET -10',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BRONZE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HYPE-FC860');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'BFG-KO3-0000', 'TIRES 35/11.5/20', '35/11.5/20',
       (SELECT id FROM brands WHERE name = 'BFG'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BFG-KO3-0000');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'JIMNY FRONT-63154', 'SHOCK ABSORBERS FRONT SHOCK JIMNY', 'FRONT SHOCK JIMNY',
       (SELECT id FROM brands WHERE name = 'OME'),
       (SELECT id FROM categories WHERE name = 'SHOCK ABSORBERS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'JIMNY FRONT-63154');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'JIMNY REAR-63155', 'SHOCK ABSORBERS REAR SHOCK JIMNY', 'REAR SHOCK JIMNY',
       (SELECT id FROM brands WHERE name = 'OME'),
       (SELECT id FROM categories WHERE name = 'SHOCK ABSORBERS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'JIMNY REAR-63155');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARB 4X4 COIL FRONT- 3189', 'SUSPENSION FRONT COIL SPRING JIMNY', 'FRONT COIL SPRING JIMNY',
       (SELECT id FROM brands WHERE name = 'OME'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARB 4X4 COIL FRONT- 3189');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARB 4X4 COIL REAR - 3146', 'SUSPENSION REAR COIL SPRING JIMNY', 'REAR COIL SPRING JIMNY',
       (SELECT id FROM brands WHERE name = 'OME'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARB 4X4 COIL REAR - 3146');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARB-4X4 CASTER BUCHING-CA001', 'SUSPENSION CASTER BUCHING JIMNY', 'CASTER BUCHING JIMNY',
       (SELECT id FROM brands WHERE name = 'OME'),
       (SELECT id FROM categories WHERE name = 'SUSPENSION'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARB-4X4 CASTER BUCHING-CA001');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'ARB', 'FOGLAMP INTENSITY 7 - SPOT W/ HARNES', 'INTENSITY 7 - SPOT W/ HARNES',
       (SELECT id FROM brands WHERE name = 'SOLIS'),
       (SELECT id FROM categories WHERE name = 'FOGLAMP'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ARB');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'OME-BP51', 'SHOCK ABSORBERS TOYOTA HILUX REVO', 'TOYOTA HILUX REVO',
       (SELECT id FROM brands WHERE name = 'OME'),
       (SELECT id FROM categories WHERE name = 'SHOCK ABSORBERS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Sets"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'OME-BP51');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'MICHELINE PILOT SPORT S', 'TIRES PILOT SPORT 4S- 275/30/20', 'PILOT SPORT 4S- 275/30/20',
       (SELECT id FROM brands WHERE name = 'MICHELIN'),
       (SELECT id FROM categories WHERE name = 'TIRES'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2025.0"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'MICHELINE PILOT SPORT S');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLFS58-0000', 'MAGS 18X9, 6X139, ET-10', '18X9, 6X139, ET-10',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"SILVER MACHINE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLFS58-0000');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'HYPE-FC860-0000', 'MAGS 17X9, 6X139,  5X150, ET10', '17X9, 6X139,  5X150, ET10',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"BATTLE SHIP GREY"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'HYPE-FC860-0000');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'FUEL-SFJ D762', 'MAGS 20X12, 6X139 ET44', '20X12, 6X139 ET44',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'FUEL-SFJ D762');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'FUEL-REBAR-D859', 'MAGS 17X9, 6X139, ET1', '17X9, 6X139, ET1',
       (SELECT id FROM brands WHERE name = 'FUEL OFFROAD'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"PLATINUM BRONZE MILLED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'FUEL-REBAR-D859');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'C.TUNER-JCW280', 'MAGS 15X7, 4X100, ET35', '15X7, 4X100, ET35',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BRONZE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'C.TUNER-JCW280');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'C.TUNER- JCW240- 1', 'MAGS 15X7, 4X100, ET35', '15X7, 4X100, ET35',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'C.TUNER- JCW240- 1');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'C.TUNER- JCW240-2', 'MAGS 15X7, 4X100, ET35', '15X7, 4X100, ET35',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"PG W/O MACHINED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'C.TUNER- JCW240-2');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'C.TUNER- JCW240-3', 'MAGS 15X7, 4X100, ET35', '15X7, 4X100, ET35',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"SILVER MACHINED LIP"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'C.TUNER- JCW240-3');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'C.TUNER- JCW240-4', 'MAGS 15X7, 4X100, ET40', '15X7, 4X100, ET40',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BRONZE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'C.TUNER- JCW240-4');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'C.TUNER-JCW279-5', 'MAGS 15X7, 4X100, ET40', '15X7, 4X100, ET40',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS DM (MM)"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'C.TUNER-JCW279-5');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'C.TUNER-JCW279-6', 'MAGS 15X7, 4X100, ET40', '15X7, 4X100, ET40',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'C.TUNER-JCW279-6');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'C.TUNER-6614-7', 'MAGS 16X7, 8X100/114, ET35', '16X7, 8X100/114, ET35',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'C.TUNER-6614-7');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'C.TUNER-6614-8', 'MAGS 16X7, 8X100/114, ET38', '16X7, 8X100/114, ET38',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GUNMETAL"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'C.TUNER-6614-8');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'C.TUNER-RGW03BFF-9', 'MAGS 17X8, 5X114, ET35', '17X8, 5X114, ET35',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BROZE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'C.TUNER-RGW03BFF-9');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'C.TUNER-RGW032FF-10', 'MAGS 17X8, 5X114 ET38', '17X8, 5X114 ET38',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE GUNMETAL"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'C.TUNER-RGW032FF-10');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'C.TUNER-JCW37-11', 'MAGS 17X7, 5X144, ET40', '17X7, 5X144, ET40',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"PG W/O MACHINED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'C.TUNER-JCW37-11');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'C.TUNER-JCW299-12', 'MAGS 17X7, 5X114, ET38', '17X7, 5X114, ET38',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"SILVER MACHINED LIP"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'C.TUNER-JCW299-12');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'C.TUNER-JCW279-13', 'MAGS 17X7, 5X114, ET40', '17X7, 5X114, ET40',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BRONZE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'C.TUNER-JCW279-13');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'C.TUNER-JCW279-14', 'MAGS 17X7, 5X114, ET40', '17X7, 5X114, ET40',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS DM (MM)"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'C.TUNER-JCW279-14');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'C.TUNER-6082-15', 'MAGS 18X9, 5X114 ,ET35', '18X9, 5X114 ,ET35',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"BLACK PL"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'C.TUNER-6082-15');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'C.TUNER-6082-16', 'MAGS 18X9, 5X114 , ET35', '18X9, 5X114 , ET35',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GUNMETAL"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'C.TUNER-6082-16');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'C.TUNER-JCW40-17', 'MAGS 18X9/10X10X114, ET38', '18X9/10X10X114, ET38',
       (SELECT id FROM brands WHERE name = 'VLF'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"PG W/O NACHINED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'C.TUNER-JCW40-17');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'C.TUNER-', 'GENERAL', '',
       (SELECT id FROM brands WHERE name = 'ADZ GENERIC'),
       (SELECT id FROM categories WHERE name = 'GENERAL'),
       0.0, 0.0, 0.0, 'active', now(), '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'C.TUNER-');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLF-NEW-CO2-01', 'MAGS 15X7, 4X100/114, ET40', '15X7, 4X100/114, ET40',
       (SELECT id FROM brands WHERE name = 'TUNER'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS PG W/O MACHINED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLF-NEW-CO2-01');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLF-W19-02', 'MAGS 15X7, 4X100, ET30', '15X7, 4X100, ET30',
       (SELECT id FROM brands WHERE name = 'TUNER'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"2 TONE BRONZE W/ BRONZE MILLED SPOKE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLF-W19-02');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLF-W19-03', 'MAGS 15X7, 4X100, ET30', '15X7, 4X100, ET30',
       (SELECT id FROM brands WHERE name = 'TUNER'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"SILVER W/ MILLED SPOKE & MACHINED LIP"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLF-W19-03');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLF-W19-04', 'MAGS 15X7, 4X100, ET30', '15X7, 4X100, ET30',
       (SELECT id FROM brands WHERE name = 'TUNER'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS BLACK W/ MILLED SPOKE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLF-W19-04');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLF-NEW-CO2-05', 'MAGS 16X7, 4X100/114, ET40', '16X7, 4X100/114, ET40',
       (SELECT id FROM brands WHERE name = 'TUNER'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLF-NEW-CO2-05');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLF-NEW-CO2-06', 'MAGS 16X7, 4X100/114, ET40', '16X7, 4X100/114, ET40',
       (SELECT id FROM brands WHERE name = 'TUNER'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BRONZE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLF-NEW-CO2-06');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLF-NEW-CO2-07', 'MAGS 16X7, 4X100/114, ET40', '16X7, 4X100/114, ET40',
       (SELECT id FROM brands WHERE name = 'TUNER'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS PG W/O MACHINED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLF-NEW-CO2-07');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLF-10-V2-08', 'MAGS 16X7, 4X100/114, ET38', '16X7, 4X100/114, ET38',
       (SELECT id FROM brands WHERE name = 'TUNER'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLF-10-V2-08');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLF-10-V2-09', 'MAGS 16X7, 4X100/114, ET38', '16X7, 4X100/114, ET38',
       (SELECT id FROM brands WHERE name = 'TUNER'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BRONZE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLF-10-V2-09');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLF-ULF15-10', 'MAGS 17X7, 5X114, ET35', '17X7, 5X114, ET35',
       (SELECT id FROM brands WHERE name = 'TUNER'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BRONZE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLF-ULF15-10');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLF-ULF15-11', 'MAGS 17X7, 5X114, ET35', '17X7, 5X114, ET35',
       (SELECT id FROM brands WHERE name = 'TUNER'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS DM MM"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLF-ULF15-11');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLF-W19-12', 'MAGS 17X8, 5X114, ET30', '17X8, 5X114, ET30',
       (SELECT id FROM brands WHERE name = 'TUNER'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"SILVER W/ MILLED SPOKE & MACHINED LIP"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLF-W19-12');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLF-W19-13', 'MAGS 17X8, 5X114, ET30', '17X8, 5X114, ET30',
       (SELECT id FROM brands WHERE name = 'TUNER'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS BLACK W/ MILLED SPOKE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLF-W19-13');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLF-PO5V2-14', 'MAGS 17X8, 5X114, ET40', '17X8, 5X114, ET40',
       (SELECT id FROM brands WHERE name = 'TUNER'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS PG/PL"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLF-PO5V2-14');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLF-PO5V2-15', 'MAGS 17X8, 5X114, ET40', '17X8, 5X114, ET40',
       (SELECT id FROM brands WHERE name = 'TUNER'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"SILVER PL"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLF-PO5V2-15');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLF-28-16', 'MAGS 17X8, 5X114, ET35', '17X8, 5X114, ET35',
       (SELECT id FROM brands WHERE name = 'TUNER'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLF-28-16');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLF-W16-17', 'MAGS 18X8, 5X114, ET38', '18X8, 5X114, ET38',
       (SELECT id FROM brands WHERE name = 'TUNER'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS DM MM"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLF-W16-17');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLF-W16-18', 'MAGS 18X8, 5X114, ET38', '18X8, 5X114, ET38',
       (SELECT id FROM brands WHERE name = 'TUNER'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS PG W/O MACHINED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLF-W16-18');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLF-ULF23-19', 'MAGS 18X8, 5X114,ET38', '18X8, 5X114,ET38',
       (SELECT id FROM brands WHERE name = 'TUNER'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BRONZE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLF-ULF23-19');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VLF-G01-20', 'MAGS 18X8, 5X114, ET35', '18X8, 5X114, ET35',
       (SELECT id FROM brands WHERE name = 'TUNER'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"HYPERBLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VLF-G01-20');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TRX- XT -01', 'MAGS XT-16X6, 5X139, ET-5', 'XT-16X6, 5X139, ET-5',
       (SELECT id FROM brands WHERE name = 'TE37'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS DM MM"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TRX- XT -01');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TRX- PM -02', 'MAGS PM-17X8, 6X139, ET20', 'PM-17X8, 6X139, ET20',
       (SELECT id FROM brands WHERE name = 'TE37'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TRX- PM -02');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TRX- PM - 03', 'MAGS PM-17X8, 6X139, ET0', 'PM-17X8, 6X139, ET0',
       (SELECT id FROM brands WHERE name = 'TE37'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TRX- PM - 03');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TRX-XT -04', 'MAGS XT-17X9, 6X39, ET-10', 'XT-17X9, 6X39, ET-10',
       (SELECT id FROM brands WHERE name = 'TE37'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS DM MM"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TRX-XT -04');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TRX-XT -05', 'MAGS XT-17X9, 6X139, ETO-10', 'XT-17X9, 6X139, ETO-10',
       (SELECT id FROM brands WHERE name = 'TE37'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GUNMETAL MACHINED PG"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TRX-XT -05');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TRX-XT -06', 'MAGS XT-17X9, 6X139, ETO-10', 'XT-17X9, 6X139, ETO-10',
       (SELECT id FROM brands WHERE name = 'TE37'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BRONZE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TRX-XT -06');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TRX-XTV2 -07', 'MAGS XTV2-17X9, 6X139, ETO-10', 'XTV2-17X9, 6X139, ETO-10',
       (SELECT id FROM brands WHERE name = 'TE37'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BRONZE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TRX-XTV2 -07');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'TRX-R05X-08', 'MAGS R-05X - 17X9, 6X114, ET10', 'R-05X - 17X9, 6X114, ET10',
       (SELECT id FROM brands WHERE name = 'TE37'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'TRX-R05X-08');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VR-ZE40X- 09', 'MAGS VR-ZE40X - 17X9, 6X139, ET-10', 'VR-ZE40X - 17X9, 6X139, ET-10',
       (SELECT id FROM brands WHERE name = 'TE37'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VR-ZE40X- 09');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VR-ZE40X-10', 'MAGS VR-ZE40X - 17X9, 6X139, ET-10', 'VR-ZE40X - 17X9, 6X139, ET-10',
       (SELECT id FROM brands WHERE name = 'TE37'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS PG W/O MACHINED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VR-ZE40X-10');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VR-ZE40X-11', 'MAGS VR-ZE40X - 17X9, 6X139, ET-10', 'VR-ZE40X - 17X9, 6X139, ET-10',
       (SELECT id FROM brands WHERE name = 'TE37'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BRONZE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VR-ZE40X-11');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'VR-ZE40X-12', 'MAGS VR-ZE40X - 17X9, 6X139, ET-10', 'VR-ZE40X - 17X9, 6X139, ET-10',
       (SELECT id FROM brands WHERE name = 'TE37'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS DM MM"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'VR-ZE40X-12');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PM18-13', 'MAGS PM-18X9, 6X139, ET20', 'PM-18X9, 6X139, ET20',
       (SELECT id FROM brands WHERE name = 'TE37'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BRONZE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PM18-13');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PM18-14', 'MAGS PM-18X9, 6X139, ET0', 'PM-18X9, 6X139, ET0',
       (SELECT id FROM brands WHERE name = 'TE37'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PM18-14');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PM18-15', 'MAGS PM-18X9, 6X139, ET30', 'PM-18X9, 6X139, ET30',
       (SELECT id FROM brands WHERE name = 'TE37'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BRONZE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PM18-15');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'PM18-16', 'MAGS PM-18X9, 6X139, ET20', 'PM-18X9, 6X139, ET20',
       (SELECT id FROM brands WHERE name = 'TE37'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PM18-16');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'LR18- 17', 'MAGS LR-18X9, 6X139, ET0', 'LR-18X9, 6X139, ET0',
       (SELECT id FROM brands WHERE name = 'TE37'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'LR18- 17');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'LR18- 18', 'MAGS LR-18X9, 6X139, ET0', 'LR-18X9, 6X139, ET0',
       (SELECT id FROM brands WHERE name = 'TE37'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GLOSS DM MM"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'LR18- 18');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'LR18 -19', 'MAGS LR-18X9, 6X139, ET0', 'LR-18X9, 6X139, ET0',
       (SELECT id FROM brands WHERE name = 'TE37'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BRONZE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'LR18 -19');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'XT.V1-18- 20', 'MAGS XTV1- 18X9, 6X139, ET-10', 'XTV1- 18X9, 6X139, ET-10',
       (SELECT id FROM brands WHERE name = 'TE37'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"GOLSS DM MM"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'XT.V1-18- 20');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'XT18- 21', 'MAGS XT-18X8, 6X139, ET-10', 'XT-18X8, 6X139, ET-10',
       (SELECT id FROM brands WHERE name = 'TE37'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BRONZE"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'XT18- 21');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'R-05X18 - 22', 'MAGS R-05X- 18X9, 6X139, ET0', 'R-05X- 18X9, 6X139, ET0',
       (SELECT id FROM brands WHERE name = 'TE37'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"MATTE BLACK"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'R-05X18 - 22');
INSERT INTO products (id, sku, name, description, brand_id, category_id, base_price, retail_price, cost_price, status, updated_at, specs)
SELECT gen_random_uuid(), 'R-05X18 - 23', 'MAGS R-05X - 18X9, 6X114, ET0', 'R-05X - 18X9, 6X114, ET0',
       (SELECT id FROM brands WHERE name = 'TE37'),
       (SELECT id FROM categories WHERE name = 'MAGS'),
       0.0, 0.0, 0.0, 'active', now(), '{"uom":"Pc","color":"SILVER MACHINED"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'R-05X18 - 23');

-- ===== INVENTORY LEVELS =====
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 16, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'UCA-RGGDPRO-0001' AND w.name = 'RACK 1'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'UCA-RGGDPRO-0002' AND w.name = 'RACK 1'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 20, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'UCA-RGGDPRO-0003' AND w.name = 'RACK 1'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 9, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'UCA-RGGDPRO-0004' AND w.name = 'RACK 1'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 3, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'UCA-RGGDPRO-0005' AND w.name = 'RACK 1'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'UCA-RGGDPRO-0006' AND w.name = 'RACK 1'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 3, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'UCA-RGGDPRO-0007' AND w.name = 'RACK 1'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 16, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'UCA-RGGDPRO-0008' AND w.name = 'RACK 1'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 5, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'UCA-RGGDPRO-0009' AND w.name = 'RACK 1'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'UCA-RGGDPRO-0010' AND w.name = 'RACK 1'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'UCA-RGGDPRO-0011' AND w.name = 'RACK 1'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 3, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'UCA-RGGDPRO-0012' AND w.name = 'RACK 1'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'UCA-RGGDPRO-0013' AND w.name = 'RACK 1'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'UCA-RGGDPRO-0014' AND w.name = 'RACK 1'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'STBLNK-RGGDPRO-0001' AND w.name = 'RACK 2'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'STBLNK-RGGDPRO-0002' AND w.name = 'RACK 2'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 3, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'STBLNK-RGGDPRO-0003' AND w.name = 'RACK 2'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 7, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'STBLNK-RGGDPRO-0004' AND w.name = 'RACK 2'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 5, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'STBLNK-RGGDPRO-0005' AND w.name = 'RACK 2'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'STBLNK-RGGDPRO-0006' AND w.name = 'RACK 2'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 6, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'STBLNK-RGGDPRO-0007' AND w.name = 'RACK 2'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PNHRD-RGGDPRO-0001' AND w.name = 'RACK 3'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PNHRD-RGGDPRO-0002' AND w.name = 'RACK 3'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PNHRD-RGGDPRO-0003' AND w.name = 'RACK 3'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 5, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PNHRD-RGGDPRO-0004' AND w.name = 'RACK 3'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 6, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PNHRD-RGGDPRO-0005' AND w.name = 'RACK 3'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 5, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PNHRD-RGGDPRO-0006' AND w.name = 'RACK 3'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 5, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PNHRD-RGGDPRO-0007' AND w.name = 'RACK 3'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 6, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PNHRD-RGGDPRO-0008' AND w.name = 'RACK 3'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 9, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'EXH-RGGDPRO-0001' AND w.name = 'RACK 4'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 15, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'EXH-RGGDPRO-0002' AND w.name = 'RACK 4'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 43, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'EXH-RGGDPRO-0003' AND w.name = 'RACK 4'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 11, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'EXH-RGGDPRO-0004' AND w.name = 'RACK 4'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 7, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'EXH-RGGDPRO-0005' AND w.name = 'RACK 4'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 3, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'EXH-RGGDPRO-0006' AND w.name = 'RACK 4'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 3, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'EXH-RGGDPRO-0007' AND w.name = 'RACK 4'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'EXH-RGGDPRO-0008' AND w.name = 'RACK 4'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 3, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'EXH-RGGDPRO-0009' AND w.name = 'RACK 4'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 3, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'EXH-RGGDPRO-0010' AND w.name = 'RACK 4'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'EXH-RGGDPRO-0011' AND w.name = 'RACK 4'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'EXH-RGGDPRO-0012' AND w.name = 'RACK 4'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 45, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'RGGDLGHT-RGGDPRO-0001' AND w.name = 'RACK 5'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 88, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'RGGDLGHT-RGGDPRO-0002' AND w.name = 'RACK 5'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 31, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'RGGDLGHT-RGGDPRO-0003' AND w.name = 'RACK 5'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 23, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'RGGDLGHT-RGGDPRO-0004' AND w.name = 'RACK 5'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 235, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MDFLPS-RGGDPRO-0001' AND w.name = 'RACK 6'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 20, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MDFLPS-RGGDPRO-0002' AND w.name = 'RACK 6'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 100, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MDFLPS-RGGDPRO-0003' AND w.name = 'RACK 6'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 60, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MDFLPS-RGGDPRO-0004' AND w.name = 'RACK 6'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MDFLPS-RGGDPRO-0005' AND w.name = 'RACK 6'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 50, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MDFLPS-RGGDPRO-0006' AND w.name = 'RACK 6'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 100, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MDFLPS-RGGDPRO-0007' AND w.name = 'RACK 6'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MDFLPS-RGGDPRO-0008' AND w.name = 'RACK 6'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'LGNTS-RGGDPRO-001' AND w.name = 'RACK 7'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 20, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TRS-BFG2025' AND w.name = 'RACK 1'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 3, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PQS-S-FRT6 001' AND w.name = 'RACK 7'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PQS-S-FRT 002' AND w.name = 'RACK 7'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 6, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PQS-S-FRT 003' AND w.name = 'RACK 7'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 3, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PQS-S-FRT 004' AND w.name = 'RACK 7'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 3, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PQS-S-FRT 005' AND w.name = 'RACK 7'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PQS-S-FRT006' AND w.name = 'RACK 7'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 9, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PQS-S-FRT 007' AND w.name = 'RACK 7'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 9, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PQS-S-FRT 008' AND w.name = 'RACK 7'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 7, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PQS-S-FRT 009' AND w.name = 'RACK 7'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 3, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PQS-S-FRT 011' AND w.name = 'RACK 7'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PQS-S-FRT 012' AND w.name = 'RACK 7'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PQS-S-FRT O13' AND w.name = 'RACK 7'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PQS-S-FRT 014' AND w.name = 'RACK 7'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PQS-S-FRT015' AND w.name = 'RACK 7'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 5, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PQS-S-FRT016' AND w.name = 'RACK 7'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PQS-S-FRT 017' AND w.name = 'RACK 7'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PQS-S-FRT 018' AND w.name = 'RACK 7'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ASDDW' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 7, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PRO-UCA 001' AND w.name = 'RACK 8'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 7, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PRO-UCA 002' AND w.name = 'RACK 8'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PRO-UCA 003' AND w.name = 'RACK 8'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PRO-UCA 004' AND w.name = 'RACK 8'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PRO-UCA 005' AND w.name = 'RACK 8'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PRO-UCA 006' AND w.name = 'RACK 8'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PRO-UCA 007' AND w.name = 'RACK 8'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PRO-UCA 008' AND w.name = 'RACK 8'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 5, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PRO-UCA 009' AND w.name = 'RACK 8'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PRO-UCA 010' AND w.name = 'RACK 8'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 3, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PRO-UCA 011' AND w.name = 'RACK 8'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PRO-UCA 012' AND w.name = 'RACK 8'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PRO-UCA 013' AND w.name = 'RACK 8'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PRO-TUNE-SERIES' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 6, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'RM-SUS T6 0001' AND w.name = 'RACK 9'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 6, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'RM-SUS 4X2 0002' AND w.name = 'RACK 9'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'RM-SUS-BT 0003' AND w.name = 'RACK 9'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 32, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'RM-SUS-TR 0004' AND w.name = 'RACK 9'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'RM-SUS-TT 0005' AND w.name = 'RACK 9'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 18, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'RM-SUS-TI 0006' AND w.name = 'RACK 9'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 6, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'RM-SUS-TC 0007' AND w.name = 'RACK 9'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 6, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'RM-SUS-MNT 0008' AND w.name = 'RACK 9'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 6, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'RM-SUS-MOT009' AND w.name = 'RACK 9'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 6, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'RM-SUS-MOPM 0010' AND w.name = 'RACK 9'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 16, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'RM-SUS-IDM 0011' AND w.name = 'RACK 9'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'RM-SUS-NN 0012' AND w.name = 'RACK 9'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'RM-SUS-FRT6 001' AND w.name = 'RACK 10'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'RM-SUS-4X2 002' AND w.name = 'RACK 10'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'RM-SUS-FE 003' AND w.name = 'RACK 10'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'RM-SUS-TF 004' AND w.name = 'RACK 10'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 12, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'RM-SUS-TR 005' AND w.name = 'RACK 10'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'RM-SUS--TC 006' AND w.name = 'RACK 10'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 14, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'RM-SUS-TT 007' AND w.name = 'RACK 10'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 22, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'RM-SUS-TI 008' AND w.name = 'RACK 10'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 6, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'RM-SUS-MNT 009' AND w.name = 'RACK 10'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 10, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'RM-SUS-MOT 010' AND w.name = 'RACK 10'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 12, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'RM-SUS-MOP 011' AND w.name = 'RACK 10'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 12, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'RM-SUS-ID 012' AND w.name = 'RACK 10'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'RM-SUS-IM 013' AND w.name = 'RACK 10'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'RM-SUS-NN 014' AND w.name = 'RACK 10'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 3, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'KT-PR-102T' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 5, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'KTFR-101C-385' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'KTFR-101TC-400' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 7, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'KTRR-215C-475' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 5, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'KCFR-55T-335' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'KCFR-55T' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 7, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'KCRR-38' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'KCRR-56' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 3, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'KFFR-122T-440' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'KFRR-122HT-450' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 3, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'KFFR-24T' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'KFFR-24HT' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'KFFR-08TSP-385' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'KFFR-08TSP-395' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'KFRR-106C-510' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'KFFR-120' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'KFRR-121' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 3, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'KFFR-123SP' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 3, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'KFRR-124' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'KFFR-123' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'KDFR-7T-375' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'KDRR-73' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'KDRR-7310' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'KHFR-168TC-365' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'KHRR-96-400' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 5, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'KIRR-02-435' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 3, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-KM3-001' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-KM3-002' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-KM3-003' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-KM3-004' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-KM3-005' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-KM3-006' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-KM3-007' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-K02-001' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-K02-002' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-K02-003' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-K02-004' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-K02-005' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-K02-006' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 7, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-K02-007' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-K02-008' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-K02-009' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-K02-010' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-K02-011' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 10, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-K03-001' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 6, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-K03-002' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 20, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-K03-003' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 21, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-K03-004' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 26, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-K03-005' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-K03-006' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-K03-007' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 31, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-K03-008' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 17, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-K03-009' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 20, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-K03-010' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-K03-011' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-K03-012' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-K03-013' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 12, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-K03-014' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-TT-001' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-AT-001' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-AT-002' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-AT-003' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-AT-004' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-001' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-002' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-003' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-004' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 7, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-005' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-006' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 20, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-007' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 3, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-008' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-009' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-010' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-011' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-012' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-013' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 28, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-014' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-015' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-016' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-017' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-018' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-019' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 12, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-020' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 14, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-021' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-022' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 6, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-023' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-024' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 16, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-025' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-026' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-027' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-028' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-029' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-030' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-031' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-032' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 12, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-033' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-034' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-035' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-036' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-037' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-038' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-039' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-040' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-041' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 12, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-042' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VP-TIRE-043' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'CPTT-001' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'CPTT-002' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'CPTT-003' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'CPTT-004' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 28, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'CPTT-005' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 6, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'CPTT-006' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'CPTT-007' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'CPTT-008' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'CPTT-009' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'CPTT-010' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'CPTT-011' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'CPTT-012' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 12, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'CPTT-013' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 16, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'CPTT-014' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'CPTT-015' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'CPTT-016' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 12, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TOTO- TIRE-01' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TOTO- TIRE-02' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 10, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TOTO- TIRE-03' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TOTO- TIRE-04' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 12, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TOTO- TIRE-05' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 9, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TOTO- TIRE-06' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 12, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TOTO- TIRE-07' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TOTO- TIRE-08' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TOTO- TIRE-09' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'NITTO-006' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'NITTO-007' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'NITTO-008' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 5, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'NITTO-009' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'NITTO-010' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'NITTO-011' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'NITTO-012' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'NITTO-013' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'NITTO-014' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'NITTO-015' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TOTO- TIRE-010' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TOTO- TIRE-011' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 20, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-001' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 12, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-002' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-003' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-004' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-005' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 6, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-006' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-007' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 10, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-008' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-009' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 12, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-010' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 12, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-011' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-012' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-013' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-014' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-015' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 19, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-016' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 7, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-017' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-018' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-019' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-020' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-021' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-022' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 5, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-023' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 12, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-024' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-025' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 13, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-026' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-027' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 17, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-028' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-029' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-030' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-031' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-032' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 12, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-033' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 10, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-034' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 6, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-035' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-036' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-037' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 6, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-038' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'APT-039' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 5, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-001' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-002' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-003' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-004' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 10, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-005' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 20, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-006' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-008' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-009' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 12, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-010' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 14, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-011' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 10, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-012' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 9, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-013' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 7, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-014' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-015' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-016' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-017' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-018' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 6, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-019' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 6, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-020' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-021' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 34, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-022' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-023' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 6, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-024' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-025' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-026' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-027' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-028' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 12, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-029' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-030' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-031' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-032' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-033' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 3, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-034' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 5, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-035' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-036' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-037' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-038' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-039' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-040' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 28, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-041' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 7, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-042' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-043' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-044' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-045' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-046' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-047' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MONS-TI-001' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MONS-TI-002' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MONS-TI-003' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MONS-TI-004' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MONS-TI-005' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MONS-TI-006' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MONS-TI-007' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MONS-TI-008' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MONS-TI-009' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MONS-TI-010' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MONS-TI-011' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MONS-TI-012' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MONS-TI-013' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MONS-TI-014' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MONS-TI-015' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-001' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-002' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 14, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-000' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-003' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 3, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-004' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-005' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-006' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 10, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-007' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 11, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-008' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-009' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-010' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 6, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-011' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-012' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-013' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-014' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 12, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-015' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-016' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 6, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-017' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 3, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-018' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-019' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 21, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-020' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 6, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-021' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-022' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 6, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-023' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 6, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-024' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 14, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-025' AND w.name = 'RACK 5'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 17, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-026' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 6, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-027' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 11, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-028' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 12, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-029' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 9, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-030' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 5, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-031' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-032' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-033' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-034' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-035' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 12, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-036' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-037' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 6, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-038' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-039' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-040' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-041' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-042' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 10, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-043' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-044' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-045' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 10, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-046' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-047' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-048' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-049' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-050' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 10, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-051' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-052' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 14, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-053' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-054' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 14, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-055' AND w.name = 'RACK 8'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-056' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-057' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 7, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-058' AND w.name = 'RACK 3'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-059' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 6, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-060' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-061' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 11, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-062' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-063' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-064' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 13, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-065' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 7, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-066' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 6, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-067' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-068' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-069' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 12, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-070' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 6, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-071' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 12, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-072' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 10, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-073' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-074' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-075' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-076' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-077' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 10, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-078' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 5, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-079' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 3, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-080' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 12, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-081' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 10, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-082' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-083' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-084' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-085' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-086' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-087' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-089' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-090' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-091' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-092' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-093' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-094' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-095' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-096' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-097' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-098' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-099' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-100' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-101' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-102' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-103' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-104' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-105' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-106' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-107' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-108' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-109' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-110' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIV-TIRE-' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIVO-C6-01' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIVO-C6-02' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ATLNDR-TT-001' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ATLNDR-TT-002' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ATLNDR-TT-003' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ATLNDR-TT-004' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ATLNDR-TT-005' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ATLNDR-TT-006' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ATLNDR-TT-007' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ATLNDR-TT-008' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ATLNDR-TT-009' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ATLNDR-TT-010' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ATLNDR-TT-011' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ATLNDR-TT-012' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ATLNDR-TT-013' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ATLNDR-TT-014' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ATLNDR-TT-015' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 50, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BOSCH 1OF 1' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PRO-MOTO-S-001' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PRO-MOTO-S-002' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PRO-MOTO-S-003' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PRO-MOTO-S-004' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PRO-MOTO-S-005' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PRO-MOTO-S-006' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PRO-MOTO-S-007' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PRO-MOTO-S-008' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PRO-MOTO-S-009' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PRO-MOTO-S-010' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PRO-MOTO-S-011' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PRO-MOTO-S-012' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 27, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'AC-ADAL-01' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 20, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'AC-ADAL-02' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 16, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'AC-ADAL-03' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 40, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'AC-ADAL-04' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 20, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'AC-ADAL-05' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'AC-ADAL-06' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-AT-005' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-AT-006' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-AT-007' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-AT-008' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-AT-009' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-AT-010' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-AT-011' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-AT-012' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-AT-013' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'AC-ADAL-07' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'RGD-PRO-SKDPLT-001' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'AC-ELAIN 0000' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 10, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TRX' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'M-TIRE-0000' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHELIN PCR' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'M-TIRE-001' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'M-TIRE-002' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'M-TIRE-003' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'M-TIRE-004' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'M-TIRE-005' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'M-TIRE-006' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'M-TIRE-007' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'M-TIRE-008' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'M-TIRE-009' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'M-TIRE-010' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'M-TIRE-011' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHE-0001' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PRO-UCA-014' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MECHILIN' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TE37-001' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TE37-002' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TE37-003' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TE37-004' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TE37-005' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TE37-006' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TE37-007' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TE37-008' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TE37-009' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TE37-010' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TE37-011' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TE37-012' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TE37-013' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TE37-014' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TE37-015' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TE37-016' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TE37-017' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TE37-018' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TE37-019' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TE37-020' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TE37-021' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 10, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MST-SIV' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 52, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MST-S1V' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'CG-TG2' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'CG-TG3' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'EMT-KWM' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'W-MOTION-RS11' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'M1HC-8247' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'EMT-T7R' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'EMTZR10' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'WRK-WHLS-OO1' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'WRK-WHLS-002' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'WRK-WHLS-003' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'WRK-WHLS-004' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'WRK-WHLS-005' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'WRK-WHLS-006' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'WRK-WHLS-007' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'WRK-WHLS-008' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'WRK-WHLS-009' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'WRK-WHLS-010' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'WRK-WHLS-011' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'WRK-WHLS-012' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'WRK-WHLS-013' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'WRK-WHLS-014' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'WRK-WHLS-015' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'WRK-WHLS-016' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'WRK-WHLS-017' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'XT-1785-001' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'XT-1785-002' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 12, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'XT-1785-003' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 12, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VR-ZE40X-004' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 12, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VR-ZE40X-005' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 12, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VR-ZE40X-006' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 20, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'XT1785-007' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 20, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'LR1890' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 16, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'JCW272' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 20, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-4X4-1' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 10, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-4X4-2' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 10, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-4X4-3' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-4X4-00' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PROFENER-1-01-1' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PRO-SRAB.- 1001' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'JAOS-101' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'arivo-new' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIVO31/10' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIVO31/10/15' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIVO-10101' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLFS47B-001' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLFS47B-002' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLFS47B-003' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLFS47B-004' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLFS47B-005' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLFS47B-006' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLFS47B-007' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLFS47B-008' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLFS47B-009' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLFS47B-010' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-001' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-002' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-003' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-004' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-005' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-006' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-007' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-008' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-009' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-010' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-011' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-012' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-013' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-014' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-015' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 3, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-016' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-017' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-018' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-019' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-020' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-021' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-022' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-023' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-025' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-026' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-027' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-028' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-029' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-030' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-031' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-032' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-033' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-034' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-035' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-036' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-037' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-038' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-039' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HAMER-040' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLF-S47C-001' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLF-S47C-002' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLF-S47C-003' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLF-S47C-004' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLF-S49-010' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLF-S49-011' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLF-S16-013' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLDF07-014' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLDF07-015' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLDF-12-016' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLDF-12-017' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLFS53-018' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLFS58-019' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLFS10-020' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TCFSO1-021' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TCFSO3-022' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TCFSO3-023' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TCFS05-024' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLF-S47-012' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLFS35-025' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLFS12-026' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLDF07-028' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TCFS02-029' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLFS47B-05' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLFS47B-06' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLFS47B-07' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLFS47B-08' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLFS47B-09' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLFS58-0001' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLFS16-010' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLFS49-011' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLFS49-012' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLFS10-013' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLFS53-014' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLFS58-015' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLFS58-000' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLDF07-016' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLDF07-017' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLDF07-000' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLDF12-018' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLDF12-019' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TCFSO1-020' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TCFSO3-021' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TCFS03-022' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TCFS05-023' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLFS47-024' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLFS35-0026' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLDF12-026' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLDF07-027' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TCFS02-028' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLF-ULFS10-101' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLFS58-029' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLFS58-030' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLDF12-031' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLFS47B-032' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLFS58-033' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLFS49-034' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TCF-SO1-035' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'CORE - FC894-001' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'COVERT-D695-002' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'COVERT- D716-003' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VAPOR-D569-004' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VAPOR-D560-005' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'REBEL-D679-006' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'REBEL-D681-007' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'F.TRES-FC884-008' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'F.TRES-FC884-009' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PISTON-FC886-010' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'REBAR-D849-011' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VAPOR-D560 -012' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BLITZ-D674-013' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'CORE-FC894-014' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'SPLICER-FC903-015' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'SPLICER-FC903-016' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'CATALYST-FC402AP-017' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'CATALYST-FC402MX-018' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'CATALYST-FC402MZ-019' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'CATALYST-FC402AP-020' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BURN-FC403P8-021' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TANTRUM-FC895-022' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VAPOR-D569-023' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HALO-FC906-24' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HEIST-FC907-025' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'DYNAMO-FC405-026' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'DYNAMO-FC405-027' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'FLIGHT-FC408AP-028' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'FLIGHT-FC408PB-029' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HIVE-FC409-030' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HIVE-FC409-031' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'GRIP-FC900-032' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BLITS-D674-033' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'FLAME-D805-34' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'CORE-FC894-35' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VAPOR-D560-36' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 5, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MST-S1V-001' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 5, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MST-S1V-002' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'W.MOTION-T5R-003' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'W.MOTION-T5R-004' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'W.MOTION-RS11-05' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'W.MOTION-RS11-06' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 12, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MST-S1V-007' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MST-S1V-008' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MST-S1V-009' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MST-S1V-010' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 12, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MST-S1V-011' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'CG-TG2-012' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'CG-TG3-013' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'EMT-KWM-014' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'M1HC-8247-015' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'M1HC-8247-016' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MST-S1V-017' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MST-S1V-018' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MST-S1V-019' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MST-S1V-020' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MST-SIV-021' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'EMT-T7R-022' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'EMT-ZR10-023' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'EMT-ZR10-024' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'EMT-KWM-025' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MST-SIV-026' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MST-SIV-027' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MST-SIV-028' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MST-SIV-029' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MST-SIV-030' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHELIN-PCR' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHELINE-PCR' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARIVO-0001' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'FUEL-BRAWL-FC401' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BGF-KM3-37' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HYPE-FC860-00' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VAPOR-D569-001' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HYPE-FC860-002' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'CHARGER-FC873' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HYPE-FC860' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'BFG-KO3-0000' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'JIMNY FRONT-63154' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'JIMNY REAR-63155' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARB 4X4 COIL FRONT- 3189' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 2, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARB 4X4 COIL REAR - 3146' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 1, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARB-4X4 CASTER BUCHING-CA001' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'ARB' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'OME-BP51' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'MICHELINE PILOT SPORT S' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLFS58-0000' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'HYPE-FC860-0000' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'FUEL-SFJ D762' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'FUEL-REBAR-D859' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'C.TUNER-JCW280' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'C.TUNER- JCW240- 1' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'C.TUNER- JCW240-2' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'C.TUNER- JCW240-3' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'C.TUNER- JCW240-4' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'C.TUNER-JCW279-5' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'C.TUNER-JCW279-6' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'C.TUNER-6614-7' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'C.TUNER-6614-8' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'C.TUNER-RGW03BFF-9' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'C.TUNER-RGW032FF-10' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'C.TUNER-JCW37-11' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'C.TUNER-JCW299-12' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'C.TUNER-JCW279-13' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'C.TUNER-JCW279-14' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'C.TUNER-6082-15' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'C.TUNER-6082-16' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'C.TUNER-JCW40-17' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'C.TUNER-' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLF-NEW-CO2-01' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLF-W19-02' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLF-W19-03' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLF-W19-04' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLF-NEW-CO2-05' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLF-NEW-CO2-06' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLF-NEW-CO2-07' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLF-10-V2-08' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLF-10-V2-09' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLF-ULF15-10' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLF-ULF15-11' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLF-W19-12' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLF-W19-13' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLF-PO5V2-14' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLF-PO5V2-15' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLF-28-16' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLF-W16-17' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLF-W16-18' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLF-ULF23-19' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VLF-G01-20' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 5, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TRX- XT -01' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TRX- PM -02' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TRX- PM - 03' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 16, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TRX-XT -04' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 12, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TRX-XT -05' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 16, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TRX-XT -06' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TRX-XTV2 -07' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'TRX-R05X-08' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 12, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VR-ZE40X- 09' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VR-ZE40X-10' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VR-ZE40X-11' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'VR-ZE40X-12' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PM18-13' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PM18-14' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PM18-15' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'PM18-16' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 0, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'LR18- 17' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 16, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'LR18- 18' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'LR18 -19' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'XT.V1-18- 20' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'XT18- 21' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 8, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'R-05X18 - 22' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
INSERT INTO inventory_levels (id, product_id, warehouse_id, quantity, reorder_point, reserved_quantity, updated_at)
SELECT gen_random_uuid(), p.id, w.id, 4, 0, 0, now()
FROM products p, warehouses w
WHERE p.sku = 'R-05X18 - 23' AND w.name = 'ADZ Main Warehouse'
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now();
