# Testing
Test plan with at least 10 test cases

## Scope
Manual, end-to-end tests against the live demo at ledgerly.uz using the web UI. These cases focus on critical user flows, data integrity, and UI/API integration.

## Preconditions
- Demo environment reachable at ledgerly.uz
- At least one valid user account available (or registration enabled)
- Test data can be created and cleaned up manually

## Test cases
1) User registration (happy path)
   - Steps: Open ledgerly.uz -> Register -> fill required fields -> submit.
   - Expected: Account created, success message, user can log in.

2) User registration (duplicate email)
   - Steps: Register with an email that already exists.
   - Expected: Error shown indicating email already in use; no new account created.

3) Login (valid credentials)
   - Steps: Open login page -> enter valid email/password -> submit.
   - Expected: User is authenticated and redirected to dashboard/home.

4) Login (invalid password)
   - Steps: Enter valid email with wrong password -> submit.
   - Expected: Error shown; user remains logged out.

5) Create category
   - Steps: Navigate to Categories -> Create -> enter title and monthly limit -> save.
   - Expected: New category appears in list with correct attributes.

6) Create category (duplicate title)
   - Steps: Create a category with the same title as an existing category for the user.
   - Expected: Error shown; duplicate category is not created.

7) Create transaction
   - Steps: Navigate to Transactions -> Create -> select category -> enter amount/date/type -> save.
   - Expected: Transaction is listed with correct details and category.

8) Suggest category (LLM suggestions)
   - Steps: In transaction creation, type a title -> request category suggestions.
   - Expected: Up to 5 suggestions returned, firstly giving AI suggested categories: either existing ones or suggested for create. 
   Then, the list includes existing frequent categories; no new categories created automatically.

9) Expense chart (month)
   - Steps: Open expense chart view for a specific month.
   - Expected: Totals per category match the sum of displayed transactions for that month.

10) Update category
   - Steps: Edit an existing category -> change title and monthly limit -> save.
   - Expected: Category updates appear immediately; alias/title rendered in UI.

11) Delete category (soft delete)
   - Steps: Delete a category from the UI.
   - Expected: Category is removed from active list; existing transactions remain intact.

## Notes
- For data integrity checks, compare UI totals with transaction list sums.
- Record any HTTP errors or UI inconsistencies for follow-up.
