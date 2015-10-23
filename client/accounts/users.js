Template.login_form.events({
    'click #sign-up': function(event, template) {
        var user;

        // Collect data and validate it.

        user = {
            username: template.find('#inputEmail').value,
            password: template.find('#inputPassword').value,
            email: template.find('#inputEmail').value,
        };

        // Post the user to the server for creation
        Accounts.createUser(user, function (error) {
            if (error) {
                var message = "There was an error signing up: <strong>" + error.reason + "</strong>";

                template.find('#form-messages').innerHtml = message;
            }
            return;
        });

        return false;
    }
});