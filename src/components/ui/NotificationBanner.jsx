import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideBanner } from '../../store/slices/notificationSlice';
import { Bell } from 'lucide-react';

const NotificationBanner = () => {
    const dispatch = useDispatch();
    const { visible, title, body } = useSelector((state) => state.notification.banner);

    // Auto-dismiss after 4 seconds
    useEffect(() => {
        if (!visible) return;
        const timer = setTimeout(() => dispatch(hideBanner()), 4000);
        return () => clearTimeout(timer);
    }, [visible, dispatch]);

    if (!visible) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: '72px', // below the mobile header
                left: '12px',
                right: '12px',
                zIndex: 999,
                background: 'rgba(255, 255, 255, 0.97)',
                backdropFilter: 'blur(12px)',
                borderRadius: '14px',
                padding: '12px 16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
                border: '1px solid rgba(255,107,26,0.2)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                animation: 'slideDown 0.3s ease-out',
            }}
            onClick={() => dispatch(hideBanner())}
        >
            {/* Icon */}
            <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #FF6B1A, #FF9040)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
            }}>
                <Bell size={16} color="white" />
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
                {title && (
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a', margin: 0, marginBottom: '2px' }}>
                        {title}
                    </p>
                )}
                {body && (
                    <p style={{ fontSize: '13px', color: '#555', margin: 0, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {body}
                    </p>
                )}
            </div>
        </div>
    );
};

export default NotificationBanner;
