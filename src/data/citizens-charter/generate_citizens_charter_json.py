import json
from datetime import datetime

def clean(t): return " ".join(str(t).split())

UPDATED = datetime.now().strftime("%Y-%m-%d")

# ── helpers ──────────────────────────────────────────────────────────────────
def svc(number, name, office, classification, txn_type, who,
        requirements, client_steps, fees_amount, fees_desc,
        processing_time, plain_name, turnaround="", person=None,
        fee_schedule=None, supporting=None):
    obj = {
        "service_number": number,
        "service_name": name,
        "office_division": office,
        "classification": classification,
        "type_of_transaction": txn_type,
        "who_may_avail": who,
        "requirements": requirements,
        "client_steps": client_steps,
        "fees": {"amount": fees_amount, "description": fees_desc},
        "processing_time": processing_time,
        "turnaround_time": turnaround,
        "plain_language_name": plain_name,
    }
    if person:
        obj["person_responsible"] = person
    if fee_schedule:
        obj["fee_schedule"] = fee_schedule
    if supporting:
        obj["supporting_documents_detail"] = supporting
    return obj

def req(r, w): return {"requirement": r, "where_to_secure": w}
def step(n, a): return {"step": n, "action": a}

# ── offices ──────────────────────────────────────────────────────────────────
AGR   = "OFFICE OF AGRICULTURAL SERVICES"
ASS   = "ASSESSOR'S OFFICE"
GAD   = "GENDER AND DEVELOPMENT OFFICE"
GSO   = "GENERAL SERVICES OFFICE"
LCR   = "LOCAL CIVIL REGISTRY OFFICE"
LEG   = "LEGAL SERVICES OFFICE"
MISS  = "MANAGEMENT INFORMATION SERVICE SYSTEM"
MENRO = "MUNICIPAL ENVIRONMENT AND NATURAL RESOURCES OFFICE"
PESO  = "PUBLIC EMPLOYMENT SERVICE OFFICE"
TSDO  = "TAYTAY SPORTS DEVELOPMENT OFFICE"
TOUR  = "TOURISM OFFICE"
TRES  = "TREASURY OFFICE"
UPAO  = "URBAN POOR AFFAIRS OFFICE"
BPLO  = "BUSINESS PERMIT AND LICENSING OFFICE"

services = []

# ═══════════════════════════════════════════════════════════════════════════
# 1. AGRICULTURE OFFICE
# ═══════════════════════════════════════════════════════════════════════════
services.append(svc(
    "1.1","Dog and Cat Registration and Anti-Rabies Vaccination (ARV)",
    AGR,"Simple","G2C","General Public",
    [req("Dog or cat must be 3 months old and above, and healthy","Pet owner"),
     req("No history of medication or animal bite/scratch incident for the past 2 weeks","Pet owner")],
    [step(1,"Visit the Office and request for ARV and pet registration."),
     step(2,"Present and handle the cat/dog to be vaccinated."),
     step(3,"Claim the Certificate of Vaccination.")],
    "None","Free","9 minutes","Register your pet and get anti-rabies vaccination"
))

services.append(svc(
    "1.2","Animal Control (Stray Cats and Stray Dogs)",
    AGR,"Simple","G2C","General Public",
    [req("For private subdivision or within a private property: Request letter addressed to the Office of the Municipal Mayor","Requesting party")],
    [step(1,"Submit a request letter to the Office of the Municipal Mayor."),
     step(2,"Present the request letter received by the Office of the Municipal Mayor."),
     step(3,"Assist the animal control team during the operation.")],
    "None","Free","1 hour","Report and have stray animals controlled"
))

services.append(svc(
    "1.3","Mass Anti-Rabies Vaccination for Cats and Dogs",
    AGR,"Simple","G2C","General Public",
    [req("Request letter addressed to the Municipal Mayor","Requesting party")],
    [step(1,"Submit the request letter to the Office of the Municipal Mayor."),
     step(2,"Provide a covered venue and assist the Vaccination team during the activity.")],
    "None","Free","2–3 hours","Request a mass anti-rabies vaccination drive"
))

services.append(svc(
    "1.4","Issuance of Veterinary Health Certificate for Travel Purpose of Cats and Dogs",
    AGR,"Simple","G2C","General Public",
    [req("Cat or dog must be vaccinated 14 days prior to departure (anti-rabies, not expired)","Pet owner"),
     req("Cat or dog must be healthy and at least 18 months old","Pet owner"),
     req("Vaccination Record","Pet owner"),
     req("Official Receipt of Payment","Treasury Office")],
    [step(1,"Bring your pet and vaccination record."),
     step(2,"Request for Veterinary Health Certificate for Travel Purpose."),
     step(3,"Present the pet for physical assessment."),
     step(4,"Proceed to the Treasury Office to pay the certification fee (Php 130.00)."),
     step(5,"Present the Official Receipt to the Agriculture Office and claim the Certificate.")],
    "130.00","Php 130.00 certification fee","12 minutes",
    "Get a health certificate for your pet before travel"
))

services.append(svc(
    "1.5","Gulayan sa Paaralan or Community Garden",
    AGR,"Simple","G2C","Schools, community organizations, and residents",
    [req("Request letter addressed to the Municipal Mayor","Requesting party")],
    [step(1,"Submit a request letter to the Office of the Municipal Mayor."),
     step(2,"Assist the technician during the field visitation and ocular inspection."),
     step(3,"Participate actively in the scheduled seminar/training.")],
    "None","Free","1+ hour","Get support for a school or community vegetable garden"
))

services.append(svc(
    "1.6","Redemption of Impounded Animals",
    AGR,"Simple","G2C","Animal owners",
    [req("Government-Issued Identification Card","Government agency"),
     req("Official Receipt of Payment","Treasury Office"),
     req("Release, Waiver and Quitclaim Form","Agriculture Office")],
    [step(1,"Request to redeem the impounded animal; provide proof of ownership and government-issued ID."),
     step(2,"Fill up the Release, Waiver and Quitclaim Form."),
     step(3,"Pay the penalty fee at the Treasury Office."),
     step(4,"Present the Official Receipt to the Agriculture Office to claim the animal.")],
    "500.00","Php 500.00 penalty fee","~15 minutes","Reclaim your impounded animal"
))

services.append(svc(
    "1.7","Adoption of Impounded Animal",
    AGR,"Simple","G2C","General public and animal shelters",
    [req("Government-Issued Identification","Government agency"),
     req("For shelter/groups: Shelter permit","Department of Agriculture – Bureau of Animal Industry"),
     req("Animal Cage","Adopter to provide"),
     req("Release, Waiver and Quitclaim Form","Agriculture Office")],
    [step(1,"Request for adoption of an impounded animal."),
     step(2,"Present government-issued identification."),
     step(3,"For shelter/groups: provide shelter permit."),
     step(4,"Fill up the Release, Waiver and Quitclaim Form."),
     step(5,"Bring the animal cage to the impounding facility.")],
    "None","Free","~15 minutes","Adopt an impounded animal"
))

services.append(svc(
    "1.8","Surrendering of Cats and Dogs with Owner",
    AGR,"Simple","G2C","Pet owners",
    [req("Government-Issued Identification","Government agency"),
     req("Animal Surrender Form","Agriculture Office"),
     req("Euthanasia Consent Form","Agriculture Office"),
     req("Declaration of Waiver and Liability Form","Agriculture Office"),
     req("Certificate of Abandonment","Agriculture Office"),
     req("Official Receipt of Payment","Treasury Office")],
    [step(1,"Request for Animal Surrender."),
     step(2,"Present Government-Issued Identification."),
     step(3,"Fill up the Animal Surrender Form, Euthanasia Consent Form, Declaration of Waiver and Liability Form, and Certificate of Abandonment."),
     step(4,"Pay the Surrender fee (Php 500.00 per head) at the Treasury Office."),
     step(5,"Present the Official Receipt."),
     step(6,"Bring the animal to the impounding facility.")],
    "500.00","Php 500.00 per head","~20 minutes","Formally surrender your cat or dog"
))

services.append(svc(
    "1.9","Animal Health Services for Small Animals (Cats and Dogs)",
    AGR,"Simple","G2C","Pet owners",
    [],
    [step(1,"Make a same-day appointment via call, social media, or personal visit."),
     step(2,"Bring your pet on the given schedule for veterinary check-up.")],
    "None","Free","10–15 minutes","Get a veterinary check-up for your cat or dog"
))

services.append(svc(
    "1.10","Issuance of Veterinary Health Certificate for Travel Purpose of Poultry",
    AGR,"Simple","G2C","Poultry owners",
    [req("Certificate of Free Status Avian Influenza Type A Subtypes H5 & H7","Bureau of Animal Industry"),
     req("Styrofoam box with ice","Owner to provide"),
     req("Newcastle Disease Vaccine","Owner to provide"),
     req("Leg band / wing band","Owner to provide"),
     req("At least 2 weeks prior to travel date","Owner to comply")],
    [step(1,"Request for a Veterinary Health Certificate for Poultry."),
     step(2,"Bring the birds with leg/wing bands, Newcastle Disease Vaccine, and Styrofoam box with ice on the scheduled date."),
     step(3,"Submit collected blood and swab samples to the Bureau of Animal Industry in Quezon City on the same day of collection."),
     step(4,"Once results are released, submit the Certificate of Free Status Avian Influenza Type A Subtypes H5 & H7 to the Agriculture Office."),
     step(5,"Pay the certification fee (Php 130.00) at the Treasury Office."),
     step(6,"Present the Official Receipt to the Agriculture Office.")],
    "130.00","Php 130.00 certification fee","~2 weeks (including lab testing)",
    "Get a health certificate for poultry before travel"
))

services.append(svc(
    "1.11","Animal Health Services for Livestock and Poultry (Checkup, Medication, Vaccination, Deworming, Sample Collection)",
    AGR,"Simple","G2C","Livestock and poultry owners",
    [req("Certificate of Free Status Avian Influenza Type A Subtypes H5 & H7 (if applicable)","Bureau of Animal Industry"),
     req("Styrofoam box with ice (if applicable)","Owner to provide"),
     req("Newcastle Disease Vaccine (if applicable)","Owner to provide"),
     req("Leg band / wing band (if applicable)","Owner to provide")],
    [step(1,"Request for Animal Health Service."),
     step(2,"Report initial signs and observations."),
     step(3,"Assist the veterinarian or technician during the farm visitation.")],
    "None","Free","10+ minutes per animal","Get veterinary services for your livestock or poultry"
))

services.append(svc(
    "1.12","Distribution of Assorted Vegetable Seeds and Seedlings",
    AGR,"Simple","G2C","Residents and farmers",
    [],
    [step(1,"Request for assorted vegetable seeds."),
     step(2,"Provide basic information: Name, Address, and size of planting area.")],
    "None","Free","~10 minutes","Get free vegetable seeds and seedlings"
))

services.append(svc(
    "1.13","Annual Kangkong Registration",
    AGR,"Simple","G2C","Kangkong farmers",
    [req("Official Receipt of Payment","Treasury Office"),
     req("Government-Issued Identification","Government agency"),
     req("RSBSA Registration","Agriculture Office")],
    [step(1,"Request for kangkong registration."),
     step(2,"Present government-issued identification."),
     step(3,"Pay the kangkong registration permit fee (Php 500.00 per hectare)."),
     step(4,"Present the official receipt.")],
    "500.00","Php 500.00 per hectare","~47 minutes","Annually register your kangkong farm"
))

