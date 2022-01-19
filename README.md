# Vexchange Frontend

[![Netlify Status](https://api.netlify.com/api/v1/badges/0cdf2f88-ae39-4bbd-9ce5-1052fb348835/deploy-status)](https://app.netlify.com/sites/zen-curie-18ebca/deploys)

An open source interface for Vexchange -- a protocol for decentralized exchange of Ethereum tokens.

- Website: [vexchange.io](https://vexchange.io/)
- Docs: [docs.vexchange.io](https://docs.vexchange.io)
- Twitter: [@VexchangeIO](https://twitter.com/VexchangeIO)
- Discord: [Vexchange](https://discord.gg/nuHJRyS5mY)

# Development

## Running the interface locally

1. `yarn install`
1. `yarn start`

## Creating a production build

1. `yarn install`
1. `yarn build`

## Engineering standards

Code merged into the `main` branch of this repository should adhere to high standards of correctness and maintainability. 
Use your best judgment when applying these standards.  If code is in the critical path, will be frequently visited, or 
makes large architectural changes, consider following all the standards.

- Have at least one engineer approve of large code refactorings
- At least manually test small code changes, prefer automated tests
- Thoroughly unit test when code is not obviously correct
- If something breaks, add automated tests so it doesn't break again
- Add integration tests for new pages or flows
- Verify that all CI checks pass before merging
- Have at least one product manager or designer approve of significant UX changes

## Guidelines

The following points should help guide your development:

- Security: the interface is safe to use
  - Avoid adding unnecessary dependencies due to [supply chain risk](https://github.com/LavaMoat/lavamoat#further-reading-on-software-supplychain-security)
- Reproducibility: anyone can build the interface
  - Avoid adding steps to the development/build processes
  - The build must be deterministic, i.e. a particular commit hash always produces the same build
- Decentralization: anyone can run the interface
  - An Ethereum node should be the only critical dependency 
  - All other external dependencies should only enhance the UX ([graceful degradation](https://developer.mozilla.org/en-US/docs/Glossary/Graceful_degradation))
- Accessibility: anyone can use the interface
  - The interface should be responsive, small and run well on low performance devices (majority of swaps on mobile!)

## Release process

Releases are cut automatically from the `main` branch.

Fix pull requests should be merged whenever ready and tested. 

Features should not be merged into `main` until they are ready for users.
When building larger features or collaborating with other developers, create a new branch from `main` to track its development.
Use the automatic Vercel preview for sharing the feature to collect feedback.  
When the feature is ready for review, create a new pull request from the feature branch into `main` and request reviews from 
the appropriate UX reviewers (PMs or designers).


## Contributions

**Please open all pull requests against the `dev` branch.** 
CI checks will run against all PRs. 
