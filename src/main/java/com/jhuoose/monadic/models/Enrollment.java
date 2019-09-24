package com.jhuoose.monadic.models;
import java.util.ArrayList;
import java.util.Map;

/* Class to represent
 */
public class Enrollment {

    private Map<Lesson, Integer> lessonList;
    private Map<Integer, StudentAnswer> answers;

    public Enrollment() {
        lessonList = EnrollmentMap.getLessonList();
        answers = new Map<Integer, StudentAnswer>;
    }

    /* 0 - lesson is unavailable
       1 - lesson is available and has not been taken
       2 - user is currently enrolled in lesson
       3 - user has completed lesson
     */

    public int getLessonStatus(Lesson lesson) {
        return this.lessonList.get(lesson);
    }

    public StudentAnswer getAnswer(int ID) {
        return answers.get(ID);
    }

    public void updateLessonStatus(Lesson lesson, int status) {
        this.lessonList.replace(lesson, status);
    }

    public void updateAllLessons(Lesson completedLesson) {
        // TODO use EnrollmentMap to update Lesson status in courseList Map
        EnrollmentMap.update(completedLesson);
    }

    public void updateAnswer(int ID, StudentAnswer studentAnswer) {
        this.answers.replace(ID, studentAnswer);
    }
}