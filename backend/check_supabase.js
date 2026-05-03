require('dotenv').config(); // Load biến từ file .env
const { createClient } = require('@supabase/supabase-js');

// Lấy thông tin từ file .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    console.log("Đang thử kết nối tới Supabase...");

    // Cách 1: Gọi hàm getSession
    const { data, error } = await supabase.auth.getSession();

    if (error) {
        console.error("❌ Kết nối thất bại!");
        console.error("Chi tiết lỗi:", error.message);
    } else {
        console.log("✅ Kết nối thành công!");
        console.log("Phản hồi từ server:", data.session === null ? "Sẵn sàng (chưa có phiên đăng nhập)" : "Đã có phiên đăng nhập");
    }
}

test();