import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://nzyowwxptxmouxdhzvpu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56eW93d3hwdHhtb3V4ZGh6dnB1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTkxMDM0MCwiZXhwIjoyMTA1NDg2MzQwfQ.eJ-C5wPQ7jB_nES_haplb9h12P5sduq6rzCt6A3pFMc"
);

const PASSWORD = "student@123";

async function createStudents() {

  for (let i = 1; i <= 130; i++) {

    const roll = `25uad${String(i).padStart(3, "0")}`;
    const email = `${roll}@kamarajengg.edu.in`;

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: PASSWORD,
      email_confirm: true
    });

    if (error) {
      console.log(`❌ ${email}`, error.message);
      continue;
    }

    await supabase
      .from("students")
      .insert({
        id: data.user.id,
        roll_no: roll,
        email
      });

    console.log(`✅ Created ${email}`);
  }

  console.log("Finished!");
}

createStudents();