services.append(svc(
    "1.14","Registry System for Basic Sector in Agriculture (RSBSA) for Livestock, Poultry, High Value Crops and Rice",
    AGR,"Simple","G2C","Farmers, livestock/poultry raisers, and fisherfolk",
    [req("Government-Issued Identification","Government agency")],
    [step(1,"Request for RSBSA registration."),
     step(2,"Present Government-issued identification."),
     step(3,"Assist in the farm visitation and validation.")],
    "None","Free","~45 minutes","Register in the national farmers' registry"
))

services.append(svc(
    "1.15","Insurance for High Value Crops, Rice, Livestock and Poultry from the Philippine Crop Insurance Corporation (PCIC)",
    AGR,"Simple","G2C","Registered farmers and livestock/poultry raisers",
    [req("Government-issued identification","Government agency"),
     req("RSBSA registration","Agriculture Office")],
    [step(1,"Request for PCIC Insurance."),
     step(2,"Present Government-issued identification (RSBSA registration validated by coordinator).")],
    "None","Free (PCIC premium applies)","~15 minutes (initial)","Enroll your crops or livestock in government insurance"
))

services.append(svc(
    "1.16","Damage Report for High Value Crops, Rice, Livestock and Poultry during Natural Calamity",
    AGR,"Simple","G2C","Registered farmers affected by natural calamities",
    [req("Government-issued identification","Government agency"),
     req("RSBSA registration","Agriculture Office")],
    [step(1,"Immediately report the damage to the coordinator within 24 hours after the calamity."),
     step(2,"Provide supporting documents of the damages.")],
    "None","Free","Initial report: 24 hours; Final report: 3 days after calamity",
    "File a damage report after a natural calamity"
))

services.append(svc(
    "1.17","Agricultural Trainings and Seminars",
    AGR,"Simple","G2C","Farmers, schools, and communities",
    [req("Request letter addressed to the Municipal Mayor","Requesting party")],
    [step(1,"Submit the request letter to the Office of the Municipal Mayor."),
     step(2,"Provide the necessary logistics if applicable."),
     step(3,"Assist the coordinator and speakers during the event.")],
    "None","Free","Depends on training/seminar","Request an agricultural training or seminar"
))

services.append(svc(
    "1.18","Technical Consultation on Agriculture, Fisheries and Other Related Sectors",
    AGR,"Simple","G2C","Farmers and general public",
    [],
    [step(1,"Provide necessary information on the case to be consulted."),
     step(2,"Assist the coordinator during the visitation if applicable.")],
    "None","Free","~45 minutes","Get free agricultural or fisheries consultation"
))

services.append(svc(
    "1.19","Fish Registration (FishR) and Boat Registration Services",
    AGR,"Simple","G2C","Fisherfolk and boat owners",
    [],
    [step(1,"Request for fish and boat registration."),
     step(2,"Assist the coordinator during the registration process.")],
    "None","Free","~34 minutes","Register as a fisherfolk and register your boat"
))

# ═══════════════════════════════════════════════════════════════════════════
# 2. ASSESSOR'S OFFICE
# ═══════════════════════════════════════════════════════════════════════════
services.append(svc(
    "2.1","Application for Transfer of Ownership",
    ASS,"Simple","G2C","All taxpayers",
    [req("Certified True Copy of Title","Assessor's Office / Assessment Division"),
     req("Deed of Absolute Sale / Deed of Donation / Extrajudicial Settlement, BIR CAR, Transfer Fee, Tax Clearance, Affidavit of Publication (for Extrajudicial Settlement), Special Power of Attorney, Secretary Certificate (if any)","Owner to provide"),
     req("Affidavit of Consolidation and Certificate of Sale (for Foreclosed Property)","Owner to provide"),
     req("Notarized Sworn Statement","Notary Public"),
     req("Updated Realty Tax Payment","Treasury Office"),
     req("Filled up Sworn Statement","Assessor's Office")],
    [step(1,"Present and submit all required documents to the Assessor's Office."),
     step(2,"Fill up Sworn Statement."),
     step(3,"Pay corresponding fee (Php 200.00) at the Treasurer's Office."),
     step(4,"Wait for processing and release of owner's copy of Tax Declaration (approximately 3 days).")],
    "200.00","Php 200.00 (Sworn Statement: Php 100.00 + Notary: Php 100.00)",
    "Approximately 3 days (depending on volume)","Transfer a property's tax declaration to a new owner",
    supporting={"note":"Lack of any requirement will NOT be considered ACCEPTED."}
))

services.append(svc(
    "2.2","Application for Appraisal and Assessment of New Buildings and Improvements",
    ASS,"Simple","G2C/G2B","All taxpayers",
    [req("Floor Plan","Owner to provide"),
     req("Occupancy Permit","Municipal Engineering Office"),
     req("Certificate of Completion","Municipal Engineering Office"),
     req("Building Permit","Municipal Engineering Office"),
     req("Picture of Improvement","Owner to provide"),
     req("Updated Realty Tax Payment","Treasury Office"),
     req("Secretary Certificate (if owned by Corp.)","Corporation"),
     req("Notarized Sworn Statement","Notary Public")],
    [step(1,"Present and submit requirements for appraisal and assessment."),
     step(2,"Wait for ocular inspection and FAAS preparation."),
     step(3,"Wait for Provincial Assessor approval (within 2 weeks)."),
     step(4,"Receive owner's copy of Tax Declaration and FAAS.")],
    "250.00","Php 250.00 (Sworn Statement: Php 100.00 + Notary: Php 100.00 + Documentary Stamps: Php 50.00)",
    "~2 weeks (including Provincial Assessor approval)","Get your new building assessed for taxes",
    supporting={"note":"If not the land owner, support any proof (Deed of Sale, Deed of Usufruct, Letter of Consent, etc.)."}
))

services.append(svc(
    "2.3","Issuance of Certified True Copy of Tax Declaration and Certified Copy of Tax Map",
    ASS,"Simple","G2C/G2B/G2G","All taxpayers",
    [req("Updated Realty Tax Payment","Treasury Office"),
     req("Authority from the owner if the requesting party is not the owner","Owner to provide")],
    [step(1,"Present updated Realty Tax Payment and fill up request slip / request letter."),
     step(2,"Secure Order of Payment and pay at Treasurer's Office."),
     step(3,"Receive Certified True Copy of Tax Declaration and/or Certified Tax Map.")],
    "100.00","Php 100.00 per Tax Declaration + Php 30.00 Documentary Stamps; Php 100.00 per Tax Map",
    "10–30 minutes (per document)","Get a certified copy of your tax declaration or tax map"
))

services.append(svc(
    "2.4","Issuance of Certificate of No Property or Landholdings",
    ASS,"Simple","G2C","All taxpayers",
    [req("Updated Realty Tax Payment","Treasury Office"),
     req("Authority from the owner if the requesting party is not the owner","Owner to provide")],
    [step(1,"Present latest Realty Tax Payment and fill up request slip."),
     step(2,"Secure Order of Payment and pay at Treasury Office."),
     step(3,"Receive the approved certification.")],
    "130.00","Php 130.00 (Certification: Php 100.00 + Documentary Stamps: Php 30.00)",
    "~11 minutes","Get a certificate proving you have no property"
))

services.append(svc(
    "2.5","Application for Reclassification of Real Property",
    ASS,"Simple","G2C","All taxpayers",
    [req("Request Letter","Assessor's Office"),
     req("Lot Plan","Owner to provide"),
     req("Updated Realty Tax Payment","Treasury Office"),
     req("Picture of the Property","Owner to provide"),
     req("Notarized Sworn Statement","Notary Public")],
    [step(1,"Present all requirements and fill up Sworn Statement."),
     step(2,"Pay corresponding fee at the Treasury Office."),
     step(3,"Wait for ocular inspection and FAAS preparation."),
     step(4,"Receive owner's copy of Tax Declaration after Provincial Assessor approval (~2 weeks).")],
    "200.00","Php 200.00 (Sworn Statement: Php 100.00 + Notary: Php 50.00 + Documentary Stamps: Php 50.00)",
    "~2 weeks (including Provincial Assessor approval)","Reclassify your property's land use",
    supporting={"note":"A duly approved zoning ordinance also serves as basis in the reclassification of lands."}
))

services.append(svc(
    "2.6","Application for Lot Segregation or Consolidation",
    ASS,"Simple","G2C","All taxpayers",
    [req("Request Letter","Assessor's Office"),
     req("2 copies of Subdivision / Consolidation Plan","Owner to provide"),
     req("Certified true copy of TCT","Registry of Deeds"),
     req("Updated Real Property Tax","Treasury Office"),
     req("Notarized Sworn Statement","Notary Public")],
    [step(1,"Present all requirements and fill up Sworn Statement."),
     step(2,"Pay corresponding fee at the Treasury Office."),
     step(3,"Wait for tax mapping and encoding of subdivided/consolidated parcels."),
     step(4,"Receive new Tax Declarations and Notice of Assessment.")],
    "100.00","Php 100.00 (Sworn Statement: Php 100.00)",
    "~1 week (depending on number of parcels)","Subdivide or consolidate your land's tax declaration"
))

services.append(svc(
    "2.7","Application for Newly Acquired Machineries",
    ASS,"Simple","G2B","All taxpayers",
    [req("Request Letter","Assessor's Office"),
     req("Duly certified copy of itemized list of machineries","Owner to provide"),
     req("Original cost and date of operation/acquisition of machineries","Owner to provide"),
     req("Notarized/Filled up Sworn Statement","Notary Public")],
    [step(1,"Present all requirements and fill up Sworn Statement."),
     step(2,"Pay corresponding fee at the Treasury Office."),
     step(3,"Wait for ocular inspection and FAAS preparation."),
     step(4,"Receive Tax Declaration and Notice of Assessment after Provincial Assessor approval (~2 weeks).")],
    "200.00","Php 200.00 (Sworn Statement: Php 100.00 + Notary: Php 50.00 + Documentary Stamps: Php 50.00)",
    "~2 weeks (including Provincial Assessor approval)","Declare and assess newly acquired machinery for taxes"
))

services.append(svc(
    "2.8","Application for Newly Declared Real Property (Land)",
    ASS,"Simple","G2C","All taxpayers",
    [req("Request Letter","Assessor's Office"),
     req("Approved Plan","Owner to provide"),
     req("Lot Data Computation","Owner to provide"),
     req("Cadastral Map","Owner to provide"),
     req("DENR Certification","DENR"),
     req("Certification of Alienable/Disposable","DENR"),
     req("Affidavit of Ownership","Notary Public"),
     req("Affidavit of Adjoining Owner","Notary Public"),
     req("Affidavit of Waiver of Rights","Notary Public"),
     req("Barangay Certification","Barangay Hall"),
     req("Photocopy of Identification Card of Owner","Owner to provide"),
     req("Picture of the Property","Owner to provide"),
     req("Notarized Sworn Statement","Notary Public")],
    [step(1,"Present all requirements and fill up Sworn Statement."),
     step(2,"Pay corresponding fee at the Treasury Office."),
     step(3,"Wait for ocular inspection and FAAS preparation. Note: owner required to pay 10 years back taxes."),
     step(4,"Receive Tax Declaration after Provincial Assessor approval (~2 weeks).")],
    "200.00","Php 200.00 + 10 years back taxes",
    "~2 weeks (including Provincial Assessor approval)","Declare a new piece of land for real property tax"
))

