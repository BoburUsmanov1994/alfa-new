const config = {
    API_ROOT: process.env.REACT_APP_BASE_URL,
    FILE_URL: process.env.REACT_APP_FILE_URL,
    // API_ROOT: `http://10.10.110.135:3000`,
    DEFAULT_APP_LANG: 'ru',
    ROLES: {
        admin: 'admin',
        user: 'user',
        superadmin: 'superadmin',
        endorsement: 'endorsement',
        osgor: 'osgor',
        osgop: 'osgop'
    },
    PERMISSIONS: [],
}

export default config;