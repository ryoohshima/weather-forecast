const env = require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = {
  fetchData: async () => {
    const { data, error } = await supabase
      .from('dailyData')
      .select()
      .gte('date', new Date().toLocaleDateString().slice(0, 10));
    return data;
  },
  insertData: async (params) => {
    const { error } = await supabase
      .from('dailyData')
      .insert(params);
    return error ? error : true;
  }
}