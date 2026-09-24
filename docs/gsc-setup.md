# Connect Google Search Console to the audit dashboard

**Time:** about 15 minutes, one time only. **Cost:** free, and no credit card is needed.

When it's done, the dashboard at [audit.meridianosteopathy.co.nz](https://audit.meridianosteopathy.co.nz/) shows your **real Google numbers** instead of estimates:

- how many people found you on Google, and whether that's going up
- the searches you're *almost* winning (positions 4–20), which are the quickest wins
- how each page is doing, including the condition pages built from earlier recommendations
- live evidence on each recommendation ("people searched 'postnatal' 18 times; you're at #22")

## How it works, in one paragraph

You create a **read-only robot account** in Google (called a *service account*) and give it permission to *read* your Search Console statistics. Netlify uses it each time the website is built to fetch the latest numbers and put them on the dashboard. The robot can't change anything, and your numbers are **not** saved in your GitHub repository (which is public).

## Before you start

- You're an owner of the `meridianosteopathy.co.nz` property in Search Console ✔
- You can log in to Netlify
- Have a text editor handy (Notepad on Windows, TextEdit on Mac)

---

## Step 1 — Create a Google Cloud project (3 min)

1. Go to **[console.cloud.google.com](https://console.cloud.google.com/)** and sign in with your Google account. If you're asked to accept terms, accept them. You don't need to add billing.
2. At the top of the page, click the **project picker** (it may say *Select a project*) → **New project**.
3. **Project name:** `Meridian search audit`. Leave everything else as it is → **Create**.
4. When the notification says it's ready, click **Select project**. Check that the picker at the top now shows *Meridian search audit*.

## Step 2 — Switch on the Search Console API (1 min)

1. Open **[this link to the Search Console API](https://console.cloud.google.com/apis/library/searchconsole.googleapis.com)**. Check that *Meridian search audit* is still shown at the top.
2. Click **Enable**.

## Step 3 — Create the read-only robot and its key (4 min)

1. Open **[Service accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)** → **+ Create service account**.
2. **Service account name:** `search-audit-reader` → **Create and continue**.
3. The next two sections (*Permissions* and *Principals with access*) are optional. Click **Continue**, then **Done**, without choosing anything.
4. You're back at the list. **Copy the robot's email address**. It looks like `search-audit-reader@meridian-search-audit-123456.iam.gserviceaccount.com`. You'll need it in step 4.
5. Click that email → the **Keys** tab → **Add key** → **Create new key** → **JSON** → **Create**.
   A `.json` file downloads to your computer. Treat it like a password.

> If you see *"Service account key creation is disabled"*, see [Troubleshooting](#troubleshooting). There's a two-minute workaround.

## Step 4 — Give the robot read-only access in Search Console (2 min)

1. Go to **[Search Console](https://search.google.com/search-console)** and choose the **meridianosteopathy.co.nz** property.
2. Bottom left: **Settings** → **Users and permissions** → **Add user**.
3. **Email address:** paste the robot's email from step 3.
   **Permission:** **Restricted** (read-only) → **Add**.

## Step 5 — Paste the key into Netlify (3 min)

1. Open the `.json` file you downloaded in your text editor. Select everything (Ctrl+A / Cmd+A) and copy it.
2. In **Netlify** → **meridian-osteopathy** → **Site configuration** → **Environment variables** → **Add a variable** → **Add a single variable**.
3. **Key:** `GSC_SERVICE_ACCOUNT_JSON`
4. **Scopes:** choose **Specific scopes** and tick **only "Builds"**. This keeps the key away from the website's live functions, which have a size limit it would count towards.
5. **Values:** leave *Same value for all deploy contexts*. Paste the whole file into the value box.
6. Click **Create variable**.
7. Delete the downloaded `.json` file from your computer, or store it in your password manager. Netlify now has its own copy. If you ever need the key again, just create a new one (step 3.5).

## Step 6 — Rebuild the site and check (2 min)

1. In Netlify → **Deploys** → **Trigger deploy** → **Deploy site**. Changes to variables only apply after a new deploy.
2. When the deploy says **Published** (1–2 minutes), open **[audit.meridianosteopathy.co.nz](https://audit.meridianosteopathy.co.nz/)**.
3. **Your Google results** should now show numbers. If it says **Connection problem**, the message underneath says exactly which step to revisit.

## Step 7 — Let the weekly routine read the numbers (1 min)

The weekly Claude routine runs in a cloud environment that only reaches websites you allow. To let it read the Google numbers (and fix the Google suggestions feed that has been blocked since the summer):

1. Go to **[claude.ai/code](https://claude.ai/code)** and open the environment menu, where you choose the environment for a session. Find the environment your weekly routine uses (most likely **Meridian Audit**; the routine's settings at [claude.ai/code/routines](https://claude.ai/code/routines) show which one) → **Edit**.
2. Under **Network access**, add these two **allowed domains**:
   - `meridianosteopathy.co.nz`
   - `suggestqueries.google.com`
3. Save.

That's it. The weekly routine now bases its recommendations on your real Google data, and the Sunday email includes your Google headline numbers.

---

## Troubleshooting

| What you see | What to do |
|---|---|
| **"Service account key creation is disabled"** in step 3 | Your Google Workspace has a security policy that blocks keys (common on accounts set up after 2024). **Easiest fix:** do steps 1–3 signed in with a **personal Gmail account** instead. The robot works exactly the same, and step 4 still happens in your clinic's Search Console. *Alternative, if you're the Workspace admin:* in Google Cloud → **IAM & Admin** → **Organization policies**, find *Disable service account key creation* → **Manage policy** → **Override parent's policy** → **Not enforced** for this project. |
| Dashboard: *"can't see meridianosteopathy.co.nz in Search Console yet"* | Step 4 isn't done yet, or a different email was added. Check the robot's email under *Users and permissions*, wait 5 minutes, then redeploy (step 6). |
| Dashboard: *"The Google Search Console API is switched off"* | Do step 2, making sure the right project is selected at the top. Wait 2 minutes, then redeploy. |
| Dashboard: *"Google rejected the key"* | The key was deleted or pasted incompletely. Create a new key (step 3.5) and replace the Netlify value (step 5), then redeploy. |
| Dashboard: *"isn't valid JSON"* | Only part of the file was pasted. Open it again, select **all** of it and paste again. |
| Numbers are lower than in Search Console | The dashboard counts **searches made in New Zealand** only (overseas searches won't book), and leaves out the last 3 days because Google's data is still settling. |

## Turning it off

Any one of these disconnects it: delete `GSC_SERVICE_ACCOUNT_JSON` in Netlify, remove the robot under *Users and permissions* in Search Console, or delete the *Meridian search audit* project in Google Cloud.

## For a developer

- Code: `scripts/audit/search-console.js` (runs at build time via `src/_data/gsc.js`), tests in `scripts/audit/test-search-console.js`.
- Output: baked into `/admin/audit/` and published at `/admin/audit/gsc.json` for the weekly routine and the digest email.
- Settings (country filter, 28-day window, brand terms, "almost there" range): `src/_data/auditConfig.json`.
- Alternative credentials: `GSC_CLIENT_EMAIL` + `GSC_PRIVATE_KEY` instead of the whole file. `GSC_PROPERTY` pins the property (for example `sc-domain:meridianosteopathy.co.nz`); otherwise it's auto-detected.
