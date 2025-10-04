# How to Add Problems to Your Platform (Like LeetCode)

## Step 1: Run the Database Migration

1. Open your Supabase Dashboard
2. Go to **SQL Editor**
3. Copy and paste the contents of `supabase-migration.sql`
4. Click **Run** to execute the migration

This adds the necessary columns to your `problems` table:
- `prompt` - The actual problem question
- `hints` - Array of hint strings
- `time_limit_minutes` - Time limit for the problem
- `solution` - The solution answer
- `solution_explanation` - Detailed explanation

## Step 2: Add Problems via Supabase

### Method 1: Using Supabase Table Editor (Easiest)

1. Go to **Table Editor** in Supabase
2. Select the `problems` table
3. Click **Insert** → **Insert row**
4. Fill in the fields:
   - `id`: Unique identifier (e.g., "truss-001")
   - `title`: Problem title
   - `description`: Short description
   - `prompt`: Full problem statement
   - `difficulty`: "easy", "medium", or "hard"
   - `subject`: "Thermodynamics", "Solid Mechanics", etc.
   - `industry`: "Automotive", "Aerospace", etc.
   - `time_estimate`: "25 min"
   - `time_limit_minutes`: 25
   - `companies`: ["Tesla", "SpaceX"]
   - `hints`: ["Hint 1", "Hint 2", "Hint 3"]
   - `solution`: The answer
   - `solution_explanation`: Detailed explanation
   - `is_premium`: true or false

5. Click **Save**
6. **The problem will instantly appear on your website!**

### Method 2: Using SQL Insert

```sql
INSERT INTO problems (
  id,
  title,
  description,
  prompt,
  difficulty,
  subject,
  industry,
  time_estimate,
  time_limit_minutes,
  companies,
  hints,
  solution,
  solution_explanation,
  is_premium
) VALUES (
  'your-problem-id',
  'Your Problem Title',
  'Brief description',
  'Full problem statement here...',
  'medium',
  'Thermodynamics',
  'Automotive',
  '30 min',
  30,
  ARRAY['Company1', 'Company2'],
  ARRAY['Hint 1', 'Hint 2', 'Hint 3'],
  'The solution',
  'Detailed explanation of the solution',
  false
);
```

## Step 3: View Your Problem

1. Go to your website's Practice page
2. The problem will automatically show up in the list
3. Click on it to solve it!

## How It Works (Technical)

Your platform now works just like LeetCode:

1. **Database-Driven**: All problems are stored in Supabase
2. **Dynamic Loading**: Problems are fetched from the database when users click on them
3. **URL-Based**: Each problem has a unique URL like `/practice/interface?problem=truss-001`
4. **Real-time**: Add a problem in Supabase → It appears instantly on your site
5. **No Code Changes**: You never need to touch the code to add new problems

## Example Problem IDs

Use a consistent naming convention:
- `thermo-001`, `thermo-002` (Thermodynamics)
- `solid-001`, `solid-002` (Solid Mechanics)
- `fluid-001`, `fluid-002` (Fluid Mechanics)
- `heat-001`, `heat-002` (Heat Transfer)

## Pro Tips

1. **Consistent Fields**: Always fill in all fields for best user experience
2. **Good Hints**: Provide 3-5 progressive hints
3. **Clear Solutions**: Include both the answer AND explanation
4. **Time Limits**: Be realistic with time estimates
5. **Companies**: Add 2-4 companies that have asked this question
6. **Premium Content**: Use `is_premium: true` for advanced problems

## Troubleshooting

**Problem not showing up?**
- Check that `id` is unique
- Ensure all required fields are filled
- Refresh your browser

**Wrong problem loading?**
- This was the original bug - now fixed!
- Each problem ID maps directly to database entries

**Need to update a problem?**
- Just edit it in Supabase Table Editor
- Changes appear instantly
