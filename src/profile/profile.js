const profile = document.getElementById('profile_user');

profile.onclick = function(e) {
    e.preventDefault();
    fetch('http://127.0.0.1:8000/api/user/{id}')
    .then(response => response.json())
    .then(data => {
        
    })
}
