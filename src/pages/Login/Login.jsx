import React, { useState, useEffect } from 'react'; // Đã gộp useEffect vào đây
import { useNavigate, useLocation } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { BsMicrosoft, BsCheckLg, BsExclamationTriangleFill, BsCheckCircleFill } from 'react-icons/bs'; // Thêm BsCheckCircleFill
import { CgSpinner } from 'react-icons/cg';
import InputField from '../../components/Form/InputField';
import styles from './Login.module.css';
import { authService } from '../../services/authService';
import heroImg from '../../assets/hero.png';


const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // 1. THÊM STATE ĐỂ THEO DÕI TRẠNG THÁI THÀNH CÔNG
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (location.state && location.state.errorMsg) {
            setError(location.state.errorMsg); // Đổ câu thông báo vào hộp màu đỏ

            // Xóa state trong lịch sử trình duyệt để F5 không bị hiện lại lỗi mãi mãi
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

            // ====================================================================
            // ĐÃ SỬA: Xuyên thủng lớp vỏ ApiResponse để lấy đúng token và role
            // ====================================================================
            // Bóc tách dữ liệu từ API
            const token = res.data?.token || res.token;
            const rawRole = res.data?.role || res.role || 'EMPLOYEE';

            // ====================================================================
            // ĐÃ SỬA: Chuẩn hóa Role ngay từ lúc đăng nhập
            // ====================================================================
            const userRole = String(rawRole).toUpperCase().includes('ADMIN') ? 'ADMIN' : 'EMPLOYEE';

            if (token) {
                // Lưu chính xác 2 chìa khóa vào LocalStorage
                localStorage.setItem('token', token);
                localStorage.setItem('role', userRole); // Lưu Role đã chuẩn hóa

                setIsSuccess(true);
                setTimeout(() => {
                    // Điều hướng cực chuẩn
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
        /* 3. BAO BỌC BỞI CLASS HIỆU ỨNG (pageExit) */
        <div className={`${styles.pageWrapper || ''} ${isSuccess ? styles.pageExit : ''}`}>
            <div className={styles.container}>

                {/* --- CỘT TRÁI - GIAO DIỆN MỚI CỦA BẠN --- */}
                <div className={styles.leftSide}>
                    {/* Lớp phủ ảnh nền */}
                    <div
                        className={styles.bgOverlay}
                        style={{ backgroundImage: `url(${heroImg})` }}
                    ></div>

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

                            <div className={styles.passwordWrapper}>
                                <div className={styles.passwordHeader}>
                                    <label>Mật khẩu</label>
                                    <a href="#" className={styles.forgotLink}>Quên mật khẩu?</a>
                                </div>
                                <InputField
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* 4. NÚT ĐĂNG NHẬP (TÍCH HỢP HIỆU ỨNG THÀNH CÔNG) */}
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

                        <div className={styles.divider}><span>ĐĂNG NHẬP BẰNG MẠNG XÃ HỘI</span></div>

                        <div className={styles.socialGroup}>
                            <button type="button" className={styles.socialBtn}><FcGoogle size={20} /> Google</button>
                            <button type="button" className={styles.socialBtn}><BsMicrosoft size={18} color="#00a4ef" /> Microsoft</button>
                        </div>

                        <div className={styles.footer}>
                            Chưa có tài khoản? <a href="#">Đăng ký ngay</a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;