# Environment Variable Setup

## Local Development

The API base URL is configured using environment variables. For local development:

1. The `.env` file is already created with the default value:
   ```
   VITE_API_BASE_URL=http://localhost:8000
   ```

2. To change it, edit the `.env` file in the project root.

3. Restart your dev server after changing environment variables.

## Netlify Deployment

To add the environment variable to Netlify:

### Method 1: Via Netlify Dashboard (Recommended)

1. Go to your Netlify dashboard: https://app.netlify.com
2. Select your site
3. Go to **Site settings** → **Environment variables** (or **Build & deploy** → **Environment**)
4. Click **Add a variable** or **Add environment variable**
5. Add the following:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend-api-url.com` (replace with your production API URL)
   - **Scopes**: Select "All scopes" or customize as needed
6. Click **Create variable** or **Save**
7. Redeploy your site for the changes to take effect

### Method 2: Via netlify.toml

Add this to your `netlify.toml` file:

```toml
[build.environment]
  VITE_API_BASE_URL = "https://your-backend-api-url.com"
```

**Note**: This method exposes the URL in your repository. Use Method 1 for sensitive values.

### Method 3: Via Netlify CLI

```bash
netlify env:set VITE_API_BASE_URL "https://your-backend-api-url.com"
```

## Important Notes

- **Vite Prefix**: All environment variables in Vite must be prefixed with `VITE_` to be exposed to your client-side code
- **Rebuild Required**: After adding/changing environment variables in Netlify, trigger a new deployment
- **Client-Side Exposure**: These variables are exposed to the browser, so don't put secrets here
- The `.env` file is gitignored and won't be committed to your repository

## Verification

To verify the environment variable is working:

1. In your browser console, run:
   ```javascript
   console.log(import.meta.env.VITE_API_BASE_URL)
   ```

2. You should see your configured API URL
