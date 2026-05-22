import { useState, useMemo, useCallback, useEffect } from "react";

// ─────────────────────────────────────────────────────────────
// SUPPLIER LABELS
// ─────────────────────────────────────────────────────────────
const SL = {
  TP:"Taylor Produce", S:"Brakes", B:"Booker", AFS:"AFS",
  CM:"Choice Meats", WF:"Ward & Field", AC:"Asia Continental", Envior:"Envior", FEO:"Far East Oriental"
};

// ─────────────────────────────────────────────────────────────
// RAW INGREDIENTS  { n:name, q:package qty, u:unit, p:{sup:£} }
// Cost per unit = p[sup] / q
// ─────────────────────────────────────────────────────────────
const RAW = {
  // PRODUCE
  basil:{n:"Basil Catering Bunch (100g)",    q:100,   u:"g",    p:{TP:1.79,S:2.03,B:1.59,AC:1.50}, cat:"Herbs"},
  white_potato:{n:"White Potato (2kg)",             q:2000,  u:"g",    p:{TP:1.38,B:1.35,AC:2.29}, cat:"Fruit & Veg"},
  cauliflower:{n:"Cauliflower (ea ~800g)",         q:800,   u:"g",    p:{TP:1.15,S:1.66,B:1.49,AC:1.99}, cat:"Fruit & Veg"},
  cherry_tom:{n:"Cherry Tomato (250g)",           q:250,   u:"g",    p:{TP:0.74,S:0.82,B:0.99}, cat:"Fruit & Veg"},
  plum_tom:{n:"Plum Tomato (ea ~100g)",          q:100,   u:"g",    p:{TP:0.79,S:0.72}, cat:"Fruit & Veg"},
  red_chilli:{n:"Red Chilli (1kg)",               q:1000,  u:"g",    p:{TP:7.99,S:6.12,AC:8.99}, cat:"Fruit & Veg"},
  chives:{n:"Chives Catering Bunch (100g)",   q:100,   u:"g",    p:{TP:1.49,S:2.03,B:1.59,AC:1.50}, cat:"Herbs"},
  coriander:{n:"Coriander Catering Bunch (100g)", q:100,   u:"g",    p:{TP:0.99,S:0.83,B:1.59,AC:1.50}, cat:"Herbs"},
  dill:{n:"Dill Catering Bag (100g)",       q:100,   u:"g",    p:{TP:1.59,S:1.31,B:1.59,AC:1.50}, cat:"Herbs"},
  garlic:{n:"Garlic Peeled (1kg)",            q:1000,  u:"g",    p:{TP:4.75,S:5.03,B:5.49,AC:4.79}, cat:"Fruit & Veg"},
  ginger:{n:"Ginger (300g)",                  q:300,   u:"g",    p:{TP:1.47,S:1.54,B:2.99,AC:1.39}, cat:"Fruit & Veg"},
  iceberg:{n:"Iceberg Lettuce (~400g)",        q:400,   u:"g",    p:{TP:1.00,S:0.79,B:0.85}, cat:"Fruit & Veg"},
  white_onion:{n:"White Onion (2.5kg)",            q:2500,  u:"g",    p:{TP:3.75,S:1.78,B:3.74,AC:4.80}, cat:"Fruit & Veg"},
  limes:{n:"Limes x6 (~300g)",               q:300,   u:"g",    p:{TP:1.44,S:1.48,B:2.34,AC:3.54}, cat:"Fruit & Veg"},
  mint:{n:"Mint Catering Bunch (100g)",     q:100,   u:"g",    p:{TP:1.45,S:1.30,B:1.59,AC:1.50}, cat:"Herbs"},
  plantain:{n:"Plantain Ripe (1kg)",            q:1000,  u:"g",    p:{S:3.71,AC:3.38}, cat:"Fruit & Veg"},
  red_onion:{n:"Red Onion (per kg)",             q:1000,  u:"g",    p:{TP:1.29,S:0.97,B:0.99,AC:1.90}, cat:"Fruit & Veg"},
  red_cabbage:{n:"Red Cabbage (~1kg)",             q:1000,  u:"g",    p:{TP:1.25,S:0.96}, cat:"Fruit & Veg"},
  carrot:{n:"Carrot (1kg)",                   q:1000,  u:"g",    p:{TP:0.99}, cat:"Fruit & Veg"},
  cucumber:{n:"Cucumber (ea)",                  q:1,     u:"ea",   p:{TP:1.25}, cat:"Fruit & Veg"},
  rocket:{n:"Rocket (500g)",                  q:500,   u:"g",    p:{TP:3.89,S:2.84,B:3.06}, cat:"Fruit & Veg"},
  spring_onion:{n:"Spring Onion Bunch (100g)",      q:100,   u:"g",    p:{TP:0.50,S:0.50,B:0.79,AC:0.69}, cat:"Fruit & Veg"},
  sweet_potato:{n:"Sweet Potato (1kg)",             q:1000,  u:"g",    p:{TP:2.99,S:3.52,B:3.49,AC:3.19}, cat:"Fruit & Veg"},
  red_pepper:{n:"Red Pepper (ea ~200g)",          q:200,   u:"g",    p:{B:0.69}, cat:"Fruit & Veg"},
  peashoots:{n:"Peashoots (100g)",               q:100,   u:"g",    p:{TP:1.50,S:2.38}, cat:"Fruit & Veg"},
  jalapeno_f:{n:"Jalapeños Fresh (100g)",         q:100,   u:"g",    p:{TP:1.50}, cat:"Fruit & Veg"},
  oyster_mush:{n:"Oyster Mushrooms (1.5kg)",       q:1500,  u:"g",    p:{TP:9.00,S:14.10}, cat:"Fruit & Veg"},
  dill_pickles:{n:"Pickled Gherkins (2.25kg)",      q:2250,  u:"g",    p:{TP:6.80,S:7.58,B:11.29}, cat:"Fruit & Veg"},
  crispy_onion:{n:"Crispy Fried Onions GF (1kg)",   q:1000,  u:"g",    p:{S:6.54,B:7.23,AC:4.23}, cat:"Fruit & Veg"},
  // DAIRY & EGGS
  buttermilk:{n:"Buttermilk (1L)",                q:1000,  u:"ml",   p:{TP:2.70,S:3.12,B:1.75}, cat:"Dairy"},
  cheddar:{n:"Cheddar Grated Mature (2kg)",    q:2000,  u:"g",    p:{TP:13.50,S:12.30,B:11.99}, cat:"Dairy"},
  eggs:{n:"Eggs (Pack of 18)",              q:18,    u:"ea",   p:{TP:5.37,S:6.04,B:3.78,AC:6.29}, cat:"Dairy"},
  sour_cream:{n:"Sour Cream (2kg)",               q:2000,  u:"g",    p:{TP:7.50,S:14.39,B:8.50}, cat:"Dairy"},
  whole_milk:{n:"Whole Milk (2L)",                q:2000,  u:"ml",   p:{TP:1.75,S:1.89,B:1.49,AC:1.49}, cat:"Dairy"},
  butter_s:{n:"Butter Salted (250g)",           q:250,   u:"g",    p:{TP:1.79,S:2.42,B:1.79,AC:1.79}, cat:"Dairy"},
  feta:{n:"Feta (900g)",                    q:900,   u:"g",    p:{TP:11.00,S:13.38,B:11.24}, cat:"Dairy"},
  parmesan:{n:"Parmesan (1kg)",                 q:1000,  u:"g",    p:{TP:15.99,S:22.02,B:26.58}, cat:"Dairy"},
  stilton:{n:"Stilton / Blue Cheese (per kg)", q:1000,  u:"g",    p:{TP:12.95,S:11.01,B:14.90}, cat:"Dairy"},
  // PROTEINS
  chicken_th:{n:"Chicken Thigh Boneless (2.5kg)", q:2500,  u:"g",    p:{S:15.99,B:14.99,CM:12.36,WF:15.00}, cat:"Butchery"},
  chuck_roll:{n:"Chuck Roll/Steak (per kg)",      q:1000,  u:"g",    p:{S:12.22,B:11.25,CM:11.00,WF:12.99}, cat:"Butchery"},
  king_prawn:{n:"King Prawn 16-20 PD (1kg)",      q:1000,  u:"g",    p:{S:10.05,B:8.50,FEO:9.50}, cat:"Frozen"},
  mussels:{n:"Mussels Whole Shell (1kg)",      q:1000,  u:"g",    p:{S:5.00,B:3.69}, cat:"Frozen"},
  atl_prawns:{n:"Atlantic Prawns Small (1.3kg)",  q:1300,  u:"g",    p:{S:20.19,B:18.79}, cat:"Frozen"},
  white_fish:{n:"Whitefish Fillet (800g)",        q:800,   u:"g",    p:{B:5.99}, cat:"Frozen"},
  chk_tenders:{n:"Buttermilk Chicken Tenders (2kg)",q:2000, u:"g",    p:{S:14.90,B:18.99,AFS:11.49}, cat:"Butchery"},
  // FROZEN / PROCESSED
  tater_tots:{n:"Aviko Tater Bites (10kg)",       q:10000, u:"g",    p:{TP:27.99,B:20.95,AFS:20.99}, cat:"Frozen"},
  // OILS & LIQUIDS
  mayo:{n:"Mayonnaise (5L)",                q:5000,  u:"ml",   p:{TP:14.95,S:9.91,B:9.49}, cat:"Dry Store"},
  vegan_mayo:{n:"Vegan Mayo (5L)",                q:5000,  u:"ml",   p:{TP:15.00,S:11.22,B:12.99}, cat:"Dry Store"},
  franks:{n:"Franks Red Hot Sauce (3.78L)",   q:3780,  u:"ml",   p:{S:18.99}, cat:"Dry Store"},
  lime_juice:{n:"Lime Juice (1L)",                q:1000,  u:"ml",   p:{TP:2.50,S:2.58,B:3.29}, cat:"Dry Store"},
  olive_pomace:{n:"Olive Pomace Oil (5L)",          q:5000,  u:"ml",   p:{TP:18.00,S:14.80,B:18.99,AC:9.49}, cat:"Dry Store"},
  wine_vin:{n:"White Wine Vinegar (5L)",        q:5000,  u:"ml",   p:{TP:4.40,S:4.82,B:9.48}, cat:"Dry Store"},
  sriracha:{n:"Sriracha Sauce (1L)",            q:1000,  u:"ml",   p:{TP:4.99,S:5.31,B:2.99,AC:3.59}, cat:"Dry Store"},
  pine_juice:{n:"Pineapple Juice (1L)",           q:1000,  u:"ml",   p:{TP:1.50,AC:1.20}, cat:"Drinks"},
  coconut_milk:{n:"Coconut Milk (400ml/1L)",         q:400,   u:"ml",   p:{TP:1.85,FEO:2.60}, cat:"Drinks"},
  gochujang:{n:"Gochujang Paste (1kg)",          q:1000,  u:"g",    p:{TP:8.49,S:8.80}, cat:"Dry Store"},
  kecap_manis:{n:"Kecap Manis Sweet Soy (12x600ml)", q:7200, u:"ml",   p:{TP:33.00,FEO:35.00}, cat:"Dry Store"},
  sweet_chilli:{n:"Thai Sweet Chilli Sauce (1L)",   q:1000,  u:"ml",   p:{TP:2.30}, cat:"Dry Store"},
  // BREAD & GRAINS
  brioche_bun:{n:"Brioche Burger Bun (6×7=42)",   q:42,    u:"ea",   p:{TP:21.99,S:15.29,B:11.99}, cat:"Bakery"},
  bri_slice:{n:"Brioche Sliced (7×500g ~84sl)",  q:84,    u:"ea",   p:{TP:20.93,S:22.02,B:20.99}, cat:"Bakery"},
  tortilla_6:   {n:'Corn Tortilla Fry 6" (144s)',    q:144,   u:"ea",   p:{TP:16.95,S:17.56}},
  tortilla_4:   {n:'Corn Tortilla Soft 4" (216s)',   q:216,   u:"ea",   p:{TP:15.99,S:17.42}},
  tortilla_lrg:{n:"Large White Tortilla (10pk)",    q:10,    u:"ea",   p:{TP:2.99}, cat:"Bakery"},
  rice:{n:"Rice (5kg)",                     q:5000,  u:"g",    p:{TP:11.99,S:13.14,B:12.29,AC:13.69}, cat:"Dry Store"},
  plain_flour:{n:"Plain Flour (1.5kg)",            q:1500,  u:"g",    p:{TP:1.70,S:1.72,B:1.29}, cat:"Dry Store"},
  gram_flour:{n:"Gram Flour (2kg)",               q:2000,  u:"g",    p:{TP:3.25,S:3.45,B:3.49}, cat:"Dry Store"},
  panko:{n:"Panko Breadcrumb (1kg)",         q:1000,  u:"g",    p:{TP:5.95,B:4.69,FEO:1.50}, cat:"Dry Store"},
  puff_pastry:{n:"Puff Pastry (1.5kg)",            q:1500,  u:"g",    p:{TP:6.45,S:3.85,B:5.25}, cat:"Bakery"},
  vermicelli:{n:"Vermicelli (1kg)",               q:1000,  u:"g",    p:{S:8.98,FEO:2.50}, cat:"Dry Store"},
  tempura_f:{n:"Tempura Batter Mix GF (1kg)",    q:1000,  u:"g",    p:{TP:5.50,S:2.37,B:1.99,FEO:5.50}, cat:"Dry Store"},
  focaccia:{n:"Focaccia (3.8kg)",               q:3800,  u:"g",    p:{TP:33.00,S:25.41}, cat:"Bakery"},
  cornflour:{n:"Cornflour (3.5kg)",              q:3500,  u:"g",    p:{TP:6.94,S:11.15,B:9.99}, cat:"Dry Store"},
  arepa_flour:{n:"Arepa Flour (1kg)",              q:1000,  u:"g",    p:{FEO:2.30}, cat:"Dry Store"},
  // SPICES & SEASONINGS
  table_salt:{n:"Table/Sea Salt (1.4kg)",         q:1400,  u:"g",    p:{TP:12.50,S:12.50,B:13.99}, cat:"Dry Spices"},
  sm_paprika:{n:"Smoked Paprika (1kg)",           q:1000,  u:"g",    p:{TP:9.20,S:9.73,B:11.00,AC:9.23}, cat:"Dry Spices"},
  garlic_pow:{n:"Garlic Powder (700g)",           q:700,   u:"g",    p:{TP:3.30,S:22.74,B:8.49,AC:6.98}, cat:"Dry Spices"},
  blk_pepper:{n:"Cracked Black Pepper (1kg)",     q:1000,  u:"g",    p:{TP:14.49,S:24.26,B:10.00,AC:12.69}, cat:"Dry Spices"},
  dry_thyme:{n:"Dried Thyme (500g)",             q:500,   u:"g",    p:{TP:6.99,S:9.48,B:10.00}, cat:"Dry Spices"},
  fresh_thyme:{n:"Fresh Thyme Bunch (~30g)",       q:30,    u:"g",    p:{TP:1.49,S:1.32,B:1.59,AC:1.50}, cat:"Herbs"},
  rosemary:{n:"Rosemary Bunch (~30g)",          q:30,    u:"g",    p:{TP:1.49,S:1.25,B:1.59,AC:1.50}, cat:"Herbs"},
  five_spice:{n:"Chinese Five Spice (600g)",      q:600,   u:"g",    p:{TP:6.75,S:8.97,B:16.35}, cat:"Dry Spices"},
  jerk_seas:{n:"Jerk Seasoning (1kg)",           q:1000,  u:"g",    p:{TP:10.65,B:10.75,AC:14.90}, cat:"Dry Spices"},
  onion_pow:{n:"Onion Powder (650g)",            q:650,   u:"g",    p:{TP:4.50,S:6.73,B:7.98,AC:4.86}, cat:"Dry Spices"},
  baking_pow:{n:"Baking Powder (800g)",           q:800,   u:"g",    p:{TP:3.99,S:5.08,B:6.21}, cat:"Dry Spices"},
  bay_leaves:{n:"Bay Leaves (150g)",              q:150,   u:"g",    p:{TP:2.99,S:14.02,B:14.95,AC:7.17}, cat:"Dry Spices"},
  dark_choc:{n:"Dark Chocolate Callets (2.5kg)", q:2500,  u:"g",    p:{TP:30.99,S:32.68,B:31.99}, cat:"Dry Store"},
  cinnamon:{n:"Cinnamon Powder (700g)",         q:700,   u:"g",    p:{TP:9.00,S:9.18,B:8.96,AC:6.11}, cat:"Dry Spices"},
  pk_basar:{n:"Pakistani Basar (500g)",         q:500,   u:"g",    p:{AC:2.69}, cat:"Dry Spices"},
  chk_stock:{n:"Chicken Stock Powder (800g)",    q:800,   u:"g",    p:{TP:22.99,S:19.62,B:13.29,AC:5.99}, cat:"Dry Spices"},
  w_sesame:{n:"White Sesame Seeds (1kg)",       q:1000,  u:"g",    p:{TP:6.45,S:12.97,B:15.08,AC:6.48}, cat:"Dry Spices"},
  b_sesame:{n:"Black Sesame Seeds (1kg)",       q:1000,  u:"g",    p:{TP:10.50,S:14.25,B:14.53,AC:5.29}, cat:"Dry Spices"},
  gran_sugar:{n:"Granulated Sugar (2kg)",         q:2000,  u:"g",    p:{TP:1.24,S:3.16,B:2.49}, cat:"Dry Store"},
  // EXTRAS
  van_ice:{n:"Madagascan Vanilla Ice Cream (5L)",q:5000, u:"g",    p:{TP:19.99}, cat:"Frozen"},
};

