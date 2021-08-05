# Kord: PoC
This repository contains the Proof Of Concept of Kord as developed for "The Next Top Blockchain Startup" (NBS) hackathon.

------

## How to use this repo

The repo contains 3 folders:

- `browser-ng` - This folder contains the frontend developed using Angular that interacts with our smart contract.
- `contract` - This folder contains the smart contract developed for the NEAR protocol using assemblyscript.
- `trials` - This folder contains trials & tests that were conducted before developing the system and may be broken. Kept for reference.

### To deploy the contract:

1. Navigate to the `contract` directory.
2. Run the command `npm i` to install the dependencies.
3. Run the command `npm run build` to compile the contract in wasm
4. Run the command `npm run dev:deploy:contract` to deploy the contract on the testnet.

### To run the frontend:

1. Navigate to the `browser-ng` directory.
2. Run the command `npm i` to install the dependencies.
3. In the `browser-ng/src/environments/environment.ts` add the contract address as generated after deploying the contract.
4. Run the command `ng server` to start and host the frontend locally.

### Demo Link:

https://drive.google.com/file/d/123RKPWFLMHQluAEc8AweRl-KHnRojWnl/view?usp=sharing

------

## Contributors:

Manas Oswal

