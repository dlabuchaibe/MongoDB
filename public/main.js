const checkLogin = () => {
    const token = localStorage.getItem('token');
    if (token === null) {
        document.getElementById('card-signup').style.display = 'block';
        document.getElementById('card-login').style.display = 'block';
    } else {
        document.getElementById('card-tweets').style.display = 'block';
        document.getElementById('logout').style.display = 'block';
    }
};

const login = () => {
    const url = '/api/users/login';
    const user = {
        username: document.getElementById('login-username').value,
        password: document.getElementById('login-password').value
    }
    document.getElementById('login-password').value = '';
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(response => {
            if (!!response.token) {
                document.getElementById('login-username').value = '';
                document.getElementById('logout').style.display = 'block';
                document.getElementById('card-tweets').style.display = 'block';
                document.getElementById('card-login').style.display = 'none';
                document.getElementById('card-signup').style.display = 'none';
                localStorage.setItem('token', response.token);
                alert('Bienvenido!');
            } else {
                alert('Datos inválidos');
            }
        })
        .catch(err => {
            alert('Datos inválidos');
        })
};

const logout = () => {
    localStorage.removeItem('token');
    document.getElementById('logout').style.display = 'none';
    document.getElementById('card-tweets').style.display = 'none';
    document.getElementById('card-signup').style.display = 'block';
    document.getElementById('card-login').style.display = 'block';
};

const validateNewUser = (name, email, username, password, passwordConfirm) => {
    if (name.length < 2) {
        alert("El nombre debe ser mínimo de 2 caracteres");
        return false;
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        alert("No es una dirección de correo válida");
        return false;
    }
    if (username.length < 2) {
        alert("El nombre de usuario debe ser mínimo de 2 caracteres");
        return false;
    }
    if (password != passwordConfirm) {
        alert("Las contraseñas no coinciden");
        return false;
    }
    if (!/^[A-Za-z]\w{7,14}$/.test(password)) {
        alert("La contraseña no es válida");
        return false;
    }

    return true;
}

const newUser = () => {
    if (validateNewUser(document.getElementById('name').value,
        document.getElementById('email').value,
        document.getElementById('username').value,
        document.getElementById('password').value,
        document.getElementById('passwordConfirm').value
    )) {
        const url = '/api/users';
        const user = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        }
        document.getElementById('password').value = '';
        document.getElementById('passwordConfirm').value = '';
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(response => {
                document.getElementById('name').value = '';
                document.getElementById('email').value = '';
                document.getElementById('username').value = '';
                alert('Usuario creado!');
            })
            .catch(err => {
                alert('Ocurrió un error al crear el usurio');
            })
    }
};

const newTweet = () => {
    const token = localStorage.getItem('token');
    if (token) {
        const tweet = {
            content: document.getElementById('content').value
        };
        if (tweet.content !== '') {
            //se define la ruta hacia donde se enviará la petición
            const url = '/api/tweets';
            //se hace la petición con Fetch
            fetch(url, {
                method: 'POST', //se define que es de tipo POST 
                body: JSON.stringify(tweet), //se convierte en String el objeto que se va a enviar
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token
                }
            })
                .then(res => res.json())
                //respuesta con error
                .catch(error => console.error('Error:', error))
                //respuesta exitosa
                .then(response => {
                    getTweets();
                    document.getElementById('content').value = '';
                });
        }
    }
};

