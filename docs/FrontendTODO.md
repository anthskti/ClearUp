In no order

1. Profile button dropdown.
   a. preferences, almost done, just need to implement password reset
   b. system theme
   c. DONE users routines, almost done, need image / product, need update backend.
   c. saved products
   d. DONE sign out, fixed error.

2. page routing: figure out what pages need headers and footers, side bars etc.
   a. update auth to include clearup logo.
   b. update auth to check if they're signed in, cannot access register or login page.

3. System Appearance: apply light and dark modes. going to take a long ahh time T-T

4. Verification via Oauth and Email verification, not needed rn ngl
   a. Need email provider service

5. DONE Implement Delete Routine.

6. DONE update builder to implement save modal and title

7. Add reveal scrolls where worked well

8. Fix Search bar for product list

9. Guide Page for influences.

10. Complete Guides is consumers.

11. Implement Toaster, instead of alerts.

Notes:
Auth required pages redirect to login. Need useEffect() as it causes race conditions.
Backend auth is called seperately from frontend auth.
