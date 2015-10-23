/**
 * Created by tejasmehta on 15-10-20.
 */
Router.configure({
    layoutTemplate: 'Layout'
});

Router.onBeforeAction(function () {
    // all properties available in the route function
    // are also available here such as this.params

    if (!Meteor.userId()) {
        // if the user is not logged in, render the Login template
        this.render('login_form');
    } else {
        // otherwise don't hold up the rest of hooks or our route/action function
        // from running
        this.next();
    }
});

Router.configure({
    layoutTemplate: 'dashboard',
    waitOn: function () {
        return [
            Meteor.subscribe("courses"),
            Meteor.subscribe("enrollments"),
            Meteor.subscribe("classes"),
            Meteor.subscribe("tags")
        ];
    },
});

Router.route('/', function () {
    if (Meteor.user()) {
        Router.go('main');
    } else {
        this.render('login_form');
    }
});

Router.route('/dashboard', function () {
    this.render('courses', {
        data: function () {
            var enrollments = Enrollments.find({user_id: Meteor.userId()});
            var course_ids = enrollments.map(function (e) {
                return e.course_id
            });
            return {'courseList': Courses.find({_id: {$in: course_ids}})};
        }
    });
}, {'name': 'main'});

Router.route('/dashboard/:_id', function () {
    var params = this.params; // { _id: "5" }
    var id = params._id;
    var course = Courses.findOne({_id: id});
    var enrollment = Enrollments.findOne({user_id: Meteor.userId(), course_id: course._id});
    if (enrollment) {
        this.render('course-details', {
            data: function () {
                return {
                    course: course,
                    classList: Classes.find({course_id: course._id}, {sort: {live: -1, start_time: -1}})
                };
            }
        });
    } else {
        this.render('course_enrollment', {
            data: function () {
                return {
                    course: course,
                }
            }
        });
    }
}, {name: 'course.show'});

Router.route('/enrollment/', function () {
    this.render('enrollment', {
        data: {
            'courseList': Courses.find({}),
        }
    });
}, {name: 'enrollment.show'});


Router.route('/dashboard/class/:_class_id', function () {
    var params = this.params;
    var class_id = params._class_id;
    var _class = Classes.findOne({_id: class_id});
    if (_class.live) {
        Session.set('class', _class.id);
        this.render('class_live', {
            data: function () {
                return {
                    'class': _class,
                    tagList: Tags.find({user: Meteor.userId(), class_id: _class._id}, {sort: {create_time: -1}})
                };
            }
        });
    } else {
        this.render('class_review_2', {
            data: function () {
                return {
                    'class': _class,
                    tagList: Tags.find({
                        user: Meteor.userId(),
                        class_id: _class._id
                    }, {sort: {create_time: -1}}).map(function (item, index) {
                        item.index = index;
                        return item;
                    })
                };
            }
        });
    }
}, {name: 'class.show'});