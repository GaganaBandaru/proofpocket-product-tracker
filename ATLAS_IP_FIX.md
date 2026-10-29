# MongoDB Atlas Connection Fix

## Error
```
Could not connect to any servers in your MongoDB Atlas cluster.
One common reason is that you're trying to access the database from an IP 
that isn't whitelisted.
```

## Fix (takes ~2 minutes)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Select your cluster → **Network Access** (left sidebar)
3. Click **"+ Add IP Address"**
4. Choose **"Allow Access from Anywhere"** (`0.0.0.0/0`) for development
   - Or enter your specific current IP
5. Click **Confirm**
6. Wait ~30 seconds for it to propagate

## Then restart the backend
```bash
cd backend && npm run dev
```

## Confirm it works
```bash
curl http://localhost:5001/api/health
# Should return: {"status":"OK","message":"ProofPocket backend is running"}
```

> **Note:** For Render deployment later, Render uses dynamic IPs — keep `0.0.0.0/0` 
> or enable the "Allow access from anywhere" option in Atlas for production too.
