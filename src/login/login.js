const loginForm = document.getElementById('loginForm');
const address = 'http://127.0.0.1';
const clientPort = '5500';
const serverPort = '8000';
// Fetch lấy toke CSRF vào form
fetch(`${address}:${serverPort}/api/csrf-token`) // Thay đổi URL thành URL thực tế của máy chủ Laravel
    .then(response => response.json())
    .then(data => {
        const csrfToken = data.csrf_token;
     // Sử dụng csrfToken ở đây cho mục đích của bạn
        window.csrfToken = csrfToken;
        console.log(csrfToken);
        document.getElementById('csrfToken').value = window.csrfToken;
 });

// Fetch lấy token để login
// async function getToken() {
//     try {
//         const response = await fetch(`${address}:${serverPort}/api/tokens`);
//         if (!response.ok) {
//             throw new Error('Failed to fetch token');
//         }
//         const data = await response.json();
//         return data.users_token;
//     } catch (error) {
//         console.error(error);
//         return [];
//     }
// }

loginForm.addEventListener('submit', async function(event) {
    event.preventDefault(); 
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    //const tokens = await getToken();
    const token = localStorage.getItem('user_token');

    // Lưu các email đã login lên server
    const formData = {
        email: email,
        password: password,
    };
        if (email.trim() !== '' && password.trim() !== '') {
                try {
                    const response = await fetch(`${address}:${serverPort}/api/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': window.csrfToken,
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify(formData)
                    })
                    if (!response.ok) {
                        throw new Error('Failed to login user');
                    }
                    const data = await response.json();
                    localStorage.setItem('user_token', data.token);
                    localStorage.setItem('user_name', data.name);
                    localStorage.setItem('user_id', data.id);
                    alert(data.success);
                    window.location.href = `${address}:${clientPort}/src/home.html`;
                } catch (err) {
                    //console.error('Lỗi từ máy chủ:', err);
                    alert('Đăng nhập thất bại.');
                    // Reset form ở đây nếu cần
                    loginForm.reset();
                }   
            }
    
});


