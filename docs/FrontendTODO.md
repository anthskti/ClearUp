# Frontend Todo

1. System Appearance: Apply light and dark modes. going to take a long ahh time T-T
   - within all the typescript, I need to implement a "dark:.." theme along with it. Maybe I can componentize.

2. Implement Toaster, instead of console alerts.

3. Fix general loading screen

4. Fix skeleton loading screen

5. Mobile View (Probably the most important for now since a whole species can't utilize)
   - Create a new navigation bar + fix padding + fix other stuff jbsjbs.

Notes:
Auth required pages redirect to login. Need useEffect() as it causes race conditions.
Backend auth is called seperately from frontend auth.

Backend TODO

1. Implement Logging with Morgan or Winston

2. Backend filtering with pagination for the accordian filters on the left hand side of product page.