// ─────────────────────────────────────────────────────────────
// BATCH RECIPES
// ─────────────────────────────────────────────────────────────
const r = (id,qty,unit) => ({id,qty,unit,t:"r"});
const b = (id,qty,unit) => ({id,qty,unit,t:"b"});

const BATCHES = {
  jalapeno_oil:    {n:"Jalapeño Oil",                   yield:1000,  yu:"ml",     cat:"Sauces",    ings:[r("garlic",200,"g"),r("olive_pomace",300,"ml"),r("jalapeno_f",350,"g"),r("table_salt",5,"g")]},
  chilli_jam:      {n:"Chilli Jam",                     yield:1000,  yu:"g",      cat:"Sauces",    ings:[r("red_chilli",1000,"g"),r("gran_sugar",1000,"g"),r("wine_vin",20,"ml"),r("table_salt",2,"g")]},
  mojo:            {n:"Mojo Dressing",                  yield:2500,  yu:"ml",     cat:"Sauces",    ings:[r("mint",200,"g"),r("coriander",200,"g"),r("basil",200,"g"),r("olive_pomace",2000,"ml"),r("lime_juice",50,"ml"),r("table_salt",5,"g"),r("blk_pepper",5,"g")]},
  chimichurri:     {n:"Chimichurri",                    yield:3100,  yu:"g",      cat:"Sauces",    ings:[r("spring_onion",300,"g"),r("wine_vin",20,"ml"),r("lime_juice",20,"ml"),r("table_salt",5,"g"),r("blk_pepper",5,"g"),b("jalapeno_oil",200,"ml"),r("white_onion",1300,"g"),r("red_onion",1800,"g"),r("coriander",250,"g"),r("red_chilli",140,"g")]},
  chipotle_mayo:   {n:"Chipotle Mayo",                  yield:10000, yu:"ml",     cat:"Sauces",    ings:[r("mayo",8000,"ml"),b("chilli_jam",500,"g"),r("lime_juice",100,"ml"),r("sm_paprika",100,"g"),r("garlic_pow",50,"g"),r("sriracha",200,"ml"),r("table_salt",20,"g"),r("blk_pepper",20,"g")]},
  vegan_g_mayo:    {n:"Vegan Garlic & Thyme Mayo",      yield:6000,  yu:"ml",     cat:"Sauces",    ings:[r("vegan_mayo",5000,"ml"),r("dry_thyme",10,"g"),r("garlic_pow",50,"g"),r("table_salt",5,"g"),r("lime_juice",30,"ml")]},
  ranch:           {n:"Ranch Dressing",                 yield:3500,  yu:"ml",     cat:"Sauces",    ings:[r("buttermilk",500,"ml"),r("blk_pepper",75,"g"),r("table_salt",25,"g"),r("mayo",200,"ml"),r("dill",15,"g"),r("sour_cream",2000,"g"),r("dry_thyme",50,"g")]},
  lbp_aioli:       {n:"Lime & Black Pepper Aioli",      yield:4000,  yu:"ml",     cat:"Sauces",    ings:[r("mayo",3500,"ml"),r("blk_pepper",25,"g"),r("table_salt",5,"g"),r("lime_juice",75,"ml")]},
  lemon_h_butter:  {n:"Lemon & Herb Butter",            yield:1000,  yu:"ml",     cat:"Sauces",    ings:[r("butter_s",250,"g"),r("olive_pomace",150,"ml"),r("coriander",50,"g"),r("blk_pepper",5,"g")]},
  garlic_butter:   {n:"Garlic Butter",                  yield:5000,  yu:"ml",     cat:"Sauces",    ings:[r("butter_s",2500,"g"),r("olive_pomace",2000,"ml"),r("blk_pepper",5,"g"),r("garlic",200,"g"),r("coriander",300,"g")]},
  buffalo_sauce:   {n:"Buffalo Sauce",                  yield:4000,  yu:"ml",     cat:"Sauces",    ings:[r("garlic_pow",50,"g"),r("franks",3000,"ml"),r("butter_s",250,"g"),r("sm_paprika",25,"g")]},
  bobo_base:       {n:"Bobo Base",                      yield:3600,  yu:"g",      cat:"Bases",     ings:[r("white_onion",230,"g"),r("white_potato",300,"g"),r("gochujang",500,"g"),r("dry_thyme",10,"g"),r("coconut_milk",3000,"ml"),r("table_salt",5,"g"),r("blk_pepper",5,"g"),r("cherry_tom",250,"g"),r("red_pepper",230,"g")]},
  cheese_sauce:    {n:"Cheese Sauce",                   yield:5500,  yu:"g",      cat:"Bases",     ings:[r("whole_milk",4000,"ml"),r("butter_s",500,"g"),r("sm_paprika",100,"g"),r("garlic_pow",50,"g"),r("table_salt",20,"g"),r("cheddar",1000,"g"),r("plain_flour",350,"g"),r("blk_pepper",20,"g"),r("onion_pow",50,"g")]},
  tomato_salsa:    {n:"Tomato Salsa",                   yield:2440,  yu:"g",      cat:"Bases",     ings:[r("cherry_tom",750,"g"),r("coriander",50,"g"),r("table_salt",10,"g"),r("blk_pepper",10,"g"),r("lime_juice",20,"ml"),r("plum_tom",2000,"g")]},
  jerk_gravy:      {n:"Jerk Gravy",                     yield:3850,  yu:"g",      cat:"Bases",     ings:[r("chk_stock",300,"g"),r("butter_s",250,"g"),r("gram_flour",250,"g"),r("dry_thyme",25,"g")]},
  pickled_onion:   {n:"Pickled Red Onion",              yield:800,   yu:"g",      cat:"Pickles",   ings:[r("red_onion",360,"g"),r("wine_vin",300,"ml"),r("bay_leaves",1,"g"),r("gran_sugar",200,"g")]},
  pickled_cabbage: {n:"Pickled Red Cabbage",            yield:3600,  yu:"g",      cat:"Pickles",   ings:[r("red_cabbage",1800,"g"),r("wine_vin",1000,"ml"),r("bay_leaves",1,"g"),r("gran_sugar",500,"g"),r("table_salt",5,"g")]},
  dill_pkl_fries:  {n:"Dill Pickle Fries",              yield:1000,  yu:"g",      cat:"Pickles",   ings:[r("dill_pickles",1000,"g")]},
  sw_pot_wedges:   {n:"Sweet Potato Wedges",            yield:1500,  yu:"g",      cat:"Veg",       ings:[r("sweet_potato",1800,"g"),r("table_salt",1,"g")]},
  viet_salad_mix:  {n:"Vietnamese Salad Mix",           yield:1000,  yu:"g",      cat:"Veg",       ings:[r("carrot",500,"g"),r("cucumber",1,"ea"),r("red_chilli",100,"g"),r("spring_onion",200,"g")]},
  plantain_sticks: {n:"Plantain Sticks",                yield:1000,  yu:"g",      cat:"Veg",       ings:[r("plantain",1000,"g")]},
  plantain_slices: {n:"Plantain Slices",                yield:500,   yu:"g",      cat:"Veg",       ings:[r("plantain",500,"g")]},
  oy_mush_shred:   {n:"Oyster Mushroom Shred",          yield:1500,  yu:"g",      cat:"Veg",       ings:[r("oyster_mush",1500,"g")]},
  oy_mush_seas:    {n:"Oyster Mushroom Seasoning Mix",  yield:1200,  yu:"g",      cat:"Dry Mixes", ings:[r("five_spice",750,"g"),r("garlic_pow",200,"g"),r("dry_thyme",200,"g"),r("table_salt",25,"g"),r("blk_pepper",25,"g")]},
  spicy_cornflour: {n:"Spicy Corn Flour",               yield:3535,  yu:"g",      cat:"Dry Mixes", ings:[r("cornflour",3000,"g"),r("sm_paprika",300,"g"),r("garlic_pow",200,"g"),r("dry_thyme",30,"g"),r("table_salt",5,"g")]},
  tempura:         {n:"Tempura Batter",                 yield:2000,  yu:"ml",     cat:"Dry Mixes", ings:[r("tempura_f",350,"g"),r("table_salt",1,"g")]},
  mixed_sesame:    {n:"Mixed Sesame Seeds",             yield:200,   yu:"g",      cat:"Dry Mixes", ings:[r("w_sesame",100,"g"),r("b_sesame",100,"g")]},
  cinnamon_sugar:  {n:"Cinnamon Sugar",                 yield:300,   yu:"g",      cat:"Dry Mixes", ings:[r("gran_sugar",250,"g"),r("cinnamon",50,"g")]},
  parmesan_crumb:  {n:"Parmesan Crumb",                 yield:200,   yu:"g",      cat:"Dairy",     ings:[r("parmesan",200,"g")]},
  blue_cheese_crumb:{n:"Blue Cheese Crumb",             yield:200,   yu:"g",      cat:"Dairy",     ings:[r("stilton",200,"g")]},
  chamo_cheese:    {n:"Chamo Cheese Mix",               yield:1700,  yu:"g",      cat:"Dairy",     ings:[r("feta",450,"g"),r("cheddar",1000,"g"),b("jalapeno_oil",250,"ml")]},
  fish_bags:       {n:"Fish Bags / Bobo (~18 bags)",    yield:18,    yu:"bag",    cat:"Protein",   ings:[r("white_fish",800,"g"),r("mussels",1000,"g"),r("king_prawn",1000,"g"),r("atl_prawns",1000,"g")]},
  king_prawn_mari: {n:"King Prawn Marinade",            yield:1000,  yu:"g",      cat:"Protein",   ings:[r("king_prawn",1000,"g"),b("chilli_jam",25,"g"),r("pk_basar",25,"g"),r("table_salt",5,"g"),r("blk_pepper",5,"g")]},
  pulled_beef:     {n:"Pulled Beef (10kg raw, ~7kg yield)", yield:7000, yu:"g",   cat:"Protein",   ings:[r("chuck_roll",10000,"g"),r("coriander",50,"g"),r("olive_pomace",300,"ml"),r("fresh_thyme",10,"g"),r("rosemary",50,"g"),r("sm_paprika",100,"g"),r("garlic",200,"g"),r("red_chilli",120,"g"),r("pk_basar",80,"g"),r("chk_stock",60,"g"),r("table_salt",25,"g"),r("blk_pepper",10,"g")]},
  pulled_chicken:  {n:"Whole Chicken Prep (10 birds, ~6kg yield)", yield:6000, yu:"g", cat:"Protein", ings:[r("chicken_th",10000,"g"),r("fresh_thyme",20,"g"),r("rosemary",50,"g"),r("jerk_seas",100,"g"),r("pine_juice",1000,"ml"),r("olive_pomace",300,"ml"),r("blk_pepper",10,"g"),r("chk_stock",60,"g"),r("red_chilli",100,"g"),r("sm_paprika",100,"g"),r("ginger",100,"g"),r("cinnamon",20,"g"),r("garlic",200,"g")]},
  arepa_pucks:     {n:"Arepa Pucks (24 ea)",            yield:24,    yu:"ea",     cat:"Bakery",    ings:[r("arepa_flour",1000,"g"),r("dry_thyme",10,"g"),r("garlic_pow",30,"g"),r("table_salt",5,"g"),r("olive_pomace",75,"ml")]},
  beef_croquette_b:{n:"Beef Croquettes (12 portions)",  yield:12,    yu:"portion",cat:"Bakery",    ings:[r("white_potato",2000,"g"),b("chamo_cheese",200,"g"),b("pulled_beef",300,"g"),r("table_salt",5,"g"),r("blk_pepper",5,"g"),r("eggs",5,"ea"),r("panko",500,"g"),r("whole_milk",300,"ml"),r("plain_flour",500,"g")]},
  cheese_empan_b:  {n:"Cheese Empanadas (12 portions)", yield:1200,  yu:"g",      cat:"Bakery",    ings:[r("plain_flour",50,"g"),r("puff_pastry",500,"g"),b("chamo_cheese",960,"g"),r("eggs",1,"ea")]},
  cauli_pakora:    {n:"Cauliflower Pakora Mix",         yield:3500,  yu:"g",      cat:"Veg",       ings:[r("cauliflower",3200,"g"),r("olive_pomace",200,"ml"),r("gram_flour",500,"g"),r("spring_onion",200,"g"),r("coriander",100,"g"),r("dill",50,"g"),r("pk_basar",60,"g"),r("red_chilli",120,"g"),r("red_onion",800,"g"),r("white_onion",300,"g"),r("table_salt",5,"g"),r("blk_pepper",5,"g")]},
  choc_brownie:    {n:"Chocolate Brownie (15 × 160g)", yield:15,    yu:"portion",cat:"Desserts",  ings:[r("eggs",10,"ea"),r("dark_choc",700,"g"),r("gran_sugar",700,"g"),r("plain_flour",400,"g"),r("baking_pow",2,"g"),r("cornflour",100,"g"),r("table_salt",1,"g"),r("butter_s",500,"g")]},
};

