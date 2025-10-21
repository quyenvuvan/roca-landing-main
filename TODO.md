# TODO: Integrate Email Sending for Experience Registration Form

## Tasks
- [x] Add new interface `ExperienceData` in `src/lib/email.ts` for form fields (name, age, phone, schedule, description)
- [x] Create new function `sendExperienceRegistrationEmail` in `src/lib/email.ts` to send email notifications for experience registrations
- [x] Update form submit handler in `src/app/_home.tsx` to call the email function on successful validation
- [x] Add proper error handling and user feedback in the form submit handler
- [x] Test the email integration (ensure ADMIN_EMAILS is set in environment variables)
