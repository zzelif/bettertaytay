import json
from datetime import datetime

UPDATED_AT = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def slug(text):
    import re
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', text.lower())).strip('-')

# Categories
categories = {
    "categories": [
        {"name": "Animal Services", "slug": "animal-services", "description": "Registration, vaccination, control, adoption, and health services for animals."},
        {"name": "Agriculture & Fisheries", "slug": "agriculture-fisheries", "description": "Crop, livestock, fishery programs, seeds, training, and consultations."},
        {"name": "Property Assessment", "slug": "property-assessment", "description": "Appraisal, assessment, transfer, and certification of real property tax declarations."},
        {"name": "Civil Registry", "slug": "civil-registry", "description": "Registration and certified copies of birth, marriage, and death certificates, and civil registry corrections."},
        {"name": "Employment & Livelihood", "slug": "employment-livelihood", "description": "Job facilitation, skills registration, recruitment activities, and livelihood programs."},
        {"name": "Business Permits & Licensing", "slug": "business-permits-licensing", "description": "Issuance and renewal of business permits, mayor's permits, and environmental clearances."},
        {"name": "Legal Services", "slug": "legal-services", "description": "Review of contracts, MOAs, legal opinions, executive orders, and ordinances."},
        {"name": "Environmental Services", "slug": "environmental-services", "description": "Environmental compliance, tree cutting permits, and natural resource management."},
        {"name": "Information Technology", "slug": "information-technology", "description": "Technical assistance, system maintenance, network monitoring, and ICT coordination."},
        {"name": "Sports & Recreation", "slug": "sports-recreation", "description": "Provision of sports supplies, vehicles, medical certificates, and facilities for sports events."},
        {"name": "Tourism", "slug": "tourism", "description": "Clearances for tourism businesses and implementation of tourism programs and projects."},
        {"name": "Treasury & Finance", "slug": "treasury-finance", "description": "Payment of taxes, fees, clearances, disbursements, and other financial transactions."},
        {"name": "Housing & Urban Poor", "slug": "housing-urban-poor", "description": "Certificates and certifications for residents and businesses on government-owned land."},
        {"name": "General Government Services", "slug": "general-government-services", "description": "Facilities management, property management, security, waste management, and supply services."},
        {"name": "Gender & Development", "slug": "gender-development", "description": "Gender equality programs, trainings, events, and anti-sexual harassment services."},
    ]
}

# Services
services = []

def add(name, office_slugs, cat_slug, cat_name, description, steps=None, requirements=None, quickInfo=None, faqs=None, related=None, sources=None, svc_type="transaction"):
    s = {
        "service": name,
        "slug": slug(name),
        "type": svc_type,
        "description": description,
        "url": None,
        "officeSlug": office_slugs,
        "category": {"name": cat_name, "slug": cat_slug},
        "steps": steps or [],
        "requirements": requirements or [],
        "faqs": faqs or [],
        "relatedServices": related or [],
        "quickInfo": quickInfo,
        "updatedAt": UPDATED_AT,
        "sources": sources or [{"name": "Citizens Charter – Municipal Government of Taytay, Rizal (2025 1st Edition)", "url": None}],
    }
    services.append(s)
    
# ── AGRICULTURE OFFICE ───────────────────────────────────────────────────────
AGR = "agriculture-office"
AGR_SRC = [{"name": "Citizens Charter – Municipal Government of Taytay, Rizal (2025 1st Edition)", "url": None}]

add("Dog and Cat Registration and Anti-Rabies Vaccination", [AGR],
    "animal-services", "Animal Services",
    "Registration of pet dogs and cats and administration of anti-rabies vaccine at the Office of Agricultural Services.",
    steps=["Visit the Office and request for ARV and pet registration.",
           "Present and handle the cat/dog to be vaccinated.",
           "Claim the Certificate of Vaccination."],
    requirements=["Dog or cat must be 3 months old and above, and healthy.",
                  "No history of medication or animal bite/scratch incident for the past 2 weeks."],
    quickInfo={"processingTime": "9 minutes", "fee": "None", "whoCanApply": "General Public"},
    sources=AGR_SRC)

add("Animal Control", [AGR],
    "animal-services", "Animal Services",
    "Conduct of animal control operations for stray cats and dogs upon request.",
    steps=["Submit a request letter to the Office of the Municipal Mayor.",
           "Present the request letter received by the Office of the Municipal Mayor.",
           "Assist the animal control team during the operation."],
    requirements=["For private subdivision or within a private property, a request letter is required."],
    quickInfo={"processingTime": "1 hour", "fee": "None", "whoCanApply": "General Public"},
    sources=AGR_SRC)

add("Mass Anti-Rabies Vaccination for Cats and Dogs", [AGR],
    "animal-services", "Animal Services",
    "Mass anti-rabies vaccination and pet registration conducted at a covered venue upon request.",
    steps=["Submit the request letter to the Office of the Municipal Mayor.",
           "Provide a covered venue and assist the Vaccination team during the activity."],
    requirements=["Request letter addressed to the Municipal Mayor."],
    quickInfo={"processingTime": "2–3 hours", "fee": "None", "whoCanApply": "General Public"},
    sources=AGR_SRC)

add("Issuance of Veterinary Health Certificate for Travel Purpose of Cats and Dogs", [AGR],
    "animal-services", "Animal Services",
    "Issuance of a Veterinary Health Certificate required for traveling with cats or dogs.",
    steps=["Bring your pet and vaccination record.",
           "Request for Veterinary Health Certificate for Travel Purpose.",
           "Present the pet for physical assessment.",
           "Proceed to the Treasury Office to pay the certification fee.",
           "Present the Official Receipt to the Agriculture Office."],
    requirements=["Cat or dog must be vaccinated 14 days prior to departure (anti-rabies, not expired).",
                  "Cat or dog must be healthy and at least 18 months old.",
                  "Vaccination Record.",
                  "Official Receipt of Payment (from Treasury Office)."],
    quickInfo={"processingTime": "12 minutes", "fee": "Php 130.00", "whoCanApply": "General Public",
               "validity": "Per departure"},
    sources=AGR_SRC)

add("Gulayan sa Paaralan or Community Garden", [AGR],
    "agriculture-fisheries", "Agriculture & Fisheries",
    "Technical assistance and support for school or community vegetable gardens.",
    steps=["Submit a request letter to the Office of the Municipal Mayor.",
           "Assist the technician during the visitation.",
           "Participate actively in the scheduled seminar/training."],
    requirements=["Request letter addressed to the Municipal Mayor."],
    quickInfo={"processingTime": "1+ hour", "fee": "None", "whoCanApply": "Schools and communities"},
    sources=AGR_SRC)

add("Redemption of Impounded Animals", [AGR],
    "animal-services", "Animal Services",
    "Process for reclaiming an animal that has been impounded by the municipal government.",
    steps=["Request to redeem the impounded animal, provide proof of ownership and government-issued ID.",
           "Fill up the Release, Waiver and Quitclaim Form.",
           "Pay the penalty fee at the Treasury Office.",
           "Present the Official Receipt to the Agriculture Office."],
    requirements=["Government-Issued Identification Card.",
                  "Official Receipt of Payment.",
                  "Release, Waiver and Quitclaim Form."],
    quickInfo={"processingTime": "~15 minutes", "fee": "Php 500.00 penalty fee", "whoCanApply": "Animal owners"},
    sources=AGR_SRC)

add("Adoption of Impounded Animal", [AGR],
    "animal-services", "Animal Services",
    "Process for adopting an impounded animal from the municipal impounding facility.",
    steps=["Request for adoption of impounded animal.",
           "Present government-issued identification.",
           "For shelter/groups, provide shelter permit.",
           "Fill up the Release, Waiver and Quitclaim Form.",
           "Bring the animal cage to the impounding facility."],
    requirements=["Government-Issued Identification.",
                  "For shelter/groups: shelter permit from Department of Agriculture–Bureau of Animal Industry.",
                  "Animal Cage.",
                  "Release, Waiver and Quitclaim Form."],
    quickInfo={"processingTime": "~15 minutes", "fee": "None", "whoCanApply": "General public and animal shelters"},
    sources=AGR_SRC)

add("Surrendering of Cats and Dogs with Owners", [AGR],
    "animal-services", "Animal Services",
    "Formal process for pet owners who wish to surrender their cats or dogs to the municipal government.",
    steps=["Request for Animal Surrender.",
           "Present Government-Issued Identification.",
           "Fill up the Animal Surrender, Euthanasia Consent, Declaration and Waiver Liability forms and Certificate of Abandonment.",
           "Pay the Surrender fee to the Treasury Office.",
           "Present the Official Receipt.",
           "Bring the animal to the impounding facility."],
    requirements=["Government-Issued Identification.",
                  "Animal Surrender Form.",
                  "Euthanasia Consent Form.",
                  "Declaration of Waiver and Liability Form.",
                  "Certificate of Abandonment.",
                  "Official Receipt of Payment."],
    quickInfo={"processingTime": "~20 minutes", "fee": "Php 500.00 per head", "whoCanApply": "Pet owners"},
    sources=AGR_SRC)

add("Animal Health Services for Small Animals (Cats and Dogs)", [AGR],
    "animal-services", "Animal Services",
    "Veterinary check-up, medication administration, and prescription services for cats and dogs.",
    steps=["Make a same-day appointment via call, social media, or personal visit.",
           "Bring their pet on the given schedule."],
    requirements=[],
    quickInfo={"processingTime": "10–15 minutes", "fee": "None", "whoCanApply": "Pet owners",
               "appointmentType": "Same-day appointment"},
    sources=AGR_SRC)

add("Issuance of Veterinary Health Certificate for Travel Purpose of Poultry", [AGR],
    "animal-services", "Animal Services",
    "Issuance of a Veterinary Health Certificate for poultry intended for travel.",
    steps=["Request for a Veterinary Health Certificate for Poultry.",
           "Bring the birds with leg/wing bands, Newcastle Disease Vaccine, and Styrofoam box with ice on the scheduled date.",
           "Submit the collected blood and swab sample to the Bureau of Animal Industry in Quezon City.",
           "Once the result is released, submit the Certificate of Free Status Avian Influenza Type A Subtypes H5 & H7 to the Agriculture Office.",
           "Pay the Certification fee at the Treasury Office.",
           "Present the OR to Agriculture Office."],
    requirements=["Certificate of Free Status Avian Influenza Type A Subtypes H5 & H7 (from Bureau of Animal Industry).",
                  "Styrofoam box with ice.",
                  "Newcastle Disease Vaccine.",
                  "Leg band / wing band.",
                  "At least 2 weeks prior to travel date."],
    quickInfo={"processingTime": "~2 weeks", "fee": "Php 130.00", "whoCanApply": "Poultry owners"},
    sources=AGR_SRC)

add("Animal Health Services for Livestock and Poultry", [AGR],
    "animal-services", "Animal Services",
    "Veterinary checkup, medication, vaccination, deworming, and sample collection for livestock and poultry.",
    steps=["Request for Animal Health Service.",
           "Report initial signs and observations.",
           "Assist the veterinarian or technician during the farm visitation."],
    requirements=["Certificate of Free Status Avian Influenza Type A Subtypes H5 & H7 (if applicable).",
                  "Styrofoam box with ice (if applicable).",
                  "Newcastle Disease Vaccine (if applicable).",
                  "Leg band / wing band (if applicable)."],
    quickInfo={"processingTime": "10+ minutes per animal", "fee": "None", "whoCanApply": "Livestock and poultry owners"},
    sources=AGR_SRC)

