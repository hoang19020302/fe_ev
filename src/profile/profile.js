const profile = document.getElementById('profile_user');
const token = localStorage.getItem('user_token');
const address = 'http://127.0.0.1';
const clientPort = '5500';
const serverPort = '8000';


profile.onclick = function(e) {
    e.preventDefault();
    fetch(`${address}:${serverPort}/api/user/{id}?token=${token}`)
    .then(response => response.json())
    .then(data => {
        
    })
}
