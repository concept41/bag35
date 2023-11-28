# BAG35 CLI
repo for all things related to BAG35

## Design
### Quarterly 13F Data
At a high level, the general process for gathering and processing 13F data is as follows:
```mermaid
graph TD
  1(data is manually downloaded from the SEC into /downloads)
  2(quarterly data is scraped into processed files in /scraped)
  3(CIKs and CUSIPs are identified and written into respective files in /scraped)
  4(data is ingested into neo4j using the files in /scraped)
```

scraping is synchonous, extracting from downloaded data
identification is asynchronous, using external sources to query for data— however it is idempotent
ingestion is [using merge but is it idempotent? test this]