add("Distribution of Assorted Vegetable Seeds and Seedlings", [AGR],
    "agriculture-fisheries", "Agriculture & Fisheries",
    "Free distribution of vegetable seeds and seedlings to residents and registered farmers.",
    steps=["Request for assorted vegetable seeds.",
           "Provide basic information: Name, Address, and size of planting area."],
    requirements=[],
    quickInfo={"processingTime": "10 minutes", "fee": "None", "whoCanApply": "Residents and farmers"},
    sources=AGR_SRC)

add("Annual Kangkong Registration", [AGR],
    "agriculture-fisheries", "Agriculture & Fisheries",
    "Annual registration permit for kangkong (water spinach) farming areas.",
    steps=["Request for kangkong registration.",
           "Present government-issued identification.",
           "Pay the kangkong registration permit fee.",
           "Present the official receipt."],
    requirements=["Official Receipt of Payment.",
                  "Government-Issued Identification.",
                  "RSBSA Registration."],
    quickInfo={"processingTime": "~47 minutes", "fee": "Php 500.00 per hectare", "whoCanApply": "Kangkong farmers"},
    sources=AGR_SRC)

add("Registry System for Basic Sector in Agriculture", [AGR],
    "agriculture-fisheries", "Agriculture & Fisheries",
    "Registration of farmers, fisherfolk, and livestock/poultry raisers in the national RSBSA database.",
    steps=["Request for RSBSA registration.",
           "Present Government-issued identification.",
           "Assist in the farm visitation and validation."],
    requirements=["Government-Issued Identification."],
    quickInfo={"processingTime": "~45 minutes", "fee": "None",
               "whoCanApply": "Farmers, livestock/poultry raisers, fisherfolk"},
    sources=AGR_SRC)

add("Insurance for High Value Crops, Rice, Livestock and Poultry from PCIC", [AGR],
    "agriculture-fisheries", "Agriculture & Fisheries",
    "Facilitates crop and livestock insurance enrollment through the Philippine Crop Insurance Corporation (PCIC).",
    steps=["Request for PCIC Insurance.",
           "Present Government-issued identification."],
    requirements=["Government-issued identification.",
                  "RSBSA registration."],
    quickInfo={"processingTime": "~15 minutes (initial)", "fee": "None (PCIC premium applies)",
               "whoCanApply": "Registered farmers and livestock/poultry raisers"},
    sources=AGR_SRC)

add("Damage Report for High Value Crops, Rice, Livestock and Poultry during Natural Calamity", [AGR],
    "agriculture-fisheries", "Agriculture & Fisheries",
    "Filing of damage reports for agricultural losses due to natural calamities for insurance and government assistance purposes.",
    steps=["Immediately report the damage to the coordinator within 24 hours after the calamity.",
           "Provide supporting documents of the damages."],
    requirements=["Government-issued identification.",
                  "RSBSA registration."],
    quickInfo={"processingTime": "Initial report: 24 hours; Final report: 3 days after calamity",
               "fee": "None", "whoCanApply": "Registered farmers affected by calamities"},
    sources=AGR_SRC)

add("Agricultural Trainings and Seminars", [AGR],
    "agriculture-fisheries", "Agriculture & Fisheries",
    "Conduct of agricultural training and seminars on topics such as urban gardening, crop management, and livestock care.",
    steps=["Submit the request letter to the Office of the Municipal Mayor.",
           "Provide the necessary logistics if applicable.",
           "Assist the coordinator and speakers during the event."],
    requirements=["Request letter addressed to the Municipal Mayor."],
    quickInfo={"processingTime": "Depends on training/seminar", "fee": "None",
               "whoCanApply": "Farmers, schools, and communities"},
    sources=AGR_SRC)

add("Technical Consultation on Agriculture, Fisheries and Other Related Sectors", [AGR],
    "agriculture-fisheries", "Agriculture & Fisheries",
    "Free technical consultation and advisory services on agriculture, fisheries, and related topics.",
    steps=["Provide necessary information on the case to be consulted.",
           "Assist the coordinator during the visitation."],
    requirements=[],
    quickInfo={"processingTime": "~45 minutes", "fee": "None", "whoCanApply": "Farmers and general public"},
    sources=AGR_SRC)

add("Fish Registration and Boat Registration Services", [AGR],
    "agriculture-fisheries", "Agriculture & Fisheries",
    "Registration of fisherfolk and watercraft through the FishR and BoatR data-based systems.",
    steps=["Request for fish and boat registration.",
           "Assist the coordinator during the registration."],
    requirements=[],
    quickInfo={"processingTime": "~34 minutes", "fee": "None",
               "whoCanApply": "Fisherfolk and boat owners"},
    sources=AGR_SRC)

# ── ASSESSORS OFFICE ─────────────────────────────────────────────────────────
ASS = "assessors-office"
ASS_SRC = [{"name": "Citizens Charter – Municipal Government of Taytay, Rizal (2025 1st Edition)", "url": None}]

add("Application for Transfer of Ownership", [ASS],
    "property-assessment", "Property Assessment",
    "Processing of a new Tax Declaration under the name of a new owner after property transfer.",
    steps=["Present and submit required documents.",
           "Fill up Sworn Statement.",
           "Pay corresponding fee at the Treasurer's Office.",
           "Wait for processing and release of owner's copy of Tax Declaration."],
    requirements=["Certified True Copy of Title.",
                  "Deed of Absolute Sale / Deed of Donation / Extrajudicial Settlement, BIR CAR, Transfer Fee, Tax Clearance, Affidavit of Publication (for Extrajudicial Settlement), Special Power of Attorney, Secretary Certificate (if any).",
                  "Affidavit of Consolidation and Certificate of Sale (for Foreclosed Property).",
                  "Notarized Sworn Statement.",
                  "Updated Realty Tax Payment.",
                  "Filled up Sworn Statement."],
    quickInfo={"processingTime": "Approximately 3 days (depending on volume)", "fee": "Php 200.00",
               "whoCanApply": "All taxpayers"},
    sources=ASS_SRC)

add("Application for Appraisal and Assessment", [ASS],
    "property-assessment", "Property Assessment",
    "Appraisal and assessment of new buildings and other improvements for taxation purposes.",
    steps=["Present and submit requirements for appraisal and assessment.",
           "Wait for ocular inspection and preparation of Tax Declaration.",
           "Receive owner's copy of Tax Declaration and FAAS after Provincial Assessor approval."],
    requirements=["Floor Plan.", "Occupancy Permit.", "Certificate of Completion.", "Building Permit.",
                  "Picture of Improvement.", "Updated Realty Tax Payment.",
                  "Secretary Certificate (if owned by Corp.).", "Notarized Sworn Statement."],
    quickInfo={"processingTime": "~2 weeks (including Provincial Assessor approval)", "fee": "Php 250.00",
               "whoCanApply": "All taxpayers"},
    sources=ASS_SRC)

add("Issuance of Certified True Copy of Tax Declaration and Certified Copy of Tax Map", [ASS],
    "property-assessment", "Property Assessment",
    "Issuance of certified copies of tax declarations and tax maps for real property.",
    steps=["Present updated Realty Tax Payment and fill up request slip.",
           "Secure Order of Payment and pay at Treasury Office.",
           "Receive Certified True Copy of Tax Declaration and/or Tax Map."],
    requirements=["Updated Realty Tax Payment.",
                  "Authority from the owner if the requesting party is not the owner."],
    quickInfo={"processingTime": "10–30 minutes per document", "fee": "Php 100.00 per Tax Declaration; Php 100.00 per Tax Map",
               "whoCanApply": "All taxpayers"},
    sources=ASS_SRC)

add("Issuance of Certificate of No Property or Landholdings", [ASS],
    "property-assessment", "Property Assessment",
    "Certification that a person has no registered property or landholdings in Taytay, Rizal.",
    steps=["Present latest Realty Tax Payment and fill up request slip.",
           "Secure Order of Payment and pay at Treasury Office.",
           "Receive the approved certification."],
    requirements=["Updated Realty Tax Payment.",
                  "Authority from the owner if the requesting party is not the owner."],
    quickInfo={"processingTime": "~11 minutes", "fee": "Php 130.00",
               "whoCanApply": "All taxpayers"},
    sources=ASS_SRC)

add("Application for Reclassification", [ASS],
    "property-assessment", "Property Assessment",
    "Reclassification of real property based on change of use, such as from agricultural to commercial.",
    steps=["Present all requirements for verification.",
           "Owner fills up Sworn Statement.",
           "Owner/representative pays corresponding fee at the Treasury Office.",
           "Wait for ocular inspection and preparation of new Tax Declaration.",
           "Receive owner's copy of Tax Declaration after Provincial Assessor approval."],
    requirements=["Request Letter.", "Lot Plan.", "Updated Realty Tax Payment.",
                  "Picture of the Property.", "Notarized Sworn Statement."],
    quickInfo={"processingTime": "~2 weeks (including Provincial Assessor approval)", "fee": "Php 200.00",
               "whoCanApply": "All taxpayers"},
    sources=ASS_SRC)

add("Application for Lot Segregation or Consolidation", [ASS],
    "property-assessment", "Property Assessment",
    "Processing of subdivided or consolidated Tax Declarations for real property.",
    steps=["Present all requirements for verification.",
           "Owner fills up Sworn Statement.",
           "Owner/representative pays the corresponding fee at Treasury Office.",
           "Wait for tax mapping and encoding.",
           "Receive new tax declarations and notice of assessment."],
    requirements=["Request Letter.", "2 copies of Subdivision/Consolidation Plan.",
                  "Certified true copy of TCT.", "Updated Real Property Tax.",
                  "Notarized Sworn Statement."],
    quickInfo={"processingTime": "~1 week (depending on number of parcels)", "fee": "Php 100.00",
               "whoCanApply": "All taxpayers"},
    sources=ASS_SRC)

add("Application for Newly Acquired Machineries", [ASS],
    "property-assessment", "Property Assessment",
    "Assessment and appraisal of newly acquired machineries for taxation purposes.",
    steps=["Present all requirements for assessment of machineries.",
           "Fill up Sworn Statement.",
           "Pay corresponding fee at Treasury Office.",
           "Wait for ocular inspection and preparation of Tax Declaration.",
           "Receive Tax Declaration and Notice of Assessment after Provincial Assessor approval."],
    requirements=["Request Letter.", "Duly certified copy of itemized list of machineries.",
                  "Original cost and date of operation/acquisition of machineries.",
                  "Notarized/Filled up Sworn Statement."],
    quickInfo={"processingTime": "~2 weeks (including Provincial Assessor approval)", "fee": "Php 200.00",
               "whoCanApply": "All taxpayers / Business owners"},
    sources=ASS_SRC)