services.append(svc(
    "2.9","Annotation and Cancellation of Mortgage, Adverse Claim, Hold Transaction and Other Annotations",
    ASS,"Simple","G2C/G2G","All taxpayers",
    [req("Request Letter","Assessor's Office"),
     req("Two (2) copies of the documents (Mortgage / Cancellation of Mortgage)","Owner to provide"),
     req("Official receipt for Annotation","Treasury Office")],
    [step(1,"Present all requirements."),
     step(2,"Wait for preparation of indorsement letter to Provincial Assessor's Office."),
     step(3,"Annotation/Cancellation is done after Provincial Assessor approval (~2 weeks).")],
    "100.00","Php 100.00","~2 weeks (including Provincial Assessor approval)",
    "Annotate or cancel a mortgage or claim on your property"
))

services.append(svc(
    "2.10","Annotation and Cancellation of Warrant of Levy",
    ASS,"Simple","G2G","All taxpayers",
    [req("Indorsement of Notice of Annotation and Notice of Cancellation of Warrant of Levy","Provincial Assessor's Office")],
    [step(1,"Submit the Indorsement of Notice of Annotation or Notice of Cancellation of Warrant of Levy."),
     step(2,"Wait for verification and annotation/cancellation on FAAS and Tax Declaration.")],
    "None","Free","~15 minutes",
    "Annotate or cancel a warrant of levy on a tax declaration"
))

services.append(svc(
    "2.11","Application for Verification of Property",
    ASS,"Simple","G2C","All taxpayers",
    [],
    [step(1,"Present request slip for verification and pay corresponding fee at the Treasurer's Office."),
     step(2,"Receive verification result (computerized and/or manual tax mapping).")],
    "100.00","Php 100.00 per RPU (Real Property Unit)","~5–10 minutes per RPU",
    "Verify property ownership and location details"
))

services.append(svc(
    "2.12","Application for Cancellation of Assessment for Land, Improvement and Machineries",
    ASS,"Simple","G2C/G2G","All taxpayers",
    [req("Request Letter for cancellation of assessment","Assessor's Office"),
     req("Fire Certificate (for property razed by fire)","Bureau of Fire Protection"),
     req("Demolition Permit (for demolished improvement)","Municipal Engineering Office"),
     req("Updated Real Property Tax","Treasury Office")],
    [step(1,"Present and submit all requirements."),
     step(2,"Wait for ocular inspection and preparation of Notice of Cancellation."),
     step(3,"Receive owner's copy of Notice of Cancellation after Provincial Assessor approval (~2 weeks).")],
    "None","Free","~2 weeks (including Provincial Assessor approval)",
    "Cancel the tax assessment on a demolished or burned property"
))

services.append(svc(
    "2.13","Issuance of Certified True Copy of Documents",
    ASS,"Simple","G2C/G2B/G2G","All taxpayers",
    [req("Request Letter stating the purpose","Owner / Representative to provide"),
     req("Authorization Letter if the requestee is not the registered owner","Owner to provide")],
    [step(1,"Present and submit required documents."),
     step(2,"Pay corresponding fee at the Treasurer's Office."),
     step(3,"Receive certified requested documents.")],
    "130.00","Php 130.00 (Certified Xerox Copy: Php 100.00 + Documentary Stamps: Php 30.00)",
    "1–4 days (depending on document year)","Get a certified copy of documents on file at the Assessor's Office"
))

# ═══════════════════════════════════════════════════════════════════════════
# 3. GENDER AND DEVELOPMENT OFFICE
# ═══════════════════════════════════════════════════════════════════════════
services.append(svc(
    "3.1","Assisting Clients",
    GAD,"Simple","G2C/G2G","All",
    [req("Visitor's Logbook registration","Gender and Development Office")],
    [step(1,"Register in Visitor's Logbook."),
     step(2,"Proceed to the concerned offices as endorsed by GAD staff.")],
    "None","Free","~6 minutes","Get directed to the right office for your concern"
))

services.append(svc(
    "3.2","Trainings and Seminars (GAD)",
    GAD,"Complex","G2G/G2C","GAD Focal Persons, Barangays, GFPS Members, and all concerned",
    [req("Request letter for Venue, Chairs, Tables and Sound system","Other Offices for GAD office conducted training"),
     req("Project Proposal","GAD Office"),
     req("Letter of Invitation / Program of Invitation","GAD Office / other concerned office"),
     req("Attendance","GAD Office / other concerned office"),
     req("Certificate of Participation","GAD Office / other concerned office")],
    [step(1,"Wait for the announcement from the GAD office."),
     step(2,"Comply with requirements and instructions from the concerned offices.")],
    "None","Free","Days to weeks before training/seminar","Attend or request a GAD training or seminar"
))

services.append(svc(
    "3.3","PAPs – Projects, Activities and Programs (Events)",
    GAD,"Complex","G2G/G2C","GAD Focal Persons and Barangays",
    [req("Request letter for Venue, Chairs, Tables and Sound system","GAD Office"),
     req("Project Proposal","GAD Office"),
     req("Letter of Invitation / Program of Invitation","GAD Office / other concerned office"),
     req("Attendance","GAD Office / other concerned office"),
     req("Certificate of Participation","GAD Office / other concerned office")],
    [step(1,"Wait for the announcement from the GAD office."),
     step(2,"Comply with requirements and instructions from the concerned offices.")],
    "None","Free","Days to weeks before event","Participate in GAD-funded projects, activities, and programs"
))

services.append(svc(
    "3.4","Project Management, Research and Reporting (GAD)",
    GAD,"Simple","G2G/G2C","GAD-related personnel and offices",
    [req("2 to 3 copies of the said report from/to concerned Department or Client","GAD Office / Other concerned departments")],
    [step(1,"Proceed to the Municipal GAD office or concerned departments."),
     step(2,"Submit required documents.")],
    "None","Free","1–2 days","Submit or process GAD-related reports and research"
))

services.append(svc(
    "3.5","Meetings (GAD)",
    GAD,"Simple","G2G/G2C","All",
    [req("Request letter for Venue, Chairs, Tables and Sound system","GAD Office"),
     req("Program of expense","GAD Office"),
     req("Letter of Invitation / Program of Invitation","GAD Office / other concerned offices"),
     req("Sex Disaggregated Data","GAD Office")],
    [step(1,"Wait for the announcement from the GAD office or concerned departments.")],
    "None","Free","2–4 hours","Attend a GAD-organized meeting"
))

services.append(svc(
    "3.6","Conventions (GAD)",
    GAD,"Complex","G2G/G2C","GAD Focal Persons and Barangays",
    [req("Request letter for Venue","GAD Office"),
     req("Project Proposal","GAD Office"),
     req("Letter of Invitation / Program of Invitation","GAD Office / other concerned offices"),
     req("Certificate of Participation and Recognition","GAD Office / other concerned offices")],
    [step(1,"Wait for the announcement from the GAD office."),
     step(2,"Comply with requirements and instructions from the concerned offices.")],
    "None","Free","Days to weeks before convention","Participate in a GAD convention"
))

services.append(svc(
    "3.7","Anti-Sexual Harassment – Committee on Decorum and Investigation (CODI)",
    GAD,"Complex","G2G/G2C","GAD Focal Persons, Barangays, and employees",
    [req("Notarized letter of complaints","Notary Public")],
    [step(1,"Submit notarized letter of complaints."),
     step(2,"Undergo short interview."),
     step(3,"Wait for the invitation by the CODI Council.")],
    "None","Free","Days to weeks (depending on case)","File an anti-sexual harassment complaint"
))

# ═══════════════════════════════════════════════════════════════════════════
# 4. GENERAL SERVICES OFFICE
# ═══════════════════════════════════════════════════════════════════════════
services.append(svc(
    "4.1","Implementation of IATF Disciplinary Guidelines",
    GSO,"Simple","G2C","Taytay Residents",
    [req("IATF Guidelines, Related Ordinances, Ordinance 33 S. 2020","GSO Office")],
    [step(1,"Pay Violation Ticket.")],
    "3500.00","Php 1,000 (driver's license release) + Php 2,500 (vehicle release) = Php 3,500",
    "1 hour","Pay IATF violation and claim impounded vehicle or license"
))

services.append(svc(
    "4.2","Implementation of Solid Waste Management Program (SWMO)",
    GSO,"Simple","G2C","Taytay Residents",
    [req("R.A. 9003, Ordinance 15 S. 2008, Ordinance 12 S. 2017","GSO / SWMO Office")],
    [step(1,"Pay Violation Ticket.")],
    "3500.00","Php 1,000 (driver's license release) + Php 2,500 (vehicle release) = Php 3,500",
    "1 hour","Pay solid waste management violation and claim impounded vehicle or license"
))

services.append(svc(
    "4.3","Clean and Green",
    GSO,"Simple","G2C","Taytay Residents",
    [req("Request letter","Requesting party")],
    [step(1,"Submit request letter."),
     step(2,"Service is provided within 24 hours.")],
    "None","Free","24 hours","Request a clean-up or greening service"
))

services.append(svc(
    "4.4","Central Supply Unit – Dispensing of Medical Supplies",
    GSO,"Simple","G2G","All sections or departments of Health Office",
    [req("Requisition and Issue Slip (RIS)","Clinical Area")],
    [step(1,"Fill up RIS form."),
     step(2,"Wait for preparation of requested supplies (availability check)."),
     step(3,"Receive issued supplies and validate quantity.")],
    "None","Free","32 minutes","Request medical supplies from the Central Supply Unit"
))

services.append(svc(
    "4.5","Central Supply Unit – Printing of Forms",
    GSO,"Simple","G2G","All sections or departments of Health Office",
    [req("Service Request Slip","Printing Unit")],
    [step(1,"Request for printing of needed forms/documents."),
     step(2,"Receive printed forms/documents.")],
    "None","Free","40 minutes","Request printing of health forms and documents"
))

services.append(svc(
    "4.6","Central Supply Unit – Replenishment of Oxygen Tanks",
    GSO,"Simple","G2G","All sections or departments of Health Office",
    [req("Acknowledgement Form","Requesting Areas / Patients")],
    [step(1,"Request for refill/replenishment of Oxygen Tanks.")],
    "None","Free","1 hour 5 minutes","Request oxygen tank refilling for patients"
))

services.append(svc(
    "4.7","Central Supply Unit – Collection and Transport of General and Hazardous Waste",
    GSO,"Simple","G2G","All sections or departments of Health Office",
    [req("Permit to Transport","Requesting Sections")],
    [step(1,"Request for collection of general and hazardous wastes.")],
    "None","Free","12 hours","Request collection and transport of hazardous waste"
))

services.append(svc(
    "4.8","Central Supply Unit – Repair of Medical Equipment",
    GSO,"Simple","G2G","All sections or departments of Health Office",
    [req("Notice of Request for Inspection","Requesting Sections")],
    [step(1,"Submit filled request for repair and quotation of supplier.")],
    "None","Free","30 minutes (inspection)","Request repair of medical equipment"
))

services.append(svc(
    "4.9","Delivery of Supplies and Properties",
    GSO,"Simple","G2G","Municipal employees of Taytay",
    [req("Request letter","Requesting office")],
    [step(1,"Fill out Notice of Delivery and Request for Inspection."),
     step(2,"Deliver items to Supply or Property Management Section."),
     step(3,"Inspection of delivery and endorsement of complete documents.")],
    "None","Free","1 hour 5 minutes","Process delivery of government supplies and properties"
))

