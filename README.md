# Chamo Stock Management System

A full dish costing, supplier optimisation, batch recipe costing, and daily prep planning tool.

---

## Deploying to Vercel

### First time setup

1. **Create a GitHub account** at github.com (free)
2. **Create a new repository** — click the + icon → New repository → name it `chamo-stock` → Create
3. **Upload these files** to the repo (drag and drop in the GitHub interface)
4. **Create a Vercel account** at vercel.com using your GitHub login
5. In Vercel, click **Add New → Project** → select your `chamo-stock` repo
6. Leave all settings as default → click **Deploy**
7. Done — you'll get a live URL like `chamo-stock.vercel.app`

### Updating after the first deploy

1. Edit `src/App.jsx` (see sections below)
2. Save the file and upload/push to GitHub
3. Vercel automatically redeploys — live in ~30 seconds

---

## How to update the data

All data lives in **`src/App.jsx`**. You don't need to touch any other file.

---

### Updating a supplier price

Find the ingredient in the `RAW` section near the top of the file. Each line looks like this:

```js
chuck_roll: { n:"Chuck Roll/Steak (per kg)", q:1000, u:"g", p:{ S:12.22, B:11.25, AFS:11.00 } },
```

- `n` = display name
- `q` = package size (in grams, ml, or units)
- `u` = unit (`"g"`, `"ml"`, `"ea"`)
- `p` = prices by supplier code (see supplier codes below)

**To update a price**, change the number after the supplier code:
```js
p:{ S:12.22, B:11.50, AFS:11.00 }   // changed Brakes from 11.25 to 11.50
```

**To add a new supplier price** for an ingredient, add it to the `p` object:
```js
p:{ S:12.22, B:11.25, AFS:11.00, TP:13.50 }   // added Turner & Price
```

### Supplier codes

| Code | Supplier |
|------|----------|
| TP | Turner & Price |
| S | Sysco |
| B | Brakes |
| AFS | AFS |
| CM | CM |
| WF | WF |
| AC | AC |
| Envior | Envior |
| FEO | Far East Oriental |

---

### Adding a new ingredient

Add a new line to the `RAW` section:

```js
my_ingredient: { n:"My Ingredient (pack size)", q:500, u:"g", p:{ TP:3.50, B:3.10 } },
```

Pick a short unique key (no spaces), set the package size and unit, and add prices.

---

### Adding a new dish

Find the `DISHES` section. Copy an existing dish from the same category and edit it:

```js
my_new_dish: { n:"My New Dish", cat:"Burgers", ings:[
  r("brioche_bun", 1, "ea"),          // raw ingredient: 1 brioche bun
  b("pulled_beef", 100, "g"),         // batch ingredient: 100g pulled beef
  b("chipotle_mayo", 20, "ml"),       // batch ingredient: 20ml chipotle mayo
  r("cheddar", 20, "g"),              // raw ingredient: 20g cheddar
]},
```

- Use `r(id, qty, unit)` for raw ingredients (things you buy)
- Use `b(id, qty, unit)` for batch recipe outputs (things you make)
- `id` must match an existing key in `RAW` or `BATCHES`
- `cat` must be one of: `"Small Plates"`, `"Lunch"`, `"Arepas"`, `"Tacos (Hard)"`, `"Tacos (Soft)"`, `"Burgers"`, `"Tenders"`, `"Sandos"`, `"Loaded Fries/Tots"`, `"Sides"`, `"Desserts"`, `"Sharing"`

---

### Adding a new batch recipe

Find the `BATCHES` section and add:

```js
my_sauce: { n:"My Sauce", yield:1000, yu:"ml", cat:"Sauces", ings:[
  r("mayo", 800, "ml"),
  r("lime_juice", 50, "ml"),
  r("garlic_pow", 20, "g"),
]},
```

- `yield` = total output quantity
- `yu` = yield unit (`"g"`, `"ml"`, `"ea"`, `"bag"`, `"portion"`)
- `cat` = one of: `"Protein"`, `"Bases"`, `"Sauces"`, `"Pickles"`, `"Veg"`, `"Dry Mixes"`, `"Dairy"`, `"Bakery"`, `"Desserts"`

---

## Running locally (optional)

If you want to preview changes before pushing to GitHub:

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.