add("Application for Newly Declared Real Property (Land)", [ASS],
    "property-assessment", "Property Assessment",
    "Discovery and assessment of newly declared land for real property tax purposes.",
    steps=["Present all requirements.",
           "Fill up Sworn Statement.",
           "Pay corresponding fee at Treasury Office.",
           "Wait for ocular inspection, FAAS preparation, and Provincial Assessor approval.",
           "Receive Tax Declaration after approval. Note: Owner/representative required to pay 10 years back taxes."],
    requirements=["Request Letter.", "Approved Plan.", "Lot Data Computation.", "Cadastral Map.",
                  "DENR Certification.", "Certification of Alienable/Disposable.", "Affidavit of Ownership.",
                  "Affidavit of Adjoining Owner.", "Affidavit of Waiver of Rights.",
                  "Barangay Certification.", "Photocopy of Identification Card of Owner.",
                  "Picture of the Property.", "Notarized Sworn Statement."],
    quickInfo={"processingTime": "~2 weeks (including Provincial Assessor approval)", "fee": "Php 200.00 + 10 years back taxes",
               "whoCanApply": "All taxpayers"},
    sources=ASS_SRC)

add("Annotation and Cancellation of Mortgage, Adverse Claim, Hold Transaction and Other Annotations", [ASS],
    "property-assessment", "Property Assessment",
    "Annotation or cancellation of mortgage, adverse claim, hold transaction, and similar entries on tax declarations.",
    steps=["Present all requirements.",
           "Wait for preparation of indorsement letter to Provincial Assessor's Office.",
           "Annotation/Cancellation is done after Provincial Assessor approval."],
    requirements=["Request Letter.", "Two (2) copies of the documents (Mortgage/Cancellation of Mortgage).",
                  "Official receipt for Annotation."],
    quickInfo={"processingTime": "~2 weeks (including Provincial Assessor approval)", "fee": "Php 100.00",
               "whoCanApply": "All taxpayers"},
    sources=ASS_SRC)

add("Annotation and Cancellation of Warrant of Levy", [ASS],
    "property-assessment", "Property Assessment",
    "Annotation or cancellation of a Warrant of Levy on tax declarations as endorsed by the Provincial Assessor.",
    steps=["Submit Indorsement of Notice of Annotation or Notice of Cancellation of Warrant of Levy.",
           "Wait for verification and annotation/cancellation on FAAS and Tax Declaration."],
    requirements=["Indorsement of Notice of Annotation and Notice of Cancellation of Warrant of Levy (from Provincial Assessor's Office)."],
    quickInfo={"processingTime": "~15 minutes", "fee": "None",
               "whoCanApply": "All taxpayers / Government agencies"},
    sources=ASS_SRC)

add("Application for Verification", [ASS],
    "property-assessment", "Property Assessment",
    "Verification of property ownership and location through the computerized and manual tax mapping system.",
    steps=["Present request slip for verification.",
           "Pay corresponding fee at the Treasurer's Office.",
           "Receive verification result."],
    requirements=["None (No prior requirements needed)"],
    quickInfo={"processingTime": "~5–10 minutes per RPU", "fee": "Php 100.00 per RPU",
               "whoCanApply": "All taxpayers"},
    sources=ASS_SRC)

add("Application for Cancellation of Assessment for Land, Improvement and Machineries", [ASS],
    "property-assessment", "Property Assessment",
    "Cancellation of real property assessment for land, building, improvement, or machinery that has been demolished or razed by fire.",
    steps=["Present and submit all requirements.",
           "Wait for ocular inspection and preparation of Notice of Cancellation.",
           "Receive owner's copy of Notice of Cancellation after Provincial Assessor approval."],
    requirements=["Request Letter for cancellation of assessment.",
                  "Fire Certificate (for property razed by fire) or Demolition Permit (for demolished improvement).",
                  "Updated Real Property Tax."],
    quickInfo={"processingTime": "~2 weeks (including Provincial Assessor approval)", "fee": "None",
               "whoCanApply": "All taxpayers"},
    sources=ASS_SRC)

add("Issuance of Certified True Copy of Documents", [ASS],
    "property-assessment", "Property Assessment",
    "Issuance of certified xerox copies of documents on file at the Assessor's Office.",
    steps=["Present and submit the required documents.",
           "Pay corresponding fee at the Treasurer's Office.",
           "Receive certified requested documents."],
    requirements=["Request Letter stating the purpose.",
                  "Authorization Letter if the requestee is not the registered owner."],
    quickInfo={"processingTime": "1–4 days (depending on document year)", "fee": "Php 130.00",
               "whoCanApply": "All taxpayers"},
    sources=ASS_SRC)

# ── GENDER AND DEVELOPMENT OFFICE ────────────────────────────────────────────
GAD = "gender-and-development-office"
GAD_SRC = [{"name": "Citizens Charter – Municipal Government of Taytay, Rizal (2025 1st Edition)", "url": None}]

add("Assisting Clients – GAD Office", [GAD],
    "gender-development", "Gender & Development",
    "Reception and referral of clients to the appropriate offices for gender-related concerns.",
    steps=["Register in Visitor's Logbook.", "Proceed to the concerned offices as endorsed by GAD staff."],
    requirements=["Register in Visitor's Logbook."],
    quickInfo={"processingTime": "~6 minutes", "fee": "None", "whoCanApply": "General public"},
    sources=GAD_SRC)

add("GAD Trainings and Seminars", [GAD],
    "gender-development", "Gender & Development",
    "Conduct of gender-related trainings and seminars for GAD focal persons, barangays, and the general public.",
    steps=["Wait for the announcement from the GAD office.",
           "Comply with requirements and instructions from the concerned offices."],
    requirements=["Request letter for Venue, Chairs, Tables, and Sound system.",
                  "Project Proposal.", "Letter of Invitation / Program.", "Attendance.", "Certificate of Participation."],
    quickInfo={"processingTime": "Days to weeks before training", "fee": "None",
               "whoCanApply": "GAD focal persons, barangays, and concerned departments"},
    sources=GAD_SRC)

add("PAPs Projects, Activities and Programs (GAD Events)", [GAD],
    "gender-development", "Gender & Development",
    "Implementation of GAD-funded projects, activities, and programs (PAPs).",
    steps=["Wait for the announcement from the GAD office.",
           "Comply with requirements and instructions from the concerned offices."],
    requirements=["Request letter for Venue, Chairs, Tables, and Sound system.", "Project Proposal.",
                  "Letter of Invitation / Program.", "Attendance.", "Certificate of Participation."],
    quickInfo={"processingTime": "Days to weeks before event", "fee": "None",
               "whoCanApply": "GAD focal persons and barangays"},
    sources=GAD_SRC)

add("Project Management, Research and Reporting (GAD)", [GAD],
    "gender-development", "Gender & Development",
    "Management of GAD-related documents, research outputs, and reports.",
    steps=["Proceed to the Municipal GAD office or concerned departments.",
           "Submit required documents."],
    requirements=["2 to 3 copies of the said report from/to concerned Department or Client."],
    quickInfo={"processingTime": "1–2 days", "fee": "None", "whoCanApply": "GAD-related personnel and offices"},
    sources=GAD_SRC)

add("Meetings – GAD Office", [GAD],
    "gender-development", "Gender & Development",
    "Facilitation of meetings conducted by the Gender and Development Office.",
    steps=["Wait for the announcement from the GAD office or concerned departments."],
    requirements=["Request letter for Venue, Chairs, Tables, and Sound system.",
                  "Program of expense.", "Letter of Invitation / Program.", "Sex Disaggregated Data."],
    quickInfo={"processingTime": "2–4 hours", "fee": "None", "whoCanApply": "All"},
    sources=GAD_SRC)

add("Conventions – GAD Office", [GAD],
    "gender-development", "Gender & Development",
    "Organization and participation in GAD-related conventions.",
    steps=["Wait for the announcement from the GAD office.",
           "Comply with requirements and instructions from the concerned offices."],
    requirements=["Request letter for Venue.", "Project Proposal.", "Letter of Invitation / Program.",
                  "Certificate of Participation and Recognition."],
    quickInfo={"processingTime": "Days to weeks before convention", "fee": "None",
               "whoCanApply": "GAD focal persons and barangays"},
    sources=GAD_SRC)

add("Anti-Sexual Harassment (CODI)", [GAD],
    "gender-development", "Gender & Development",
    "Filing and processing of anti-sexual harassment complaints through the Committee on Decorum and Investigation (CODI).",
    steps=["Submit letter of complaints (must be notarized).",
           "Undergo short interview.",
           "Wait for the invitation by the CODI Council."],
    requirements=["Notarized letter of complaints."],
    quickInfo={"processingTime": "Days to weeks depending on case", "fee": "None",
               "whoCanApply": "GAD focal persons, barangays, and employees"},
    sources=GAD_SRC)

# ── GENERAL SERVICES OFFICE ──────────────────────────────────────────────────
GSO = "general-services-office"
GSO_SRC = [{"name": "Citizens Charter – Municipal Government of Taytay, Rizal (2025 1st Edition)", "url": None}]

add("Implementation of IATF Disciplinary Guidelines", [GSO],
    "general-government-services", "General Government Services",
    "Enforcement of IATF disciplinary guidelines including release of driver's licenses and impounded vehicles upon payment of violation ticket.",
    steps=["Pay Violation Ticket."],
    requirements=["IATF Guidelines, Related Ordinances, Ordinance 33, S. 2020"],
    quickInfo={"processingTime": "1 hour", "fee": "Php 1,000 (driver's license release) + Php 2,500 (vehicle release)", "whoCanApply": "Taytay Residents"},
    sources=GSO_SRC)

add("Implementation of Solid Waste Management Program", [GSO],
    "general-government-services", "General Government Services",
    "Enforcement of solid waste management ordinances and community discipline program.",
    steps=["Pay Violation Ticket."],
    requirements=["R.A. 9003, Ordinance 15 S. 2008, Ordinance 12 S. 2017"],
    quickInfo={"processingTime": "1 hour", "fee": "Php 1,000 (driver's license release) + Php 2,500 (vehicle release)", "whoCanApply": "Taytay Residents"},
    sources=GSO_SRC)

add("Clean and Green", [GSO],
    "general-government-services", "General Government Services",
    "Clean-up and greening services provided by the GSO for strict compliance and maintenance of cleanliness.",
    steps=["Submit request letter.", "Accept and process the request.", "Provide the service within 24 hours."],
    requirements=["Request letter"],
    quickInfo={"processingTime": "24 hours", "fee": "None", "whoCanApply": "Taytay Residents"},
    sources=GSO_SRC)

add("Central Supply Unit – Dispensing of Medical Supplies", [GSO],
    "general-government-services", "General Government Services",
    "Issuance of medical supplies to health sections through a Requisition and Issue Slip (RIS) process.",
    steps=["Fill up RIS form.", "Wait for preparation of requested supplies.", "Receive issued supplies and validate quantity."],
    requirements=["Requisition and Issue Slip (RIS)"],
    quickInfo={"processingTime": "32 minutes", "fee": "None", "whoCanApply": "All sections or departments of Health Office"},
    sources=GSO_SRC)

add("Central Supply Unit – Printing of Forms", [GSO],
    "general-government-services", "General Government Services",
    "Printing of various forms and documents for health sections upon request.",
    steps=["Request for printing of needed forms/documents.", "Receive printed forms/documents."],
    requirements=["Service Request Slip"],
    quickInfo={"processingTime": "40 minutes", "fee": "None", "whoCanApply": "All sections or departments of Health Office"},
    sources=GSO_SRC)

add("Central Supply Unit – Replenishment of Oxygen Tanks", [GSO],
    "general-government-services", "General Government Services",
    "Request for refilling or replenishment of oxygen tanks for patients.",
    steps=["Request for refill/replenishment of Oxygen Tanks."],
    requirements=["Acknowledgement Form"],
    quickInfo={"processingTime": "1 hour 5 minutes", "fee": "None", "whoCanApply": "All sections or departments of Health Office"},
    sources=GSO_SRC)

