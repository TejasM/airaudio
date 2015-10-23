Template.login_form.events({
    'click #login': function(event, template) {
        // 1. Collect the username and password from the form
        var username = template.find('#inputEmail').value,
            password = template.find('#inputPassword').value;

        // 2. Attempt to login.
        Meteor.loginWithPassword(username, password, function(error) {
            // 3. Handle the response
            if (Meteor.user()) {
                // Redirect the user to where they're loggin into. Here, Router.go uses
                // the iron:router package.
                Router.go('/dashboard');
            } else {
                // If no user resulted from the attempt, an error variable will be available
                // in this callback. We can output the error to the user here.
                var message = "There was an error logging in: <strong>" + error.reason + "</strong>";

                template.find('#form-messages').innerHtml = message;
            }

            return;
        });

        return false;
    }
});