services.append(svc(
    "4.10","Issuance of Office Supplies and Properties",
    GSO,"Simple","G2G","Municipal employees of Taytay",
    [req("Request letter","Requesting office"),
     req("Approved Requisition and Issue Slip (RIS)","GSO")],
    [step(1,"Request for office, janitorial, electrical, and other supplies."),
     step(2,"Accept requested supplies after preparation and recording.")],
    "None","Free","55 minutes","Request and receive office supplies from the GSO"
))

services.append(svc(
    "4.11","Property Management – Release of Equipment",
    GSO,"Simple","G2G","Municipal employees of Taytay",
    [req("Request letter","Requesting office")],
    [step(1,"Forward letter-request for provision of items/equipment."),
     step(2,"Wait for Property Management Section to check availability and prepare PAR and ICS."),
     step(3,"Receive and acknowledge equipment.")],
    "None","Free","1 hour 20 minutes","Request and receive government equipment from the GSO"
))

services.append(svc(
    "4.12","Property Management – Return of Unserviceable Properties",
    GSO,"Simple","G2G","All government departments, units, offices, and divisions",
    [req("Property Return Slip (PRS)","GSO authorized representative")],
    [step(1,"Secure Property Return Slip (PRS) form and fill out required information."),
     step(2,"Submit PRS form to the GSO authorized representative."),
     step(3,"Coordinate with GSO for turn-over of properties to the warehouse.")],
    "None","Free","1 hour 15 minutes (depending on volume)","Return unserviceable government properties"
))

services.append(svc(
    "4.13","Property Management – Issuance of Clearance from Property Accountability",
    GSO,"Simple","G2G","Resigned, retired, transferred, and deceased employees",
    [req("Letter of Request addressed to the General Services Officer","Employee"),
     req("Cedula / Sedula","Treasury Office"),
     req("Employee's ID","Employee")],
    [step(1,"Submit a request for clearance from accountabilities."),
     step(2,"Wait for inventory check and inspection of accountable properties."),
     step(3,"Receive Clearance from Property Accountability.")],
    "None","Free","~37 minutes","Get cleared from property accountability upon separation from service"
))

services.append(svc(
    "4.14","Property Insurance and Registration Unit (PIRU) – Vehicle Insurance and LTO Registration",
    GSO,"Simple","G2G/G2B","Municipal employees of Taytay / Authorized drivers",
    [req("Land Transportation Office (LTO) Form","GSO / LTO"),
     req("Original Receipt and Certificate of Registration (OR, CR)","LTO")],
    [step(1,"Visit GSO and approach the Property Insurance and Registration Unit (PIRU)."),
     step(2,"Submit required documents for GSIS insurance or LTO registration."),
     step(3,"Receive processed documents and registration.")],
    "None","Free (government-funded)","~35 minutes","Register and insure government vehicles"
))

services.append(svc(
    "4.15","Utilities – Processing of Payment of Government Bills",
    GSO,"Simple","G2G/G2B","Municipal employees of Taytay",
    [req("Statement of Account (SOA) from the Utility Provider","Utility Provider")],
    [step(1,"Provide Statement of Account (SOA) to GSO Utilities staff."),
     step(2,"Documents are endorsed to Administrator's Office, Budget Office, Accounting Office, and Treasury Office for signature and payment.")],
    "None","Free (internal process)","~2 weeks","Process payment of government utility bills"
))

services.append(svc(
    "4.16","Food Distribution or Supplies",
    GSO,"Simple","G2G","Local Government Offices",
    [req("Attendance sheet of attendees","Mayor's Office / Procurement Office")],
    [step(1,"Deliver the food items/goods from the supplier to the General Services Office."),
     step(2,"GSO food supplies management section receives, counts, and distributes foods at official activities.")],
    "None","Free","~3 hours 40 minutes","Arrange food distribution for official municipal activities"
))

services.append(svc(
    "4.17","Request for Fuel Allocation for Government Equipment and Vehicles",
    GSO,"Simple","G2G","Authorized drivers",
    [req("Valid driver's license","Driver"),
     req("Official Receipt and Certificate of Registration (OR/CR) of the vehicle","Driver")],
    [step(1,"Submit a letter-request to the General Services Officer requesting fuel allocation approval."),
     step(2,"Submit a copy of valid driver's license and OR/CR of the vehicle."),
     step(3,"If approved, request is endorsed to the Legal Office for issuance of Fuel Allocation Slip."),
     step(4,"Present the signed fuel slip to UNIOIL (located at C6, Taytay, Rizal) for fuel release.")],
    "None","Free","~30 minutes","Get a fuel allocation slip for a government vehicle"
))

services.append(svc(
    "4.18","Resources Management – Tent, Drum Fan, Air Cooler, Tarpaulin Installation, and Additional Manpower",
    GSO,"Simple","G2C/G2G","Taytay Residents and Municipal Employees",
    [req("Request letter (must specify date, occasion, address, and contact number)","Requesting party")],
    [step(1,"Submit or forward a letter request to the Office of the Municipal Mayor through the General Services Officer."),
     step(2,"Must specify date, occasion, address, and contact number."),
     step(3,"GSO schedules the activity and notifies requestor for confirmation.")],
    "None","Free","~5 hours 25 minutes","Request tents, fans, sound, tarpaulin, or manpower for events"
))

services.append(svc(
    "4.19","Building Maintenance",
    GSO,"Simple","G2G","Municipal Offices of Taytay",
    [req("Filled out Job Order Form or Request letter signed by the Supervising Head","Building Maintenance Office")],
    [step(1,"Fill out the Job Order Form or Request letter and have it signed by the Supervising Head."),
     step(2,"GSO building maintenance section assesses and carries out the required repairs.")],
    "None","Free","~20 minutes (initial); varies by work required","Request repair or maintenance of a municipal building"
))

services.append(svc(
    "4.20","Sound System Services",
    GSO,"Simple","G2G/G2C","LGUs, organizations, and interested individuals",
    [req("Request letter (must specify date, time, venue, and contact number)","Requesting party")],
    [step(1,"Submit a Request letter specifying the date, time, venue, and contact number."),
     step(2,"GSO schedules and sets up the sound system for the event.")],
    "None","Free","~50 minutes","Request a government sound system for events"
))

services.append(svc(
    "4.21","Vehicle Maintenance and Motorpool Services",
    GSO,"Simple","G2G","Municipal employees of Taytay",
    [req("Request letter","Requesting office"),
     req("Government-issued vehicle","Employee's department")],
    [step(1,"Submit PMS request letter."),
     step(2,"Bring the government-issued vehicle to the Motorpool Section."),
     step(3,"Wait for inspection, repair, and final inspection before vehicle release.")],
    "None","Free","~4 hours (varies by repair)","Get a government vehicle repaired or maintained"
))

services.append(svc(
    "4.22","Solid Waste Management Section – Garbage Collection",
    GSO,"Simple","G2G","Municipal employees of Taytay",
    [req("Request letter","Requesting party"),
     req("Government-issued vehicle (if applicable)","Department")],
    [step(1,"Request for garbage collection as per schedule.")],
    "None","Free","~25 minutes","Request or monitor scheduled garbage collection"
))

services.append(svc(
    "4.23","Impounding Section – Claiming of Impounded Vehicles or Goods",
    GSO,"Simple","G2G/G2C","General Public",
    [req("Proof of Ownership","Owner to provide"),
     req("Driver's License","Owner to provide"),
     req("OR/CR","Owner to provide")],
    [step(1,"Submit receipt or proof of payment and other related documents."),
     step(2,"GSO verifies documents and releases impounded vehicle or items to the rightful owner.")],
    "Varies","As per violation receipt","~25 minutes","Claim your impounded vehicle or confiscated goods"
))

services.append(svc(
    "4.24","CCTV Footage Request (Municipal Building Security Section – MBSS)",
    GSO,"Simple","G2G","Municipal employees and general public",
    [req("Request Form (MBSS Office, Municipal Building)","Security Office, Municipal Building")],
    [step(1,"Properly accomplish the request form with: Name, Address, Contact Number, Details and purpose, Date and Time of Incident, and Location."),
     step(2,"MBSS personnel reviews the requested CCTV footage (~40 minutes).")],
    "None","Free","~45 minutes","Request a review of CCTV footage for incident documentation"
))

services.append(svc(
    "4.25","Lost and Found (Municipal Building Security Section – MBSS)",
    GSO,"Simple","G2G","Municipal employees and general public",
    [req("Lost and Found Form","Security Office, Municipal Building")],
    [step(1,"Properly accomplish the Lost and Found Form with: Name, Address, Contact Number, Date and Time of Incident, and Location."),
     step(2,"Present complete requirements and valid ID with precise item description."),
     step(3,"If ownership is proven, receive the found item and sign the blotter logbook.")],
    "None","Free","~15 minutes","Report a lost item or claim a found item at the Municipal Building"
))

services.append(svc(
    "4.26","GSO Free Water Refilling Station",
    GSO,"Simple","G2G","Municipal employees of Taytay",
    [req("Water bottles or water container","Employee to provide")],
    [step(1,"Visit the GSO and approach the personnel-in-charge at the water refilling station."),
     step(2,"Staff cleans, inspects, and refills your water bottles."),
     step(3,"Receive refilled water bottles.")],
    "None","Free","~20 minutes","Get free drinking water at the GSO Water Refilling Station"
))

# ═══════════════════════════════════════════════════════════════════════════
# 5. LOCAL CIVIL REGISTRY OFFICE
# ═══════════════════════════════════════════════════════════════════════════
services.append(svc(
    "5.1","Timely Registration of Certificate of Live Birth (Born in Taytay, Rizal)",
    LCR,"Simple","G2C","Parents, guardians, hospitals, maternity/lying-in clinics, and birth attendants of registrants born in Taytay",
    [req("Properly accomplished Municipal Form No. 102 – Certificate of Live Birth (1 set, all original, black ink)","Hospital, Maternity/Lying-In Clinics, other birthing facilities"),
     req("Certificate of Marriage of Parents (if married)","PSA"),
     req("Notarized Affidavit of Admission of Paternity (if child acknowledged – for Illegitimate Child)","LCRO, Law Offices, Notary Public"),
     req("Notarized Affidavit to Use the Surname of the Father (if applicable – for Illegitimate Child)","LCRO, Law Offices, Notary Public")],
    [step(1,"Present properly accomplished Municipal Form No. 102 – Certificate of Live Birth and all requirements within 30 days from birth."),
     step(2,"LCRO checks completeness of entries and assigns registry number."),
     step(3,"Receive released personal copy of the document.")],
    "None","Free","~17 minutes","Register your baby's birth certificate within 30 days"
))