add("Central Supply Unit – Collection and Transport of General and Hazardous Waste", [GSO],
    "general-government-services", "General Government Services",
    "Collection and transport of general and hazardous waste to ensure cleanliness and sanitation.",
    steps=["Request for collection of general and hazardous wastes."],
    requirements=["Permit to Transport"],
    quickInfo={"processingTime": "12 hours", "fee": "None", "whoCanApply": "All sections or departments of Health Office"},
    sources=GSO_SRC)

add("Central Supply Unit – Repair of Medical Equipment", [GSO],
    "general-government-services", "General Government Services",
    "Inspection and repair of medical equipment upon request from health sections.",
    steps=["Submit filled request for repair and quotation of supplier."],
    requirements=["Notice of Request for Inspection"],
    quickInfo={"processingTime": "30 minutes (inspection)", "fee": "None", "whoCanApply": "All sections or departments of Health Office"},
    sources=GSO_SRC)

add("Delivery of Supplies and Properties", [GSO],
    "general-government-services", "General Government Services",
    "Acceptance and management of delivery of equipment, items, or supplies.",
    steps=["Fill out Notice of Delivery and Request for Inspection.",
           "Deliver items and accept delivery at Supply or Property Management Section.",
           "Inspect delivery and endorse complete documents."],
    requirements=["Request letter"],
    quickInfo={"processingTime": "1 hour 5 minutes", "fee": "None", "whoCanApply": "Municipal employees of Taytay"},
    sources=GSO_SRC)

add("Issuance of Office Supplies and Properties", [GSO],
    "general-government-services", "General Government Services",
    "Issuance of office, janitorial, electrical and other related supplies based on approved Requisition and Issue Slip (RIS).",
    steps=["Request for Office, Janitorial, Electrical and other supplies.",
           "Accept requested supplies after preparation and recording."],
    requirements=["Request letter", "Approved Requisition and Issue Slip (RIS)"],
    quickInfo={"processingTime": "55 minutes", "fee": "None", "whoCanApply": "Municipal employees of Taytay"},
    sources=GSO_SRC)

add("Property Management – Release of Equipment", [GSO],
    "general-government-services", "General Government Services",
    "Request and release of government equipment with preparation of Property Accountability Receipt (PAR) and Inventory Custodian Slip (ICS).",
    steps=["Forward letter-request for provision of items/equipment.",
           "Wait for Property Management Section to check availability and prepare PAR and ICS.",
           "Receive and acknowledge equipment."],
    requirements=["Request letter"],
    quickInfo={"processingTime": "1 hour 20 minutes", "fee": "None", "whoCanApply": "Municipal employees of Taytay"},
    sources=GSO_SRC)

add("Property Management – Return of Unserviceable Properties", [GSO],
    "general-government-services", "General Government Services",
    "Return of unserviceable municipal-owned properties to the warehouse for disposal.",
    steps=["Secure Property Return Slip (PRS) form and fill out required information.",
           "Submit PRS form to the GSO authorized representative.",
           "Coordinate with GSO for the turn-over of properties."],
    requirements=["Property Return Slip (PRS)"],
    quickInfo={"processingTime": "1 hour 15 minutes (depending on volume)", "fee": "None",
               "whoCanApply": "All city government departments, units, offices, and divisions"},
    sources=GSO_SRC)

add("Property Management – Issuance of Clearance from Property Accountability", [GSO],
    "general-government-services", "General Government Services",
    "Issuance of clearance from property accountability for resigned, retired, transferred, or deceased employees.",
    steps=["Submit a request for clearance from accountabilities.",
           "Wait for inventory check and inspection.",
           "Receive Clearance from Property Accountability."],
    requirements=["Letter of Request addressed to the General Services Officer.",
                  "Cedula / Sedula.",
                  "Employee's ID."],
    quickInfo={"processingTime": "~37 minutes", "fee": "None",
               "whoCanApply": "Resigned, retired, transferred, and deceased employees"},
    sources=GSO_SRC)

add("Property Insurance and Registration Unit (PIRU)", [GSO],
    "general-government-services", "General Government Services",
    "Registration and insurance of government-owned vehicles with GSIS and LTO.",
    steps=["Visit GSO and approach the Property Insurance and Registration Unit (PIRU).",
           "Submit required documents for GSIS insurance or LTO registration.",
           "Receive processed documents and registration."],
    requirements=["Land Transportation Office (LTO) Form.",
                  "Original Receipt, Certificate of Registration (OR, CR)."],
    quickInfo={"processingTime": "~35 minutes", "fee": "None", "whoCanApply": "Municipal employees of Taytay / Authorized drivers"},
    sources=GSO_SRC)

add("Utilities – Processing of Payment of Bills", [GSO],
    "general-government-services", "General Government Services",
    "Processing of government utility bills (electricity, water, etc.) for payment.",
    steps=["Provide the Statement of Account (SOA) to GSO Utilities staff.",
           "Documents are endorsed to the Administrator's Office, Budget Office, Accounting Office, and Treasury Office for signature and payment."],
    requirements=["Statement of Account (SOA) from the Utility Provider."],
    quickInfo={"processingTime": "~2 weeks", "fee": "None", "whoCanApply": "Municipal employees of Taytay"},
    sources=GSO_SRC)

add("Food Distribution or Supplies", [GSO],
    "general-government-services", "General Government Services",
    "Provision of manpower and management for food distribution during official municipal activities.",
    steps=["Deliver the food items/goods from the supplier to the General Services Office.",
           "GSO food supplies management section receives, counts, and distributes foods."],
    requirements=["Attendance sheet of attendees (from Mayor's Office or Procurement Office)."],
    quickInfo={"processingTime": "~3 hours 40 minutes", "fee": "None", "whoCanApply": "Local Government Offices"},
    sources=GSO_SRC)

add("Request for Fuel Allocation for Government Equipment and Vehicles", [GSO],
    "general-government-services", "General Government Services",
    "Processing of fuel allocation slips for authorized government equipment and vehicles.",
    steps=["Submit a letter-request to the General Services Officer requesting approval for fuel allocation.",
           "Submit a copy of valid driver's license and OR/CR of the vehicle.",
           "If approved, the request is endorsed to the Legal Office for issuance of Fuel Allocation Slip.",
           "Present the signed fuel slip to UNIOIL for fuel release."],
    requirements=["Valid driver's license.", "Official Receipt and Certificate of Registration (OR/CR) of the vehicle."],
    quickInfo={"processingTime": "~30 minutes", "fee": "None", "whoCanApply": "Authorized drivers"},
    sources=GSO_SRC)

add("Resources Management – Tent, Drum Fan, Air Cooler, Tarpaulin, Manpower Services", [GSO],
    "general-government-services", "General Government Services",
    "Provision of tents, drum fans, air coolers, tarpaulin installation, and additional manpower for community events.",
    steps=["Submit or forward a letter request to the Office of the Municipal Mayor through the General Services Officer.",
           "Specify the date, occasion, address, and contact number.",
           "GSO schedules activity and notifies requestor for confirmation."],
    requirements=["Request letter (must specify date, occasion, address, and contact number)."],
    quickInfo={"processingTime": "~5 hours 25 minutes", "fee": "None",
               "whoCanApply": "Taytay Residents and Municipal Employees"},
    sources=GSO_SRC)

add("Building Maintenance", [GSO],
    "general-government-services", "General Government Services",
    "Repair and maintenance of building components (electrical, plumbing, carpentry) upon request.",
    steps=["Fill out the Job Order Form or Request letter by the requesting office and signed by the Supervising Head."],
    requirements=["Fill out Job Order Form or Request letter signed by the Supervising Head."],
    quickInfo={"processingTime": "~20 minutes (initial); varies by work required", "fee": "None",
               "whoCanApply": "Municipal Offices of Taytay"},
    sources=GSO_SRC)

add("Sound System Services", [GSO],
    "general-government-services", "General Government Services",
    "Set up and operation of sound system for different requests and activities.",
    steps=["Submit a Request letter specifying the date, time, venue, and contact number."],
    requirements=["Request letter (must specify date, time, venue, and contact number)."],
    quickInfo={"processingTime": "~50 minutes", "fee": "None",
               "whoCanApply": "LGUs, organizations, and interested individuals"},
    sources=GSO_SRC)

add("Vehicle Maintenance and Motorpool Services", [GSO],
    "general-government-services", "General Government Services",
    "Technical assistance, assessment, and repair of government service vehicles.",
    steps=["Submit PMS request letter.",
           "Bring the government-issued vehicle to the Motorpool Section.",
           "Wait for inspection, repair, and final inspection before vehicle release."],
    requirements=["Request letter.", "Government-issued vehicle."],
    quickInfo={"processingTime": "~4 hours (varies by repair)", "fee": "None",
               "whoCanApply": "Municipal employees of Taytay"},
    sources=GSO_SRC)

add("Solid Waste Management – Garbage Collection", [GSO],
    "general-government-services", "General Government Services",
    "Scheduled and on-request garbage collection service managed by the GSO Solid Waste Management Section.",
    steps=["Request for garbage collection as per schedule and request."],
    requirements=["Request letter."],
    quickInfo={"processingTime": "~25 minutes", "fee": "None",
               "whoCanApply": "Municipal employees of Taytay"},
    sources=GSO_SRC)

add("Impounding Section – Claiming of Impounded Vehicles or Goods", [GSO],
    "general-government-services", "General Government Services",
    "Safekeeping and release of impounded vehicles and vendor's items/goods.",
    steps=["Submit the receipt or proof of payment and other related documents.",
           "GSO verifies documents and releases impounded vehicle or items to the rightful owner."],
    requirements=["Proof of Ownership.", "Driver's License.", "OR/CR."],
    quickInfo={"processingTime": "~25 minutes", "fee": "As per violation receipt",
               "whoCanApply": "General public"},
    sources=GSO_SRC)

add("CCTV Footage Request", [GSO],
    "general-government-services", "General Government Services",
    "Request for review of CCTV footage for incident documentation.",
    steps=["Properly accomplish the request form with Name, Address, Contact Number, Details and purpose, Date and Time of Incident, and Location."],
    requirements=["Request Form"],
    quickInfo={"processingTime": "~45 minutes", "fee": "None",
               "whoCanApply": "Municipal employees and general public"},
    sources=GSO_SRC)

add("Lost and Found – MBSS", [GSO],
    "general-government-services", "General Government Services",
    "Facilitation of return of lost property to its rightful owner through the Municipal Building Security Section.",
    steps=["Properly accomplish the Lost and Found Form.",
           "Present complete requirements and valid ID with precise item description.",
           "If ownership is proven, receive the found item and sign the blotter logbook."],
    requirements=["Lost and Found Form."],
    quickInfo={"processingTime": "~15 minutes", "fee": "None",
               "whoCanApply": "Municipal employees and general public"},
    sources=GSO_SRC)

add("GSO Free Water Refilling Station", [GSO],
    "general-government-services", "General Government Services",
    "Free water refilling service for municipal employees at the GSO Water Refilling Station, Municipal Hall.",
    steps=["Visit the GSO and approach the water refilling station.", "Receive refilled water bottles."],
    requirements=["Water bottles or water container."],
    quickInfo={"processingTime": "~20 minutes", "fee": "None",
               "whoCanApply": "Municipal employees of Taytay"},
    sources=GSO_SRC)

