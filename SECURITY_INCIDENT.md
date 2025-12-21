# Security Incident - Supabase Service Role Key Exposure

## ⚠️ CRITICAL: Service Role Key Exposed

**Date**: December 21, 2025  
**Status**: RESOLVED  
**Severity**: CRITICAL

## What Happened

GitGuardian detected that a Supabase Service Role JWT was exposed in the GitHub repository. The service role key provides full database access and bypasses Row Level Security (RLS) policies.

## Impact

- Full database access could be obtained by anyone with access to the repository
- All data could be read, modified, or deleted
- RLS policies could be bypassed

## Files That Contained the Exposed Key

The following files were updated to remove hardcoded keys:

1. `refresh_schema.js` - Now uses `SUPABASE_SERVICE_ROLE_KEY` env var
2. `seed_ai_tools.js` - Now uses `SUPABASE_SERVICE_ROLE_KEY` env var
3. `run_migration.js` - Removed hardcoded key
4. `run_migration.py` - Now uses `SUPABASE_SERVICE_ROLE_KEY` env var
5. `SETUP.md` - Removed exposed key from documentation

## Actions Taken

✅ **Immediate Actions**:
- Removed all hardcoded service role keys from codebase
- Updated all scripts to use environment variables
- Updated documentation to remove exposed keys
- Added security warnings to documentation

## Required Actions

### 1. Rotate the Service Role Key (URGENT)

**You MUST rotate the service role key immediately:**

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/togpvwfxmydgitkwqdgd/settings/api
2. Find the "service_role" key section
3. Click "Reset" or "Rotate" to generate a new key
4. Update your `.env` file with the new key:
   ```
   SUPABASE_SERVICE_ROLE_KEY=new_key_here
   ```
5. Update any deployment environments (Hostinger, etc.) with the new key

### 2. Review Access Logs

1. Check Supabase Dashboard → Logs → API Logs
2. Look for any suspicious activity since the key was exposed
3. Review database changes in the audit log

### 3. Update Environment Variables

Update these files with the new service role key:
- Local `.env` file
- Hostinger environment variables
- Any CI/CD pipeline secrets
- Any other deployment environments

## Prevention

### Best Practices Going Forward

1. **Never commit secrets to version control**
   - Use environment variables for all secrets
   - Add `.env` to `.gitignore` (already done)
   - Use `.env.example` for documentation

2. **Use Secret Management**
   - For production: Use Supabase Dashboard secrets
   - For CI/CD: Use GitHub Secrets or similar
   - For local dev: Use `.env` files (gitignored)

3. **Code Review**
   - Always review commits for exposed secrets
   - Use tools like GitGuardian for automated scanning

4. **Documentation**
   - Never include real keys in documentation
   - Use placeholders like `your_service_role_key_here`
   - Add clear security warnings

## Scripts Updated

All utility scripts now require environment variables:

```bash
# Before running scripts, set the environment variable:
export SUPABASE_SERVICE_ROLE_KEY=your_key_here

# Or use .env file:
# SUPABASE_SERVICE_ROLE_KEY=your_key_here
```

Scripts that require the service role key:
- `refresh_schema.js` - Schema cache refresh
- `seed_ai_tools.js` - Database seeding

## Verification

After rotating the key, verify:
- [ ] Old key no longer works
- [ ] New key works in scripts
- [ ] All deployments updated
- [ ] No secrets in git history (consider using `git-secret` or BFG Repo-Cleaner if needed)

## References

- [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/security)
- [GitGuardian Remediation Guide](https://docs.gitguardian.com/internal-repositories-monitoring/integrations/github/secret-leak-remediation)

---

**Last Updated**: December 21, 2025  
**Status**: Keys removed from codebase, rotation required

