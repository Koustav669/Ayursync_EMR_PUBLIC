# ================================================================================
# VEDALINK - Medical API Gateway (STRICT PRODUCTION VERSION)
# Backend for mapping Traditional Indian Medicine (NAMASTE) to ICD-11 TM2 codes
# ================================================================================

import os
import httpx
from datetime import datetime
from typing import List, Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from supabase import create_client, Client

# ============================================================================
# ENVIRONMENT CONFIGURATION & STRICT VALIDATION
# ============================================================================
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
WHO_CLIENT_ID = os.getenv("WHO_CLIENT_ID")
WHO_CLIENT_SECRET = os.getenv("WHO_CLIENT_SECRET")

# Strict Boot Check: Agar ek bhi key missing hai, toh server start hi nahi hoga
if not all([SUPABASE_URL, SUPABASE_KEY, WHO_CLIENT_ID, WHO_CLIENT_SECRET]):
    raise ValueError(
        "CRITICAL ERROR: Environment configuration incomplete. "
        "SUPABASE_URL, SUPABASE_KEY, WHO_CLIENT_ID, and WHO_CLIENT_SECRET must all be strictly set."
    )

# Initialize global Supabase client container
supabase_client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# ============================================================================
# PYDANTIC MODELS (Strict Data Schemas)
# ============================================================================

class TerminologyMatch(BaseModel):
    id: int
    traditional_term_name: str
    namaste_system_code: str
    icd11_tm2_code: str
    conventional_english_title: str
    system_version: str

class SearchResponse(BaseModel):
    success: bool
    count: int
    matches: List[TerminologyMatch]
    message: str

class SyncResponse(BaseModel):
    success: bool
    message: str
    updated_at: str
    records_updated: int

# ============================================================================
# APPLICATION LIFECYCLE
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("=" * 70)
    print("🚀 Starting VedaLink Production API Gateway Engine...")
    print(f"📡 Connected to Supabase Instance: {SUPABASE_URL}")
    print("=" * 70)
    yield
    print("=" * 70)
    print("🛑 Shutting down VedaLink API Gateway...")
    print("=" * 70)

# ============================================================================
# FASTAPI APP INITIALIZATION
# ============================================================================

app = FastAPI(
    title="VedaLink - Medical API Gateway",
    description="Production-grade dual-coding interface mapping Traditional Indian Medicine (NAMASTE) to WHO ICD-11 standards",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Production mein isko select domain par strict kar sakte hain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "VedaLink Gateway is online",
        "version": "1.0.0",
        "status": "healthy"
    }

# ============================================================================
# ENDPOINT 1: SEARCH DIAGNOSIS BY TERM (Pure Database Execution)
# ============================================================================

@app.get("/api/v1/search", response_model=SearchResponse)
async def search_diagnosis(
    term: str = Query(..., min_length=1, description="Term to search in traditional_term_name")
) -> SearchResponse:
    
    try:
        # Seedha database query bina kisi fallback ya mock dictionaries ke
        response = supabase_client.table("terminology_map").select("*").ilike("traditional_term_name", f"%{term}%").execute()
        matches = response.data
        
        if not matches or len(matches) == 0:
            raise HTTPException(
                status_code=404, 
                detail=f"No terminology mappings found matching the query term: '{term}'"
            )
        
        terminology_matches = [TerminologyMatch(**match) for match in matches]
        
        return SearchResponse(
            success=True,
            count=len(terminology_matches),
            matches=terminology_matches,
            message=f"Successfully fetched {len(terminology_matches)} active mapping standard record(s)."
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Database Query Execution Failure: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Internal Database Transaction Error: {str(e)}"
        )

# ============================================================================
# ENDPOINT 2: AUTOMATED SYNC WEBHOOK (Strict Live WHO OAuth2 & Context Parsing)
# ============================================================================

