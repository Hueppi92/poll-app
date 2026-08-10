import { Injectable } from '@angular/core';
 import { createClient } from '@supabase/supabase-js'

@Injectable({
  providedIn: 'root',
})
export class DbService {
  // Create a single supabase client for interacting with your database
  readonly supabase = createClient('https://vpjnkooekxibzoahvbse.supabase.co', 'sb_publishable_7oB2GY73Q4i8HU7kZcrWLA_OhknKL9a');
}
