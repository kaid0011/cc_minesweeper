import { supabase } from './config.js';

export const checkReference = async (referenceNo) => {
  if (!referenceNo) {
    return false;
  }

  try {
    // Query Supabase for the reference number
    const { data, error } = await supabase
      .from('minesweeper_tokens')
      .select('used')
      .eq('reference_no', referenceNo)
      .single();

    if (error || !data) {
      console.error('Error fetching reference number:', error?.message);
      return false;
    }

    // If the token has already been used, return false
    if (data.used) {
      return false;
    }

    // Mark the token as used
    const { error: updateError } = await supabase
      .from('minesweeper_tokens')
      .update({ used: true })
      .eq('reference_no', referenceNo);

    if (updateError) {
      console.error('Error updating reference number:', updateError.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Unexpected error:', err.message);
    return false;
  }
};

export const fetchMines = async () => {
  const { data, error } = await supabase
    .from("the_minesweeper")
    .select("*") // Fetch all mines (no filter on status)
    .limit(100); // Adjust limit based on game size

  if (error) {
    console.error("Error fetching mines:", error);
    return [];
  }

  console.log("Fetched mines from database:", data); // Debugging log
  return data;
};


// Update mine status when game starts
export const updateMineStatus = async (ids, status) => {
  const { error } = await supabase
    .from("the_minesweeper")
    .update({ status })
    .in("id", ids);
  if (error) {
    console.error("Error updating mine status:", error);
  }
};

export const updateCellStatus = async (id, status) => {
  const { error } = await supabase
    .from("the_minesweeper")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error(`Error updating cell ${id} status:`, error);
  } else {
    console.log(`Cell ${id} status updated to ${status}`);
  }
};
