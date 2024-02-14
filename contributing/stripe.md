# Testing Stripe integration

Clone the project and add the env variables to the `.env` file. Use the `.env.example` as a template.

```bash
cp .env.example .env
```

## Install the dependencies

```bash
npm install
```

If you don't have the `stripe` CLI installed, you can install it with the following command:

```bash
brew install stripe/stripe-cli/stripe
```

## Run the server

```bash
npm run dev
```

## Test the Stripe integration

1. Open the browser, create an account, go to the Account settings page.

Make sure you're running the stripe webhook forwarding service.

```bash
stripe listen --forward-to localhost:3000/api/webhooks
```
