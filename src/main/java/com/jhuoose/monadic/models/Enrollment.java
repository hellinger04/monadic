package com.jhuoose.monadic.models;
import java.util.Map;

/* Class to represent
 */
public class Enrollment {

    private Map<Course, Integer> courseList;
    private Map<Problem, StudentAnswer> answers;

    public Enrollment() {
        courseList = CourseDirectory.getCourseList();
        answers = CourseDirectory.getProblemAnswers();
    }

    public int getCourseStatus(Course course) {
        return this.courseList.get(course);
    }

    public StudentAnswer getAnswer(Problem problem) {
        return answers.get(problem);
    }

    public void setCourseStatus(Course course, int status) {
        this.courseList.replace(course, status);
    }
}