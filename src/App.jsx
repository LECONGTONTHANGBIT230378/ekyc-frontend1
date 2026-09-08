import React from 'react';
import AppRoutes from './routes/AppRoutes';

function App() {
    // Chỉ cần gọi file AppRoutes ra đây để tập trung quản lý luồng chạy ở 1 nơi duy nhất
    return (
        <AppRoutes />
    );
}

export default App;