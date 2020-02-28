class Auth {
    authenticated;
    constructor(){
        this.authenticated = false;
    }

    async login(body){
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();

        if(!data.success){
            return {
                error: true,
                message: data.error
            }
        } else {
            localStorage.setItem('jwttoken', data.token);
            return {
                error: false,
                message: ''
            }
        }
    }

    logout(){
        console.log('logout');
    }

    async getUserData(){
        const token = localStorage.getItem('jwttoken');
        const response = await fetch('/api/users/verifyToken', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`,
                'token': token
            }
        });
        const data = await response.json();
        return data;
    }

    async isAuthenticated(){
        const userData = await this.getUserData();
        this.authenticated = userData.email ? true : false;
    }
}

export default new Auth();