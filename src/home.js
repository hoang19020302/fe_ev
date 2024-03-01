const logout = document.getElementById('logout');
const token = localStorage.getItem('user_token');
const uname = localStorage.getItem('user_name');
const address = 'http://127.0.0.1';
const clientPort = '5500';
const serverPort = '8000';
let isLoggedOut = false;

//Gán tên người dùng login or register
if (token && uname) {
    document.getElementById('user-name').innerText = uname;
}

// Đăng xuất
logout.addEventListener('click', (e) => {
    e.preventDefault();
    fetch(`${address}:${serverPort}/api/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
        .then(response => {
            if (response.ok) {
                localStorage.removeItem('user_token');
                localStorage.removeItem('user_name');
                localStorage.removeItem('user_id');
                isLoggedOut = true;
                return response.json();
            } else {
                throw new Error('Failed to logout user');
            }
        })
        .then(data => {
            alert(data.success);
            if (isLoggedOut) {
                window.location.href = `${address}:${clientPort}/page.html`;    
            }
        })
        .catch(err => {
            console.error(err);
            alert('Đăng xuất thất bại');
        })
})