# ── LOCAL CIVIL REGISTRY ─────────────────────────────────────────────────────
LCR = "local-civil-registry"
LCR_SRC = [{"name": "Citizens Charter – Municipal Government of Taytay, Rizal (2025 1st Edition)", "url": None}]

add("Timely Registration of Certificate of Live Birth", [LCR],
    "civil-registry", "Civil Registry",
    "Registration of birth certificates within 30 days from date of birth for children born in Taytay, Rizal.",
    steps=["Present properly accomplished Municipal Form No. 102 - Certificate of Live Birth and all requirements.",
           "LCRO checks completeness, assigns registry number.",
           "Receive released personal copy."],
    requirements=["Properly accomplished Municipal Form No. 102 - Certificate of Live Birth (1 set, all original, black ink).",
                  "Certificate of Marriage of Parents (if married).",
                  "Notarized Affidavit of Admission of Paternity (if child acknowledged – for Illegitimate Child).",
                  "Notarized Affidavit to Use the Surname of the Father (if applicable)."],
    quickInfo={"processingTime": "~17 minutes", "fee": "None", "whoCanApply": "Parents, guardians, hospitals, clinics",
               "validity": "Permanent"},
    sources=LCR_SRC)

add("Late Registration of Certificate of Live Birth", [LCR],
    "civil-registry", "Civil Registry",
    "Registration of birth certificates after the 30-day filing period for individuals born in Taytay, Rizal.",
    steps=["Present accomplished COLB form and submit required documents.",
           "Conduct of interview with the client/parents.",
           "Registration after 10-day posting period.",
           "Receive owner's copy after posting period."],
    requirements=["Certificate of Live Birth for Late Registration (1 Set).",
                  "Negative Result from PSA (1 Original).",
                  "Baptismal Certificate (1 Original, 1 Photocopy).",
                  "Personal Appearance of registrant or parent/guardian.",
                  "For Legitimate Child (17 and below): Certified True Copy of Parents' Certificate of Marriage, Notarized Joint Affidavit of Two Disinterested Persons, and other applicable documents.",
                  "For Illegitimate Child: Notarized Affidavit of Admission of Paternity, Notarized Affidavit to Use the Surname of the Father, and other applicable documents.",
                  "For 18 and above: Additional documents such as NBI Clearance, Police Clearance, SSS E-1, Voter's Registration Record, etc."],
    quickInfo={"processingTime": "11 days, 17 minutes", "fee": "None (Out-of-town courier: Php 90–150)",
               "whoCanApply": "Parents, guardians, registrants born in Taytay"},
    sources=LCR_SRC)

add("Application and Issuance of Marriage License", [LCR],
    "civil-registry", "Civil Registry",
    "Application and issuance of a marriage license for residents of Taytay, Rizal. Valid for 120 days from issuance, anywhere in the Philippines.",
    steps=["Secure marriage license application form and present with required documents; both applicants will be interviewed.",
           "Pay the corresponding fees at the Municipal Treasury Office.",
           "Attend family planning and marriage counseling (PMOC) every Friday morning.",
           "Receive Marriage License after 10-day posting and after payment of Marriage License Fee."],
    requirements=["Accomplished Application form for Marriage License (AML) – 2 Copies.",
                  "Personal Appearance of both contracting parties.",
                  "Birth or Baptismal Certificate (1 Original, 1 Photocopy).",
                  "Community Tax Certificate (Cedula).",
                  "Valid IDs of both applicants (at least one showing residency in Taytay).",
                  "Certificate of No Marriage (CENOMAR) from PSA (within 6 months of application).",
                  "Pre-Marriage Orientation and Counseling Certificate.",
                  "Parental Consent Form (for ages 18–20) or Parental Advice Form (for ages 21–25), if applicable.",
                  "Certificate of Legal Capacity to Marry (for foreigners).",
                  "Other applicable documents for widows/widowers, annulled parties, or divorcees."],
    quickInfo={"processingTime": "11 days + 2–3 hours PMOC", "fee": "Php 602.00",
               "whoCanApply": "Marriage applicants who are at least 18 years of age",
               "validity": "120 days from date of issuance"},
    sources=LCR_SRC)

add("Timely Registration of Certificate of Marriage", [LCR],
    "civil-registry", "Civil Registry",
    "Registration of marriage certificates for parties married in Taytay, Rizal.",
    steps=["Submit the Certificate of Marriage for registration.",
           "Registration of Certificate of Marriage.",
           "Receive owner's copy after registration."],
    requirements=["Signed and Accomplished Marriage Certificate.",
                  "Marriage License.",
                  "Request for the Celebration of Marriage in a place other than those authorized by law (if applicable)."],
    quickInfo={"processingTime": "~17 minutes", "fee": "None",
               "whoCanApply": "Contracting parties married in Taytay"},
    sources=LCR_SRC)

add("Late Registration of Certificate of Marriage", [LCR],
    "civil-registry", "Civil Registry",
    "Registration of marriage certificates after the prescribed registration period for marriages solemnized in Taytay, Rizal.",
    steps=["Submit the signed Certificate of Marriage and requirements.",
           "Accomplish the new Certificate of Marriage following the information in the old copy.",
           "Registration after 10-day posting period.",
           "Receive owner's copy after posting period."],
    requirements=["Duly Accomplished and Signed Certificate of Marriage.",
                  "Latest Copy of CENOMAR from PSA (for both contracting parties, within 6 months).",
                  "Affidavit of Delayed Registration executed by the Solemnizing Officer.",
                  "Sworn Statement/Affidavit of Contracting Parties.",
                  "Wedding Pictures.",
                  "Other applicable documents."],
    quickInfo={"processingTime": "11 days, 17 minutes", "fee": "None",
               "whoCanApply": "Solemnizing officers and contracting parties"},
    sources=LCR_SRC)

add("Timely Registration of Certificate of Death", [LCR],
    "civil-registry", "Civil Registry",
    "Registration of death certificates within 30 days from date of death for deaths occurring in Taytay, Rizal.",
    steps=["Present accomplished Certificate of Death with complete signatures.",
           "Pay Burial/Cremation Permit or Transfer Permit at the Municipal Treasury Office (if applicable).",
           "Registration of Certificate of Death.",
           "Receive owner's copy after signing."],
    requirements=["Duly accomplished Municipal Form No. 103 - Certificate of Death/Fetal Death Form (1 Set).",
                  "Autopsy Report (if applicable).",
                  "Certification of Health Officer.",
                  "Certification of Embalmer.",
                  "Post Mortem of Death Certificate (if applicable).",
                  "Burial/Cremation Permit (as applicable).",
                  "Transfer of Cadaver (Certificate of Death), if applicable."],
    quickInfo={"processingTime": "~17–22 minutes", "fee": "Php 150.00 (burial/cremation or transfer permit)",
               "whoCanApply": "Funeral parlors and general public"},
    sources=LCR_SRC)

add("Late Registration of Certificate of Death", [LCR],
    "civil-registry", "Civil Registry",
    "Registration of death certificates after the 30-day filing period for deaths occurring in Taytay, Rizal.",
    steps=["Submit Certificate of Death with complete signatures for late registration.",
           "Registration after 10-day posting period.",
           "Receive owner's copy after signing."],
    requirements=["Duly accomplished Municipal Form No. 103 - Certificate of Death/Fetal Death Form (1 Set).",
                  "Autopsy Report (if applicable).",
                  "Certification of Health Officer.",
                  "Certification of Embalmer.",
                  "Post Mortem of Death Certificate (if applicable).",
                  "Certification from the Cemetery or Burial Permit.",
                  "Certificate of Service from the Funeral Service Provider.",
                  "PSA Negative Certification.",
                  "Notarized Joint Affidavit of Two Witnesses.",
                  "Picture of Tombstone (Lapida)."],
    quickInfo={"processingTime": "11 days, 7 minutes", "fee": "None",
               "whoCanApply": "Funeral parlors and general public"},
    sources=LCR_SRC)

add("Registration of Court Decrees and Orders", [LCR],
    "civil-registry", "Civil Registry",
    "Registration of court decrees and orders affecting civil registry documents (e.g., annulment, adoption).",
    steps=["Present all required documents.",
           "Pay filing fee at the Municipal Treasury Office.",
           "Submitted documents are subject to review and verification.",
           "Receive owner's copy for submission to PSA Main Office."],
    requirements=["Certified True Copy of Court Decision/Order.",
                  "Certified True Copy of Certificate of Finality.",
                  "Certified True Copy of Certificate of Authenticity and Certificate of Registration.",
                  "All documents signed and certified by the municipal or city registrar where the case was filed."],
    quickInfo={"processingTime": "4 working days (or depending on court's timeline)", "fee": "Php 1,500.00 + Php 115.00 per certified page",
               "whoCanApply": "Petitioners and persons subject of court decrees"},
    sources=LCR_SRC)

add("Correction of Civil Registry Documents (RA 9048 / RA 10172)", [LCR],
    "civil-registry", "Civil Registry",
    "Correction of clerical or typographical errors, change of first name, and correction of sex or date of birth in civil registry documents, as authorized under R.A. 9048 and R.A. 10172.",
    steps=["Client inquiry and interview; assessment of applicable requirements.",
           "Present accomplished correction form with complete and necessary requirements.",
           "Pay the prescribed correction fees at the Municipal Treasury Office.",
           "Receive petition receipt and wait for mandatory 10-day posting period and 2-week publication period.",
           "Await PSA decision (3–4 months)."],
    requirements=["Certified True Copy of the Civil Registry document (PSA copy).",
                  "Certified True Copy of the Civil Registry document (Local Copy).",
                  "Personal Appearance of Petitioner.",
                  "Supporting documents showing the correct entry (Baptismal Certificate, Marriage Certificate, Voter's Registration, GSIS/SSS records, School records, Government IDs, Passport, etc.).",
                  "NBI Clearance and Police Clearance (for sex or date of birth correction).",
                  "Medical Certificate (for correction of sex entry) from June V. Zapanta Emergency Hospital or accredited government physician.",
                  "Other relevant documents as required."],
    quickInfo={"processingTime": "~5 months total",
               "fee": "Php 1,000.00 (clerical error); Php 3,000.00 (change of first name, sex, or date of birth); Php 115.00 per certified copy",
               "whoCanApply": "Persons with clerical or typographical errors in civil registry documents"},
    sources=LCR_SRC)

add("Issuance of Certified True Copies of Civil Registry Documents", [LCR],
    "civil-registry", "Civil Registry",
    "Issuance of certified true copies (local copy) of birth, marriage, or death certificates registered in Taytay, Rizal.",
    steps=["Submit necessary documents and accomplished Request Form.",
           "Pay corresponding fee at the Municipal Treasury Office.",
           "Present Official Receipt to LCRO personnel.",
           "Receive signed Certified True Copy."],
    requirements=["Request Form for Birth, Marriage, or Death Certificate.",
                  "Special Power of Attorney or Authorization Letter (if not the document owner).",
                  "Valid Government-Issued ID of document owner and authorized representative.",
                  "Pertinent information: Name of Document Owner, Complete Date of Vital Event, Name of Requester and Relationship."],
    quickInfo={"processingTime": "~19–34 minutes (depending on document)", "fee": "Php 115.00 per Certified True Copy",
               "whoCanApply": "Document owners and authorized representatives"},
    sources=LCR_SRC)

