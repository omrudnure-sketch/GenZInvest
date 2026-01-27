# Firebase Google Sign-In Setup Guide

If you see an error like `auth/unauthorized-domain` or `auth/configuration-not-found`, follow these steps to fix your Firebase Console.

## 1. Enable Google Sign-In Provider
1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Open your project (**genzinvest-007**).
3.  Navigate to **Authentication** (in the left sidebar) -> **Sign-in method**.
4.  Click on **Add new provider** if Google is not listed.
5.  Select **Google**.
6.  Flip the **Enable** switch to ON.
7.  Click **Save**.

## 2. Add Your Vercel Domain
**This is the most common reason for errors on deployed sites.**
1.  In the **Authentication** section, click on the **Settings** tab.
2.  Scroll down to **Authorized domains**.
3.  Click **Add domain**.
4.  Enter your Vercel URL (e.g., `genzinvest.vercel.app` or `your-custom-domain.com`).
    *   *Note: `localhost` is usually authorized by default.*
5.  Click **Add**.

## 3. Verify API Key Restrictions (Optional)
If it still fails, check your API Key in Google Cloud Console.
1.  Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2.  Select your project.
3.  Find the `Browser key` (auto-created by Firebase).
4.  Ensure `Application restrictions` is set to **None** OR that your Vercel domain is added to the list of "Website restrictions".
