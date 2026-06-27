<p align="center">
  <img src="https://static.vecteezy.com/system/resources/thumbnails/019/813/207/small/modern-medical-and-health-care-center-ayurvedic-logo-design-illustration-free-vector.jpg" width="120" alt="AyurSync Logo"/>
</p>

<h1 align="center">AyurSync EMR</h1>

<p align="center">
  <strong>A Production-Grade Dual-Coding Medical API Gateway bridging Traditional Indian Medicine (NAMASTE) with WHO ICD-11 TM2 International Standards</strong>
</p>

<p align="center">
  <a href="#architecture">Architecture</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#features">Features</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#api-reference">API Reference</a> •
  <a href="#database-setup">Database Setup</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/WHO_ICD--11-0072C6?style=for-the-badge&logo=world-health-organization&logoColor=white" alt="WHO ICD-11"/>
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"/>
</p>


## 🏥 Problem Statement (SIH 2025 - PS Code: SIH25026)

> *Develop API code to integrate NAMASTE and/or the International Classification of Diseases (ICD-11) via the Traditional Medicine Module 2 (TM2) into existing EMR systems that comply with Electronic Health Record (EHR) Standards for India.*

India's traditional medicine systems - **Ayurveda, Yoga, Unani, Siddha, Sowa-Rigpa, and Homeopathy (AYUSH)** - serve over 500 million patients annually. Yet, no production-grade interoperability layer exists that maps these indigenous terminology standards to the globally recognized WHO ICD-11 classification system.

**AyurSync EMR** solves this by providing a fully automated, real-time dual-coding engine that:

1. Maps **NAMASTE-coded** traditional disease terms to their corresponding **ICD-11 TM2** codes
2. Maintains live synchronization with the **official WHO ICD-11 API** to ensure mappings are always current
3. Exposes a clean, RESTful interface that any existing EMR/EHR system can integrate with zero friction


## 🏗️ Architecture <a id="architecture"></a>

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│   ┌───────────────────────────────────────────────────────┐     │
│   │   React 18 + TypeScript + Vite                        │     │
│   │   ┌─────────────────┐  ┌────────────────────────┐     │     │
│   │   │ Clinical Search │  │ Core Automation Sync   │     │     │
│   │   │  (GET Interface)│  │   (POST Interface)     │     │     │
│   │   └────────┬────────┘  └───────────┬────────────┘     │     │
│   │            │                       │                  │     │
│   └────────────┼───────────────────────┼──────────────────┘     │
│                │        REST API       │                        │
└────────────────┼───────────────────────┼────────────────────────┘
                 │                       │
┌────────────────┼───────────────────────┼────────────────────────┐
│                ▼    API GATEWAY LAYER  ▼                        │
│   ┌──────────────────────────────────────────────────────┐      │
│   │        FastAPI Server (Uvicorn ASGI)                  │      │
│   │  ┌──────────────┐  ┌──────────────┐ ┌────────────┐  │      │
│   │  │ /api/v1/     │  │ Pydantic     │ │  CORS      │  │      │
│   │  │   search     │  │ Strict       │ │  Middleware │  │      │
│   │  │   sync/      │  │ Schemas      │ │            │  │      │
│   │  └──────┬───────┘  └──────────────┘ └────────────┘  │      │
│   │         │                                            │      │
│   └─────────┼────────────────────────────────────────────┘      │
│             │                                                   │
└─────────────┼───────────────────────────────────────────────────┘
              │
   ┌──────────┴──────────────────────────────────┐
   │                                             │
   ▼                                             ▼