// ─────────────────────────────────────────────────────────────
// DISHES  { n, cat, ings:[{id,qty,unit,t}] }
// ─────────────────────────────────────────────────────────────
const DISHES = {
  // SMALL PLATES
  viet_salad:    {n:"Vietnamese Salad",          cat:"Small Plates",    ings:[r("vermicelli",100,"g"),b("mixed_sesame",5,"g"),b("viet_salad_mix",75,"g"),r("kecap_manis",50,"ml"),r("spring_onion",5,"g")]},
  sw_pot_sm:     {n:"Sweet Potato Wedges",       cat:"Small Plates",    ings:[b("sw_pot_wedges",250,"g"),b("jalapeno_oil",10,"ml"),r("chives",0.5,"g"),r("spring_onion",1,"g"),r("red_chilli",1,"g"),r("coriander",1,"g")]},
  shrimp_bobo:   {n:"Shrimp Bobo",              cat:"Small Plates",    ings:[r("focaccia",225,"g"),b("bobo_base",200,"g"),b("fish_bags",1,"bag"),r("coriander",1,"g"),r("spring_onion",5,"g"),r("limes",25,"g")]},
  ses_plantain:  {n:"Sesame Plantain",           cat:"Small Plates",    ings:[b("mixed_sesame",5,"g"),r("sweet_chilli",50,"ml"),r("chives",0.5,"g"),b("plantain_sticks",100,"g"),b("tempura",50,"ml"),r("rocket",15,"g"),b("mojo",5,"ml")]},
  ch_empanadas:  {n:"Cheese Empanadas",          cat:"Small Plates",    ings:[r("sweet_chilli",30,"ml"),b("cheese_empan_b",100,"g"),b("mojo",10,"ml"),r("rocket",10,"g"),r("peashoots",5,"g"),r("red_chilli",1,"g")]},
  cauli_sm:      {n:"Cauliflower Pakoras",       cat:"Small Plates",    ings:[b("mojo",10,"ml"),r("rocket",10,"g"),b("cauli_pakora",150,"g"),r("peashoots",5,"g"),r("red_chilli",1,"g"),b("pickled_cabbage",5,"g"),b("vegan_g_mayo",30,"ml")]},
  beef_croq_sm:  {n:"Beef Croquettes",           cat:"Small Plates",    ings:[b("chipotle_mayo",30,"ml"),b("beef_croquette_b",1,"portion"),b("chimichurri",15,"g"),r("peashoots",2,"g")]},
  // LUNCH
  beef_wrap:     {n:"Beef Wrap",                 cat:"Lunch",           ings:[b("pulled_beef",100,"g"),r("tortilla_lrg",1,"ea"),r("cheddar",20,"g"),r("iceberg",20,"g"),r("red_cabbage",10,"g"),b("tomato_salsa",20,"g"),b("chipotle_mayo",10,"ml"),b("chimichurri",20,"g")]},
  beef_burrito:  {n:"Beef Burrito Bowl",         cat:"Lunch",           ings:[b("pulled_beef",100,"g"),r("rice",100,"g"),r("cheddar",20,"g"),b("tomato_salsa",45,"g"),b("chimichurri",20,"g"),b("pickled_cabbage",20,"g"),b("mojo",10,"ml"),b("cheese_sauce",50,"g")]},
  chk_wrap:      {n:"Chamo Chicken Wrap",        cat:"Lunch",           ings:[b("pulled_chicken",100,"g"),r("tortilla_lrg",1,"ea"),r("cheddar",20,"g"),r("iceberg",20,"g"),b("pickled_cabbage",10,"g"),b("tomato_salsa",20,"g"),b("chipotle_mayo",10,"ml"),b("chimichurri",20,"g")]},
  chk_bobo:      {n:"Chicken Bobo",             cat:"Lunch",           ings:[b("pulled_chicken",100,"g"),r("rice",100,"g"),r("coriander",5,"g"),r("spring_onion",5,"g"),r("red_chilli",5,"g"),b("bobo_base",200,"g"),b("garlic_butter",10,"ml")]},
  chk_burrito:   {n:"Chicken Burrito Bowl",      cat:"Lunch",           ings:[r("rice",100,"g"),r("cheddar",20,"g"),b("chimichurri",20,"g"),b("cheese_sauce",50,"g"),b("pulled_chicken",100,"g"),b("tomato_salsa",45,"g"),b("pickled_cabbage",20,"g"),b("mojo",10,"ml")]},
  oy_mush_wrap:  {n:"Oyster Mushroom Wrap",      cat:"Lunch",           ings:[r("tortilla_lrg",1,"ea"),r("oyster_mush",100,"g"),r("iceberg",20,"g"),r("red_cabbage",20,"g"),b("tomato_salsa",45,"g"),r("vegan_mayo",10,"ml"),r("coriander",5,"g"),b("garlic_butter",10,"ml"),b("chimichurri",20,"g")]},
  oy_mush_bur:   {n:"Oyster Mushroom Bowl",      cat:"Lunch",           ings:[r("oyster_mush",100,"g"),r("rice",100,"g"),b("tomato_salsa",45,"g"),b("chimichurri",15,"g"),b("pickled_cabbage",20,"g"),r("rocket",20,"g"),r("red_chilli",5,"g"),b("oy_mush_seas",5,"g"),b("mojo",20,"ml")]},
  // AREPAS
  beef_arepa:    {n:"Arepa – Pulled Beef",       cat:"Arepas",          ings:[b("arepa_pucks",1,"ea"),r("iceberg",10,"g"),b("chipotle_mayo",20,"ml"),b("chimichurri",10,"g"),b("pickled_onion",5,"g"),r("spring_onion",2,"g"),b("mojo",10,"ml"),b("pulled_beef",100,"g"),b("garlic_butter",10,"ml"),r("chives",1,"g")]},
  oy_mush_arepa: {n:"Arepa – Oyster Mushroom",   cat:"Arepas",          ings:[b("arepa_pucks",1,"ea"),r("oyster_mush",150,"g"),b("vegan_g_mayo",20,"ml"),b("chimichurri",15,"g"),b("dill_pkl_fries",25,"g"),r("coriander",1,"g"),r("spring_onion",2,"g"),b("tomato_salsa",10,"g"),b("mojo",20,"ml"),r("red_chilli",1,"g"),b("oy_mush_seas",10,"g"),b("spicy_cornflour",25,"g"),r("rocket",10,"g")]},
  prawn_arepa:   {n:"Arepa – King Prawn",        cat:"Arepas",          ings:[b("king_prawn_mari",150,"g"),b("lbp_aioli",20,"ml"),r("rocket",10,"g"),r("spring_onion",2,"g"),b("chimichurri",10,"g"),b("mojo",10,"ml"),b("tomato_salsa",10,"g"),b("arepa_pucks",1,"ea"),r("red_chilli",1,"g"),r("limes",25,"g"),b("garlic_butter",10,"ml")]},
  chk_arepa:     {n:"Arepa – Chamo Chicken",     cat:"Arepas",          ings:[b("pulled_chicken",100,"g"),b("plantain_slices",25,"g"),b("chilli_jam",15,"g"),r("spring_onion",2,"g"),r("rocket",10,"g"),b("arepa_pucks",1,"ea"),b("mojo",10,"ml"),b("garlic_butter",10,"ml")]},
  // HARD SHELL TACOS
  beef_taco_h:   {n:"Tacos – Pulled Beef",       cat:"Tacos (Hard)",    ings:[b("cheese_sauce",50,"g"),b("tomato_salsa",45,"g"),b("chimichurri",30,"g"),b("chipotle_mayo",20,"ml"),r("crispy_onion",5,"g"),r("chives",1,"g"),r("tortilla_6",3,"ea"),b("pulled_beef",100,"g"),b("pickled_cabbage",20,"g"),b("mojo",10,"ml"),r("spring_onion",1,"g"),b("garlic_butter",10,"ml")]},
  chk_taco_h:    {n:"Tacos – Chamo Chicken",     cat:"Tacos (Hard)",    ings:[r("tortilla_6",3,"ea"),b("cheese_sauce",50,"g"),b("tomato_salsa",45,"g"),b("chimichurri",30,"g"),b("chipotle_mayo",20,"ml"),r("spring_onion",1,"g"),b("pickled_cabbage",20,"g"),r("chives",1,"g"),b("mojo",5,"ml"),b("chilli_jam",15,"g"),b("pulled_chicken",100,"g"),b("garlic_butter",10,"ml")]},
  oy_taco_h:     {n:"Tacos – Oyster Mushroom",   cat:"Tacos (Hard)",    ings:[r("oyster_mush",150,"g"),b("tomato_salsa",45,"g"),b("chimichurri",30,"g"),r("spring_onion",5,"g"),b("pickled_cabbage",20,"g"),b("vegan_g_mayo",25,"ml"),b("dill_pkl_fries",25,"g"),r("tortilla_6",3,"ea"),b("oy_mush_seas",5,"g"),r("chives",0.5,"g"),b("mojo",20,"ml"),r("coriander",1,"g"),r("red_chilli",1,"g"),b("spicy_cornflour",25,"g")]},
  // SOFT SHELL TACOS
  beef_taco_s:   {n:"Soft Tacos – Pulled Beef",  cat:"Tacos (Soft)",   ings:[r("tortilla_4",3,"ea"),b("cheese_sauce",50,"g"),b("tomato_salsa",45,"g"),b("chimichurri",30,"g"),b("chipotle_mayo",20,"ml"),r("crispy_onion",5,"g"),r("chives",1,"g"),b("pulled_beef",100,"g"),b("pickled_cabbage",20,"g"),b("mojo",10,"ml"),r("spring_onion",1,"g"),b("garlic_butter",10,"ml")]},
  prawn_taco_s:  {n:"Soft Tacos – King Prawn",   cat:"Tacos (Soft)",   ings:[r("tortilla_4",3,"ea"),b("cheese_sauce",50,"g"),b("tomato_salsa",45,"g"),b("chimichurri",30,"g"),r("spring_onion",1,"g"),r("chives",0.5,"g"),b("pickled_cabbage",20,"g"),b("lbp_aioli",20,"ml"),r("red_chilli",1,"g"),b("king_prawn_mari",150,"g"),b("mojo",5,"ml"),r("limes",25,"g"),b("garlic_butter",20,"ml")]},
  chk_taco_s:    {n:"Soft Tacos – Chamo Chicken",cat:"Tacos (Soft)",   ings:[r("tortilla_4",3,"ea"),b("cheese_sauce",50,"g"),b("tomato_salsa",45,"g"),b("chimichurri",30,"g"),b("chipotle_mayo",20,"ml"),r("spring_onion",1,"g"),b("pickled_cabbage",20,"g"),r("chives",1,"g"),b("mojo",5,"ml"),b("chilli_jam",15,"g"),b("pulled_chicken",100,"g"),b("garlic_butter",10,"ml")]},
  // BURGERS
  kor_burger:    {n:"Burger – Sticky Korean",     cat:"Burgers",         ings:[r("brioche_bun",1,"ea"),b("chipotle_mayo",20,"ml"),r("iceberg",20,"g"),r("chk_tenders",100,"g"),r("chives",1,"g"),r("spring_onion",1,"g"),r("red_chilli",1,"g"),b("mixed_sesame",2,"g")]},
  lemon_burger:  {n:"Burger – Lemon & Herb",      cat:"Burgers",         ings:[r("brioche_bun",1,"ea"),r("chk_tenders",100,"g"),b("vegan_g_mayo",20,"ml"),r("iceberg",20,"g"),r("chives",1,"g"),r("spring_onion",1,"g"),b("lemon_h_butter",10,"ml"),r("coriander",1,"g"),r("parmesan",1,"g")]},
  buffalo_burger:{n:"Burger – Buffalo",            cat:"Burgers",         ings:[r("brioche_bun",1,"ea"),r("chk_tenders",100,"g"),b("ranch",20,"ml"),r("iceberg",20,"g"),r("chives",1,"g"),r("spring_onion",1,"g"),r("red_chilli",1,"g"),r("stilton",1,"g"),b("buffalo_sauce",20,"ml")]},
  // TENDERS
  kor_tenders:   {n:"Tenders – Sticky Korean",    cat:"Tenders",         ings:[r("chk_tenders",250,"g"),b("chipotle_mayo",20,"ml"),r("chives",0.5,"g"),r("spring_onion",1,"g"),r("red_chilli",1,"g"),b("mixed_sesame",5,"g")]},
  lemon_tenders: {n:"Tenders – Lemon & Herb",     cat:"Tenders",         ings:[b("parmesan_crumb",5,"g"),r("chk_tenders",250,"g"),b("vegan_g_mayo",20,"ml"),r("chives",0.5,"g"),r("spring_onion",1,"g"),b("lemon_h_butter",20,"ml")]},
  cauli_tenders: {n:"Tenders – Cauliflower Pakora",cat:"Tenders",        ings:[b("cauli_pakora",150,"g"),b("vegan_g_mayo",20,"ml"),b("chimichurri",15,"g"),b("chilli_jam",15,"g"),r("chives",0.5,"g"),b("mojo",5,"ml")]},
  buffalo_tenders:{n:"Tenders – Buffalo",          cat:"Tenders",         ings:[b("buffalo_sauce",20,"ml"),b("ranch",20,"ml"),r("chives",0.5,"g"),r("spring_onion",1,"g"),r("red_chilli",1,"g"),r("stilton",2,"g"),r("chk_tenders",250,"g")]},
  // SANDOS
  sando_limes:   {n:"Sando – Silence of the Limes",cat:"Sandos",        ings:[r("chk_tenders",150,"g"),r("bri_slice",2,"ea"),b("vegan_g_mayo",20,"ml"),r("chives",0.5,"g"),r("spring_onion",1,"g"),b("lemon_h_butter",20,"ml"),r("cheddar",20,"g")]},
  sando_beef:    {n:"Sando – Pulled Beef",         cat:"Sandos",         ings:[b("pulled_beef",100,"g"),b("chimichurri",10,"g"),b("chipotle_mayo",20,"ml"),b("pickled_onion",3,"g"),r("crispy_onion",2,"g"),r("bri_slice",2,"ea"),b("mojo",5,"ml"),b("garlic_butter",10,"ml"),r("cheddar",20,"g")]},
  sando_prawn:   {n:"Sando – King Prawn",          cat:"Sandos",         ings:[b("king_prawn_mari",150,"g"),r("bri_slice",2,"ea"),b("lbp_aioli",20,"ml"),b("chimichurri",10,"g"),r("rocket",20,"g"),b("mojo",5,"ml"),b("garlic_butter",10,"ml"),b("tomato_salsa",15,"g"),r("limes",25,"g"),r("cheddar",20,"g")]},
  sando_korean:  {n:"Sando – Heart & Seoul",       cat:"Sandos",         ings:[r("chk_tenders",150,"g"),r("bri_slice",2,"ea"),b("chipotle_mayo",20,"ml"),r("chives",0.5,"g"),r("spring_onion",1,"g"),r("red_chilli",1,"g"),b("mixed_sesame",5,"g"),r("cheddar",20,"g")]},
  sando_chk:     {n:"Sando – Chamo Chicken",       cat:"Sandos",         ings:[b("pulled_chicken",100,"g"),r("bri_slice",2,"ea"),b("chipotle_mayo",20,"ml"),b("chimichurri",10,"g"),b("chilli_jam",25,"g"),r("rocket",20,"g"),b("mojo",5,"ml"),b("garlic_butter",10,"ml"),r("cheddar",20,"g")]},
  sando_buffalo: {n:"Sando – Buffalo Bill",        cat:"Sandos",         ings:[r("chk_tenders",150,"g"),b("buffalo_sauce",20,"ml"),b("ranch",20,"ml"),r("spring_onion",1,"g"),r("red_chilli",1,"g"),r("stilton",2,"g"),r("chives",0.5,"g"),r("cheddar",20,"g")]},
  // LOADED FRIES / TOTS
  loaded_beef:   {n:"Loaded – Pulled Beef",        cat:"Loaded Fries/Tots",ings:[b("pulled_beef",100,"g"),b("cheese_sauce",50,"g"),b("chimichurri",10,"g"),b("chipotle_mayo",20,"ml"),b("pickled_onion",3,"g"),r("spring_onion",1,"g"),r("crispy_onion",2,"g"),r("chives",0.5,"g"),r("tater_tots",250,"g"),b("mojo",5,"ml"),b("garlic_butter",10,"ml")]},
  loaded_mush:   {n:"Loaded – Oyster Mushroom",    cat:"Loaded Fries/Tots",ings:[r("oyster_mush",150,"g"),b("vegan_g_mayo",20,"ml"),b("chimichurri",10,"g"),r("spring_onion",1,"g"),b("dill_pkl_fries",25,"g"),r("tater_tots",250,"g"),r("chives",0.5,"g"),b("mojo",20,"ml"),r("coriander",1,"g"),r("red_chilli",1,"g"),b("oy_mush_seas",10,"g"),b("spicy_cornflour",25,"g")]},
  loaded_prawn:  {n:"Loaded – King Prawn",         cat:"Loaded Fries/Tots",ings:[b("chimichurri",10,"g"),b("lbp_aioli",20,"ml"),r("spring_onion",1,"g"),r("tater_tots",250,"g"),b("king_prawn_mari",150,"g"),r("chives",1,"g"),b("cheese_sauce",50,"g"),b("mojo",5,"ml"),r("limes",25,"g"),r("red_chilli",1,"g"),b("tomato_salsa",15,"g"),b("garlic_butter",10,"ml")]},
  loaded_chk:    {n:"Loaded – Chamo Chicken",      cat:"Loaded Fries/Tots",ings:[r("tater_tots",250,"g"),b("pulled_chicken",100,"g"),b("cheese_sauce",50,"g"),b("chipotle_mayo",20,"ml"),b("chimichurri",10,"g"),b("chilli_jam",25,"g"),r("spring_onion",1,"g"),r("chives",0.5,"g"),b("mojo",5,"ml"),b("garlic_butter",10,"ml")]},
  // SIDES
  cheese_tots:   {n:"Cheese Tots",                 cat:"Sides",          ings:[r("tater_tots",250,"g"),b("cheese_sauce",40,"g"),r("chives",1,"g")]},
  garlic_tots:   {n:"Garlic & Parmesan Tots",       cat:"Sides",          ings:[r("tater_tots",250,"g"),b("lemon_h_butter",20,"ml"),b("parmesan_crumb",5,"g"),r("chives",1,"g")]},
  pickle_fries:  {n:"Crispy Pickle Fries",          cat:"Sides",          ings:[b("dill_pkl_fries",180,"g"),b("vegan_g_mayo",20,"ml"),r("spring_onion",1,"g"),r("chives",0.5,"g"),b("spicy_cornflour",50,"g")]},
  // DESSERTS
  cinn_plantain: {n:"Cinnamon Plantain",            cat:"Desserts",        ings:[b("tempura",50,"ml"),b("plantain_slices",100,"g"),b("cinnamon_sugar",20,"g"),r("dark_choc",30,"g"),r("van_ice",50,"g"),r("mint",1,"g")]},
  choc_brownie_d:{n:"Chocolate Brownie",            cat:"Desserts",        ings:[b("choc_brownie",160,"g"),r("van_ice",50,"g"),r("mint",1,"g"),r("dark_choc",30,"g")]},
  // SHARING
  sharing:       {n:"Sharing Platter",              cat:"Sharing",         ings:[b("buffalo_sauce",20,"ml"),b("ranch",20,"ml"),b("chipotle_mayo",20,"ml"),b("lemon_h_butter",20,"ml"),b("vegan_g_mayo",20,"ml"),r("spring_onion",15,"g"),r("red_chilli",10,"g"),r("coriander",2,"g"),r("tater_tots",250,"g"),b("cheese_sauce",30,"g"),r("chives",20,"g"),b("chilli_jam",20,"g"),r("chk_tenders",900,"g"),b("mixed_sesame",5,"g"),b("blue_cheese_crumb",5,"g"),b("parmesan_crumb",5,"g"),b("cauli_pakora",150,"g")]},
};

