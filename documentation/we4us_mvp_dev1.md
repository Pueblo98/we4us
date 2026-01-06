# We4Us-GBM MVP development: A complete technical blueprint

Building a patient-driven data-sharing platform for Glioblastoma patients requires balancing clinical utility, privacy protection, and accessibility for users facing cognitive challenges. This research synthesizes current best practices across data architecture, patient matching, privacy, infrastructure, AI integration, and UX design—providing a roadmap for an MVP that costs approximately **$31-70/month** for core infrastructure, scaling to **$300-600/month** with AI features.

The highest-value feature for your MVP is **GBM-specific treatment experience tracking with visualization**—this directly addresses what patients seek most: "Am I alone? What might help me?" Forum-based community combined with patient profiles creates the foundation for sustainable engagement, while MGMT and IDH status serve as the most clinically meaningful matching criteria.

---

## Data architecture that balances standards with simplicity

For a patient-reported GBM platform, **start simple with RxNorm and ICD-10-CM** before expanding to complex ontologies. Research from PatientsLikeMe demonstrates that condition-specific customization increases reported benefits by **18%** versus generic platforms, validating your GBM-focused approach.

**Recommended medical ontologies by priority:**

| Ontology | Relevance | MVP Priority | Implementation |
|----------|-----------|--------------|----------------|
| RxNorm | Medications (temozolomide, bevacizumab) | ✅ Start here | NLM's free API |
| ICD-10-CM | Diagnosis codes (C71.x for brain tumors) | ✅ Essential | Curated subset |
| ICD-O-3 | Oncology morphology/topography | ✅ Use for GBM classification | Simple lookup |
| SNOMED-CT | Clinical findings, symptoms | Phase 2 | Via UMLS mapping |
| MedDRA | Adverse events | Phase 3 | Complex implementation |

The **OMOP CDM Oncology Extension** provides an excellent structural foundation, using the EPISODE table to aggregate clinical events into disease phases and EPISODE_EVENT to link procedures, drugs, and measurements. For FHIR interoperability planning, align with **mCODE** (minimal Common Oncology Data Elements), which defines ~40 FHIR profiles specifically for oncology including genomics, staging, and treatment.

**Essential GBM patient matching fields** should be structured in tiers. Tier 1 captures MGMT methylation status, IDH mutation status, age at diagnosis, and Karnofsky performance score—these are the strongest predictors of treatment response and prognosis. Tier 2 adds EGFR amplification, extent of resection, and treatment protocol type. Store genetic markers using HGVS nomenclature for variants and ClinVar IDs for clinical significance.

For temporal data, implement **bi-temporal event modeling** from day one to handle the inevitable corrections ("my surgery was actually March 5, not March 15"):

```sql
CREATE TABLE treatment_events (
    id UUID PRIMARY KEY,
    patient_id UUID REFERENCES patients(id),
    event_type VARCHAR(50),
    valid_from DATE,      -- When event actually occurred
    valid_to DATE,        -- When event ended (NULL if ongoing)
    recorded_at TIMESTAMP, -- When entered into system
    attributes JSONB      -- Flexible event-specific data
);
```

---

## Patient similarity algorithms that work with small cohorts

Research consistently identifies **MGMT promoter methylation** and **IDH mutation status** as the most clinically meaningful matching criteria for GBM patients. MGMT-methylated tumors show median overall survival of **21.7 months versus 12.7 months** for unmethylated, making this the highest-weight similarity factor.

For MVP implementation, **weighted cosine similarity** offers the best complexity-to-value ratio. Convert patient profiles to numeric vectors with clinical weights applied:

```
Feature weights:
- MGMT status: 1.0 (highest)
- IDH status: 1.0
- Age bracket: 0.7
- KPS score: 0.6
- Treatment type: 0.5
```

The AMIA 2019 consensus framework establishes four patient similarity classes: feature-based (static characteristics), outcome-based (results), exposure-based (treatments over time), and mixed-class approaches. For We4Us-GBM, start with feature similarity and add outcome-based matching as you accumulate longitudinal data.

**Critical mass thresholds** for patient communities require realistic expectations:

| Stage | Patient Count | Matching Experience |
|-------|--------------|---------------------|
| Alpha | 20-50 | Manual matching, curated connections |
| Beta | 100-200 | Basic similarity, 3-5 matches per profile |
| Minimum viable | 500+ | Reliable matching, subgroup discovery |
| Network effects | 1,000+ | Self-sustaining activity |