# ── LEGAL SERVICES OFFICE ────────────────────────────────────────────────────
LEG = "legal-services-office"
LEG_SRC = [{"name": "Citizens Charter – Municipal Government of Taytay, Rizal (2025 1st Edition)", "url": None}]

add("Review of MOA or MOU", [LEG],
    "legal-services", "Legal Services",
    "Legal review of Memoranda of Agreement (MOA) or Memoranda of Understanding (MOU) for government offices.",
    steps=["Submit the request/endorsement letter and draft MOA/MOU (soft and hard copy).",
           "Documents are endorsed to the lawyers of the Legal Services Office.",
           "Legal personnel coordinate with the requesting office for clarifications.",
           "The draft MOA/MOU is reviewed.",
           "Receive the reviewed and finalized MOA/MOU."],
    requirements=["Request Letter/Endorsement Letter.",
                  "Hard Copy and Soft Copy of the draft MOA/MOU.",
                  "Details of the Focal Person handling the MOA/MOU."],
    quickInfo={"processingTime": "Simple: 1 day; Complex: 5 days; Highly Technical: 18 days",
               "fee": "None", "whoCanApply": "All departments/offices under the Municipal Government of Taytay"},
    sources=LEG_SRC)

add("Review of Contracts", [LEG],
    "legal-services", "Legal Services",
    "Legal review of draft contracts for government offices.",
    steps=["Submit the request/endorsement letter and draft Contract (soft and hard copy).",
           "Documents are endorsed to the lawyers of the Legal Services Office.",
           "Legal personnel coordinate with the requesting office for clarifications.",
           "The draft Contract is reviewed.",
           "Receive the reviewed and finalized Contract."],
    requirements=["Request Letter/Endorsement Letter.",
                  "Hard Copy and Soft Copy of the draft Contract.",
                  "Details of the Focal Person handling the Contract."],
    quickInfo={"processingTime": "Simple: 1 day; Complex: 5 days; Highly Technical: 18 days",
               "fee": "None", "whoCanApply": "All departments/offices under the Municipal Government of Taytay"},
    sources=LEG_SRC)

add("Rendering of Legal Opinion", [LEG],
    "legal-services", "Legal Services",
    "Provision of legal opinions on documents and matters submitted by government offices.",
    steps=["Submit the request/endorsement letter and document (soft and hard copy).",
           "Documents are endorsed to the lawyers of the Legal Services Office.",
           "Legal personnel coordinate with the requesting office for clarifications.",
           "The document is reviewed and legal opinion is provided.",
           "Receive the document with legal opinion."],
    requirements=["Request Letter/Endorsement Letter.",
                  "Hard Copy and Soft Copy of the Document.",
                  "Details of the Focal Person handling the Document."],
    quickInfo={"processingTime": "Simple: 1 day; Complex: 5 days; Highly Technical: 18 days",
               "fee": "None", "whoCanApply": "All departments/offices under the Municipal Government of Taytay"},
    sources=LEG_SRC)

add("Formulation and Review of Executive Orders, Resolutions, and Ordinances", [LEG],
    "legal-services", "Legal Services",
    "Drafting and/or review of executive orders, resolutions, and ordinances for government offices.",
    steps=["Submit the request/endorsement letter and document (soft and hard copy).",
           "Documents are endorsed to the lawyers of the Legal Services Office.",
           "Legal personnel coordinate with the requesting office for clarifications.",
           "The document is formulated and/or reviewed.",
           "Receive the finalized document."],
    requirements=["Request Letter/Endorsement Letter.",
                  "Hard Copy and Soft Copy of the Document.",
                  "Details of the Focal Person handling the Document."],
    quickInfo={"processingTime": "Simple: 1 day; Complex: 5 days; Highly Technical: 18 days",
               "fee": "None", "whoCanApply": "All departments/offices under the Municipal Government of Taytay"},
    sources=LEG_SRC)

# ── MANAGEMENT INFORMATION SERVICE SYSTEM ───────────────────────────────────
MISS = "management-information-service-system"
MISS_SRC = [{"name": "Citizens Charter – Municipal Government of Taytay, Rizal (2025 1st Edition)", "url": None}]

add("Technical Assistance for Computer Hardware and Software Issues", [MISS],
    "information-technology", "Information Technology",
    "Troubleshooting of computer hardware and software issues for LGU Taytay employees and national agencies housed by Taytay LGU.",
    steps=["Inform MISS personnel of the request/concern via phone call or personal appearance.",
           "Fill up Service Request Form.",
           "MISS personnel troubleshoot the equipment/device on-site or in the office.",
           "Documentation and recording of resolved issue."],
    requirements=["MISS Request Form"],
    quickInfo={"processingTime": "Varies by difficulty", "fee": "None",
               "whoCanApply": "Taytay LGU employees and national agencies housed by Taytay LGU"},
    sources=MISS_SRC)

add("Posting of Articles and Content Updating of the Taytay LGU Website", [MISS],
    "information-technology", "Information Technology",
    "Uploading and updating of articles and content on the Taytay, Rizal LGU website.",
    steps=["Provide hard and soft copies of the articles to be posted.",
           "MISS reviews data/articles for completeness and compatibility."],
    requirements=["Hard and Soft Copies of the Articles."],
    quickInfo={"processingTime": "2–5 minutes (per upload); varies by volume", "fee": "None",
               "whoCanApply": "LGU Taytay offices"},
    sources=MISS_SRC)

add("Systems Maintenance for LGU Offices", [MISS],
    "information-technology", "Information Technology",
    "Maintenance and administration of database and systems, access management, error fixing, and continuity assurance.",
    steps=["Request for assistance via phone call or personal appearance to MISS.",
           "Fill up request form.",
           "MISS system personnel resolve the system concern on-site."],
    requirements=["Hard and Soft Copies of the Articles (if applicable)."],
    quickInfo={"processingTime": "Varies by difficulty; on-site service provider notified if needed",
               "fee": "None", "whoCanApply": "Taytay LGU system-generated offices, including Taytay Emergency Hospital"},
    sources=MISS_SRC)

add("Monitoring of LGU Network Backbone and SMILE KONEK Free Wi-Fi Network Service", [MISS],
    "information-technology", "Information Technology",
    "Monitoring and regular assessment of the LGU network backbone and SMILE KONEK Free Wi-Fi network service.",
    steps=["Request for Network Service Access.",
           "Submit required documents (request form, letter of request, ticketing system).",
           "Await confirmation of access approval.",
           "Receive confirmation and access credentials.",
           "Test access and report issues if any.",
           "Regular periodic monitoring and maintenance."],
    requirements=["Letter of Request / Service Request Form."],
    quickInfo={"processingTime": "~3 hours (initial access); ongoing monitoring",
               "fee": "None", "whoCanApply": "Taytayeños and government personnel"},
    sources=MISS_SRC)

add("National Agencies Coordination on ICT Projects", [MISS],
    "information-technology", "Information Technology",
    "Coordination with national government agencies for ICT events or programs for the Local Government Unit.",
    steps=["Submit or receive letter to/from national agencies for collaboration.",
           "Coordinate with the project via call or email.",
           "Meet in person or online for project discussion.",
           "Execute the project in coordination with national agencies and concerned departments."],
    requirements=["Letter sent through mail, fax, or delivered to the office."],
    quickInfo={"processingTime": "Varies depending on project schedules", "fee": "None",
               "whoCanApply": "Taytayeños and Taytay LGU offices"},
    sources=MISS_SRC)

# ── MUNICIPAL ENVIRONMENT AND NATURAL RESOURCES OFFICE ──────────────────────
MENRO = "municipal-environment-and-natural-resources-office"
MENRO_SRC = [{"name": "Citizens Charter – Municipal Government of Taytay, Rizal (2025 1st Edition)", "url": None}]

add("Application for Environmental Business Permit (MENRO Clearance)", [MENRO],
    "environmental-services", "Environmental Services",
    "Issuance of Environmental Permit to Operate for businesses as part of the business permit application process.",
    steps=["Submit requirements needed.",
           "Completion of requirements and creation of Environmental Permit to Operate.",
           "Proceed to Treasury Office for payment."],
    requirements=["Certificate of Non-Coverage (CNC).",
                  "Environmental Compliance Certificate (ECC).",
                  "LLDA Clearance.",
                  "Discharge Permit.",
                  "Permit to Operate.",
                  "Pollution Control Officer (PCO).",
                  "Sewage Treatment Plant (STP).",
                  "Waste Water Treatment Facility (WWTF)."],
    quickInfo={"processingTime": "~20 minutes", "fee": "Php 130.00 (Environmental Permit to Operate)",
               "whoCanApply": "All government agencies, LGUs, GOCCs, and government instrumentalities"},
    sources=MENRO_SRC)

add("Application for Tree Cutting Permit", [MENRO],
    "environmental-services", "Environmental Services",
    "Issuance of Endorsement Letter and No Objection Certificate from MENRO for tree cutting or trimming.",
    steps=["Submit requirements.",
           "Inspection of the tree and site.",
           "Complete requirements and creation of Endorsement Letter and No Objection Certification.",
           "Proceed to Treasury Office for payment.",
           "Proceed to MENRO to receive Endorsement Letter and No Objection Certificate."],
    requirements=["Request Letter addressed to the Municipal Mayor.",
                  "Land Title / Tax Declaration.",
                  "Barangay No Objection Certification for Tree Cutting/Trimming.",
                  "Home Owner's Association No Objection Certification (if inside a village/subdivision).",
                  "Picture of the tree."],
    quickInfo={"processingTime": "1 day 30 minutes", "fee": "Php 130.00 (certification) + Php 300.00 per tree",
               "whoCanApply": "All government agencies, LGUs, GOCCs, and government instrumentalities"},
    sources=MENRO_SRC)

# ── PUBLIC EMPLOYMENT SERVICE OFFICE ─────────────────────────────────────────
PESO = "public-employment-service-office"
PESO_SRC = [{"name": "Citizens Charter – Municipal Government of Taytay, Rizal (2025 1st Edition)", "url": None}]

PESO_REQS = ["Request letter.", "DOLE Certificate (No pending Case – DOLE Rizal).",
             "Company Profile.", "Job Vacancies with qualifications.", "SEC Permit.",
             "DTI Permit.", "Business Permit.", "Mayor's Permit.", "BIR 2303 Phil-jobnet."]

add("Daily Employment Facilitation", [PESO],
    "employment-livelihood", "Employment & Livelihood",
    "Day-to-day facilitation of job matching and referral services for job seekers.",
    steps=["Evaluate applicant's resume.", "Interview the applicants.", "Fill up NMRS Form.",
           "Check the NMRS Form.", "Issuance/Release of Recommendation Letter.", "Endorse to Applicants."],
    requirements=PESO_REQS,
    quickInfo={"processingTime": "24 minutes", "fee": "None",
               "whoCanApply": "Job seekers, employers, students, OSY, OFW"},
    sources=PESO_SRC)

add("Skills Registration System", [PESO],
    "employment-livelihood", "Employment & Livelihood",
    "Registration of job seekers' skills through the online/offline SRS system.",
    steps=["Gather the NMRS Form by the applicant.", "Encode the NMRS through SRS online/offline system.",
           "Generate the monthly report."],
    requirements=PESO_REQS,
    quickInfo={"processingTime": "45 minutes", "fee": "None",
               "whoCanApply": "Job seekers, employers, students, OSY, OFW"},
    sources=PESO_SRC)