services.append(svc(
    "5.2","Late Registration of Certificate of Live Birth (Born in Taytay, Rizal)",
    LCR,"Highly Technical","G2C","Parents, guardians, and registrants born in Taytay – filing after the 30-day period",
    [req("Certificate of Live Birth for Late Registration (1 Set)","Hospital, Maternity/Lying-In Clinics, other birthing facilities"),
     req("Negative Result from PSA (1 Original)","PSA"),
     req("Baptismal Certificate (1 Original, 1 Photocopy)","Church / Place of Baptism"),
     req("Personal Appearance of registrant or parent/guardian (as applicable)","LCRO"),
     req("For Legitimate Child (17 and below): Certified True Copy of Parents' Certificate of Marriage, Notarized Joint Affidavit of Two Disinterested Persons, Affidavit of Late Registration, Notarized Affidavit of Registrant per PSA MC No. 2024-17A, Form 137/School Records, Philsys National ID/transaction slip, 2x2 ID Photo, Government-issued IDs, Barangay Certification of Residency, Certificate of Death of parent/s (if applicable)","Various agencies"),
     req("For Illegitimate Child (17 and below): Same as above plus Notarized Affidavit of Admission of Paternity, Notarized Affidavit to Use the Surname of the Father, Notarized Sworn Attestation (for children 7–17)","LCRO, Law Offices, Notary Public"),
     req("For Applicants 18 and above: All above plus NBI Clearance, Police Clearance, SSS E-1, Philhealth MDR, GSIS Service Record, Voter's Registration Record, Income Tax Return, Medical Records, Affidavit of Abandonment (if applicable)","NBI, PNP, SSS, Philhealth, GSIS, COMELEC")],
    [step(1,"Present accomplished COLB form and submit all required documents."),
     step(2,"Conduct of interview with the client/parents/registrant."),
     step(3,"Registration after 10-day posting period."),
     step(4,"Receive owner's copy after posting period.")],
    "None","Free (Out-of-town courier: Php 90–150 depending on location)",
    "11 days, 17 minutes","Register a birth certificate after the 30-day deadline"
))

services.append(svc(
    "5.3","Application and Issuance of Marriage License (Residents of Taytay, Rizal)",
    LCR,"Highly Technical","G2C","Marriage applicants who are at least 18 years of age, with at least one applicant residing in Taytay",
    [req("Accomplished Application Form for Marriage License (AML) – 2 Copies","LCRO"),
     req("Personal Appearance of both contracting parties","LCRO"),
     req("Birth Certificate or Baptismal Certificate (1 Original, 1 Photocopy)","LCRO / PSA / Church"),
     req("Community Tax Certificate (Cedula)","Municipal Treasury Office"),
     req("Valid IDs of both applicants (at least one showing residency in Taytay, Rizal)","Applicants to provide"),
     req("Certificate of No Marriage (CENOMAR) from PSA for both contracting parties (issued within 6 months)","PSA"),
     req("Pre-Marriage Orientation and Counseling Certificate (Family Planning and Marriage Counseling)","POPCOM / LGU"),
     req("Parental Consent Form (Municipal Form No. 92) for ages 18–20 (if applicable)","LCRO"),
     req("Parental Advice (Municipal Form No. 8) for ages 21–25 (if applicable)","LCRO"),
     req("Certificate of Legal Capacity to Marry (for foreigners)","Embassy of country of origin"),
     req("Certificate of Death of spouse (for widow/widower)","LCRO where death was registered / PSA"),
     req("Certified True Copy of Decree of Annulment / Absolute Nullity of Marriage (if applicable)","Court where decree was issued"),
     req("Photocopy of valid passport (for foreigners)","Applicant to provide")],
    [step(1,"Secure marriage license application form, present with required documents, and both applicants will be interviewed."),
     step(2,"Pay the corresponding fees (Php 600.00) at the Municipal Treasury Office."),
     step(3,"Attend family planning and marriage counseling (PMOC) every Friday morning."),
     step(4,"Receive Marriage License after 10-day posting and payment of Municipal Form No. 10 (Php 2.00).")],
    "602.00","Php 600.00 marriage fees + Php 2.00 (Accountable Form No. 54)",
    "11 days + 2–3 hours PMOC","Apply for a marriage license",
    supporting={"note":"Marriage License is valid for 120 days from date of issuance, in any part of the Philippines."}
))

services.append(svc(
    "5.4","Timely Registration of Certificate of Marriage (Married in Taytay, Rizal)",
    LCR,"Simple","G2C","Contracting parties married in Taytay, Rizal",
    [req("Signed and Accomplished Marriage Certificate","Church / Place of Marriage"),
     req("Marriage License","LCRO where the Marriage License was issued"),
     req("Request for the Celebration of Marriage in a place other than those authorized by law (if applicable)","Place of Marriage")],
    [step(1,"Submit the Certificate of Marriage for registration."),
     step(2,"LCRO registers the Certificate of Marriage and assigns Registry Number."),
     step(3,"Receive owner's copy of the Certificate of Marriage.")],
    "None","Free","~17 minutes","Register a marriage certificate within the prescribed period"
))

services.append(svc(
    "5.5","Late Registration of Certificate of Marriage (Married in Taytay, Rizal)",
    LCR,"Highly Technical","G2C","Solemnizing officers and contracting parties whose marriage was not registered within the prescribed period",
    [req("Duly Accomplished and Signed Certificate of Marriage (Original or Duplicate Copy)","Solemnizing Officer / Church / Place of Marriage"),
     req("Latest CENOMAR from PSA for both contracting parties (within 6 months of submission)","PSA"),
     req("Affidavit of Delayed Registration of Certificate of Marriage executed by the Solemnizing Officer","Law Offices / Notary Public"),
     req("Sworn Statement/Affidavit of Contracting Parties stating the reason for delay","Law Offices / Notary Public"),
     req("Wedding Pictures","Client to provide"),
     req("Certified Copy of Application for Marriage License (if applicable)","Client's copy"),
     req("Certified True Copy of Birth Certificate of the couple's children with Date and Place of Marriage (if with children)","LCRO where children were born / PSA"),
     req("Affidavit of Cohabitation (if exempt from Marriage License requirement under Article 34)","Law Offices / Notary Public")],
    [step(1,"Submit the signed Certificate of Marriage and all requirements."),
     step(2,"Accomplish the new Certificate of Marriage following the information in the old copy (no changes to entries)."),
     step(3,"Registration after 10-day posting period."),
     step(4,"Receive owner's copy after posting period.")],
    "None","Free","11 days, 17 minutes","Register a marriage certificate after the prescribed period"
))

services.append(svc(
    "5.6","Timely Registration of Certificate of Death",
    LCR,"Simple","G2C","Funeral parlors and general public whose relatives died in Taytay, Rizal",
    [req("Duly accomplished Municipal Form No. 103 – Certificate of Death/Fetal Death Form (1 Set)","Hospitals / Funeral Parlors"),
     req("Autopsy Report (if applicable)","PNP Medico-Legal Section"),
     req("Certification of Health Officer (Certificate of Death)","Municipal Health Office"),
     req("Certification of Embalmer (back portion of Certificate of Death)","Funeral Parlor"),
     req("Post Mortem of Death Certificate (if applicable)","LCRO"),
     req("Burial/Cremation Permit","LCR / Municipal Treasury Office"),
     req("Transfer of Cadaver (if applicable)","LCRO / Municipal Health Office")],
    [step(1,"Present accomplished Certificate of Death with complete signatures."),
     step(2,"Pay Burial/Cremation Permit fee (Php 150.00) at the Municipal Treasury Office (if applicable)."),
     step(3,"Pay Transfer Permit fee (Php 150.00) at the Municipal Treasury Office (if applicable)."),
     step(4,"LCRO registers the Certificate of Death and assigns Registry Number."),
     step(5,"Receive owner's copy after signing of documents.")],
    "150.00","Php 150.00 (burial/cremation permit or transfer permit, if applicable)",
    "~17–22 minutes","Register a death certificate within the prescribed period"
))

services.append(svc(
    "5.7","Late Registration of Certificate of Death",
    LCR,"Highly Technical","G2C","Funeral parlors and general public whose relatives died in Taytay, Rizal – filing after 30-day period",
    [req("Duly accomplished Municipal Form No. 103 – Certificate of Death/Fetal Death Form (1 Set)","Hospitals / Funeral Parlors"),
     req("Autopsy Report (if applicable)","PNP Medico-Legal Section"),
     req("Certification of Health Officer","Municipal Health Office"),
     req("Certification of Embalmer","Funeral Parlor"),
     req("Post Mortem of Death Certificate (if applicable)","LCRO"),
     req("Certification from the Cemetery or Burial Permit","Cemetery"),
     req("Certificate of Service/Certification from the Funeral Service Provider","Funeral Parlors"),
     req("PSA Negative Certification","PSA"),
     req("Notarized Joint Affidavit of Two Witnesses","Law Offices / Notary Public"),
     req("Picture of Tombstone (Lapida)","Cemetery")],
    [step(1,"Submit Certificate of Death with complete signatures for late registration."),
     step(2,"Registration after 10-day posting period."),
     step(3,"Receive owner's copy after signing of documents.")],
    "None","Free","11 days, 7 minutes","Register a death certificate after the prescribed period"
))

services.append(svc(
    "5.8","Registration of Court Decrees and Orders",
    LCR,"Complex","G2C","Petitioners and persons subject of court decrees/orders",
    [req("Certified True Copy of Court Decision/Order","Court"),
     req("Certified True Copy of Certificate of Finality","Court"),
     req("Certified True Copy of Certificate of Authenticity and Certificate of Registration","LCR Office where case was filed"),
     req("All documents signed and certified by the municipal or city registrar where the case was filed","LCR Office where case was filed")],
    [step(1,"Present all required documents."),
     step(2,"Pay filing fee (Php 1,500.00) and cost of certified copies from court (Php 115.00 per certified page) at the Municipal Treasury Office."),
     step(3,"Submitted documents are subject to review, verification, and preparation of letter to court for authentication."),
     step(4,"Receive owner's copy for submission to PSA Main Office after review.")],
    "1500.00","Php 1,500.00 filing fee + Php 115.00 per certified page of court documents",
    "4 working days (or depending on court's timeline)","Register a court order affecting civil registry records"
))

services.append(svc(
    "5.9","Correction of Civil Registry Documents (R.A. 9048 and R.A. 10172)",
    LCR,"Highly Technical","G2C","Persons whose civil registry documents have clerical/typographical errors, wrong entry of sex, or wrong day/month of date of birth",
    [req("Certified True Copy of the civil registry document sought to be corrected (PSA copy)","PSA"),
     req("Certified True Copy of the civil registry document sought to be corrected (Local copy)","LCRO"),
     req("Personal Appearance of Petitioner","Petitioner to appear in person"),
     req("Supporting documents showing the correct entry (Baptismal Certificate, Marriage Certificate, Voter's Registration, GSIS/SSS records, School records, Government IDs, Passport, etc.) – Original copies to be presented, Certified True Copies to be submitted","Various agencies"),
     req("For Correction of Sex: Medical Certificate from June V. Zapanta Emergency Hospital or accredited government physician","June V. Zapanta Emergency Hospital / Accredited government physician"),
     req("NBI Clearance (latest) – purpose: Petition to Correct Date of Birth/Sex","NBI"),
     req("Police Clearance (latest, with 6 months validity) – purpose: Petition to Correct Date of Birth/Sex","Police District Office"),
     req("Certificate of Employment with No Pending Case (if employed)","Company/Employer of Petitioner"),
     req("Affidavit of Non-Employment (if not employed)","Law Offices / Notary Public"),
     req("Other relevant documents as required by the Municipal Civil Registrar","As applicable")],
    [step(1,"Client inquiry and interview; assessment of applicable requirements."),
     step(2,"Present accomplished correction form with all required documents."),
     step(3,"Pay the prescribed correction fees at the Municipal Treasury Office."),
     step(4,"Receive petition receipt; wait for mandatory 10-day posting and 2-week publication period."),
     step(5,"Await PSA decision (3–4 months).")],
    "1000.00","Php 1,000.00 (Correction of Clerical Error) or Php 3,000.00 (Change of First Name, Entry of Sex, or Date of Birth) + Php 115.00 per Certified True Copy from LCRO",
    "~5 months total (including PSA processing)","Correct errors in your birth, marriage, or death certificate",
    supporting={"note":"Only the Civil Registrar has the quasi-judicial power to implement R.A. 10172. Incomplete requirements will not be received."}
))