┌──────────────────────────┐  ┌──────────────────────────────────┐
│   PERSISTENCE LAYER      │  │   EXTERNAL SERVICES              │
│                          │  │                                  │
│  ┌────────────────────┐  │  │  ┌────────────────────────────┐  │
│  │ Supabase           │  │  │  │ WHO ICD-11 API             │  │
│  │ (PostgreSQL)       │  │  │  │                            │  │
│  │                    │  │  │  │ • OAuth2 Token Exchange    │  │
│  │ terminology_map    │  │  │  │ • /icd/release/11/mms      │  │
│  │ ┌──────────────┐   │  │  │  │ • /mms/autocode            │  │
│  │ │ id           │   │  │  │  │                            │  │
│  │ │ traditional_ │   │  │  │  │ Real-time linearization    │  │
│  │ │   term_name  │   │  │  │  │ parsing & version          │  │
│  │ │ namaste_     │   │  │  │  │ tracking                   │  │
│  │ │   system_code│   │  │  │  └────────────────────────────┘  │
│  │ │ icd11_tm2_   │   │  │  │                                  │
│  │ │   code       │   │  │  └──────────────────────────────────┘
│  │ │ conventional_│   │  │
│  │ │   english_   │   │  │
│  │ │   title      │   │  │
│  │ │ system_      │   │  │
│  │ │   version    │   │  │
│  │ └──────────────┘   │  │
│  └────────────────────┘  │
└──────────────────────────┘
```


## ⚡ Tech Stack <a id="tech-stack"></a>

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + TypeScript | Type-safe, component-driven clinical UI |
| **Build Tool** | Vite 5 | Sub-second HMR, ESM-native bundling |
| **API Server** | FastAPI (Uvicorn ASGI) | High-performance async Python API gateway |
| **Data Validation** | Pydantic v2 | Strict runtime schema enforcement on every request/response |
| **Database** | Supabase (PostgreSQL) | Managed PostgreSQL with Row-Level Security & real-time subscriptions |
| **HTTP Client** | httpx (AsyncClient) | Non-blocking HTTP/2 calls to WHO identity servers |
| **Auth Protocol** | OAuth 2.0 (Client Credentials) | Machine-to-machine authentication with WHO ICD Access Management |
| **Medical Standard** | WHO ICD-11 TM2 + NAMASTE | Dual-coding interoperability between Indian & international classifications |


## 🔥 Features <a id="features"></a>

### 🔍 Clinical Search Engine (`GET /api/v1/search`)
- **Full-text fuzzy search** across traditional disease terminology using PostgreSQL `ILIKE` pattern matching
- Returns structured dual-code mappings: NAMASTE system code ↔ ICD-11 TM2 code ↔ biomedical English title
- Pydantic-validated response schema ensures every result is type-safe and API-contract compliant
- Sub-100ms query latency on indexed Supabase tables

### 🔄 Automated WHO Sync Engine (`POST /api/v1/sync/auto-update`)
- **5-step live synchronization pipeline** against official WHO ICD-11 API:
  1. Queries the current baseline version from PostgreSQL
  2. Performs OAuth2 Client Credentials handshake with WHO Identity Provider (`icdaccessmanagement.who.int`)
  3. Fetches active release parameters from the WHO MMS linearization endpoint
  4. Compares local baseline version against latest WHO release
  5. If update detected → iterates every mapped term through WHO's `autocode` endpoint and upserts results
- **Conflict-safe upserts** via `ON CONFLICT (namaste_system_code)` ensuring zero duplicate rows
- Skips unmatched terms gracefully with detailed logging

### 📊 System Status Dashboard
- Real-time health monitoring showing API version, database connectivity status, and last sync timestamp
- Auto-probes the backend on frontend mount via the health endpoint

### 🛡️ Production Hardening
- **Strict Boot Validation**: Server refuses to start if any required environment variable is missing
- **Structured Exception Handling**: All errors return consistent JSON responses with `success`, `detail`, and `status_code` fields
- **CORS Middleware**: Configurable origin allowlist for cross-domain EMR integrations
- **Async I/O**: All external HTTP calls use `httpx.AsyncClient` - zero blocking threads


## 🚀 Getting Started <a id="getting-started"></a>

### Prerequisites

Ensure you have the following installed on your system:

| Tool | Version | Download |
|------|---------|----------|
| **Python** | ≥ 3.10 | [python.org](https://www.python.org/downloads/) |
| **Node.js** | ≥ 18.x | [nodejs.org](https://nodejs.org/) |
| **npm** | ≥ 9.x | Bundled with Node.js |
| **Git** | ≥ 2.x | [git-scm.com](https://git-scm.com/) |


### Step 1 - Clone the Repository

```bash
git clone https://github.com/Koustav669/Ayursync_EMR_PUBLIC.git
cd Ayursync_EMR_PUBLIC
git checkout Demo
```


### Step 2 - Set Up the Python Backend

#### 2.1 Create & activate a virtual environment

```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# macOS / Linux
python3 -m venv .venv
source .venv/bin/activate
```

#### 2.2 Install Python dependencies

```bash
pip install -r requirements.txt
```

This installs:
- `fastapi` - API framework
- `uvicorn` - ASGI server
- `supabase` - Database client
- `httpx` - Async HTTP client for WHO API calls
- `python-dotenv` - Environment variable loader
- `pydantic` - Data validation


### Step 3 - Set Up the Frontend

```bash
npm install
```


### Step 4 - Configure Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key-here
SUPABASE_PUBLISHABLE_KEY=your-publishable-key-here

# WHO ICD-11 API Credentials
WHO_CLIENT_ID=your-who-client-id-here
WHO_CLIENT_SECRET=your-who-client-secret-here

# Application Settings
APP_ENV=development
```

