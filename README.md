# 🏛️ Better Taytay

A community-led, open-source portal designed to make the government of the **Municipality of Taytay** accessible, transparent, and user-friendly.

This project is a municipal-focused fork of [BetterGov.ph](https://bettergov.ph), adapted to meet the specific needs of Taytayeños, while acknowledging the upstream project [BetterLB](https://betterlb.org) as its primary codebase source.

---
### Inspirations

BetterGov.PH https://github.com/bettergovph/bettergov
BetterSolano.org https://github.com/BetterSolano/bettersolano
Betterlocalgov https://github.com/iyanski/betterlocalgov

### Portal Features
BetterTaytay provides Taytay with:
- **Public Services Directory**: Comprehensive guide to municipal services with requirements, fees, and step-by-step processes
- **Legislative Portal**: Access to ordinances, resolutions, and executive orders from the Sangguniang Bayan
- **Transparency Dashboard**: Financial data, procurement bids, and infrastructure projects
- **Government Directory**: Contact information for all municipal departments and officials
- **Multi-language Support**: English and Filipino translations

---

## 🔄 Forking for Your LGU

BetterTaytay is designed to be easily adapted for any Local Government Unit (LGU) in the Philippines, building upon BetterLB's forking architecture.

## Quick Start for Other LGUs

1. **Edit Configuration**: Update `/config/lgu.config.json` with your LGU details
2. **Update Translations**: Modify `/public/locales/en/common.json` for LGU-specific text
3. **Add Your Data**: Replace data files in `/src/data/` with your municipality's information
4. **Build and Test**: Run `npm install && npm run build`

### Configuration Files to Edit

| File | What to Change |
|------|------------------|
| `/config/lgu.config.json` | All LGU settings (name, province, coordinates, branding, transparency config) |
| `/public/locales/en/common.json` | UI text strings (hero title, footer copyright, government section) |
| `/src/data/directory/departments.json` | Municipal departments and offices |
| `/src/data/directory/barangays.json` | Barangay information |
| `/src/data/services/categories/*.json` | Public services data by category |

### Key Configuration Fields

| Field | Description | Example (Taytay) |
|-------|-------------|---------------------|
| `lgu.name` | Short municipality name | "Taytay" |
| `lgu.fullName` | Full official name | "Municipality of Taytay" |
| `lgu.province` | Province name | "Rizal" |
| `lgu.region` | Region name | "Region IV-A" |
| `lgu.regionCode` | Region code | "CALABARZON" |
| `lgu.type` | LGU type | "municipality" or "city" |
| `lgu.officialWebsite` | Official LGU website | "https://www.taytayrizal.gov.ph" |
| `portal.name` | Portal name | "BetterTaytay" |
| `portal.baseUrl` | Portal base URL | "https://bettertaytay.org" |
| `portal.tagline` | Portal tagline | "Community Powered Taytay Portal" |

**Note:** See [`FORKING.md`](./FORKING.md) for comprehensive forking instructions including database setup for legislative data.

## Technical Stack
*   **Frontend**: React 19, Vite, TypeScript (Strict mode)
*   **Styling**: Tailwind CSS v4 (CSS variables, high-contrast tokens)
*   **Backend**: Cloudflare Pages Functions (TypeScript)
*   **Data**: Structured JSON (Modular category-based architecture)
*   **Search**: Meilisearch with Fuse.js fuzzy search
*   **Localization**: i18next with English & Filipino support
*   **Maps**: Leaflet for geospatial visualizations
*   **Data Pipeline**: Python scripts for legislative document processing
*   **Testing**: Playwright (E2E tests across multiple browsers)
*   **Code Quality**: ESLint, Prettier, Husky pre-commit hooks

---

## Project Structure

```
bettertaytay/
├── e2e/                         # End-to-end tests
│   └── utils/                   # Test helpers and shared testing logic
├── functions/                   # Serverless / backend functions (Cloudflare Pages)
│   └── api/                     # API endpoints and handlers
├── pipeline/                    # Data processing pipeline (Python side)
│   ├── data/                    # Structured source documents
│   │   └── pdfs/                # Source legislative PDFs
│   │       ├── executive_orders/
│   │       ├── ordinances/
│   │       └── resolutions/
│   └── __pycache__/             # Python cache (auto-generated)
├── public/                      # Static public assets
│   ├── assets/                  # General media assets
│   ├── locales/                 # Translation files (en, fil)
│   └── logos/                   # Logo exports
├── raw_data/                    # Unprocessed data before pipeline cleanup
├── scripts/                     # Automation, maintenance, and build scripts
├── src/                         # Main application source code
│   ├── components/              # Reusable UI components
│   │   ├── data-display/        # Tables, cards, and record viewers
│   │   ├── home/                # Homepage-specific components
│   │   ├── layout/              # Layout wrappers, grids, headers, footers
│   │   ├── map/                 # Map visualizations and geospatial UI
│   │   ├── navigation/          # Menus, navbars, breadcrumbs
│   │   ├── search/              # Search bars, filters, query UI
│   │   ├── ui/                  # Generic UI elements (buttons, modals, etc.)
│   │   └── widgets/             # Small reusable info widgets
│   ├── constants/               # App-wide constant values and config
│   ├── data/                    # Structured frontend data layer
│   │   ├── about/               # About page content
│   │   ├── directory/           # Government directory datasets
│   │   │   └── schema/          # Data schemas for directory records
│   │   ├── legislation/         # Legislative data
│   │   │   ├── committees/
│   │   │   ├── documents/
│   │   │   │   └── sb_12/       # Session-specific legislative docs
│   │   │   ├── persons/         # Councilors, authors, sponsors
│   │   │   ├── sessions/        # Legislative sessions
│   │   │   │   └── sb_12/
│   │   │   └── term/            # Term metadata
│   │   ├── schema/              # Global data schemas
│   │   ├── services/            # Public service datasets
│   │   │   └── categories/      # Service classifications
│   │   ├── statistics/          # Municipality statistics datasets
│   │   └── transparency/        # Transparency and governance data
│   ├── hooks/                   # Custom reusable frontend hooks
│   ├── i18n/                    # Internationalization setup and config
│   │   ├── languages.ts         # Language definitions (English, Filipino)
│   │   └── README.md            # Translation guide
│   ├── lib/                     # Utility libraries and helpers
│   ├── pages/                   # Route-level pages (site sections)
│   │   ├── about/
│   │   ├── accessibility/
│   │   ├── contribute/
│   │   ├── data/                # Open data portal pages
│   │   ├── government/          # Government structure pages
│   │   │   ├── barangays/
│   │   │   ├── departments/
│   │   │   ├── elected-officials/
│   │   │   └── executive/
│   │   ├── legislation/         # Legislative portal for Ordinances/Resolutions/Executive Orders
│   │   ├── services/            # Public services portal
│   │   ├── sitemap/             # Human-readable sitemap
│   │   ├── statistics/          # Statistics portal
│   │   └── transparency/        # Transparency portal
│   │       ├── bids/
│   │       ├── components/
│   │       ├── financial/
│   │       ├── infrastructure/
│   │       └── procurement/
│   └── types/                   # Type definitions (TypeScript or schemas)
└── (root config files)          # package.json, build configs, .env files
```

### Key Components
- **Service Directory**: Categorized services from `src/data/services/categories/`
- **Legislative Portal**: Ordinances, resolutions, executive orders with document parsing
- **Transparency Portal**: Financial data, procurement, bids, infrastructure projects
- **Search Integration**: Meilisearch-powered search with real-time indexing
- **Internationalization**: Multi-language support with i18next

### Taytay-Specific Data

BetterTaytay includes structured data for Taytay:

| Data Type | Location | Description |
|-----------|----------|-------------|
| **Departments** | `/src/data/directory/departments.json` | Municipal departments and offices with contact info |
| **Barangays** | `/src/data/directory/barangays.json` | 5 barangay profiles and officials |
| **Services** | `/src/data/services/categories/*.json` | Public services by category (BPLO, Assessor, Engineering, etc.) |
| **Citizens Charter** | `/src/data/citizens-charter/citizens-charter.json` | Service requirements, fees, and client steps |
| **Legislation** | Cloudflare D1 Database | Ordinances, resolutions, executive orders |
| **Statistics** | `/src/data/statistics/` | Municipal demographics and indicators |

#### Data Pipeline for Legislative Documents

Taytay legislative documents are processed through a Python pipeline:

1. **Scrape** (`pipeline/1_scrape.py`) - Download PDFs from official sources
2. **Normalize** (`pipeline/1.5_normalize.py`) - Standardize filenames and metadata
3. **Parse** (`pipeline/3_parse.py`) - Extract text and metadata from PDFs
4. **Generate** (`pipeline/4_generate.py`) - Create structured JSON for database import

See [`pipeline/README.md`](./pipeline/README.md) for complete documentation.

---

## 🚀 How to Run Locally

### 1. Clone and Install
```bash
git clone https://github.com/zzelif/bettertaytay.git
cd bettertaytay
npm install
```

### 2. Prepare Data
Since the service directory is split into manageable category files, you must merge them before running the app:
```bash
python3 scripts/merge_services.py
```

### 3. Start Development Server
```bash
npm run dev
```
**Access the portal at:** `http://localhost:5173`

### 4. Running Tests
```bash
npm run test:e2e        # Run all end-to-end tests
npm run lint            # Check code quality (max warnings = 0)
npm run format          # Format code with Prettier
```

### 5. Building for Production
```bash
npm run build           # Combines merge_services, TypeScript, and Vite build
```

**Note:** The build script runs `node scripts/generate-seo.js && npm run merge:services && tsc && vite build` automatically

---

## 🏛️ Taytay Government Structure

### Executive Branch
- **Mayor**: Chief executive officer of the municipality
- **Vice Mayor**: Presiding officer of the Sangguniang Bayan and mayoral successor
- **Municipal Departments**: Administrative offices implementing municipal programs

### Legislative Branch (Sangguniang Bayan)
The Sangguniang Bayan is the legislative body of Taytay, composed of:
- **Vice Mayor** (Presiding Officer - Jan Victor B. Cabitac)
- **8 Regular Councilors** (Joanne Marie P. Calderon, Rulf Marius G. Valera, John Tobit E. Cruz, Carizza A. Cortez, Ma. Elaine T. Leonardo, Patrick John P. Alcantara, Mitchell B. Bermundo, Kristofer Charls S. Esguerra)
- **2 Ex-Officio Councilors** (Liga ng mga Barangay President Roseller Z. Valera and SK Federation President Lucia Marie D. Alcantara)

### Key Departments
- **BPLO**: Business Permit and Licensing Office
- **MTO**: Municipal Treasurer's Office
- **Assessor's Office**: Property assessment and taxation
- **Engineering Office**: Infrastructure and public works
- **MPDC**: Municipal Planning and Development Coordinator
- **LCR**: Local Civil Registry
- **Municipal Health Office**: Public health services
- **Municipal Agriculture Office**: Agricultural programs

See the [Government Directory](https://bettertaytay.pages.dev/government) on the live site for complete department listings and contact information.

---

## Join the Grassroots Movement
We are looking for volunteers passionate individuals who want to make Taytay a better place. You don't need to be a developer to help!

### How You Can Contribute:
1.  **Non-Developers**: Visit the `/contribute` page on the live site to suggest new services or fix outdated information using our simple web form.
2.  **Developers**: Check the [Issues](https://github.com/zzelif/bettertaytay/issues) tab for "Help Wanted" or "Good First Issue" labels.
3.  **Data Auditors**: Help us verify community submissions on GitHub to ensure the portal remains an authoritative source of information.
4.  **Translators**: Help translate the portal to Filipino and other Philippine languages by working on `public/locales/` files.

### Development Workflow
- Follow [Conventional Commits](https://www.conventionalcommits.org/) (enforced via commitlint)
- All PRs run ESLint and Prettier automatically
- E2E tests run on CI to ensure cross-browser compatibility

---

## 🚢 Deployment

### Production Deployment (BetterTaytay)

BetterTaytay is deployed on **Cloudflare Pages** with:
- **Frontend**: Vite build automatically deployed on push to `main` branch
- **Backend**: Cloudflare Pages Functions for API endpoints
- **Database**: Cloudflare D1 (`bettertaytay_openlgu`) for legislative data
- **Search**: Meilisearch instance for fuzzy search
- **KV Storage**: Weather data caching with automatic updates

### Deployment for Other LGUs

When deploying for your own LGU:

1. **Cloudflare Pages**: Connect your GitHub repository
2. **Environment Variables**: Configure your D1 database binding
3. **Custom Domain**: Set up your custom domain (e.g., `betterlgu.gov.ph`)
4. **Database Migration**: Run database migrations on remote D1 instance
5. **Meilisearch**: Deploy your own Meilisearch instance or use alternative search

See [`ARCHITECTURE.md`](./ARCHITECTURE.md#deployment) for detailed deployment strategies.

## License and Data Sources

### Code License
This project is released under the [Creative Commons CC0](https://creativecommons.org/publicdomain/zero/1.0/) dedication. The work is dedicated to the public domain and can be freely used, modified, and distributed without restriction.

### Data Attribution
BetterTaytay aggregates data from multiple sources:

| Data Source | Type | Attribution |
|-------------|------|-------------|
| **Municipality of Taytay** | Official government data, services directory | Public domain |
| **Philippine Government Procurement Portal (PhilGEPS)** | Procurement bids and awards | Republic of the Philippines |
| **Department of Budget and Management (DBM)** | Financial releases | Republic of the Philippines |
| **Department of Public Works and Highways (DPWH)** | Infrastructure projects | Republic of the Philippines |
| **Official Gazette of the Philippines** | Legislative documents reference | Republic of the Philippines |

**Note**: Data is presented as-is and may not reflect the most current information. Always verify with official LGU sources.

---

## 📞 Contact and Support

### For Taytayeños
- **Website**: https://bettertaytay.org
- **GitHub Issues**: Report bugs or suggest features at [github.com/zzelif/bettertaytay/issues](https://github.com/zzelif/bettertaytay/issues)
- **Community**: Join our community contributions via the "Contribute" page on the portal

### For Other LGUs
- **Forking Guide**: See [`FORKING.md`](./FORKING.md) for detailed instructions
- **Architecture**: See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for system design
- **Documentation**: See [`docs/`](./docs/) for comprehensive guides