services.append(svc(
    "5.10","Issuance of Certified True Copies of Local Civil Registry Documents",
    LCR,"Simple","G2C","Document owners and authorized representatives",
    [req("Request Form for Birth, Marriage, or Death Certificate","LCRO"),
     req("Special Power of Attorney or Authorization Letter (if not the document owner)","Law Office / Notary Public / Document Owner"),
     req("Valid Government-Issued ID of the document owner and authorized representative","Government agency"),
     req("Pertinent information: Name of Document Owner, Complete Date of Vital Event (day, month, year), Name of Requester and Relationship with Document Owner","Client to provide"),
     req("Requested Document (if available)","Client's copy")],
    [step(1,"Submit necessary documents and accomplished Request Form."),
     step(2,"Pay corresponding fee (Php 115.00 per Certified True Copy) at the Municipal Treasury Office."),
     step(3,"Present Official Receipt to LCRO personnel."),
     step(4,"Receive signed Certified True Copy of the requested document.")],
    "115.00","Php 115.00 per Certified True Copy of document",
    "~19–34 minutes (depending on document)","Get a certified copy of a birth, marriage, or death certificate registered in Taytay"
))

# ═══════════════════════════════════════════════════════════════════════════
# 6. LEGAL SERVICES OFFICE
# ═══════════════════════════════════════════════════════════════════════════
for n, svc_name, plain in [
    ("6.1","Review of Memorandum of Agreement (MOA) or Memorandum of Understanding (MOU)","Get an MOA or MOU reviewed by the Legal Office"),
    ("6.2","Review of Contracts","Get a contract reviewed by the Legal Office"),
    ("6.3","Rendering of Legal Opinion","Request a legal opinion from the Legal Office"),
    ("6.4","Formulation and/or Review of Executive Orders, Resolutions, and Ordinances","Get an executive order, resolution, or ordinance drafted or reviewed"),
]:
    services.append(svc(
        n, svc_name, LEG,"Simple","G2G",
        "All departments/offices and employees under the Municipal Government of Taytay",
        [req("Request Letter/Endorsement Letter","Concerned Office/s"),
         req("Hard Copy and Soft Copy of the draft document to be reviewed/formulated","Concerned Office/s"),
         req("Details of the Focal Person handling the document (from the requesting office)","Concerned Office/s")],
        [step(1,"Submit request/endorsement letter with draft document (soft and hard copy) to the Legal Services Office."),
         step(2,"Documents are endorsed to the assigned lawyers."),
         step(3,"Legal personnel coordinate with requesting office for clarifications (1–2 days)."),
         step(4,"The document is reviewed/formulated by the assigned lawyer."),
         step(5,"Receive the reviewed/finalized document.")],
        "None","Free",
        "Simple: 1 day; Complex: 5 days; Highly Technical: 18 days",
        plain
    ))

# ═══════════════════════════════════════════════════════════════════════════
# 7. MANAGEMENT INFORMATION SERVICE SYSTEM
# ═══════════════════════════════════════════════════════════════════════════
services.append(svc(
    "7.1","Technical Assistance for Computer Hardware and Software Issues",
    MISS,"Simple/Complex/Highly Technical","G2G",
    "Taytay LGU employees and national agencies housed by Taytay LGU",
    [req("MISS Request Form","MISS Administrative / Technical Unit")],
    [step(1,"Inform MISS personnel of the concern via phone call or personal appearance."),
     step(2,"Fill up the MISS Service Request Form."),
     step(3,"MISS personnel troubleshoot the equipment/device on-site or at the MISS Office."),
     step(4,"Documentation and recording of resolved issue for future reference.")],
    "None","Free","Varies by difficulty","Get IT support for your computer or device"
))

services.append(svc(
    "7.2","Posting of Articles and Content Updating of the Taytay, Rizal LGU Website",
    MISS,"Simple/Complex","G2G","LGU Taytay offices",
    [req("Hard and Soft Copies of the articles (hard copy and flash drive/portable hard disk)","Public Information Office and other offices")],
    [step(1,"Provide hard and soft copies of the articles to MISS."),
     step(2,"MISS reviews data/articles for completeness and compatibility before uploading to the LGU website.")],
    "None","Free","2–5 minutes per upload; varies by volume","Post articles or update content on the LGU website"
))

services.append(svc(
    "7.3","Systems Maintenance for LGU Offices",
    MISS,"Simple/Complex/Highly Technical","G2G",
    "Taytay LGU system-generated offices, including Taytay Emergency Hospital",
    [req("Hard and Soft Copies of the Articles (if applicable)","Public Information Office and other offices")],
    [step(1,"Request for assistance via phone call or personal appearance to MISS."),
     step(2,"Fill up request form."),
     step(3,"MISS system personnel resolve the system concern on-site. On-site service provider is notified if needed.")],
    "None","Free","Varies by difficulty","Request maintenance of a government software system"
))

services.append(svc(
    "7.4","Monitoring of LGU Network Backbone and SMILE KONEK Free Wi-Fi Network Service",
    MISS,"Complex/Highly Technical","G2G","Taytayeños and government personnel",
    [req("Letter of Request / Service Request Form","MISS")],
    [step(1,"Request for Network Service Access."),
     step(2,"Submit required documents (request form, letter, ticketing system)."),
     step(3,"Await confirmation as MISS assesses network capacity and availability (~1 hour)."),
     step(4,"Receive access credentials."),
     step(5,"Test access and report issues if any."),
     step(6,"Regular periodic monitoring and maintenance is conducted on an ongoing basis.")],
    "None","Free","~3 hours (initial access); ongoing monitoring",
    "Request access to the LGU network or SMILE KONEK Wi-Fi"
))

services.append(svc(
    "7.5","National Agencies Coordination on ICT Projects",
    MISS,"Simple/Complex","G2G","Taytayeños and Taytay LGU offices",
    [req("Letter sent through mail, fax, or delivered to the MISS office","MISS")],
    [step(1,"Submit or receive letter to/from national agencies for collaboration on an ICT project."),
     step(2,"Coordinate with the project via call or email."),
     step(3,"Meet in person or online for project discussion."),
     step(4,"Execute the project in coordination with national agencies and concerned departments.")],
    "None","Free","Varies depending on project schedules",
    "Coordinate with national agencies on ICT programs"
))

# ═══════════════════════════════════════════════════════════════════════════
# 8. MUNICIPAL ENVIRONMENT AND NATURAL RESOURCES OFFICE
# ═══════════════════════════════════════════════════════════════════════════
services.append(svc(
    "8.1","Application for Environmental Permit to Operate (Business Permit Requirement)",
    MENRO,"Simple","G2G","All government agencies, LGUs, GOCCs, and other government instrumentalities",
    [req("Certificate of Non-Coverage (CNC)","DENR / LLDA"),
     req("Environmental Compliance Certificate (ECC)","DENR"),
     req("LLDA Clearance","Laguna Lake Development Authority"),
     req("Discharge Permit","DENR"),
     req("Permit to Operate (PTO)","DENR"),
     req("Pollution Control Officer (PCO) accreditation","DENR"),
     req("Sewage Treatment Plant (STP) documents","Applicant to provide"),
     req("Waste Water Treatment Facility (WWTF) documents","Applicant to provide"),
     req("Other anti-pollution device documentation","Applicant to provide")],
    [step(1,"Submit all required documents to the MENRO for review."),
     step(2,"Completion of requirements; MENRO creates the Environmental Permit to Operate."),
     step(3,"Proceed to the Treasury Office to pay Php 130.00.")],
    "130.00","Php 130.00 Environmental Permit to Operate fee","~20 minutes",
    "Get an environmental clearance for your business"
))

services.append(svc(
    "8.2","Application for Tree Cutting Permit",
    MENRO,"Simple","G2G","All government agencies, LGUs, GOCCs, and other government instrumentalities",
    [req("Request Letter addressed to the Municipal Mayor (Hon. Allan Martine S. De Leon, MPA)","Requesting party"),
     req("Land Title / Tax Declaration","Owner to provide"),
     req("Barangay No Objection Certification for Tree Cutting/Trimming","Barangay Hall"),
     req("Home Owner's Association No Objection Certification (if inside a village/subdivision)","HOA"),
     req("Picture of the tree","Requesting party")],
    [step(1,"Submit all required documents to MENRO for review (~10 minutes)."),
     step(2,"MENRO conducts site inspection (~1 day)."),
     step(3,"Complete requirements; MENRO creates the Endorsement Letter and No Objection Certification (~5 minutes)."),
     step(4,"Proceed to Treasury Office to pay (Php 130 certification + Php 300 per tree)."),
     step(5,"Proceed to MENRO to receive the Endorsement Letter and No Objection Certificate for submission to PENRO.")],
    "430.00","Php 130.00 (certification) + Php 300.00 per tree","1 day 30 minutes",
    "Get a permit to cut a tree on your property"
))

# ═══════════════════════════════════════════════════════════════════════════
# 9. PUBLIC EMPLOYMENT SERVICE OFFICE
# ═══════════════════════════════════════════════════════════════════════════
PESO_REQS = [
    req("Request letter","PESO Manager"),
    req("DOLE Certificate (No pending Case – DOLE Rizal)","PESO Assistant"),
    req("Company Profile","Company"),
    req("Job Vacancies with qualifications","Company"),
    req("SEC Permit","Securities and Exchange Commission"),
    req("DTI Permit","Department of Trade and Industry"),
    req("Business Permit","BPLO"),
    req("Mayor's Permit","Mayor's Office"),
    req("BIR 2303 Phil-jobnet","Bureau of Internal Revenue"),
]

services.append(svc(
    "9.1","Daily Employment Facilitation",
    PESO,"Simple","G2G/G2C","Job seekers, employers, students, OSY, OFW",
    PESO_REQS,
    [step(1,"PESO evaluates applicant's resume."),
     step(2,"PESO staff interviews the applicants."),
     step(3,"Applicants fill up NMRS Form."),
     step(4,"PESO checks the NMRS Form."),
     step(5,"PESO issues/releases Recommendation Letter."),
     step(6,"Recommendation Letter is endorsed to applicants.")],
    "None","Free","24 minutes","Find a job or get a job referral from PESO"
))

services.append(svc(
    "9.2","Skills Registration System",
    PESO,"Simple","G2G/G2C","Job seekers, employers, students, OSY, OFW",
    PESO_REQS,
    [step(1,"Applicant gathers and fills out NMRS Form."),
     step(2,"PESO staff encodes the NMRS through SRS online/offline system."),
     step(3,"PESO generates the monthly report.")],
    "None","Free","45 minutes","Register your skills with the government employment system"
))

services.append(svc(
    "9.3","Local Recruitment Activity and Special Recruitment Activity (LRA/SRA)",
    PESO,"Simple","G2G/G2C","Job seekers, employers, students, OSY, OFW",
    PESO_REQS,
    [step(1,"Request letter submitted by the private company through PESO Manager."),
     step(2,"PESO Manager approves the date of activity."),
     step(3,"Activity is conducted after completion of requirements (~2 hours)."),
     step(4,"Job vacancies are posted and uploaded on social media and barangay boards (~20 minutes)."),
     step(5,"Conducting of LRA/SRA: orientation, screening, and actual interview by company.")],
    "None","Free","2 hours 48 minutes","Attend or join a local job recruitment activity"
))