add("Local Recruitment Activity and Special Recruitment Activity", [PESO],
    "employment-livelihood", "Employment & Livelihood",
    "Facilitation of local and special recruitment activities connecting employers and job seekers.",
    steps=["Request letter from the private company through PESO Manager.",
           "PESO Manager approves the date of activity.",
           "After completion of requirements, conduct the activity.",
           "Posting and uploading of job vacancies.",
           "Conducting of LRA/SRA orientation, screening, and actual interview."],
    requirements=PESO_REQS,
    quickInfo={"processingTime": "2 hours 48 minutes", "fee": "None",
               "whoCanApply": "Job seekers, employers, students, OSY, OFW"},
    sources=PESO_SRC)

add("OB Fair Activity", [PESO],
    "employment-livelihood", "Employment & Livelihood",
    "Organization and conduct of job fairs for employers and job seekers.",
    steps=["Completion of company requirements and approval.",
           "Company invitation and confirmation.",
           "Posting and uploading of company job vacancies.",
           "Conducting job fair.", "Fill up NMRS Form.", "Applicant evaluation and interview."],
    requirements=PESO_REQS,
    quickInfo={"processingTime": "55 minutes", "fee": "None",
               "whoCanApply": "Job seekers, employers, students, OSY, OFW"},
    sources=PESO_SRC)

add("Special Program for Employment of Students (SPES)", [PESO],
    "employment-livelihood", "Employment & Livelihood",
    "Facilitation of the DOLE Special Program for Employment of Students.",
    steps=["Initial interview by PESO Manager.", "Final interview by DOLE."],
    requirements=PESO_REQS,
    quickInfo={"processingTime": "10 minutes", "fee": "None",
               "whoCanApply": "Students and out-of-school youth"},
    sources=PESO_SRC)

add("Career and Employment Advocacy – Labor Education for Graduating Students (LEGS)", [PESO],
    "employment-livelihood", "Employment & Livelihood",
    "Career and employment advocacy programs and labor education for graduating high school and college students.",
    steps=["Coordination with national high school and college institutions."],
    requirements=PESO_REQS,
    quickInfo={"processingTime": "4 hours", "fee": "None",
               "whoCanApply": "Graduating students from national high schools and colleges"},
    sources=PESO_SRC)

add("Livelihood Activity", [PESO],
    "employment-livelihood", "Employment & Livelihood",
    "Facilitation of livelihood activities and training programs for organizations in coordination with DOLE.",
    steps=["Submit request letter of an organization.", "Interview the officers of an organization.",
           "Review and revise the livelihood proposal.", "Email to DOLE the proposal for implementation/monitoring."],
    requirements=PESO_REQS,
    quickInfo={"processingTime": "35 minutes (initial processing)", "fee": "None",
               "whoCanApply": "Organized groups and associations"},
    sources=PESO_SRC)

add("OFW Help Desk", [PESO],
    "employment-livelihood", "Employment & Livelihood",
    "Assistance and repatriation services for Overseas Filipino Workers (OFWs) and their families.",
    steps=["Interview relative of OFW.", "Photocopy all papers of OFW.",
           "Make a written request for absent OFW repatriation.", "Email to OWWA the written request.",
           "Follow up after 2 days to OWWA."],
    requirements=PESO_REQS,
    quickInfo={"processingTime": "~30 minutes", "fee": "None",
               "whoCanApply": "OFWs and their families"},
    sources=PESO_SRC)

# ── TAYTAY SPORTS DEVELOPMENT OFFICE ─────────────────────────────────────────
TSDO = "taytay-sports-development-office"
TSDO_SRC = [{"name": "Citizens Charter – Municipal Government of Taytay, Rizal (2025 1st Edition)", "url": None}]

add("Provision of Sports Supplies, Medals and Trophies", [TSDO],
    "sports-recreation", "Sports & Recreation",
    "Provision of sports equipment, medals, and trophies for sporting activities upon request.",
    steps=["Submit Letter Request via email and/or hard copy."],
    requirements=[],
    quickInfo={"processingTime": "2 minutes (initial processing)", "fee": "None",
               "whoCanApply": "All citizens (public)"},
    sources=TSDO_SRC)

add("Provision of Vehicle Service for Athletes and Sports Clubs", [TSDO],
    "sports-recreation", "Sports & Recreation",
    "Provision of vehicle service for athletes and sports clubs upon request.",
    steps=["Submit Letter Request via email and/or hard copy."],
    requirements=[],
    quickInfo={"processingTime": "2 minutes (initial processing)", "fee": "None",
               "whoCanApply": "All citizens (public)"},
    sources=TSDO_SRC)

add("Provision of Medical Certificate for Athletes", [TSDO],
    "sports-recreation", "Sports & Recreation",
    "Facilitation of medical certificate for athletes through the Health Office.",
    steps=["Submit Letter Request via email and/or hard copy."],
    requirements=[],
    quickInfo={"processingTime": "2 minutes (initial processing)", "fee": "None",
               "whoCanApply": "All citizens (public)"},
    sources=TSDO_SRC)

add("Request for Facilities and Sound System for Sports Events", [TSDO],
    "sports-recreation", "Sports & Recreation",
    "Request for use of sports facilities and sound system for various sports events.",
    steps=["Submit Letter Request via email and/or hard copy."],
    requirements=[],
    quickInfo={"processingTime": "2 minutes (initial processing)", "fee": "None",
               "whoCanApply": "All citizens (public)"},
    sources=TSDO_SRC)

# ── TOURISM OFFICE ────────────────────────────────────────────────────────────
TOUR = "tourism-office"
TOUR_SRC = [{"name": "Citizens Charter – Municipal Government of Taytay, Rizal (2025 1st Edition)", "url": None}]

add("Clearance for Tourism Related-Businesses", [TOUR],
    "tourism", "Tourism",
    "Issuance of Tourism Compliance Clearance for tourism-related businesses and tour guides as required by Municipal Ordinance No. 804 series of 2024.",
    steps=["Fill up the Tourism Application Form and submit with complete requirements.",
           "Wait for processing and release of Tourism Compliance Clearance.",
           "Claim Tourism Compliance Clearance."],
    requirements=["For New Applicant: Business Permit Application Form, DTI/SEC Registration, Barangay Clearance, Tax bill and Official Receipt for the current year, DOT Accreditation or proof of on-going application.",
                  "For Tour Guide: NBI or Police Clearance, Certificate of Tour Guiding Seminar or DOT Accreditation, Official Receipt for current year.",
                  "For Renewal of Business Permit: Copy of Business Permit Application, DOT Accreditation or proof of on-going application, Data on tourist arrivals.",
                  "For Renewal of Tour Guide: NBI or Police Clearance, Official Receipt for current year, Certificate of Tour Guiding Seminar or DOT Accreditation."],
    quickInfo={"processingTime": "~30 minutes", "fee": "None",
               "whoCanApply": "Tourism establishment owners/operators and tour guides"},
    sources=TOUR_SRC)

add("Implementation of Tourism Programs, Activities and Projects", [TOUR],
    "tourism", "Tourism",
    "Implementation and coordination of tourism, historical, cultural, and arts programs, activities, and projects.",
    steps=["Forward/email the communication or request to the receiving desk or tourism email.",
           "Wait for action on the request.",
           "The Chief Tourism Officer evaluates and refers the matter.",
           "Attend queries or coordination meetings.",
           "The Chief Tourism Officer acts on the recommendation.",
           "Wait for coordination/feedback.",
           "Participate in preparation of event/activity/projects.",
           "Participate/implement the event.",
           "Post-event tasks."],
    requirements=["Communication/Letter from concerned party (1 original copy/e-copy)."],
    quickInfo={"processingTime": "~70 days 2 minutes (depends on type and magnitude)", "fee": "None",
               "whoCanApply": "Government agencies, NGOs, civic organizations, and the general public"},
    sources=TOUR_SRC)

# ── TREASURY OFFICE ──────────────────────────────────────────────────────────
TREAS = "treasury-office"
TREAS_SRC = [{"name": "Citizens Charter – Municipal Government of Taytay, Rizal (2025 1st Edition)", "url": None}]

add("Payment of Occupation Permit and Garbage Fee", [TREAS],
    "treasury-finance", "Treasury & Finance",
    "Payment of occupation permit, garbage fee, police clearance, and UPAO certification at the Treasury Office.",
    steps=["Proceed to Window 1.", "Present requirement.", "Pay fees."],
    requirements=["Occupational Form.", "CEDULA.", "RPT Official Receipt (House/Bldg.) for garbage fee.",
                  "Tax Order of Payment.", "Traffic Violation Receipt (if applicable)."],
    quickInfo={"processingTime": "3–5 minutes", "fee": "Occupational Permit: Php 100 (Local) / Php 200 (Abroad); Garbage Fee: Php 100; Police Clearance: per violation; UPAO Cert: Php 50.00",
               "whoCanApply": "All job seekers and taxpayers"},
    sources=TREAS_SRC)

add("Assessment and Payment of Real Property Tax", [TREAS],
    "treasury-finance", "Treasury & Finance",
    "Assessment and payment of Real Property Tax (Basic and Special Education Fund) at the Treasury Office.",
    steps=["Proceed to Windows 2–5.", "Submit requirements.", "Pay Real Property Tax."],
    requirements=["Latest Tax Declaration.", "Latest Payment – Official Receipts."],
    quickInfo={"processingTime": "2–25 minutes (depending on complexity)", "fee": "Basic: 1% of assessed value; SEF: 1% of assessed value; 20% discount for advance payment; 10% for prompt payment; 2% interest per month for late payment",
               "whoCanApply": "All real property taxpayers"},
    sources=TREAS_SRC)

add("Securing Tax Clearances", [TREAS],
    "treasury-finance", "Treasury & Finance",
    "Issuance of Tax Clearance Certificate for real property.",
    steps=["Proceed to Windows 2–5.", "Preparation of tax clearance.", "For review and signature; pay at Windows 8–9."],
    requirements=["Latest tax declaration.", "Official Receipts for current paid taxes."],
    quickInfo={"processingTime": "~7 minutes", "fee": "Php 115.00",
               "whoCanApply": "All real property taxpayers"},
    sources=TREAS_SRC)

add("Securing Certification and Other Correspondences (Treasury)", [TREAS],
    "treasury-finance", "Treasury & Finance",
    "Issuance of certifications and other correspondences from the Treasury Office.",
    steps=["Proceed to Windows 2–5.", "Write draft, encode, check, and sign.", "Pay at Windows 8–9."],
    requirements=["Latest tax declaration.", "Official Receipts for current paid taxes."],
    quickInfo={"processingTime": "~8 minutes", "fee": "Php 115.00",
               "whoCanApply": "All real property taxpayers"},
    sources=TREAS_SRC)

add("Securing Certified Photocopy of Tax Declaration 1945-1974 and Related Documents", [TREAS],
    "treasury-finance", "Treasury & Finance",
    "Issuance of certified photocopies of Tax Declarations from 1945–1974, official receipts, and other documents.",
    steps=["Proceed to Window 2–5.", "For review, verification, and approval.", "Pay at Window 8–9."],
    requirements=["Tax Declaration.", "Official Receipts.", "Name of registered owner."],
    quickInfo={"processingTime": "2–5 minutes", "fee": "Php 115.00",
               "whoCanApply": "All real property taxpayers"},
    sources=TREAS_SRC)

