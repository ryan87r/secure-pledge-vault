# Vercel Deployment Guide for Secure Pledge Vault

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Ensure your code is pushed to GitHub
3. **Environment Variables**: Prepare the required environment variables

## Step-by-Step Deployment Instructions

### Step 1: Connect GitHub Repository to Vercel

1. **Login to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Sign Up" or "Login"
   - Choose "Continue with GitHub"

2. **Import Project**
   - Click "New Project" on the Vercel dashboard
   - Select "Import Git Repository"
   - Find and select `ryan87r/secure-pledge-vault`
   - Click "Import"

### Step 2: Configure Project Settings

1. **Project Configuration**
   - **Project Name**: `secure-pledge-vault`
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

2. **Environment Variables Configuration**
   Click "Environment Variables" and add the following:

   ```
   VITE_CHAIN_ID=11155111
   VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
   VITE_WALLET_CONNECT_PROJECT_ID=YOUR_WALLET_CONNECT_PROJECT_ID
   VITE_INFURA_API_KEY=YOUR_INFURA_API_KEY
   ```

   **Important**: 
   - Set all variables for "Production", "Preview", and "Development" environments
   - Click "Save" after adding each variable

### Step 3: Deploy the Application

1. **Initial Deployment**
   - Click "Deploy" button
   - Wait for the build process to complete (usually 2-5 minutes)
   - Vercel will automatically build and deploy your application

2. **Verify Deployment**
   - Once deployment is complete, you'll get a live URL
   - Example: `https://secure-pledge-vault-xxx.vercel.app`
   - Click the URL to test your application

### Step 4: Configure Custom Domain (Optional)

1. **Add Custom Domain**
   - Go to your project dashboard
   - Click "Settings" tab
   - Click "Domains" in the sidebar
   - Add your custom domain (e.g., `securepledgevault.com`)
   - Follow DNS configuration instructions

2. **SSL Certificate**
   - Vercel automatically provides SSL certificates
   - HTTPS will be enabled automatically

### Step 5: Configure Automatic Deployments

1. **Git Integration**
   - Vercel automatically deploys on every push to the main branch
   - Preview deployments are created for pull requests
   - No additional configuration needed

2. **Branch Protection**
   - Go to GitHub repository settings
   - Enable branch protection for main branch
   - Require pull request reviews before merging

## Environment Variables Reference

### Required Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_CHAIN_ID` | `11155111` | Sepolia testnet chain ID |
| `VITE_RPC_URL` | `https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID` | RPC endpoint for Sepolia |
| `VITE_WALLET_CONNECT_PROJECT_ID` | `YOUR_WALLET_CONNECT_PROJECT_ID` | WalletConnect project ID |
| `VITE_INFURA_API_KEY` | `YOUR_INFURA_API_KEY` | Infura API key |

### Optional Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_CONTRACT_ADDRESS` | `0x...` | Deployed contract address (update after deployment) |
| `VITE_VERIFIER_ADDRESS` | `0x...` | Verifier contract address |

## Build Configuration

### Vite Configuration
The project uses Vite as the build tool. Key configurations:

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  }
})
```

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check environment variables are set correctly
   - Ensure all dependencies are in package.json
   - Check build logs in Vercel dashboard

2. **Environment Variables Not Working**
   - Verify variables are set for all environments
   - Check variable names match exactly (case-sensitive)
   - Redeploy after adding new variables

3. **Wallet Connection Issues**
   - Verify WalletConnect project ID is correct
   - Check RPC URL is accessible
   - Ensure chain ID matches your network

4. **Contract Interaction Issues**
   - Update contract address in environment variables
   - Verify contract is deployed on correct network
   - Check contract ABI is up to date

### Performance Optimization

1. **Build Optimization**
   - Enable Vercel's automatic optimizations
   - Use Vite's built-in code splitting
   - Optimize images and assets

2. **Caching**
   - Vercel automatically handles caching
   - Use appropriate cache headers for static assets
   - Implement service worker for offline functionality

## Monitoring and Analytics

1. **Vercel Analytics**
   - Enable Vercel Analytics in project settings
   - Monitor performance metrics
   - Track user interactions

2. **Error Monitoring**
   - Integrate error tracking (Sentry, LogRocket)
   - Monitor build and runtime errors
   - Set up alerts for critical issues

## Security Considerations

1. **Environment Variables**
   - Never commit sensitive data to repository
   - Use Vercel's environment variable encryption
   - Rotate API keys regularly

2. **HTTPS**
   - Vercel automatically provides SSL certificates
   - Force HTTPS redirects
   - Use secure headers

## Post-Deployment Checklist

- [ ] Application loads correctly
- [ ] Wallet connection works
- [ ] Contract interactions function properly
- [ ] Environment variables are set
- [ ] Custom domain is configured (if applicable)
- [ ] SSL certificate is active
- [ ] Analytics are enabled
- [ ] Error monitoring is set up
- [ ] Performance is optimized
- [ ] Security headers are configured

## Support and Resources

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vite Documentation**: [vitejs.dev](https://vitejs.dev)
- **WalletConnect Documentation**: [docs.walletconnect.com](https://docs.walletconnect.com)
- **FHE Documentation**: [docs.fhenix.xyz](https://docs.fhenix.xyz)

## Contact Information

For technical support or questions about this deployment:
- GitHub Issues: [github.com/ryan87r/secure-pledge-vault/issues](https://github.com/ryan87r/secure-pledge-vault/issues)
- Email: biggish-gulper08@icloud.com
