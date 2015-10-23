Template.body.events({
    'click a.logout': function() {
        Meteor.logout(function() {
            // Redirect to login
            Router.go('/');
        });

        return;
    }
});