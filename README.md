# **Suinder — Decentralized Swipe-Based Job Matching on Sui**
<img width="980" height="980" alt="suinderlogo" src="https://github.com/user-attachments/assets/0dfb714c-cda0-4d80-831e-6a0da0636f5f" />
https://suinderr.netlify.app/
Suinder is a fully on-chain, swipe-based job-matching platform built on the Sui blockchain.  
Employers can publish job postings as on-chain objects, candidates can submit applications directly on-chain, and hiring decisions are performed through a trustless, verifiable contract call.  
The frontend provides a fast, mobile-friendly UI inspired by modern swipe apps.
built by Umut Barış Büyükyiğit, Doruk Akabay, Ömer Özkan
---

## **Overview**

Suinder reimagines hiring by combining:

- A clean Move contract architecture  
- Shared objects for global job discovery  
- Capability-based access control  
- On-chain job postings and applications  
- A React + TypeScript frontend using the Sui Wallet Adapter  
- A swipe-based matching UX for both candidates and employers  

Every job posting, application, and hiring action lives entirely on-chain, creating a transparent and verifiable recruitment flow.

---

## **Smart Contract Architecture**

### **JobBoard (Shared Object)**  
A globally shared registry that stores references to all job postings.  
This allows any user to read the complete list of on-chain jobs.

### **Job Object**  
Represents a single job posting.  
Includes employer address, title, company, location, optional salary, description, status, and an optional hired candidate.

### **EmployerCap (Capability)**  
A capability object that authorizes an employer to post a job or hire a candidate.  
Only the owner of this capability can perform privileged actions.

### **Application Object**  
Created whenever a candidate applies to a job.  
Includes job reference, candidate address, and a short cover message.

### **Events**  
All key actions emit events, enabling real-time indexing and analytics:

- `JobPosted`  
- `ApplicationSubmitted`  
- `CandidateHired`

---

## **Core On-Chain Flow**

### **Posting a Job**  
An employer uses their `EmployerCap` to register a new job on-chain.  
The job is added to the global `JobBoard`.

### **Applying to a Job**  
Any user can submit an on-chain application that includes a short message.

### **Hiring a Candidate**  
Only the owner of the corresponding `EmployerCap` can hire.  
The job is closed, and the hired candidate is recorded immutably on-chain.

---

## **Frontend**

The frontend is built with React + TypeScript and integrates:

- Sui Wallet Adapter for account management  
- Sui TypeScript SDK for all on-chain interactions  
- A swipe-based user interface allowing users to browse jobs or candidates  
- Pages for:
  - All open jobs  
  - Job detail and applications  
  - My Jobs (employer view)  
  - My Applications (candidate view)

Deployed publicly using a modern hosting service such as Vercel, Netlify, or Walrus.

---

## **Testing**

### **Move Tests**  
The contract includes test coverage for:

- Job posting  
- Application submission  
- Hiring logic  
- Access-control enforcement  
- Event emission

### **Integration Tests (Jest)**  
End-to-end TypeScript tests validate:

- Wallet connection  
- Posting a job  
- Applying to a job  
- Hiring a candidate  
- Fetching and displaying on-chain data

---

## **Tech Stack**

### **Blockchain / Smart Contracts**
- Sui Move  
- Shared Objects  
- Capability Pattern  
- Events  
- On-chain Job & Application Objects  
- Vector and Option types  

### **Frontend**
- React  
- TypeScript  
- Sui Wallet Adapter  
- Sui TypeScript SDK  

### **Testing**
- Move unit tests  
- Jest integration tests  

### **Deployment**
- Deployed on a modern hosting platform  
- Fully accessible public UI  

---

## **Future Improvements**

- Skill-based matching algorithms  
- Employer reputation scoring  
- Candidate profiles with verifiable credentials  
- On-chain timestamps using `Clock`  
- Dynamic fields for scalable application storage  
- Upgradeable contract structure  