const getTweets = () => {
    const url = '/api/tweets';
    fetch(url)
        .then(res => res.json())
        .then(response => {
            //se recibe el array de respuesta, se recorre y se arma un string 
            //para mostrar el resultado
            const html = response.map(tweet => {
                if (tweet.comments.length > 0) {
                    return `<li class="list-group-item">
                <a href="/tweet.html?id=${tweet._id}">- ${tweet.content} <span class="badge badge-primary">9 <i>Comentarios</i></span>  </a>  
                <br /><small>${tweet.createdAt}</small>
                <br /><i class="text-primary">@</i><a href="profile.html?userId=${tweet.user._id}">${tweet.user.name}</a>                                         
                <div class="input-group w-75 mt-2">
                <textarea class="form-control" id="comment_${tweet._id}" rows="1" aria-label="With textarea" placeholder="Tienes algun comentario"></textarea>
                <div class="input-group-append">
                <button class="btn btn-outline-primary" id="tweetId" type="button" value="${tweet._id}" onclick="comments('${tweet._id}');">Enviar</button>
                 </div>
                </div>
                <br /> ${tweet.comments.map(comment => {
                        return comment.userComment
                    }).join(' ')}
                </li>`
                } else {
                    return `<li class="list-group-item">
                                            <a href="/tweet.html?id=${tweet._id}">- ${tweet.content} <span class="badge badge-primary">9 <i>Comentarios</i></span>  </a>  
                                            <br /><small>${tweet.createdAt}</small>
                                            <br /><i class="text-primary">@</i><a href="profile.html?userId=${tweet.user._id}">${tweet.user.name}</a>                                         
                                            <div class="input-group w-75 mt-2">
                                            <textarea class="form-control" id="comment_${tweet._id}" rows="1" aria-label="With textarea" placeholder="Tienes algun comentario"></textarea>
                                            <div class="input-group-append">
                                            <button class="btn btn-outline-primary" id="tweetId" type="button" value="${tweet._id}" onclick="comments('${tweet._id}');">Enviar</button>
                                             </div>
                                            </div>
                                            </li>`
                }
            }).join(" ");
            //el string construido se agrega en el div con id tweets
            document.getElementById('tweets').innerHTML = `<ul class="list-group">
                                                        <li class="list-group-item active"><h5>Tweets</h5></li>
                                                        ${html}
                                                        </ul>`;
        });
};

const comments = (tweetId) => {
    const token = localStorage.getItem('token');
    const comments = {
        comment: document.getElementById(`comment_${tweetId}`).value,
        tweetId: tweetId
    }
    console.log(comments)
    const url = '/api/tweets';
    fetch(url, {
        method: 'PUT', //se define que es de tipo PUT 
        body: JSON.stringify(comments), //se convierte en String el objeto que se va a enviar
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
        }
    })
        .then(res => res.json())
        .then(response => {
            console.log(response)
            getTweets();
            document.getElementById('comment').value = ''
        })
}


const profile = () => {
    const params = new URLSearchParams(window.location.search)
    const userId = params.get('userId')
    console.log(userId)
    const url = `/api/tweets/:${userId}`
    fetch(url)
        .then(res => res.json())
        .then(response => {
            const html = response.map(userTweet => {
                return `<li class="list-group-item">
            <small>${userTweet.content}</small>
            <br/><small>${userTweet.createdAt}</small>                                       
            </li>`
            }).join(" ")
            document.getElementById('profile-tweets').innerHTML = `<div class="col-7">
                                                                    <ul class="list-group">
                                                                    <li class="list-group-item active"><h5>Usuario</h5></li>
                                                                    <li class="list-group-item"><i>Nombre</i>: ${response[0].user.name}</li>
                                                                    <li class="list-group-item"><i>Usuario</i>: ${response[0].user.username}</li>
                                                                    <li class="list-group-item"><i>Correo</i>: ${response[0].user.email}</li>
                                                                    </ul>
                                                                </div>
                                                                <div class="col-5">
                                                                    <ul class="list-group">
                                                                    <li class="list-group-item active"><h5>Tweets</h5></li>
                                                                    ${html}
                                                                    </ul>
                                                                </div>`
        })
};



const getWeather = (city) => {
    document.getElementById('weather').innerHTML = '';
    if (city !== '') {
        const url = `/api/weather/${city}`;
        fetch(url)
            .then(res => res.json())
            .then(response => {
                const html = `El clima de ${city} es ${response.temp}°C`;
                document.getElementById('weather').innerHTML = html;
            });
    } else {
        const html = `Por favor ingrese el nombre de una ciudad`;
        document.getElementById('weather').innerHTML = html;
    }
};