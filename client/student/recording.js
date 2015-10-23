/**
 * Created by tejasmehta on 15-10-21.
 */
Template.class_live.events({
    'click #tagNow': function (event, template) {
        var tag = Tags.insert({
            'user': Meteor.userId(),
            'class_id': Session.get('class'),
            'text': 'Important',
            'create_time': new Date()
        });
        Session.set('currentTag', tag);
        template.find('#tag-form').style.display = 'block';
        return false;
    },
    'click #create-tag': function (event, template) {
        var tag_id = Session.get('currentTag');
        var text = template.find('#tag').value;
        if (text != '') {
            Tags.update(tag_id, {
                $set: {text: text}
            });
            template.find('#tag').value = '';
        }
        template.find('#tag-form').style.display = 'none';
        return false;
    },
    'click #cancel-tag': function (event, template) {
        var tag_id = Session.get('currentTag');
        Tags.remove(tag_id);
        template.find('#tag').value = '';
        template.find('#tag-form').style.display = 'none';
        return false;
    },
});

Template.course_enrollment.events({
    'submit #course-password-form': function (event, template) {
        var course_id = template.find('#course_id').value;
        var password = template.find('#password').value;
        var course = Courses.findOne({_id: course_id});
        if (course.password == password) {
            Enrollments.insert({
                course_id: course._id,
                user_id: Meteor.userId()
            });
            Router.go('/dashboard/' + course_id);
        } else {
            template.find('#enrollment_error').innerHtml = 'Wrong Password';
        }
        return false;
    }
});