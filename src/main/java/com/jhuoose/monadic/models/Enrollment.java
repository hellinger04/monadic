package com.jhuoose.monadic.models;
import java.util.Map;

/* Class to represent
 */
public class Enrollment {

    Map<Course, Integer> courseList;
    Map<Problem, Answer> answers;

    public Enrollment() {
        courseList = CourseDirectory.getCourseList();
        answers = CourseDirectory.getProblemAnswers();
    }

    public int getCourseStatus(Course course) {
        return this.courseList.get(course);
    }

    public Answer getAnswer(Problem problem) {
        return answers.get(problem);
    }

    public void setCourseStatus(Course course, int status) {
        this.courseList.replace(course, status);
    }
}