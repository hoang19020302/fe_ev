document.addEventListener('DOMContentLoaded', function() {
    const emailForm = document.getElementById('emailForm');
    const emailsInput = document.getElementById('emails');
    const emailCountContainer = document.getElementById('emailCountContainer');
    const emailCountDisplay = document.getElementById('emailCountDisplay');
    const selectedRadio = document.querySelector('input[name="classify"]:checked');
    const textarea = document.getElementById('emails');

    // Fetch lấy toke CSRF vào form
    fetch('http://localhost:8000/api/csrf-token') // Thay đổi URL thành URL thực tế của máy chủ Laravel
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
            const response = await fetch('http://127.0.0.1:8000/api/list-email');
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

        const emails = emailsInput.value.split(';');
        let validEmails = 0;
        // Lấy danh sách email từ API
        const apiEmails = await getEmailListFromAPI();

        const invalidEmails = emails.filter(email => !apiEmails.includes(email));

        emails.forEach(email => {
            if (/^\S+@\S+\.\S+$/.test(email.trim())) {
                validEmails++;
            } else {
                emailsInput.style.borderColor = 'red'; // Đổi màu viền của textarea thành đỏ
                return; // Ngăn chặn form được gửi đi khi có ít nhất một email không hợp lệ
            }
        });

        // Hiển thị số email hợp lệ/tổng khi submit form
        emailCountDisplay.textContent = `${validEmails}/${emails.length}`;
        emailCountContainer.style.display = 'flex'; // Hiển thị container chứa số email
        const classify = selectedRadio.value;
        const emailString = textarea.value;
        const formData = {
            classify: classify,
            emails: emailString,
        };
        // Nếu tất cả các email đều hợp lệ, tiếp tục với hành động mặc định của form
        if (validEmails === emails.length && invalidEmails.length === 0) {
        
            try {
                //POST dữ liệu lên api
                const response = await fetch('http://127.0.0.1:8000/api/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': window.csrfToken,
                    },
                    body: JSON.stringify(formData)
                });
                if (!response.ok) {
                    throw new Error('Failed to send email');
                }
                const data = await response.json();
                alert(data.success);
                //console.log(data);
                emailForm.reset(); // Reset form khi gửi email thành công
            } catch (err) {
                alert('Đã có lỗi trong quá trình gửi email');
                emailForm.reset(); // Reset form khi gặp lỗi
            }
        } else {
            alert(`Có email chưa đăng ký: ${invalidEmails.join(', ')}`);
        }
    });
});
