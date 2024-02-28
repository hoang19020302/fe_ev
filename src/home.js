const logout = document.getElementById('logout');
const token = localStorage.getItem('user_token');
const uname = localStorage.getItem('user_name');

//Gán tên người dùng login or register
if (token && uname) {
    document.getElementById('user-name').innerText = uname;
}

// Đăng xuất
logout.addEventListener('click', (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:8000/api/logout', {
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
                return response.json();
            } else {
                throw new Error('Failed to logout user');
            }
        })
        .then(data => {
            alert(data.success);
            window.location.href = 'http://127.0.0.1:5500/page.html';
        })
        .catch(err => {
            console.error(err);
            alert('Failed to logout user');
            
        })
})