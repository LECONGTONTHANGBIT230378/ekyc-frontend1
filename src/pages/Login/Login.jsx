import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BsCheckLg, BsExclamationTriangleFill, BsCheckCircleFill } from 'react-icons/bs';
import { CgSpinner } from 'react-icons/cg';
import { FiEye, FiEyeOff } from 'react-icons/fi'; // ĐÃ THÊM: Import icon con mắt
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
    const [isSuccess, setIsSuccess] = useState(false);

    // ĐÃ THÊM: State quản lý ẩn/hiện mật khẩu
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
                localStorage.setItem('token', token);
                localStorage.setItem('role', userRole);

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

                            {/* ĐÃ SỬA: Thay thế InputField bằng thẻ HTML chuẩn để chèn icon con mắt */}
                            <div className={styles.passwordWrapper} style={{ marginBottom: '24px' }}>
                                <div className={styles.passwordHeader} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Mật khẩu</label>
                                    {/* Đã xóa link Quên mật khẩu */}
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

                        {/* ĐÃ XÓA: Nút đăng nhập mạng xã hội và phần Đăng ký */}

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;