Patients and clinicians define "similar" differently. Clinicians focus on molecular markers and performance status, while patients often prioritize **life stage, treatment phase, and coping strategies**. Build dual matching dimensions—let users toggle between "clinical match" and "experience match" to serve both needs.

---

## Privacy architecture combining k-anonymity with differential privacy

Your stated requirement of minimum cohort size of 5 maps directly to **k-anonymity (k=5)**. Implement this as a threshold filter before displaying any aggregate statistics:

```python
def get_cohort_stat(cohort_query, outcome, min_cohort=5, epsilon=1.0):
    matching_patients = filter_cohort(cohort_query)
    
    if len(matching_patients) < min_cohort:
        return "Insufficient data for privacy protection"
    
    # Add differential privacy noise for additional protection
    noisy_percentage = laplace_mechanism(
        true_value=outcome_rate,
        sensitivity=1/len(matching_patients),
        epsilon=epsilon
    )
    return f"~{round(noisy_percentage)}% of similar patients"
```

**ARX Data Anonymization Tool** (arx.deidentifier.org) provides the most mature open-source implementation of k-anonymity for health data, supporting risk-based analysis and optimization for biomedical datasets. For differential privacy, **PyDP** from OpenMined or IBM's **Diffprivlib** offer low-complexity Python implementations suitable for MVP.

Privacy budget management should use **ε (epsilon) values of 1-3** for healthcare applications, allocating budget per user per time period rather than globally. Advanced composition theorem means privacy loss grows as √k for k queries, not linearly—enabling more queries than naive analysis suggests.

For GDPR right-to-erasure while preserving aggregates: differential privacy inherently supports this because it bounds individual contribution. When a user requests deletion, remove their raw data immediately; aggregates computed with DP noise can be retained as they don't reveal the deleted individual. Document that "aggregate statistics may reflect historical patterns from deleted users."

**Consent UX should implement hierarchical, granular controls** while avoiding choice paralysis. Research shows **73-75% of patients prefer tiered consent** over broad open consent. Provide a recommended default setting with expandable categories:

```
□ Share for aggregate statistics ("X% of patients like you...")
□ Share for research studies (you'll be notified)
  └─ □ Academic research
  └─ □ Commercial research  
  └─ □ International studies
Data types: □ Treatment □ Outcomes □ Demographics □ Genetic
```

---

## Technical stack optimized for HIPAA compliance and cost

**AWS emerges as the clear MVP choice**: free, instant BAA signing via AWS Artifact, 166+ HIPAA-eligible services, and the most mature healthcare reference architectures. Google Cloud Healthcare API offers native FHIR support at slightly higher complexity; Azure Health Data Services suits Microsoft-centric organizations.

**Recommended MVP architecture with monthly costs:**

| Component | Technology | Monthly Cost | HIPAA Status |
|-----------|------------|--------------|--------------|
| Database | AWS RDS PostgreSQL | $15-30 | ✅ Eligible |
| Vector storage | pgvector (extension) | $0 | ✅ Included |
| Authentication | AWS Cognito | $0 (50K MAU free) | ✅ Eligible |
| Compute | AWS App Runner | $10-25 | ✅ Eligible |
| File storage | AWS S3 (encrypted) | $1-5 | ✅ Eligible |
| CDN/SSL | CloudFlare | $0 | ✅ Free tier |
| Logging | CloudWatch | $5-10 | ✅ Eligible |
| **Total** | | **$31-70** | |

For the React/Node stack, use **NestJS with TypeScript** for type-safe backend development (critical when handling PHI). Frontend should combine **React 18 + TypeScript + Tremor** (tremor.so) for dashboard components + **Recharts** for biomarker visualizations + **React Hook Form + Zod** for validated data entry. All open-source, zero licensing cost.

PostgreSQL configuration for health data requires three extensions: **pgcrypto** for column-level encryption of sensitive fields, **pgaudit** for access logging (who accessed what when), and row-level security for patient data isolation:

```sql
ALTER TABLE patient_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY patient_isolation ON patient_records
  USING (patient_id = current_setting('app.current_patient_id')::uuid);
```

**Skip running your own FHIR server for MVP**—use FHIR resource types as your PostgreSQL data model, then add a FHIR API layer later for EHR integration. If you need a FHIR server, **Medplum** offers TypeScript-native implementation with React components included.

