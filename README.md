# Automotive Configurator

A simple web application for an automotive company that lets a customer build and personalize a new car, submit a purchase inquiry, and stores the lead in a local SQLite database.

## Features
- Interactive car model selection
- Customization options for trim, paint, wheel package, interior, and add-ons
- Customer lead form with name, phone number, email, and preferred callback time
- Lead data saved to a SQLite database
- Dedicated `Latest Leads` page to display buyer information to the sales team
- Responsive landing page with automotive imagery

## Setup

```bash
npm install
npm start
```

Then open:

```text
http://localhost:3000
```

## Pages
- `/` — car customizer and lead form
- `/latest-leads` — sales team view of the latest leads
- `/success` — confirmation page after submission

## Notes
The app stores any submitted lead in `data/leads.db`.