const CATS = ["All","Small Plates","Lunch","Arepas","Tacos (Hard)","Tacos (Soft)","Burgers","Tenders","Sandos","Loaded Fries/Tots","Sides","Desserts","Sharing"];

// ─────────────────────────────────────────────────────────────
// COST CALCULATION HELPERS
// ─────────────────────────────────────────────────────────────
function bestSupplier(rawId) {
  const ing = RAW[rawId];
  if (!ing || !Object.keys(ing.p).length) return null;
  return Object.entries(ing.p).reduce((a,b) => b[1]<a[1]?b:a);
}
function cpUnit(rawId) {
  const bs = bestSupplier(rawId);
  if (!bs) return null;
  return bs[1] / RAW[rawId].q;
}

function buildBatchCosts() {
  const memo = {};
  function calc(id) {
    if (id in memo) return memo[id];
    memo[id] = null; // cycle guard
    const bt = BATCHES[id];
    if (!bt) return null;
    let total = 0, hasNull = false;
    for (const ing of bt.ings) {
      if (ing.t === "r") {
        const cpu = cpUnit(ing.id);
        if (cpu === null) hasNull = true;
        else total += cpu * ing.qty;
      } else {
        const sub = calc(ing.id);
        if (!sub) hasNull = true;
        else total += sub.perUnit * ing.qty;
      }
    }
    const res = { total, perUnit: total / bt.yield, hasNull, yield: bt.yield, yu: bt.yu, n: bt.n, cat: bt.cat };
    memo[id] = res;
    return res;
  }
  Object.keys(BATCHES).forEach(k => calc(k));
  return memo;
}