For vector storage supporting patient similarity and AI features, **pgvector** keeps everything in one database at zero additional cost. Create an HNSW index for fast similarity search on patient embeddings:

```sql
CREATE EXTENSION vector;
CREATE INDEX ON patient_embeddings 
  USING hnsw (treatment_embedding vector_cosine_ops);
```

---

## AI integration with mandatory medical safety guardrails

For the AI assistant feature, **AWS Bedrock with Claude Haiku** provides the best HIPAA-compliant path: the standard AWS BAA covers Bedrock, pricing runs approximately **$0.25 input / $1.25 output per million tokens**, and quality is sufficient for patient education use cases. Alternative: OpenAI API with signed BAA (email baa@openai.com).

**Monthly AI cost estimate** for 500 active users at 10 queries/day averaging 1,000 tokens:
- GPT-4o-mini: ~$115/month
- Claude Haiku via Bedrock: ~$225/month
- Total infrastructure with AI: ~$300-600/month

The critical safety requirement is a **multi-layer guardrail architecture**:

```
Layer 1: Input Guardrails
├─ PHI Detection & Redaction (Microsoft Presidio)
├─ Prompt Injection Detection
└─ Topic Classification (medical scope validation)

Layer 2: System Prompt Constraints
├─ Role: Educational assistant, NOT clinical advisor
├─ Explicit prohibitions: No diagnoses, no treatment recommendations
└─ Required: "Please discuss with your healthcare team"

Layer 3: Output Guardrails (Guardrails AI library)
├─ Medical advice pattern detection & blocking
├─ Disclaimer injection
└─ Readability validation (8th grade level)
```

To avoid FDA medical device classification under the 21st Century Cures Act, position the AI as a **patient education and wellness tool**: display medical information without interpretive analysis, include clear disclaimers that it's not medical advice, and never claim to diagnose, treat, or prevent disease.

For RAG (Retrieval Augmented Generation) connecting patient data to medical literature, use **LlamaIndex** over LangChain for simpler document-centric Q&A. Embed medical text using **PubMedBERT** or BioLORD-2023, store in pgvector, and retrieve relevant context before LLM synthesis. Start with curated GBM educational content before expanding to full PubMed integration.

---

## UX design for cognitive accessibility and emotional sensitivity

GBM patients frequently experience cognitive impairment affecting memory, attention, and processing speed. The **W3C Cognitive Accessibility Guidelines (COGA)** provide essential design constraints:

- **Minimum 16px body text**, 20px+ for critical information
- **WCAG AAA contrast** (7:1 ratio) for body text
- **Maximum 4-5 navigation items**; consistent across all pages
- **No CAPTCHAs**; offer login alternatives (magic link, biometric)
- **Auto-save all form progress**; never lose patient data to timeouts
- **Accept multiple input formats** for dates and measurements
- **Progressive disclosure**: show only what's needed now

Research from OurBrainBank (GBM-specific app study) found that **cognitive games were confusing** to patients—avoid gamification requiring learning. Caregiver proxy entry is essential; design this from day one with separate caregiver accounts, delegated permissions, and clear indicators of who entered data.

**Data entry must minimize burden** for sick patients:

| Do | Don't |
|----|-------|
| Single question per screen | Multi-column forms |
| Visual 1-10 scales with faces | Precise numeric entry |
| Large touch targets (44x44px) | Tiny date picker controls |
| Auto-advance after selection | Multi-step confirmation |
| "Good enough" approximations | Clinical precision requirements |

For emotional design in terminal illness contexts, avoid both toxic positivity and doom messaging. Research shows hope and realistic expectations can coexist—focus hope on **proximal goals** (symptom management, meaningful experiences, connection) rather than cure. Use phrases like "How are you feeling today?" not "Stay positive!"

**Component libraries**: Use **shadcn/ui + Radix UI** for fully accessible, Tailwind-based primitives with full customization control. **Terra UI** (from Cerner/Oracle Health) provides healthcare-specific, accessible components. For charts, **Recharts** offers React-native, SVG-based visualizations ideal for biomarker trends.

---

## Feature prioritization for sustainable community building

The 90-9-1 rule governs health communities: **90% of users are lurkers** who read but don't post, 9% occasionally contribute, and 1% of superusers create most content. Critically, lurkers still derive value—research shows they may have higher perceived well-being than active posters.

