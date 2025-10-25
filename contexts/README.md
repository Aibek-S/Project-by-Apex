# Apex Tourism Application

## New Tour Functionality

This update adds comprehensive tour management features to the application:

### Features Added

1. **Tour List Page** - View all available tours
2. **Tour Detail Page** - See detailed information about each tour including:
   - Tour name, company, and price
   - Detailed description
   - Places included in the tour
3. **Place Detail Integration** - See which tours are available for each place
4. **Navigation** - Easy access to tours through the main navigation

### Database Structure

The implementation uses two new tables:

1. `tours` - Contains tour information (name, company, price, description)
2. `tour_places` - Junction table linking tours to places

```sql
create table public.tour_places (
  id serial not null,
  tour_id integer not null,
  place_id integer not null,
  constraint tour_places_pkey primary key (id),
  constraint tour_places_place_id_fkey foreign KEY (place_id) references places (id),
  constraint tour_places_tour_id_fkey foreign KEY (tour_id) references tours (id)
) TABLESPACE pg_default;

create table public.tours (
  id serial not null,
  name text not null,
  company text null,
  price integer null,
  description text null,
  constraint tours_pkey primary key (id)
) TABLESPACE pg_default;
```

### Components Added

- `TourCard` - Displays a summary of a tour
- `TourListPage` - Shows all tours in a grid
- `TourDetailPage` - Detailed view of a single tour

### Hooks Added

- `useTours` - Fetch all tours
- `useTour` - Fetch a single tour by ID
- `useToursByPlace` - Fetch tours for a specific place

### How to Use

1. Add tours to the `tours` table in your database
2. Link tours to places using the `tour_places` junction table
3. Navigate to the "Tours" link in the header to view all tours
4. Click on any tour to see its details
5. On any place detail page, you'll see available tours for that place

### Environment Variables

Create a `.env` file with your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_KEY=your_supabase_anon_key_here
```