const BATCH_COSTS = buildBatchCosts();

function calcDish(dishId) {
  const dish = DISHES[dishId];
  if (!dish) return null;
  let total = 0, hasNull = false;
  const breakdown = [];
  for (const ing of dish.ings) {
    let cost = 0, name = "", missing = false;
    if (ing.t === "r") {
      const cpu = cpUnit(ing.id);
      if (cpu === null) { missing = true; hasNull = true; }
      else cost = cpu * ing.qty;
      name = RAW[ing.id]?.n || ing.id;
    } else {
      const bc = BATCH_COSTS[ing.id];
      if (!bc) { missing = true; hasNull = true; }
      else { cost = bc.perUnit * ing.qty; if (bc.hasNull) hasNull = true; }
      name = BATCHES[ing.id]?.n || ing.id;
    }
    total += cost;
    breakdown.push({ name, qty: ing.qty, unit: ing.unit, cost, missing, isBatch: ing.t==="b" });
  }
  return { ...dish, total, hasNull, breakdown };
}

// Prep planner: roll dish covers → batches → raw ingredients
function calcPrepPlan(covers) {
  const batchUsage = {}; // id → total units needed
  const rawUsage  = {}; // id → total g/ml/ea needed

  // Pass 1: dish → direct needs
  for (const [dishId, qty] of Object.entries(covers)) {
    if (!qty) continue;
    const dish = DISHES[dishId];
    if (!dish) continue;
    for (const ing of dish.ings) {
      if (ing.t === "r") { rawUsage[ing.id]  = (rawUsage[ing.id]  || 0) + ing.qty * qty; }
      else               { batchUsage[ing.id] = (batchUsage[ing.id] || 0) + ing.qty * qty; }
    }
  }

  // Pass 2: recursive batch → raw rollup
  function rollBatch(batchId, totalUnitsNeeded) {
    const bt = BATCHES[batchId];
    if (!bt) return;
    for (const ing of bt.ings) {
      const rawPerUnit = ing.qty / bt.yield;
      const needed = rawPerUnit * totalUnitsNeeded;
      if (ing.t === "r") { rawUsage[ing.id] = (rawUsage[ing.id] || 0) + needed; }
      else { rollBatch(ing.id, needed); }
    }
  }
  for (const [batchId, qty] of Object.entries(batchUsage)) rollBatch(batchId, qty);

  // Calculate batch batches count and shopping list
  const batchesToMake = Object.entries(batchUsage).map(([id, qty]) => {
    const bt = BATCHES[id];
    if (!bt) return null;
    const bc = BATCH_COSTS[id];
    const batchesNeeded = Math.ceil(qty / bt.yield);
    return { id, name: bt.n, cat: bt.cat, unitsNeeded: qty, yu: bt.yu, batchYield: bt.yield, batchesNeeded, costPerBatch: bc?.total || null, totalCost: bc ? bc.total * batchesNeeded : null };
  }).filter(Boolean).sort((a,b) => a.cat.localeCompare(b.cat) || a.name.localeCompare(b.name));

  const shopping = Object.entries(rawUsage).map(([id, qty]) => {
    const ing = RAW[id];
    if (!ing) return null;
    const bs = bestSupplier(id);
    const pkgsNeeded = Math.ceil(qty / ing.q);
    return { id, name: ing.n, totalQty: qty, unit: ing.u, pkgsNeeded, pkgSize: ing.q, supplier: bs?.[0] || null, supplierName: bs?.[0] ? SL[bs[0]]||bs[0] : "—", costPerPkg: bs?.[1] || null, totalCost: bs ? pkgsNeeded * bs[1] : null };
  }).filter(Boolean).sort((a,b) => a.name.localeCompare(b.name));

  const totalOrderCost = shopping.reduce((s,x) => s + (x.totalCost||0), 0);
  return { batchesToMake, shopping, totalOrderCost };
}

