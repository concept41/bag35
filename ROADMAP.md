# Roadmap
## In Progress
- [ ] determine graph schema
  - [ ] what do we already have?
  - [ ] what do we want to add?
  - [ ] what questions can we answer from this schema?
  - [ ] can we connect this to other government or publicly available data?

 
## TODOs
- [ ] ingest connections between holdings, filers, and securities
- [ ] find a low-hanging use case to complete features for
- [ ] write `getMatchedCIK` like `getMatchedCUSIP`
- [ ] write a function that lists all metrics as a dashboard
- [ ] implement `combineQuarterly` or equivalent
- [ ] write a function that ingests into neo4j in order

## Backlog
- [ ] Get stock data once
- [ ] Get input component
- [ ] Make a way to request stock data for different tickers
- [ ] Make a way to request stock data at different time scales
- [ ] Determine what else to graph
- [ ] Add VIX FIX
- [ ] Determine Indicators to add
- [ ] look into scraping official list of 13(f) securities [here](https://www.sec.gov/divisions/investment/13flists)
- [ ] host our typedocs

## Completed (after 11/27/23)
- [x] ingest scraped data into neo4j
- [x] install neo4j
- [x] determine if neo4j ingestion is idempotent
- [x] determine differences between submission types
