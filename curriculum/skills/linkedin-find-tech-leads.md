# Skill: LinkedIn Find Tech Leads (Brazil)

Finds Tech Leads in Brazil on LinkedIn using `/browser` so you can connect, network, or reach out.

## Prerequisites
- Chrome running in WSL2/Linux (`google-chrome &`) with remote debugging enabled (`chrome://inspect/#remote-debugging`) and an active LinkedIn session.

## Step-by-Step Workflow

1. **Search Tech Leads in Brazil**
   - Use `/browser` to open LinkedIn People search for `"Tech Lead"` in Brazil:
     `https://www.linkedin.com/search/results/people/?keywords=Tech%20Lead&geoUrn=%5B%22106057199%22%5D`
   - Extract and return a structured list of the visible profiles (Name, Title/Headline, Company, Location, and Profile URL).
   - Do **not** send connection requests or messages unless explicitly instructed.
