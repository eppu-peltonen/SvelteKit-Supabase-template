# SvelteKit template

This project is a template for building web apps quickly. Setup Supabase project and start building with SvelteKit.

## Setup Instructions

### Supabase

#### Setup Project

Go to [supabase.com](https://supabase.com/) and create a new project.

Below is set of instructions to create the database schema, policies, functions etc. Feel free to edit the scripts how you like.

#### Create profiles table

Go to SQL Editor -> New query and copy paste the script below to create the profiles table.

```bash
create table
  public.profiles (
    id uuid not null,
    username text not null,
    fullName text null,
    password text not null,
    email text not null,
    constraint profiles_pkey primary key (id),
    constraint profiles_email_key unique (email),
    constraint profiles_username_key unique (username),
    constraint profiles_id_fkey foreign key (id) references auth.users (id) on delete cascade,
    constraint username_length check ((char_length(username) >= 3))
  ) tablespace pg_default;
```

#### Setup Row Level Security

In the SQL Editor query window, paste script below to add policies:

```bash
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);
```

#### Database function and trigger for sign up

This will automatically create a profile when a new user signs up.

```bash
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, password, email)
  values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'password', new.raw_user_meta_data->>'email');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

#### Authentication settings

1. Go to Authentication -> URL Configuration.
2. Change Site URL to `http://localhost:5173`
3. Optionally go to Email Templates and customize the `Confirm signup` template. This email will be sent to users when they sign up.

#### API keys

Go to Project settings -> API and find the project URL and anon key for SvelteKit.

### SvelteKit

1. Fork the project and install dependencies with `npm install` or whatever package manager you use.
2. Create `.env` file in the root directory and paste the Supabase project URL and anon key with following format:

   ```bash
   PUBLIC_SUPABASE_URL="Your URL"
   PUBLIC_SUPABASE_ANON_KEY="Your anon key"
   ```

3. Start the application with `npm run dev`. Dependency optimization takes some time so the app may not response to actions right away. Check your server console for optimization progress.

## Building and testing

`npm run build` to create a production version of the app.
`npm run format` to run prettier format with configured settings in `.prettierrc`.
`npm run test` to run playwright tests.