// ─────────────────────────────────────────────────────────────
// FORMATTING
// ─────────────────────────────────────────────────────────────
const fmt = (v) => v == null ? "—" : `£${v.toFixed(2)}`;
const fmtPct = (v) => v == null ? "—" : `${v.toFixed(1)}%`;
const fmtQty = (q, u) => {
  if (u === "ea" || u === "bag" || u === "portion") return `${Number.isInteger(q)?q:q.toFixed(1)} ${u}`;
  if (q >= 1000 && (u==="g"||u==="ml")) return `${(q/1000).toFixed(2)}${u==="g"?"kg":"L"}`;
  return `${q}${u}`;
};

// ─────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────
export default function ChamoStock() {
  const [tab, setTab]               = useState("costs");
  const [sellPrices, setSellPrices] = useState({});
  const [catFilter, setCatFilter]   = useState("All");
  const [expanded, setExpanded]     = useState(null);
  const [covers, setCovers]         = useState({});
  const [ingSearch, setIngSearch]   = useState("");
  const [supCatFilter, setSupCatFilter] = useState("All");
  const [batchSearch, setBatchSearch] = useState("");
  const [sortCol, setSortCol]       = useState("name");
  const [sortDir, setSortDir]       = useState(1);

  const dishData = useMemo(() => Object.entries(DISHES).map(([id]) => ({id, ...calcDish(id)})), []);

  const filteredDishes = useMemo(() => {
    return dishData.filter(d => catFilter === "All" || d.cat === catFilter);
  }, [dishData, catFilter]);

  const prepPlan = useMemo(() => calcPrepPlan(covers), [covers]);

  const totalOrderValue = prepPlan.totalOrderCost;

  const setSell = (id, v) => setSellPrices(p => ({...p, [id]: parseFloat(v)||0}));
  const setCover = (id, v) => setCovers(p => ({...p, [id]: parseInt(v)||0}));

  const supIngredients = useMemo(() => {
    return Object.entries(RAW).map(([id, ing]) => {
      const bs = bestSupplier(id);
      const prices = Object.entries(ing.p).map(([s,p]) => ({s, label:SL[s]||s, p})).sort((a,b)=>a.p-b.p);
      const saving = prices.length > 1 ? prices[prices.length-1].p - prices[0].p : 0;
      return { id, name: ing.n, unit: ing.u, qty: ing.q, cat: ing.cat||"", best: bs, prices, saving };
    }).filter(i => Object.keys(i.prices).length > 0)
      .filter(i => !ingSearch || i.name.toLowerCase().includes(ingSearch.toLowerCase()))
      .filter(i => supCatFilter === "All" || i.cat === supCatFilter)
      .sort((a,b) => {
        if (sortCol === "saving") return sortDir * (b.saving - a.saving);
        if (sortCol === "best")   return sortDir * ((a.best?.[1]||999) - (b.best?.[1]||999));
        return sortDir * a.name.localeCompare(b.name);
      });
  }, [ingSearch, supCatFilter, sortCol, sortDir]);

  const batchList = useMemo(() => {
    return Object.entries(BATCHES).map(([id,bt]) => {
      const bc = BATCH_COSTS[id];
      return { id, name: bt.n, cat: bt.cat, yield: bt.yield, yu: bt.yu, total: bc?.total, perUnit: bc?.perUnit, hasNull: bc?.hasNull };
    }).filter(b => !batchSearch || b.name.toLowerCase().includes(batchSearch.toLowerCase()))
      .sort((a,b) => a.cat.localeCompare(b.cat) || a.name.localeCompare(b.name));
  }, [batchSearch]);

  const toggleSort = (col) => {
    if (sortCol === col) setSortDir(d => -d);
    else { setSortCol(col); setSortDir(1); }
  };

  // Stats
  const totalDishes = Object.keys(DISHES).length;
  const totalBatches = Object.keys(BATCHES).length;
  const avgDishCost = dishData.reduce((s,d) => s+(d.total||0), 0) / totalDishes;
  const missingCount = dishData.filter(d => d.hasNull).length;

  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const tabs = [["costs","🍽","Dish Costs"],["supplier","🛒","Supplier"],["batch","📋","Batches"],["planner","📅","Planner"]];

  return (
    <div style={{fontFamily:"'DM Sans', system-ui, sans-serif", background:"#0e0e0e", minHeight:"100vh", color:"#e8e2d9", paddingBottom: isMobile ? 68 : 0}}>
      {/* HEADER */}
      <div style={{background:"#141414", borderBottom:"1px solid #2a2218", padding: isMobile ? "0 16px" : "0 32px"}}>
        <div style={{maxWidth:1300, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height: isMobile ? 52 : 64}}>
          <div style={{display:"flex", alignItems:"center", gap:12}}>
            <div style={{fontWeight:800, fontSize: isMobile ? 20 : 24, letterSpacing:3, color:"#f5a623"}}>CHAMO</div>
            <div style={{width:1, height:20, background:"#333"}}/>
            <div style={{fontSize: isMobile ? 10 : 12, color:"#666", letterSpacing:1, textTransform:"uppercase"}}>Stock Management</div>
          </div>
          {!isMobile && (
            <nav style={{display:"flex", gap:4}}>
              {tabs.map(([id,emoji,label]) => (
                <button key={id} onClick={() => setTab(id)} style={{
                  padding:"8px 18px", borderRadius:8, border:"none", cursor:"pointer", fontSize:13, fontWeight:600, transition:"all .15s",
                  background: tab===id ? "#f5a623" : "transparent",
                  color: tab===id ? "#0e0e0e" : "#888"
                }}>{emoji} {label}</button>
              ))}
            </nav>
          )}
        </div>
      </div>

      {/* STATS BAR */}
      <div style={{background:"#111", borderBottom:"1px solid #1e1e1e", padding: isMobile ? "10px 16px" : "12px 32px"}}>
        <div style={{maxWidth:1300, margin:"0 auto", display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,auto)", gap: isMobile ? "6px 16px" : "0 32px"}}>
          {[
            ["Dishes", totalDishes],
            ["Batches", totalBatches],
            ["Avg Cost", fmt(avgDishCost)],
            ["Missing", `${missingCount}`],
          ].map(([k,v]) => (
            <div key={k} style={{display:"flex", alignItems:"baseline", gap:6}}>
              <span style={{fontSize: isMobile ? 10 : 11, color:"#555", textTransform:"uppercase", letterSpacing:1}}>{k}</span>
              <span style={{fontSize: isMobile ? 14 : 16, fontWeight:700, color:"#f5a623"}}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{maxWidth:1300, margin:"0 auto", padding: isMobile ? "16px 16px" : "32px 32px"}}>

        {/* ── DISH COSTS ── */}
        {tab === "costs" && (
          <div>
            {/* Category filter */}
            <div style={{display:"flex", gap:8, flexWrap: isMobile ? "nowrap" : "wrap", overflowX: isMobile ? "auto" : "visible", marginBottom:16, paddingBottom: isMobile ? 4 : 0, WebkitOverflowScrolling:"touch"}}>
              {CATS.map(cat => (
                <button key={cat} onClick={() => setCatFilter(cat)} style={{
                  padding:"6px 14px", borderRadius:20, border:"1px solid", cursor:"pointer", fontSize:12, fontWeight:600, transition:"all .15s",
                  borderColor: catFilter===cat ? "#f5a623" : "#2a2a2a",
                  background: catFilter===cat ? "#f5a62320" : "transparent",
                  color: catFilter===cat ? "#f5a623" : "#666"
                }}>{cat}</button>
              ))}
            </div>

            {/* Dish grid */}
            <div style={{display:"grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill,minmax(340px,1fr))", gap: isMobile ? 12 : 16}}>
              {filteredDishes.map(dish => {
                const sell = sellPrices[dish.id] || 0;
                const fc = sell > 0 ? (dish.total / sell) * 100 : null;
                const isExp = expanded === dish.id;
                const fcColor = fc == null ? "#555" : fc < 25 ? "#4ade80" : fc < 35 ? "#f5a623" : "#f87171";
                return (
                  <div key={dish.id} style={{background:"#1a1a1a", borderRadius:12, border:"1px solid #252525", overflow:"hidden"}}>
                    <div style={{padding:"16px 20px", cursor:"pointer", display:"flex", alignItems:"flex-start", justifyContent:"space-between"}}
                      onClick={() => setExpanded(isExp ? null : dish.id)}>
                      <div>
                        <div style={{fontSize:14, fontWeight:700, color:"#e8e2d9", marginBottom:4}}>{dish.n}</div>
                        <div style={{fontSize:11, color:"#555", textTransform:"uppercase", letterSpacing:1}}>{dish.cat}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:20, fontWeight:800, color: dish.hasNull ? "#f59e0b" : "#f5a623"}}>{fmt(dish.total)}</div>
                        {dish.hasNull && <div style={{fontSize:10, color:"#f59e0b"}}>⚠ some prices missing</div>}
                      </div>
                    </div>

                    {/* Sell price + food cost */}
                    <div style={{padding:"0 20px 16px", display:"flex", alignItems:"center", gap:12}}>
                      <div style={{display:"flex", alignItems:"center", gap:6, flex:1}}>
                        <span style={{fontSize:11, color:"#555"}}>Sell £</span>
                        <input type="number" min={0} step={0.5} value={sellPrices[dish.id]||""} placeholder="0.00"
                          onChange={e => setSell(dish.id, e.target.value)}
                          style={{width:70, background:"#111", border:"1px solid #2a2a2a", borderRadius:6, padding:"4px 8px", color:"#e8e2d9", fontSize:13}}/>
                      </div>
                      {fc != null && (
                        <div style={{textAlign:"right"}}>
                          <div style={{fontSize:13, fontWeight:700, color:fcColor}}>FC: {fmtPct(fc)}</div>
                        </div>
                      )}
                      <button onClick={() => setExpanded(isExp?null:dish.id)}
                        style={{background:"none", border:"none", color:"#444", cursor:"pointer", fontSize:18, padding:0}}>
                        {isExp ? "▲" : "▼"}
                      </button>
                    </div>

                    {/* Breakdown */}
                    {isExp && (
                      <div style={{borderTop:"1px solid #222", padding:"12px 20px"}}>
                        {dish.breakdown.map((item,i) => (
                          <div key={i} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"4px 0", borderBottom:"1px solid #1e1e1e"}}>
                            <div>
                              <span style={{fontSize:12, color: item.isBatch ? "#a78bfa" : "#e8e2d9"}}>{item.name}</span>
                              <span style={{fontSize:11, color:"#444", marginLeft:8}}>{fmtQty(item.qty, item.unit)}</span>
                            </div>
                            <span style={{fontSize:12, fontWeight:600, color: item.missing ? "#f59e0b" : "#e8e2d9"}}>
                              {item.missing ? "N/A" : fmt(item.cost)}
                            </span>
                          </div>
                        ))}
                        <div style={{display:"flex", justifyContent:"space-between", paddingTop:8, borderTop:"1px solid #2a2a2a", marginTop:4}}>
                          <span style={{fontSize:13, fontWeight:700}}>Total</span>
                          <span style={{fontSize:13, fontWeight:800, color:"#f5a623"}}>{fmt(dish.total)}</span>
                        </div>
                        {dish.hasNull && <div style={{fontSize:11, color:"#f59e0b", marginTop:4}}>⚠ Incomplete — some ingredient prices not in supplier matrix</div>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── SUPPLIER OPTIMISER ── */}
        {tab === "supplier" && (
          <div>
            <div style={{marginBottom:16}}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom: isMobile ? 10 : 4, flexWrap:"wrap", gap:10}}>
                <h2 style={{fontSize: isMobile ? 17 : 20, fontWeight:800, margin:0}}>Supplier Optimiser</h2>
                <input value={ingSearch} onChange={e=>setIngSearch(e.target.value)} placeholder="Search…"
                  style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:8,padding:"8px 12px",color:"#e8e2d9",fontSize:13,width: isMobile ? "100%" : 220}}/>
              </div>
              {!isMobile && <p style={{fontSize:13, color:"#666", margin:0}}>{Object.keys(RAW).length} ingredients • always buy from the highlighted supplier to minimise cost</p>}
              <div style={{display:"flex", gap:6, flexWrap: isMobile ? "nowrap" : "wrap", overflowX: isMobile ? "auto" : "visible", paddingBottom: isMobile ? 4 : 0, WebkitOverflowScrolling:"touch", marginTop:12}}>
                {['All', 'Herbs', 'Fruit & Veg', 'Butchery', 'Dairy', 'Frozen', 'Bakery', 'Dry Store', 'Dry Spices', 'Drinks'].map(c => (
                  <button key={c} onClick={() => setSupCatFilter(c)} style={{
                    padding:"5px 12px", borderRadius:20, border:"1px solid", cursor:"pointer", fontSize:12, fontWeight:600, whiteSpace:"nowrap",
                    background: supCatFilter===c ? "#f5a623" : "transparent",
                    borderColor: supCatFilter===c ? "#f5a623" : "#333",
                    color: supCatFilter===c ? "#0e0e0e" : "#888"
                  }}>{c}</button>
                ))}
              </div>
            </div>

            <div style={{background:"#1a1a1a", borderRadius:12, border:"1px solid #252525", overflow:"hidden"}}>
              <div style={{overflowX: isMobile ? "auto" : "visible", WebkitOverflowScrolling:"touch"}}>
              <table style={{width:"100%", minWidth: isMobile ? 600 : "auto", borderCollapse:"collapse"}}>
                <thead>
                  <tr style={{background:"#141414", borderBottom:"2px solid #252525"}}>
                    {[["name","Ingredient"],["best","Best Price"],["saving","Max Saving"]].map(([col,label]) => (
                      <th key={col} onClick={() => toggleSort(col)} style={{padding:"12px 16px", textAlign:"left", fontSize:11, color:"#666", textTransform:"uppercase", letterSpacing:1, cursor:"pointer", userSelect:"none"}}>
                        {label} {sortCol===col ? (sortDir>0?"↑":"↓") : ""}
                      </th>
                    ))}
                    {Object.keys(SL).map(s => (
                      <th key={s} style={{padding:"12px 8px", textAlign:"center", fontSize:11, color:"#444", textTransform:"uppercase", letterSpacing:1}}>{s}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {supIngredients.map((ing,i) => {
                    const best = ing.best;
                    return (
                      <tr key={ing.id} style={{borderBottom:"1px solid #1e1e1e", background: i%2===0?"transparent":"#161616"}}>
                        <td style={{padding:"10px 16px", fontSize:13}}>{ing.name}</td>
                        <td style={{padding:"10px 16px"}}>
                          <div style={{fontSize:13, fontWeight:700, color:"#f5a623"}}>{best ? fmt(best[1]) : "—"}</div>
                          <div style={{fontSize:11, color:"#555"}}>{best ? (SL[best[0]]||best[0]) : ""} · per {fmtQty(ing.qty, ing.unit)}</div>
                        </td>
                        <td style={{padding:"10px 16px", fontSize:13, color: ing.saving > 2 ? "#4ade80" : "#e8e2d9", fontWeight: ing.saving > 2 ? 700 : 400}}>
                          {ing.saving > 0.01 ? `+${fmt(ing.saving)}` : "—"}
                        </td>
                        {Object.keys(SL).map(s => {
                          const price = ing.prices.find(x=>x.s===s);
                          const isBest = best && best[0]===s;
                          return (
                            <td key={s} style={{padding:"10px 8px", textAlign:"center"}}>
                              {price ? (
                                <span style={{
                                  fontSize:12, padding:"2px 6px", borderRadius:4, fontWeight: isBest?700:400,
                                  background: isBest?"#f5a62330":"transparent",
                                  color: isBest?"#f5a623":"#666"
                                }}>
                                  {isBest?"★ ":""}{fmt(price.p)}
                                </span>
                              ) : <span style={{color:"#2a2a2a",fontSize:11}}>—</span>}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        )}

        {/* ── BATCH COSTS ── */}
        {tab === "batch" && (
          <div>
            <div style={{marginBottom:16}}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom: isMobile ? 10 : 4, flexWrap:"wrap", gap:10}}>
                <h2 style={{fontSize: isMobile ? 17 : 20, fontWeight:800, margin:0}}>Batch Recipe Costs</h2>
                <input value={batchSearch} onChange={e=>setBatchSearch(e.target.value)} placeholder="Search batch…"
                  style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:8,padding:"8px 12px",color:"#e8e2d9",fontSize:13,width: isMobile ? "100%" : 220}}/>
              </div>
              {!isMobile && <p style={{fontSize:13, color:"#666", margin:0}}>{Object.keys(BATCHES).length} batch recipes • purple = uses another batch output as ingredient</p>}
            </div>

            {["Protein","Bases","Sauces","Pickles","Veg","Dry Mixes","Dairy","Bakery","Desserts"].map(catName => {
              const items = batchList.filter(b => b.cat === catName);
              if (!items.length) return null;
              return (
                <div key={catName} style={{marginBottom:28}}>
                  <div style={{fontSize:11, color:"#f5a623", textTransform:"uppercase", letterSpacing:2, fontWeight:700, marginBottom:10}}>{catName}</div>
                  <div style={{background:"#1a1a1a", borderRadius:12, border:"1px solid #252525", overflow:"hidden"}}>
                    <div style={{overflowX: isMobile ? "auto" : "visible", WebkitOverflowScrolling:"touch"}}>
                    <table style={{width:"100%", minWidth: isMobile ? 480 : "auto", borderCollapse:"collapse"}}>
                      <thead>
                        <tr style={{background:"#141414", borderBottom:"1px solid #252525"}}>
                          {["Batch Recipe","Yield","Cost / Batch","Cost / Unit","Notes"].map(h => (
                            <th key={h} style={{padding:"10px 16px", textAlign:"left", fontSize:11, color:"#555", textTransform:"uppercase", letterSpacing:1}}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((bt,i) => {
                          const hasBatchDep = BATCHES[bt.id]?.ings.some(i=>i.t==="b");
                          return (
                            <tr key={bt.id} style={{borderBottom:"1px solid #1e1e1e", background:i%2===0?"transparent":"#161616"}}>
                              <td style={{padding:"10px 16px"}}>
                                <span style={{fontSize:13, color: hasBatchDep?"#a78bfa":"#e8e2d9"}}>{bt.name}</span>
                              </td>
                              <td style={{padding:"10px 16px", fontSize:13, color:"#888"}}>{fmtQty(bt.yield, bt.yu)}</td>
                              <td style={{padding:"10px 16px", fontSize:14, fontWeight:700, color:"#f5a623"}}>{fmt(bt.total)}</td>
                              <td style={{padding:"10px 16px"}}>
                                <div style={{fontSize:13, color:"#e8e2d9"}}>
                                  {bt.perUnit != null ? `£${bt.perUnit.toFixed(4)}` : "—"} /{bt.yu==="g"?"g":bt.yu==="ml"?"ml":bt.yu}
                                </div>
                              </td>
                              <td style={{padding:"10px 16px", fontSize:11, color:"#555"}}>
                                {bt.hasNull && "⚠ incomplete"}
                                {hasBatchDep && <span style={{color:"#a78bfa", marginLeft:4}}>◆ uses sub-batch</span>}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── PREP PLANNER ── */}
        {tab === "planner" && (
          <div>
            <h2 style={{fontSize: isMobile ? 17 : 20, fontWeight:800, marginBottom:4}}>Daily Prep Planner</h2>
            {!isMobile && <p style={{fontSize:13, color:"#666", marginBottom:24}}>Enter expected covers per dish → get batch quantities to prep + full ingredient shopping list</p>}

            {/* Cover inputs */}
            <div style={{background:"#1a1a1a", borderRadius:12, border:"1px solid #252525", padding:24, marginBottom:24}}>
              <div style={{fontSize:12, color:"#f5a623", textTransform:"uppercase", letterSpacing:2, fontWeight:700, marginBottom:16}}>Expected Covers</div>
              <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:8}}>
                {CATS.slice(1).map(cat => {
                  const dishesInCat = Object.entries(DISHES).filter(([,d])=>d.cat===cat);
                  if (!dishesInCat.length) return null;
                  return (
                    <div key={cat}>
                      <div style={{fontSize:10, color:"#555", textTransform:"uppercase", letterSpacing:1, marginBottom:6}}>{cat}</div>
                      {dishesInCat.map(([id,dish]) => (
                        <div key={id} style={{display:"flex", alignItems:"center", gap:8, marginBottom:4}}>
                          <label style={{fontSize:12, color:"#888", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{dish.n}</label>
                          <input type="number" min={0} value={covers[id]||""} placeholder="0"
                            onChange={e => setCover(id, e.target.value)}
                            style={{width:56, background:"#111", border:"1px solid #2a2a2a", borderRadius:6, padding:"3px 8px", color:"#e8e2d9", fontSize:13, textAlign:"center"}}/>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
              <button onClick={() => setCovers({})} style={{marginTop:16, background:"transparent", border:"1px solid #2a2a2a", borderRadius:8, padding:"6px 16px", color:"#666", fontSize:12, cursor:"pointer"}}>
                Clear All
              </button>
            </div>

            {Object.values(covers).some(v=>v>0) && (
              <>
                {/* Batches to make */}
                <div style={{marginBottom:24}}>
                  <div style={{fontSize:14, fontWeight:700, marginBottom:12, color:"#e8e2d9"}}>Batches to Make</div>
                  <div style={{background:"#1a1a1a", borderRadius:12, border:"1px solid #252525", overflow:"hidden"}}>
                    <div style={{overflowX: isMobile ? "auto" : "visible", WebkitOverflowScrolling:"touch"}}>
                    <table style={{width:"100%", minWidth: isMobile ? 480 : "auto", borderCollapse:"collapse"}}>
                      <thead>
                        <tr style={{background:"#141414", borderBottom:"1px solid #252525"}}>
                          {["Batch Recipe","Category","Qty Needed","# Batches to Make","Estimated Cost"].map(h=>(
                            <th key={h} style={{padding:"10px 16px", textAlign:"left", fontSize:11, color:"#555", textTransform:"uppercase", letterSpacing:1}}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {prepPlan.batchesToMake.map((bt,i) => (
                          <tr key={bt.id} style={{borderBottom:"1px solid #1e1e1e", background:i%2===0?"transparent":"#161616"}}>
                            <td style={{padding:"10px 16px", fontSize:13}}>{bt.name}</td>
                            <td style={{padding:"10px 16px", fontSize:12, color:"#555"}}>{bt.cat}</td>
                            <td style={{padding:"10px 16px", fontSize:13, color:"#888"}}>{fmtQty(Math.round(bt.unitsNeeded), bt.yu)}</td>
                            <td style={{padding:"10px 16px"}}>
                              <span style={{fontSize:16, fontWeight:800, color:"#f5a623"}}>{bt.batchesNeeded}×</span>
                              <span style={{fontSize:11, color:"#555", marginLeft:6}}>({fmtQty(bt.batchYield, bt.yu)} each)</span>
                            </td>
                            <td style={{padding:"10px 16px", fontSize:13, color:"#e8e2d9"}}>{bt.totalCost != null ? fmt(bt.totalCost) : "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </div>
                  </div>
                </div>

                {/* Shopping list */}
                <div>
                  <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12, flexWrap:"wrap", gap:8}}>
                    <div style={{fontSize: isMobile ? 13 : 14, fontWeight:700, color:"#e8e2d9"}}>Raw Ingredient Shopping List</div>
                    <div style={{fontSize: isMobile ? 14 : 16, fontWeight:800, color:"#f5a623"}}>Est. Total: {fmt(totalOrderValue)}</div>
                  </div>
                  <div style={{background:"#1a1a1a", borderRadius:12, border:"1px solid #252525", overflow:"hidden"}}>
                    <div style={{overflowX: isMobile ? "auto" : "visible", WebkitOverflowScrolling:"touch"}}>
                    <table style={{width:"100%", minWidth: isMobile ? 480 : "auto", borderCollapse:"collapse"}}>
                      <thead>
                        <tr style={{background:"#141414", borderBottom:"1px solid #252525"}}>
                          {["Ingredient","Total Qty Needed","Packages","Best Supplier","Cost"].map(h=>(
                            <th key={h} style={{padding:"10px 16px", textAlign:"left", fontSize:11, color:"#555", textTransform:"uppercase", letterSpacing:1}}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {prepPlan.shopping.map((item,i) => (
                          <tr key={item.id} style={{borderBottom:"1px solid #1e1e1e", background:i%2===0?"transparent":"#161616"}}>
                            <td style={{padding:"10px 16px", fontSize:13}}>{item.name}</td>
                            <td style={{padding:"10px 16px", fontSize:13, color:"#888"}}>{fmtQty(Math.round(item.totalQty), item.unit)}</td>
                            <td style={{padding:"10px 16px"}}>
                              <span style={{fontSize:14, fontWeight:700, color:"#f5a623"}}>{item.pkgsNeeded}</span>
                              <span style={{fontSize:11, color:"#555", marginLeft:4}}>× {fmtQty(item.pkgSize, item.unit)}</span>
                            </td>
                            <td style={{padding:"10px 16px"}}>
                              {item.supplier ? (
                                <span style={{fontSize:12, background:"#f5a62315", color:"#f5a623", borderRadius:6, padding:"2px 8px", fontWeight:600}}>
                                  {item.supplier} · {item.supplierName}
                                </span>
                              ) : <span style={{color:"#555", fontSize:12}}>No price data</span>}
                            </td>
                            <td style={{padding:"10px 16px", fontSize:13, fontWeight:600, color: item.totalCost ? "#e8e2d9" : "#555"}}>
                              {item.totalCost != null ? fmt(item.totalCost) : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </div>
                  </div>
                  <div style={{fontSize:11, color:"#444", marginTop:12}}>
                    ⚠ Quantities account for batch recipe needs only. Add buffer stock as required. Items with no price data are excluded from order total.
                  </div>
                </div>
              </>
            )}

            {!Object.values(covers).some(v=>v>0) && (
              <div style={{textAlign:"center", padding:"60px 0", color:"#333", fontSize:14}}>
                Enter cover counts above to generate your prep list ↑
              </div>
            )}
          </div>
        )}
      </div>

      {/* MOBILE BOTTOM NAV */}
      {isMobile && (
        <div style={{position:"fixed", bottom:0, left:0, right:0, background:"#141414", borderTop:"1px solid #2a2218", display:"flex", zIndex:100}}>
          {tabs.map(([id,emoji,label]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              flex:1, padding:"10px 0", border:"none", cursor:"pointer", background:"transparent",
              display:"flex", flexDirection:"column", alignItems:"center", gap:2,
              color: tab===id ? "#f5a623" : "#555", transition:"color .15s"
            }}>
              <span style={{fontSize:20}}>{emoji}</span>
              <span style={{fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5}}>{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
