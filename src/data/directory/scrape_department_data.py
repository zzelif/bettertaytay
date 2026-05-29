import json
import re
from playwright.sync_api import sync_playwright

TARGET_URL = "https://www.taytayrizal.gov.ph/lgu-directory"
OUTPUT_JSON = "src/data/directory/generated_departments.json"

# Helper function to generate a clean slug from the office name
def create_slug(text: str) -> str:
    if not text:
        return "unknown"
    text = text.lower().strip()
    text = text.replace('&', 'and')
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text).strip('-')
    return text

# Helper function to parse slash or comma separated strings into a list
def parse_to_list(val: str):
    if not val or str(val).strip().lower() in ['n/a', 'none']:
        return [None]
    items = [item.strip() for item in re.split(r'[/,]', val) if item.strip()]
    return items if items else [None]

def scrape_departments_only(url: str, output_file: str):
    with sync_playwright() as p:
        print("Launching browser in visible mode...")
        browser = p.chromium.launch(headless=True) 
        page = browser.new_page()
        
        print(f"Navigating to {url}...")
        page.goto(url, timeout=60000)

        # 1. Scroll down the page naturally to trigger lazy-loading
        print("Scrolling the page to wake up the tables...")
        for _ in range(8):
            page.mouse.wheel(0, 800)
            page.wait_for_timeout(1000)
            
        print("Waiting a moment for data to settle...")
        page.wait_for_timeout(5000)

        # 2. Find the container logically based on DOM hierarchy
        print("Locating the 'Municipal Directory For Departments' section...")
        
        # Find the deepest <div> that contains BOTH the specific heading AND an iframe.
        # .last gives us the most specific (deepest) shared container in the DOM tree.
        container = page.locator('div').filter(
            has=page.locator('text=/municipal directory for departments/i')
        ).filter(
            has=page.locator('iframe[src*="wix-visual-data.appspot.com"]')
        ).last

        try:
            container.wait_for(state="attached", timeout=15000)
            print("Target container identified successfully.")
        except Exception:
            print("Could not find the section containing the heading and table. Exiting.")
            browser.close()
            return

        # 3. Access the iframe exclusively within this specific container
        frame = container.frame_locator('iframe[src*="wix-visual-data.appspot.com"]').first
        
        # 4. Scrape the targeted Table
        print("Waiting for the target table to load its content...")
        try:
            frame.locator('table').first.wait_for(state="attached", timeout=15000)
        except Exception:
            print("Timeout waiting for target table to load. Exiting...")
            browser.close()
            return
        
        page.wait_for_timeout(2000)

        row_elements = frame.locator('table tbody tr').all()
        print(f"Found {len(row_elements)} rows. Extracting...")
        
        scraped_data = []
        
        slug_registry = {}
        removed_duplicates = []

        for row in row_elements:
            cols = row.locator('td').all()
            if not cols:
                continue
                
            row_data = [col.inner_text().strip().replace('\n', ' ') for col in cols]
            
            # Skip rows that are completely empty
            if all(val == "" for val in row_data):
                continue

            col_count = len(row_data)
            office_val = row_data[0] if col_count > 0 else ""
            
            if not office_val or office_val.lower() in ['office', 'department']:
                continue
            
            base_slug = create_slug(office_val)
            final_slug = base_slug
            
            if base_slug in slug_registry:
                removed_duplicates.append({
                    "office_name": office_val,
                    "slug": base_slug,
                    "kept_version": slug_registry[base_slug]
                })
                continue # Skips appending to scraped_data and jumps to the next row

            # Register the unique slug
            slug_registry[base_slug] = office_val

            # Initialize the record with the strict JSON schema
            record = {
                "slug": base_slug,
                "office_name": office_val.upper(),
                "address": None,
                "trunkline": [None],
                "website": None,
                "email": [None],
                "department_head": {
                    "name": None,
                    "contact": None,
                    "email": None
                }
            }
            
            # We expect >= 5 columns for the Departments table
            if col_count >= 5:
                head_val = row_data[1]
                record["department_head"]["name"] = head_val if head_val else None
                
                # Parse contacts and emails into clean lists
                record["trunkline"] = parse_to_list(row_data[3])
                record["email"] = parse_to_list(row_data[4])
                
                # If there's a 6th column, map it to address (Floor/Location)
                if col_count >= 6:
                    floor_val = row_data[5]
                    record["address"] = floor_val if floor_val else None
                    
            scraped_data.append(record)
            
        print("\n" + "="*60)
        print("DUPLICATION REPORT")
        print("="*60)
        if removed_duplicates:
            print(f"Found and removed {len(removed_duplicates)} duplicate entries:\n")
            for idx, item in enumerate(removed_duplicates, 1):
                print(f"{idx}.REMOVED: '{item['office_name']}'")
                print(f"Shared Slug: {item['slug']}")
                print(f"KEPT ORIGINAL: '{item['kept_version']}'")
                print("-" * 50)
        else:
            print("No duplicate rows or collisions detected.")
        print("="*60 + "\n")

        print(f"\nSaving a total of {len(scraped_data)} records to {output_file}...")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(scraped_data, f, indent=2, ensure_ascii=False)

        browser.close()
        print("Scraping complete!")

if __name__ == "__main__":
    scrape_departments_only(TARGET_URL, OUTPUT_JSON)