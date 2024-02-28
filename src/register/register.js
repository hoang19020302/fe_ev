const registerForm = document.getElementById('registerForm');
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

registerForm.addEventListener('submit', async function(event) {
    event.preventDefault(); 
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Lưu các email đã login lên server
    const formData = {
        name: name,
        email: email,
        password: password,
    };
        if (email.trim() !== '' && password.trim() !== '' && name.trim() !== '') {
            try {
                const response = await fetch(`${address}:${serverPort}/api/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': window.csrfToken,
                    },
                    body: JSON.stringify(formData)
                })
                if (!response.ok) {
                    throw new Error('Failed to register user');
                }
                const data = await response.json();
                localStorage.setItem('user_token', data.token);
                localStorage.setItem('user_name', data.name);
                localStorage.setItem('user_id', data.id);
                alert(data.success);
                window.location.href = `${address}:${clientPort}/src/home.html`;
            } catch (err) {
                //console.error('Lỗi từ máy chủ:', err);
                alert('Email đã tồn tại.');

                // Reset form ở đây nếu cần
                registerForm.reset();
            }
        }

    
});


