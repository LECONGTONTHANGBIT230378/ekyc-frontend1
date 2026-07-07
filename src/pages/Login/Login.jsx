import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { BsMicrosoft, BsCheckLg } from 'react-icons/bs';
import InputField from '../../components/Form/InputField';
import styles from './Login.module.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Chuyển hướng sang trang Dashboard
        navigate('/dashboard');
    };

    return (
        <div className={styles.container}>
            {/* CỘT BÊN TRÁI: TEXT & TÍNH NĂNG */}
            <div className={styles.leftSide}>
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
                        một trung tâm điều hành rõ<br />
                        ràng và tin cậy.
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

            {/* CỘT BÊN PHẢI: FORM ĐĂNG NHẬP */}
            <div className={styles.rightSide}>
                <div className={styles.loginBox}>
                    <div className={styles.boxHeader}>
                        <h3>Chào mừng trở lại</h3>
                        <p>Đăng nhập để truy cập bảng điều khiển xác thực.</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <InputField
                            label="Email"
                            name="email"
                            type="email"
                            placeholder="nhanvien@veritas.vn"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <div className={styles.passwordWrapper}>
                            <div className={styles.passwordHeader}>
                                <label>Mật khẩu</label>
                                <a href="#">Quên mật khẩu?</a>
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

                        <button type="submit" className={styles.submitBtn}>
                            Đăng nhập
                        </button>
                    </form>

                    <div className={styles.divider}><span>ĐĂNG NHẬP BẰNG MẠNG XÃ HỘI</span></div>

                    <div className={styles.socialGroup}>
                        <button className={styles.socialBtn}><FcGoogle size={20} /> Google</button>
                        <button className={styles.socialBtn}><BsMicrosoft size={18} color="#00a4ef" /> Microsoft</button>
                    </div>

                    <div className={styles.footer}>
                        Chưa có tài khoản? <a href="#">Đăng ký</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;