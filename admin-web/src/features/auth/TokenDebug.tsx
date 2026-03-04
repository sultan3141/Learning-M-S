import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';

export const TokenDebug = () => {
    const token = useAuthStore((state) => state.token);
    
    if (!token) {
        return <div>No token found</div>;
    }

    try {
        // Decode JWT (without verification - just for debugging)
        const parts = token.split('.');
        if (parts.length !== 3) {
            return <div>Invalid token format</div>;
        }

        const payload = JSON.parse(atob(parts[1]));
        const now = Math.floor(Date.now() / 1000);
        const isExpired = payload.exp < now;
        const expiresIn = payload.exp - now;

        return (
            <div style={{ padding: '20px', backgroundColor: '#f3f4f6', borderRadius: '8px', margin: '20px' }}>
                <h3>Token Debug Info</h3>
                <p><strong>User ID:</strong> {payload.sub}</p>
                <p><strong>Role:</strong> {payload.role}</p>
                <p><strong>Issued At:</strong> {new Date(payload.iat * 1000).toLocaleString()}</p>
                <p><strong>Expires At:</strong> {new Date(payload.exp * 1000).toLocaleString()}</p>
                <p><strong>Status:</strong> <span style={{ color: isExpired ? 'red' : 'green', fontWeight: 'bold' }}>
                    {isExpired ? 'EXPIRED' : `Valid (expires in ${Math.floor(expiresIn / 60)} minutes)`}
                </span></p>
                {isExpired && (
                    <p style={{ color: 'red', marginTop: '10px' }}>
                        ⚠️ Your token has expired. Please log out and log back in.
                    </p>
                )}
            </div>
        );
    } catch (error) {
        return <div>Error decoding token: {String(error)}</div>;
    }
};