**MVP features ranked by RICE score:**

| Feature | Priority | Effort | Rationale |
|---------|----------|--------|-----------|
| Discussion Forums | 🥇 1st | 1.5 months | Core community formation; enables read-only value |
| Patient Profile + Diagnosis | 🥇 1st | 1 month | Foundation for matching; immediate utility |
| Privacy Controls | 🥈 2nd | 0.5 months | Essential trust requirement |
| Treatment Protocol Logging | 🥈 2nd | 2 months | Highest differentiating value for GBM patients |
| Biomarker Visualization | 🥉 3rd | 1.5 months | Personal tracking value |
| Lab Results w/ Ranges | 4th | 1 month | Enhanced tracking |
| Medication Logging | 5th | 1 month | Complementary feature |
| AI Assistant | 6th | 2 months | Lower confidence, higher complexity |

**Build vs. buy recommendations:**

- **Authentication: BUY** (Auth0 or Clerk) — Babylon Healthcare estimated 8 staff and 1+ year to build in-house; Auth0's HIPAA-compliant offering starts free
- **FHIR Server: DEFER** — Use PostgreSQL with FHIR-aligned schema; full FHIR unnecessary until EHR integration
- **Charting: USE LIBRARIES** — Recharts (free) handles all visualization needs; consider AHRQ's Charts on FHIR for health-specific patterns
- **AI Chat: API** — OpenAI/Anthropic with guardrails, $20-100/month for MVP usage

For **cold-start community building** with 10-50 users, implement the "white-hot coal" approach: hand-pick founding members from GBM advocacy organizations, know all by name, and provide value without network effects through treatment timeline exports, curated educational content, and personal health summaries.

**Key partnership targets** for seeding your community:
- National Brain Tumor Society (braintumor.org)
- Glioblastoma Foundation (glioblastomafoundation.org)
- American Brain Tumor Association's CommYOUnity program
- Smart Patients Brain Tumor Community

Target **50 highly engaged users** before scaling, with success metrics: DAU/MAU > 20%, Week 2 retention > 40%, profile completion > 50%, and at least 3 organic superusers emerging from the community.

---

## Implementation roadmap and resource links

**Phase 1 (Months 1-2): Core MVP**
- Sign AWS BAA via Artifact (Day 1)
- Deploy PostgreSQL with pgcrypto, pgaudit, row-level security
- Implement Cognito authentication with required MFA
- Build discussion forums + patient profiles + basic treatment logging
- Partner with 1-2 GBM advocacy organizations
- Recruit 10 founding members (5 patients, 5 caregivers)

**Phase 2 (Months 3-4): Enhanced Tracking**
- Full treatment protocol timeline visualization
- Biomarker entry with trend charts
- "Patients like me" matching using weighted cosine similarity
- Mobile-responsive data entry with offline capability

**Phase 3 (Months 5-6): Intelligence Layer**
- AI assistant via AWS Bedrock with Guardrails AI safety
- RAG integration with curated GBM educational content
- Aggregated cohort insights with differential privacy

**Essential documentation and tools:**

| Resource | URL | Purpose |
|----------|-----|---------|
| AWS HIPAA Guidance | aws.amazon.com/compliance/hipaa-compliance | BAA and service eligibility |
| mCODE Implementation Guide | hl7.org/fhir/us/mcode | Oncology FHIR profiles |
| pgvector | github.com/pgvector/pgvector | Vector similarity for PostgreSQL |
| Guardrails AI | guardrailsai.com | LLM output validation |
| ARX Anonymization | arx.deidentifier.org | K-anonymity implementation |
| PyDP | github.com/OpenMined/PyDP | Differential privacy library |
| W3C COGA | w3.org/TR/coga-usable | Cognitive accessibility guidelines |
| Tremor | tremor.so | React dashboard components |
| LlamaIndex | docs.llamaindex.ai | RAG framework |
| Terra UI | engineering.cerner.com/terra-ui | Healthcare design system |

The combination of PostgreSQL + pgvector + AWS infrastructure + React/NestJS provides a HIPAA-compliant foundation that costs under $100/month at MVP scale while supporting all planned features. The critical success factor is not technology—it's building genuine community with GBM patients and caregivers who find your platform valuable from their first visit, even before network effects emerge.