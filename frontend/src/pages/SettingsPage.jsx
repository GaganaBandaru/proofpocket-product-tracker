
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { changePassword, deleteAccount } from '../api/auth';
import Toast from '../components/Toast';
import './FormPage.css';
import './SettingsPage.css';

export default function SettingsPage() {
    const navigate = useNavigate();
    const { token, logout } = useAuth();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [deletePassword, setDeletePassword] = useState('');

    const [passwordLoading, setPasswordLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [toast, setToast] = useState(null);

    async function handleChangePassword(event) {
        event.preventDefault();

        if (newPassword !== confirmPassword) {
            setToast({ type: 'error', message: 'New passwords do not match.' });
            return;
        }

        if (newPassword.length < 6) {
            setToast({
                type: 'error',
                message: 'New password must be at least 6 characters.',
            });
            return;
        }

        try {
            setPasswordLoading(true);

            await changePassword(token, {
                currentPassword,
                newPassword,
            });

            logout();
            navigate('/login', {
                replace: true,
                state: { message: 'Password changed successfully. Please log in again.' },
            });
        } catch (error) {
            setToast({ type: 'error', message: error.message });
        } finally {
            setPasswordLoading(false);
        }
    }

    async function handleDeleteAccount(event) {
        event.preventDefault();

        const confirmed = window.confirm(
            'Are you sure you want to permanently delete your account and all your products? This action cannot be undone.'
        );

        if (!confirmed) return;

        try {
            setDeleteLoading(true);

            await deleteAccount(token, deletePassword);

            logout();
            navigate('/signup', {
                replace: true,
                state: { message: 'Your account has been deleted.' },
            });
        } catch (error) {
            setToast({ type: 'error', message: error.message });
        } finally {
            setDeleteLoading(false);
        }
    }

    return (
        <main className="page">
            <div className="container">
                <nav aria-label="Breadcrumb" className="breadcrumb">
                    <Link to="/">Products</Link>
                    <span aria-hidden="true"> / </span>
                    <span>Settings</span>
                </nav>

                <header className="page-header">
                    <h1>Settings</h1>
                    <Link to="/" className="btn btn-ghost">← Back</Link>
                </header>

                <section className="settings-card card fade-in">
                    <h2>Change Password</h2>
                    <p className="settings-description">
                        Update your password to help keep your account secure.
                    </p>

                    <form onSubmit={handleChangePassword} className="settings-form">
                        <label htmlFor="current-password">Current password</label>
                        <input
                            id="current-password"
                            type="password"
                            autoComplete="current-password"
                            value={currentPassword}
                            onChange={(event) => setCurrentPassword(event.target.value)}
                            required
                        />

                        <label htmlFor="new-password">New password</label>
                        <input
                            id="new-password"
                            type="password"
                            autoComplete="new-password"
                            minLength={6}
                            maxLength={128}
                            value={newPassword}
                            onChange={(event) => setNewPassword(event.target.value)}
                            required
                        />

                        <label htmlFor="confirm-password">Confirm new password</label>
                        <input
                            id="confirm-password"
                            type="password"
                            autoComplete="new-password"
                            minLength={6}
                            maxLength={128}
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            required
                        />

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={passwordLoading}
                        >
                            {passwordLoading ? 'Updating...' : 'Change Password'}
                        </button>
                    </form>
                </section>

                <section className="settings-card settings-card--danger card">
                    <h2>Delete Account</h2>
                    <p className="settings-description">
                        Permanently delete your account and all products associated with it.
                        This action cannot be undone.
                    </p>

                    <form onSubmit={handleDeleteAccount} className="settings-form">
                        <label htmlFor="delete-password">Confirm your password</label>
                        <input
                            id="delete-password"
                            type="password"
                            autoComplete="current-password"
                            value={deletePassword}
                            onChange={(event) => setDeletePassword(event.target.value)}
                            required
                        />

                        <button
                            type="submit"
                            className="btn btn-danger"
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? 'Deleting...' : 'Delete My Account'}
                        </button>
                    </form>
                </section>
            </div>

            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}
        </main>
    );
}
