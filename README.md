# SvelteKit/Supabase Stack Template

This is my template for a fullstack Sveltekit app that uses Supabase as the data layer.

## Getting Started

First You need to clone this repository:

```bash
git clone https://github.com/Stephen10121/sveltesasstemplate.git
```

Install dependencies:

```bash
npm i
```

Then you need to create a .env file in the root directory.

### NOTE. All these keys are required and the program wont run without them.

The env file should look like this:

```
# This is where you can add all the authorized origins for the frontend. For example, if you point "test.com" to this host, you need to add test.com to the authorized origins.
# Separate them with a comma.
ALLOWED_ORIGINS=localhost:5173,planningcenterdev.stephengruzin.dev,dev.stephengruzin.dev

# The supabase url, and service_role key can be found in the setting/ Data API config section in supabase.

# This is the project url.
SUPABASE_URL=supabase_project_url

# This is the service_role. This will only be used in the BACKEND.
SUPABASE_KEY=service_role_key

# This is what domain this project will be hosted on:
PROJECT_WEB_URL=https://www.examplesvelteproject.com
```

This project uses github for the oath, but you can use any other oath social provider.
To configure your github or any provider your using, use this page [Social Provider Getting Started](https://supabase.com/docs/guides/auth/social-login).
This page shows you how to configure the github oath settings and callback url.

After all that, your project can now be run. Use the dev command to start building whatever you want.

```bash
npm run dev
```