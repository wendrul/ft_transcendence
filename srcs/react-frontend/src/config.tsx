let url = window.location.origin

const config = {
    // apiUrl: 'http://localhost:3002'
    apiUrl: url.substring(0, url.lastIndexOf(":")) + ":3002"
};

export default config;