services.append(svc(
    "9.4","OB Fair Activity",
    PESO,"Simple","G2G/G2C","Job seekers, employers, students, OSY, OFW",
    PESO_REQS,
    [step(1,"Complete company requirements and receive approval."),
     step(2,"Company invitation and confirmation."),
     step(3,"Post and upload company job vacancies."),
     step(4,"Conduct the Job Fair."),
     step(5,"Fill up NMRS Form from the applicant."),
     step(6,"Applicant evaluation and interview by the company."),
     step(7,"Company submits summary report to PESO Manager.")],
    "None","Free","55 minutes","Participate in a job fair organized by PESO"
))

services.append(svc(
    "9.5","Special Program for Employment of Students (SPES)",
    PESO,"Simple","G2G/G2C","Students and out-of-school youth",
    PESO_REQS,
    [step(1,"Initial interview by PESO Manager."),
     step(2,"Final interview by DOLE.")],
    "None","Free","10 minutes","Apply for the DOLE Special Program for Employment of Students"
))

services.append(svc(
    "9.6","Career and Employment Advocacy (CEA) – Labor Education for Graduating Students (LEGS)",
    PESO,"Simple","G2G/G2C","Graduating students from national high schools and colleges",
    PESO_REQS,
    [step(1,"PESO coordinates with all national high schools and colleges."),
     step(2,"Advocacy sessions are conducted with representatives from PESO, DOLE, and provincial PESO.")],
    "None","Free","4 hours","Attend a career guidance and employment advocacy program"
))

services.append(svc(
    "9.7","Livelihood Activity",
    PESO,"Simple","G2G/G2C","Organized groups and associations",
    PESO_REQS,
    [step(1,"Submit request letter of an organization."),
     step(2,"Interview the officers of the organization."),
     step(3,"Review and revise the livelihood proposal."),
     step(4,"Email the proposal to DOLE for implementation/monitoring.")],
    "None","Free","35 minutes (initial processing)","Request a livelihood training or program for your organization"
))

services.append(svc(
    "9.8","OFW Help Desk",
    PESO,"Simple","G2G/G2C","OFWs and their families",
    PESO_REQS,
    [step(1,"Interview relative of OFW."),
     step(2,"Photocopy all papers of OFW."),
     step(3,"Make a written request for absent OFW repatriation."),
     step(4,"Email to OWWA the written request."),
     step(5,"Follow up with OWWA after 2 days.")],
    "None","Free","~30 minutes","Get assistance for an OFW's repatriation or concerns"
))

# ═══════════════════════════════════════════════════════════════════════════
# 10. TAYTAY SPORTS DEVELOPMENT OFFICE
# ═══════════════════════════════════════════════════════════════════════════
for n, svc_name, plain in [
    ("10.1","Provision of Sports Supplies, Medals and Trophies","Request sports equipment, medals, or trophies"),
    ("10.2","Provision of Vehicle Service for Athletes and Sports Clubs","Request vehicle service for athletes or sports clubs"),
    ("10.3","Provision of Medical Certificate for Athletes","Request a medical certificate for athletes"),
    ("10.4","Request for Facilities and Sound System for Sports Events","Request sports facilities and sound system"),
]:
    services.append(svc(
        n, svc_name, TSDO,"Simple","G2C","All citizens (public)",
        [],
        [step(1,"Submit Letter Request via email and/or hard copy to TSDO."),
         step(2,"TSDO receives and records the request, attaches route slip, and forwards to the appropriate office/department.")],
        "None","Free","2 minutes (initial processing)", plain
    ))

# ═══════════════════════════════════════════════════════════════════════════
# 11. TOURISM OFFICE
# ═══════════════════════════════════════════════════════════════════════════
services.append(svc(
    "11.1","Clearance for Tourism Related-Businesses",
    TOUR,"Complex","G2B",
    "Owners/Operators of tourism establishments and tour guides (primary tourism enterprises)",
    [req("For New Applicant: Business Permit Application Form","BPLO"),
     req("For New Applicant: DTI/SEC Registration","DTI / SEC"),
     req("For New Applicant: Barangay Clearance","Barangay Hall"),
     req("For New Applicant: Tax bill and Official Receipt for the Current Year","Treasury Office"),
     req("For New Applicant: DOT Accreditation or Proof of on-going application","Department of Tourism"),
     req("For Tour Guide: NBI or Police Clearance","NBI / Police District Office"),
     req("For Tour Guide: Certificate of Tour Guiding Seminar or DOT Accreditation","DOT"),
     req("For Tour Guide: Official Receipt for the Current Year","Treasury Office"),
     req("For Renewal of Business Permit: Copy of Business Permit Application","Applicant to provide"),
     req("For Renewal of Business Permit: DOT Accreditation or Proof of on-going application","DOT"),
     req("For Renewal of Business Permit: Data on tourist arrivals (same-day and overnight stays)","Applicant to provide"),
     req("For Renewal of Tour Guide: NBI or Police Clearance","NBI / Police District Office"),
     req("For Renewal of Tour Guide: Official Receipt for the Current Year","Treasury Office"),
     req("For Renewal of Tour Guide: Certificate of Tour Guiding Seminar or DOT Accreditation","DOT")],
    [step(1,"Fill up the Tourism Application Form and submit with complete requirements."),
     step(2,"Wait for processing and release of Tourism Compliance Clearance (~10 minutes for processing, ~5 minutes for signing)."),
     step(3,"Claim the Tourism Compliance Clearance.")],
    "None","Free (as per Municipal Ordinance No. 804 S. 2024)","~30 minutes",
    "Get a tourism compliance clearance for your business",
    supporting={"note":"Processing time starts upon acceptance of application with complete requirements. Legal Mandate: Municipal Ordinance No. 804 series of 2024, Section 11."}
))

services.append(svc(
    "11.2","Implementation of Tourism Programs, Activities and Projects",
    TOUR,"Complex","G2C/G2B/G2G",
    "Government agencies/organizations, NGOs, civic organizations, and general public",
    [req("Communication/Letter from concerned party (1 original copy or e-copy)","Written by concerned party / requesting party")],
    [step(1,"Forward/email the communication or letter to the tourism receiving desk or email: tourism@taytayrizal.gov.ph / tourismofficetaytayrizal@gmail.com"),
     step(2,"Leave the office; wait for action on the request."),
     step(3,"Chief Tourism Officer refers the matter and acts on recommendations (~1 day initial, ~5 days total review)."),
     step(4,"Attend coordination meetings or queries."),
     step(5,"Participate in preparation of event/activity/project (~60 days)."),
     step(6,"Participate/implement the event (~2 days)."),
     step(7,"Post-event tasks completed (~1 day).")],
    "None","Free","~70 days 2 minutes total (depends on type and magnitude of program)",
    "Coordinate or participate in tourism programs and activities",
    supporting={"note":"Qualified for multi-stage processing. Total days dependent on date, type, and magnitude of program/activity/project."}
))

# ═══════════════════════════════════════════════════════════════════════════
# 12. TREASURY OFFICE
# ═══════════════════════════════════════════════════════════════════════════
services.append(svc(
    "12.1","Payment of Occupation Permit and Garbage Fee",
    TRES,"Simple","G2C/G2B","All job seekers and taxpayers",
    [req("Occupational Form","Window 1"),
     req("CEDULA","Treasury Office"),
     req("RPT Official Receipt (House/Building) for garbage fee","Treasury Office"),
     req("Tax Order of Payment","Concerned office"),
     req("Traffic Violation Receipt (if applicable)","Issuing authority")],
    [step(1,"Proceed to Window 1."),
     step(2,"Present requirements."),
     step(3,"Pay fees.")],
    "Varies","Occupational Permit: Php 100 (Local) / Php 200 (Abroad); Garbage Fee: Php 100; Police Clearance: per violation; UPAO Certificate: Php 50",
    "3–5 minutes","Pay your occupation permit and garbage fee"
))

services.append(svc(
    "12.2","Assessment and Payment of Real Property Tax",
    TRES,"Simple","G2C/G2B","All real property taxpayers",
    [req("Latest Tax Declaration","Owner / Treasury Office"),
     req("Latest Payment Official Receipts","Owner to provide")],
    [step(1,"Proceed to Windows 2–5."),
     step(2,"Submit requirements."),
     step(3,"Pay Real Property Tax.")],
    "Varies","Basic: 1% of assessed value; SEF: 1% of assessed value; 20% discount for advance payment before January 2; 10% discount for prompt payment; 2% interest per month for late payment",
    "2–25 minutes (depending on complexity)","Pay your real property tax",
    supporting={"note":"Advanced payment (before Jan 2) = 20% discount; Prompt payment (before deadline) = 10% discount; Penalty = 2% interest per month for unpaid years."}
))

services.append(svc(
    "12.3","Securing Tax Clearances",
    TRES,"Simple","G2C/G2B","All real property taxpayers",
    [req("Latest tax declaration","Owner to provide"),
     req("Official Receipts for current paid taxes","Owner to provide")],
    [step(1,"Proceed to Windows 2–5."),
     step(2,"Preparation and payment of tax clearance."),
     step(3,"For review and signature; pay at Windows 8–9.")],
    "115.00","Php 115.00 (Tax clearance certificate + Documentary Stamps)","~7 minutes",
    "Get a tax clearance certificate"
))

services.append(svc(
    "12.4","Securing Certification and Other Correspondences (Treasury)",
    TRES,"Simple","G2C/G2B","All real property taxpayers",
    [req("Latest tax declaration","Owner to provide"),
     req("Official Receipts for current paid taxes","Owner to provide")],
    [step(1,"Proceed to Windows 2–5."),
     step(2,"Write draft, encode, check, and sign."),
     step(3,"Pay at Windows 8–9.")],
    "115.00","Php 115.00 (Certification + Documentary Stamps)","~8 minutes",
    "Get a certification or correspondence from the Treasury Office"
))

services.append(svc(
    "12.5","Securing Certified Photocopy of Tax Declaration 1945–1974, Official Receipts and Other Documents",
    TRES,"Simple","G2C/G2B","All real property taxpayers",
    [req("Tax Declaration","Owner to provide"),
     req("Official Receipts","Owner to provide"),
     req("Name of registered owner","Client to provide")],
    [step(1,"Proceed to Window 2–5."),
     step(2,"For review, verification, and approval."),
     step(3,"Pay at Window 8–9.")],
    "115.00","Php 115.00 (Certified Xerox copy + Documentary Stamps)","2–5 minutes",
    "Get a certified copy of old tax declarations or official receipts"
))

services.append(svc(
    "12.6","Payment of Bidding Documents, Accreditation Fees, and Cash Performance Bond",
    TRES,"Simple","G2C/G2B","All bidders",
    [req("Order of Payment from BAC Secretariat","Bids and Awards Committee Secretariat")],
    [step(1,"Proceed to Window 5."),
     step(2,"Submit Order of Payment from BAC Secretariat and pay.")],
    "Varies","As per BAC's Order of Payment","3–5 minutes",
    "Pay for bidding documents or accreditation fees"
))

services.append(svc(
    "12.7","Payment of Liquidation for Cash Advances",
    TRES,"Simple","G2G","All disbursing officers",
    [req("Nature of cash advances","Disbursing Officer to provide"),
     req("Voucher (General Fund, SEF, or Trust Fund)","Disbursing Officer to provide"),
     req("Name of official/employee","Disbursing Officer to provide")],
    [step(1,"Proceed to Window 5."),
     step(2,"Submit requirements and pay.")],
    "Varies","As per liquidating officer","3–5 minutes",
    "Process liquidation of cash advances"
))

