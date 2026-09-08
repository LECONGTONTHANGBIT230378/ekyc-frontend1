import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BsCheckLg, BsExclamationTriangleFill, BsCheckCircleFill } from 'react-icons/bs';
import { CgSpinner } from 'react-icons/cg';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import InputField from '../../components/Form/InputField';
import styles from './Login.module.css';
import { authService } from '../../services/authService';

// COMPONENT: NỀN ĐỘNG KHOA HỌC (NHẬN DIỆN KHUÔN MẶT & OCR)
// COMPONENT: NỀN ĐỘNG TRỰC QUAN (MÔ PHỎNG THẺ CCCD & KHUÔN MẶT)
const AnimatedBackground = () => (
    <div className={styles.animatedBgContainer}>
        {/* Nền lưới chấm bi công nghệ */}
        <div className={styles.techGrid}></div>

        {/* --- KHU VỰC 1: THẺ CCCD (MÔ PHỎNG OCR) --- */}
        <div className={styles.idCardContainer}>
            <svg viewBox="0 0 240 150" className={styles.idCardSvg}>
                {/* Viền ngoài thẻ */}
                <rect x="5" y="5" width="230" height="140" rx="8" stroke="#4ADE80" strokeWidth="1.5" fill="rgba(255,255,255,0.03)" />
                {/* Khung ảnh đại diện trên thẻ */}
                <rect x="15" y="25" width="45" height="60" rx="4" stroke="#4ADE80" strokeWidth="1" fill="rgba(74, 222, 128, 0.1)" strokeDasharray="2 2" />
                <circle cx="37.5" cy="45" r="10" stroke="#4ADE80" strokeWidth="1" fill="none" />
                <path d="M 22.5 75 Q 37.5 60 52.5 75" stroke="#4ADE80" strokeWidth="1" fill="none" />
                {/* Các dòng dữ liệu chữ (Text Lines) */}
                <line x1="75" y1="30" x2="200" y2="30" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" className={styles.dataLine1}/>
                <line x1="75" y1="45" x2="170" y2="45" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" className={styles.dataLine2}/>
                <line x1="75" y1="60" x2="190" y2="60" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" className={styles.dataLine3}/>
                <line x1="75" y1="75" x2="140" y2="75" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" className={styles.dataLine4}/>
                {/* Biểu tượng Chip/Mã QR */}
                <rect x="175" y="95" width="35" height="35" rx="4" stroke="#4ADE80" strokeWidth="1" fill="none" />
                <path d="M 180 102 L 205 102 M 180 109 L 205 109 M 180 116 L 205 116 M 180 123 L 205 123" stroke="#4ADE80" strokeWidth="0.5" />
            </svg>
            {/* Tia quét OCR chạy trên thẻ */}
            <div className={styles.ocrScannerLine}></div>
            {/* Nhãn thông báo */}
            <div className={styles.floatingTag} style={{top: '-15px', right: '-10px'}}>Trích xuất OCR...</div>
        </div>

        {/* --- KHU VỰC 2: NHẬN DIỆN KHUÔN MẶT (FACE ID) --- */}
        <div className={styles.faceIdContainer}>
            <div className={styles.faceFocusBox}>
                <div className={styles.cornerTR}></div>
                <div className={styles.cornerBL}></div>
            </div>
            <svg viewBox="0 0 200 250" className={styles.faceWireframeSvg}>
                {/* Đường viền bao quanh khuôn mặt */}
                <path d="M 100 15 C 150 15 175 60 175 115 C 175 170 140 225 100 240 C 60 225 25 170 25 115 C 25 60 50 15 100 15 Z" stroke="rgba(96, 165, 250, 0.5)" strokeWidth="1.5" fill="none" strokeDasharray="4 4" className={styles.headOutline} />
                {/* Điểm nhận diện Mắt */}
                <circle cx="70" cy="105" r="4" fill="#60A5FA" className={styles.pulsePoint} />
                <circle cx="130" cy="105" r="4" fill="#60A5FA" className={styles.pulsePoint} />
                {/* Điểm nhận diện Mũi */}
                <circle cx="100" cy="140" r="3" fill="#4ADE80" className={styles.pulsePoint2} />
                {/* Điểm nhận diện Cằm/Miệng */}
                <circle cx="100" cy="180" r="3" fill="#60A5FA" />
                {/* Cung lông mày */}
                <path d="M 55 100 Q 70 90 85 100" stroke="#60A5FA" strokeWidth="1.5" fill="none" />
                <path d="M 115 100 Q 130 90 145 100" stroke="#60A5FA" strokeWidth="1.5" fill="none" />
                {/* Khẩu hình miệng */}
                <path d="M 75 175 Q 100 185 125 175" stroke="#60A5FA" strokeWidth="1.5" fill="none" />
                {/* Lưới đa giác định hình khuôn mặt */}
                <polygon points="100,115 90,145 110,145" stroke="rgba(96, 165, 250, 0.3)" fill="none" />
                <line x1="70" y1="105" x2="100" y2="140" stroke="rgba(96, 165, 250, 0.3)" strokeWidth="1" />
                <line x1="130" y1="105" x2="100" y2="140" stroke="rgba(96, 165, 250, 0.3)" strokeWidth="1" />
                <line x1="70" y1="105" x2="75" y2="175" stroke="rgba(96, 165, 250, 0.3)" strokeWidth="1" />
                <line x1="130" y1="105" x2="125" y2="175" stroke="rgba(96, 165, 250, 0.3)" strokeWidth="1" />
            </svg>
            <div className={styles.floatingTag} style={{bottom: '-20px', left: '10%', color: '#60A5FA', borderColor: '#60A5FA'}}>Khớp mặt: 99.8%</div>
        </div>

        {/* --- LUỒNG DỮ LIỆU ĐỐI CHIẾU --- */}
        {/* Hiển thị việc bắn dữ liệu từ Thẻ CCCD sang Khuôn mặt để so khớp */}
        <svg className={styles.globalConnections}>
            <line x1="80%" y1="25%" x2="65%" y2="75%" className={styles.dataStreamLine} />
            <line x1="85%" y1="30%" x2="70%" y2="80%" className={styles.dataStreamLine} style={{animationDelay: '1.5s'}} />
        </svg>

        {/* Tia Laser toàn màn hình */}
        <div className={styles.globalScanner}></div>
    </div>
);

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (location.state && location.state.errorMsg) {
            setError(location.state.errorMsg);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await authService.login(formData.username, formData.password);

            const token = res.data?.token || res.token;
            const rawRole = res.data?.role || res.role || 'EMPLOYEE';
            const userRole = String(rawRole).toUpperCase().includes('ADMIN') ? 'ADMIN' : 'EMPLOYEE';

            if (token) {
                sessionStorage.setItem('token', token);
                sessionStorage.setItem('role', userRole);

                setIsSuccess(true);
                setTimeout(() => {
                    if (userRole === 'ADMIN') {
                        navigate('/dashboard');
                    } else {
                        navigate('/registration');
                    }
                }, 600);
            } else {
                setError('Lỗi: Cấu trúc dữ liệu từ Server không chứa token hợp lệ.');
                setIsLoading(false);
            }
        } catch (err) {
            setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại!');
            setIsLoading(false);
        }
    };

    return (
        <div className={`${styles.pageWrapper || ''} ${isSuccess ? styles.pageExit : ''}`}>
            <div className={styles.container}>

                {/* --- CỘT TRÁI --- */}
                <div className={styles.leftSide}>

                    {/* KHU VỰC HIỆU ỨNG ĐỘNG (Thay thế cho heroImg) */}
                    <AnimatedBackground />

                    <div className={styles.leftContentWrapper}>
                        <div className={styles.logoWrapper}>
                            <div className={styles.logoIcon}>V</div>
                            <div className={styles.logoText}>
                                <h1>Veritas</h1>
                                <span>HỒ SƠ ĐỊNH DANH</span>
                            </div>
                        </div>

                        <div className={styles.mainContent}>
                            <span className={styles.badge}>Truy cập bảo mật cho nhân viên</span>
                            <h2 className={styles.heading}>
                                Xác thực định danh trong<br />
                                một trung tâm điều hành<br />
                                rõ ràng và tin cậy.
                            </h2>
                            <p className={styles.description}>
                                Đăng nhập, đăng ký khách hàng, xử lý OCR CCCD, so khớp selfie và kiểm tra lịch sử xác thực trong một hệ thống responsive duy nhất.
                            </p>
                        </div>

                        <div className={styles.featureCards}>
                            <div className={styles.card}><BsCheckLg className={styles.checkIcon} /> Quy trình OCR</div>
                            <div className={styles.card}><BsCheckLg className={styles.checkIcon} /> So khớp khuôn mặt</div>
                            <div className={styles.card}><BsCheckLg className={styles.checkIcon} /> Xuất kiểm tra</div>
                        </div>
                    </div>
                </div>

                {/* --- CỘT PHẢI --- */}
                <div className={styles.rightSide}>
                    <div className={styles.loginBox}>
                        <div className={styles.boxHeader}>
                            <h3>Chào mừng trở lại</h3>
                            <p>Đăng nhập để truy cập bảng điều khiển xác thực.</p>
                        </div>

                        {error && (
                            <div className={styles.errorMessage}>
                                <BsExclamationTriangleFill className={styles.errorIcon} />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <InputField
                                label="Tên đăng nhập"
                                name="username"
                                type="text"
                                placeholder="Nhập tên đăng nhập"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />

                            <div className={styles.passwordWrapper} style={{ marginBottom: '24px' }}>
                                <div className={styles.passwordHeader} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Mật khẩu</label>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px 40px 12px 14px',
                                            borderRadius: '8px',
                                            border: '1px solid #D1D5DB',
                                            fontSize: '14px',
                                            boxSizing: 'border-box',
                                            outline: 'none',
                                            fontFamily: 'inherit'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#3182ce'}
                                        onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                                            background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0
                                        }}
                                        title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                    >
                                        {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={`${styles.submitBtn} ${isSuccess ? styles.submitSuccess : ''}`}
                                disabled={isLoading || isSuccess}
                            >
                                {isSuccess ? (
                                    <>
                                        <BsCheckCircleFill size={20} style={{ marginRight: '8px' }} />
                                        Thành công! Đang chuyển hướng...
                                    </>
                                ) : isLoading ? (
                                    <>
                                        <CgSpinner className={styles.spinner} size={20} style={{ marginRight: '8px' }} />
                                        Đang xác thực...
                                    </>
                                ) : (
                                    'Đăng nhập vào hệ thống'
                                )}
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;