> **Where to get these credentials:**
>
> | Credential | Source |
> |-----------|--------|
> | `SUPABASE_URL` | [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → Settings → API → Project URL |
> | `SUPABASE_KEY` | Supabase Dashboard → Settings → API → `anon` public key |
> | `WHO_CLIENT_ID` | [WHO ICD API Portal](https://icd.who.int/icdapi) → Register → My Apps → Client ID |
> | `WHO_CLIENT_SECRET` | WHO ICD API Portal → My Apps → Client Secret |


### Step 5 - Set Up the Database <a id="database-setup"></a>

#### 5.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"** → choose a name and region → click **"Create"**
3. Wait for the project to initialize

#### 5.2 Create the `terminology_map` Table

Navigate to **SQL Editor** in your Supabase Dashboard and execute:

```sql
CREATE TABLE terminology_map (
    id              BIGSERIAL       PRIMARY KEY,
    traditional_term_name   TEXT    NOT NULL,
    namaste_system_code     TEXT    NOT NULL UNIQUE,
    icd11_tm2_code          TEXT    NOT NULL,
    conventional_english_title TEXT NOT NULL,
    system_version          TEXT    NOT NULL DEFAULT '2024-01',
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast fuzzy search
CREATE INDEX idx_term_name_trgm ON terminology_map 
USING GIN (traditional_term_name gin_trgm_ops);

-- Enable the trigram extension (required for the index above)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

COMMENT ON TABLE terminology_map IS 
  'Dual-coding bridge table mapping NAMASTE traditional medicine codes to WHO ICD-11 TM2 classification codes';
```

#### 5.3 Seed Initial Data (Sample Mappings)

```sql
INSERT INTO terminology_map 
    (traditional_term_name, namaste_system_code, icd11_tm2_code, conventional_english_title, system_version)
VALUES
    ('Jwara',        'AYU-001', 'TM1:1A00',  'Fever',                       '2024-01'),
    ('Prameha',      'AYU-002', 'TM1:5A10',  'Diabetes Mellitus',           '2024-01'),
    ('Shwasa',       'AYU-003', 'TM1:CA23',  'Asthma',                      '2024-01'),
    ('Amlapitta',    'AYU-004', 'TM1:DA23',  'Gastroesophageal Reflux',     '2024-01'),
    ('Vatarakta',    'AYU-005', 'TM1:FA20',  'Gout',                        '2024-01'),
    ('Pandu',        'AYU-006', 'TM1:3A00',  'Anaemia',                     '2024-01'),
    ('Kushtha',      'AYU-007', 'TM1:EA80',  'Skin Disease / Dermatosis',   '2024-01'),
    ('Unmada',       'AYU-008', 'TM1:6A20',  'Psychosis',                   '2024-01'),
    ('Hridroga',     'AYU-009', 'TM1:BA80',  'Heart Disease',               '2024-01'),
    ('Gridhrasi',    'AYU-010', 'TM1:ME84',  'Sciatica',                    '2024-01');
```

#### 5.4 Configure Row-Level Security (Optional but Recommended)

```sql
-- Enable RLS
ALTER TABLE terminology_map ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for the anon key)
CREATE POLICY "Allow public read access" 
    ON terminology_map 
    FOR SELECT 
    USING (true);

-- Restrict writes to authenticated service role only
CREATE POLICY "Allow service role write access"
    ON terminology_map
    FOR ALL
    USING (auth.role() = 'service_role');
```


### Step 6 - Launch the Application

#### 6.1 Start the Backend API Server

```bash
# From project root (with virtual environment activated)
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

You should see:
```
══════════════════════════════════════════════════════
[STARTUP] Starting VedaLink Production API Gateway Engine...
[DB] Connected to Supabase Instance: https://your-project-id.supabase.co
══════════════════════════════════════════════════════
```

#### 6.2 Start the Frontend Dev Server

```bash
# In a new terminal, from project root
npm run dev
```

This launches Vite on `http://localhost:3000` with Hot Module Replacement.

#### 6.3 Verify Everything is Connected

| Check | URL | Expected |
|-------|-----|----------|
| Backend Health | `http://localhost:8000/` | `{"message": "VedaLink Gateway is online", "version": "1.0.0", "status": "healthy"}` |
| Frontend UI | `http://localhost:3000` | AyurSync EMR dashboard with green "Healthy" status |
| Search API | `http://localhost:8000/api/v1/search?term=Jwara` | JSON with matched terminology records |


## 📡 API Reference <a id="api-reference"></a>

### `GET /api/v1/search`

Search the terminology mapping database by traditional disease term.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `term` | `string` | ✅ | Traditional disease term to search (min 1 char) |

**Response Schema:**
```json
{
  "success": true,
  "count": 1,
  "matches": [
    {
      "id": 1,
      "traditional_term_name": "Jwara",
      "namaste_system_code": "AYU-001",
      "icd11_tm2_code": "TM1:1A00",
      "conventional_english_title": "Fever",
      "system_version": "2024-01"
    }
  ],
  "message": "Successfully fetched 1 active mapping standard record(s)."
}
```


### `POST /api/v1/sync/auto-update`

Triggers a live synchronization cycle against the WHO ICD-11 API.

**No request body required.** The engine automatically:
1. Reads the current database version baseline
2. Authenticates with WHO via OAuth2
3. Pulls the latest ICD-11 release metadata
4. Autocodes every mapped term against the latest release
5. Upserts updated mappings into PostgreSQL

**Response Schema:**
```json
{
  "success": true,
  "message": "Production sync active. Current framework anchored to release version: 2024-01",
  "updated_at": "2025-06-28T01:45:00.000000",
  "records_updated": 10
}
```


### `GET /`

Health check endpoint.

```json
{
  "message": "VedaLink Gateway is online",
  "version": "1.0.0",
  "status": "healthy"
}
```


## 📁 Project Structure

```
AyurSync_EMR_PUBLIC/
├── main.py                     # FastAPI backend - API routes, WHO sync engine, Supabase client
├── requirements.txt            # Python dependencies
├── .env.example                # Template for required environment variables
├── index.html                  # Vite entry point
├── package.json                # Node.js dependencies & scripts
├── vite.config.ts              # Vite build configuration
├── tsconfig.json               # TypeScript compiler configuration
├── tsconfig.node.json          # TypeScript config for Node tooling
└── src/
    ├── index.tsx               # React DOM entry point
    ├── index.css               # Global base styles
    ├── App.tsx                 # Root React component
    ├── App.css                 # Global app styles
    ├── vite-env.d.ts           # Vite TypeScript declarations
    └── components/
        ├── Desktop.tsx         # Main EMR dashboard (search + sync + status)
        └── Desktop.css         # Dashboard styling
```


## 🔐 Security Considerations

- **All credentials are loaded from environment variables** via `python-dotenv` - zero hardcoded secrets
- The `.gitignore` blocks `.env`, `.env.*`, certificates (`*.pem`, `*.key`), and all build artifacts
- The server performs a **strict boot validation** - if any required variable is missing, it crashes immediately with a descriptive error rather than running in a degraded state
- Supabase Row-Level Security (RLS) can restrict write access to the service role only


## 🛠️ Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| `CRITICAL ERROR: Environment configuration incomplete` | Missing `.env` values | Ensure all 4 required variables are set in `.env` |
| `Connection failed: ... Is the backend running on port 8000?` | Backend not started | Run `uvicorn main:app --port 8000 --reload` |
| `WHO Authentication Server Refused Access` | Invalid WHO credentials | Re-verify `WHO_CLIENT_ID` and `WHO_CLIENT_SECRET` at [icd.who.int/icdapi](https://icd.who.int/icdapi) |
| `No terminology mappings found` | Empty database | Run the seed SQL from Step 5.3 |
| Frontend shows "Offline" status | Backend unreachable | Check backend is running on port 8000, check CORS settings |


## 📜 License

This project was developed as part of **Smart India Hackathon 2025** (Problem Statement SIH25026) under the **Ministry of AYUSH, Government of India**.


<p align="center">
  <sub>Built with ❤️ for bridging Traditional Indian Medicine with Global Healthcare Standards</sub>
</p>
