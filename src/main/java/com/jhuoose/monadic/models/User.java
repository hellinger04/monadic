package com.jhuoose.monadic.models;


import com.jhuoose.monadic.models.lesson.Course;
import com.jhuoose.monadic.models.lesson.Lesson;
import com.jhuoose.monadic.models.lesson.element.LessonElement;
import com.jhuoose.monadic.models.lesson.element.Problem;

import java.util.HashMap;
import java.util.Map;

/* Class to represent a User for the Monadic service
 */
public class User {

    public static final int solvedProblemStatus = 2;
    public static final int unsolvedProblemStatus = 0;
    public static final String completedLessonStatus = "2";
    public static final String inProgressLessonStatus = "1";
    public static final String notStartedLessonStatus = "0";

    private String username;
    private String password;
    private HashMap<String, String> solutions;
    private HashMap<String, Integer> problemsCompleted;

    public User(String username, String password, HashMap<String, Integer> problemsCompleted, HashMap<String, String> solutions) {
        this.username = username;
        this.password = password;
        this.problemsCompleted = problemsCompleted;
        this.solutions = solutions;
    }

    public User(String username, String password) {
        this.username = username;
        this.password = password;
        this.problemsCompleted = new HashMap<>();
        this.solutions = new HashMap<>();

        for (int i = 0; i < Course.COURSE_SIZES.size(); i++) {
            for (int j = 0; j < Course.COURSE_SIZES.get(i); j++) {
                putProblemElems(problemsCompleted, solutions, new Lesson(i, j));
            }
        }
    }

    private void putProblemElems(HashMap<String, Integer> problemsCompleted, HashMap<String, String> solutions, Lesson lesson) {
        for (LessonElement le: lesson.getLessonElements()) {
            if (le.isProblem()) {
                Problem problemLE = (Problem) le;
                String problemKey = "c" + lesson.getCourseID() + "_l" + lesson.getID() + "_p" + problemLE.getID();
                problemsCompleted.put(problemKey, unsolvedProblemStatus);
                solutions.put(problemKey, problemLE.getStarterCode());
            }
        }
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public HashMap<String, String> getSolutions() {
        return solutions;
    }

    public HashMap<String, Integer> getProblemsCompleted() {
        return problemsCompleted;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setSolutions(HashMap<String, String> solutions) {
        this.solutions = solutions;
    }

    public void setProblemsCompleted(HashMap<String, Integer> problemsCompleted) {
        this.problemsCompleted = problemsCompleted;
    }

    private String getLessonStatus(Lesson lesson) {
        for (LessonElement le: lesson.getLessonElements()) {
            if (le.isProblem()) {
                Problem problemLE = (Problem) le;
                String problemKey = "c" + lesson.getCourseID() + "_l" + lesson.getID() + "_p" + problemLE.getID();
                int problemStatus = problemsCompleted.get(problemKey);
                if (problemStatus != solvedProblemStatus) return notStartedLessonStatus;
            }
        }
        return completedLessonStatus;
    }

    public HashMap<String, String> getUserStatus() {
        HashMap<String, String> lessonStatus = new HashMap<>();
        for (int i = 0; i < Course.COURSE_SIZES.size(); i++) {
            for (int j = 0; j < Course.COURSE_SIZES.get(i); j++) {
                lessonStatus.put("c" + i + "_l" + j, getLessonStatus(new Lesson(i, j)));
            }
        }
        return lessonStatus;
    }
}
