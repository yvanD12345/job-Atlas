$(document).ready(function () {
    $.get("/userLogin", function (userLogin) {
        let code = '';
        if (userLogin == "true") {

            code += '<a class="me-2" href=/panier/:email>';
            code += '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-cart2"  viewBox="0 0 16 16" color="white">';
            code += '<path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l1.25 5h8.22l1.25-5H3.14zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" />';
            code += '</svg>';
            code += '</a>'
            code += '<a href="/Logout">';
            code += '<button type="button" class="btn btn-outline-light me-2">Deconnexion</button>';
            code += '</a>';
            code += '<a href="/mod_MDP">';
            code += '<button type="button" class="btn btn-warning me-2">Changer le mot de passe</button>';
            code += '</a>';
        } else {
            code += '<a href="/Login">';
            code += '<button type="button" class="btn btn-outline-light me-2">Connexion</button>';
            code += '</a>';
            //
            code += '<a href="/Login">';//to change
            //
            code += '<button type="button" class="btn btn-warning me-2">Inscription</button>';
            code += '</a>';
        }
        $('#login-logout').html(code);
    });
});