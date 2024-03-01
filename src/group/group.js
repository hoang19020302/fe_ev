document.addEventListener('DOMContentLoaded', function() {
    const emailForm = document.getElementById('emailForm');
    const emailsInput = document.getElementById('emails');
    const emailCountContainer = document.getElementById('emailCountContainer');
    const emailCountDisplay = document.getElementById('emailCountDisplay');
    const classifyRadios = document.querySelectorAll('input[name="classify"]');
    let classify = '';
    const token = localStorage.getItem('user_token');
    const address = 'http://127.0.0.1';
    const clientPort = '5500';
    const serverPort = '8000';

    classifyRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            classify = this.value; // Gán giá trị của radio button được chọn vào biến classify
        });
    });

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

    // Hàm để lấy danh sách email từ API
    async function getEmailListFromAPI() {
        try {
            const response = await fetch(`${address}:${serverPort}/api/list-email?token=${token}`);
            if (!response.ok) {
                throw new Error('Failed to fetch email list from API');
            }
            const data = await response.json();
            return data.emails; // Giả sử API trả về một object có thuộc tính 'emails' chứa mảng các email
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    emailForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Ngăn chặn hành vi mặc định của form

        const emails = emailsInput.value.split(';').map(email => email.trim());// Lấy danh sách email 
        const uniqueEmails = new Set(emails); // Lưu trữ các email duy nhất
        const validEmails = [];
        const invalidEmails = [];
        const errorEmails = [];
        let hasInvalidEmail = false; // Biến để kiểm tra xem có email không hợp lệ không
        // Lấy danh sách email từ API
        const apiEmails = await getEmailListFromAPI();

        // Kiem tra một email hợp lệ
        uniqueEmails.forEach(email => {
            if (/^\S+@\S+\.\S+$/.test(email.trim())) {
                if (apiEmails.includes(email)) {
                    validEmails.push(email);
                } else {
                    invalidEmails.push(email);
                }
            } else {
                emailsInput.style.borderColor = 'red'; // Đổi màu viền của textarea thành đỏ
                hasInvalidEmail = true;
                errorEmails.push(email);
            }
        });

        // Hiển thị số email hợp lệ/tổng khi submit form
        emailCountDisplay.textContent = `${validEmails.length}/${uniqueEmails.size}`;
        emailCountContainer.style.display = 'flex'; // Hiển thị container chứa số email
        const emailString = validEmails.join(';');
        const selectedRadio = document.querySelector('input[name="classify"]:checked');
        const classifyValue = selectedRadio.value;
        const formData = {
            classify: classifyValue,
            emails: emailString,
        };
        // Nếu tất cả các email đều hợp lệ, submit form
        if (errorEmails.length === 0 && invalidEmails.length === 0 && !hasInvalidEmail) {
            try {
                //POST dữ liệu lên api
                const response = await fetch('http://127.0.0.1:8000/api/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': window.csrfToken,
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData)
                });
                if (!response.ok) {
                    throw new Error('Failed to send email');
                }
                const data = await response.json();
                alert(data.success);
                //console.log(data);
                emailCountDisplay.textContent = '';
                emailForm.reset(); // Reset form khi gửi email thành công
            } catch (err) {
                alert('Đã có lỗi trong quá trình gửi email');
                emailCountDisplay.textContent = '';
                emailForm.reset(); // Reset form khi gặp lỗi
            }
        } else {
            alert(`Email chưa đăng ký: ${invalidEmails.join(', ')}\nEmail sai định dạng: ${errorEmails.join(', ')}`);
        }
    });
});