add("Payment of Bidding Documents, Accreditation Fees, and Cash Performance Bond", [TREAS],
    "treasury-finance", "Treasury & Finance",
    "Acceptance of payment for bidding documents, accreditation fees, and cash performance bond.",
    steps=["Proceed to Window 5.", "Submit order of payment from BAC Secretariat."],
    requirements=["Order of Payment from BAC Secretariat."],
    quickInfo={"processingTime": "3–5 minutes", "fee": "As per BAC's Order of Payment",
               "whoCanApply": "All bidders"},
    sources=TREAS_SRC)

add("Payment of Liquidation for Cash Advances", [TREAS],
    "treasury-finance", "Treasury & Finance",
    "Acceptance of liquidation for cash advances from disbursing officers.",
    steps=["Proceed to Window 5.", "Submit requirements."],
    requirements=["Nature of cash advances.", "Voucher (General Fund, SEF, or Trust Fund).", "Name of official/employee."],
    quickInfo={"processingTime": "3–5 minutes", "fee": "As per liquidating officer",
               "whoCanApply": "All disbursing officers"},
    sources=TREAS_SRC)

add("Business Taxes and Licenses and Other Fees and Charges", [TREAS],
    "treasury-finance", "Treasury & Finance",
    "Payment of business taxes, licenses, and other fees and charges.",
    steps=["Proceed to Windows at BOSS (4th floor) for Business Tax payment.",
           "Proceed to Windows 8–9 for other fees and charges."],
    requirements=["Approved Tax Order of Payment from BPLO.", "Community Tax Certificate.",
                  "Traffic Violation Receipt (if applicable).", "Barangay Clearance."],
    quickInfo={"processingTime": "3–25 minutes (depending on complexity)", "fee": "As per BPLO Tax Order of Payment",
               "whoCanApply": "All business taxpayers and concerned citizens"},
    sources=TREAS_SRC)

add("Community Tax Certificate (Cedula) – Individual and Corporation", [TREAS],
    "treasury-finance", "Treasury & Finance",
    "Issuance of Community Tax Certificate (Cedula) for individuals and corporations.",
    steps=["Proceed to Windows 6 and 7.", "Submit personal information."],
    requirements=["Personal Information: Name, Address, Occupation, Birthday, Birthplace, TIN, Height, Weight, Status, Gross Income.",
                  "Name of Company/Business Establishment (for corporation)."],
    quickInfo={"processingTime": "3–5 minutes",
               "fee": "Individual: Php 5.00 basic + additional based on income (up to Php 5,000); Corporation: Php 500.00 basic + additional based on assets/income (up to Php 10,000)",
               "whoCanApply": "All taxpayers", "validity": "Current year (January–December)"},
    sources=TREAS_SRC)

add("Salaries, Wages, Financial Assistances, Honoraria, and Related Payments", [TREAS],
    "treasury-finance", "Treasury & Finance",
    "Payment of salaries, wages, financial assistance, honoraria, and similar amounts to municipal employees and qualified persons.",
    steps=["Proceed to Window 10.", "Submit requirements."],
    requirements=["Approved Daily Time Record and Accomplishment Report.",
                  "For Financial Assistance (PCSO): Approved Petty Cash Voucher from MSWD.",
                  "Valid ID.",
                  "Authorization letter and valid IDs (if representative)."],
    quickInfo={"processingTime": "2–3 minutes per transaction", "fee": "None",
               "whoCanApply": "All concerned employees and persons"},
    sources=TREAS_SRC)

add("Check Payments and Disbursement", [TREAS],
    "treasury-finance", "Treasury & Finance",
    "Releasing of check payments for expenses, liabilities, cash advances, and other obligations.",
    steps=["Proceed to Window 11.", "Submit requirements."],
    requirements=["Valid ID.", "Authorization letter and valid IDs (if representative).", "Official receipt."],
    quickInfo={"processingTime": "3–5 minutes (single transaction)", "fee": "As per Disbursement Voucher",
               "whoCanApply": "All concerned persons"},
    sources=TREAS_SRC)

add("Hospital and Medical Fees", [TREAS],
    "treasury-finance", "Treasury & Finance",
    "Payment of hospital bills and medical fees at the June V. Zapanta Emergency Hospital.",
    steps=["Proceed to Cashier's Office at Taytay Emergency Hospital.", "Submit requirements."],
    requirements=["Patient's card with breakdown of different fees.", "Doctor's request."],
    quickInfo={"processingTime": "3–5 minutes", "fee": "As per patient's bill",
               "whoCanApply": "All concerned patients"},
    sources=TREAS_SRC)

add("Market Stall Fees, Rental of Light and Water", [TREAS],
    "treasury-finance", "Treasury & Finance",
    "Collection of market stall fees, rental of light and water, and delivery truck fees at the New Taytay Public Market.",
    steps=["Proceed to Collector's Office – New Taytay Public Market.", "Submit requirements or ask for order of payment."],
    requirements=["Latest official receipts.", "Name of market stall holders."],
    quickInfo={"processingTime": "1–3 minutes", "fee": "Market Stall Fees based on size; Electricity and water based on consumption; Trucking: Php 100.00 minimum; Van: Php 50–60 minimum",
               "whoCanApply": "All market stall owners/vendors and delivery truck operators"},
    sources=TREAS_SRC)

# ── URBAN POOR AFFAIRS OFFICE ─────────────────────────────────────────────────
UPAO = "urban-poor-affairs-office"
UPAO_SRC = [{"name": "Citizens Charter – Municipal Government of Taytay, Rizal (2025 1st Edition)", "url": None}]

add("Issuance of UPAO Certificate for Residents", [UPAO],
    "housing-urban-poor", "Housing & Urban Poor",
    "Issuance of UPAO Certificate required by MERALCO and Manila Water for residents living on government-owned land.",
    steps=["Submit a copy of picture of your front house.",
           "Compliance inspection by C.I. team (Tuesday–Friday).",
           "Provide all required documents.",
           "Proceed to Treasury Office for payment.",
           "Sign the affidavit of undertaking and have it notarized.",
           "Receive UPAO Certificate."],
    requirements=["Yellow Card (Meralco) / Application Form (Manila Water).",
                  "Cedula.",
                  "Barangay Clearance.",
                  "Photocopy of 3 valid IDs with signature.",
                  "HOA Certification."],
    quickInfo={"processingTime": "1–3 working days", "fee": "Php 115.00 + Notary: Php 150–200",
               "whoCanApply": "Occupants in government-owned lots"},
    sources=UPAO_SRC)

add("Issuance of UPAO Certification for HOA Purposes", [UPAO],
    "housing-urban-poor", "Housing & Urban Poor",
    "Issuance of UPAO Certification certifying the legitimacy of a Home Owners Association (HOA).",
    steps=["Submit letter of request and the required documents.",
           "Verification and ocular inspection of the area.",
           "Proceed to Treasury Office for payment.",
           "Receive printed and signed UPAO Certification."],
    requirements=["Letter of Request.",
                  "HOA Profile submitted to UPAO.",
                  "DHSUD Registration/SEC Registration (Optional).",
                  "List of Officers.",
                  "List of Members.",
                  "By Laws and Resolution of HOA."],
    quickInfo={"processingTime": "1–2 working days", "fee": "Php 115.00",
               "whoCanApply": "Home Owners Associations"},
    sources=UPAO_SRC)

# ── BUSINESS PERMIT AND LICENSING OFFICE ─────────────────────────────────────
BPLO = "business-permit-and-licensing-office"
BPLO_SRC = [{"name": "Citizens Charter – Municipal Government of Taytay, Rizal (2025 1st Edition)", "url": None}]

add("Issuance of New Business or Mayor's Permit", [BPLO],
    "business-permits-licensing", "Business Permits & Licensing",
    "Issuance of new business or mayor's permit for businesses operating in Taytay, Rizal.",
    steps=["Submit application with complete requirements at BPLO.", "Processing of permit.", "Receive Business/Mayor's Permit."],
    requirements=["Business Permit Application Form.", "DTI/SEC Registration.", "Barangay Clearance.",
                  "Tax Order of Payment.", "Other applicable documentary requirements."],
    quickInfo={"processingTime": "As listed in the Charter", "fee": "As per BPLO schedule",
               "whoCanApply": "New businesses operating in Taytay, Rizal"},
    sources=BPLO_SRC)

add("Renewal of Business or Mayor's Permit", [BPLO],
    "business-permits-licensing", "Business Permits & Licensing",
    "Renewal of existing business or mayor's permit for businesses in Taytay, Rizal.",
    steps=["Submit renewal application with complete requirements at BPLO.", "Processing of renewal.", "Receive renewed Business/Mayor's Permit."],
    requirements=["Copy of previous Business Permit.", "Barangay Clearance.", "Tax Order of Payment.",
                  "Other applicable documentary requirements."],
    quickInfo={"processingTime": "As listed in the Charter", "fee": "As per BPLO schedule",
               "whoCanApply": "Existing businesses operating in Taytay, Rizal"},
    sources=BPLO_SRC)

add("Issuance of New Business or Mayor's Permit (Online)", [BPLO],
    "business-permits-licensing", "Business Permits & Licensing",
    "Online issuance of a new business or mayor's permit for businesses in Taytay, Rizal.",
    steps=["Submit online application with complete requirements.", "Processing of online permit.", "Receive Business/Mayor's Permit digitally or via courier."],
    requirements=["Business Permit Application Form (online).", "DTI/SEC Registration.", "Barangay Clearance.",
                  "Other applicable online documentary requirements."],
    quickInfo={"processingTime": "As listed in the Charter", "fee": "As per BPLO schedule",
               "whoCanApply": "New businesses operating in Taytay, Rizal",
               "appointmentType": "Online"},
    sources=BPLO_SRC)

add("Renewal of Business or Mayor's Permit (Online)", [BPLO],
    "business-permits-licensing", "Business Permits & Licensing",
    "Online renewal of business or mayor's permit for businesses in Taytay, Rizal.",
    steps=["Submit online renewal application with complete requirements.", "Processing of online renewal.", "Receive renewed Business/Mayor's Permit digitally or via courier."],
    requirements=["Copy of previous Business Permit.", "Barangay Clearance.", "Tax Order of Payment.",
                  "Other applicable online documentary requirements."],
    quickInfo={"processingTime": "As listed in the Charter", "fee": "As per BPLO schedule",
               "whoCanApply": "Existing businesses operating in Taytay, Rizal",
               "appointmentType": "Online"},
    sources=BPLO_SRC)


# ── OUTPUT ──
with open("src/data/services/generated_services.json", "w", encoding="utf-8") as f:
    json.dump(services, f, indent=2, ensure_ascii=False)

with open("src/data/services/generated_service_categories.json", "w", encoding="utf-8") as f:
    json.dump(categories, f, indent=2, ensure_ascii=False)

print(f"services.json: {len(services)} services written.")
print(f"service_categories.json: {len(categories['categories'])} categories written.")

# Check for duplicate slugs
slugs = [s['slug'] for s in services]
from collections import Counter
dups = {k:v for k,v in Counter(slugs).items() if v>1}
if dups:
    print(" Duplicate slugs:", dups)
else:
    print("No duplicate slugs.")