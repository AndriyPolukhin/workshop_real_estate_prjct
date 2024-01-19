export const authorize = async (db, req) => {
    // const token =   req.get('X-CSRF-TOKEN')
    const viewerId = await getCookieValue(req.headers.cookie, 'viewer');
    const viewer = await db.users.findOne({
        _id: `${viewerId}`,
        // token,
    });
    return viewer;
};
export const getCookieValue = async (cookieString, cookieName) => {
    const cookies = cookieString &&
        cookieString.split(';').map((cookie) => cookie.trim().split('='));
    if (cookies) {
        for (const [name, value] of cookies) {
            if (name === cookieName) {
                return decodeURIComponent(value);
            }
        }
    }
    return null;
};
