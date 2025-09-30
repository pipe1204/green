# Supabase Setup Instructions

## 1. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 2. Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

## 3. Database Schema

Run the SQL commands from `supabase-schema.sql` in your Supabase SQL Editor:

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and paste the contents of `supabase-schema.sql`
3. Click **Run** to execute the schema

## 4. Authentication Setup

The authentication is already configured with:

- Email/password authentication
- Automatic profile creation on signup
- Row Level Security (RLS) policies
- User roles (customer, vendor, admin)

## 5. Features Implemented

### Authentication

- ✅ Login/Register modals
- ✅ User menu with logout
- ✅ Protected dashboard route
- ✅ Automatic profile creation

### Database Schema

- ✅ User profiles
- ✅ Vendor information
- ✅ Vehicle listings
- ✅ Test drive bookings
- ✅ Contact inquiries
- ✅ Reviews system

### Vendor Dashboard

- ✅ Add/Edit/Delete vehicles
- ✅ Vehicle management interface
- ✅ Form validation
- ✅ Real-time updates

## 6. Next Steps

1. **Set up your environment variables** (step 1)
2. **Run the database schema** (step 3)
3. **Test the authentication** by registering a new user
4. **Access the vendor dashboard** at `/dashboard`

## 7. Testing the Setup

1. Start your development server: `npm run dev`
2. Go to your homepage
3. Click "Registrarse" to create a new account
4. Check your email for the confirmation link
5. After confirming, you can access the dashboard at `/dashboard`

## 8. Database Tables Created

- `profiles` - User profiles extending Supabase auth
- `vendors` - Vendor/dealer information
- `vehicles` - Vehicle listings
- `test_drive_bookings` - Test drive bookings
- `contact_inquiries` - Customer inquiries
- `reviews` - Vehicle and vendor reviews

All tables include proper RLS policies for security.