@app.post("/api/v1/sync/auto-update", response_model=SyncResponse)
async def auto_update_sync() -> SyncResponse:
    
    try:
        # Step 1: Query maximum tracking version from PostgreSQL instance
        print("📊 Step 1: Querying latest system state from database tracking...")
        version_response = supabase_client.table("terminology_map").select("system_version").order("system_version", desc=True).limit(1).execute()
        if not version_response.data:
            raise HTTPException(
                status_code=404,
                detail="No terminology rows found in Supabase to sync"
            )

        current_db_version = version_response.data[0]["system_version"]
        print(f"   Current local baseline version tracked: {current_db_version}")
        
        # Step 2: Live Handshake with official WHO Identity Provider
        print("📡 Step 2: Requesting OAuth2 token from official WHO Access Server...")
        token_url = "https://icdaccessmanagement.who.int/connect/token"
        token_data = {
            "grant_type": "client_credentials",
            "client_id": WHO_CLIENT_ID,
            "client_secret": WHO_CLIENT_SECRET
        }
        
        async with httpx.AsyncClient() as client:
            auth_response = await client.post(token_url, data=token_data)
            
            if auth_response.status_code != 200:
                print(f"❌ WHO Identity Verification Refused: {auth_response.text}")
                raise HTTPException(
                    status_code=401, 
                    detail=f"WHO Authentication Server Refused Access: {auth_response.text}"
                )
                
            access_token = auth_response.json()["access_token"]
            print("   ✅ WHO Authentication Handshake validated successfully.")
            
            # 🌍 Step 3: Fetching actual dynamic linearization release parameters
            print("🌍 Step 3: Fetching active release parameters from WHO MMS standard...")
            headers = {
                "Authorization": f"Bearer {access_token}",
                "API-Version": "v2",
                "Accept": "application/json",
                "Accept-Language": "en"
            }
            
            # CRITICAL FIX: Targeting the official 'mms' linearization root endpoint
            who_release_url = "https://id.who.int/icd/release/11/mms"
            release_response = await client.get(who_release_url, headers=headers)
            
            if release_response.status_code != 200:
                print(f"❌ WHO Resource Server Error: {release_response.text}")
                raise HTTPException(
                    status_code=release_response.status_code, 
                    detail=f"Failed to pull latest linearization data from WHO: {release_response.text}"
                )
                
            # Extracts the real dynamic release identifier context from the official object
            release_data = release_response.json()
            latest_release_uri = release_data["latestRelease"]
            latest_available_version = latest_release_uri.rstrip("/").split("/")[-2]
            
            print(f"   Latest production release ID found on WHO server: {latest_available_version}")
            
            # Step 4: Conditional Synchronization Check
            print("⚖️  Step 4: Evaluating system state mismatch details...")
            update_available = latest_available_version != current_db_version
            records_updated = 0
            
            if update_available:
                print(f"   ✅ Update required. Transitioning baseline state from {current_db_version} -> {latest_available_version}")

                # Step 5: Live WHO search for every mapped term already in Supabase.
                # This keeps the sync fully live and avoids invented delta payloads.
                print("🔄 Step 5: Pulling live WHO search results for each mapped term...")
                terms_response = supabase_client.table("terminology_map").select(
                    "id, traditional_term_name, namaste_system_code"
                ).execute()

                terminology_rows = terms_response.data
                if not terminology_rows:
                    raise HTTPException(
                        status_code=404,
                        detail="No terminology rows found for live WHO sync"
                    )

                sync_payload = []
                skipped_terms = []
                autocode_url = f"https://id.who.int/icd/release/11/{latest_available_version}/mms/autocode"

                for row in terminology_rows:
                    query_text = row["traditional_term_name"]
                    search_response = await client.get(
                        autocode_url,
                        headers=headers,
                        params={"searchText": query_text},
                    )

                    if search_response.status_code != 200:
                        print(f"❌ WHO Autocode Server Error for '{query_text}': {search_response.text}")
                        raise HTTPException(
                            status_code=search_response.status_code,
                            detail=f"Failed to autocode WHO term '{query_text}': {search_response.text}"
                        )

                    search_data = search_response.json()
                    if search_data.get("error"):
                        raise HTTPException(
                            status_code=502,
                            detail=f"WHO autocode returned an error for '{query_text}': {search_data.get('errorMessage', 'Unknown error')}"
                        )

                    best_code = search_data.get("theCode")
                    if not best_code:
                        skipped_terms.append(query_text)
                        continue

                    sync_payload.append(
                        {
                            "traditional_term_name": query_text,
                            "namaste_system_code": row["namaste_system_code"],
                            "icd11_tm2_code": best_code,
                            "conventional_english_title": search_data.get("matchingText") or query_text,
                            "system_version": latest_available_version,
                        }
                    )

                print(f"   ✅ WHO autocode returned {len(sync_payload)} live mapping row(s).")

                if skipped_terms:
                    print(f"   ⚠️  {len(skipped_terms)} term(s) had no WHO autocode match and were skipped.")

                records_updated = len(sync_payload)
                if sync_payload:
                    supabase_client.table("terminology_map").upsert(
                        sync_payload,
                        on_conflict="namaste_system_code"
                    ).execute()
                    print(f"   ✅ Live synchronization committed {records_updated} row(s) successfully.")
                else:
                    print("   ℹ️  No live WHO matches were found, so nothing was written to Supabase.")
            else:
                print(f"   ℹ️  Database architecture state tracking is fully up-to-date with WHO release ({current_db_version}).")
                
            return SyncResponse(
                success=True,
                message=(
                    f"Production sync active. Current framework anchored to release version: {latest_available_version}"
                    if records_updated > 0
                    else f"Live WHO sync completed against release {latest_available_version}, but no codable matches were written."
                ),
                updated_at=datetime.now().isoformat(),
                records_updated=records_updated
            )
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Critical Pipeline Failure on Synchronization Execution: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Live Synchronization Automation Breakdown: {str(e)}"
        )

# ============================================================================
# EXCEPTION ROUTER (Strict Format Structural Response)
# ============================================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "detail": exc.detail,
            "status_code": exc.status_code
        }
    )