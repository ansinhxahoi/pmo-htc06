module.exports = async function handler(req, res) {
    // 1. Lấy khóa từ Két sắt Vercel
    const GOOGLE_API_URL = process.env.SECRET_GOOGLE_API;
    
    // 2. Chặn lỗi nếu quên chưa nhập Két sắt
    if (!GOOGLE_API_URL) {
        return res.status(500).json({ 
            status: "error", 
            message: "LỖI BẢO MẬT: Chưa cài đặt SECRET_GOOGLE_API trên Vercel" 
        });
    }

    const { action, tab } = req.query;

    try {
        // 3. Gọi ngầm tới Google Apps Script
        const response = await fetch(`${GOOGLE_API_URL}?action=${action}&tab=${tab}`);
        
        // 4. Nếu Google trả về lỗi (ví dụ sai link)
        if (!response.ok) {
            throw new Error(`Google API responded with status ${response.status}`);
        }

        const data = await response.json();
        
        // 5. Trả dữ liệu về cho Frontend
        res.status(200).json(data);
        
    } catch (error) {
        // Trả về JSON chuẩn chỉ để Frontend không bị văng lỗi SyntaxError
        res.status(500).json({ 
            status: "error", 
            message: "Lỗi Serverless: " + error.message 
        });
    }
}