services.append(svc(
    "12.8","Business Taxes, Licenses, and Other Fees and Charges",
    TRES,"Simple","G2C/G2B","All business taxpayers and concerned citizens",
    [req("Approved Tax Order of Payment from BPLO","Business Permit and Licensing Office"),
     req("Community Tax Certificate","Treasury Office"),
     req("Traffic Violation Receipt (for traffic violators)","Issuing authority"),
     req("Barangay Clearance","Barangay Hall")],
    [step(1,"Proceed to BOSS (4th floor) for payment of Business Tax."),
     step(2,"Proceed to Windows 8–9 for other fees and charges."),
     step(3,"Online payment available for Business Permit.")],
    "Varies","As per BPLO Tax Order of Payment and applicable fee schedule",
    "3–25 minutes (depending on complexity)","Pay your business taxes and licenses"
))

services.append(svc(
    "12.9","Community Tax Certificate (Cedula) – Individual and Corporation",
    TRES,"Simple","G2C/G2B/G2G","All taxpayers",
    [req("Personal Information: Name, Address, Occupation, Birthday, Birthplace, TIN, Height, Weight, Status, Gross Income","Individual to provide"),
     req("Name of Company/Business Establishment (for corporation)","Corporation to provide")],
    [step(1,"Proceed to Windows 6 or 7."),
     step(2,"Submit personal information.")],
    "Varies","Individual: Php 5.00 basic + Php 1.00 per Php 1,000 of income/receipts (max Php 5,000); Corporation: Php 500.00 basic + Php 2.00 per Php 5,000 of assets/income (max Php 10,000); Payment without penalty: January 2–February 28; with penalty: March 1–December 31 (2% interest per month)",
    "3–5 minutes","Get your Community Tax Certificate (Cedula)"
))

services.append(svc(
    "12.10","Salaries, Wages, Financial Assistances, Honoraria, and Related Payments",
    TRES,"Simple","G2C/G2G","All concerned employees and persons",
    [req("Approved Daily Time Record and Accomplishment Report (for salaries and wages)","Human Resource office"),
     req("Approved Petty Cash Voucher from MSWD (for PCSO Financial Assistance)","Municipal Social Welfare and Development Office"),
     req("Valid ID","Employee/person to provide"),
     req("Authorization letter and valid IDs of both authorizing person and representative (if representative)","Employee to provide")],
    [step(1,"Proceed to Window 10."),
     step(2,"Submit requirements.")],
    "Varies","As per payroll amount or Petty Cash Voucher","2–3 minutes per transaction",
    "Receive your salary, wage, or financial assistance"
))

services.append(svc(
    "12.11","Check Payments and Disbursement",
    TRES,"Simple","G2C/G2B/G2G","All concerned persons",
    [req("Valid ID","Person to provide"),
     req("Authorization letter and valid IDs (if representative)","Person to provide"),
     req("Official receipt","Person to provide")],
    [step(1,"Proceed to Window 11."),
     step(2,"Submit requirements and receive check payment.")],
    "Varies","As per Disbursement Voucher","3–5 minutes (single transaction)",
    "Receive a government check payment"
))

services.append(svc(
    "12.12","Hospital and Medical Fees",
    TRES,"Simple","G2C/G2B/G2G","All concerned patients",
    [req("Patient's card with breakdown of different fees","Cashier/Billing Section"),
     req("Doctor's request","Doctor/Physician")],
    [step(1,"Proceed to Cashier's Office at June V. Zapanta Emergency Hospital."),
     step(2,"Submit requirements and pay hospital or medical fees.")],
    "Varies","As per patient's bill and doctor's request","3–5 minutes",
    "Pay your hospital or medical fees at the Taytay Emergency Hospital"
))

services.append(svc(
    "12.13","Market Stall Fees, Rental of Light and Water",
    TRES,"Simple","G2C/G2B","All market stall owners/vendors and delivery truck operators",
    [req("Latest official receipts","Market stall owner to provide"),
     req("Name of market stall holders","Market stall owner to provide")],
    [step(1,"Proceed to Collector's Office – New Taytay Public Market."),
     step(2,"Ask for order of payment or submit letter of intent for product promotions."),
     step(3,"Pay market stall fees, electricity and water consumption, or delivery truck fees.")],
    "Varies","Market Stall Fees: based on stall size; Electricity and water: based on MERALCO/MWSS rates; Delivery Trucks (single tired): minimum Php 100; Van: minimum Php 50–60",
    "1–3 minutes per transaction","Pay your market stall rent and utilities"
))

# ═══════════════════════════════════════════════════════════════════════════
# 13. URBAN POOR AFFAIRS OFFICE
# ═══════════════════════════════════════════════════════════════════════════
services.append(svc(
    "13.1","Issuance of UPAO Certificate for Residents on Government-Owned Land",
    UPAO,"Simple","G2C","Occupants in government-owned lots",
    [req("Yellow Card (Meralco) / Application Form (Manila Water)","Meralco / Manila Water"),
     req("Cedula","Treasury Office"),
     req("Barangay Clearance","Barangay Hall"),
     req("Photocopy of 3 valid IDs with signature","Government agency"),
     req("HOA Certification","Home Owner's Association")],
    [step(1,"Submit a copy of picture of your front house for compliance inspection."),
     step(2,"C.I. team visits the house for compliance inspection (Tuesday–Friday)."),
     step(3,"Provide all required documents for review."),
     step(4,"Proceed to Treasury Office to pay Php 115.00."),
     step(5,"Sign the affidavit of undertaking and have it notarized (Php 150–200)."),
     step(6,"Receive UPAO Certificate (released on Wednesdays and Fridays).")],
    "115.00","Php 115.00 (UPAO) + Php 150–200 (Notary for affidavit of undertaking)",
    "1–3 working days","Get a UPAO certificate for Meralco or Manila Water connection"
))

services.append(svc(
    "13.2","Issuance of UPAO Certification for HOA Purposes",
    UPAO,"Simple","G2C","Home Owners Associations",
    [req("Letter of Request","HOA to prepare"),
     req("HOA Profile submitted to UPAO","HOA to provide"),
     req("DHSUD Registration/SEC Registration (Optional)","DHSUD / SEC"),
     req("List of Officers","HOA to provide"),
     req("List of Members","HOA to provide"),
     req("By Laws and Resolution of HOA","HOA to provide")],
    [step(1,"Submit letter of request and required documents."),
     step(2,"UPAO verifies if the HOA has an existing profile."),
     step(3,"Ocular inspection of the area to clarify legitimacy of the HOA."),
     step(4,"Proceed to Treasury Office to pay Php 115.00."),
     step(5,"Receive printed and signed UPAO Certification.")],
    "115.00","Php 115.00","1–2 working days","Get a UPAO certification certifying your HOA's legitimacy"
))

# ═══════════════════════════════════════════════════════════════════════════
# 14. BUSINESS PERMIT AND LICENSING OFFICE
# ═══════════════════════════════════════════════════════════════════════════
services.append(svc(
    "14.1","Issuance of New Business or Mayor's Permit (Face-to-Face)",
    BPLO,"Simple","G2B","New businesses operating in Taytay, Rizal",
    [req("Business Permit Application Form","BPLO"),
     req("DTI Registration (for sole proprietorship)","Department of Trade and Industry"),
     req("SEC Registration (for corporation/partnership)","Securities and Exchange Commission"),
     req("Barangay Clearance","Barangay Hall"),
     req("Tax Order of Payment","BPLO / Treasury Office"),
     req("Other applicable documentary requirements (LLDA, MENRO, BFP, etc.)","Various agencies")],
    [step(1,"Submit application with complete requirements at the BPLO."),
     step(2,"Pay computed taxes and fees at the Treasury Office."),
     step(3,"Printing, scanning, and releasing of permit.")],
    "Varies","Based on applicable tax schedule and fees","See document for details",
    "Get a new business or mayor's permit"
))

services.append(svc(
    "14.2","Issuance of Business or Mayor's Permit (Renewal – Face-to-Face)",
    BPLO,"Simple","G2B","Business owners renewing existing permits",
    [req("Photocopy of Previous Year Mayor's Permit/License","Business Owner"),
     req("Photocopy of Official Receipt of Previous Year","Business Owner"),
     req("Basis for computing taxes (ITR/Quarterly/Monthly statements)","Bureau of Internal Revenue"),
     req("Duly Accomplished Business Permit Application Form","BPLO"),
     req("Photocopy of Latest Lease Contract (if renting)","Business Owner"),
     req("Photocopy of Mayor's Permit of Lessor (prior year) if renting","Business Owner"),
     req("List of employees and address","Business Owner"),
     req("Other clearances/permits as applicable","Various agencies")],
    [step(1,"Submit requirements."),
     step(2,"Pay computed tax and fees."),
     step(3,"Printing, scanning, and releasing of permit.")],
    "Varies","Based on applicable tax schedule and fees","See document for details",
    "Renew your business or mayor's permit"
))

services.append(svc(
    "14.3","Issuance of New Business or Mayor's Permit (Online)",
    BPLO,"Simple","G2B","New businesses applying online in Taytay, Rizal",
    [req("Business Permit Application Form (online)","BPLO online portal"),
     req("DTI/SEC Registration","DTI / SEC"),
     req("Barangay Clearance","Barangay Hall"),
     req("Other applicable online documentary requirements","Various agencies")],
    [step(1,"Submit online application with complete requirements."),
     step(2,"Pay online."),
     step(3,"Receive Business/Mayor's Permit digitally or via courier.")],
    "Varies","Based on applicable tax schedule and fees","See document for details",
    "Apply for a new business permit online"
))

services.append(svc(
    "14.4","Renewal of Business or Mayor's Permit (Online)",
    BPLO,"Simple","G2B","Businesses renewing permits online",
    [req("Copy of previous Business Permit","Business Owner"),
     req("Barangay Clearance","Barangay Hall"),
     req("Tax Order of Payment","BPLO / Treasury Office"),
     req("Other applicable online documentary requirements","Various agencies")],
    [step(1,"Submit online renewal application with complete requirements."),
     step(2,"Pay online."),
     step(3,"Receive renewed Business/Mayor's Permit digitally or via courier.")],
    "Varies","Based on applicable tax schedule and fees","See document for details",
    "Renew your business permit online"
))

# ── OUTPUT ────────────────────────────────────────────────────────────────────
output = {
    "meta": {
        "title": "Citizens Charter – Municipal Government of Taytay, Rizal",
        "edition": "2025 1st Edition",
        "source_document": "citizens-charter.pdf",
        "creation_date": UPDATED,
        "total_services": len(services)
    },
    "services": services
}

with open("src/data/citizens-charter/generated_citizens-charter.json", "w", encoding="utf-8") as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print(f"generated_citizens-charter.json written: {len(services)} services")

# quick schema validation
for s in services:
    assert "service_number" in s, f"Missing service_number: {s}"
    assert "service_name" in s
    assert "office_division" in s
    assert "requirements" in s and isinstance(s["requirements"], list)
    assert "client_steps" in s and isinstance(s["client_steps"], list)
    assert "fees" in s and "amount" in s["fees"] and "description" in s["fees"]
    assert "processing_time" in s
    assert "plain_language_name" in s
print("Schema validation passed.")
