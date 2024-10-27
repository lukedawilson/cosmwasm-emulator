# cosmwasm-emulator

An online emulator for running CosmWasm smart contracts without having to upload them to TestNet or spin up a local chain.

Powered by [cw-simulate](https://github.com/Terran-One/cw-simulate) from [Terran One](https://github.com/Terran-One).

Click [here](https://emulator.cosmwasm.net/) to navigate to the site.

## Running locally

```bash
npm install
npm run dev
```

## Deploying

First, ensure you've set up your dev machine with the necessary prerequisites:

```bash
sudo vim ~/.aws/credentials # then update your AWS credentials with your IAM access key and secret
sudo apt install vite       # or whatever package manager you use
```

Then build and deploy the site:

```bash
npm run deploy
```
