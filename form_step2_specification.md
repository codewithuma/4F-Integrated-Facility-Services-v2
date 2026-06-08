# Dynamic Quote Form: Step 2 Option Mapping Specification
**Proposed Solution: Option A (Unified Dynamic Checklist)**

This document outlines how **Step 2 (Facility Category)** will dynamically adapt depending on the services selected in **Step 1**. 

---

## 1. Dynamic Checklist Behavior (Option A)
When the user clicks **Continue** in Step 1:
1. The script will analyze which services were checked.
2. It will gather the unique sub-options associated with all selected services.
3. It will render these sub-options in Step 2 as responsive **card checkboxes** (like the Step 1 choices).
4. Duplicates across service categories (e.g., "Commercial Offices" or "SEZ") will be merged automatically to keep the interface clean and concise.

---

## 2. Service-to-Option Mapping

Here is the exact layout of options, titles, and descriptions that will appear in Step 2 based on the user's Step 1 selections:

### 🧯 Fire Safety Services
*(Triggers if any of **Fire Extinguishers**, **Fire AMC**, or **Fire NOC Consulting** are selected)*
* **Manufacturing Units**
  * *Description:* Factories, production lines, and industrial processing zones.
* **Special Economic Zone (SEZ)**
  * *Description:* High-compliance corporate enclaves and tech parks.
* **Pharma Companies**
  * *Description:* Cleanrooms, labs, and specialized pharmaceutical manufacturing.
* **All Type Companies**
  * *Description:* General corporate offices, retail outlets, and warehouses.

### 🧹 Housekeeping
*(Triggers if **House keeping** is selected)*
* **Residential Apartments & Villas**
  * *Description:* Societies, gated developments, and luxury estates.
* **Schools & Educational Institutions**
  * *Description:* Classrooms, campuses, libraries, and administrative blocks.
* **Hospitals & Healthcare Facilities**
  * *Description:* Clinics, nursing homes, and clinical environments.
* **Front Offices / Reception**
  * *Description:* Corporate lobbies, visitor areas, and front desks.
* **Shopping Malls & Retail**
  * *Description:* Outlets, public walkways, and food courts.

### ✨ Deep Cleaning
*(Triggers if **Deep Cleaning** is selected)*
* **Specialized Residential Houses**
  * *Description:* Post-construction, move-in/out, and premium villas.
* **Commercial Offices & Workspaces**
  * *Description:* Corporate floors, meeting rooms, and tech setups.

### 🛡️ Security Services
*(Triggers if **Security** is selected)*
* **Gated Communities**
  * *Description:* Residential associations, villas, and housing estates.
* **Commercial Offices & Workspaces**
  * *Description:* IT parks, business towers, and office entries.
* **Special Economic Zone (SEZ)**
  * *Description:* Strict access control zones and secure perimeters.
* **Shopping Malls & Retail**
  * *Description:* Crowd management, parking control, and loss prevention.
* **In-Person Security Guard**
  * *Description:* Trained security personnel and executive escorts.

### 🐜 Pest Control
*(Triggers if **Pest Control** is selected)*
* **Hostels & PG Accommodations**
  * *Description:* Student dorms, hostels, and shared housing environments.
* **Restaurants & Dining**
  * *Description:* Kitchens, dining areas, pantries, and food processing spaces.
* **Company Audits / Warehouses**
  * *Description:* Audit-ready pest compliance for logistics and storage.

### 🏢 Fully Integrated Services
*(Triggers if **Full Integrated Services** is selected)*
* **Gated Communities**
  * *Description:* All-in-one safety, housekeeping, and security.
* **Schools & Colleges**
  * *Description:* Integrated management for academic campuses.
* **Restaurants & Cafeterias**
  * *Description:* Comprehensive hygiene, pest, and cleaning care.
* **Hospitals & Medical Centers**
  * *Description:* Highly regulated healthcare facility operations.
* **Premium Gated Villas**
  * *Description:* High-end residential concierge, cleaning, and security.

---

## 3. Merging Behavior Example
If a user selects **Security** AND **Deep Cleaning** in Step 1, they will see a combined list of options in Step 2:
1. **Gated Communities** (from Security)
2. **Commercial Offices & Workspaces** (from both - Merged)
3. **Special Economic Zone (SEZ)** (from Security)
4. **Shopping Malls & Retail** (from Security)
5. **In-Person Security Guard** (from Security)
6. **Specialized Residential Houses** (from Deep Cleaning)

This prevents the same facility from appearing multiple times, ensuring a premium, user-friendly experience.

---

## 4. Sizing Slider Details
The "Estimated Service Area" slider will remain at the bottom of Step 2 to gather the square footage details, which are critical for calculating price estimates for all facility sizes.
