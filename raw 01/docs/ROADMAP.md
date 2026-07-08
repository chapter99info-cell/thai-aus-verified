# Thai-Aus Verified Community — Project Roadmap

## ✅ Phase 1 — Foundation (DONE)
- Next.js 14 + Supabase + White/Navy theme
- Homepage, Directory, Navbar, Footer
- Deployed on Vercel
- GitHub connected

## ✅ Phase 2 — Core Features (DONE)
- ABN auto-verification (API ref: ABNL29296 — GUID pending email)
- Login / Register with Terms checkbox
- Dashboard + Subscription status
- Pricing page (Free / Premium A$9/month)
- Scam Alerts page (/alerts)
- Reviews & Rating system
- Admin dashboard
- Terms & Privacy Policy pages
- Stripe A$9/month (GUID + webhook pending setup)

## ⏳ Phase 2.5 — Config Pending (Do Tomorrow)
- [ ] ABN GUID → add to Vercel ENV (ref: ABNL29296)
- [ ] Stripe: create A$9/month price → add STRIPE_PRICE_ID
- [ ] Stripe: create webhook → add STRIPE_WEBHOOK_SECRET
- [ ] Supabase: run 004_terms_grace_period.sql
- [ ] Supabase: make admin (chapter99solutions@gmail.com)
- [ ] DNS: thai-ausverified.com.au → Vercel (Hostinger)
- [ ] Facebook Group: change Public → Private
- [ ] Facebook Group: add 3 Membership Questions
- [ ] Facebook Group: setup Admin Assist auto-decline
- [ ] Upload logo to /public/logo.png

## 🔮 Phase 3 — AI Scam Alert Automation (Future)

### Concept
Use Make.com + AI to automatically find and post scam alerts
targeting Thai community in Australia.

### Workflow

```
[Trigger] → [Collect sources] → [AI classify & summarise] → [Admin review] → [Publish to /alerts]
```

#### Step 1 — Trigger (Make.com)
- **Schedule:** Run every 6 hours (or daily at 8am AEST)
- **Optional webhook:** New post in Facebook Group → trigger scenario
- **Manual:** Admin forwards email to `chapter99solutions@gmail.com` → trigger

#### Step 2 — Collect sources
| Source | Method | Notes |
|--------|--------|-------|
| Facebook Group posts | Make.com Facebook module | Thai-language keywords: โกง, scam, หลอก, เงินหาย |
| ACCC Scamwatch RSS | HTTP module | Filter Australia + Thai-related |
| User reports | Email → Make.com | Subject: "แจ้งเตือนภัย" |
| Admin manual | `/admin` tab | Already built — fallback |

#### Step 3 — AI processing (OpenAI / Claude via Make.com)
- **Input:** Raw post text + source URL + date
- **Prompt goals:**
  - Detect if content is a scam alert (yes/no + confidence 0–100)
  - Extract: title (Thai, max 80 chars), category, description (Thai, plain language)
  - Reject: spam, ads, non-scam complaints, duplicate of existing alert
- **Output JSON:**
  ```json
  {
    "is_scam": true,
    "confidence": 85,
    "title": "...",
    "category": "rental|job|online|investment|other",
    "description": "...",
    "source_url": "..."
  }
  ```
- **Threshold:** Only proceed if `is_scam=true` AND `confidence >= 70`

#### Step 4 — Deduplication
- Compare new title against existing `scam_alerts` (similarity check via AI or fuzzy match)
- Skip if duplicate within last 30 days

#### Step 5 — Insert draft (Supabase)
- **Endpoint:** `POST /api/admin/alerts` (admin auth required)
- **Insert:** `is_published=false` (draft for review)
- **Alternative:** Direct Supabase insert via service_role in Make.com

#### Step 6 — Admin review (human-in-the-loop)
- Admin opens `/admin` → Scam Alerts tab
- Reviews AI-generated draft
- **Publish** → `is_published=true` → appears on `/alerts` + homepage banner
- **Reject** → delete or leave unpublished

#### Step 7 — Notify community (optional)
- On publish: Update homepage scam banner (already built)
- **Facebook:** Auto-comment on original post (NOT DM — Facebook policy)
  - Comment text: "⚠️ แจ้งเตือนภัยนี้ถูกบันทึกแล้ว → thai-aus-verified.vercel.app/alerts"
- **Email:** Optional newsletter to registered members (future)

### Tech requirements (Phase 3 build)
- [ ] Make.com scenario: "Scam Alert Auto-Pilot"
- [ ] AI module API key (OpenAI or Anthropic) in Make.com vault
- [ ] Supabase service_role key in Make.com (for direct insert)
- [ ] Facebook Group webhook or polling module
- [ ] Admin notification email when new draft created
- [ ] Optional: `/api/admin/alerts` GET endpoint for Make.com status check

### Categories (standardise in AI prompt)
| Category | Thai label | Examples |
|----------|------------|----------|
| rental | ค่าเช่าหลอก | Fake rental deposits |
| job | งานออนไลน์หลอก | Work-from-home scams |
| online | ออนไลน์/โซเชียล | Facebook marketplace, Line scams |
| investment | ลงทุนหลอก | Crypto, forex schemes |
| other | อื่นๆ | Catch-all |

### Success metrics
- Time from scam post → published alert: target < 24 hours
- False positive rate: target < 10% (admin rejects)
- Community engagement: clicks on `/alerts` from homepage banner

### Out of scope (Phase 3)
- Automated publishing without admin review (legal risk)
- Facebook DM to users (violates Facebook policy — use comment or email only)
- Real-time blocking of scam posts in Facebook Group (requires Meta API approval)

---

## 📋 Phase 4 — Future Ideas (Backlog)
- Contact tap analytics for Premium members
- Business photo/video upload to Supabase Storage buckets
- Push notifications (PWA)
- Multi-language alerts (Thai + English)
- Integration with thai-ausverified.com.au custom domain
- Remove deprecated `/verify` KYC flow (replaced by ABN auto-verify)

---

*Last updated: June 2026 — Chapter99 Solutions*
